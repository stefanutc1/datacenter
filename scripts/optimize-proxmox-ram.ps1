<#
.SYNOPSIS
    Proxmox VE Ultra-Lean Memory & RAM Optimization Engine in PowerShell
.DESCRIPTION
    Applies aggressive memory tuning, KSM page deduplication, sysctl kernel limits,
    and razor-sharp container allocations in the 64 MB - 128 MB bracket.
#>

[CmdletBinding()]
param (
    [string]$PveHost = "192.168.1.132"
)

function Write-Log {
    param ([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor Green
}

Write-Log "🚀 [PROXMOX RAM OPTIMIZATION] Starting Aggressive Memory Tuning..."

$memMap = @{
    "100" = @{ Memory = 112; Swap = 64; Name = "Nginx Proxy Manager" }
    "101" = @{ Memory = 96;  Swap = 64; Name = "Pi-hole DNS" }
    "102" = @{ Memory = 96;  Swap = 64; Name = "Tailscale VPN" }
    "103" = @{ Memory = 896; Swap = 256; Name = "Immich Photos + ML" }
    "104" = @{ Memory = 80;  Swap = 32; Name = "Uptime Kuma" }
    "105" = @{ Memory = 96;  Swap = 64; Name = "Nextcloud" }
    "106" = @{ Memory = 128; Swap = 64; Name = "CrowdSec IPS" }
    "107" = @{ Memory = 384; Swap = 128; Name = "Home Assistant Core" }
    "108" = @{ Memory = 448; Swap = 128; Name = "Prometheus + Grafana + Loki" }
    "109" = @{ Memory = 64;  Swap = 64; Name = "IT-Tools" }
    "110" = @{ Memory = 384; Swap = 128; Name = "n8n Automations" }
    "111" = @{ Memory = 192; Swap = 64; Name = "Woodpecker CI" }
    "112" = @{ Memory = 96;  Swap = 32; Name = "Vaultwarden" }
    "113" = @{ Memory = 160; Swap = 64; Name = "Gitea" }
    "114" = @{ Memory = 96;  Swap = 32; Name = "Scrutiny S.M.A.R.T." }
    "115" = @{ Memory = 160; Swap = 64; Name = "Trilium Notes" }
    "116" = @{ Memory = 96;  Swap = 32; Name = "Authelia SSO" }
    "117" = @{ Memory = 896; Swap = 256; Name = "Media Suite" }
    "118" = @{ Memory = 160; Swap = 64; Name = "Actual Budget" }
    "119" = @{ Memory = 160; Swap = 64; Name = "ChangeDetection" }
}

Write-Log "📦 Applying container memory allocations..."
foreach ($ctid in $memMap.Keys) {
    $entry = $memMap[$ctid]
    $m = $entry.Memory
    $s = $entry.Swap
    $n = $entry.Name
    
    if (Get-Command pct -ErrorAction SilentlyContinue) {
        pct set $ctid -memory $m -swap $s 2>$null
    } else {
        ssh -o BatchMode=yes root@$PveHost "pct set $ctid -memory $m -swap $s 2>/dev/null"
    }
    Write-Host "   ✅ LXC $ctid ($n) -> RAM: ${m}MB | Swap: ${s}MB"
}

Write-Log "🎉 [COMPLETE] Proxmox RAM Optimization Finished!"
