# 🛡️ Security Policy & Zero-Plaintext Standard

## 🔐 Zero-Plaintext Credential Standards

This repository adheres strictly to **Zero-Plaintext Secret Management**:
- **No Hardcoded Passwords:** All services consume secrets through runtime environment variables (`.env`), HashiCorp Vault, or Vaultwarden bitwarden instances.
- **SSH Key Authentication:** Password authentication is disabled across all virtual machines and LXC containers in favor of `ed25519` cryptographic keys.
- **Automated Secret Scanning:** Pre-commit hooks and CI pipelines enforce Gitleaks and TruffleHog checks against every push.

---

## 🔒 Secret Management Architecture

| Component | Secret Provider | Injection Mechanism |
| :--- | :--- | :--- |
| **LXC Containers** | Environment Variables (`.env`) | Docker Compose runtime variables |
| **KVM Virtual Machines** | Cloud-Init Metadata | Encrypted Vault / CI Metadata |
| **SSO & Identity** | Authentik / Authelia | Encrypted PostgreSQL backend |
| **Backups & NAS** | OpenMediaVault NFS | Restricted subnet & MAC binding |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or accidental secret exposure:
1. Do **NOT** open a public issue.
2. Submit a confidential report or contact the administrator directly.
3. In case of credential rotation, immediately run the credential revocation pipeline in Vaultwarden.
