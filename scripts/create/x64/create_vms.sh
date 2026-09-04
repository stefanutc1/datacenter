#!/usr/bin/env bash
# ==============================================================================
# Homelab Fleet Automation: Provision all Virtual Machines on Node 1 (x86_64)
# Target Host: Node 1 Primary Proxmox VE (x86_64 / amd64)
# Inventory: VMs 200 through 220 (21 Enterprise Virtual Machines)
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

if ! command -v qm >/dev/null 2>&1; then
  log_error "Proxmox QEMU Manager (qm) command not found. Run this directly on Proxmox VE."
  exit 1
fi

STORAGE="${STORAGE:-local-lvm}"
BRIDGE="${BRIDGE:-vmbr0}"
ISO_STORAGE="${ISO_STORAGE:-local:iso}"
FORCE="${FORCE:-false}"

if [[ "${1:-}" == "--force" ]]; then
  FORCE="true"
fi

echo -e "${C_CYAN}${C_BOLD}"
echo "======================================================================"
echo "    PROXMOX VE NODE 1 (x86_64): VIRTUAL MACHINE PROVISIONER (200-220)"
echo "======================================================================"
echo -e "${C_RESET}"
log_info "Storage Pool : $STORAGE"
log_info "Bridge       : $BRIDGE"
log_info "ISO Storage  : $ISO_STORAGE"
log_info "Force Mode   : $FORCE"
echo ""

create_or_skip_vm() {
  local vmid="$1"
  local name="$2"
  shift 2
  local args=("$@")

  if qm status "$vmid" >/dev/null 2>&1; then
    if [[ "$FORCE" == "true" ]]; then
      log_warn "VM $vmid ($name) already exists. Force mode enabled: stopping and destroying..."
      qm stop "$vmid" >/dev/null 2>&1 || true
      sleep 2
      qm destroy "$vmid" --purge >/dev/null 2>&1 || true
    else
      log_warn "[SKIP] VM $vmid ($name) already exists. Use --force to recreate."
      return 0
    fi
  fi

  log_info "Provisioning VM $vmid: ${C_BOLD}$name${C_RESET}..."
  qm create "$vmid" "${args[@]}"
  log_success "VM $vmid ($name) provisioned successfully."
}

# ------------------------------------------------------------------------------
# VM 200: opnsense
# ------------------------------------------------------------------------------
create_or_skip_vm 200 "opnsense" \
  --name "opnsense" \
  --memory 2048 \
  --balloon 1024 \
  --cores 2 \
  --cpu host \
  --scsihw virtio-scsi-pci \
  --scsi0 "$STORAGE:16,discard=on,ssd=1" \
  --net0 "virtio,bridge=$BRIDGE,firewall=0" \
  --ide2 "$ISO_STORAGE/OPNsense-dvd-amd64.iso,media=cdrom" \
  --boot "order=scsi0;ide2;net0" \
  --ostype other \
  --tags "firewall;freebsd;kvm;router;stefanut"

# ------------------------------------------------------------------------------
# VM 201: windows
# ------------------------------------------------------------------------------
create_or_skip_vm 201 "windows" \
  --name "windows" \
  --memory 8192 \
  --balloon 4096 \
  --cores 4 \
  --cpu host \
  --ide0 "$STORAGE:256" \
  --net0 "virtio,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/en-us_windows_server_2025_updated_aug_2026_x64_dvd_b0833651.iso,media=cdrom" \
  --boot "order=ide0;ide2;net0" \
  --ostype win11 \
  --tags "microsoft;server;windows"

# ------------------------------------------------------------------------------
# VM 202: rhel
# ------------------------------------------------------------------------------
create_or_skip_vm 202 "rhel" \
  --name "rhel" \
  --memory 2048 \
  --balloon 1024 \
  --cores 2 \
  --cpu x86-64-v2-AES \
  --scsihw virtio-scsi-single \
  --scsi0 "$STORAGE:50,iothread=1" \
  --net0 "virtio,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/rhel-9.8-x86_64-boot.iso,media=cdrom" \
  --boot "order=scsi0;ide2;net0" \
  --ostype l26 \
  --tags "linux;redhat;rhel"

