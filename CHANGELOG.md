# Changelog

All notable changes to the **Homelab & ELO Platform** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.5.0] - 2026-08-28

### Added
- **CI/CD Pipelines & Quality Automation**:
  - Gitleaks & TruffleHog secret auditing.
  - Ruff linter/formatter, MyPy static type checking, ShellCheck, and Yamllint.
  - Bandit Python AST, Semgrep security rules, and Trivy vulnerability scanner.
  - Infrastructure validation for Terraform (Proxmox VMs), Ansible playbooks, Docker Compose (31 stacks), and Kubernetes (Kubeconform v1.30).
  - Multi-Python test matrix across Python 3.9, 3.10, 3.11, 3.12, and 3.13.
  - Multi-Linux container compatibility matrix covering Debian 12, Ubuntu 24.04, Alpine Linux 3.20, Rocky Linux 9, Fedora 40, and Arch Linux.
  - Multi-architecture Docker container releases (`linux/amd64`, `linux/arm64`) to GitHub Container Registry (GHCR).
  - Scheduled vulnerability and dependency audit workflow (`.github/workflows/security-scheduled.yml`).
- **LLM Fallback Routing**:
  - Native Groq client (`elo_ai_client.groq_client.GroqClient`).
  - Fallback priority order: Google Gemini 2.5 Flash -> Groq (Llama 3.3 70B) -> OpenRouter Hub -> Local Ollama Metal MPS -> Deterministic Fallback.
  - Failover on HTTP 429 quota exhaustion with cooldown caching.
- **Frontend Web Unification**:
  - Unified all dashboard components, hardware node inspectors, topology graphs, port matrices, and Markdown documentation into a single Vue 3 / Vite application in `web/`.
  - Removed redundant `homepage/` subfolder.

### Security
- Removed paid model providers (OpenAI/ChatGPT and Anthropic/Claude) in favor of free/local models.
- Enforced non-interactive mode and dedicated virtual environments for PEP 668 compliance across Linux distributions.

---

## [2.0.0] - 2026-08-27

### Added
- **ELO Automation Agents**:
  - `SecOpsThreatHunterAgent`: Automated correlation of Wazuh SIEM and Suricata NIDS logs with OPNsense IP quarantine.
  - `SysAdminOptimizerAgent`: Cluster RAM/CPU telemetry optimization and Docker cache pruning.
  - `SmartHomeEnergyAgent`: Home Assistant power telemetry analysis and load detection.
  - `PredictiveHealthAnalyzer`: S.M.A.R.T. disk telemetry monitoring and ZFS snapshot triggering.
- **Persistent Semantic Memory with `pgvector`**:
  - Deterministic 128-dimensional dense vector embeddings with cosine similarity search.
  - Persistent recall of user preferences, VM contexts, and previous incident resolutions.
- **Hardware ESP32 & Room-Awareness**:
  - Microcontroller BLE and mmWave radar telemetry integration over MQTT.
  - Contextual entity resolution across `Birou`, `Living`, `Server Room`, `Dormitor`.
- **Offline Voice Engine on Apple Silicon**:
  - Whisper.cpp STT and Piper TTS with Apple Silicon Metal MPS acceleration.
- **Native macOS Desktop Application**:
  - C# .NET 10 application packaged as `ELO-macOS-arm64.dmg`.

---

## [1.0.0] - 2026-08-25

### Added
- Initial Proxmox VE 9.2 hypervisor provisioning with OPNsense virtual router (VM 200) and Windows Server 2025 Datacenter (VM 201).
- Declarative Infrastructure as Code configurations via Terraform and Ansible CIS Level 1 hardening.
- Deployment of containerized services across VLAN 1, 10, 20, 30, and 40.
- Pi-hole DNS sinkhole with local `*.lan` domain resolution.
- 3-2-1 backup strategy with OpenMediaVault NAS and Proxmox Backup Server.
