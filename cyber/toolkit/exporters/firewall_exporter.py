"""Firewall and perimeter defense rule exporter (OPNsense / IPTables)."""

from typing import List
from cyber.core.models import Indicator, IndicatorType

class FirewallExporter:
    """Generates firewall blocklists and IPTables commands from extracted indicators."""

    @staticmethod
    def generate_opnsense_table(indicators: List[Indicator]) -> str:
        ip_lines = []
        for ind in indicators:
            if ind.type == IndicatorType.IPV4:
                ip_lines.append(f"{ind.value}/32")
        return "\n".join(ip_lines)

    @staticmethod
    def generate_iptables_script(indicators: List[Indicator]) -> str:
        lines = [
            "#!/bin/sh",
            "# Automated Threat Actor Drop Rules",
            "iptables -N CYBER_IOC_DROP 2>/dev/null || true"
        ]
        for ind in indicators:
            if ind.type == IndicatorType.IPV4:
                lines.append(f"iptables -A CYBER_IOC_DROP -s {ind.value} -j DROP")
        lines.append("iptables -I INPUT -j CYBER_IOC_DROP")
        return "\n".join(lines)
