# Homelab & ELO Engineering Roadmap

This document outlines the evolutionary milestones, past achievements, and future strategic engineering deliverables for the **Homelab & ELO Platform**.

---

## High-Level Phase Overview

| Phase | Strategic Domain | Status | Key Deliverables |
| :---: | :--- | :---: | :--- |
| **Phase 1** | **Foundational Virtualization & Network** |  Complete | Proxmox VE 9.2, OPNsense Gateway, VLAN 1-40 segmentation, Tailscale mesh. |
| **Phase 2** | **Workload Containerization & IaC** |  Complete | 31 Docker Compose microservices, Ansible CIS Level 1 hardening, Terraform Cloud-Init modules. |
| **Phase 3** | **Persistent Semantic Memory & RAG** |  Complete | `pgvector` store, 128-D dense vector embeddings, long-term user preferences recall. |
| **Phase 4** | **Edge IoT & Room-Awareness** |  Complete | ESP32 BLE / mmWave radar telemetry over MQTT, contextual room entity routing. |
| **Phase 5** | **Automation Agents** | Complete | SecOps monitoring, SysAdmin optimizer, Smart energy, Disk health snapshots. |
| **Phase 6** | **CI/CD & Local AI Integration** | Complete | CI/CD matrix, multi-distro container testing, LLM fallback chain. |
| **Phase 7** | **Voice Integration & Kubernetes** | Active | Whisper.cpp speech processing, k3s cluster setup. |
| **Phase 8** | **Infrastructure Automation** | Planned | Automated updates, dynamic routing, power telemetry forecasting. |

---

## Detailed Phase Deliverables

### Phase 1–2: Core Foundation & IaC (Delivered)
- Dual-NIC paravirtualized OPNsense router (VM 200) with packet filtering.
- Dedicated Windows Server 2025 Datacenter VM (VM 201) and container fleet.
- Infrastructure managed through Terraform and Ansible playbooks.
- Pi-hole DNS sinkhole with local `*.lan` domain resolution.

### Phase 3–5: ELO Control Plane (Delivered)
- **FastAPI Control Daemon** (`192.168.1.133:8000`) with web UI and Telegram bot integration.
- **Security Gatekeeper**: L0–L3 security clearance rings with HMAC-SHA256 capability tokens.
- **pgvector Semantic Memory**: Vector storage of homelab runbooks and incident resolutions.
- **ESP32 Room-Awareness**: Physical location tracking across `Birou`, `Living`, `Server Room`, `Dormitor`.
- **Automation Agents**:
  - SecOps Agent (Wazuh SIEM + Suricata NIDS + OPNsense firewall rule management).
  - SysAdmin Optimizer (Memory management + Docker cache cleanup).
  - Smart Home Energy Agent (Home Assistant power analysis).
  - Disk Health Agent (SMART disk telemetry + automated ZFS snapshot trigger).

### Phase 6: CI/CD & Local AI (Delivered)
- **LLM Fallback Chain**: Prioritization across Google Gemini, Groq, OpenRouter, and Local Ollama.
- **CI Pipeline**: Secret scanning (Gitleaks, TruffleHog), static analysis (Bandit, Semgrep, Trivy), multi-Python matrix (3.9–3.13), and multi-Linux container tests (Debian, Ubuntu, Alpine, Rocky, Fedora, Arch).
- **Native macOS Desktop Packaging**: C# .NET 10 self-contained `ELO-macOS-arm64.dmg`.

### Phase 7: Edge Voice & Kubernetes Mesh (In Progress)
- [] Bidirectional real-time voice streaming with Whisper.cpp and Piper TTS over WebSocket.
- [] Multi-node k3s cluster high-availability control plane failover.
- [] FluxCD GitOps automated canary deployments with Flagger.

### Phase 8: Autonomous Self-Healing (Future Horizon)
- [] Automated kernel live-patching without VM reboots.
- [] Dynamic BGP multihoming and OPNsense CARP hardware failover.
- [] Edge solar generation telemetry correlation with server frequency scaling.
