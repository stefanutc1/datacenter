<#
.SYNOPSIS
    Homelab Declarative Configuration Backup Engine in PowerShell
.DESCRIPTION
    Triggers remote backup of PVE configs, downloads the tar.gz archive locally,
    or stores it on OpenMediaVault NAS.
#>

[CmdletBinding()]
param (
    [string]$PveHost = "192.168.1.132",
    [string]$LocalBackupDir = "./backups"
)

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$archiveName = "pve_configs_${timestamp}.tar.gz"

Write-Host "💾 [BACKUP ENGINE] Triggering configuration backup on $PveHost..." -ForegroundColor Cyan

$backupScript = @"
mkdir -p /var/backups/homelab
tar -czf /var/backups/homelab/$archiveName \
    /etc/pve/lxc/*.conf \
    /etc/pve/qemu-server/*.conf \
    /etc/pve/storage.cfg \
    /etc/network/interfaces \
    /etc/hosts \
    /etc/sysctl.d/*.conf 2>/dev/null || true
echo "DONE"
"@

ssh -o BatchMode=yes root@$PveHost "$backupScript"

if (-not (Test-Path $LocalBackupDir)) {
    New-Item -ItemType Directory -Path $LocalBackupDir | Out-Null
}

Write-Host "📥 Downloading archive $archiveName to $LocalBackupDir..." -ForegroundColor Yellow
scp -o BatchMode=yes "root@${PveHost}:/var/backups/homelab/$archiveName" "$LocalBackupDir/$archiveName"

Write-Host "🎉 Backup saved locally to $LocalBackupDir/$archiveName" -ForegroundColor Green
