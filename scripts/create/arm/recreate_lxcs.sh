#!/usr/bin/env bash
# ==============================================================================
# Homelab Fleet Automation: Recreate all LXC Containers on Node 3 (ARM64)
# Target Host: Node 3 Secondary Hypervisor (Apple Silicon M1 ARM64 via UTM)
# Inventory: CT 100 through CT 181 (82 High-Efficiency ARM64 Micro-Containers)
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
  log_error "This script must be executed as root on Proxmox VE ARM64 (Node 3)."
  exit 1
fi

if ! command -v pct >/dev/null 2>&1; then
  log_error "Proxmox Container Tool (pct) command not found. Run this directly on Proxmox VE."
  exit 1
fi

STORAGE="${STORAGE:-local-lvm}"
BRIDGE="${BRIDGE:-vmbr0}"
GATEWAY="${GATEWAY:-192.168.64.1}"
FORCE="${FORCE:-false}"

if [[ "${1:-}" == "--force" ]] || [[ "${1:-}" == "--recreate" ]]; then
  FORCE="true"
fi

# Locate template archives in /var/lib/vz/template/cache
ALPINE_TMPL=$(ls -1 /var/lib/vz/template/cache/alpine-*.tar.* 2>/dev/null | grep -iE "arm64|aarch64" | sort -V | tail -n 1 || true)
if [[ -z "$ALPINE_TMPL" ]]; then
  ALPINE_TMPL=$(ls -1 /var/lib/vz/template/cache/alpine-*.tar.* 2>/dev/null | sort -V | tail -n 1 || true)
fi

if [[ -z "$ALPINE_TMPL" ]]; then
  log_info "Downloading Alpine Linux ARM64 template via pveam..."
  pveam update >/dev/null 2>&1 || true
  pveam download local $(pveam available | grep -iE "arm64|aarch64" | awk "/alpine-3/ {print $2}" | sort -V | tail -n 1)
  ALPINE_TMPL=$(ls -1 /var/lib/vz/template/cache/alpine-*.tar.* 2>/dev/null | sort -V | tail -n 1)
fi

echo -e "${C_CYAN}${C_BOLD}"
echo "======================================================================"
echo "    PROXMOX VE NODE 3 (ARM64): LXC CONTAINER RECREATOR (100-181)"
echo "======================================================================"
echo -e "${C_RESET}"
log_info "Storage Pool   : $STORAGE"
log_info "Bridge         : $BRIDGE"
log_info "Gateway        : $GATEWAY"
log_info "Alpine Template: $ALPINE_TMPL"
log_info "Recreate Mode  : $FORCE"
echo ""

recreate_or_skip_lxc() {
  local vmid="$1"
  local hostname="$2"
  shift 2
  local args=("$@")

  if pct status "$vmid" >/dev/null 2>&1; then
    if [[ "$FORCE" == "true" ]]; then
      log_warn "Container $vmid ($hostname) exists. Recreate mode enabled: stopping and destroying..."
      pct stop "$vmid" >/dev/null 2>&1 || true
      sleep 1
      pct destroy "$vmid" --purge >/dev/null 2>&1 || true
    else
      log_warn "[SKIP] Container $vmid ($hostname) already exists. Use --recreate / --force to rebuild."
      return 0
    fi
  fi

  log_info "Creating Container $vmid: ${C_BOLD}$hostname${C_RESET}..."
  pct create "$vmid" "${args[@]}"
  log_success "Container $vmid ($hostname) created successfully."
}


# ------------------------------------------------------------------------------
# CT 100: it-tools
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 100 "it-tools" \
  "$ALPINE_TMPL" \
  --hostname "it-tools" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:2G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.15/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "dev;utilities;developer;tools" \
  --description "Collection of developer utilities, hash generators, encoders, and network converters for daily engineering workflows." \


# ------------------------------------------------------------------------------
# CT 101: actualbudget
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 101 "actualbudget" \
  "$ALPINE_TMPL" \
  --hostname "actualbudget" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:4G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.16/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "finance;budgeting;analytics;productivity" \
  --description "Zero-based personal budgeting application with real-time transaction tracking and encrypted bank synchronization." \


