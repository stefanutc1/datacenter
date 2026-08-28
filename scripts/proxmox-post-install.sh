#!/usr/bin/env bash
# ==============================================================================
# Proxmox VE Post-Installation Setup, Hardening & Performance Optimization Engine
# Covers:
# 1. Clean APT repos (no-subscription enabled, duplicate/enterprise removed)
# 2. Hardware telemetry (lm-sensors, thermal monitoring)
# 3. WebGUI subscription popup nag removal + persistent DPkg hook
# 4. Kernel TCP BBR, high-throughput buffers, and inotify/file-max tuning
# 5. Intel IOMMU / VT-d PCIe & GPU Passthrough enabling in GRUB
# 6. Systemd Journald log size cap (100MB) to prevent root disk bloat
# 7. SSD TRIM weekly scheduler (fstrim.timer)
# ==============================================================================

set -euo pipefail

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log " [PROXMOX POST-INSTALL] Executing Enterprise Hardening & Performance Tuning..."

# 1. Clean APT Repositories & Configure No-Subscription Repos (PVE + Ceph Squid)
log " [1/7] Configuring Proxmox No-Subscription & Ceph No-Subscription repositories..."
rm -f /etc/apt/sources.list.d/pve-no-subscription.list
rm -f /etc/apt/sources.list.d/pve-enterprise.list
rm -f /etc/apt/sources.list.d/*.bak

cat << 'PVE_SRC' > /etc/apt/sources.list.d/proxmox.sources
Types: deb
URIs: http://download.proxmox.com/debian/pve
Suites: trixie
Components: pve-no-subscription
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
PVE_SRC

cat << 'CEPH_SRC' > /etc/apt/sources.list.d/ceph.sources
Types: deb
URIs: http://download.proxmox.com/debian/ceph-squid
Suites: trixie
Components: no-subscription
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
CEPH_SRC

chmod 644 /etc/apt/sources.list.d/*
apt-get update -qq

# 2. Install Essential Hardware Tools (lm-sensors, htop, iotop, ethtool)
log " [2/7] Installing hardware telemetry & monitoring utilities..."
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq lm-sensors htop iotop ethtool pciutils usbutils

# 3. Patch Subscription Nag Pop-up & Add APT Post-Update Hook
log " [3/7] Patching WebGUI subscription popup nag & creating APT auto-patch hook..."
cat << 'NAG_SCRIPT' > /usr/local/bin/pve-remove-nag.sh
#!/bin/bash
PVE_JS="/usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js"
if [-f "$PVE_JS"]; then
    if grep -q "No valid sub" "$PVE_JS"; then
        sed -Ezi.bak "s/(Ext.Msg.show\(\{\s+title: gettext\('No valid sub)/void\(\{ \/\/\1/g" "$PVE_JS"
        systemctl restart pveproxy.service >/dev/null 2>&1 || true
    fi
fi
NAG_SCRIPT
chmod +x /usr/local/bin/pve-remove-nag.sh
/usr/local/bin/pve-remove-nag.sh

echo 'DPkg::Post-Invoke { "/usr/local/bin/pve-remove-nag.sh || true"; };' > /etc/apt/apt.conf.d/99-pve-remove-nag
log "    Subscription nag popup patched and DPkg hook configured!"

# 4. Enable TCP BBR Congestion Control & High-Performance Sysctl
log " [4/7] Enabling TCP BBR Congestion Control & Network Optimization..."
cat << 'SYSCTL' > /etc/sysctl.d/99-pve-performance.conf
# TCP BBR Congestion Control & Queueing
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr

# IPv4 Routing & Forwarding for LXC/VM Bridges
net.ipv4.ip_forward = 1
net.ipv4.conf.all.forwarding = 1
net.ipv6.conf.all.forwarding = 1

# High Throughput Network Buffer Limits
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216

# File Descriptors & Inotify Watchers for Containers
fs.file-max = 2097152
fs.inotify.max_user_watches = 524288
fs.inotify.max_user_instances = 2048
SYSCTL
sysctl -p /etc/sysctl.d/99-pve-performance.conf

# 5. Enable Intel IOMMU & VT-d in GRUB for PCIe / GPU Passthrough
log " [5/7] Configuring IOMMU (VT-d) in GRUB cmdline..."
if [-f /etc/default/grub]; then
    if ! grep -q "intel_iommu=on" /etc/default/grub; then
        sed -i 's/GRUB_CMDLINE_LINUX_DEFAULT="quiet"/GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt"/' /etc/default/grub
        update-grub || true
        log "    GRUB updated with intel_iommu=on iommu=pt"
    else
        log "    IOMMU already present in GRUB configuration."
    fi
fi

# 6. Configure Systemd Journald Log Retention (Max 100MB)
log " [6/7] Restricting Systemd Journald log size to 100MB..."
mkdir -p /etc/systemd/journald.conf.d
cat << 'JOURNAL' > /etc/systemd/journald.conf.d/00-journal-size.conf
[Journal]
SystemMaxUse=100M
SystemMaxFileSize=20M
RuntimeMaxUse=50M
MaxRetentionSec=1month
JOURNAL
systemctl restart systemd-journald

# 7. Ensure SSD fstrim.timer is Active & Trigger Immediate Trim
log " [7/7] Verifying SSD fstrim timer and executing discard..."
systemctl enable --now fstrim.timer
fstrim -av || true

log " [COMPLETE] Proxmox VE Post-Installation Hardening Finished Successfully!"
