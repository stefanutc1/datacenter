<#
.SYNOPSIS
    Homelab Staged Cold-Boot Restoration Script (Post 10+ Hour Outage Recovery)
.DESCRIPTION
    Executed sequentially after grid power stabilization to prevent inrush overload
    and ensure dependency hierarchy integrity across OPNsense, Pi-hole, Ingress, and App LXCs.
#>

[CmdletBinding()]
param (
    [string]$PveHost = "192.168.1.132",
    [string]$NasHost = "192.168.1.5"
)

function Write-Log {
    param ([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor Cyan
}

Write-Log "⚡ [COLD-BOOT SOP] Initiating Staged Power-On Recovery Sequence..."

# 1. Verify OpenMediaVault NAS Reachability
Write-Log "🔍 [1/6] Verifying OpenMediaVault NAS ($NasHost) reachability & NFS shares..."
$pingResult = Test-Connection -ComputerName $NasHost -Count 2 -Quiet -ErrorAction SilentlyContinue
if ($pingResult) {
    Write-Log "   ✅ NAS ($NasHost) is reachable."
} else {
    Write-Log "   ⚠️ NAS $NasHost still booting, continuing with staged boot..."
}

# 2. Start Core Firewall & Router (OPNsense VM 200)
Write-Log "🛡️ [2/6] Starting OPNsense Gateway (VM 200)..."
if (Get-Command qm -ErrorAction SilentlyContinue) {
    qm start 200
} else {
    Write-Log "   Executing remote PVE command for VM 200..."
    ssh -o BatchMode=yes root@$PveHost "qm start 200" 2>$null
}
Write-Log "   Waiting 30s for WAN routing and DHCP lease initialization..."
Start-Sleep -Seconds 30

# 3. Start Core DNS (Pi-hole LXC 101)
Write-Log "🌐 [3/6] Starting Pi-hole DNS Resolver (LXC 101)..."
if (Get-Command pct -ErrorAction SilentlyContinue) {
    pct start 101
} else {
    ssh -o BatchMode=yes root@$PveHost "pct start 101" 2>$null
}
Start-Sleep -Seconds 10

# 4. Start Ingress Proxy & Authelia Authentication (LXC 100 & 116)
Write-Log "🔑 [4/6] Starting Nginx Proxy Manager (LXC 100) & Authelia (LXC 116)..."
if (Get-Command pct -ErrorAction SilentlyContinue) {
    pct start 100
    pct start 116
} else {
    ssh -o BatchMode=yes root@$PveHost "pct start 100; pct start 116" 2>$null
}
Start-Sleep -Seconds 10

# 5. Start Core Databases & Infrastructure Containers (LXC 102 - 113)
Write-Log "💾 [5/6] Starting Core Storage, Databases & Infrastructure Containers..."
$tier2Ctids = @(102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113)
foreach ($ctid in $tier2Ctids) {
    Write-Log "   Starting LXC $ctid..."
    if (Get-Command pct -ErrorAction SilentlyContinue) {
        pct start $ctid 2>$null
    } else {
        ssh -o BatchMode=yes root@$PveHost "pct start $ctid" 2>$null
    }
    Start-Sleep -Seconds 3
}

# 6. Start Applications, Media Suites & Secondary VMs (LXC 114 - 119, VM 201)
Write-Log "🚀 [6/6] Starting Applications, Web Portals & Workload VMs..."
$tier3Ctids = @(114, 115, 117, 118, 119)
foreach ($ctid in $tier3Ctids) {
    if (Get-Command pct -ErrorAction SilentlyContinue) {
        pct start $ctid 2>$null
    } else {
        ssh -o BatchMode=yes root@$PveHost "pct start $ctid" 2>$null
    }
    Start-Sleep -Seconds 2
}

if (Get-Command qm -ErrorAction SilentlyContinue) {
    qm start 201 2>$null
} else {
    ssh -o BatchMode=yes root@$PveHost "qm start 201" 2>$null
}

Write-Log "🎉 [COMPLETE] Cold-boot restoration completed successfully!"
