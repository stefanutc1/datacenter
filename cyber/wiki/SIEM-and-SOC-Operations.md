# SIEM & SOC Operations

## 1. Wazuh XDR Stack (`services/wazuh/`)

- **Wazuh Manager**: Ingests security alerts, performs active response, and assesses CIS benchmark compliance.
- **Wazuh Indexer**: Scalable OpenSearch-based indexer storing raw security events.
- **Wazuh Dashboard**: Security visualization console accessible at `https://localhost:443`.

## 2. Grafana Loki Telemetry Pipeline (`services/loki-grafana/`)

Promtail agents on all nodes stream logs to Grafana Loki:
- `/var/log/audit/audit.log` $	o$ Auditd FIM events.
- `/var/log/auth.log` $	o$ SSH logins, `sudo` elevation, authentication failures.
- `/var/log/syslog` $	o$ Kernel and daemon events.
- `/var/log/suricata/eve.json` $	o$ Suricata network intrusion alerts.

## 3. CyberChef Workbench (`services/cyberchef/`)

Forensic decoding platform running on `http://localhost:8088` for Base64, Hex, URL, XOR, and cryptographic decoding during artifact investigation.
