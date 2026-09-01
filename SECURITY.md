# Homelab & ELO Security Policy & Threat Model

Welcome to the **Homelab & ELO (Enhanced Local Orchestrator)** Security Policy. This document defines the security architecture, threat model, cryptographic baselines, security clearance rings, vulnerability disclosure protocols, and incident containment runbooks for the entire infrastructure monorepo.

---

## Table of Contents
1. [Security Architecture & Zero-Trust Posture](#1-security-architecture--zero-trust-posture)
2. [Security Ring Clearance Model (L0–L3)](#2-security-ring-clearance-model-l0l3)
3. [Cryptographic Standards & Token Architecture](#3-cryptographic-standards--token-architecture)
4. [Shift-Left DevSecOps & Automated Verification](#4-shift-left-devsecops--automated-verification)
5. [Threat Model & STRIDE Analysis](#5-threat-model--stride-analysis)
6. [Active Defense & Incident Response Playbook](#6-active-defense--incident-response-playbook)
7. [Vulnerability Disclosure & Reporting Policy](#7-vulnerability-disclosure--reporting-policy)

---

## 1. Security Architecture & Zero-Trust Posture

The platform enforces a strict **Zero-Trust Network Architecture (ZTNA)**. No workload, virtual machine, or local endpoint is trusted implicitly, regardless of network locality.

```mermaid
graph TD
    subgraph WAN["Untrusted External Network (WAN)"]
        Attacker["Malicious Threat / Internet Traffic"]
    end

    subgraph EDGE["Perimeter & Edge Defense"]
        OPNsense["OPNsense Firewall (192.168.1.132:8443)"]
        CrowdSec["CrowdSec LAPI & Remediation Bouncer"]
        Suricata["Suricata NIDS Deep Packet Inspection"]
    end

    subgraph CORE["Ingress & Identity Layer (VLAN 10)"]
        NPM["Nginx Proxy Manager (SSL / TLS 1.3 Termination)"]
        Authelia["Authelia SSO & MFA Engine (TOTP / WebAuthn)"]
    end

    subgraph APP["Workloads & AI Control Plane (VLAN 20)"]
        ELO["ELO Autonomous Control Plane (192.168.1.133:8000)"]
        Gatekeeper["Security Gatekeeper (HMAC Signed Tokens)"]
        Services["Containerized Workloads (Immich, Vaultwarden, Grafana)"]
    end

    subgraph STORAGE["Storage & Backups Layer"]
        OMV["OpenMediaVault NAS (192.168.1.135)"]
        ZFS["ZFS Dataset Snapshots & Predictive Healer"]
    end

    WAN -->|Stateful Inspection| OPNsense
    OPNsense --> CrowdSec
    OPNsense --> Suricata
    OPNsense --> NPM
    NPM --> Authelia
    Authelia --> ELO
    ELO --> Gatekeeper
    Gatekeeper --> Services
    Services --> STORAGE
```

### Network Segmentation Matrix

| VLAN ID | Subnet | Security Zone | Ingress / Egress Rules |
| :---: | :--- | :--- | :--- |
| **VLAN 1** | `192.168.1.0/24` | **Management** | Hypervisors (`192.168.1.132`), IPMI, managed switches. Accessible strictly via physical console or Tailscale mesh admin. |
| **VLAN 10** | `192.168.10.0/24` | **Core & Ingress** | Reverse proxy, OPNsense, Authelia SSO, Pi-hole DNS sinkhole (`192.168.1.4`). No raw database access. |
| **VLAN 20** | `192.168.20.0/24` | **Applications** | Immich, Nextcloud, Vaultwarden, Grafana, ELO API. Inter-container traffic governed by Docker internal networks. |
| **VLAN 30** | `192.168.30.0/24` | **Kubernetes (K3s)** | Worker and control plane nodes. Pod CIDR: `10.42.0.0/16`. Network policies isolate namespaces. |
| **VLAN 40** | `192.168.40.0/24` | **IoT & ESP32** | Isolated edge sensors. Outbound WAN blocked; MQTT traffic allowed strictly to Home Assistant (`192.168.1.10:1883`). |

---

## 2. Security Ring Clearance Model (L0–L3)

Every tool and operational command exposed to ELO is bound to a strict **Security Level**:

```mermaid
flowchart TD
    subgraph RingModel["4-TIER SECURITY CLEARANCE & AUTHORIZATION MODEL (L0–L3)"]
        direction TB
        L0["🟢 LEVEL 0: L0_READ_ONLY (Immediate Execution)<br/>• System telemetry queries, SMART status checks, ping probes, log streams"]
        L1["🟡 LEVEL 1: L1_LOW_WRITE (Auto-Executed + HMAC Audit Trail)<br/>• Setting alert thresholds, temporary cache clearing, sensor presets"]
        L2["🟠 LEVEL 2: L2_HIGH_IMPACT (Interactive Admin Approval Required)<br/>• Proxmox VM/LXC start/stop/reboot, OPNsense firewall IP ban<br/>• Instant Telegram Bot notification with Approve / Reject actions"]
        L3["🔴 LEVEL 3: L3_CRITICAL (Strict 2FA / Break-Glass Challenge)<br/>• Database drop, ZFS pool destroy, irreversible storage purge<br/>• Time-based cryptographic challenge token authorization (TOTP / FIDO2)"]
    end

    L0 --> L1 --> L2 --> L3
```

---

## 3. Cryptographic Standards & Token Architecture

### 1. Capability Tokens
- **Algorithm**: `HMAC-SHA256` computed over `action_name:target_resource:timestamp:nonce`.
- **TTL**: Strict 300-second expiration window to prevent replay attacks.
- **Verification**: Zero external database dependency for cryptographic validation.

### 2. Transport & Key Standards
- **TLS**: Enforce strictly **TLS 1.3** and **TLS 1.2** with strong ciphers (`TLS_AES_256_GCM_SHA384`, `ECDHE-ECDSA-AES256-GCM-SHA384`).
- **SSH Keys**: Pure **Ed25519** (`256-bit`) or **RSA** ($\ge 4096\text{-bit}$). Password authentication is disabled across all nodes.
- **ZFS Encryption**: Storage pools use `AES-256-GCM` native dataset encryption with off-host key escrow.

---

## 4. Shift-Left DevSecOps & Automated Verification

Every commit pushed to the monorepo is audited across multiple automated security layers before merge:

1. **Gitleaks & TruffleHog**: Scans full git commit history for leaked API keys, tokens, or private certificates.
2. **Bandit AST Scanner**: Static Python Abstract Syntax Tree analysis checking for SQL injection, insecure deserialization, and unsafe shell subprocess executions.
3. **Semgrep SAST**: Semantic security checks across IaC templates, configuration playbooks, and Python sources.
4. **Trivy Vulnerability Scanner**: Automated CVE scanning across container images, OS base layers, and package dependencies.
5. **ShellCheck-Py**: Portability and dangerous parameter expansion analysis across all automation scripts.

---

## 5. Threat Model & STRIDE Analysis

| STRIDE Category | Potential Threat | Homelab Mitigation Control |
| :--- | :--- | :--- |
| **Spoofing** | Unauthorized entity attempting ELO command execution. | HMAC capability tokens with dynamic nonces + Telegram Bot biometric approval. |
| **Tampering** | Modification of infrastructure state or log tampering. | Write-once append-only SQLite/PostgreSQL audit logs + ZFS read-only snapshots. |
| **Repudiation** | Operator denying execution of destructive action. | Cryptographic audit trail logging IP, actor, timestamp, and token signature. |
| **Information Disclosure** | Leak of API keys or container credentials. | `.env` files strictly gitignored + Gitleaks/TruffleHog CI verification + Docker secrets. |
| **Denial of Service** | LLM API quota exhaustion or network brute-force. | Zero-latency failover cascade (Gemini $\to$ Groq $\to$ OpenRouter $\to$ Ollama) + CrowdSec bouncer. |
| **Elevation of Privilege** | Sub-agent attempting out-of-band L3 action. | Gatekeeper strictly intercepts tool execution; cannot be bypassed by prompt injection. |

---

## 6. Active Defense & Incident Response Playbook

### Automated Threat Containment Flow
```mermaid
sequenceDiagram
    autonumber
    participant Suricata as Suricata NIDS / Wazuh SIEM
    participant SecOps as ELO SecOps Threat-Hunter
    participant Gatekeeper as Security Gatekeeper
    participant OPNsense as OPNsense Gateway (192.168.1.132:8443)
    participant Admin as Telegram Administrator

    Suricata->>SecOps: Detects SSH Brute-Force from Malicious IP
    SecOps->>Gatekeeper: Request L2 Tool `opnsense_block_ip(ip)`
    Gatekeeper->>Admin: Dispatch Telegram Approval Request
    Admin->>Gatekeeper: Click [Approve]
    Gatekeeper->>OPNsense: Inject Stateful IP Blacklist Rule
    OPNsense-->>SecOps: 200 OK — IP Quarantined
    SecOps->>Admin: Send Incident Response Report (Markdown)
```

### Emergency Host Isolation (Break-Glass)
In the event of an active compromise on any virtual machine:
```bash
# Instant network isolation via Ansible playbook
ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/incident_response.yml -e target_host=<COMPROMISED_HOST>
```

---

## 7. Vulnerability Disclosure & Reporting Policy

We welcome responsible security research. If you discover a security vulnerability within this repository:

1. **Do NOT open a public GitHub issue.**
2. Report the vulnerability privately via **GitHub Private Vulnerability Reporting** or email the maintainer directly at `stefanutc1@users.noreply.github.com`.
3. Provide a detailed Proof of Concept (PoC) and remediation steps.
4. **Response SLAs**:
   - **Initial Acknowledgement**: Within 24 hours.
   - **Triage & Classification**: Within 48 hours.
   - **Fix Release & Advisory**: Within 7 days for High/Critical issues.
