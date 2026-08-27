# 🛡️ CyberLab Defense & Operations Wiki

Welcome to the **CyberLab Security Engineering & Threat Operations Knowledge Base**. This repository provides the technical specifications, detection rules, hardening standards, and incident response playbooks for the CyberLab security proving ground.

```mermaid
flowchart TB
    subgraph HYPERVISOR["Virtual Proving Ground (macOS UTM / Proxmox VE)"]
        direction TB

        CTRL["cyber-ctrl (192.168.64.2)
Ansible & Terraform Controller"]

        subgraph VLAN10["VLAN 10 — Hardened Production (192.168.64.0/28)"]
            NODE01["cyber-node01 (192.168.64.10)
Auditd FIM · SSH:2222 · Fail2ban · Promtail"]
        end

        subgraph VLAN20["VLAN 20 — DMZ & Honey Targets (192.168.64.16/28)"]
            NODE02["cyber-node02 (192.168.64.20)
Exposed Web Server · Suricata Mirror"]
        end

        subgraph VLAN30["VLAN 30 — SOC & SIEM Analytics (192.168.64.32/28)"]
            WAZUH["Wazuh Manager + Indexer
Endpoint Detection & XDR"]
            LOKI["Grafana Loki Engine
Centralized Syslog / Auditd"]
            NIDS["Suricata NIDS
Deep Packet Inspection"]
            AI["AI Threat Analyst Agent
MITRE ATT&CK Correlation"]
        end
    end

    CTRL -->|"SSH :2222 (Ed25519)"| NODE01 & NODE02
    NODE01 -->|"Promtail Shipping"| LOKI
    NODE02 -->|"Promtail Shipping"| LOKI
    NODE01 -.->|"XDR Agent (:1514)"| WAZUH
    NODE02 -.->|"Traffic Mirror"| NIDS
    LOKI -.->|"Log Ingestion"| AI
```

---

## 📑 Wiki Modules

1. **[[Network Topology & Segmentation|Network-Topology-and-Segmentation]]** — Zero-trust VLAN boundaries, routing rules, and controller access.
2. **[[SIEM & SOC Operations|SIEM-and-SOC-Operations]]** — Wazuh XDR deployment, Loki log aggregation, Promtail rules, and CyberChef.
3. **[[Hardening & CIS Compliance|Hardening-and-CIS-Compliance]]** — Host hardening roles, SSH cryptography, kernel sysctl parameters, and Auditd FIM.
4. **[[Offensive Security & Emulation|Offensive-Security-and-Emulation]]** — Atomic Red Team test execution, BloodHound AD attack graph analysis, and LinPEAS parsing.
5. **[[DFIR & Incident Response|DFIR-and-Incident-Response]]** — Live forensic triage collector, memory acquisition, Chainsaw event log analysis, and host quarantine.
6. **[[Static Analysis & DevSecOps|Static-Analysis-and-DevSecOps]]** — Semgrep SAST rules, Trivy vulnerability scans, and TruffleHog secrets detection.
7. **[[AI Threat Hunting Agent|AI-Threat-Hunting-Agent]]** — Automated log correlation, regex IOC extraction, and MITRE ATT&CK taxonomy classification.
