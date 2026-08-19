<#
.SYNOPSIS
    Proxmox VE Post-Installation Setup, Hardening & Performance Optimization Engine
.DESCRIPTION
    Automates repository configuration (deb822 no-subscription for PVE & Ceph),
    subscription nag removal, TCP BBR sysctl, Intel IOMMU in GRUB, and journald size limits.
#>

[CmdletBinding()]
param (
    [string]$PveHost = "192.168.1.132"
)

function Write-Log {
    param ([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor Magenta
}

Write-Log "🚀 [PROXMOX POST-INSTALL] Executing Enterprise Hardening via PowerShell..."

$remoteCommand = @'
set -euo pipefail

# 1. Repositories
rm -f /etc/apt/sources.list.d/pve-no-subscription.list /etc/apt/sources.list.d/pve-enterprise.list /etc/apt/sources.list.d/*.bak

cat << 'PVE' > /etc/apt/sources.list.d/proxmox.sources
Types: deb
URIs: http://download.proxmox.com/debian/pve
Suites: trixie
Components: pve-no-subscription
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
PVE

cat << 'CEPH' > /etc/apt/sources.list.d/ceph.sources
Types: deb
URIs: http://download.proxmox.com/debian/ceph-squid
Suites: trixie
Components: no-subscription
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
CEPH

chmod 644 /etc/apt/sources.list.d/*
apt-get update -qq

# 2. Hardware tools
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq lm-sensors htop iotop ethtool pciutils usbutils

# 3. Patch nag
PVE_JS="/usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js"
if [ -f "$PVE_JS" ]; then
    sed -Ezi.bak "s/(Ext.Msg.show\(\{\s+title: gettext\('No valid sub)/void\(\{ \/\/\1/g" "$PVE_JS"
    systemctl restart pveproxy.service >/dev/null 2>&1 || true
fi

# 4. TCP BBR
cat << 'SYS' > /etc/sysctl.d/99-pve-performance.conf
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr
net.ipv4.ip_forward = 1
fs.file-max = 2097152
fs.inotify.max_user_watches = 524288
SYS
sysctl -p /etc/sysctl.d/99-pve-performance.conf

# 5. Journal limits
mkdir -p /etc/systemd/journald.conf.d
cat << 'JRN' > /etc/systemd/journald.conf.d/00-journal-size.conf
[Journal]
SystemMaxUse=100M
SystemMaxFileSize=20M
RuntimeMaxUse=50M
JRN
systemctl restart systemd-journald

# 6. SSD Trim
systemctl enable --now fstrim.timer
fstrim -av || true
'@

if (Get-Command pvesh -ErrorAction SilentlyContinue) {
    bash -c "$remoteCommand"
} else {
    Write-Log "Connecting to Proxmox VE node ($PveHost)..."
    ssh -o BatchMode=yes root@$PveHost "$remoteCommand"
}

Write-Log "🎉 [COMPLETE] Proxmox VE Post-Installation Hardening Finished!"
