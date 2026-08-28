import pytest
from httpx import AsyncClient, ASGITransport
from elo_contracts.security import SecurityLevel, ApprovalStatus
from elo_security.gatekeeper import SecurityGatekeeper
from elo_ai_client.mock_client import MockLLMClient
from elo_core.registry import create_default_registry
from elo_core.audit import AuditLogger
from elo_core.engine import ELOEngine
from elo_core.main import app


@pytest.mark.asyncio
async def test_tool_registry_execution():
    reg = create_default_registry()
    
    # Test L0 Proxmox status
    res = await reg.execute("proxmox_get_cluster_status", {"node": "pve-node-1"})
    assert res.success is True
    assert res.output["status"] == "ONLINE"
    assert res.output["cpu_usage_pct"] >= 0

    # Test L0 Monte Carlo
    res_mc = await reg.execute("academic_monte_carlo_simulation", {"iterations": 500})
    assert res_mc.success is True
    assert res_mc.output["status"] == "COMPLETED"


@pytest.mark.asyncio
async def test_engine_react_loop_l0_auto_execute():
    secret = "super_secure_test_key_123456789"
    gatekeeper = SecurityGatekeeper(secret_key=secret)
    audit = AuditLogger()
    registry = create_default_registry()
    llm = MockLLMClient()

    engine = ELOEngine(
        llm_router=llm,
        tool_registry=registry,
        gatekeeper=gatekeeper,
        audit_logger=audit,
    )

    # Ask for status (Mock will trigger proxmox_get_cluster_status)
    result = await engine.process_user_message("Starea la server?")
    
    assert result["status"] == "COMPLETED"
    assert len(result["tools_executed"]) == 1
    assert result["tools_executed"][0]["tool"] == "proxmox_get_cluster_status"
    assert result["tools_executed"][0]["success"] is True

    # Verify audit log was recorded
    logs = audit.get_recent_logs()
    assert len(logs) > 0
    assert logs[0].tool_name == "proxmox_get_cluster_status"


@pytest.mark.asyncio
async def test_engine_react_loop_l2_requires_approval():
    secret = "super_secure_test_key_123456789"
    gatekeeper = SecurityGatekeeper(secret_key=secret)
    audit = AuditLogger()
    registry = create_default_registry()
    llm = MockLLMClient()

    engine = ELOEngine(
        llm_router=llm,
        tool_registry=registry,
        gatekeeper=gatekeeper,
        audit_logger=audit,
    )

    # Ask for reboot (Mock will trigger proxmox_reboot_vm which is L2_HIGH_IMPACT)
    result = await engine.process_user_message("Restart VM 101 te rog")

    assert result["status"] == "AWAITING_APPROVAL"
    assert "approval_request" in result
    req = result["approval_request"]
    assert req["tool_name"] == "proxmox_reboot_vm"
    assert req["security_level"] == SecurityLevel.L2_HIGH_IMPACT.value
    assert req["status"] == ApprovalStatus.PENDING.value


@pytest.mark.asyncio
async def test_fastapi_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Test GET / (Unified Single Page AI Operating Layer)
        root_resp = await ac.get("/")
        assert root_resp.status_code == 200
        assert "ELO — Autonomous AI Operating Layer" in root_resp.text

        # Test /health
        resp = await ac.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ONLINE"
        assert data["system"] == "ELO Core"

        # Test /v1/telemetry (Real Hardware)
        telem_resp = await ac.get("/v1/telemetry")
        assert telem_resp.status_code == 200
        telem_data = telem_resp.json()
        assert "cpu" in telem_data
        assert "ram" in telem_data
        assert telem_data["ram"]["total_gb"] > 0

        # Test /v1/tools
        tools_resp = await ac.get("/v1/tools")
        assert tools_resp.status_code == 200
        tools_data = tools_resp.json()
        assert len(tools_data["tools"]) >= 3

        # Test /v1/chat with L0 action
        chat_resp = await ac.post("/v1/chat", json={"message": "Stare server"})
        assert chat_resp.status_code == 200
        chat_data = chat_resp.json()
        assert chat_data["status"] == "COMPLETED"

        # Test /v1/chat with L2 action -> Awaiting approval
        reboot_resp = await ac.post("/v1/chat", json={"message": "Restart container 101"})
        assert reboot_resp.status_code == 200
        reboot_data = reboot_resp.json()
        assert reboot_data["status"] == "AWAITING_APPROVAL"
        req_id = reboot_data["approval_request"]["id"]

        # Resolve approval via REST endpoint
        resolve_resp = await ac.post(
            f"/v1/approvals/{req_id}/resolve",
            json={"approved": True, "actor": "test_admin"}
        )
        assert resolve_resp.status_code == 200
        resolve_data = resolve_resp.json()
        assert resolve_data["status"] == "APPROVED"
        assert resolve_data["capability_token"] is not None