# ------------------------------------------------------------------------------
# CT 102: trillium
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 102 "trillium" \
  "$ALPINE_TMPL" \
  --hostname "trillium" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:4G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.17/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "knowledge;notes;documentation;wiki" \
  --description "Hierarchical knowledge management base for capturing software architecture notes, code snippets, and research." \


# ------------------------------------------------------------------------------
# CT 103: changedetection
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 103 "changedetection" \
  "$ALPINE_TMPL" \
  --hostname "changedetection" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:4G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.18/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "monitoring;web-watch;automation;alerts" \
  --description "Monitors targeted web pages and APIs for structural changes and triggers automated alerts upon modifications." \


# ------------------------------------------------------------------------------
# CT 104: scrutiny
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 104 "scrutiny" \
  "$ALPINE_TMPL" \
  --hostname "scrutiny" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:2G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.19/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "storage;smart-disks;observability;hardware" \
  --description "Monitors hard drive S.M.A.R.T. health, operating temperatures, and disk wear attributes with predictive failure alerts." \


# ------------------------------------------------------------------------------
# CT 105: uptimekuma
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 105 "uptimekuma" \
  "$ALPINE_TMPL" \
  --hostname "uptimekuma" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:2G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.23/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "monitoring;uptime;health-check;status-page" \
  --description "Monitors HTTP, TCP, Ping, and DNS availability with a public uptime status page and instant incident alerts." \


# ------------------------------------------------------------------------------
# CT 106: vaultwarden
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 106 "vaultwarden" \
  "$ALPINE_TMPL" \
  --hostname "vaultwarden" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:2G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.21/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "security;passwords;vault;zero-knowledge" \
  --description "Self-hosted zero-knowledge password vault providing cross-device synchronization for credentials and passkeys." \


# ------------------------------------------------------------------------------
# CT 107: monitoring
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 107 "monitoring" \
  "$ALPINE_TMPL" \
  --hostname "monitoring" \
  --cores 2 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:3G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.24/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "observability;prometheus;grafana;metrics" \
  --description "Integrated Prometheus time-series database and Grafana visualization platform for real-time infrastructure metrics." \


# ------------------------------------------------------------------------------
# CT 108: authelia
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 108 "authelia" \
  "$ALPINE_TMPL" \
  --hostname "authelia" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:2G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.20/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "security;sso;2fa;access-control" \
  --description "Identity provider enforcing two-factor authentication and single sign-on (SSO) protection across internal web services." \


# ------------------------------------------------------------------------------
# CT 109: gitea
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 109 "gitea" \
  "$ALPINE_TMPL" \
  --hostname "gitea" \
  --cores 2 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:2G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.25/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "devops;git;code-forge;version-control" \
  --description "Lightweight Git code hosting forge supporting pull requests, repository management, and automated webhook triggers." \


# ------------------------------------------------------------------------------
# CT 110: woodpecker-ci
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 110 "woodpecker-ci" \
  "$ALPINE_TMPL" \
  --hostname "woodpecker-ci" \
  --cores 2 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:2G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.26/24,type=veth" \
  --features "nesting=1,keyctl=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "devops;ci-cd;pipelines;automated-builds" \
  --description "Continuous integration runner executing automated build pipelines, container packaging, and testing upon Git commits." \


# ------------------------------------------------------------------------------
# CT 111: gatus
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 111 "gatus" \
  "$ALPINE_TMPL" \
  --hostname "gatus" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.111/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "monitoring;health-probe;latency;status" \
  --description "Health dashboard actively probing HTTP endpoints, TLS certificates, and response latencies using lightweight Go workers." \


# ------------------------------------------------------------------------------
# CT 112: ntfy
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 112 "ntfy" \
  "$ALPINE_TMPL" \
  --hostname "ntfy" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:307M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.112/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "automation;notifications;push;alerts" \
  --description "Unified push notification server sending real-time operational alerts from scripts and services to mobile devices." \


# ------------------------------------------------------------------------------
# CT 113: linkding
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 113 "linkding" \
  "$ALPINE_TMPL" \
  --hostname "linkding" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.113/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "productivity;bookmarks;search;archiving" \
  --description "Fast bookmark manager with automatic title scraping, tag indexing, and offline snapshot archiving." \


