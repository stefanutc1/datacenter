#!/usr/bin/env bash
# ==============================================================================
# Proxmox VE Fleet Tags Automation
# Sets structured, consistent tags (OS;Category;Service;Source) on all LXC containers & VMs
# following the Nextcloud standard (e.g. alpine;cloud;community-script).
# ==============================================================================

set -euo pipefail

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log " [PROXMOX TAGS] Applying standardized tags across all LXC containers and VMs..."

# LXC Containers Tags Map (100 to 119)
declare -A LXC_TAGS=(
    [101]="alpine;networking;dns;community-script"
    [102]="alpine;networking;vpn;community-script"
    [103]="alpine;photos;media;community-script"
    [104]="alpine;observability;monitoring;community-script"
    [105]="alpine;cloud;storage;community-script"
    [106]="alpine;security;ips;community-script"
    [107]="alpine;automation;smarthome;community-script"
    [108]="alpine;observability;prometheus;grafana;community-script"
    [109]="alpine;utilities;developer;community-script"
    [110]="alpine;automation;workflows;community-script"
    [111]="alpine;devops;ci-cd;community-script"
    [112]="alpine;security;passwords;community-script"
    [113]="alpine;devops;git;community-script"
    [114]="alpine;observability;smart-disks;community-script"
    [115]="alpine;productivity;notes;community-script"
    [116]="alpine;security;sso;community-script"
    [117]="alpine;media;jellyfin;arr-stack;community-script"
    [118]="alpine;productivity;finance;community-script"
    [119]="alpine;automation;monitoring;community-script"
)

for ctid in "${!LXC_TAGS[@]}"; do
    tags="${LXC_TAGS[$ctid]}"
    if [-f "/etc/pve/lxc/${ctid}.conf"]; then
        pct set "$ctid" -tags "$tags" >/dev/null 2>&1 || {
            sed -i "s/^tags:.*/tags: $tags/" "/etc/pve/lxc/${ctid}.conf"
        }
        printf "    LXC %-3s -> Tags: %s\n" "$ctid" "$tags"
    fi
done

# KVM Virtual Machines Tags Map (200, 201)
declare -A VM_TAGS=(
    [200]="freebsd;firewall;router;kvm"
    [201]="alpine;microservices;cloud-init;kvm"
)

for vmid in "${!VM_TAGS[@]}"; do
    tags="${VM_TAGS[$vmid]}"
    if [-f "/etc/pve/qemu-server/${vmid}.conf"]; then
        qm set "$vmid" -tags "$tags" >/dev/null 2>&1 || {
            sed -i "s/^tags:.*/tags: $tags/" "/etc/pve/qemu-server/${vmid}.conf"
        }
        printf "    VM  %-3s -> Tags: %s\n" "$vmid" "$tags"
    fi
done

log " [COMPLETE] Proxmox VE Fleet Tags applied successfully!"
