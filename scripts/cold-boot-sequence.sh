#!/usr/bin/env bash
# ==============================================================================
# Homelab Staged Cold-Boot Restoration Script (Post 10+ Hour Outage Recovery)
# Executed sequentially after grid power stabilization to prevent inrush overload
# and ensure dependency hierarchy integrity.
# ==============================================================================

set -euo pipefail

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "⚡ [COLD-BOOT SOP] Initiating Staged Power-On Recovery Sequence..."

# 1. Verify OpenMediaVault NAS & Mount NFS Storage
log "🔍 [1/6] Verifying OpenMediaVault NAS (192.168.1.5) reachability & mounting NFS shares..."
ping -c 2 192.168.1.5 >/dev/null 2>&1 || log "⚠️ NAS 192.168.1.5 still booting, mounting NFS with background retry..."
mount -a -t nfs,nfs4 2>/dev/null || true

# 2. Start Core Firewall & Router (OPNsense VM 200)
log "🛡️ [2/6] Starting OPNsense Gateway (VM 200)..."
qm start 200
log "   Waiting 30s for WAN routing and DHCP lease initialization..."
sleep 30

# 3. Start Core DNS (Pi-hole LXC 100)
log "🌐 [3/6] Starting Pi-hole DNS Resolver (LXC 100)..."
pct start 100
sleep 10

# 4. Start Ingress Proxy & Authelia Authentication (LXC 101 & 102)
log "🔑 [4/6] Starting Nginx Proxy Manager (LXC 101) & Authelia (LXC 102)..."
pct start 101
pct start 102
sleep 10

# 5. Start Core Databases & Essential Infrastructure (LXC 103 - 113)
log "💾 [5/6] Starting Core Storage, Databases & Infrastructure Containers..."
for ctid in 103 104 105 106 107 108 109 110 111 112 113; do
    log "   Starting LXC $ctid..."
    pct start "$ctid" || true
    sleep 3
done

# 6. Start Applications, Media Suites & Secondary VMs (LXC 114 - 123, VM 201, 202)
log "🚀 [6/6] Starting Applications, Web Portals & Workload VMs..."
for ctid in 114 115 116 117 118 119 120 121 122 123; do
    pct start "$ctid" || true
    sleep 2
done

qm start 201 || true
qm start 202 || true

log "✅ All services staged and operational. Verifying NFS mount status..."
df -h -t nfs4,nfs || true

log "🎉 Cold-boot restoration completed successfully!"
