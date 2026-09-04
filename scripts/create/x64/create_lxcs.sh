#!/usr/bin/env bash
# ==============================================================================
# Homelab Fleet Automation: Provision all LXC Containers on Node 1 (x86_64)
# Target Host: Node 1 Primary Proxmox VE (x86_64 / amd64)
# Inventory: CT 100 through CT 118 (19 Core Ingress, AI & Infrastructure Containers)
# ==============================================================================
set -euo pipefail

# Visual styling
C_RESET="\033[0m"
C_BOLD="\033[1m"
C_GREEN="\033[32m"
C_YELLOW="\033[33m"
C_BLUE="\033[34m"
C_CYAN="\033[36m"
C_RED="\033[31m"

log_info()    { echo -e "${C_BLUE}${C_BOLD}[INFO]${C_RESET} $*"; }
log_success() { echo -e "${C_GREEN}${C_BOLD}[SUCCESS]${C_RESET} $*"; }
log_warn()    { echo -e "${C_YELLOW}${C_BOLD}[WARN]${C_RESET} $*"; }
log_error()   { echo -e "${C_RED}${C_BOLD}[ERROR]${C_RESET} $*" >&2; }

if [[ $EUID -ne 0 ]]; then
  log_error "This script must be executed as root on Proxmox VE (Node 1)."
  exit 1
fi

if ! command -v pct >/dev/null 2>&1; then
  log_error "Proxmox Container Tool (pct) command not found. Run this directly on Proxmox VE."
  exit 1
fi

STORAGE="${STORAGE:-local-lvm}"
BRIDGE="${BRIDGE:-vmbr0}"
GATEWAY="${GATEWAY:-192.168.1.1}"
FORCE="${FORCE:-false}"

if [[ "${1:-}" == "--force" ]]; then
  FORCE="true"
fi

# Locate template archives in /var/lib/vz/template/cache
ALPINE_TMPL=$(ls -1 /var/lib/vz/template/cache/alpine-*.tar.* 2>/dev/null | sort -V | tail -n 1 || true)
DEBIAN_TMPL=$(ls -1 /var/lib/vz/template/cache/debian-*.tar.* 2>/dev/null | sort -V | tail -n 1 || true)

if [[ -z "$ALPINE_TMPL" ]]; then
  log_info "Downloading Alpine Linux template via pveam..."
  pveam update >/dev/null 2>&1 || true
  pveam download local $(pveam available | awk "/alpine-3/ {print $2}" | sort -V | tail -n 1)
  ALPINE_TMPL=$(ls -1 /var/lib/vz/template/cache/alpine-*.tar.* 2>/dev/null | sort -V | tail -n 1)
fi

if [[ -z "$DEBIAN_TMPL" ]]; then
  log_info "Downloading Debian Linux template via pveam..."
  pveam update >/dev/null 2>&1 || true
  pveam download local $(pveam available | awk "/debian-1/ {print $2}" | sort -V | tail -n 1)
  DEBIAN_TMPL=$(ls -1 /var/lib/vz/template/cache/debian-*.tar.* 2>/dev/null | sort -V | tail -n 1)
fi

echo -e "${C_CYAN}${C_BOLD}"
echo "======================================================================"
echo "    PROXMOX VE NODE 1 (x86_64): LXC CONTAINER PROVISIONER (100-118)"
echo "======================================================================"
echo -e "${C_RESET}"
log_info "Storage Pool   : $STORAGE"
log_info "Bridge         : $BRIDGE"
log_info "Gateway        : $GATEWAY"
log_info "Alpine Template: $ALPINE_TMPL"
log_info "Debian Template: $DEBIAN_TMPL"
log_info "Force Mode     : $FORCE"
echo ""

