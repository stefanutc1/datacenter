<div align="center">

# Homelab & CyberLab

**Self-Hosted Infrastructure · Autonomous AI Operating Layer (ELO) · IaC · GitOps · SOC Operations · DFIR · Edge Computing**

A comprehensive infrastructure, autonomous AI operating layer, and cybersecurity proving ground built on Proxmox VE, declarative Ansible automation, Terraform IaC, k3s Kubernetes, Wazuh XDR SIEM, Home Assistant domotics, and ESP32 embedded edge devices.

[![CI](https://github.com/stefanutc1/homelab/actions/workflows/ci.yml/badge.svg)](https://github.com/stefanutc1/homelab/actions)
![ELO AI](https://img.shields.io/badge/ELO-AI_Operating_Layer-a855f7?style=flat-square&logo=openai&logoColor=white)
![Ansible](https://img.shields.io/badge/Ansible-Role--Based_IaC-EE0000?style=flat-square&logo=ansible&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-1.8%2B-7B42BC?style=flat-square&logo=terraform&logoColor=white)
![k3s](https://img.shields.io/badge/Kubernetes-k3s-326CE5?style=flat-square&logo=kubernetes&logoColor=white)
![Wazuh](https://img.shields.io/badge/SIEM-Wazuh_XDR_4.8-005B94?style=flat-square)
![FluxCD](https://img.shields.io/badge/GitOps-FluxCD-5468FF?style=flat-square)
[![Wiki Hub](https://img.shields.io/badge/Wiki_Hub-GitHub_Pages-22c55e?style=flat-square&logo=githubpages&logoColor=white)](https://stefanutc1.github.io/homelab/)
![License](https://img.shields.io/badge/License-MIT-1D3557?style=flat-square)

</div>

---

## ⚡ Highlights

- **🧠 ELO Autonomous AI Operating Layer (`elo/`)** — JARVIS-like AI orchestrator with Tiered Multi-Provider Cascade (Gemini, OpenRouter, Claude, GPT-4, Local Ollama), hands-free **"Hey ELO"** wake word, real-time Proxmox VE REST API control, Home Assistant domotics, OPNsense Cyber Shield, RAG semantic knowledge base, and autonomous Self-Healing Watchdog with phone SMS/Push alerts.
- **🖥️ 30+ self-hosted services** deployed via `docker-compose` with persistent volume management and Nginx Proxy Manager / Authelia SSO.
- **🛡️ Cyber Proving Ground (`cyber/`)** — SOC/SIEM operations (Wazuh 4.8, Suricata NIDS, Grafana Loki), DFIR triage, Red Team emulation (Atomic Red Team, BloodHound), and automated SAST.
- **⚙️ Automated system hardening** via Ansible roles enforcing CIS Level 1 sysctl baselines and restrictive access policies.
- **🏗️ Terraform-provisioned Proxmox VMs** using a reusable cloud-init Ubuntu module and multi-hypervisor support (Proxmox, Xen, ESXi, Hyper-V, bhyve).
- **☸️ k3s Kubernetes cluster** with FluxCD GitOps synchronization against this repository.
- **📡 ESP32 embedded projects** — automated irrigation control and physical presence sensing via MQTT.

---

## 🧠 ELO — Autonomous AI Operating Layer (`elo/`)

[`elo/`](elo/) is the next-generation autonomous orchestrator running on the local node (`MacBook-Air.local`) that monitors, controls, and interacts with the entire infrastructure through natural language and voice:

```mermaid
flowchart LR
    User(["🗣️ Voice / Text (Hey ELO)"]) --> WebUI["🌐 Holographic Arc Reactor UI"]
    WebUI --> Engine["⚙️ ELO ReAct Engine & Gatekeeper"]
    
    subgraph Cascade["Tiered AI Model Cascade"]
        G["Tier 1: Google Gemini"] -->|Out of Credits / 429| OR["Tier 2: OpenRouter Hub"]
        OR -->|Failover| OAI["Tier 3: OpenAI Direct"]
        OAI -->|Failover| CL["Tier 4: Claude Direct"]
        CL -->|Failover| OL["Tier 5: Local Ollama (M1/Metal)"]
        OL -->|Offline| M["Tier 6: Mock Deterministic"]
    end
    
    Engine --> Cascade
    
    subgraph Integrations["Live Homelab Ecosystem"]
        Engine -->|REST API :8006| PVE["🖥️ Proxmox VE (192.168.10.2)"]
        Engine -->|REST/WS :8123| HASS["🏠 Home Assistant (192.168.20.10)"]
        Engine -->|Firewall API :443| OPN["🛡️ OPNsense (192.168.10.1)"]
        Engine -->|RAG Search| RAG["🧠 Homelab Knowledge Base"]
        Engine -->|SMS / Push / Bot| Phone["📱 Phone / Telegram Alerting"]
    end
    
    Watchdog["🔄 Self-Healing Watchdog (30s loop)"] -->|Health Polling & Auto-Recovery| Integrations
```

### Key Capabilities:
1. **Tiered Zero-Latency Failover Cascade**: Instant automatic failover if any model runs out of credits or hits rate limits (`429`), with smart 5-minute quota cooldown.
2. **Proxmox VE REST API**: Live node probing and VM/LXC management (`start`, `stop`, `reboot`, `snapshot`) gated by L2 security approvals.
3. **Home Assistant Domotics**: Control smart lights, switches, and read temperature sensors via voice commands.
4. **OPNsense Cyber Shield**: Inspect WAN gateway status and instantly block malicious IP addresses.
5. **Self-Healing Watchdog**: Background loop that detects outages, restarts failed containers, and sends SMS/Push notifications.
6. **Always-Listening "Hey ELO"**: Browser-based continuous wake word detection with speech synthesis.

---

## 🏗️ Stack

| Domain | Tools |
|:---|:---|
| **AI Operating Layer** | **ELO Core, FastAPI, ReAct Loop, Multi-Provider Cascade (Gemini, OpenRouter, Claude, GPT-4, Ollama), Web Speech** |
| Virtualization | Proxmox VE 8/9, macOS UTM / QEMU, Xen, ESXi, Hyper-V, bhyve |
| Configuration Management | Ansible (role-based, idempotent) |
| Infrastructure as Code | Terraform — Proxmox, Xen, ESXi, Hyper-V, bhyve providers |
| Container Orchestration | k3s (lightweight Kubernetes) |
| GitOps | FluxCD — Kustomization + GitRepository CRDs |
| SIEM / XDR | Wazuh Manager 4.8 + Wazuh Dashboard |
| Log Aggregation | Grafana Loki + Promtail |
| Network IDS | Suricata (EVE JSON) |
| Monitoring | Prometheus + Alertmanager + Grafana |
| Reverse Proxy / SSL | Nginx Proxy Manager (Let's Encrypt auto-cert) |
| Auth / SSO | Authelia (MFA, forward auth), Authentik |
| Home Automation | Home Assistant with automations and MQTT |
| Password Manager | Vaultwarden (self-hosted Bitwarden) |
| Media & Storage | Immich, AList, FileBrowser, arr-suite (Sonarr, Bazarr), OpenMediaVault ZFS |
| Network / VPN | NetBird (WireGuard mesh), Pi-hole, OPNsense |
| CI/CD | GitHub Actions (`ci.yml`, `cd.yml`) + Woodpecker CI |
| DFIR & Forensics | `triage_collector.sh`, `memory_dump.sh`, Chainsaw |
| Offensive Security | Atomic Red Team, BloodHound, LinPEAS |
| Static Analysis | Semgrep SAST, TruffleHog, Trivy, yamllint, ansible-lint |
| Embedded / Edge | ESP32 (Arduino C++) — irrigation, footprint sensor |

---

## 🌐 Network Architecture

```mermaid
flowchart TB
    Internet(["🌐 Internet"])

    subgraph PVE["Proxmox VE Hypervisor (192.168.10.2)"]
        direction TB

        subgraph CORE["Core Infrastructure (VLAN 10)"]
            OPN["OPNsense (192.168.10.1)\nFirewall · VLAN routing · Suricata"]
            DNS["Pi-hole\nDNS · Ad blocking"]
            VPN["NetBird\nWireGuard mesh VPN"]
        end

        subgraph PROXY["Reverse Proxy & Auth"]
            NPM["Nginx Proxy Manager\nSSL :80/:443 · Let's Encrypt"]
            AUTH["Authelia\nSSO · 2FA forward auth :9091"]
        end

        subgraph MON["Observability & SOC (VLAN 20/30)"]
            PROM["Prometheus + Alertmanager\nMetrics · Alert routing"]
            GRAF["Grafana + Loki\nDashboards & Logs :3000"]
            WAZUH["Wazuh XDR SIEM\nThreat detection :1514/:443"]
            KUMA["Uptime Kuma\nService health :3001"]
        end

        subgraph SVC["Services & Applications"]
            IMMICH["Immich · Nextcloud\nFileBrowser · AList"]
            VAULT["Vaultwarden\nPassword vault"]
            N8N["n8n · Gitea\nWoodpecker CI"]
            HASS["Home Assistant :8123\nSmart Home Hub"]
        end

        subgraph CYBER["Cyber Proving Ground (cyber/)"]
            SURICATA["Suricata NIDS\nMirrored packet inspection"]
            DFIR["DFIR Live Triage\nMemory & forensic collection"]
            REDTEAM["Atomic Red Team\nMITRE ATT&CK emulation"]
        end

        subgraph K8S["k3s Kubernetes Cluster"]
            FLUX["FluxCD GitOps\nKustomization · GitRepository"]
        end
    end

    subgraph ELO_NODE["Host Node (MacBook-Air.local / Apple M1)"]
        ELO_APP["🧠 ELO AI Core Daemon (:8000)\nWatchdog · Voice · Tiered LLM"]
    end

    subgraph EDGE["ESP32 Edge Layer"]
        IRR["Irrigation Controller\nValve · Schedule · Weather"]
        FP["Footprint Sensor\nPIR · MQTT presence"]
    end

    Internet --> OPN
    OPN --> NPM
    NPM --> AUTH
    AUTH --> SVC
    OPN --> DNS
    OPN --> VPN
    PROM --> GRAF
    PROM --> KUMA
    K8S --> FLUX
    EDGE --> HASS
    FP -->|MQTT| HASS
    OPN --> CYBER
    ELO_APP <-->|REST API| PVE
    ELO_APP <-->|REST API| HASS
    ELO_APP <-->|REST API| OPN
```

---

## 📁 Repository Layout

```
homelab/
├── .github/                         # GitHub Actions CI/CD (yamllint, ansible-lint, terraform, elo-test)
│
├── elo/                             # 🧠 ELO Autonomous AI Operating Layer
│   ├── apps/elo-core/               # FastAPI Daemon, ReAct Engine, Watchdog, Web UI
│   ├── packages/
│   │   ├── elo-ai-client/           # Tiered Cascade Router (Gemini, OpenRouter, Claude, GPT, Ollama)
│   │   ├── elo-contracts/           # SecurityLevel (L0-L3), Tools & Event Contracts
│   │   └── elo-security/            # HMAC Tokens, Gatekeeper, Approval Queues
│   ├── docker-compose.yml           # PostgreSQL pgvector + Redis stack
│   └── README.md                    # Detailed ELO documentation
│
├── cyber/                           # Cyber Security & SOC Proving Ground
│   ├── ai/                          # MITRE ATT&CK correlation & IOC extraction
│   ├── ansible/                     # Hardening, FIM, SIEM agents & emergency quarantine
│   ├── audit/                       # CIS auditd rules, Nuclei, Semgrep, Trivy, TruffleHog
│   ├── ctf/                         # Atomic Red Team, BloodHound, LinPEAS, Web security
│   ├── forensics/                   # Chainsaw, memory dump, volatile triage collector
│   └── services/                    # Wazuh Manager, Loki-Grafana, Suricata, CyberChef
│
├── ansible/
│   ├── roles/
│   │   ├── home_assistant/          # Home Assistant configuration role
│   │   └── system_hardening/        # Sysctl CIS parameters, restrictive umask (027)
│   ├── group_vars/                  # Host group variable files
│   └── playbook.yml                 # Master Ansible playbook
│
├── kubernetes/
│   ├── gitops/
│   │   ├── flux-system/             # FluxCD GitRepository CRD and source definitions
│   │   └── clusters/homelab/        # Kustomization manifests for cluster workloads
│   ├── ansible/                     # k3s cluster provisioning via Ansible
│   ├── services/                    # Kubernetes service manifests
│   └── hardware/                    # Cluster hardware reference docs
│
├── terraform/
│   ├── modules/
│   │   └── proxmox_vm/              # Reusable Proxmox VM module (cloud-init, virtio)
│   └── main.tf                      # Root topology provisioner
│
├── hypervisors/
│   ├── proxmox/                     # Proxmox VE LXC & VM Terraform configs
│   ├── xen/                         # Xen hypervisor Terraform module
│   ├── esxi/                        # VMware ESXi Terraform module
│   ├── hyperv/                      # Hyper-V Terraform module
│   └── bhyve/                       # FreeBSD bhyve Terraform module
│
├── vms/
│   ├── alpine-server/               # Alpine Linux v3.21 Virt KVM (VM 201) microservices setup
│   └── opnsense/                    # OPNsense Core Firewall (VM 200) gateway configuration
│
├── services/                        # 28+ Docker Compose self-hosted application stacks
├── custom-apps/                     # Standalone custom SaaS replacements (PulseGuard, DevForge, etc.)
├── web/                             # Unified Homelab & CyberLab Interactive Wiki Web Portal
│
├── esp32/
│   ├── irrigation/                  # Automated irrigation controller (Arduino C++)
│   └── footprint/                   # Physical footprint / presence sensor (MQTT)
│
├── scripts/                         # Lab bootstrap and maintenance scripts
└── Makefile                         # Unified task runner
```

---

## 🧪 CI/CD Validation

GitHub Actions runs automated checks on every push and PR:

- `elo-test` — Comprehensive automated testing of ELO (`pytest -v`)
- `lint-yaml` — YAML syntax and Ansible linting (`yamllint`, `ansible-lint`)
- `build-frontend` — Build and artifact validation for web dashboards
- `terraform-validate` — Syntax and configuration validation (`terraform validate`)

```bash
# Run tests locally:
cd elo && pytest -v
yamllint -c .yamllint .
cd terraform && terraform init -backend=false && terraform validate
```

---

## 📜 License

MIT — Copyright (c) 2026 stefanutc1 (`@stefanutc1`).
