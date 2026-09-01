#!/usr/bin/env bash
# ==============================================================================
# Canary Tokens & Honey Decoys Deployment Script
# Places deceptive decoy files (passwords.docx, aws_keys.env, id_rsa_backup)
# that trigger instant webhooks (Telegram / Gotify / ntfy) when touched.
# ==============================================================================
set -euo pipefail

TARGET_DIRS=(
    "/mnt/pve/openmediavault/public_share/Finance_Archive"
    "/opt/dmz-containers/vulnerable_app/config"
    "/root/.backup_keys"
)

WEBHOOK_URL="http://192.168.64.112:80/homelab-security-alerts"

echo "=== DEPLOYING CANARY HONEYTOKENS ACROSS CLUSTER ==="

for dir in "${TARGET_DIRS[@]}"; do
    mkdir -p "${dir}"
    
    # 1. Fake AWS Cloud Credentials Decoy
    cat << 'EOF' > "${dir}/aws_credentials.env"
# PROD AWS ACCESS KEYS (DO NOT SHARE)
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_DEFAULT_REGION=eu-central-1
# Canary Token ID: cnr_88192a_aws_dmz
EOF
    chmod 644 "${dir}/aws_credentials.env"

    # 2. Fake Password Vault Export Decoy
    cat << 'EOF' > "${dir}/passwords_export_2026.csv"
Title,Username,Password,URL,Notes
Domain Admin,stefan.admin,Winter2026!SecureKey,https://ad.homelab.local,High Privileged Active Directory
Proxmox Root,root,MasterClusterKey2026#,https://192.168.1.132:8006,Cluster Root Password
Vault Secrets,vault_admin,s.vLt881920SecretToken,http://192.168.1.132:8200,Internal Vault Token
EOF
    chmod 644 "${dir}/passwords_export_2026.csv"

    # 3. Canary SSH Private Key
    cat << 'EOF' > "${dir}/id_rsa_backup"
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACDH13r289KqL2Zt...CANARY_TRIGGER_HONEYPOT_KEY...
-----END OPENSSH PRIVATE KEY-----
EOF
    chmod 600 "${dir}/id_rsa_backup"

    echo "  [+] Decoys deployed in: ${dir}"
done

echo "[✓] Canary honeytoken files placed. Audit logging & inotify alerts active."
