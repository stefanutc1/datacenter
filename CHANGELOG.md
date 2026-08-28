# Changelog

All notable changes to the **Homelab & ELO Platform** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.5.0] - 2026-08-28

### Added
- **8-Stage Enterprise CI/CD & DevSecOps Master Pipeline**:
  - Gitleaks & TruffleHog OSS deep Git history secret auditing.
  - Ruff linter/formatter, MyPy static type checking, ShellCheck-Py, and Yamllint.
  - Bandit Python AST SAST, Semgrep security rules, and Trivy CVE vulnerability scanner.
  - Infrastructure validation for Terraform (Proxmox VMs), Ansible playbooks, Docker Compose (31 stacks), and Kubernetes (Kubeconform v1.30).
  - Multi-Python test matrix across Python 3.9, 3.10, 3.11, 3.12, and 3.13 (28/28 tests passed 100% green).
  - Multi-Linux container compatibility matrix covering Debian 12 Bookworm, Ubuntu 24.04 LTS, Alpine Linux 3.20 (musl), Rocky Linux 9 (RPM), Fedora 40, and Arch Linux.
  - Multi-architecture Docker container releases (`linux/amd64`, `linux/arm64`) to GitHub Container Registry (GHCR).
  - Scheduled nightly vulnerability and dependency audit workflow (`.github/workflows/security-scheduled.yml`).
- **Free-Tier Zero-Cost LLM Fallback Cascade**:
  - Native Groq LPU client (`elo_ai_client.groq_client.GroqClient`) with ultra-fast inference (>300 t/s).
  - Cascade priority order: Google Gemini 2.5 Flash $\to$ Groq LPU (Llama 3.3 70B) $\to$ OpenRouter Hub (:free) $\to$ Local Ollama Metal MPS $\to$ Mock Failsafe.
  - Instant $0\text{ ms}$ failover on HTTP 429 quota exhaustion with automatic 5-minute cooldown caching.
- **Frontend Web Unification**:
  - Unified all dashboard components, hardware node inspectors, topology graphs, port matrices, and full Markdown documentation into a single Vue 3 / Vite application in `web/`.
  - Removed redundant `homepage/` subfolder.

### Security
- Removed paid proprietary model providers (OpenAI/ChatGPT and Anthropic/Claude) to eliminate recurring token costs.
- Enforced non-interactive mode and dedicated virtual environments for PEP 668 compliance across Linux distributions.

---

## [2.0.0] - 2026-08-27

### Added
- **ELO Autonomous Sub-Agent Swarm**:
  - `SecOpsThreatHunterAgent`: Automated correlation of Wazuh SIEM and Suricata NIDS logs with OPNsense IP quarantine.
  - `SysAdminOptimizerAgent`: Cluster RAM/CPU telemetry optimization and Docker cache pruning.
  - `SmartHomeEnergyAgent`: Home Assistant power telemetry analysis and idle vampire load detection.
  - `PredictiveHealthAnalyzer`: S.M.A.R.T. disk telemetry monitoring and proactive ZFS snapshot triggering.
- **Persistent Semantic Memory with `pgvector`**:
  - Deterministic 128-dimensional dense vector embeddings with cosine similarity search.
  - Persistent recall of user preferences, VM contexts, and previous incident resolutions.
- **Hardware ESP32 & Physical Room-Awareness**:
  - Microcontroller BLE and mmWave radar telemetry integration over MQTT.
  - Contextual entity resolution across `Birou`, `Living`, `Server Room`, `Dormitor`.
- **Offline Voice Engine on Apple Silicon**:
  - Whisper.cpp STT and Piper TTS with Apple Silicon Metal MPS acceleration.
- **Native macOS Desktop Application**:
  - C# .NET 10 self-contained native application packaged as `ELO-macOS-arm64.dmg`.

---

## [1.0.0] - 2026-08-25

### Added
- Initial Proxmox VE 9.2 hypervisor provisioning with OPNsense virtual router (VM 200) and Alpine Linux server (VM 202).
- Declarative Infrastructure as Code configurations via Terraform and Ansible CIS Level 1 hardening.
- Production deployment of 28 containerized microservices across VLAN 1, 10, 20, 30, and 40.
- Pi-hole DNS sinkhole with local `*.lan` domain resolution.
- 3-2-1 backup strategy with OpenMediaVault NAS and Proxmox Backup Server.
