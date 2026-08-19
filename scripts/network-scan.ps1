<#
.SYNOPSIS
    Fast Subnet Discovery Scanner in PowerShell
.DESCRIPTION
    Scans the homelab subnet (192.168.1.0/24) and reports all online endpoints.
#>

[CmdletBinding()]
param (
    [string]$SubnetPrefix = "192.168.1"
)

Write-Host "🔎 [NETWORK SCAN] Scanning active hosts on ${SubnetPrefix}.0/24..." -ForegroundColor Cyan
Write-Host ("{0,-18} {1,-12}" -f "IP ADDRESS", "STATUS")
Write-Host ("-" * 32)

1..254 | ForEach-Object -Parallel {
    $ip = "$($using:SubnetPrefix).$_"
    if (Test-Connection -ComputerName $ip -Count 1 -Quiet -ErrorAction SilentlyContinue) {
        Write-Host ("{0,-18} {1,-12}" -f $ip, "ONLINE") -ForegroundColor Green
    }
} -ThrottleLimit 50

Write-Host ("-" * 32)
Write-Host "🎉 Network scan finished!" -ForegroundColor Green
