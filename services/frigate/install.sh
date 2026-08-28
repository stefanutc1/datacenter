#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Service:     Frigate
# Description: Proxmox VE LXC install script from community-scripts.org
# Source:      https://community-scripts.org/scripts/frigate
# Repository:  https://github.com/community-scripts/ProxmoxVE
# License:     MIT
# ---------------------------------------------------------------------------
# Usage:
#   Run directly on a Proxmox VE node:
#     bash -c "$(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/ct/frigate.sh)"
#
#   Or execute this script:
#     bash install.sh
# ---------------------------------------------------------------------------

set -euo pipefail

APP_NAME="Frigate"
SCRIPT_URL="https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/ct/frigate.sh"
SCRIPT_PAGE="https://community-scripts.org/scripts/frigate"

echo "========================================"
echo " ${APP_NAME} -- Proxmox VE LXC Installer"
echo " Source: community-scripts.org"
echo "========================================"
echo ""

# Verify Proxmox VE environment
if ! command -v pveversion &>/dev/null; then
  echo "[WARNING] Proxmox VE not detected on this system."
  echo "This script is designed to run on a Proxmox VE node."
  echo ""
  echo "To install ${APP_NAME} via Docker instead, use:"
  echo "  docker compose up -d"
  echo ""
  echo "For LXC installation, run this on your Proxmox VE node:"
  echo "  bash -c \"\$(curl -fsSL ${SCRIPT_URL})\""
  echo ""
  read -rp "Continue anyway? (y/N): " confirm
  if [[ ! "${confirm}" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
  fi
fi

echo "Fetching installer from community-scripts.org ..."
echo "URL: ${SCRIPT_URL}"
echo ""

bash -c "$(curl -fsSL "${SCRIPT_URL}")"