# ------------------------------------------------------------------------------
# VM 203: freebsd
# ------------------------------------------------------------------------------
create_or_skip_vm 203 "freebsd" \
  --name "freebsd" \
  --memory 1024 \
  --balloon 512 \
  --cores 2 \
  --cpu x86-64-v2-AES \
  --ide0 "$STORAGE:25" \
  --net0 "e1000,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/FreeBSD-15.1-RELEASE-amd64-disc1.iso,media=cdrom" \
  --boot "order=ide0;ide2;net0" \
  --ostype other \
  --tags "bsd;freebsd"

# ------------------------------------------------------------------------------
# VM 204: openbsd
# ------------------------------------------------------------------------------
create_or_skip_vm 204 "openbsd" \
  --name "openbsd" \
  --memory 1024 \
  --balloon 512 \
  --cores 2 \
  --cpu x86-64-v2-AES \
  --ide0 "$STORAGE:25" \
  --net0 "e1000,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/install79.iso,media=cdrom" \
  --boot "order=ide0;ide2;net0" \
  --ostype other \
  --tags "bsd;openbsd"

# ------------------------------------------------------------------------------
# VM 205: talos
# ------------------------------------------------------------------------------
create_or_skip_vm 205 "talos" \
  --name "talos" \
  --memory 2048 \
  --balloon 1024 \
  --cores 2 \
  --cpu x86-64-v2-AES \
  --scsihw virtio-scsi-single \
  --scsi0 "$STORAGE:32,iothread=1" \
  --net0 "virtio,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/metal-amd64.iso,media=cdrom" \
  --boot "order=scsi0;ide2;net0" \
  --ostype l26 \
  --tags "kubernetes;linux;talos"

# ------------------------------------------------------------------------------
# VM 206: macOS (OpenCore Hackintosh)
# ------------------------------------------------------------------------------
create_or_skip_vm 206 "macOS" \
  --name "macOS" \
  --memory 6144 \
  --balloon 2048 \
  --cores 4 \
  --cpu Haswell-noTSX \
  --args "-device isa-applesmc,osk=\"ourhardworkbythesewordsguardedpleasedontsteal(c)AppleComputerInc\"" \
  --sata0 "$ISO_STORAGE/opencore-osx-proxmox-vm.iso,cache=unsafe,media=disk" \
  --virtio0 "$STORAGE:120,cache=none,discard=on" \
  --net0 "vmxnet3,bridge=$BRIDGE,firewall=0" \
  --ide2 "$ISO_STORAGE/recovery-monterey.iso,media=cdrom" \
  --boot "order=sata0;virtio0;ide2" \
  --ostype other \
  --tags "apple;hackintosh;macos"

# ------------------------------------------------------------------------------
# VM 207: openindiana
# ------------------------------------------------------------------------------
create_or_skip_vm 207 "openindiana" \
  --name "openindiana" \
  --memory 3072 \
  --balloon 1536 \
  --cores 2 \
  --cpu x86-64-v2-AES \
  --ide0 "$STORAGE:50" \
  --net0 "e1000,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/OI-hipster-gui-20260430.iso,media=cdrom" \
  --boot "order=ide0;ide2;net0" \
  --ostype other \
  --tags "openindiana;solaris"

# ------------------------------------------------------------------------------
# VM 208: netbsd
# ------------------------------------------------------------------------------
create_or_skip_vm 208 "netbsd" \
  --name "netbsd" \
  --memory 512 \
  --balloon 256 \
  --cores 1 \
  --cpu x86-64-v2-AES \
  --scsihw virtio-scsi-single \
  --scsi0 "$STORAGE:12,iothread=1" \
  --net0 "virtio,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/NetBSD-11.0-amd64-dvd.iso,media=cdrom" \
  --boot "order=scsi0;ide2;net0" \
  --ostype other \
  --tags "bsd;netbsd"

