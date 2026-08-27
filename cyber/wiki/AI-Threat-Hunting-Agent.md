# 🤖 AI Threat Hunting Agent

CyberLab includes a native Python AI threat hunting and correlation engine under `ai/`:

## 1. `ai/agent.py` — Log Correlation & Threat Triage
- Parses raw authentication and syslog streams.
- Identifies brute-force patterns, anomalous `sudo` invocations, and unauthorized file access.
- Maps detected events to MITRE ATT&CK technique IDs (e.g. `T1110` Brute Force, `T1078` Valid Accounts).
- Outputs structured Markdown incident reports or JSON telemetry.

```bash
python3 ai/agent.py --input /var/log/auth.log --output incident-report.md
```

## 2. `ai/ioc_extractor.py` — Indicator of Compromise Parser
- Regex engine extracting IPv4/IPv6 addresses, fully qualified domain names (FQDNs), email addresses, and SHA-256 hashes from raw log files.

```bash
python3 ai/ioc_extractor.py /var/log/syslog --json
```
