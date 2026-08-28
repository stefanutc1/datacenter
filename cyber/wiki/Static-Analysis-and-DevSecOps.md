# Static Analysis & DevSecOps

## 1. Semgrep SAST Analysis (`audit/semgrep/`, `scripts/run_semgrep_sast.sh`)

Runs custom rules targeting security flaws in IaC templates, Dockerfiles, and Python scripts:
- Insecure Dockerfile `USER root` declarations.
- Weak SSH cipher definitions in Terraform / Ansible templates.
- Dangerous Python subprocess invocations with `shell=True`.

## 2. Trivy Container & Filesystem Scanning (`scripts/trivy_security_scan.sh`)

Scans container images and filesystem directories for known CVEs against the NVD database.

## 3. TruffleHog Secrets Detection (`scripts/trufflehog_scan.sh`)

Scans Git commit history for leaked API tokens, private keys, and hardcoded credentials.
