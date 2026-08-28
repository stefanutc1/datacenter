from __future__ import annotations
import inspect
from typing import Dict, Any, Callable, Optional, Awaitable, List
from elo_contracts.security import SecurityLevel
from elo_contracts.tools import ELOToolDefinition, ToolCallResult


class ToolRegistry:
    """
    Central registry for all tools in ELO.
    Enforces security level metadata and execution sandboxing.
    """

    def __init__(self):
        self._definitions: Dict[str, ELOToolDefinition] = {}
        self._handlers: Dict[str, Callable[..., Awaitable[Any]]] = {}

    def register(
        self,
        name: str,
        description: str,
        parameters_schema: Dict[str, Any],
        security_level: SecurityLevel,
        handler: Callable[..., Awaitable[Any]],
        domain: str = "system",
        timeout_seconds: int = 30,
    ) -> None:
        defn = ELOToolDefinition(
            name=name,
            description=description,
            parameters_schema=parameters_schema,
            security_level=security_level,
            domain=domain,
            timeout_seconds=timeout_seconds,
        )
        self._definitions[name] = defn
        self._handlers[name] = handler

    def get_definitions(self) -> List[Dict[str, Any]]:
        return [d.model_dump() for d in self._definitions.values()]

    def get_definition(self, name: str) -> Optional[ELOToolDefinition]:
        return self._definitions.get(name)

    async def execute(self, name: str, arguments: Dict[str, Any]) -> ToolCallResult:
        if name not in self._handlers:
            return ToolCallResult(
                call_id="",
                tool_name=name,
                success=False,
                error=f"Tool '{name}' is not registered in ELO registry.",
            )

        defn = self._definitions[name]
        handler = self._handlers[name]

        try:
            if inspect.iscoroutinefunction(handler):
                output = await handler(**arguments)
            else:
                output = handler(**arguments)

            return ToolCallResult(
                call_id="",
                tool_name=name,
                success=True,
                output=output,
                security_level_applied=defn.security_level,
            )
        except Exception as e:
            return ToolCallResult(
                call_id="",
                tool_name=name,
                success=False,
                error=str(e),
                security_level_applied=defn.security_level,
            )


from .telemetry import get_real_system_telemetry_async


# Built-in foundational tools for MVP verification
async def _builtin_proxmox_status(node: str = "pve-node-1") -> Dict[str, Any]:
    """Sample L0 Read-only tool fetching real host & cluster telemetry."""
    real_data = await get_real_system_telemetry_async()
    return {
        "node": node,
        "target_node": node,
        "hostname": real_data.get("hostname"),
        "status": "ONLINE",
        "uptime": real_data.get("uptime"),
        "cpu_usage_pct": real_data["cpu"]["usage_pct"],
        "host_cpu_pct": real_data["cpu"]["usage_pct"],
        "ram_usage_gb": real_data["ram"]["used_gb"],
        "host_ram_used_gb": real_data["ram"]["used_gb"],
        "ram_total_gb": real_data["ram"]["total_gb"],
        "host_ram_total_gb": real_data["ram"]["total_gb"],
        "cluster_nodes": real_data.get("nodes", []),
        "active_vms": [
            {"vmid": 100, "name": "opnsense-core", "status": "running", "ip": "192.168.10.1"},
            {"vmid": 101, "name": "erp-crm-academic", "status": "running", "ip": "192.168.20.15"},
            {"vmid": 102, "name": "home-assistant", "status": "running", "ip": "192.168.20.10"},
            {"vmid": 103, "name": "crowdsec-suricata", "status": "running", "ip": "192.168.10.5"},
        ],
    }


async def _builtin_proxmox_reboot_vm(vm_id: int, force: bool = False) -> Dict[str, Any]:
    """Sample L2 High-Impact tool that requires user confirmation."""
    return {
        "vmid": vm_id,
        "action": "reboot",
        "status": "SUCCESS",
        "message": f"VM {vm_id} reboot command dispatched successfully (force={force}).",
    }


async def _builtin_run_monte_carlo(iterations: int = 1000, scenario: str = "default") -> Dict[str, Any]:
    """Sample L0/L1 tool from academic ERP domain."""
    return {
        "scenario": scenario,
        "iterations": iterations,
        "expected_return_pct": 12.4,
        "value_at_risk_95": -4.2,
        "confidence_interval": [8.1, 16.7],
        "status": "COMPLETED",
    }


from .homelab_inventory import HOMELAB_SERVICES, HOMELAB_NODES


async def _builtin_homelab_query_service(query: str) -> Dict[str, Any]:
    """Sample L0 Read-only tool querying the Homelab service catalog."""
    q = query.lower().strip()
    matches = []
    for s in HOMELAB_SERVICES:
        if (
            q in s["name"].lower()
            or q in s["id"].lower()
            or q in s["category"].lower()
            or q in s["domain"].lower()
            or any(q in t.lower() for t in s.get("tags", []))
        ):
            matches.append(s)

    if not matches:
        return {
            "query": query,
            "found": False,
            "message": f"Nu am găsit niciun serviciu care să conțină '{query}'. Servicii disponibile: {len(HOMELAB_SERVICES)}",
            "available_services": [s["name"] for s in HOMELAB_SERVICES[:10]],
        }

    return {
        "query": query,
        "found": True,
        "count": len(matches),
        "results": matches,
    }


