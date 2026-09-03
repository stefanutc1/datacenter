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
  memory       = 7168
  balloon      = 2048
  disk_size    = 64
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["macos", "monterey", "hackintosh", "opencore", "apple", "terraform"]
}

# VM 207: OpenIndiana Hipster (Enterprise ZFS Reference, Zones & DTrace)
module "vm_openindiana_hipster" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 207
  name         = "openindiana-hipster"
  description  = "OpenIndiana Hipster (illumos kernel, Reference Enterprise ZFS, Solaris Zones, Crossbow VNICs & DTrace)"
  cores        = 2
  memory       = 3072
  balloon      = 1536
  disk_size    = 50
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["openindiana", "illumos", "solaris", "zfs", "dtrace", "terraform"]
}

# VM 208: NetBSD 10.0 (Portable Clean Unix Reference & Rump Anykernel)
module "vm_netbsd" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 208
  name         = "netbsd-portable"
  description  = "NetBSD 10.0 (Portable Clean Unix Reference, Rump Anykernel Architecture & pkgsrc Packaging)"
  cores        = 2
  memory       = 512
  balloon      = 256
  disk_size    = 12
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["netbsd", "bsd", "rump", "pkgsrc", "portable-unix", "terraform"]
}

# VM 209: NixOS 24.11 Minimal (Declarative Immutable Linux & Flakes)
module "vm_nixos" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 209
  name         = "nixos-minimal"
  description  = "NixOS 24.11 Minimal (Declarative Immutable Linux, Flakes Reproducible Builds & Atomic Rollbacks)"
  cores        = 2
  memory       = 1024
  balloon      = 512
  disk_size    = 22
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["nixos", "declarative", "immutable", "flakes", "reproducible", "terraform"]
}

# VM 210: DragonFly BSD 6.4 (HAMMER2 Journaling FS & Hybrid Microkernel)
module "vm_dragonflybsd" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 210
  name         = "dragonflybsd-hammer2"
  description  = "DragonFly BSD 6.4 (HAMMER2 Journaling File System Lab, Hybrid Microkernel & Lockless SMP)"
  cores        = 2
  memory       = 1024
  balloon      = 512
  disk_size    = 15
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["dragonflybsd", "bsd", "hammer2", "microkernel", "smp", "terraform"]
}

# VM 211: Security Sandbox & Staging Lab (DFIR Dynamic Detonation)
module "vm_staging_sandbox" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 211
  name         = "sandbox-staging-lab"
  description  = "Ephemeral Security Analysis & Staging Sandbox (DFIR Dynamic Detonation / Protocol Testing)"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 20
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["sandbox", "staging", "dfir", "security", "lab", "terraform"]
}