# ------------------------------------------------------------------------------
# CT 114: stepca
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 114 "stepca" \
  "$ALPINE_TMPL" \
  --hostname "stepca" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.114/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "security;pki;tls;certificates" \
  --description "Private certificate authority issuing automated TLS certificates across the internal domain via ACME protocol." \


# ------------------------------------------------------------------------------
# CT 115: tailscale-arm
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 115 "tailscale-arm" \
  "$ALPINE_TMPL" \
  --hostname "tailscale-arm" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.115/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "networking;vpn;wireguard;mesh" \
  --description "Provides encrypted WireGuard mesh networking for secure cross-subnet communication and remote server access." \


# ------------------------------------------------------------------------------
# CT 116: beszel
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 116 "beszel" \
  "$ALPINE_TMPL" \
  --hostname "beszel" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.116/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "observability;telemetry;system-stats;metrics" \
  --description "Aggregates microsecond-resolution system resource metrics collected by lightweight agents across the cluster." \


# ------------------------------------------------------------------------------
# CT 117: pocketbase
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 117 "pocketbase" \
  "$ALPINE_TMPL" \
  --hostname "pocketbase" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.117/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "database;backend;baas;api" \
  --description "Self-contained backend database and authentication service supporting rapid internal application prototyping." \


# ------------------------------------------------------------------------------
# CT 118: homepage
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 118 "homepage" \
  "$ALPINE_TMPL" \
  --hostname "homepage" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.118/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "portal;dashboard;startpage;services" \
  --description "Centralized service portal and dashboard displaying real-time server health widgets and quick navigation links." \


# ------------------------------------------------------------------------------
# CT 119: speedtest
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 119 "speedtest" \
  "$ALPINE_TMPL" \
  --hostname "speedtest" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.119/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "monitoring;network;speedtest;wan-metrics" \
  --description "Runs scheduled internet speed benchmarks to monitor WAN download speeds, upload bandwidth, and latency trends." \


# ------------------------------------------------------------------------------
# CT 120: memos
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 120 "memos" \
  "$ALPINE_TMPL" \
  --hostname "memos" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.120/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "notes;journaling;markdown;productivity" \
  --description "Privacy-first micro-note platform for instant thought capturing, Markdown journaling, and tagged knowledge snippets." \


# ------------------------------------------------------------------------------
# CT 121: wallos
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 121 "wallos" \
  "$ALPINE_TMPL" \
  --hostname "wallos" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.121/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "finance;expenses;subscriptions;ledger" \
  --description "Personal finance ledger tracking recurring software subscriptions, infrastructure costs, and monthly amortizations." \


# ------------------------------------------------------------------------------
# CT 122: syncthing
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 122 "syncthing" \
  "$ALPINE_TMPL" \
  --hostname "syncthing" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.122/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "storage;file-sync;p2p;backup" \
  --description "Continuous file synchronization service replicating document folders securely across multiple client workstations." \


# ------------------------------------------------------------------------------
# CT 123: microbin
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 123 "microbin" \
  "$ALPINE_TMPL" \
  --hostname "microbin" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:1177M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.123/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "security;pastebin;encrypted;snippet-sharing" \
  --description "Secure, encrypted pastebin utility featuring self-destructing code snippets and QR code sharing capabilities." \


# ------------------------------------------------------------------------------
# CT 124: vikunja
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 124 "vikunja" \
  "$ALPINE_TMPL" \
  --hostname "vikunja" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.124/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "productivity;tasks;kanban;project-management" \
  --description "Collaborative project and task management application with Kanban boards, Gantt charts, and CalDAV integration." \


# ------------------------------------------------------------------------------
# CT 125: blackbox
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 125 "blackbox" \
  "$ALPINE_TMPL" \
  --hostname "blackbox" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.125/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "monitoring;blackbox;prometheus;endpoint-probe" \
  --description "Probes internal endpoints over ICMP, HTTP, HTTPS, and TCP protocols to generate Prometheus availability alerts." \


# ------------------------------------------------------------------------------
# CT 126: yourspotify
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 126 "yourspotify" \
  "$ALPINE_TMPL" \
  --hostname "yourspotify" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.126/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "media;music;analytics;statistics" \
  --description "Self-hosted music analytics platform recording personal Spotify listening history and generating genre insights." \