async def _builtin_send_phone_alert(
    message: str,
    severity: str = "high",
    phone_number: str = "",
) -> Dict[str, Any]:
    """Sends an emergency alert / SMS to the administrator's phone."""
    from .notifier import AlertDispatcher
    import os
    
    dispatcher = AlertDispatcher(
        phone_number=phone_number or os.getenv("ADMIN_PHONE_NUMBER"),
        twilio_account_sid=os.getenv("TWILIO_ACCOUNT_SID"),
        twilio_auth_token=os.getenv("TWILIO_AUTH_TOKEN"),
        twilio_from_number=os.getenv("TWILIO_FROM_NUMBER"),
        sms_webhook_url=os.getenv("SMS_WEBHOOK_URL"),
        telegram_bot_token=os.getenv("TELEGRAM_BOT_TOKEN"),
        telegram_chat_id=os.getenv("TELEGRAM_ADMIN_CHAT_ID"),
        ntfy_topic=os.getenv("NTFY_TOPIC", "elo-homelab-alerts"),
    )
    
    return await dispatcher.broadcast_incident(
        title="Homelab Alert",
        message=message,
        severity=severity,
        phone_number=phone_number or os.getenv("ADMIN_PHONE_NUMBER"),
    )


def create_default_registry() -> ToolRegistry:
    reg = ToolRegistry()
    
    # 1. Proxmox Status (L0 Read-Only)
    reg.register(
        name="proxmox_get_cluster_status",
        description="Fetches current real CPU, RAM, Disk and VM/LXC workload status from Proxmox VE cluster node.",
        parameters_schema={
            "type": "object",
            "properties": {
                "node": {"type": "string", "description": "Proxmox node name", "default": "pve-node-1"}
            },
        },
        security_level=SecurityLevel.L0_READ_ONLY,
        handler=_builtin_proxmox_status,
        domain="homelab",
    )

    # 2. Homelab Service Lookup (L0 Read-Only)
    reg.register(
        name="homelab_query_service",
        description="Queries the Homelab inventory for any service, container, port, domain, IP, or tags (e.g. Nextcloud, Immich, Vaultwarden, Pi-hole, n8n, Gitea, Jellyfin, OPNsense).",
        parameters_schema={
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Service name, port, tag, or domain to search for (e.g. 'immich', 'dns', 'photos', '8123')"}
            },
            "required": ["query"],
        },
        security_level=SecurityLevel.L0_READ_ONLY,
        handler=_builtin_homelab_query_service,
        domain="homelab",
    )

    # 3. Proxmox Reboot VM (L2 High-Impact -> Requires Approval)
    reg.register(
        name="proxmox_reboot_vm",
        description="Reboots a designated virtual machine or LXC container on Proxmox.",
        parameters_schema={
            "type": "object",
            "properties": {
                "vm_id": {"type": "integer", "description": "Target Virtual Machine ID (e.g. 101)"},
                "force": {"type": "boolean", "description": "Force shutdown if unresponsive", "default": False},
            },
            "required": ["vm_id"],
        },
        security_level=SecurityLevel.L2_HIGH_IMPACT,
        handler=_builtin_proxmox_reboot_vm,
        domain="homelab",
    )

    # 4. Monte Carlo Simulation (L0 Read-Only)
    reg.register(
        name="academic_monte_carlo_simulation",
        description="Runs a stochastic Monte Carlo financial risk simulation.",
        parameters_schema={
            "type": "object",
            "properties": {
                "iterations": {"type": "integer", "description": "Number of iterations", "default": 1000},
                "scenario": {"type": "string", "description": "Risk scenario name", "default": "default"},
            },
        },
        security_level=SecurityLevel.L0_READ_ONLY,
        handler=_builtin_run_monte_carlo,
        domain="business",
    )

    # 5. Send Phone Alert (L1 Audited Operation)
    reg.register(
        name="send_phone_alert",
        description="Dispatches an urgent SMS and mobile notification alert to the administrator's phone number when an incident, node failure, or security breach occurs.",
        parameters_schema={
            "type": "object",
            "properties": {
                "message": {"type": "string", "description": "Alert message describing the issue"},
                "severity": {"type": "string", "enum": ["low", "medium", "high", "critical"], "default": "high"},
                "phone_number": {"type": "string", "description": "Target phone number with country code (e.g. +407xxxxxxxx)", "default": ""},
            },
            "required": ["message"],
        },
        security_level=SecurityLevel.L1_LOW_WRITE,
        handler=_builtin_send_phone_alert,
        domain="security",
    )

    return reg
