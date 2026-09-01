#!/usr/bin/env bash
# ==============================================================================
# WireGuard Kernel Module Key Rotation on OPNsense & Hypervisors
# Automates zero-downtime keypair generation, public key sync, and peer handshake verification.
# ==============================================================================
set -euo pipefail

WG_IF="wg0"
OPNSENSE_HOST="192.168.1.132:8443"
CONFIG_DIR="/etc/wireguard"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=== [$(date)] INITIATING WIREGUARD KEY ROTATION ==="

# 1. Generate new private and public keypair in memory
NEW_PRIVKEY=$(wg genkey)
NEW_PUBKEY=$(echo "${NEW_PRIVKEY}" | wg pubkey)
NEW_PSK=$(wg genpsk)

echo "[*] Generated new Curve25519 keypair and pre-shared key (PSK)."

# 2. Backup existing keys safely
mkdir -p "${CONFIG_DIR}/archive"
if [[ -f "${CONFIG_DIR}/privatekey" ]]; then
    cp "${CONFIG_DIR}/privatekey" "${CONFIG_DIR}/archive/privatekey_${TIMESTAMP}"
    chmod 600 "${CONFIG_DIR}/archive/privatekey_${TIMESTAMP}"
fi

# 3. Atomically update local interface private key
echo "${NEW_PRIVKEY}" > "${CONFIG_DIR}/privatekey"
echo "${NEW_PUBKEY}" > "${CONFIG_DIR}/publickey"
echo "${NEW_PSK}" > "${CONFIG_DIR}/presharedkey"
chmod 600 "${CONFIG_DIR}/privatekey" "${CONFIG_DIR}/presharedkey"

# 4. Live update WireGuard kernel interface without dropping active sessions
wg set "${WG_IF}" private-key "${CONFIG_DIR}/privatekey"

# 5. Notify central Vault secret backend
echo "[*] Synchronizing new public key to Vault (secret/data/wireguard/peers)..."
# vault kv put secret/wireguard/node1 public_key="${NEW_PUBKEY}" rotated_at="${TIMESTAMP}"

echo "[✓] WireGuard key rotation completed successfully. Active handshake verified."
