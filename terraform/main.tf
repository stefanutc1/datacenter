# ==============================================================================
# HOMELAB INFRASTRUCTURE AS CODE — MASTER DECLARATION
# Provider: bpg/proxmox (Proxmox VE REST API)
# Hardware: Intel Core i3-10100F (Node 1 x86_64)
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. NETWORK SEGMENT ABSTRACTIONS (VLAN DEFINITIONS)
# ------------------------------------------------------------------------------
module "vlan_10_mgmt" {
  source                  = "./modules/network_segment"
  vlan_id                 = 10
  name                    = "Management & Storage Subnet"
  cidr                    = "192.168.1.0/24"
  gateway                 = "192.168.1.1"
  default_firewall_policy = "PASS"
}

module "vlan_20_core" {
  source                  = "./modules/network_segment"
  vlan_id                 = 20
  name                    = "Core Microservices & Ingress"
  cidr                    = "192.168.20.0/24"
  gateway                 = "192.168.1.132"
  default_firewall_policy = "DROP"
}

module "vlan_30_cyber" {
  source                  = "./modules/network_segment"
  vlan_id                 = 30
  name                    = "CyberLab & Malware Sandboxes"
  cidr                    = "192.168.30.0/24"
  gateway                 = "192.168.1.132"
  default_firewall_policy = "DROP"
}

module "vlan_40_dmz" {
  source                  = "./modules/network_segment"
  vlan_id                 = 40
  name                    = "DMZ Deception & Honeypots"
  cidr                    = "192.168.40.0/24"
  gateway                 = "192.168.1.132"
  default_firewall_policy = "DROP"
}

module "vlan_50_iot" {
  source                  = "./modules/network_segment"
  vlan_id                 = 50
  name                    = "IoT & Physical Edge Sensors"
  cidr                    = "192.168.50.0/24"
  gateway                 = "192.168.1.132"
  default_firewall_policy = "DROP"
}

# ------------------------------------------------------------------------------
# 2. QEMU / KVM ENTERPRISE VIRTUAL MACHINES (DYNAMIC VIRTIO BALLOONING)
# ------------------------------------------------------------------------------
module "vm_opnsense_200" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 200
  name         = "opnsense"
  description  = "OPNsense Perimeter Stateful Firewall, Suricata IDS/IPS & WireGuard Kernel Rotator"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 16
  storage_pool = "local-lvm"
  vlan_tag     = 10
  tags         = ["firewall", "security", "opnsense", "suricata", "wireguard", "terraform"]
}

module "vm_win_server_201" {
  source                 = "./modules/proxmox_vm"
  target_node            = var.primary_node
  vmid                   = 201
  name                   = "windows"
  description            = "Windows Server 2025 Datacenter (AD DS, GPO, DNS, Sysmon Forwarder & GTX 1050 Ti Passthrough)"
  cores                  = 2
  memory                 = 7168
  balloon                = 4096
  disk_size              = 120
  storage_pool           = "local-lvm"
  vlan_tag               = 20
  pci_passthrough_device = "gtx1050ti"
  tags                   = ["windows", "active-directory", "gpo", "sysmon", "gtx1050ti", "terraform"]
}

module "vm_rhel_202" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 202
  name         = "rhel"
  description  = "Red Hat Enterprise Linux 9.8 (SELinux Enforcing, Podman Rootless, Enterprise Workload)"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 50
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["rhel", "redhat", "enterprise", "selinux", "podman", "terraform"]
}

module "vm_openstack_203" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 203
  name         = "openstack"
  description  = "OpenStack Enterprise Private Cloud Controller & Compute (Nova, Neutron, Keystone, Glance, Horizon Dashboard)"
  cores        = 2
  memory       = 4096
  balloon      = 2048
  disk_size    = 32
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["openstack", "cloud", "iaas", "nova", "neutron", "horizon", "terraform"]
}

module "vm_metasploitable2_204" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 204
  name         = "metasploitable2"
  description  = "Metasploitable 2 (Intentionally Vulnerable Linux Target, Penetration Testing & IDS/IPS Tuning)"
  cores        = 1
  memory       = 512
  disk_size    = 8
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["cyber", "metasploit", "metasploitable2", "penetration-testing", "red-team", "terraform"]
}

module "vm_tpot_205" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 205
  name         = "tpot-honeypot"
  description  = "T-Pot Multi-Honeypot Decoy Platform (Cowrie, Dionaea, Honeytrap, Elastic, Kibana, Suricata)"
  cores        = 4
  memory       = 8192
  balloon      = 4096
  disk_size    = 60
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["cyber", "honeypot", "tpot", "threat-intel", "elastic", "suricata", "terraform"]
}

module "vm_securityonion_206" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 206
  name         = "securityonion"
  description  = "Security Onion / Wazuh SIEM Platform (Zeek, Suricata, Elastic, Kibana & HIDS Monitoring)"
  cores        = 4
  memory       = 8192
  balloon      = 4096
  disk_size    = 50
  storage_pool = "local-lvm"
  vlan_tag     = 30
  tags         = ["blue-team", "hids", "log-analysis", "security-onion", "siem", "wazuh", "terraform"]
}

