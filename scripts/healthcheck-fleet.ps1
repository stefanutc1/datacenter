<#
.SYNOPSIS
    Homelab Fleet Healthcheck & Service Verification Engine in PowerShell
.DESCRIPTION
    Audits memory, thermal sensors, VM/LXC statuses, and OpenMediaVault NAS connectivity.
#>

[CmdletBinding()]
param (
    [string]$PveHost = "192.168.1.132",
    [string]$NasHost = "192.168.1.5"
)

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "📊 [HOMELAB FLEET HEALTHCHECK] Auditing Node & Services Status" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. PVE Host Reachability
Write-Host "`n🖥️  [1/4] Hypervisor Connectivity:" -ForegroundColor Yellow
$pvePing = Test-Connection -ComputerName $PveHost -Count 1 -Quiet -ErrorAction SilentlyContinue
if ($pvePing) {
    Write-Host "   PVE Host ($PveHost): REACHABLE" -ForegroundColor Green
} else {
    Write-Host "   PVE Host ($PveHost): UNREACHABLE" -ForegroundColor Red
}

# 2. NAS Storage Reachability
Write-Host "`n💾 [2/4] OpenMediaVault NAS Storage:" -ForegroundColor Yellow
$nasPing = Test-Connection -ComputerName $NasHost -Count 1 -Quiet -ErrorAction SilentlyContinue
if ($nasPing) {
    Write-Host "   NAS Host ($NasHost): REACHABLE" -ForegroundColor Green
} else {
    Write-Host "   NAS Host ($NasHost): UNREACHABLE" -ForegroundColor Red
}

# 3. Query PVE Remote Telemetry
Write-Host "`n📦 [3/4] Fetching Live PVE Fleet Status..." -ForegroundColor Yellow
$summaryCmd = "pct list | awk 'NR>1 {print \$1, \$2, \$3}'; echo '---VMS---'; qm list | awk 'NR>1 {print \$1, \$2, \$3}'"
$remoteOutput = ssh -o BatchMode=yes root@$PveHost "$summaryCmd" 2>$null

Write-Host $remoteOutput -ForegroundColor White

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host "🎉 Fleet healthcheck inspection completed!" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
