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
    [303]="alpine;bachelor-thesis;cyber;docker;juice-shop;licenta;owasp"
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

# KVM Virtual Machines Tags Map
declare -A VM_TAGS=(
    [200]="firewall;freebsd;kvm;router;stefanut"
    [201]="microsoft;server;windows"
    [202]="linux;redhat;rhel"
    [203]="cloud;horizon;iaas;neutron;node1;nova;openstack;vm203"
    [204]="cyber;metasploit;metasploitable2;penetration-testing;red-team;vm204"
    [205]="cyber;honeypot;tpot;vm205"
    [206]="blue-team;hids;log-analysis;security-onion;siem;vm206;wazuh"
    [207]="cyber;dfir;malware-analysis;remnux;reverse-engineering;vm207"
    [300]="microsoft;server;windows;windows-server-2019;licenta;bachelor-thesis;vm300"
    [301]="cyber;licenta;bachelor-thesis;metasploit;metasploitable;pentest;red-team;vm301"
    [302]="cyber;kali;licenta;bachelor-thesis;pentest;red-team;vm302"
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
