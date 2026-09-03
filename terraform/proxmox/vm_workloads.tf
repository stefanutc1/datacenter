# ==============================================================================
# PROXMOX VIRTUAL MACHINES (DEEP INFRASTRUCTURE & CYBER DEFENSE)
# ==============================================================================

# VM 200: OPNsense Stateful Core Firewall & Suricata IDS/IPS
module "vm_opnsense" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 200
  name         = "opnsense-firewall"
  description  = "Perimeter Security Gateway, WireGuard VPN & Suricata/Snort DPI"
  cores        = 2
  memory       = 1024
  disk_size    = 32
  storage_pool = "local-lvm"
  vlan_tag     = 10
  tags         = ["network", "firewall", "ids-ips", "terraform"]
}

# VM 201: Windows Server 2025 Datacenter (Active Directory & GPO Lab)
module "vm_windows_server_2025" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 201
  name         = "win-server-2025"
  description  = "Active Directory Domain Services (AD DS), DNS, GPO & Sysmon Forwarding"
  cores        = 4
  memory       = 4096
  disk_size    = 64
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["windows", "active-directory", "sysmon", "terraform"]
}

# VM 204: Talos Linux Immutable Kubernetes Node
module "vm_talos_kubernetes" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 204
  name         = "talos-k8s-node01"
  description  = "Zero-SSH, API-managed immutable Kubernetes control-plane/worker"
  cores        = 2
  memory       = 2048
  disk_size    = 30
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["kubernetes", "talos", "immutable", "terraform"]
}

# VM 205: T-Pot Multi-Honeypot Cluster in Isolated DMZ
module "vm_tpot_honeypot" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 205
  name         = "tpot-honeypot-dmz"
  description  = "Multi-honeypot platform (Cowrie, Dionaea, RDP honeypot) with AbuseIPDB"
  cores        = 4
  memory       = 3072
  disk_size    = 40
  storage_pool = "local-lvm"
  vlan_tag     = 40
  tags         = ["cyber", "honeypot", "tpot", "dmz", "terraform"]
}

# VM 206: macOS Monterey 12.7 (OpenCore KVM Hackintosh on Proxmox VE)
module "vm_macos_monterey" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 206
  name         = "macos-monterey"
  description  = "macOS Monterey 12.7 (OpenCore KVM Hackintosh, Xcode Build Runner & Apple GUI Testing)"
  cores        = 4
  memory       = 4096
  balloon      = 2048
  disk_size    = 64
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["macos", "monterey", "hackintosh", "opencore", "apple", "terraform"]
}
