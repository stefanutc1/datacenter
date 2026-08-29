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
| **Phase 5** | **Autonomous Sub-Agent Swarm** |  Complete | SecOps Threat-Hunter, SysAdmin Optimizer, Smart Energy Agent, Predictive ZFS Healer. |
| **Phase 6** | **Enterprise CI/CD & Free-Tier AI** |  Complete | 8-Stage CI/CD matrix, 6-Distro Linux runner, Free-tier cascade (Gemini/Groq/OpenRouter/Ollama). |
| **Phase 7** | **Edge Voice Acceleration & Kubernetes Mesh** |  Active | Whisper.cpp Metal MPS streaming, k3s multi-node HA, automated cluster auto-scaler. |
| **Phase 8** | **Autonomous Self-Healing Infrastructure** |  Planned | Zero-touch kernel live-patching, BGP dynamic routing, off-grid solar telemetry forecasting. |

---

## Detailed Phase Deliverables

### Phase 1–2: Core Foundation & IaC (Delivered)
- Dual-NIC paravirtualized OPNsense router (VM 200) with stateful packet filtering.
- Dedicated Windows Server 2025 Datacenter VM (VM 201) and native container fleet.
- Complete infrastructure automated through Terraform and Ansible playbooks.
- Pi-hole DNS sinkhole with automated local `*.lan` domain resolution.

### Phase 3–5: ELO Autonomous Control Plane (Delivered)
- **FastAPI Control Daemon** (`192.168.1.133:8000`) with interactive web UI and Telegram bot integration.
- **Zero-Trust Security Gatekeeper**: L0–L3 security clearance rings with HMAC-SHA256 capability tokens.
- **pgvector Semantic Memory**: Vectorized storage of homelab runbooks and incident resolutions.
- **ESP32 Room-Awareness**: Physical location tracking across `Birou`, `Living`, `Server Room`, `Dormitor`.
- **Specialized Multi-Agent Swarm**:
  -  SecOps Threat-Hunter (Wazuh SIEM + Suricata NIDS + OPNsense firewall ban).
  -  SysAdmin Optimizer (KSM memory deduplication + Docker cache pruning).
  -  Smart Home Energy Agent (Home Assistant power analysis + vampire load isolation).
  -  Predictive Health Healer (SMART disk telemetry + automated ZFS snapshot trigger).

### Phase 6: Enterprise CI/CD & Free-Tier AI Cascade (Delivered)
- **Zero-Cost LLM Failover Cascade**: Strict prioritization of Google Gemini 2.5 Flash $\to$ Groq LPU $\to$ OpenRouter Hub (:free) $\to$ Local Ollama (Metal MPS) $\to$ Mock Failsafe.
- **8-Stage Enterprise CI Pipeline**: Shift-left DevSecOps (Gitleaks, TruffleHog), SAST (Bandit, Semgrep), CVE audit (Trivy), multi-Python matrix (3.9–3.13), and multi-Linux container matrix (Debian, Ubuntu, Alpine, Rocky, Fedora, Arch).
- **Native macOS Desktop Packaging**: C# .NET 10 self-contained `ELO-macOS-arm64.dmg`.

### Phase 7: Edge Voice & Kubernetes Mesh (In Progress)
- [] Bidirectional real-time voice streaming with Whisper.cpp and Piper TTS over WebSocket.
- [] Multi-node k3s cluster high-availability control plane failover.
- [] FluxCD GitOps automated canary deployments with Flagger.

### Phase 8: Autonomous Self-Healing (Future Horizon)
- [] Automated kernel live-patching without VM reboots.
- [] Dynamic BGP multihoming and OPNsense CARP hardware failover.
- [] Edge solar generation telemetry correlation with server frequency scaling.