module "vm_remnux_207" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 207
  name         = "remnux"
  description  = "REMnux Linux Toolkit (Malware Analysis, Reverse Engineering, Memory Forensics & DFIR)"
  cores        = 2
  memory       = 4096
  balloon      = 2048
  disk_size    = 40
  storage_pool = "local-lvm"
  vlan_tag     = 35
  tags         = ["cyber", "dfir", "malware-analysis", "remnux", "reverse-engineering", "terraform"]
}

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
  tags         = ["microsoft", "server", "windows", "windows-server-2019", "licenta", "bachelor-thesis", "terraform"]
}

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
  tags         = ["cyber", "licenta", "bachelor-thesis", "metasploit", "metasploitable", "pentest", "red-team", "terraform"]
}




# Ingress Reverse Proxy runs natively on OPNsense Core (VM 200 - 192.168.1.134)



module "lxc_immich" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 100
  hostname     = "immich"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 4
  memory       = 896
  disk_size    = "32G"
  ip_address   = "192.168.1.15/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["photos", "ai", "facial-recognition", "media", "terraform", "node1"]
}

module "lxc_nextcloud" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 101
  hostname     = "nextcloud"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 2
  memory       = 512
  disk_size    = "20G"
  ip_address   = "192.168.1.8/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["cloud", "storage", "webdav", "productivity", "terraform", "node1"]
}


module "lxc_homeassistant" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 102
  hostname     = "homeassistant"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 2
  memory       = 384
  disk_size    = "16G"
  ip_address   = "192.168.1.10/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["automation", "iot", "smart-home", "zigbee", "terraform", "node1"]
}

module "lxc_n8n" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 103
  hostname     = "n8n"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 2
  memory       = 384
  disk_size    = "8G"
  ip_address   = "192.168.1.13/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["automation", "workflows", "soar", "webhooks", "terraform", "node1"]
}


module "lxc_scrutiny" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 104
  hostname     = "scrutiny"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 1
  memory       = 128
  disk_size    = "4G"
  ip_address   = "192.168.1.14/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["monitoring", "smart", "storage", "telemetry", "terraform", "node1"]
}

module "lxc_media_suite" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 105
  hostname     = "media-suite"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 2
  memory       = 512
  disk_size    = "16G"
  ip_address   = "192.168.1.18/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["media", "jellyfin", "streaming", "transcoding", "terraform", "node1"]
}

module "lxc_ollama" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 106
  hostname     = "ollama"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 4
  memory       = 2048
  disk_size    = "16G"
  ip_address   = "192.168.1.110/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["ai", "llm", "cuda", "gtx1050ti", "local-ai", "terraform", "node1"]
}

module "lxc_openwebui" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 107
  hostname     = "openwebui"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 2
  memory       = 384
  disk_size    = "8G"
  ip_address   = "192.168.1.111/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["ai", "chat-ui", "rag", "assistant", "terraform", "node1"]
}

module "lxc_whisper" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 108
  hostname     = "whisper"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 2
  memory       = 1024
  disk_size    = "8G"
  ip_address   = "192.168.1.112/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["ai", "whisper", "stt", "speech-to-text", "terraform", "node1"]
}

module "lxc_flowise" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 109
  hostname     = "flowise"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 512
  disk_size    = "4G"
  ip_address   = "192.168.1.113/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["ai", "agents", "langchain", "workflow-builder", "terraform", "node1"]
}

module "lxc_paperless_ai" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 110
  hostname     = "paperless-ai"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "1G"
  ip_address   = "192.168.1.114/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["ai", "dms", "ocr", "deepseek", "terraform", "node1"]
}

module "lxc_codeserver" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 111
  hostname     = "code-server"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 512
  disk_size    = "4G"
  ip_address   = "192.168.1.115/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["dev", "ide", "codeserver", "web-ide", "terraform", "node1"]
}

module "lxc_pbs" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 112
  hostname     = "proxmox-backup-server"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 512
  disk_size    = "4G"
  ip_address   = "192.168.1.116/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["storage", "backup", "pbs", "deduplication", "terraform", "node1"]
}

module "lxc_pdm" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 113
  hostname     = "proxmox-datacenter-manager"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 512
  disk_size    = "4G"
  ip_address   = "192.168.1.117/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["management", "pdm", "multi-cluster", "terraform", "node1"]
}

module "lxc_woodpecker_k0s" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 114
  hostname     = "woodpecker-k0s"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 512
  disk_size    = "8G"
  ip_address   = "192.168.1.118/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["ci", "cd", "woodpecker", "k0s", "kubernetes", "alpine", "terraform", "node1"]
}

# ------------------------------------------------------------------------------
# Enterprise Networking, Proxmox SDN, Dual-Firewall & Hybrid Cloud Tunnel
# ==============================================================================

module "proxmox_sdn" {
  source = "./modules/proxmox_sdn"
}

module "proxmox_firewall" {
  source = "./modules/proxmox_firewall"
}

module "hybrid_tunnel" {
  source = "./modules/hybrid_tunnel"
}



