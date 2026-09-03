# Homelab & ELO System Architecture Blueprint

This document defines the comprehensive engineering architecture, physical topology, network matrix, autonomous AI orchestration pipeline, and storage subsystems powering the **Homelab & ELO Platform**.

---

## Table of Contents
1. [Physical & Virtual Hardware Topology](#1-physical--virtual-hardware-topology)
2. [Network Matrix & VLAN Architecture](#2-network-matrix--vlan-architecture)
3. [ELO AI Control Plane Architecture](#3-elo-ai-control-plane-architecture)
4. [LLM Fallback Chain](#4-llm-fallback-chain)
5. [Automation Agents](#5-automation-agents)
6. [Storage & ZFS Auto-Healing Architecture](#6-storage--zfs-auto-healing-architecture)
7. [Disaster Recovery & Blackout 10h+ SOP](#7-disaster-recovery--blackout-10h-sop)

---

## 1. Physical & Virtual Hardware Topology

```mermaid
graph TB
    subgraph NODE1["Node 1: Proxmox VE Hypervisor (192.168.1.132)"]
        PVE_HW["Intel Core i3-10100F · 12 GB RAM · GTX 1050 Ti · 512 GB SSD"]
        VM200["VM 200: OPNsense Virtual Gateway (:8443)"]
        VM201["VM 201: Windows Server 2025 (:3389)"]
        VM206["VM 206: macOS Monterey 12.7 (OpenCore KVM · /mac/EFI)"]
        VM207["VM 207: OpenIndiana Hipster (:22 · illumos ZFS)"]
        LXC_STACK["31 Containerized Microservices (Docker Compose)"]
    end

    subgraph NODE2["Node 2: Storage NAS (192.168.1.135)"]
        OMV_HW["ASUS X451MA Laptop · Intel Celeron N2830 · 2 GB RAM · 500 GB HDD"]
        OMV_APP["OpenMediaVault 7 · ZFS Datasets · NFS / SMB Shares · Rsync Target"]
    end

    subgraph NODE3["Node 3: Apple Silicon Host (192.168.1.133)"]
        M1_HW["Apple MacBook Air M1 · 8-Core ARM64 · 8 GB RAM · NVMe SSD"]
        ELO_ENGINE["ELO Control Plane (:8000) · Metal MPS Voice Engine · Local Ollama"]
        MACOS_APP["Native macOS Desktop App (.NET 10 DMG)"]
    end

    subgraph NODE4["Node 4: Kubernetes Worker (k8s-node-04)"]
        K8S_HW["AMD Athlon II X2 220 · 4 GB RAM · 80 GB SATA HDD"]
        K3S_AGENT["k3s-agent Worker Node · containerd CRI runtime"]
    end

    subgraph EDGE["IoT & Physical Edge Layer"]
        ESP_OFFICE["ESP32: Birou (BLE / mmWave)"]
        ESP_LIVING["ESP32: Living (BLE / mmWave)"]
        ESP_SERVER["ESP32: Server Room (Temp / Humidity)"]
    end

    NODE1 <-->|"1 Gbps Ethernet + Tailscale Mesh"| NODE2
    NODE1 <-->|"1 Gbps Ethernet + Wireguard"| NODE3
    NODE1 <-->|"1 Gbps Ethernet"| NODE4
    EDGE -->|"MQTT Telemetry"| LXC_STACK
    LXC_STACK <-->|"Control Plane Rest API"| ELO_ENGINE
```

---

## 2. Network Matrix & VLAN Architecture

```mermaid
graph LR
    WAN["Internet Uplink"] --> OPNsense["OPNsense Firewall (192.168.1.134:8443)"]

    OPNsense --> VLAN1["VLAN 1: Management (192.168.1.0/24)<br/>Proxmox VE · NAS · Switches · IPMI"]
    OPNsense --> VLAN10["VLAN 10: Ingress & Core (192.168.10.0/24)<br/>NPM Reverse Proxy · Authelia SSO · Pi-hole DNS"]
    OPNsense --> VLAN20["VLAN 20: Applications (192.168.20.0/24)<br/>Immich · Nextcloud · Vaultwarden · Grafana · ELO"]
    OPNsense --> VLAN30["VLAN 30: Kubernetes (192.168.30.0/24)<br/>k3s Cluster · FluxCD GitOps Engine"]
    OPNsense --> VLAN40["VLAN 40: IoT & Microcontrollers (192.168.40.0/24)<br/>ESP32 BLE/mmWave · Smart Relays"]
```

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
