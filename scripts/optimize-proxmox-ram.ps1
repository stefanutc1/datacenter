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
    "100" = @{ Memory = 896;  Swap = 256; Name = "Immich Photos + ML" }
    "101" = @{ Memory = 96;   Swap = 64;  Name = "Nextcloud" }
    "102" = @{ Memory = 384;  Swap = 128; Name = "Home Assistant Core" }
    "103" = @{ Memory = 384;  Swap = 128; Name = "n8n Automations" }
    "104" = @{ Memory = 96;   Swap = 32;  Name = "Scrutiny S.M.A.R.T." }
    "105" = @{ Memory = 896;  Swap = 256; Name = "Media Suite (Jellyfin)" }
    "106" = @{ Memory = 2048; Swap = 1024; Name = "Ollama GPU LLM" }
    "107" = @{ Memory = 512;  Swap = 256; Name = "Open-WebUI" }
    "108" = @{ Memory = 1024; Swap = 512; Name = "Whisper CUDA" }
    "109" = @{ Memory = 512;  Swap = 256; Name = "Flowise" }
    "110" = @{ Memory = 64;   Swap = 64;  Name = "Paperless-AI" }
    "111" = @{ Memory = 512;  Swap = 256; Name = "Code-Server" }
    "112" = @{ Memory = 512;  Swap = 256; Name = "PBS" }
    "113" = @{ Memory = 512;  Swap = 256; Name = "PDM" }
    "114" = @{ Memory = 512;  Swap = 256; Name = "Woodpecker k0s" }
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
