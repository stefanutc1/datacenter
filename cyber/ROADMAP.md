# Roadmap

This document outlines the current state of the cybersecurity and infrastructure hardening laboratory and the direction it is heading. It is maintained as a living reference — reviewed and updated as priorities shift, tooling matures, and new requirements emerge.

The scope of this roadmap is limited to the **hardening, security baselines, and audit automation layer**.

---

## Current State

The cyberlab currently operates as an isolated, declarative local laboratory with the following characteristics:

* **Host Environment**: macOS (Apple Silicon) acting as the host hypervisor using **UTM**, running virtualized **Ubuntu Server** nodes.
* **Deployment Model**: Configuration management and security baselines are enforced declaratively via **Ansible** playbooks.
* **Security Baselines**: Automated enforcement of perimeter defense (UFW), brute-force prevention (Fail2ban), system updates (`unattended-upgrades`), and File Integrity Monitoring (Auditd).
* **Audit & Validation**: Local system auditing via custom shell scripts and automated YAML/Ansible linting via CI pipelines.
* **Version Control & CI/CD**: Managed via Git, utilizing local and remote workflows for syntax checks and deployment simulation.

This foundation prioritizes reproducibility, security baselines, and local isolation over scale — ensuring a secure, testable environment for infrastructure hardening.

---

## Planned Improvements

The following improvements are scoped to strengthening the security posture, automation maturity, and observability of the lab environment.

### Automated Vulnerability & Compliance Auditing

* Integrate automated compliance scanning tools (e.g., OpenSCAP or Lynis) into the Ansible workflow to regularly assess systems against CIS benchmarks.
* Expand local audit scripts to automatically flag configuration drift across virtual nodes.

### Advanced Intrusion Detection & Log Aggregation

* Deploy a centralized log collection mechanism to stream Auditd and Fail2ban logs away from target nodes.
* Evaluate lightweight intrusion detection systems (IDS) to monitor network traffic across the isolated UTM bridge interface.

### Hardening Automation & CI/CD Expansion

* Expand Ansible coverage to automate a complete node rebuild from a fresh cloud-init instance to a fully hardened state.
* Strengthen CI pipelines to run dry-run simulations of hardening playbooks against containerized or virtual test targets before application.

### Infrastructure Documentation as a Portfolio Artifact

* Maintain documentation (`README.md`, `CONTRIBUTING.md`, this roadmap) to professional standards suitable for peer review and security auditing demonstrations.
* Periodically update the roadmap to reflect completed hardening milestones.

---

*Last reviewed: this document should be updated whenever a planned security improvement is completed or priorities shift — treat it as a snapshot of intent, not a fixed contract.*
