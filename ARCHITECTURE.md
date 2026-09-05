# Datacenter & Enterprise System Architecture Blueprint

This document defines the comprehensive engineering architecture, physical topology, network matrix, autonomous AI orchestration pipeline, storage subsystems, and enterprise defense-in-depth matrix powering the **Datacenter Enterprise Platform**.

---

## Table of Contents
1. [Physical & Virtual Hardware Topology](#1-physical--virtual-hardware-topology)
2. [Dual-Firewall Perimeter & Network Matrix](#2-dual-firewall-perimeter--network-matrix)
3. [Proxmox VE Enterprise Defense-in-Depth Firewall](#3-proxmox-ve-enterprise-defense-in-depth-firewall)
4. [Digital Forensics & Cyber Threat Intelligence](#4-digital-forensics--cyber-threat-intelligence)
5. [ELO AI Control Plane Architecture](#5-elo-ai-control-plane-architecture)
6. [LLM Fallback Chain](#6-llm-fallback-chain)
7. [Storage & ZFS Auto-Healing Architecture](#7-storage--zfs-auto-healing-architecture)
8. [Disaster Recovery & Blackout 10h+ SOP](#8-disaster-recovery--blackout-10h-sop)

---

## 1. Physical & Virtual Hardware Topology

```mermaid
graph TB
    subgraph NODE1["Node 1: Proxmox VE Hypervisor (192.168.1.132)"]
        PVE_HW["Intel Core i3-10100F · 12 GB RAM · GTX 1050 Ti · 512 GB SSD"]
        VM200["VM 200: OPNsense Perimeter Gateway (Zenarmor NGFW · AdGuard :3000 · Nginx Ingress)"]
        VM221["VM 221: FortiGate-VM Enterprise Core (FortiOS · DPI · ZTNA Microsegmentation)"]
        VM201["VM 201: Windows Server 2025 Datacenter (:3389 · Active Directory)"]
        VM202_220["VMs 202–220: Multi-OS Research Fleet (RHEL · BSDs · OpenStack · T-Pot · Wazuh · NixOS)"]
        LXC_STACK["15 Containerized Production LXCs (CT 100–114: Nextcloud, Immich, HA, Ollama)"]
    end

    subgraph NODE2["Node 2: Storage NAS (192.168.1.135)"]
        OMV_HW["ASUS X451MA Laptop · Intel Celeron N2830 · 2 GB RAM · 500 GB HDD"]
        OMV_APP["OpenMediaVault 7 · ZFS Datasets · NFS / SMB Shares · Rsync Target"]
    end

    subgraph CLOUD["Multi-Cloud Hybrid Mesh (AWS / GCP / VPS)"]
        AWS_VPC["AWS VPC (10.30.0.0/16 · Virtual Private Gateway)"]
        GCP_VPC["GCP VPC (10.200.0.0/16 · Cloud HA-VPN Router)"]
        WG_HUB["WireGuard Hybrid Transit Hub (10.50.0.0/24)"]
    end

    subgraph EDGE["IoT & Physical Edge Layer"]
        ESP_OFFICE["ESP32: Office Telemetry (BLE / mmWave)"]
        ESP_LIVING["ESP32: Living Room (BLE / mmWave)"]
        ESP_SERVER["ESP32: Rack Monitors (Temp / Humidity)"]
    end

    NODE1 <-->|"vmbr2 Transit (10.10.20.0/30) + BGP"| VM221
    NODE1 <-->|"1 Gbps Ethernet + Tailscale Mesh"| NODE2
    NODE1 <-->|"WireGuard Site-to-Site + IPsec VTI"| CLOUD
    EDGE -->|"MQTT Telemetry"| LXC_STACK
```

---

## 2. Dual-Firewall Perimeter & Network Matrix

The Datacenter implements a **Dual-Tier Perimeter Defense ("Firewall Sandwich")**:
- **Outer Perimeter (Ingress/Egress)**: **OPNsense Core (`192.168.1.134`)** terminates WAN, executes CrowdSec IPS, Zenarmor L7 application inspection, AdGuard Home DNS sinkhole, and Nginx reverse proxy.
- **Inter-Firewall Transit Network**: Dedicated isolated virtual bridge `vmbr2` (`10.10.20.0/30`) with BGP dynamic routing (OPNsense ASN 65000 $\leftrightarrow$ FortiGate ASN 65002) and IP SLA health probes.
- **Inner Enterprise Core (Microsegmentation)**: **FortiGate-VM (`192.168.1.136` / VM 221)** enforces Deep Packet Inspection (DPI), Antivirus filtering, and Zero-Trust segmentation between DMZ (`vmbr3`), Trusted Core (`vmbr4`), and Out-of-Band Management (`vmbr0`).

```mermaid
graph LR
    WAN["Internet Uplink"] --> OPNsense["OPNsense Perimeter (192.168.1.134 · CrowdSec · Zenarmor · Nginx)"]
    OPNsense -->|"Transit Link vmbr2 (10.10.20.0/30)"| FortiGate["FortiGate-VM Core (VM 221 · FortiOS · DPI & Microsegmentation)"]
    
    FortiGate --> DMZ["DMZ / Honeypot Segment (vmbr3 · 10.10.30.0/24)<br/>T-Pot · Security Onion · Wazuh"]
    FortiGate --> TRUSTED["Trusted Enterprise Core (vmbr4 · 10.10.40.0/24)<br/>Databases · Nextcloud · Active Directory"]
    FortiGate --> CLOUD_NET["Hybrid Cloud Transit (10.50.0.0/24)<br/>WireGuard · AWS/GCP IPsec VTI"]
    OPNsense --> MGMT["Out-of-Band Management (vmbr0 · 192.168.1.0/24)<br/>Proxmox VE (192.168.1.132) · OMV NAS (192.168.1.135)"]
```

---

## 3. Proxmox VE Enterprise Defense-in-Depth Firewall

The hypervisor runs an enterprise-grade, zero-trust Proxmox VE Firewall matrix active across all tiers:
- **Global Policy**: `policy_in: DROP`, `policy_out: ACCEPT`, `policy_forward: DROP`.
- **SYN-Flood Mitigation**: Hardware/kernel rate-limiting (`protection_synflood: 1`, burst 25, 10/sec).
- **TCP Flags Sanitization**: Dropping NULL scans, XMAS scans, SYN-FIN and SYN-RST evasion patterns.
- **Enterprise IPSets**:
  - `management-bastions`: Local admin subnets (`192.168.1.0/24`, `10.10.10.0/24`, `100.64.0.0/10`).
  - `cluster-nodes`: Authorized hypervisors and core gateway endpoints.
  - `bogon-networks`: Strict RFC 5735 / RFC 6598 unrouted blocklists.
  - `threat-blacklist`: Dynamic feed integrated with CrowdSec.
- **Security Groups**: `mgmt` (PVE 8006, SSH 22, SPICE 3121), `cluster` (Corosync 5404:5405/udp, migration 60000:60050), `telemetry` (Prometheus 9100, Process 9256, Loki 3100), `cloud` (WireGuard 51820, IPsec 500/4500).

---

## 4. Digital Forensics & Cyber Threat Intelligence Suite

Integrated directly into `cyber/`, the Datacenter hosts 10 real-world digital forensics investigations, malware triage frameworks, and threat intelligence toolkits:

### Case Studies & Research
1. **[`openid-mitm-phishing-forensics/`](./cyber/openid-mitm-phishing-forensics)**: Browser-in-the-Middle (BitM) attack analysis capturing Steam OpenID sessions with simulated popup windows.
2. **[`revolut-vishing-forensics/`](./cyber/revolut-vishing-forensics)**: Telephony fraud and international SIP spoofing investigation intercepting real-time 3D Secure SMS codes.
3. **[`task-scam-infrastructure-analysis/`](./cyber/task-scam-infrastructure-analysis)**: Cybercrime infrastructure tracking, leaky APIs, and USDT money laundering networks.
4. **[`tiktok-mrr-scam-infrastructure/`](./cyber/tiktok-mrr-scam-infrastructure)**: Social media deceptive subscription funnels and payment gateway abuse mechanisms.
5. **[`bgp-hijacking-crypto-forensics/`](./cyber/bgp-hijacking-crypto-forensics)**: In-depth forensic post-mortem of autonomous system AS-Path hijacking targeting crypto wallets.
6. **[`fido2-cookie-bypass-forensics/`](./cyber/fido2-cookie-bypass-forensics)**: Passkey/WebAuthn session token exfiltration forensics and mitigation analysis.
7. **[`ransomware-pre-execution-triage/`](./cyber/ransomware-pre-execution-triage)**: Endpoint DFIR memory and artifact triage before encryption payload detonation.
8. **[`subdomain-takeover-c2-forensics/`](./cyber/subdomain-takeover-c2-forensics)**: Dangling DNS and stale cloud resource takeover forensics used for stealth C2 hosting.
9. **[`supply-chain-poisoning-analysis/`](./cyber/supply-chain-poisoning-analysis)**: Dependency confusion and typosquatting vectors across modern package ecosystems.
10. **[`ctf/`](./cyber/ctf)**: Offensive security writeups, methodologies, and vulnerability exploit templates.

### Automated DFIR & TI Framework (`cyber/toolkit/`)
- **Analyzers**: Automated BitM detection (`aitm_detector.py`), SIP telephony fraud detection, task scam API dissection, malware deobfuscation.
- **Parsers & Engines**: EVTX Sysmon, MFT/Prefetch timeline parser, Volatility memory analyzer, YARA & Sigma rule matchers, STIX 2.1 threat feed exporters.
- **Validation**: Strict integrity verification (`verify_evidence_integrity.py`), Sigma/Suricata/YARA rule linters.


---

## 3. ELO AI Control Plane Architecture

The ELO engine coordinates autonomous reasoning, security gatekeeping, semantic retrieval, and physical actuation:

```mermaid
sequenceDiagram
    autonumber
    participant User as Operator (Web / macOS / Telegram)
    participant ELO as ELO Core Engine (FastAPI)
    participant Memory as pgvector Semantic Memory Store
    participant Router as Free-Tier Cascade Router
    participant Gatekeeper as Security Gatekeeper (L0–L3)
    participant Hardware as Homelab Target (Proxmox / OPNsense / HA)

    User->>ELO: Input Command ("Check cluster health & optimize RAM")
    ELO->>Memory: Search Semantic Context & User Preferences
    Memory-->>ELO: Return Top-K Vector Chunks (Cosine Similarity)
    ELO->>Router: Execute ReAct Reasoning Prompt with Context
    Router-->>ELO: Tool Selection (`proxmox_get_cluster_status`)
    ELO->>Gatekeeper: Request Clearance for Tool Execution
    Gatekeeper-->>ELO: L0 Clearance Granted (Immediate)
    ELO->>Hardware: Execute Query over Proxmox API
    Hardware-->>ELO: 200 OK — Telemetry Data
    ELO->>Router: Synthesize Final Response
    Router-->>User: Structured Markdown Status & Recommendations
```

---

## 4. LLM Fallback Chain

ELO implements an automated failover router across available LLM providers:

```mermaid
graph TD
    Request["Incoming AI Request"] --> T1["Tier 1: Google Gemini (Gemini 2.5 Flash)"]
    T1 -->|"Rate Limit / 429"| T2["Tier 2: Groq (Llama 3.3 70B)"]
    T2 -->|"Rate Limit / Quota"| T3["Tier 3: OpenRouter Hub"]
    T3 -->|"Offline / No WAN"| T4["Tier 4: Local Ollama (Apple M1)"]
    T4 -->|"Daemon Offline"| T5["Tier 5: Deterministic Fallback"]
```

---

## 5. Automation Agents

ELO delegates background operational tasks to modular scripts and agents:

1.  **SecOps Threat-Hunter Agent (`elo_core.agents.secops_agent`)**:
   - Correlates Wazuh XDR and Suricata NIDS event streams.
   - Automatically isolates brute-force attackers by injecting stateful blacklist rules on OPNsense (`192.168.1.134:8443`).
2.  **SysAdmin Optimizer Agent (`elo_core.agents.sysadmin_agent`)**:
   - Monitors cluster memory utilization across nodes.
   - Triggers Kernel Samepage Merging (KSM) deduplication and purges dangling container image caches.
3.  **Smart Home Energy Agent (`elo_core.agents.energy_agent`)**:
   - Interrogates Home Assistant (`192.168.1.10:8123`) power metrics.
   - Detects idle vampire power draws and orchestrates energy-saving schedules.
4.  **Predictive Health Storage Healer (`elo_core.self_healing.predictive`)**:
   - Analyzes SMART disk telemetry on Scrutiny (`192.168.1.18`).
   - Automatically creates ZFS safety snapshots on OpenMediaVault (`192.168.1.135`) before drive failure occurs.

---

## 6. Storage & ZFS Auto-Healing Architecture

### 3-2-1 Backup Strategy
- **3 Copies of Data**: Primary NVMe SSD + Local OMV ZFS Pool + Offsite encrypted backup.
- **2 Different Media Types**: Flash NVMe (Proxmox) + Magnetic SATA HDD (OpenMediaVault NAS).
- **1 Offsite Copy**: Encrypted Rclone synchronization to secondary object storage.

---

## 7. Disaster Recovery & Blackout 10h+ SOP

In the event of an extended utility power outage exceeding battery UPS limits:

1. **Phase 1 (Hour 0–2: Conservation)**:
   - Shutdown non-essential compute workloads (Frigate NVR, Jellyfin transcoding, Woodpecker CI).
   - Throttle CPU frequencies on Proxmox node.
2. **Phase 2 (Hour 2–8: Core Survival Mode)**:
   - Migrate essential networking (Pi-hole DNS, Tailscale relay) to ultra-low-power Apple M1 host.
   - Spin down OpenMediaVault mechanical drives.
3. **Phase 3 (Hour 8+: Clean Controlled Shutdown)**:
   - Flush PostgreSQL WAL logs and trigger database dumps.
   - Execute `zpool sync` and cleanly unmount ZFS datasets.
   - Dispatch final battery telemetry alert to Telegram.
