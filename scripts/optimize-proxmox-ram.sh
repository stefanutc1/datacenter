#!/usr/bin/env bash
# ==============================================================================
# Proxmox VE Ultra-Lean Memory & RAM Optimization Engine ("La Sânge")
# Targets: Alpine Linux base containers, KSM deduplication, sysctl kernel tuning,
# TTY getty cleanup, and razor-sharp per-container RAM caps.
# ==============================================================================

set -euo pipefail

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "🚀 [PROXMOX RAM OPTIMIZATION] Starting Aggressive Memory Tuning..."

# 1. Host Kernel Memory Parameter Optimization
log "⚡ [1/5] Configuring Host Sysctl (swappiness=10, vfs cache pressure, dirty ratios)..."
cat << "SYSCTL" > /etc/sysctl.d/99-homelab-memory.conf
vm.swappiness = 10
vm.vfs_cache_pressure = 50
vm.dirty_background_ratio = 5
vm.dirty_ratio = 10
SYSCTL
sysctl -p /etc/sysctl.d/99-homelab-memory.conf

# 2. Enable & Tune Kernel Samepage Merging (KSM) for Shared Alpine Linux Memory Pages
log "🧠 [2/5] Enabling and Tuning Kernel Samepage Merging (KSM)..."
echo 1 > /sys/kernel/mm/ksm/run || true
echo 1000 > /sys/kernel/mm/ksm/pages_to_scan || true
echo 50 > /sys/kernel/mm/ksm/sleep_millisecs || true
systemctl enable --now ksm 2>/dev/null || true
systemctl enable --now ksmtuned 2>/dev/null || true

# 3. Disable Unused TTY Gettys inside all Alpine Containers
log "🧹 [3/5] Disabling unused TTY gettys in Alpine container inittabs..."
for ctid in $(pct list | awk "NR>1 {print \$1}"); do
    if pct status "$ctid" 2>/dev/null | grep -q "status: running"; then
        pct exec "$ctid" -- sh -c "
            if [ -f /etc/inittab ]; then
                sed -i 's/^tty/#tty/g' /etc/inittab 2>/dev/null || true
                kill -HUP 1 2>/dev/null || true
            fi
        " || true
    fi
done

# 4. Apply Ultra-Lean Razor-Sharp Memory Allocations (RAM:SWAP in MB)
log "📦 [4/5] Applying ultra-lean container RAM limits..."
declare -A MEM_MAP=(
    [100]="112:64"   # Nginx Proxy Manager
    [101]="64:32"    # Pi-hole DNS
    [102]="64:32"    # Tailscale VPN
    [103]="896:256"  # Immich Photos + ML
    [104]="80:32"    # Uptime Kuma
    [105]="96:64"    # Nextcloud
    [106]="128:64"   # CrowdSec IPS
    [107]="384:128"  # Home Assistant Core
    [108]="448:128"  # Prometheus + Grafana + Loki
    [109]="48:32"    # IT-Tools
    [110]="384:128"  # n8n Automations
    [111]="192:64"   # Woodpecker CI
    [112]="96:32"    # Vaultwarden
    [113]="160:64"   # Gitea
    [114]="96:32"    # Scrutiny S.M.A.R.T.
    [115]="160:64"   # Trilium Notes
    [116]="96:32"    # Authelia SSO
    [117]="896:256"  # Media Suite (Jellyfin, Radarr, Sonarr, qBittorrent)
    [118]="160:64"   # Actual Budget
    [119]="48:32"    # Filebrowser
    [120]="160:64"   # ChangeDetection
    [121]="80:32"    # Alist
    [122]="48:32"    # Homelab Homepage
    [123]="48:32"    # Web Wiki
)

for ctid in "${!MEM_MAP[@]}"; do
    val="${MEM_MAP[$ctid]}"
    mem="${val%%:*}"
    swap="${val##*:}"
    
    if [ -f "/etc/pve/lxc/${ctid}.conf" ]; then
        pct set "$ctid" -memory "$mem" -swap "$swap" 2>/dev/null || {
            sed -i "s/^memory:.*/memory: $mem/" "/etc/pve/lxc/${ctid}.conf"
            sed -i "s/^swap:.*/swap: $swap/" "/etc/pve/lxc/${ctid}.conf"
        }
        printf "   ✅ LXC %-3s -> Memory: %4s MB | Swap: %4s MB\n" "$ctid" "$mem" "$swap"
    fi
done

# 5. Drop Host Caches and Reclaim Inactive Memory
log "🔄 [5/5] Dropping host page cache & flushing memory..."
sync
echo 3 > /proc/sys/vm/drop_caches

log "🎉 [COMPLETE] Proxmox RAM Optimization Finished Successfully!"
