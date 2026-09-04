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

# LXC Containers Tags Map (100 to 114)
declare -A LXC_TAGS=(
    [100]="alpine;community-script;media;photos"
    [101]="alpine;cloud;community-script;storage"
    [102]="alpine;automation;community-script;smarthome"
    [103]="alpine;automation;community-script;workflows"
    [104]="alpine;community-script;monitoring;smart"
    [105]="alpine;community-script;media;streaming"
    [106]="debian;ai;cuda;gpu;llm;ollama"
    [107]="debian;ai;chatgpt;interface;openwebui"
    [108]="debian;ai;cuda;speech-to-text;whisper"
    [109]="alpine;ai;flowise;langchain;orchestrator"
    [110]="alpine;ai;ocr;paperless"
    [111]="alpine;codeserver;ide;workspace"
    [112]="alpine;backup;deduplication;pbs"
    [113]="alpine;cluster;management;pdm"
    [114]="alpine;cd;ci;k0s;kubernetes;node1;woodpecker"
)

for ctid in "${!LXC_TAGS[@]}"; do
    tags="${LXC_TAGS[$ctid]}"
    if [ -f "/etc/pve/lxc/${ctid}.conf" ]; then
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
    if [ -f "/etc/pve/qemu-server/${vmid}.conf" ]; then
        qm set "$vmid" -tags "$tags" >/dev/null 2>&1 || {
            sed -i "s/^tags:.*/tags: $tags/" "/etc/pve/qemu-server/${vmid}.conf"
        }
        printf "    VM  %-3s -> Tags: %s\n" "$vmid" "$tags"
    fi
done

log " [COMPLETE] Proxmox VE Fleet Tags applied successfully!"