# ------------------------------------------------------------------------------
# CT 127: webcheck
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 127 "webcheck" \
  "$ALPINE_TMPL" \
  --hostname "webcheck" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.127/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "security;osint;recon;domain-audit" \
  --description "Performs automated open-source intelligence (OSINT) scans on domains to audit DNS records and SSL security headers." \


# ------------------------------------------------------------------------------
# CT 128: opengist
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 128 "opengist" \
  "$ALPINE_TMPL" \
  --hostname "opengist" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.128/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "devops;gists;code-snippets;git" \
  --description "Self-hosted pastebin and code snippet repository powered by Git version control and syntax highlighting." \


# ------------------------------------------------------------------------------
# CT 129: flatnotes
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 129 "flatnotes" \
  "$ALPINE_TMPL" \
  --hostname "flatnotes" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.129/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "notes;markdown;flat-file;text-editor" \
  --description "Fast, minimalist Markdown note editor that interfaces directly with local raw text files without database overhead." \


# ------------------------------------------------------------------------------
# CT 130: bark
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 130 "bark" \
  "$ALPINE_TMPL" \
  --hostname "bark" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.130/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "automation;notifications;ios;apns" \
  --description "Custom Apple push notification relay delivering encrypted system alerts and status updates to iOS devices." \


# ------------------------------------------------------------------------------
# CT 131: shiori
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 131 "shiori" \
  "$ALPINE_TMPL" \
  --hostname "shiori" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.131/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "productivity;bookmarks;read-later;archiver" \
  --description "Lightweight offline web page archiver and reading list manager written in Go with full-text search." \


# ------------------------------------------------------------------------------
# CT 132: whoogle
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 132 "whoogle" \
  "$ALPINE_TMPL" \
  --hostname "whoogle" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.132/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "search;privacy;proxy;ad-free" \
  --description "Privacy-preserving search gateway proxying Google search queries without tracking cookies or advertising scripts." \


# ------------------------------------------------------------------------------
# CT 133: flame
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 133 "flame" \
  "$ALPINE_TMPL" \
  --hostname "flame" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:204M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.133/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 0 \
  --tags "portal;startpage;launcher;minimal" \
  --description "Minimalist, fast web application launcher and bookmark dashboard with integrated weather and Docker indicators." \


# ------------------------------------------------------------------------------
# CT 134: dashy
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 134 "dashy" \
  "$ALPINE_TMPL" \
  --hostname "dashy" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.134/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "portal;dashboard;widgets;customization" \
  --description "Customizable startpage with dynamic status widgets, theme support, and categorized service navigation grids." \


# ------------------------------------------------------------------------------
# CT 135: shlink
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 135 "shlink" \
  "$ALPINE_TMPL" \
  --hostname "shlink" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.135/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "networking;url-shortener;analytics;link-sharing" \
  --description "Self-hosted URL shortener featuring link tracking analytics, QR code generation, and custom alias domains." \


# ------------------------------------------------------------------------------
# CT 136: pastefy
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 136 "pastefy" \
  "$ALPINE_TMPL" \
  --hostname "pastefy" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.136/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "productivity;pastebin;collaboration;sharing" \
  --description "Collaborative pastebin server supporting encrypted text, Markdown previews, and syntax-highlighted code sharing." \


# ------------------------------------------------------------------------------
# CT 137: pingvin-share
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 137 "pingvin-share" \
  "$ALPINE_TMPL" \
  --hostname "pingvin-share" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.137/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "storage;file-sharing;transfers;privacy" \
  --description "Privacy-focused file sharing platform enabling secure, link-based file transfers with expiration and download limits." \


# ------------------------------------------------------------------------------
# CT 138: rss-bridge
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 138 "rss-bridge" \
  "$ALPINE_TMPL" \
  --hostname "rss-bridge" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.138/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "media;rss;feed-generator;syndication" \
  --description "Generates clean RSS/Atom feeds from social networks and dynamic websites that do not offer native syndication." \


# ------------------------------------------------------------------------------
# CT 139: playwright-probe
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 139 "playwright-probe" \
  "$ALPINE_TMPL" \
  --hostname "playwright-probe" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.139/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "automation;browser-testing;playwright;scraping" \
  --description "Headless browser automation engine performing end-to-end web testing, synthetic health checks, and screenshots." \