# ------------------------------------------------------------------------------
# VM 209: nixos
# ------------------------------------------------------------------------------
create_or_skip_vm 209 "nixos" \
  --name "nixos" \
  --memory 1024 \
  --balloon 512 \
  --cores 2 \
  --cpu x86-64-v2-AES \
  --scsihw virtio-scsi-single \
  --scsi0 "$STORAGE:22,iothread=1" \
  --net0 "virtio,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/nixos-minimal-26.05.8846.a3116115851d-x86_64-linux.iso,media=cdrom" \
  --boot "order=scsi0;ide2;net0" \
  --ostype l26 \
  --tags "linux;nixos"

# ------------------------------------------------------------------------------
# VM 210: dragonflybsd
# ------------------------------------------------------------------------------
create_or_skip_vm 210 "dragonflybsd" \
  --name "dragonflybsd" \
  --memory 1024 \
  --balloon 512 \
  --cores 2 \
  --cpu x86-64-v2-AES \
  --ide0 "$STORAGE:15" \
  --net0 "e1000,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/dfly-x86_64-6.4.2_REL.iso,media=cdrom" \
  --boot "order=ide0;ide2;net0" \
  --ostype other \
  --tags "bsd;dragonfly"

# ------------------------------------------------------------------------------
# VM 211: openstack
# ------------------------------------------------------------------------------
create_or_skip_vm 211 "openstack" \
  --name "openstack" \
  --memory 4096 \
  --balloon 2048 \
  --cores 2 \
  --cpu x86-64-v2-AES \
  --scsihw virtio-scsi-single \
  --scsi0 "$STORAGE:32,discard=on,ssd=1" \
  --net0 "virtio,bridge=$BRIDGE,firewall=1" \
  --boot "order=scsi0;net0" \
  --ostype l26 \
  --tags "cloud;horizon;iaas;neutron;node1;nova;openstack"

# ------------------------------------------------------------------------------
# VM 212: Metasploitable2
# ------------------------------------------------------------------------------
create_or_skip_vm 212 "Metasploitable2" \
  --name "Metasploitable2" \
  --memory 512 \
  --cores 1 \
  --cpu x86-64-v2-AES \
  --ide0 "$STORAGE:8" \
  --net0 "virtio,bridge=$BRIDGE,firewall=1" \
  --boot "order=ide0;net0" \
  --ostype l26 \
  --tags "cyber;metasploit;metasploitable2;penetration-testing;red-team;vm212"

# ------------------------------------------------------------------------------
# VM 213: tpot-honeypot
# ------------------------------------------------------------------------------
create_or_skip_vm 213 "tpot-honeypot" \
  --name "tpot-honeypot" \
  --memory 8192 \
  --balloon 4096 \
  --cores 4 \
  --scsihw virtio-scsi-pci \
  --scsi0 "$STORAGE:60" \
  --net0 "virtio,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/debian-netinst.iso,media=cdrom" \
  --boot "order=scsi0;ide2" \
  --ostype l26 \
  --tags "cyber;honeypot;tpot;vm213"

# ------------------------------------------------------------------------------
# VM 214: haiku
# ------------------------------------------------------------------------------
create_or_skip_vm 214 "haiku" \
  --name "haiku" \
  --memory 2048 \
  --balloon 1024 \
  --cores 2 \
  --scsihw virtio-scsi-pci \
  --scsi0 "$STORAGE:20" \
  --net0 "e1000,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/haiku-r1beta5.iso,media=cdrom" \
  --boot "order=scsi0;ide2" \
  --ostype other \
  --tags "haikuos;vm214"