create_or_skip_lxc() {
  local vmid="$1"
  local hostname="$2"
  shift 2
  local args=("$@")

  if pct status "$vmid" >/dev/null 2>&1; then
    if [[ "$FORCE" == "true" ]]; then
      log_warn "Container $vmid ($hostname) already exists. Force mode enabled: stopping and destroying..."
      pct stop "$vmid" >/dev/null 2>&1 || true
      sleep 2
      pct destroy "$vmid" --purge >/dev/null 2>&1 || true
    else
      log_warn "[SKIP] Container $vmid ($hostname) already exists. Use --force to recreate."
      return 0
    fi
  fi

  log_info "Provisioning Container $vmid: ${C_BOLD}$hostname${C_RESET}..."
  pct create "$vmid" "${args[@]}"
  log_success "Container $vmid ($hostname) provisioned successfully."
}


# ------------------------------------------------------------------------------
# CT 100: nginx
# ------------------------------------------------------------------------------
create_or_skip_lxc 100 "nginx" \
  "$ALPINE_TMPL" \
  --hostname "nginx" \
  --cores 1 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:3G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.3/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "alpine;community-script;ingress;proxy"


# ------------------------------------------------------------------------------
# CT 101: pihole
# ------------------------------------------------------------------------------
create_or_skip_lxc 101 "pihole" \
  "$ALPINE_TMPL" \
  --hostname "pihole" \
  --cores 1 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:3G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.4/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "alpine;community-script;dns;networking"


# ------------------------------------------------------------------------------
# CT 102: tailscale
# ------------------------------------------------------------------------------
create_or_skip_lxc 102 "tailscale" \
  "$ALPINE_TMPL" \
  --hostname "tailscale" \
  --cores 1 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.5/24,type=veth" \
  --features "mknod=1,nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "alpine;community-script;networking;vpn"


# ------------------------------------------------------------------------------
# CT 103: immich
# ------------------------------------------------------------------------------
create_or_skip_lxc 103 "immich" \
  "$ALPINE_TMPL" \
  --hostname "immich" \
  --cores 2 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:40G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.15/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "alpine;community-script;media;photos"


# ------------------------------------------------------------------------------
# CT 104: nextcloud
# ------------------------------------------------------------------------------
create_or_skip_lxc 104 "nextcloud" \
  "$ALPINE_TMPL" \
  --hostname "nextcloud" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:50G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.8/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "alpine;cloud;community-script;storage"


# ------------------------------------------------------------------------------
# CT 105: crowdsec
# ------------------------------------------------------------------------------
create_or_skip_lxc 105 "crowdsec" \
  "$ALPINE_TMPL" \
  --hostname "crowdsec" \
  --cores 1 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:4G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.9/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "alpine;community-script;ips;security"


# ------------------------------------------------------------------------------
# CT 106: homeassistant
# ------------------------------------------------------------------------------
create_or_skip_lxc 106 "homeassistant" \
  "$ALPINE_TMPL" \
  --hostname "homeassistant" \
  --cores 2 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:16G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.10/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "alpine;automation;community-script;smarthome"


# ------------------------------------------------------------------------------
# CT 107: n8n
# ------------------------------------------------------------------------------
create_or_skip_lxc 107 "n8n" \
  "$ALPINE_TMPL" \
  --hostname "n8n" \
  --cores 2 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:8G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.13/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "alpine;automation;community-script;workflows"


# ------------------------------------------------------------------------------
# CT 108: scrutiny
# ------------------------------------------------------------------------------
create_or_skip_lxc 108 "scrutiny" \
  "$ALPINE_TMPL" \
  --hostname "scrutiny" \
  --cores 1 \
  --memory 96 \
  --swap 32 \
  --rootfs "$STORAGE:3G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.18/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "alpine;community-script;observability;smart-disks"


# ------------------------------------------------------------------------------
# CT 109: media-suite
# ------------------------------------------------------------------------------
create_or_skip_lxc 109 "media-suite" \
  "$ALPINE_TMPL" \
  --hostname "media-suite" \
  --cores 2 \
  --memory 896 \
  --swap 256 \
  --rootfs "$STORAGE:50G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.21/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "alpine;arr-stack;community-script;jellyfin;media"