# ------------------------------------------------------------------------------
# CT 140: uptime-probe
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 140 "uptime-probe" \
  "$ALPINE_TMPL" \
  --hostname "uptime-probe" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:2G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.140/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "monitoring;prober;latency;network" \
  --description "Lightweight background probe continuously monitoring HTTP response times and network latency across cluster nodes." \


# ------------------------------------------------------------------------------
# CT 141: dns-bench
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 141 "dns-bench" \
  "$ALPINE_TMPL" \
  --hostname "dns-bench" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.141/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "networking;dns;benchmarks;dnssec" \
  --description "Benchmarks DNS resolver query speeds and validates DNSSEC integrity across local and upstream DNS servers." \


# ------------------------------------------------------------------------------
# CT 142: excalidraw
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 142 "excalidraw" \
  "$ALPINE_TMPL" \
  --hostname "excalidraw" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.142/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "productivity;whiteboard;sketching;diagrams" \
  --description "Collaborative whiteboard drawing tool for sketching system architectures, software designs, and flowcharts." \


# ------------------------------------------------------------------------------
# CT 143: snagim
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 143 "snagim" \
  "$ALPINE_TMPL" \
  --hostname "snagim" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.143/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "media;image-host;screenshots;sharing" \
  --description "Minimalist image hosting and screenshot sharing service with instant clipboard uploads and direct link sharing." \


# ------------------------------------------------------------------------------
# CT 144: whoogle-tor
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 144 "whoogle-tor" \
  "$ALPINE_TMPL" \
  --hostname "whoogle-tor" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.144/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "privacy;search;tor-network;anonymity" \
  --description "Routes search requests through the Tor onion network to ensure complete anonymity and eliminate tracking vectors." \


# ------------------------------------------------------------------------------
# CT 145: heimdall
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 145 "heimdall" \
  "$ALPINE_TMPL" \
  --hostname "heimdall" \
  --cores 1 \
  --memory 256 \
  --swap 512 \
  --rootfs "$STORAGE:153M" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.145/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "portal;dashboard;application-grid;launcher" \
  --description "Application dashboard organizing internal web applications with real-time live service state indicators." \


# ------------------------------------------------------------------------------
# CT 146: proxmox-backup-server
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 146 "proxmox-backup-server" \
  "$ALPINE_TMPL" \
  --hostname "proxmox-backup-server" \
  --cores 2 \
  --memory 512 \
  --swap 512 \
  --rootfs "$STORAGE:2G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.146/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "storage;backup;pbs;deduplication" \
  --description "Enterprise backup server offering encrypted snapshot storage, chunk-level deduplication, and verification." \


# ------------------------------------------------------------------------------
# CT 147: proxmox-datacenter-manager
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 147 "proxmox-datacenter-manager" \
  "$ALPINE_TMPL" \
  --hostname "proxmox-datacenter-manager" \
  --cores 2 \
  --memory 512 \
  --swap 512 \
  --rootfs "$STORAGE:2G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.147/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "monitoring;management;pdm;multi-cluster" \
  --description "Centralized management portal unifying multi-cluster Proxmox hypervisors and storage pools in a single view." \


# ------------------------------------------------------------------------------
# CT 148: renovate-gitops
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 148 "renovate-gitops" \
  "$ALPINE_TMPL" \
  --hostname "renovate-gitops" \
  --cores 2 \
  --memory 256 \
  --swap 256 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.148/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "gitops;renovate" \
  


# ------------------------------------------------------------------------------
# CT 149: transmission
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 149 "transmission" \
  "$ALPINE_TMPL" \
  --hostname "transmission" \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.149/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "media;torrent" \
  


# ------------------------------------------------------------------------------
# CT 150: kavita
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 150 "kavita" \
  "$ALPINE_TMPL" \
  --hostname "kavita" \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.150/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "ebooks;kavita;media" \
  


# ------------------------------------------------------------------------------
# CT 151: stirling-pdf
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 151 "stirling-pdf" \
  "$ALPINE_TMPL" \
  --hostname "stirling-pdf" \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.151/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "pdf;stirling;utilities" \
  


