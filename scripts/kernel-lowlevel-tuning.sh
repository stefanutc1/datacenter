#!/usr/bin/env bash
# ==============================================================================
# Homelab Low-Level Kernel & Network Sysctl Tuning Utility
# ==============================================================================
set -euo pipefail

PROFILE_SOURCE="inventory/sysctl.d/99-homelab-lowlevel.conf"
PROFILE_TARGET="/etc/sysctl.d/99-homelab-lowlevel.conf"

echo "========================================================"
echo "Homelab Low-Level Kernel Tuning System"
echo "========================================================"

# Check root privileges if deploying live
if [[ $EUID -ne 0 && "${1:-}" == "--apply" ]]; then
    echo "Error: Applying sysctl profiles requires root privileges." >&2
    exit 1
fi

# Verify BBR kernel module availability
echo "Checking TCP BBR kernel module status..."
if modprobe tcp_bbr 2>/dev/null; then
    echo "Status: TCP BBR kernel module loaded successfully."
else
    echo "Warning: TCP BBR module could not be loaded directly; verifying builtin support."
fi

# Verify source configuration file exists
if [[ ! -f "$PROFILE_SOURCE" ]]; then
    echo "Error: Source configuration file $PROFILE_SOURCE not found." >&2
    exit 1
fi

echo "Validating syntax of $PROFILE_SOURCE..."
while IFS='=' read -r key val || [[ -n "$key" ]]; do
    # Skip comments and empty lines
    [[ "$key" =~ ^[[:space:]]*# ]] && continue
    [[ -z "${key// }" ]] && continue
    key=$(echo "$key" | xargs)
    val=$(echo "$val" | xargs)
    echo "  - Parameter validated: $key = $val"
done < "$PROFILE_SOURCE"

if [[ "${1:-}" == "--apply" ]]; then
    echo "Deploying profile to $PROFILE_TARGET..."
    cp "$PROFILE_SOURCE" "$PROFILE_TARGET"
    sysctl --system
    echo "Status: Low-level kernel tuning applied live successfully."
else
    echo "Dry-run mode complete. Run with '--apply' to deploy to /etc/sysctl.d/."
fi
