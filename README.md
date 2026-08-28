<div align="center">

# Homelab

[![CI Validation](https://github.com/stefanutc1/homelab/actions/workflows/ci.yml/badge.svg)](https://github.com/stefanutc1/homelab/actions/workflows/ci.yml)
[![CD Deployment](https://github.com/stefanutc1/homelab/actions/workflows/cd.yml/badge.svg)](https://github.com/stefanutc1/homelab/actions/workflows/cd.yml)
[![Infrastructure](https://img.shields.io/badge/Infrastructure-Proxmox%20%7C%20OMV%20%7C%20Apple%20Silicon-blue?style=flat&logo=proxmox)](https://github.com/stefanutc1/homelab)
[![ELO Control Plane](https://img.shields.io/badge/ELO%20Core-Python%203.12%20%7C%20FastAPI%20%7C%20ReAct-emerald?style=flat&logo=fastapi)](https://github.com/stefanutc1/homelab/tree/main/elo)
[![Desktop App](https://img.shields.io/badge/ELO%20Desktop-C%23%20.NET%2010%20%7C%20macOS%20ARM64-purple?style=flat&logo=dotnet)](https://github.com/stefanutc1/homelab/tree/main/elo/apps/elo-desktop-macos)
[![Security Baseline](https://img.shields.io/badge/Compliance-CIS%20Level%201%20Hardened-green?style=flat&logo=ansible)](https://github.com/stefanutc1/homelab/tree/main/ansible)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat)](LICENSE)


<!-- AUTO-METRICS-START -->
[![Active Workloads](https://img.shields.io/badge/Workloads-31%20Services-blue?style=flat&logo=docker)](https://github.com/stefanutc1/homelab#workload-catalog--pinned-favorites)
[![Automated Tests](https://img.shields.io/badge/Tests-28%20Passed%20(100%25)-brightgreen?style=flat&logo=pytest)](https://github.com/stefanutc1/homelab/actions/workflows/ci.yml)
[![ELO Tools](https://img.shields.io/badge/ELO%20Tools-19%20Active-orange?style=flat&logo=fastapi)](https://github.com/stefanutc1/homelab/tree/main/elo)
[![Last Sync](https://img.shields.io/badge/Last%20Auto--Sync-2026--08--28-informational?style=flat&logo=githubactions)](https://github.com/stefanutc1/homelab/actions)
<!-- AUTO-METRICS-END -->
</div>

Production-grade, declarative homelab monorepo and autonomous infrastructure control plane. Integrates bare-metal Apple Silicon compute, Proxmox VE virtualization, OpenMediaVault storage, stateful OPNsense network segmentation, cyber defense proving grounds (SOC/SIEM/DFIR), and the **ELO Control Plane** for real-time orchestration, telemetry, and automated self-healing.

---

## 📑 Table of Contents

1. [Architecture Overview](#-architecture-overview)
2. [Physical & Logical Node Map](#-physical--logical-node-map)
3. [Network Topology & VLAN Architecture](#-network-topology--vlan-architecture)
4. [Workload Catalog & Pinned Favorites](#-workload-catalog--pinned-favorites)
5. [ELO Control Plane & Orchestration Engine](#-elo-control-plane--orchestration-engine)
6. [Antigravity Model Context Protocol Server (ai/)](#-antigravity-model-context-protocol-server-ai)
7. [Native macOS Desktop Application (.NET 10)](#-native-macos-desktop-application-net-10)
8. [Infrastructure as Code & Configuration Management](#-infrastructure-as-code--configuration-management)
9. [Cyber Proving Ground & SOC/SIEM Operations](#-cyber-proving-ground--socsiem-operations)
10. [CI/CD Pipelines & Quality Gates](#-cicd-pipelines--quality-gates)
11. [Repository Monorepo Layout](#-repository-monorepo-layout)
12. [Operations & Runbook](#-operations--runbook)

---

## 🏛️ Architecture Overview

```mermaid
flowchart TB
    subgraph ComputeNodes["Physical & Virtual Compute Layer"]
        M1["Apple M1 Host (192.168.1.133)<br/>MacBook-Air.local • ELO Daemon • Metal MPS"]
        PVE["Proxmox VE (192.168.1.132)<br/>Core KVM/LXC Hypervisor"]
        NAS["OpenMediaVault NAS (192.168.1.135)<br/>ZFS Pools • NFS/SMB Storage • Backups"]
    end

    subgraph VirtualLayer["Proxmox Virtual Machines & Containers"]
        VM200["VM 200: OPNsense Gateway (192.168.1.132:8443)<br/>Routing • Firewall • WireGuard • Suricata"]
        VM201["VM 201: Alpine Microservices (192.168.1.202)<br/>Cloud-Init • Lightweight Microservices"]
        LXC["LXC Container Fleet<br/>Home Assistant • Immich • Vaultwarden • Grafana"]
    end

    subgraph ELOSubsystem["ELO Orchestration & Control Plane"]
        WebDesktop["Web UI & C# .NET 10 Desktop App (ELO.app)"]
        ReActEngine["ReAct Orchestration Engine & Security Gatekeeper"]
        Watchdog["Self-Healing Watchdog (30s TCP Socket Prober)"]
        Cascade["Tiered Failover Cascade<br/>Gemini ➔ OpenRouter ➔ OpenAI ➔ Claude ➔ Ollama ➔ Mock"]
    end

    M1 -->|IPC / HTTP| ReActEngine
    WebDesktop -->|REST API :8000 / WebSockets| ReActEngine
    ReActEngine --> Cascade
    ReActEngine -->|REST API :8006| PVE
    ReActEngine -->|REST/WS :8123| LXC
    ReActEngine -->|Firewall API :8443| VM200
    Watchdog -->|Concurrent TCP Sockets| ComputeNodes
    Watchdog -->|Concurrent TCP Sockets| LXC
    PVE --> VM200
    PVE --> VM201
    PVE --> LXC
```

---

## 🖥️ Physical & Logical Node Map

| Node Identifier | Hostname / IP | Hardware & Specs | Primary Roles & Workloads | Reachability & Probing |
|:---|:---|:---|:---|:---|
| **`apple-m1-compute`** | `MacBook-Air.local`<br/>`192.168.1.133` | Apple Silicon M1 • 8-Core ARM64 • 8GB Unified • Metal GPU | Local Host, ELO FastAPI Daemon, Local LLM Inference, C# .NET Native App Host | Active Local Runtime • `0.1ms` |
| **`pve-node-1`** | `pve.lan`<br/>`192.168.1.132` | Bare-Metal x86_64 Server • Proxmox VE 8/9 Kernel | Hypervisor Host, KVM Virtual Machines, LXC Container Fleet, QEMU Agents | TCP Probe: `:8006`, `:22`, `:9100` |
| **`openmediavault-nas`**| `nas.lan`<br/>`192.168.1.135` | Dedicated NAS Storage Appliance • Debian Linux | ZFS Mirrored Pools, SMB/NFS Shares, BorgBackup Repository, Scrutiny SMART | TCP Probe: `:80`, `:445`, `:22`, `:9100` |

---

## 🌐 Network Topology & VLAN Architecture

```mermaid
graph TD
    WAN["WAN Uplink (ISP Modem / ONT)"] -->|WAN Interface| OPN["OPNsense Stateful Firewall & Router<br/>(192.168.1.132:8443 / 192.168.10.1)"]

    OPN -->|VLAN 10: Management| V10["VLAN 10 — Management (192.168.10.0/24)<br/>Proxmox VE Host, NAS WebUI, OPNsense WebGUI, Switch Admin"]
    OPN -->|VLAN 20: Services| V20["VLAN 20 — Services & Core Workloads (192.168.20.0/24)<br/>Home Assistant, Immich, Vaultwarden, Grafana, Nginx Proxy Manager"]
    OPN -->|VLAN 30: Cyber Lab| V30["VLAN 30 — Cyber Proving Ground (192.168.30.0/24)<br/>Wazuh SIEM, Suricata NIDS, CTF Sandbox, Isolated Malware Analysis"]
    OPN -->|VLAN 40: DMZ| V40["VLAN 40 — DMZ & Public Ingress (192.168.40.0/24)<br/>Cloudflare Tunnels, Ingress Reverse Proxy, Public Web Hooks"]
    OPN -->|VLAN 50: IoT & Home| V50["VLAN 50 — Smart Home & IoT (192.168.50.0/24)<br/>ESP32 Microcontrollers, Zigbee/Z-Wave Bridges, Shelly Relays"]
```

### Security Zone Inter-VLAN Matrix

* **VLAN 10 (Management)**: Strictly isolated. Accessible only from authenticated management devices or via WireGuard VPN with multi-factor authentication.
* **VLAN 20 (Services)**: Standard application layer. Traversed through Nginx Proxy Manager with Authelia 2FA and CrowdSec validation.
* **VLAN 30 (Cyber Lab)**: Total outbound egress restriction. Sandboxed network environment with isolated routing tables for threat simulation.
* **VLAN 50 (IoT)**: Strict deny-all WAN access with pinhole exceptions for NTP and Home Assistant MQTT (:1883).

---

## 📦 Workload Catalog & Pinned Favorites

The cluster orchestrates 28 production services. All reachability checks are performed by direct raw TCP socket verification (`IP:PORT`) in parallel via `asyncio.gather`.

### ★ Pinned Primary Services

| Service | Category | Direct Address | Domain | Description |
|:---|:---|:---|:---|:---|
| **Home Assistant Core** | Smart Home & IoT | `192.168.1.10:8123` | `ha.lan` | Central home automation platform integrating ESP32 nodes, Zigbee sensors, Shelly relays, and climate scripts. |
| **Immich Photos & Video** | Storage & Cloud | `192.168.1.15:2283` | `immich.lan` | Self-hosted photo/video backup and gallery solution with on-premise AI facial recognition and CLIP semantic search. |
| **Vaultwarden Vault** | Security & Identity | `192.168.1.16:8080` | `vaultwarden.lan`| Lightweight Rust implementation of Bitwarden backend providing zero-knowledge credential and TOTP vault storage. |
| **Grafana Telemetry** | Observability & Logs| `192.168.1.11:3000` | `grafana.lan` | Central observability dashboards rendering Prometheus metrics, Proxmox hypervisor metrics, and Loki log streams. |

### Complete Service Inventory (24 Workloads)

| # | Service Name | Category | Direct Address | Domain | Purpose & Functionality |
|:--|:---|:---|:---|:---|:---|
| 1 | **Nginx Proxy Manager** | Ingress & Networking | `192.168.1.3:81` | `npm.lan` | Reverse proxy and SSL certificate manager with Let's Encrypt automation. |
| 2 | **Pi-hole DNS** | Ingress & Networking | `192.168.1.4:8080` | `pihole.lan` | Network-wide ad blocking, DNS sinkhole, and custom local `.lan` zone resolver. |
| 3 | **Nextcloud Hub** | Storage & Cloud | `192.168.1.8:80` | `nextcloud.lan` | Collaborative productivity platform with file sync, calendar, and WebDAV endpoints. |
| 4 | **Prometheus TSDB** | Observability & Logs| `192.168.1.11:9090` | `prometheus.lan`| Time-series database scraping node_exporter, cAdvisor, and system metrics. |
| 5 | **Grafana Loki** | Observability & Logs| `192.168.1.11:3100` | `loki.lan` | Multi-tenant log aggregation engine collecting logs across all Docker containers. |
| 6 | **Uptime Kuma** | Observability & Logs| `192.168.1.7:3001` | `status.lan` | Uptime monitor checking HTTP/TCP endpoints with incident escalation alerts. |
| 7 | **n8n Workflow Automation**| Automation & Workflow| `192.168.1.13:5678` | `n8n.lan` | Low-code workflow automation orchestrating webhooks, cron jobs, and alerts. |
| 8 | **Gitea Forge** | DevOps & CI/CD | `192.168.1.17:3000` | `git.lan` | On-premise self-hosted Git repository server with SSH keys and OAuth2. |
| 9 | **Woodpecker CI** | DevOps & CI/CD | `192.168.1.14:8000` | `ci.lan` | Container-native continuous integration engine executing automated test pipelines. |
| 10| **Authelia 2FA / SSO** | Security & Identity | `192.168.1.20:9091` | `auth.lan` | Multi-factor authentication provider protecting ingress proxy paths with TOTP/Duo. |
| 11| **CrowdSec Defense** | Security & Identity | `192.168.1.9:8080` | `crowdsec.lan` | Collaborative cyber defense engine parsing server logs to ban malicious IPs. |
| 12| **Jellyfin Media Server**| Media & Streaming | `192.168.1.21:8096` | `jellyfin.lan` | Open-source media streaming system with hardware-accelerated transcoding. |
| 13| **Radarr** | Media & Streaming | `192.168.1.21:7878` | `radarr.lan` | Automated movie collection manager and torrent/Usenet integration layer. |
| 14| **Sonarr** | Media & Streaming | `192.168.1.21:8989` | `sonarr.lan` | Smart TV series tracking and automated download grabber. |
| 15| **Prowlarr** | Media & Streaming | `192.168.1.21:9696` | `prowlarr.lan` | Torrent indexer and Usenet proxy aggregator syncing with Sonarr/Radarr. |
| 16| **Bazarr** | Media & Streaming | `192.168.1.21:6767` | `bazarr.lan` | Automated multilingual subtitle manager and synchronization tool. |
| 17| **qBittorrent Client** | Media & Streaming | `192.168.1.21:8080` | `qbittorrent.lan`| BitTorrent client with WebUI, bandwidth scheduler, and categories. |
| 18| **Actual Budget** | Productivity & Notes| `192.168.1.22:5006` | `actualbudget.lan`| Zero-based envelope budgeting app with end-to-end encrypted sync. |
| 19| **ChangeDetection.io** | Automation & Workflow| `192.168.1.24:5000` | `changedetection.lan`| Automated website change and DOM diff detection with restock alerts. |
| 20| **Trilium Notes** | Productivity & Notes| `192.168.1.19:8080` | `trilium.lan` | Hierarchical note-taking app with markdown editor and revision tracking. |
| 21| **Scrutiny SMART** | Storage & Cloud | `192.168.1.18:8080` | `scrutiny.lan` | Hard drive health monitor tracking SMART attributes and disk degradation. |
| 22| **IT-Tools** | Productivity & Notes| `192.168.1.12:80` | `it-tools.lan` | Handy collection of developer utilities (encoders, JWT decoders, hashers). |
| 23| **OPNsense Core (VM 200)**| Virtual Machines (VM)| `192.168.1.132:8443`| `opnsense.lan` | Virtualized firewall and router appliance running on Proxmox VE. |
| 24| **Alpine Server (VM 201)**| Virtual Machines (VM)| `192.168.1.202:22` | `alpine.lan` | Cloud-init Alpine Linux v3.21 virtual machine consuming < 60 MB RAM. |

---

## 🧠 ELO Control Plane & Orchestration Engine

ELO (`elo/`) is a modular control plane designed to unify infrastructure management, telemetry, and automated remediation under a centralized runtime.

```
elo/
├── packages/
│   ├── elo-contracts/         # Pydantic v2 schemas: SecurityLevel (L0-L3), Tools, Events
│   ├── elo-security/          # Zero-trust Gatekeeper, HMAC Capability Tokens, Approval Queues
│   └── elo-ai-client/         # Multi-provider cascade client (Gemini, OpenRouter, Claude, GPT, Ollama)
│
├── apps/
│   ├── elo-core/              # FastAPI Daemon, Tool Registry, Watchdog, Web UI
│   └── elo-desktop-macos/     # Native C# .NET 10 macOS Desktop application & DMG
│
├── infra/
│   └── init-db.sql            # PostgreSQL schema initialization
│
├── docker-compose.yml         # Postgres pgvector + Redis stack
├── .env.example               # Environment variables template
└── pyproject.toml
```

### 1. Multi-Provider Zero-Latency Failover Cascade (Free-Tier Optimized)

ELO implements a deterministic fallback cascade strictly optimized for zero-cost, high-speed, free-tier tokens:

```mermaid
graph TD
    Request["Incoming Request"] --> T1["Tier 1: Google Gemini (Gemini 2.5 Flash / Pro)"]
    T1 -->|HTTP 429 / Quota Zero| T2["Tier 2: Groq LPU (Llama 3.3 70B / 3.1 8B)"]
    T2 -->|Rate Limit / Quota| T3["Tier 3: OpenRouter Hub (Free Tier Models Pool)"]
    T3 -->|Offline / No WAN| T4["Tier 4: Local Ollama (Apple M1 Metal Acceleration)"]
    T4 -->|Local Daemon Down| T5["Tier 5: Mock Deterministic Fallback"]
```

### 2. Security Ring Architecture & Gatekeeper

Every operational tool in ELO is assigned an explicit security ring:

```
┌─────────────────────────────────────────────────────────────┐
│  L0_READ_ONLY (Immediate Execution)                        │
│  - System telemetry, node probes, log queries, searches     │
├─────────────────────────────────────────────────────────────┤
│  L1_LOW_WRITE (Auto-Executed + HMAC Audit Trail)           │
│  - Setting alert thresholds, temporary IP caching          │
├─────────────────────────────────────────────────────────────┤
│  L2_HIGH_IMPACT (Interactive User Approval Required)        │
│  - Proxmox VM/LXC start/stop/reboot, OPNsense firewall ban │
├─────────────────────────────────────────────────────────────┤
│  L3_CRITICAL (Strict 2FA / Break-Glass Challenge)          │
│  - Database drop, destructive volume purge, factory reset  │
└─────────────────────────────────────────────────────────────┘
```

### 3. Self-Healing Watchdog Engine

The watchdog runs as an asynchronous background task (`asyncio.create_task`) with a 30-second cycle:
1. Concurrently probes Proxmox (`192.168.1.132`), OpenMediaVault (`192.168.1.135`), and the local node (`192.168.1.133`).
2. Concurrently probes all 28 workload TCP ports (`timeout=0.25s`).
3. If an outage is detected:
   - Records an incident in the audit database.
   - Triggers an automated recovery attempt if an L1 tool is available.
   - Dispatches instant alerts to the configured administrator channels.

### 4. 🧠 Persistent Semantic Memory with `pgvector` & RAG
* **Vectorized Knowledge Base**: PostgreSQL with `pgvector` (`vector(128/768)`) storing documentation chunks, VM configurations, and user preferences.
* **Hybrid Search**: Combines deterministic cosine similarity vectors with lexical keyword weighting for sub-millisecond retrieval.
* **User Preferences & Context**: Remembers user habits, notification thresholds, and VM profiles across sessions.

### 5. 📡 ESP32 Hardware & Physical Room-Awareness
* **Presence Sensor Integration**: Consumes BLE and mmWave radar telemetry from ESP32 nodes over MQTT/REST.
* **Contextual Action Routing**: Commands like *"Turn on lights"* or *"Play music"* automatically resolve to the specific Home Assistant entity for the room the user is currently located in (`Birou`, `Living`, `Server Room`).

### 6. 🤖 Autonomous Sub-Agent Swarm
* **🛡️ SecOps Threat-Hunter Agent**: Analyzes Wazuh SIEM & Suricata NIDS logs; automatically triggers OPNsense quarantine rules upon detecting brute-force or malicious scans.
* **⚙️ SysAdmin Optimization Agent**: Evaluates RAM/CPU telemetry on Proxmox (`192.168.1.132`) & NAS (`192.168.1.135`), initiates KSM memory deduplication, and prunes dangling Docker caches.
* **💡 Smart Home & Energy Agent**: Interrogates Home Assistant (`192.168.1.10:8123`) & Shelly smart relays to detect vampire idle loads and optimize heating.
* **🛡️ Predictive Health Healer**: Analyzes SMART disk telemetry (`scrutiny.lan`) and triggers proactive ZFS snapshots before hardware degradation occurs.

### 7. 🎙️ Offline Voice & Apple Silicon Metal MPS Acceleration
* **Whisper.cpp & Piper TTS**: Offline speech-to-text and neural voice synthesis executing locally on Apple M1 Metal MPS hardware (`192.168.1.133`).
* **Zero-WAN Resilience**: The full ReAct loop and tool registry operate seamlessly even during complete Internet blackouts.

---

## 🤖 Antigravity Model Context Protocol Server (`ai/`)

Located in `ai/`, the **Antigravity MCP Server** implements the open standard Model Context Protocol (MCP) by Anthropic for exposing contextual homelab tools, Git forge automation, and structured reasoning engines to external AI clients and agents:

```
ai/
├── mcp_config.json          # MCP server registration & transport definitions
├── Makefile                 # Build, test, and container packaging automation
├── ansible/
│   └── playbook.yml         # Automated deployment of MCP agents and runtime
└── scripts/
    ├── setup.sh             # Linux/macOS automated installation script
    └── setup.ps1            # Windows PowerShell automated installation script
```

### Supported MCP Transports & Tool Servers:
* **Standard I/O (`stdio`) Transport**: Low-latency JSON-RPC 2.0 communication directly with IDEs and AI agent runners.
* **Sequential Thinking Engine**: Step-by-step reasoning server (`@modelcontextprotocol/server-sequential-thinking`) providing recursive problem breakdown and verification.
* **GitHub & Git Forge Integrations**: Tool server (`@modelcontextprotocol/server-github`) providing repository inspection, issue tracking, and automated commit management.
* **Ansible Automated Deployment**: Idempotent configuration management for headless server nodes running MCP agents.

---

## 🖥️ Native macOS Desktop Application (.NET 10)

ELO includes a native desktop application for macOS located in `elo/apps/elo-desktop-macos`:

* **Framework**: Built on **.NET 10.0 (C# 13)** using `Photino.NET` with native Cocoa `NSWindow` and WebKit `WKWebView`.
* **Platform Support**: Compiled as a native self-contained binary for Apple Silicon (`osx-arm64`).
* **Microphone & Speech**: Pre-configured in `Info.plist` with `NSMicrophoneUsageDescription` and `NSSpeechRecognitionUsageDescription` for continuous voice wake word ("Hey ELO").
* **Installer**: Packaged as a 38MB compressed disk image (`ELO-macOS-arm64.dmg`) with drag-and-drop installation to `/Applications`.

### Build & Package DMG:

```bash
cd elo/apps/elo-desktop-macos
chmod +x build_dmg.sh
./build_dmg.sh
```

---

## ⚙️ Infrastructure as Code & Configuration Management

### 1. Terraform Infrastructure Provisioning

Located in `terraform/`, configurations manage automated virtual machine lifecycle on Proxmox VE:
* Cloud-Init provisioning for Ubuntu 24.04 LTS and Alpine Linux v3.21.
* Automated network interface attachment with VLAN tagging.
* Declarative state management and resource isolation.

```bash
cd terraform/proxmox
terraform init
terraform plan
terraform apply
```

### 2. Ansible Hardening & Baseline Roles

Located in `ansible/`, automation playbooks enforce security baselines:
* **CIS Benchmark Level 1**: Hardened kernel parameters (`/etc/sysctl.d/99-security.conf`), disabled unused network protocols, strict file permissions.
* **SSH Hardening**: Key-only authentication, disabled root login, port isolation.
* **Package Management**: Automated unattended security updates across Debian/Ubuntu/Alpine nodes.

```bash
cd ansible
ansible-playbook -i inventory/hosts.ini playbooks/site.yml --check
```

### 3. Remote Administration & PuTTY Automation Toolkit (`scripts/`)

Located in `scripts/`, a consolidated suite of shell scripts, Perl/Ruby utilities, and assembly diagnostics for remote host operations, SSH tunneling, and session management:

* **Batch SSH Orchestration & Monitoring**:
  * `scripts/perl/batch_ssh_exec.pl`: Multi-host parallel command execution with ANSI terminal formatting (`scripts/perl/lib/PuttyANSI.pm`).
  * `scripts/ruby/server_audit.rb` & `scripts/perl/sysmon_terminal.pl`: Remote host resource auditing, CPU/memory profiling, and network socket monitoring.
  * `scripts/perl/netstat_traffic_watch.pl`: Real-time active socket and connection watcher.
* **PuTTY & SSH Tunnel Management**:
  * `scripts/ruby/ssh_tunnel_helper.rb`: Automated SSH port forwarding and SOCKS5 proxy daemon orchestration (`scripts/config/tunnels.example.yaml`).
  * `scripts/perl/putty_session_mgr.pl` & `scripts/ruby/putty_session_sync.rb`: PuTTY session configuration generator, registry synchronization (`scripts/config/putty_template.reg`), and PPK key converter (`scripts/perl/ppk_key_helper.pl`).
* **Cluster Lifecycle & Disaster Recovery**:
  * `scripts/cold-boot-sequence.sh` / `.ps1`: Ordered cluster power-on sequence ensuring network/storage availability before compute.
  * `scripts/emergency-shutdown.sh` / `.ps1`: Graceful multi-node shutdown sequence preventing ZFS pool corruption.
  * `scripts/optimize-proxmox-ram.sh` / `.ps1`: KSM memory ballooning and ZFS ARC cache tuner for Proxmox VE.
  * `scripts/network-scan.sh` / `.ps1`: Automated subnet discovery and port scanner.
* **Low-Level Hardware Diagnostics**:
  * `scripts/*.asm` (x86_64 NASM): Standalone bare-metal utilities (`cpuid.asm`, `sysinfo.asm`, `memzero.asm`, `diskcheck.asm`, `hexdump.asm`, `reboot.asm`).

---

## 🛡️ Cyber Proving Ground & SOC/SIEM Operations

The `cyber/` directory serves as an isolated testbed and continuous security monitoring center:

```mermaid
flowchart LR
    Nodes["Workloads & Hypervisor"] -->|Log Forwarding / Syslog| Suricata["Suricata NIDS<br/>(Network Threat Detection)"]
    Nodes -->|Wazuh Agent :1514| Wazuh["Wazuh Manager 4.8<br/>(HIDS & Compliance)"]
    Suricata -->|EVE JSON| Loki["Grafana Loki"]
    Wazuh -->|Security Events| Grafana["Grafana SOC Dashboards"]
    Loki --> Grafana
    
    subgraph OffensiveTesting["Emulation & Defense Testing"]
        Atomic["Atomic Red Team (T1059, T1082)"]
        BloodHound["BloodHound AD Analysis"]
        Semgrep["Semgrep Static Analysis"]
    end
    
    OffensiveTesting -.->|Simulated Attacks| Nodes
```

* **Wazuh 4.8 SIEM**: Endpoint visibility, file integrity monitoring (FIM), vulnerability assessment.
* **Suricata NIDS**: Deep packet inspection against the Emerging Threats (ET) open ruleset on OPNsense gateway.
* **Offensive Emulation**: MITRE ATT&CK test patterns via Atomic Red Team for detection validation.

---

## 🚀 Enterprise CI/CD & DevSecOps Master Pipeline

Every commit and pull request to the monorepo is continuously validated, audited, and deployed through an automated **8-Stage Enterprise CI/CD Pipeline** running on GitHub Actions:

```mermaid
graph TD
    subgraph STAGE1["Stage 1: Shift-Left DevSecOps & Secrets"]
        Gitleaks["Gitleaks Secret Scanner"]
        TruffleHog["TruffleHog Deep Git Audit"]
    end

    subgraph STAGE2["Stage 2: Code Quality, Typing & Linting"]
        Ruff["Ruff Linter & Formatter"]
        MyPy["MyPy Static Type Checker"]
        ShellCheck["ShellCheck POSIX Portability"]
        Yamllint["Yamllint (Playbooks & K8s)"]
    end

    subgraph STAGE3["Stage 3: SAST & Vulnerability Auditing"]
        Bandit["Bandit Python AST SAST"]
        Semgrep["Semgrep Static Security"]
        Trivy["Trivy CVE & Misconfiguration Scanner"]
    end

    subgraph STAGE4["Stage 4: IaC & Orchestration Validation"]
        Terraform["Terraform Validate (Proxmox VMs)"]
        Ansible["Ansible-lint & Syntax-Check"]
        Compose["Docker Compose Schema (31 Stacks)"]
        Kubeconform["Kubeconform (K3s Manifests)"]
    end

    subgraph STAGE5["Stage 5: Multi-Python Matrix (28/28 Tests)"]
        PyMatrix["Python 3.9 · 3.10 · 3.11 · 3.12 · 3.13 (Pytest 100% Pass)"]
    end

    subgraph STAGE6["Stage 6: Multi-Linux Distro Matrix"]
        DistroMatrix["Debian 12 · Ubuntu 24.04 · Alpine 3.20 (musl) · Rocky 9 · Fedora 40 · Arch"]
    end

    subgraph STAGE7["Stage 7: Web Frontend & macOS Packaging"]
        ViteBuild["Vue 3 Frontend Production Build (Vite)"]
        MacDMG["macOS .NET 10 DMG Packaging (arm64)"]
    end

    subgraph STAGE8["Stage 8: Continuous Deployment (CD) & Release"]
        GHPages["Deploy to GitHub Pages"]
        GHCRWeb["Publish homelab-web Multi-Arch (GHCR)"]
        GHCRElo["Publish elo-core Multi-Arch (GHCR)"]
    end

    STAGE1 --> STAGE2 --> STAGE3 --> STAGE4 --> STAGE5 --> STAGE6 --> STAGE7 --> STAGE8
```

---

### Master Pipeline Stages & Quality Gates:

1. **🛡️ Shift-Left Secret Scanning (`Gitleaks` & `TruffleHog`)**: Zero-tolerance scanning across full Git history for exposed API keys, private certificates, and credentials.
2. **🔍 Code Quality & Strict Typing (`Ruff`, `MyPy`, `ShellCheck`, `Yamllint`)**:
   - `Ruff` linter and formatter validation for all Python packages.
   - `MyPy` static type verification across all contract interfaces (`elo_contracts`).
   - `ShellCheck-Py` portability validation for all POSIX shell and bash automation scripts.
   - `Yamllint` syntax and schema check for Ansible playbooks, Kubernetes manifests, and Docker Compose files.
3. **🔒 SAST & Vulnerability Auditing (`Bandit`, `Semgrep`, `Trivy`)**:
   - `Bandit` AST vulnerability analysis on the ELO control plane and tools.
   - `Semgrep` static security rule evaluation for IaC and application code.
   - `Trivy` filesystem, base image, and CVE audit.
4. **🏗️ Infrastructure as Code Validation (`Terraform`, `Ansible`, `Docker Compose`, `Kubeconform`)**:
   - `Terraform` format verification and template validation across Proxmox VM modules.
   - `Ansible-lint` and `ansible-playbook --syntax-check` on all provisioning playbooks.
   - Schema validation across all 31 Docker Compose service stacks.
   - `Kubeconform` validation against Kubernetes v1.30 API schemas.
5. **🧪 Multi-Python Version Matrix (Python 3.9, 3.10, 3.11, 3.12, 3.13)**: Full automated test execution with coverage reporting (`28/28 tests passed 100% green`).
6. **🐧 Multi-Linux Distribution Compatibility Matrix**: Tests and validates runtime execution natively inside 6 major Linux container ecosystems:
   - **Debian 12 Bookworm** (`glibc` — Proxmox VE & OpenMediaVault base)
   - **Ubuntu 24.04 LTS Noble** (`glibc` — modern cloud server base)
   - **Alpine Linux 3.20** (`musl libc` — VM 201 & ultra-lean containers)
   - **Rocky Linux 9** (Enterprise RHEL / RPM ecosystem)
   - **Fedora 40** (Modern upstream RPM)
   - **Arch Linux** (Rolling release bleeding edge)
7. **🌐 Web Frontend Build & Bundle Verification**: Complete Vue 3 / Vite production compilation testing bundle size and asset integrity.
8. **🚀 Continuous Deployment & Multi-Arch Container Release (`.github/workflows/cd.yml`)**:
   - Automated deployment of the static frontend dashboard to **GitHub Pages**.
   - Build and release of multi-architecture container images (`linux/amd64`, `linux/arm64`) to **GitHub Container Registry (GHCR)**.
   - Packaging of the native macOS Desktop application into `ELO-macOS-arm64.dmg`.

---

## 📂 Repository Monorepo Layout

```
homelab/
├── .github/workflows/         # GitHub Actions CI/CD workflows (ci.yml, cd.yml)
├── ai/                        # Antigravity Model Context Protocol (MCP) Server & agents
│   ├── mcp_config.json        # MCP server registration & transport definitions
│   ├── ansible/               # Automated deployment of MCP agents
│   └── scripts/               # Cross-platform installation and setup scripts
├── ansible/                   # Ansible configuration management & CIS hardening
│   ├── inventory/             # Host inventories (hosts.ini)
│   ├── playbooks/             # Deployment and compliance playbooks
│   └── roles/                 # Modular roles (docker, common, security, monitoring)
├── cyber/                     # Cyber proving ground, SOC/SIEM configs, CTF sandboxes
│   ├── soc/                   # Wazuh, Suricata, and Loki alert rules
│   └── ctf/                   # Challenge containers and reverse engineering labs
├── elo/                       # ELO Infrastructure Control Plane & Orchestrator
│   ├── apps/
│   │   ├── elo-core/          # FastAPI Daemon, Tool Registry, Watchdog, Web UI
│   │   └── elo-desktop-macos/ # Native C# .NET 10 macOS Application & DMG Builder
│   ├── packages/
│   │   ├── elo-contracts/     # Pydantic v2 schemas and models
│   │   ├── elo-security/      # Zero-trust Gatekeeper & HMAC tokens
│   │   └── elo-ai-client/     # Multi-provider cascade client
│   ├── docker-compose.yml     # PostgreSQL pgvector + Redis dependencies
│   ├── pyproject.toml         # Python package definitions
│   └── pytest.ini             # Test configuration
├── scripts/                   # Remote administration, SSH tunneling, assembly diagnostics
│   ├── perl/                  # Batch SSH execution and ANSI terminal monitors
│   ├── ruby/                  # Tunnel helpers, database backup rotators, log analyzers
│   └── config/                # Host definitions, tunnel configs, PuTTY registry templates
├── services/                  # Production Docker Compose stacks by service group
│   ├── media/                 # Jellyfin, Radarr, Sonarr, Prowlarr, Bazarr
│   ├── monitoring/            # Prometheus, Grafana, Loki, Uptime Kuma
│   ├── security/              # Vaultwarden, Authelia, CrowdSec
│   └── storage/               # Nextcloud, Immich, Scrutiny
├── terraform/                 # Terraform configurations for Proxmox & VMs
├── vms/                       # VM definitions (OPNsense, Alpine Server)
└── README.md                  # Comprehensive monorepo documentation
```

---

## 🛠️ Operations & Runbook

### Starting the ELO Control Plane Daemon

```bash
# 1. Activate virtual environment
cd elo
source .venv/bin/activate

# 2. Start FastAPI Daemon with Watchdog
uvicorn elo_core.main:app --host 0.0.0.0 --port 8000 --reload
```

### Accessing ELO Web Dashboard
Open your browser and navigate to:
```
http://localhost:8000/
```

### Running the macOS Desktop Application
Open the disk image on your Desktop and drag `ELO.app` into `/Applications`:
```bash
open ~/Desktop/ELO-macOS-arm64.dmg
```

### Emergency Break-Glass Procedures
If the ELO control plane is unreachable or an API token has expired:
1. **Direct SSH Access**: SSH into `pve-node-1` directly via `ssh root@192.168.1.132`.
2. **OPNsense WebGUI**: Access the firewall management interface directly on `https://192.168.1.132:8443`.
3. **Database Inspection**: Connect to PostgreSQL directly using `psql -h localhost -U elo_user -d elo_db`.

---

## 📄 License

This repository is maintained as an open-source infrastructure project under the **MIT License**. See [LICENSE](LICENSE) for full details.