# ------------------------------------------------------------------------------
# CT 152: audiobookshelf
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 152 "audiobookshelf" \
  "$ALPINE_TMPL" \
  --hostname "audiobookshelf" \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.152/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "audiobooks;media" \
  


# ------------------------------------------------------------------------------
# CT 153: tubearchivist
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 153 "tubearchivist" \
  "$ALPINE_TMPL" \
  --hostname "tubearchivist" \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.153/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "media;video;youtube" \
  


# ------------------------------------------------------------------------------
# CT 154: calibre-web
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 154 "calibre-web" \
  "$ALPINE_TMPL" \
  --hostname "calibre-web" \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.154/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "calibre;ebooks;media" \
  


# ------------------------------------------------------------------------------
# CT 155: cyberchef
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 155 "cyberchef" \
  "$ALPINE_TMPL" \
  --hostname "cyberchef" \
  --cores 1 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.155/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "crypto;cyberchef;security" \
  


# ------------------------------------------------------------------------------
# CT 156: drawio
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 156 "drawio" \
  "$ALPINE_TMPL" \
  --hostname "drawio" \
  --cores 1 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.156/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "diagrams;drawio;utilities" \
  


# ------------------------------------------------------------------------------
# CT 157: romm
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 157 "romm" \
  "$ALPINE_TMPL" \
  --hostname "romm" \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.157/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "gaming;romm;roms" \
  


# ------------------------------------------------------------------------------
# CT 158: emulatorjs
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 158 "emulatorjs" \
  "$ALPINE_TMPL" \
  --hostname "emulatorjs" \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.158/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "emulator;gaming" \
  


# ------------------------------------------------------------------------------
# CT 159: vscode-server
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 159 "vscode-server" \
  "$ALPINE_TMPL" \
  --hostname "vscode-server" \
  --cores 1 \
  --memory 512 \
  --swap 512 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.159/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "dev;ide;vscode" \
  


# ------------------------------------------------------------------------------
# CT 160: paperless-ngx
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 160 "paperless-ngx" \
  "$ALPINE_TMPL" \
  --hostname "paperless-ngx" \
  --cores 1 \
  --memory 512 \
  --swap 512 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.160/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "dms;documents;paperless" \
  


# ------------------------------------------------------------------------------
# CT 161: minio
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 161 "minio" \
  "$ALPINE_TMPL" \
  --hostname "minio" \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.161/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "minio;s3;storage" \
  


# ------------------------------------------------------------------------------
# CT 162: meilisearch
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 162 "meilisearch" \
  "$ALPINE_TMPL" \
  --hostname "meilisearch" \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.162/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "database;meilisearch;search" \
  


# ------------------------------------------------------------------------------
# CT 163: vector
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 163 "vector" \
  "$ALPINE_TMPL" \
  --hostname "vector" \
  --cores 1 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.163/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "logging;telemetry;vector" \
  


# ------------------------------------------------------------------------------
# CT 164: searxng
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 164 "searxng" \
  "$ALPINE_TMPL" \
  --hostname "searxng" \
  --cores 1 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.164/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "privacy;search;searxng" \
  


# ------------------------------------------------------------------------------
# CT 165: netalertx
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 165 "netalertx" \
  "$ALPINE_TMPL" \
  --hostname "netalertx" \
  --cores 1 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.165/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "network;scanner;security" \
  


# ------------------------------------------------------------------------------
# CT 166: rustdesk
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 166 "rustdesk" \
  "$ALPINE_TMPL" \
  --hostname "rustdesk" \
  --cores 1 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.166/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "access;remote;rustdesk" \
  


# ------------------------------------------------------------------------------
# CT 167: kopia
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 167 "kopia" \
  "$ALPINE_TMPL" \
  --hostname "kopia" \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.167/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "backup;kopia;snapshots" \
  


# ------------------------------------------------------------------------------
# CT 168: wg-easy
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 168 "wg-easy" \
  "$ALPINE_TMPL" \
  --hostname "wg-easy" \
  --cores 1 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.168/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "vpn;wgeasy;wireguard" \
  


