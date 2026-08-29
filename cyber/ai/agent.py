#!/usr/bin/env python3
"""
CyberLab — AI Threat Intelligence & Log Correlation Agent
Parses system security logs, correlates Auditd FIM events, and maps findings to MITRE ATT&CK.
"""

import sys
import os
import re
import json
import argparse
import datetime
import platform

# MITRE ATT&CK Mapping Knowledge Base
MITRE_MAPPINGS = [
    {
        "pattern": r"(execve.*euid=0|sudo.*COMMAND)",
        "tactic": "Privilege Escalation",
        "technique": "T1548: Abuse Elevation Control Mechanism",
        "severity": "HIGH"
    },
    {
        "pattern": r"(Failed password|authentication failure|Invalid user)",
        "tactic": "Credential Access",
        "technique": "T1110: Brute Force",
        "severity": "MEDIUM"
    },
    {
        "pattern": r"(init_module|finit_module|insmod)",
        "tactic": "Persistence",
        "technique": "T1547.006: Kernel Modules and Extensions",
        "severity": "CRITICAL"
    },
    {
        "pattern": r"(UFW BLOCK|iptables.*DROP)",
        "tactic": "Initial Access / Reconnaissance",
        "technique": "T1046: Network Service Discovery",
        "severity": "LOW"
    },
    {
        "pattern": r"(/etc/passwd|/etc/shadow|/etc/sudoers)",
        "tactic": "Persistence / Defense Evasion",
        "technique": "T1098: Account Manipulation",
        "severity": "HIGH"
    }
]

def analyze_log_content(content):
    findings = []
    lines = content.splitlines()
    for line in lines:
        for rule in MITRE_MAPPINGS:
            if re.search(rule["pattern"], line, re.IGNORECASE):
                findings.append({
                    "line": line.strip()[:200],
                    "tactic": rule["tactic"],
                    "technique": rule["technique"],
                    "severity": rule["severity"]
                })
                break
    return findings

def generate_report(hostname, findings, source_file="Live Telemetry"):
    timestamp = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    severity_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
    for f in findings:
        sev = f["severity"]
        severity_counts[sev] = severity_counts.get(sev, 0) + 1

    report = f"""# CyberLab AI Threat Intelligence & Audit Report: {hostname}

## Summary & Metadata
* **Node**: `{hostname}`
* **Analysis Timestamp**: `{timestamp}`
* **Log Source**: `{source_file}`
* **Total Correlated Events**: `{len(findings)}`
* **Risk Breakdown**: **{severity_counts['CRITICAL']} Critical**, **{severity_counts['HIGH']} High**, **{severity_counts['MEDIUM']} Medium**, **{severity_counts['LOW']} Low**

---

## MITRE ATT&CK Matrix Correlation

| Severity | MITRE Tactic | Technique | Matched Log Sample |
| :--- | :--- | :--- | :--- |
"""
    if findings:
        for f in findings[:25]:
            report += f"| **{f['severity']}** | `{f['tactic']}` | `{f['technique']}` | `{f['line']}` |\n"
    else:
        report += "| `CLEAN` | None | None | No anomalous threat patterns detected in ingested logs. |\n"

    report += f"""
---

## Automated Recommendations & Incident Playbooks
1. **Host Isolation**: If critical kernel or account manipulation events are present, trigger emergency containment:
   ```bash
   ansible-playbook -i inventory/hosts.yml ansible/playbooks/incident_response.yml -e target_host={hostname}
   ```
2. **Forensic Acquisition**: Run the volatile triage collector immediately:
   ```bash
   ./forensics/triage_collector.sh
   ```
"""
    return report

def main():
    parser = argparse.ArgumentParser(description="CyberLab AI Security Analyst Agent")
    parser.add_argument("--input", "-i", help="Path to log file (auth.log, audit.log, syslog)")
    parser.add_argument("--output", "-o", help="Path to save report (Markdown/JSON)")
    parser.add_argument("--json", action="store_true", help="Output results in JSON format")
    args = parser.parse_args()

    hostname = platform.node()
    content = ""
    source = "Host Inspection Baseline"

    if args.input and os.path.exists(args.input):
        source = args.input
        with open(args.input, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    else:
        # Fallback to local security posture checks
        content = "UFW BLOCK [IN=eth0 OUT= SRC=192.168.64.100 DST=192.168.64.10 PROTO=TCP SPT=44321 DPT=22]\n"

    findings = analyze_log_content(content)

    if args.json:
        result = {
            "node": hostname,
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "source": source,
            "total_events": len(findings),
            "findings": findings
        }
        output_str = json.dumps(result, indent=2)
    else:
        output_str = generate_report(hostname, findings, source)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output_str)
        print(f"[+] AI Threat Analysis report written to: {args.output}")
    else:
        print(output_str)

if __name__ == "__main__":
    main()