# ------------------------------------------------------------------------------
# VM 215: plan9
# ------------------------------------------------------------------------------
create_or_skip_vm 215 "plan9" \
  --name "plan9" \
  --memory 512 \
  --cores 1 \
  --cpu x86-64-v2-AES \
  --scsihw virtio-scsi-single \
  --ide0 "$STORAGE:12" \
  --net0 "e1000,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/plan9.iso,media=cdrom" \
  --boot "order=ide0;ide2;net0" \
  --ostype other \
  --tags "belllabs;plan9;vm215"

# ------------------------------------------------------------------------------
# VM 216: reactos
# ------------------------------------------------------------------------------
create_or_skip_vm 216 "reactos" \
  --name "reactos" \
  --memory 1024 \
  --cores 1 \
  --cpu x86-64-v2-AES \
  --scsihw virtio-scsi-single \
  --ide0 "$STORAGE:32" \
  --net0 "e1000,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/ReactOS-0.4.16-i386.iso,media=cdrom" \
  --boot "order=ide0;ide2;net0" \
  --ostype other \
  --tags "reactos;windows-nt;win32;vm216"

# ------------------------------------------------------------------------------
# VM 217: securityonion
# ------------------------------------------------------------------------------
create_or_skip_vm 217 "securityonion" \
  --name "securityonion" \
  --memory 8192 \
  --balloon 4096 \
  --cores 4 \
  --cpu x86-64-v2-AES \
  --scsihw virtio-scsi-single \
  --scsi0 "$STORAGE:50" \
  --net0 "virtio,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/securityonion.iso,media=cdrom" \
  --boot "order=scsi0;ide2;net0" \
  --ostype l26 \
  --tags "blue-team;hids;log-analysis;security-onion;siem;vm217;wazuh"

# ------------------------------------------------------------------------------
# VM 218: remnux
# ------------------------------------------------------------------------------
create_or_skip_vm 218 "remnux" \
  --name "remnux" \
  --memory 4096 \
  --balloon 2048 \
  --cores 2 \
  --cpu x86-64-v2-AES \
  --scsihw virtio-scsi-single \
  --scsi0 "$STORAGE:40" \
  --net0 "virtio,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/remnux-installer.iso,media=cdrom" \
  --boot "order=scsi0;ide2;net0" \
  --ostype l26 \
  --tags "cyber;dfir;malware-analysis;remnux;reverse-engineering;vm218"

# ------------------------------------------------------------------------------
# VM 219: redox
# ------------------------------------------------------------------------------
create_or_skip_vm 219 "redox" \
  --name "redox" \
  --memory 2048 \
  --balloon 1024 \
  --cores 2 \
  --cpu x86-64-v2-AES \
  --scsihw virtio-scsi-single \
  --scsi0 "$STORAGE:10" \
  --net0 "e1000,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/redox-0.9.0.iso,media=cdrom" \
  --boot "order=scsi0;ide2;net0" \
  --ostype other \
  --tags "microkernel;plan9-inspired;redox;redoxos;rust;vm219"

# ------------------------------------------------------------------------------
# VM 220: freedos
# ------------------------------------------------------------------------------
create_or_skip_vm 220 "freedos" \
  --name "freedos" \
  --memory 512 \
  --balloon 256 \
  --cores 1 \
  --cpu x86-64-v2-AES \
  --ide0 "$STORAGE:2" \
  --net0 "e1000,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/freedos-1.3.iso,media=cdrom" \
  --boot "order=ide0;ide2;net0" \
  --ostype other \
  --tags "dos;freedos;legacy;vm220;x86-16"

echo ""
echo -e "${C_GREEN}${C_BOLD}======================================================================${C_RESET}"
echo -e "${C_GREEN}${C_BOLD}    All 21 VMs (200-220) Processed Successfully on Node 1 (x86_64)!   ${C_RESET}"
echo -e "${C_GREEN}${C_BOLD}======================================================================${C_RESET}"
echo ""
qm list