# ------------------------------------------------------------------------------
# CT 169: pgadmin
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 169 "pgadmin" \
  "$ALPINE_TMPL" \
  --hostname "pgadmin" \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.169/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "database;pgadmin;postgres" \
  


# ------------------------------------------------------------------------------
# CT 170: dozzle
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 170 "dozzle" \
  "$ALPINE_TMPL" \
  --hostname "dozzle" \
  --cores 1 \
  --memory 64 \
  --swap 64 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.170/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "docker;dozzle;logs" \
  


# ------------------------------------------------------------------------------
# CT 171: kiwix
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 171 "kiwix" \
  "$ALPINE_TMPL" \
  --hostname "kiwix" \
  --cores 1 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.171/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "knowledge;offline;wiki" \
  


# ------------------------------------------------------------------------------
# CT 172: hedgedoc
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 172 "hedgedoc" \
  "$ALPINE_TMPL" \
  --hostname "hedgedoc" \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.172/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "hedgedoc;markdown;notes" \
  


# ------------------------------------------------------------------------------
# CT 173: glances
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 173 "glances" \
  "$ALPINE_TMPL" \
  --hostname "glances" \
  --cores 1 \
  --memory 64 \
  --swap 64 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.173/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "glances;monitoring;system" \
  


# ------------------------------------------------------------------------------
# CT 174: dufs
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 174 "dufs" \
  "$ALPINE_TMPL" \
  --hostname "dufs" \
  --cores 1 \
  --memory 64 \
  --swap 64 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.174/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "dufs;files;storage" \
  


# ------------------------------------------------------------------------------
# CT 175: gotify
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 175 "gotify" \
  "$ALPINE_TMPL" \
  --hostname "gotify" \
  --cores 1 \
  --memory 64 \
  --swap 64 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.175/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "gotify;notifications;push" \
  


# ------------------------------------------------------------------------------
# CT 176: miniflux
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 176 "miniflux" \
  "$ALPINE_TMPL" \
  --hostname "miniflux" \
  --cores 1 \
  --memory 64 \
  --swap 64 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.176/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "miniflux;news;rss" \
  


# ------------------------------------------------------------------------------
# CT 177: grocy
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 177 "grocy" \
  "$ALPINE_TMPL" \
  --hostname "grocy" \
  --cores 1 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.177/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "erp;grocy;inventory" \
  


# ------------------------------------------------------------------------------
# CT 178: chrony
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 178 "chrony" \
  "$ALPINE_TMPL" \
  --hostname "chrony" \
  --cores 1 \
  --memory 32 \
  --swap 32 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.178/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "chrony;ntp;time" \
  


# ------------------------------------------------------------------------------
# CT 179: linkwarden
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 179 "linkwarden" \
  "$ALPINE_TMPL" \
  --hostname "linkwarden" \
  --cores 1 \
  --memory 128 \
  --swap 128 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.179/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "archive;bookmarks;linkwarden" \
  


# ------------------------------------------------------------------------------
# CT 180: snmp-collector
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 180 "snmp-collector" \
  "$ALPINE_TMPL" \
  --hostname "snmp-collector" \
  --cores 1 \
  --memory 64 \
  --swap 64 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.180/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "collector;network;snmp" \
  


# ------------------------------------------------------------------------------
# CT 181: searxng-redis
# ------------------------------------------------------------------------------
recreate_or_skip_lxc 181 "searxng-redis" \
  "$ALPINE_TMPL" \
  --hostname "searxng-redis" \
  --cores 1 \
  --memory 32 \
  --swap 32 \
  --rootfs "$STORAGE:1G" \
  --net0 "name=eth0,bridge=$BRIDGE,gw=$GATEWAY,ip=192.168.64.181/24,type=veth" \
  --features "nesting=1" \
  --unprivileged 1 \
  --ostype "alpine" \
  --onboot 1 \
  --tags "cache;redis;search" \
  


echo ""
echo -e "${C_GREEN}${C_BOLD}======================================================================${C_RESET}"
echo -e "${C_GREEN}${C_BOLD}  All 82 Containers (100-181) Recreated Successfully on Node 3 (ARM64)! ${C_RESET}"
echo -e "${C_GREEN}${C_BOLD}======================================================================${C_RESET}"
echo ""
pct list
