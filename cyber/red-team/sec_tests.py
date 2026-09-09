#!/usr/bin/env python3
"""
==============================================================================
SECURITY TEST SUITE
==============================================================================
Runs non-destructive validation of detection rules and telemetry ingestion in
Wazuh SIEM, CrowdSec, and Suricata IDS.
==============================================================================
"""

import sys
import time
import json
import base64
import socket
import platform
import subprocess
from typing import Dict, List, Any

TECHNIQUES = [
    {
        "id": "T1082",
        "name": "System Information Discovery",
        "tactic": "Discovery",
        "command": ["uname", "-a"],
        "expected_telemetry": "Auditd / Wazuh command execution log",
    },
    {
        "id": "T1059.004",
        "name": "Unix Shell Encoded Execution",
        "tactic": "Execution",
        "payload": "ZWNobyAiW1RFU1RdIFNlY3VyaXR5IGF1ZGl0IHBheWxvYWQgdGVzdCI=",
        "expected_telemetry": "Wazuh Rule 80710 (Base64 decoded command stream)",
    },
    {
        "id": "T1552.001",
        "name": "Credentials In Files (Canary Search)",
        "tactic": "Credential Access",
        "search_pattern": "canary_token_*.txt",
        "expected_telemetry": "File Integrity Monitoring (FIM) / Syscheck alert",
    },
    {
        "id": "T1046",
        "name": "Network Service Discovery",
        "tactic": "Discovery",
        "ports": [22, 80, 443, 6443, 9000],
        "expected_telemetry": "CrowdSec portscan bouncer / Suricata scan alert",
    },
]


class SecTestsRunner:
    def __init__(self, target_host: str = "127.0.0.1", dry_run: bool = False):
        self.target_host = target_host
        self.dry_run = dry_run
        self.results: List[Dict[str, Any]] = []

    def run_technique(self, tech: Dict[str, Any]) -> Dict[str, Any]:
        tech_id = tech["id"]
        name = tech["name"]
        tactic = tech["tactic"]
        print(f"\n[*] Executing {tech_id}: {name} [{tactic}]...")

        start_time = time.time()
        status = "EXECUTED"
        details = ""

        try:
            if tech_id == "T1082":
                try:
                    res = subprocess.run(tech["command"], capture_output=True, text=True, timeout=5)
                    details = res.stdout.strip()[:100]
                except Exception:
                    details = f"{platform.system()} {platform.release()} {platform.machine()}"

            elif tech_id == "T1059.004":
                raw_cmd = base64.b64decode(tech["payload"]).decode("utf-8")
                res = subprocess.run(raw_cmd, shell=True, capture_output=True, text=True, timeout=5)
                details = f"Decoded payload executed: {res.stdout.strip()}"

            elif tech_id == "T1552.001":
                details = "Simulated credential file access on canary tokens."

            elif tech_id == "T1046":
                open_ports = []
                for p in tech["ports"]:
                    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                        s.settimeout(0.3)
                        if s.connect_ex((self.target_host, p)) == 0:
                            open_ports.append(p)
                details = f"Scanned {len(tech['ports'])} ports on {self.target_host}. Open: {open_ports}"

        except Exception as e:
            status = "FAILED"
            details = str(e)

        elapsed = round(time.time() - start_time, 3)
        print(f"    Status: {status} in {elapsed}s")
        print(f"    Telemetry Expected: {tech['expected_telemetry']}")
        print(f"    Result: {details}")

        record = {
            "technique_id": tech_id,
            "technique_name": name,
            "tactic": tactic,
            "status": status,
            "duration_sec": elapsed,
            "details": details,
            "expected_rule": tech["expected_telemetry"],
        }
        self.results.append(record)
        return record

    def run_all(self):
        print("=" * 70)
        print(f"  SECURITY DETECTION TESTS (Target: {self.target_host})")
        print("=" * 70)
        for tech in TECHNIQUES:
            self.run_technique(tech)
        print("=" * 70)
        print(f"[OK] Completed {len(self.results)} security verification tests.")
        print("[OK] Correlate events in Wazuh SIEM Dashboard and CrowdSec Decisions.")


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else "127.0.0.1"
    runner = SecTestsRunner(target_host=target)
    runner.run_all()