# ------------------------------------------------------------------------------
# CT 110: ollama
# ------------------------------------------------------------------------------
create_or_skip_lxc 110 "ollama" \
  "$DEBIAN_TMPL" \
  --hostname "ollama" \
  --cores 4 \
  --memory 2048 \
  --swap 1024 \
  --rootfs "$STORAGE:16G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.110/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "debian" \
  --onboot 0 \
  --tags "ai;gtx1050ti;homelab;llm;local-ai;ollama"


# ------------------------------------------------------------------------------
# CT 111: openwebui
# ------------------------------------------------------------------------------
create_or_skip_lxc 111 "openwebui" \
  "$DEBIAN_TMPL" \
  --hostname "openwebui" \
  --cores 2 \
  --memory 512 \
  --swap 512 \
  --rootfs "$STORAGE:8G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.111/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "debian" \
  --onboot 0 \
  --tags "ai;chat;homelab;webui"


# ------------------------------------------------------------------------------
# CT 112: whisper
# ------------------------------------------------------------------------------
create_or_skip_lxc 112 "whisper" \
  "$DEBIAN_TMPL" \
  --hostname "whisper" \
  --cores 2 \
  --memory 1024 \
  --swap 1024 \
  --rootfs "$STORAGE:8G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.112/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "debian" \
  --onboot 0 \
  --tags "ai;homelab;stt;whisper"


# ------------------------------------------------------------------------------
# CT 113: flowise
# ------------------------------------------------------------------------------
create_or_skip_lxc 113 "flowise" \
  "$ALPINE_TMPL" \
  --hostname "flowise" \
  --cores 2 \
  --memory 512 \
  --swap 512 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.26/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "agents;ai;langchain;llm"


# ------------------------------------------------------------------------------
# CT 114: paperless-ai
# ------------------------------------------------------------------------------
create_or_skip_lxc 114 "paperless-ai" \
  "$ALPINE_TMPL" \
  --hostname "paperless-ai" \
  --cores 1 \
  --memory 64 \
  --swap 64 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.56/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "ai;dms;ocr"


# ------------------------------------------------------------------------------
# CT 115: code-server
# ------------------------------------------------------------------------------
create_or_skip_lxc 115 "code-server" \
  "$ALPINE_TMPL" \
  --hostname "code-server" \
  --cores 2 \
  --memory 512 \
  --swap 512 \
  --rootfs "$STORAGE:4G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.115/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "codeserver;dev;ide"


# ------------------------------------------------------------------------------
# CT 116: proxmox-backup-server
# ------------------------------------------------------------------------------
create_or_skip_lxc 116 "proxmox-backup-server" \
  "$ALPINE_TMPL" \
  --hostname "proxmox-backup-server" \
  --cores 2 \
  --memory 512 \
  --swap 512 \
  --rootfs "$STORAGE:4G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.116/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "backup;deduplication;pbs;storage"


# ------------------------------------------------------------------------------
# CT 117: proxmox-datacenter-manager
# ------------------------------------------------------------------------------
create_or_skip_lxc 117 "proxmox-datacenter-manager" \
  "$ALPINE_TMPL" \
  --hostname "proxmox-datacenter-manager" \
  --cores 2 \
  --memory 512 \
  --swap 512 \
  --rootfs "$STORAGE:4G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.117/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "management;multi-cluster;pdm"


# ------------------------------------------------------------------------------
# CT 118: woodpecker-k0s
# ------------------------------------------------------------------------------
create_or_skip_lxc 118 "woodpecker-k0s" \
  "$ALPINE_TMPL" \
  --hostname "woodpecker-k0s" \
  --cores 2 \
  --memory 512 \
  --swap 512 \
  --rootfs "$STORAGE:8G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.1.118/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "alpine;cd;ci;k0s;kubernetes;node1;woodpecker"


echo ""
echo -e "${C_GREEN}${C_BOLD}======================================================================${C_RESET}"
echo -e "${C_GREEN}${C_BOLD}  All 19 Containers (100-118) Processed Successfully on Node 1 (x86)! ${C_RESET}"
echo -e "${C_GREEN}${C_BOLD}======================================================================${C_RESET}"
echo ""
pct list
