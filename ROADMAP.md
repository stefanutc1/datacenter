# Roadmap

This document outlines the current state of the infrastructure and the direction it is heading. It is maintained as a living reference — reviewed and updated as priorities shift, services mature, and new requirements emerge.

The scope of this roadmap is limited to the **services layer**.

---

## Current State

The homelab currently operates as a modular, service-oriented infrastructure with the following characteristics:

- **Deployment model**: Services are defined declaratively via Docker Compose, one directory per service under `/services`, with lifecycle management (provisioning, deployment, updates) handled through Ansible playbooks.
- **Configuration management**: Host inventory and variables are managed through Ansible's inventory system, enabling role-based targeting of hosts rather than manual, host-by-host operations.
- **Secrets handling**: Environment-specific secrets are isolated via `.env` files (git-ignored) and Ansible Vault for anything consumed during automated deployment, keeping credentials out of version control entirely.
- **Separation of concerns**: This repository is intentionally scoped to services only. Network infrastructure (OPNsense, VLANs, firewall rules) is managed independently, allowing each layer to evolve without introducing tight coupling.
- **Single-node operation**: Services currently run on a single Docker host (or a small, manually coordinated set of hosts), with no automated failover.
- **Manual backup practices**: Persistent volume data is backed up on an ad hoc or manually scheduled basis rather than through a unified, automated backup pipeline.

This foundation prioritizes clarity and reproducibility over scale — a deliberate choice, since the near-term goal is a system that is easy to reason about and safely extend, not a system optimized prematurely for load it doesn't yet carry.

---

## Planned Improvements

The following improvements are scoped to strengthening reliability, observability, and operational maturity of the existing services layer.

### High Availability (HA)

- Introduce multi-node Docker orchestration (evaluating Docker Swarm vs. a lightweight Kubernetes distribution such as K3s) for services where downtime tolerance is low.
- Identify which services genuinely benefit from HA versus which are acceptable as single-instance (not every homelab service justifies the added complexity).
- Implement health checks at the Compose level as a prerequisite step, ensuring services can be automatically restarted or flagged before full HA is introduced.

### Automated Backups

- Replace ad hoc backup practices with a scheduled, automated pipeline (e.g., Restic or Borg) targeting all declared persistent volumes.
- Define a consistent retention policy (daily/weekly/monthly rotation) applied uniformly across services, rather than per-service improvisation.
- Store backups off-host at minimum, with an offsite/cloud-encrypted copy as a stretch goal.
- Add periodic restore testing to the roadmap itself — a backup that has never been restored is not yet a verified backup.

### Monitoring & Observability Stack

- Deploy a centralized monitoring stack (Prometheus + Grafana, or an equivalent) as a first-class service within `/services`.
- Instrument existing services with exporters where available, prioritizing host-level metrics (CPU, memory, disk) before deeper application-level metrics.
- Introduce centralized log aggregation (e.g., Loki or an ELK-family stack) to reduce reliance on `docker logs` for troubleshooting.
- Define alerting thresholds for the most operationally significant failure modes (disk pressure, container restart loops, backup job failures) before expanding to broader alerting coverage.

### Configuration & Deployment Maturity

- Expand Ansible playbook coverage so that a full host rebuild (from bare OS to fully deployed services) is achievable through automation alone, minimizing manual recovery steps.
- Introduce basic CI validation (lint Compose files, validate Ansible playbook syntax) to catch configuration errors before they reach a deploy step.

---


### Cross-Repo Automation with the Networking Repository
- Investigate a shared, minimal "contract" (e.g., a machine-readable manifest of exposed ports/hostnames per service) that the networking repository can consume, preserving separation of concerns while reducing manual coordination between the two layers.

### Secrets Management Evolution

- Evaluate migrating from Ansible Vault toward a dedicated secrets manager (e.g., HashiCorp Vault) as the number of services and hosts grows, particularly if dynamic secret rotation becomes valuable.

### Infrastructure Documentation as a Portfolio Artifact

- Maintain this repository's documentation (`README.md`, `CONTRIBUTING.md`, this roadmap) at a standard suitable for external review, treating documentation quality as a deliverable alongside the infrastructure itself.
- Periodically revisit the roadmap to retire completed items into a changelog, keeping this document focused on what's ahead rather than accumulating historical clutter.

---

*Last reviewed: this document should be updated whenever a planned improvement is completed or priorities shift — treat it as a snapshot of intent, not a fixed contract.*
