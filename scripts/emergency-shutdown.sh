#!/usr/bin/env bash
# ==============================================================================
# Homelab Emergency Graceful Shutdown Script (10+ Hour Power Outage SOP)
# Executed automatically by NUT (Network UPS Tools) on On-Battery Low trigger
# or manually by administrator during prolonged blackout.
# ==============================================================================

set -euo pipefail

LOG_FILE="/var/log/homelab-emergency-shutdown.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

log() {
    echo "[${TIMESTAMP}] $1" | tee -a "${LOG_FILE}"
}

log " [EMERGENCY SOP] Initiating 10+ Hour Power Outage Graceful Shutdown..."

# 1. Send Emergency Notification via Out-of-Band LTE / Telegram
log " [1/6] Sending emergency alert broadcast..."
if [-n "${TELEGRAM_BOT_TOKEN:-}"] && [-n "${TELEGRAM_CHAT_ID:-}"]; then
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d chat_id="${TELEGRAM_CHAT_ID}" \
        -d text=" [HOMELAB ALERT] Critical Power Outage (10+ Hours). Commencing graceful cascading shutdown." || true
fi

# 2. Phase 1: Shutdown Heavy Applications & Non-Essential Workloads (Tier 4)
log " [2/6] Stopping Tier 4 Heavy Applications & Media LXCs..."
for ctid in 114 115 116 117 118 119; do
    if pct status "$ctid" 2>/dev/null | grep -q "status: running"; then
        log "   Stopping LXC $ctid..."
        pct shutdown "$ctid" --timeout 15 || pct stop "$ctid"
    fi
done

# 3. Phase 2: Shutdown Secondary VMs (Tier 3)
log " [3/6] Stopping Tier 3 KVM Virtual Machines (Alpine 201)..."
for vmid in 201; do
    if qm status "$vmid" 2>/dev/null | grep -q "status: running"; then
        log "   Stopping VM $vmid..."
        qm shutdown "$vmid" --timeout 30 || qm stop "$vmid"
    fi
done

# 4. Phase 3: Flush & Shutdown Databases & Cache (Tier 2)
log " [4/6] Flushing and stopping Databases & Application Services..."
for ctid in 103 104 105 106 107 108 109 110 111 112 113; do
    if pct status "$ctid" 2>/dev/null | grep -q "status: running"; then
        log "   Stopping Database/Core LXC $ctid..."
        pct shutdown "$ctid" --timeout 15 || pct stop "$ctid"
    fi
done

# 5. Phase 4: Stop Ingress, DNS, Core Auth & Firewall (Tier 1 & 0)
log " [5/6] Stopping Ingress, Auth, DNS and OPNsense Router..."
for ctid in 101 102; do
    if pct status "$ctid" 2>/dev/null | grep -q "status: running"; then
        log "   Stopping Core LXC $ctid..."
        pct shutdown "$ctid" --timeout 10 || pct stop "$ctid"
    fi
done

if qm status 200 2>/dev/null | grep -q "status: running"; then
    log "   Stopping OPNsense VM 200..."
    qm shutdown 200 --timeout 20 || qm stop 200
fi

# 6. Phase 5: Unmount Network NFS Shares & Flush Filesystems
log " [6/6] Unmounting OpenMediaVault NAS NFS shares and syncing filesystems..."
umount -a -t nfs,nfs4 -f -l 2>/dev/null || true
sync
sleep 2

log " Emergency shutdown sequence completed successfully. Powering off Hypervisor node."
poweroff
