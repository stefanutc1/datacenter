#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Service:     OPNsense
# Description: Installation guidance for OPNsense firewall appliance
# Note:        OPNsense is NOT available as an LXC container or Docker image.
#              It must be installed as a dedicated virtual machine.
# Download:    https://opnsense.org/download/
# ---------------------------------------------------------------------------
# Usage:
#   This script provides installation guidance only.
#   OPNsense cannot be deployed via LXC or Docker.
#
#   Run this script for instructions:
#     bash install.sh
# ---------------------------------------------------------------------------

set -euo pipefail

APP_NAME="OPNsense"

echo "========================================"
echo " ${APP_NAME} -- Installation Guide"
echo "========================================"
echo ""
echo "OPNsense is a full firewall and routing platform based on FreeBSD."
echo "It is NOT available as:"
echo "  - An LXC container (community-scripts.org does not provide one)"
echo "  - A Docker container"
echo ""
echo "OPNsense MUST be installed as a dedicated virtual machine on Proxmox VE."
echo ""
echo "Installation Steps:"
echo "  1. Download the OPNsense ISO from:"
echo "     https://opnsense.org/download/"
echo ""
echo "  2. Upload the ISO to your Proxmox VE storage"
echo "     (Datacenter -> Storage -> ISO Images -> Upload)"
echo ""
echo "  3. Create a new VM in Proxmox VE with the following recommended settings:"
echo "     - OS Type: Other"
echo "     - CPU: 2+ cores"
echo "     - Memory: 2048 MB minimum (4096 MB recommended)"
echo "     - Disk: 16 GB minimum (32 GB recommended)"
echo "     - Network: At least 2 network interfaces (WAN + LAN)"
echo ""
echo "  4. Mount the OPNsense ISO and boot the VM"
echo ""
echo "  5. Follow the OPNsense installer prompts"
echo ""
echo "For detailed documentation, visit:"
echo "  https://docs.opnsense.org/"
echo ""
echo "The docker-compose.yml in this directory is NOT for OPNsense itself."
echo "It may contain supporting services related to the OPNsense deployment."
echo ""
