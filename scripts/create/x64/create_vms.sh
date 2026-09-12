#!/usr/bin/env bash
# ==============================================================================
# Datacenter Fleet Automation: Provision all Virtual Machines on Node 1 (x86_64)
# Target Host: Node 1 Primary Proxmox VE (x86_64 / amd64)
# Inventory: Enterprise Virtual Machines (VMs 200-202, 205-209, 300, 301)
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
echo "    PROXMOX VE NODE 1 (x86_64): VIRTUAL MACHINE PROVISIONER           "
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
# VM 203: openstack
# ------------------------------------------------------------------------------
create_or_skip_vm 203 "openstack" \
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
  --tags "cloud;horizon;iaas;neutron;node1;nova;openstack;vm203"

# ------------------------------------------------------------------------------
# VM 204: Metasploitable2
# ------------------------------------------------------------------------------
create_or_skip_vm 204 "Metasploitable2" \
  --name "Metasploitable2" \
  --memory 512 \
  --cores 1 \
  --cpu x86-64-v2-AES \
  --ide0 "$STORAGE:8" \
  --net0 "virtio,bridge=$BRIDGE,firewall=1" \
  --boot "order=ide0;net0" \
  --ostype l26 \
  --tags "cyber;metasploit;metasploitable2;penetration-testing;red-team;vm204"

# ------------------------------------------------------------------------------
# VM 205: tpot-honeypot
# ------------------------------------------------------------------------------
create_or_skip_vm 205 "tpot-honeypot" \
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
  --tags "cyber;honeypot;tpot;vm205"

# ------------------------------------------------------------------------------
# VM 206: securityonion
# ------------------------------------------------------------------------------
create_or_skip_vm 206 "securityonion" \
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
  --tags "blue-team;hids;log-analysis;security-onion;siem;vm206;wazuh"

# ------------------------------------------------------------------------------
# VM 207: remnux
# ------------------------------------------------------------------------------
create_or_skip_vm 207 "remnux" \
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
  --tags "cyber;dfir;malware-analysis;remnux;reverse-engineering;vm207"

# ------------------------------------------------------------------------------
# VM 300: windows-server-licenta (Bachelor Thesis / Lucrare de Licenta)
# ------------------------------------------------------------------------------
create_or_skip_vm 300 "windows-server-licenta" \
  --name "windows-server-licenta" \
  --description "Bachelor Thesis Lab (Lucrare de Licenta) - Windows Server 2019 Standard (Massgrave GVLK / KMS Activation, Active Directory DS & Domain Security Lab)" \
  --memory 8192 \
  --balloon 4096 \
  --cores 4 \
  --cpu host \
  --scsihw virtio-scsi-single \
  --scsi0 "$STORAGE:64,discard=on,ssd=1" \
  --net0 "virtio,bridge=$BRIDGE,firewall=1" \
  --ide2 "$ISO_STORAGE/windows_server_2019_x64.iso,media=cdrom" \
  --boot "order=scsi0;ide2;net0" \
  --ostype win11 \
  --tags "microsoft;server;windows;windows-server-2019;licenta;bachelor-thesis;vm300"

# ------------------------------------------------------------------------------
# VM 301: metasploitable-licenta (Bachelor Thesis / Lucrare de Licenta)
# ------------------------------------------------------------------------------
create_or_skip_vm 301 "metasploitable-licenta" \
  --name "metasploitable-licenta" \
  --description "Bachelor Thesis Lab (Lucrare de Licenta) - Metasploitable Linux Target (Penetration Testing, Red Teaming & Suricata/Wazuh Vulnerability Lab)" \
  --memory 2048 \
  --balloon 1024 \
  --cores 2 \
  --cpu x86-64-v2-AES \
  --scsihw virtio-scsi-single \
  --scsi0 "$STORAGE:20,discard=on,ssd=1" \
  --net0 "virtio,bridge=$BRIDGE,firewall=1" \
  --boot "order=scsi0;net0" \
  --ostype l26 \
  --tags "cyber;licenta;bachelor-thesis;metasploit;metasploitable;pentest;red-team;vm301"

# ------------------------------------------------------------------------------
# VM 302: kali-licenta (Bachelor Thesis / Lucrare de Licenta)
# ------------------------------------------------------------------------------
create_or_skip_vm 302 "kali-licenta" \
  --name "kali-licenta" \
  --description "Bachelor Thesis Lab (Lucrare de Licenta) - Kali Linux Offensive Security & Red Team Pentest Workstation" \
  --memory 4096 \
  --balloon 2048 \
  --cores 2 \
  --cpu host \
  --scsihw virtio-scsi-single \
  --scsi0 "$STORAGE:30,discard=on,ssd=1" \
  --ide2 "$ISO_STORAGE/kali-linux-2026.2-installer-netinst-amd64.iso,media=cdrom" \
  --net0 "virtio,bridge=vmbr1,firewall=1,tag=30" \
  --boot "order=scsi0;ide2;net0" \
  --ostype l26 \
  --tags "cyber;licenta;bachelor-thesis;kali;pentest;red-team;vm302"


echo ""
echo -e "${C_GREEN}${C_BOLD}======================================================================${C_RESET}"
echo -e "${C_GREEN}${C_BOLD}    Virtual Machines Processed Successfully on Node 1 (x86_64)!       ${C_RESET}"
echo -e "${C_GREEN}${C_BOLD}======================================================================${C_RESET}"
echo ""
qm list

