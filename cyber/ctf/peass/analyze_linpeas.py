#!/usr/bin/env python3
"""LinPEAS privilege escalation output parser and severity classifier."""
from __future__ import annotations
import re
import sys

CRITICAL_PATTERNS = [
    (r"sudo.*NOPASSWD", "Sudo NOPASSWD privilege escalation vector"),
    (r"/bin/suid-shell.*4755", "World-executable SUID shell binary"),
    (r"Capabilities.*cap_setuid", "Privileged cap_setuid binary found"),
    (r"CRON.*root.*/tmp/", "Insecure root crontab script execution"),
]

def analyze_output(log_text: str) -> list[dict]:
    findings = []
    for pattern, description in CRITICAL_PATTERNS:
        matches = re.findall(pattern, log_text, re.MULTILINE)
        if matches:
            findings.append({"severity": "CRITICAL", "description": description, "count": len(matches)})
    return findings

if __name__ == "__main__":
    sample_text = "sudo -l: (root) NOPASSWD: /usr/bin/vim"
    print("LinPEAS parser test findings:", analyze_output(sample_text))
