# ==============================================================================
# BACHELOR THESIS LABORATORY INFRASTRUCTURE (LUCRARE DE LICENȚĂ)
# Dedicated CyberLab Environment · VLAN 30 & Isolated Bridge vmbr1
# Provider: bpg/proxmox (Proxmox VE REST API)
# Hardware: Intel Core i3-10100F (Node 1 x86_64)
# ==============================================================================

# VM 300: Windows Server 2019 Standard (Active Directory Domain Services & Domain Security)
module "vm_windows_server_licenta_300" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 300
  name         = "windows-server-licenta"
  description  = "Bachelor Thesis Lab (Lucrare de Licenta) - Windows Server 2019 Standard (Massgrave GVLK / KMS Activation, Active Directory DS & Domain Security Lab)"
  cores        = 4
  memory       = 8192
  balloon      = 4096
  disk_size    = 64
  storage_pool = "local-lvm"
  vlan_tag     = 20
  onboot       = false
  tags         = ["microsoft", "server", "windows", "windows-server-2019", "licenta", "bachelor-thesis", "q35", "gtx1050ti", "terraform"]
}

# VM 301: Metasploitable Linux Target (Penetration Testing & Detection Tuning)
module "vm_metasploitable_licenta_301" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 301
  name         = "metasploitable-licenta"
  description  = "Bachelor Thesis Lab (Lucrare de Licenta) - Metasploitable Linux Target (Penetration Testing, Red Teaming & Suricata/Wazuh Vulnerability Lab)"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 20
  storage_pool = "local-lvm"
  vlan_tag     = 40
  onboot       = false
  tags         = ["cyber", "licenta", "bachelor-thesis", "metasploit", "metasploitable", "pentest", "red-team", "terraform"]
}

# VM 302: Kali Linux Penetration Testing & Offensive Security Workstation
module "vm_kali_licenta_302" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 302
  name         = "kali-licenta"
  description  = "Bachelor Thesis Lab (Lucrare de Licenta) - Kali Linux Offensive Security & Red Team Pentest Workstation"
  cores        = 2
  memory       = 4096
  balloon      = 2048
  disk_size    = 30
  storage_pool = "local-lvm"
  bridge       = "vmbr1"
  vlan_tag     = 30
  onboot       = false
  tags         = ["cyber", "licenta", "bachelor-thesis", "kali", "pentest", "red-team", "terraform"]
}

# CT 303: OWASP Juice Shop Vulnerable Web Target (Alpine LXC + Docker Runtime)
module "lxc_juiceshop_licenta_303" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 303
  hostname     = "owasp-licenta"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 512
  swap         = 256
  disk_size    = "8G"
  storage_pool = "local-lvm"
  ip_address   = "192.168.30.103/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  bridge       = "vmbr1"
  vlan_tag     = 30
  nesting      = true
  onboot       = false
  tags         = ["cyber", "licenta", "bachelor-thesis", "owasp-juice-shop", "vulnerable-app", "terraform"]
}
