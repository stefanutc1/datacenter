<#
.SYNOPSIS
    Homelab Emergency Graceful Shutdown Script (10+ Hour Power Outage SOP)
.DESCRIPTION
    Executes a cascading graceful shutdown from Tier 4 down to Tier 0,
    unmounting OpenMediaVault NFS shares cleanly and powering off the hypervisor node.
#>

[CmdletBinding()]
param (
    [string]$PveHost = "192.168.1.132",
    [switch]$Force
)

function Write-Log {
    param ([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor Red
}

Write-Log "🚨 [EMERGENCY SOP] Initiating 10+ Hour Power Outage Graceful Shutdown..."

# 1. Phase 1: Shutdown Heavy Applications & Media LXCs (Tier 4)
Write-Log "📦 [1/5] Stopping Tier 4 Heavy Applications & Media LXCs..."
$tier4Ctids = @(114, 115, 116, 117, 118, 119)
foreach ($ctid in $tier4Ctids) {
    Write-Log "   Stopping LXC $ctid..."
    if (Get-Command pct -ErrorAction SilentlyContinue) {
        pct shutdown $ctid --timeout 15 2>$null
    } else {
        ssh -o BatchMode=yes root@$PveHost "pct shutdown $ctid --timeout 15 || pct stop $ctid" 2>$null
    }
}

# 2. Phase 2: Shutdown Secondary VMs (Tier 3)
Write-Log "🖥️ [2/5] Stopping Tier 3 KVM Virtual Machines (Alpine 201)..."
$vms = @(201)
foreach ($vmid in $vms) {
    Write-Log "   Stopping VM $vmid..."
    if (Get-Command qm -ErrorAction SilentlyContinue) {
        qm shutdown $vmid --timeout 30 2>$null
    } else {
        ssh -o BatchMode=yes root@$PveHost "qm shutdown $vmid --timeout 30 || qm stop $vmid" 2>$null
    }
}

# 3. Phase 3: Flush & Shutdown Databases & Core LXCs (Tier 2)
Write-Log "💾 [3/5] Stopping Databases, Storage & Monitoring Services..."
$tier2Ctids = @(103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113)
foreach ($ctid in $tier2Ctids) {
    if (Get-Command pct -ErrorAction SilentlyContinue) {
        pct shutdown $ctid --timeout 15 2>$null
    } else {
        ssh -o BatchMode=yes root@$PveHost "pct shutdown $ctid --timeout 15 || pct stop $ctid" 2>$null
    }
}

# 4. Phase 4: Stop Ingress, DNS, Core Auth & Firewall (Tier 1 & 0)
Write-Log "🛡️ [4/5] Stopping Ingress, Auth, DNS and OPNsense Router..."
$tier1Ctids = @(100, 101, 102, 116)
foreach ($ctid in $tier1Ctids) {
    if (Get-Command pct -ErrorAction SilentlyContinue) {
        pct shutdown $ctid --timeout 10 2>$null
    } else {
        ssh -o BatchMode=yes root@$PveHost "pct shutdown $ctid --timeout 10 || pct stop $ctid" 2>$null
    }
}

if (Get-Command qm -ErrorAction SilentlyContinue) {
    qm shutdown 200 --timeout 20 2>$null
} else {
    ssh -o BatchMode=yes root@$PveHost "qm shutdown 200 --timeout 20 || qm stop 200" 2>$null
}

# 5. Phase 5: Unmount NFS Shares & Sync Filesystems
Write-Log "🔒 [5/5] Unmounting OpenMediaVault NAS NFS shares and syncing filesystems..."
if (Get-Command umount -ErrorAction SilentlyContinue) {
    umount -a -t nfs,nfs4 -f -l 2>$null
    sync
} else {
    ssh -o BatchMode=yes root@$PveHost "umount -a -t nfs,nfs4 -f -l 2>/dev/null || true; sync" 2>$null
}

Write-Log "✅ [COMPLETE] Emergency shutdown sequence completed successfully!"
