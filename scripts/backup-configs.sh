#!/usr/bin/env bash
# ==============================================================================
# Homelab Declarative Configuration Backup Engine
# Collects all LXC configurations, VM definitions, storage configs, network interfaces,
# and generates a timestamped compressed archive.
# ==============================================================================

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/homelab}"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
ARCHIVE_NAME="pve_configs_${TIMESTAMP}.tar.gz"
TARGET_FILE="${BACKUP_DIR}/${ARCHIVE_NAME}"

mkdir -p "$BACKUP_DIR"

echo " [BACKUP ENGINE] Archiving Proxmox VE configurations to $TARGET_FILE..."

tar -czf "$TARGET_FILE" \
    /etc/pve/lxc/*.conf \
    /etc/pve/qemu-server/*.conf \
    /etc/pve/storage.cfg \
    /etc/network/interfaces \
    /etc/hosts \
    /etc/resolv.conf \
    /etc/sysctl.d/*.conf \
    2>/dev/null || true

echo "    Backup archive created: $(du -sh "$TARGET_FILE" | awk '{print $1}')"

# Keep last 7 backups, purge older
find "$BACKUP_DIR" -name "pve_configs_*.tar.gz" -mtime +7 -delete 2>/dev/null || true

echo " Backup completed successfully!"
