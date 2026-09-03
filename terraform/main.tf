# ==============================================================================
# HOMELAB INFRASTRUCTURE AS CODE — MASTER DECLARATION
# Provider: bpg/proxmox (Proxmox VE REST API)
# Hardware: Intel Core i3-10100F (Node 1 x86_64) & Apple M1 Silicon (Node 3 ARM64)
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

module "vm_freebsd_203" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 203
  name         = "freebsd"
  description  = "FreeBSD 15.1-RELEASE (Native OpenZFS Storage Pool, FreeBSD Jails & Network Lab)"
  cores        = 2
  memory       = 1024
  balloon      = 512
  disk_size    = 25
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["freebsd", "bsd", "openzfs", "jails", "storage", "terraform"]
}

module "vm_openbsd_204" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 204
  name         = "openbsd"
  description  = "OpenBSD 7.9 Bastion (Hardened Jump Host, Packet Filter PF, pledge/unveil sandboxing)"
  cores        = 2
  memory       = 1024
  balloon      = 512
  disk_size    = 25
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["openbsd", "bsd", "security", "bastion", "pf", "hardened", "terraform"]
}

module "vm_talos_205" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 205
  name         = "talos"
  description  = "Talos Linux 1.7 (Minimalist Immutable OS, Declarative gRPC Control, Kubernetes Worker Node)"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 32
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["talos", "kubernetes", "k8s", "immutable", "grpc", "terraform"]
}

module "vm_macos_monterey_206" {
  source       = "./modules/proxmox_vm"
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

module "vm_vscode_server_207" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 207
  name         = "vscode-server-vm207"
  description  = "Secondary Dedicated VS Code Server Cloud Workspace & Docker DevContainers"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 32
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["dev", "vscode", "codeserver", "ide", "docker", "terraform"]
}

# ------------------------------------------------------------------------------
# 3. PROXMOX CORE LXC CONTAINERS (NODE 1 — x86_64 Primar)
# ------------------------------------------------------------------------------
module "lxc_nginx" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 100
  hostname     = "nginx"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 2
  memory       = 112
  disk_size    = "4G"
  ip_address   = "192.168.1.3/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["ingress", "proxy", "ssl", "reverse-proxy", "terraform", "node1"]
}

module "lxc_pihole" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 101
  hostname     = "pihole"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 1
  memory       = 96
  disk_size    = "4G"
  ip_address   = "192.168.1.4/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["dns", "sinkhole", "adblock", "privacy", "terraform", "node1"]
}

module "lxc_tailscale" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 102
  hostname     = "tailscale"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 1
  memory       = 96
  disk_size    = "4G"
  ip_address   = "192.168.1.5/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["vpn", "wireguard", "mesh", "remote-access", "terraform", "node1"]
}

module "lxc_immich" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 103
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
  vmid         = 104
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

module "lxc_crowdsec" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 105
  hostname     = "crowdsec"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 1
  memory       = 128
  disk_size    = "4G"
  ip_address   = "192.168.1.9/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["security", "ips", "threat-intel", "bouncer", "terraform", "node1"]
}

module "lxc_homeassistant" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 106
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
  vmid         = 107
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

module "lxc_ollama" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 110
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
  vmid         = 111
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

module "lxc_paperless" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 112
  hostname     = "paperless"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 2
  memory       = 768
  disk_size    = "20G"
  ip_address   = "192.168.1.16/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["dms", "ocr", "documents", "archiving", "terraform", "node1"]
}

module "lxc_minio" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 113
  hostname     = "minio"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 384
  disk_size    = "8G"
  ip_address   = "192.168.1.17/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["storage", "s3", "object-store", "backup-target", "terraform", "node1"]
}

module "lxc_transmission" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 114
  hostname     = "transmission"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 256
  disk_size    = "8G"
  ip_address   = "192.168.1.19/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["media", "torrent", "p2p", "download-queue", "terraform", "node1"]
}

module "lxc_kavita" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 115
  hostname     = "kavita"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 384
  disk_size    = "8G"
  ip_address   = "192.168.1.20/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["media", "books", "manga", "reader", "terraform", "node1"]
}

module "lxc_stirling" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 116
  hostname     = "stirling"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 384
  disk_size    = "8G"
  ip_address   = "192.168.1.21/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["pdf", "tools", "ocr", "converter", "terraform", "node1"]
}

module "lxc_meilisearch" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 117
  hostname     = "meilisearch"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 384
  disk_size    = "8G"
  ip_address   = "192.168.1.22/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["search", "engine", "full-text", "indexing", "terraform", "node1"]
}

module "lxc_vector" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 118
  hostname     = "vector"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 128
  disk_size    = "4G"
  ip_address   = "192.168.1.23/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["observability", "logs", "pipeline", "telemetry", "terraform", "node1"]
}

module "lxc_whisper" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 119
  hostname     = "whisper"
  ostemplate   = var.debian_template
  ostype       = "debian"
  cores        = 2
  memory       = 1024
  disk_size    = "8G"
  ip_address   = "192.168.1.24/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["ai", "whisper", "stt", "speech-to-text", "terraform", "node1"]
}

module "lxc_searxng" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 130
  hostname     = "searxng"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 256
  disk_size    = "4G"
  ip_address   = "192.168.1.25/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["search", "privacy", "metasearch", "no-tracking", "terraform", "node1"]
}

module "lxc_flowise" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 131
  hostname     = "flowise"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 512
  disk_size    = "4G"
  ip_address   = "192.168.1.26/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["ai", "agents", "langchain", "workflow-builder", "terraform", "node1"]
}

module "lxc_netalertx" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 132
  hostname     = "netalertx"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 128
  disk_size    = "4G"
  ip_address   = "192.168.1.27/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["security", "network-scanner", "intruder-detector", "terraform", "node1"]
}

module "lxc_rustdesk" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 133
  hostname     = "rustdesk"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 128
  disk_size    = "2G"
  ip_address   = "192.168.1.28/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["remote-desktop", "relay", "encrypted", "rust", "terraform", "node1"]
}

module "lxc_audiobookshelf" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 134
  hostname     = "audiobookshelf"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 256
  disk_size    = "4G"
  ip_address   = "192.168.1.29/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["audiobooks", "podcasts", "streaming", "media", "terraform", "node1"]
}

module "lxc_tubearchivist" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 135
  hostname     = "tubearchivist"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 512
  disk_size    = "8G"
  ip_address   = "192.168.1.30/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["video", "youtube", "archiver", "offline", "terraform", "node1"]
}

module "lxc_kopia" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 136
  hostname     = "kopia"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 128
  disk_size    = "4G"
  ip_address   = "192.168.1.31/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["backup", "snapshots", "deduplication", "encrypted", "terraform", "node1"]
}

module "lxc_wgeasy" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 137
  hostname     = "wgeasy"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 128
  disk_size    = "2G"
  ip_address   = "192.168.1.32/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["vpn", "wireguard", "qr-codes", "easy-admin", "terraform", "node1"]
}

module "lxc_calibreweb" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 138
  hostname     = "calibreweb"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 128
  disk_size    = "4G"
  ip_address   = "192.168.1.33/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["ebooks", "calibre", "library", "opds", "terraform", "node1"]
}

module "lxc_codeserver" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 140
  hostname     = "codeserver"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 384
  disk_size    = "8G"
  ip_address   = "192.168.1.40/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["dev", "vscode", "cloud-ide", "terminal", "terraform", "node1"]
}

module "lxc_pgadmin" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 141
  hostname     = "pgadmin"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 192
  disk_size    = "4G"
  ip_address   = "192.168.1.41/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["database", "postgres", "sql-console", "pgadmin", "terraform", "node1"]
}

module "lxc_cyberchef" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 142
  hostname     = "cyberchef"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.1.42/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["security", "dfir", "crypto-analysis", "decoder", "terraform", "node1"]
}

module "lxc_drawio" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 143
  hostname     = "drawio"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 96
  disk_size    = "2G"
  ip_address   = "192.168.1.43/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["diagrams", "architecture", "drawio", "schematics", "terraform", "node1"]
}

module "lxc_dozzle" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 144
  hostname     = "dozzle"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 48
  disk_size    = "2G"
  ip_address   = "192.168.1.44/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["logs", "dozzle", "docker-telemetry", "streaming", "terraform", "node1"]
}

module "lxc_kiwix" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 145
  hostname     = "kiwix"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 96
  disk_size    = "4G"
  ip_address   = "192.168.1.45/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["offline-wiki", "wikipedia", "knowledge", "zim", "terraform", "node1"]
}

module "lxc_romm" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 146
  hostname     = "romm"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 192
  disk_size    = "8G"
  ip_address   = "192.168.1.46/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["gaming", "roms", "retro", "metadata", "terraform", "node1"]
}

module "lxc_emulatorjs" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 147
  hostname     = "emulatorjs"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 96
  disk_size    = "4G"
  ip_address   = "192.168.1.47/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["gaming", "emulatorjs", "webassembly", "console", "terraform", "node1"]
}

module "lxc_pbs" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 149
  hostname     = "pbs"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 512
  disk_size    = "4G"
  ip_address   = "192.168.1.149/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["backup", "pbs", "proxmox-backup-server", "dedup", "terraform", "node1"]
}

module "lxc_pdm" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 150
  hostname     = "pdm"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 512
  disk_size    = "4G"
  ip_address   = "192.168.1.150/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["management", "pdm", "datacenter-manager", "cluster", "terraform", "node1"]
}

module "lxc_pmg" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 151
  hostname     = "pmg"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 2
  memory       = 512
  disk_size    = "4G"
  ip_address   = "192.168.1.151/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["security", "mail", "pmg", "antispam", "clamav", "terraform", "node1"]
}

module "lxc_vault" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 152
  hostname     = "vault"
  ostemplate   = var.alpine_template
  ostype       = "alpine"
  cores        = 1
  memory       = 256
  disk_size    = "4G"
  ip_address   = "192.168.1.152/24"
  gateway      = var.gateway_ip
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["security", "secrets", "hashicorp-vault", "openbao", "pki", "terraform", "node1"]
}


# ------------------------------------------------------------------------------
# 4. PROXMOX ARM64 LXC CONTAINERS (NODE 3 — Apple Silicon ARM64)
# ------------------------------------------------------------------------------
module "lxc_arm_it_tools" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 100
  hostname     = "it-tools"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.100/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["dev", "utilities", "developer-tools", "arm64", "terraform", "node3"]
}

module "lxc_arm_actual_budget" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 101
  hostname     = "actual-budget"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.101/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["finance", "budget", "ledger", "arm64", "terraform", "node3"]
}

module "lxc_arm_trilium_notes" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 102
  hostname     = "trilium-notes"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.102/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["notes", "knowledge", "wiki", "arm64", "terraform", "node3"]
}

module "lxc_arm_changedetection" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 103
  hostname     = "changedetection"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.103/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["monitoring", "web-watch", "automation", "arm64", "terraform", "node3"]
}

module "lxc_arm_scrutiny" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 104
  hostname     = "scrutiny"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.104/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["storage", "smart-disks", "hardware", "arm64", "terraform", "node3"]
}

module "lxc_arm_uptime_kuma" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 105
  hostname     = "uptime-kuma"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.105/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["monitoring", "uptime", "status-page", "arm64", "terraform", "node3"]
}

module "lxc_arm_vaultwarden" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 106
  hostname     = "vaultwarden"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.106/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["security", "passwords", "zero-knowledge", "arm64", "terraform", "node3"]
}

module "lxc_arm_monitoring" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 107
  hostname     = "monitoring"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 2
  memory       = 256
  disk_size    = "8G"
  ip_address   = "192.168.64.107/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["observability", "prometheus", "grafana", "arm64", "terraform", "node3"]
}

module "lxc_arm_authelia" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 108
  hostname     = "authelia"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.108/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["security", "sso", "2fa", "webauthn", "arm64", "terraform", "node3"]
}

module "lxc_arm_gitea" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 109
  hostname     = "gitea"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 96
  disk_size    = "4G"
  ip_address   = "192.168.64.109/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["git", "scm", "code-forge", "devops", "arm64", "terraform", "node3"]
}

module "lxc_arm_woodpecker_ci" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 110
  hostname     = "woodpecker-ci"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 2
  memory       = 192
  disk_size    = "4G"
  ip_address   = "192.168.64.110/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["ci-cd", "builds", "pipelines", "arm64", "terraform", "node3"]
}

module "lxc_arm_gatus" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 111
  hostname     = "gatus"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.111/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["monitoring", "health-prober", "status", "arm64", "terraform", "node3"]
}

module "lxc_arm_ntfy" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 112
  hostname     = "ntfy"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.112/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["notifications", "push", "alerts", "arm64", "terraform", "node3"]
}

module "lxc_arm_linkding" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 113
  hostname     = "linkding"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 96
  disk_size    = "2G"
  ip_address   = "192.168.64.113/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["bookmarks", "search", "archiving", "arm64", "terraform", "node3"]
}

module "lxc_arm_stepca" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 114
  hostname     = "stepca"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 96
  disk_size    = "2G"
  ip_address   = "192.168.64.114/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["security", "pki", "tls", "acme", "arm64", "terraform", "node3"]
}

module "lxc_arm_tailscale_arm" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 115
  hostname     = "tailscale-arm"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 96
  disk_size    = "2G"
  ip_address   = "192.168.64.115/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["vpn", "tailscale", "mesh", "arm64", "terraform", "node3"]
}

module "lxc_arm_beszel" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 116
  hostname     = "beszel"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.116/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["telemetry", "monitoring", "beszel", "arm64", "terraform", "node3"]
}

module "lxc_arm_pocketbase" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 117
  hostname     = "pocketbase"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.117/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["database", "baas", "backend", "arm64", "terraform", "node3"]
}

module "lxc_arm_homepage" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 118
  hostname     = "homepage"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.118/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["dashboard", "homepage", "portal", "arm64", "terraform", "node3"]
}

module "lxc_arm_speedtest" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 119
  hostname     = "speedtest"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 96
  disk_size    = "2G"
  ip_address   = "192.168.64.119/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["network", "speedtest", "wan-metrics", "arm64", "terraform", "node3"]
}

module "lxc_arm_memos" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 120
  hostname     = "memos"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 32
  disk_size    = "2G"
  ip_address   = "192.168.64.120/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["notes", "memos", "markdown", "arm64", "terraform", "node3"]
}

module "lxc_arm_wallos" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 121
  hostname     = "wallos"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 48
  disk_size    = "2G"
  ip_address   = "192.168.64.121/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["budget", "finance", "expenses", "arm64", "terraform", "node3"]
}

module "lxc_arm_syncthing" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 122
  hostname     = "syncthing"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.122/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["sync", "syncthing", "p2p", "arm64", "terraform", "node3"]
}

module "lxc_arm_microbin" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 123
  hostname     = "microbin"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 16
  disk_size    = "2G"
  ip_address   = "192.168.64.123/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["pastebin", "encrypted", "microbin", "arm64", "terraform", "node3"]
}

module "lxc_arm_vikunja" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 124
  hostname     = "vikunja"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.124/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["tasks", "kanban", "vikunja", "arm64", "terraform", "node3"]
}

module "lxc_arm_blackbox" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 125
  hostname     = "blackbox"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 32
  disk_size    = "2G"
  ip_address   = "192.168.64.125/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["monitoring", "blackbox", "prober", "arm64", "terraform", "node3"]
}

module "lxc_arm_yourspotify" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 126
  hostname     = "yourspotify"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.126/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["music", "analytics", "spotify", "arm64", "terraform", "node3"]
}

module "lxc_arm_webcheck" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 127
  hostname     = "webcheck"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.127/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["osint", "security", "webcheck", "arm64", "terraform", "node3"]
}

module "lxc_arm_opengist" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 128
  hostname     = "opengist"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 48
  disk_size    = "2G"
  ip_address   = "192.168.64.128/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["gists", "snippets", "git", "arm64", "terraform", "node3"]
}

module "lxc_arm_flatnotes" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 129
  hostname     = "flatnotes"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 32
  disk_size    = "2G"
  ip_address   = "192.168.64.129/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["notes", "markdown", "flat-file", "arm64", "terraform", "node3"]
}

module "lxc_arm_bark" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 130
  hostname     = "bark"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 32
  disk_size    = "2G"
  ip_address   = "192.168.64.130/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["alerts", "bark", "apple-ios", "arm64", "terraform", "node3"]
}

module "lxc_arm_shiori" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 131
  hostname     = "shiori"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 32
  disk_size    = "2G"
  ip_address   = "192.168.64.131/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["bookmarks", "archiver", "read-later", "arm64", "terraform", "node3"]
}

module "lxc_arm_whoogle" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 132
  hostname     = "whoogle"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "1G"
  ip_address   = "192.168.64.132/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["search", "whoogle", "privacy", "arm64", "terraform", "node3"]
}

module "lxc_arm_flame" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 133
  hostname     = "flame"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 32
  disk_size    = "1G"
  ip_address   = "192.168.64.133/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["startpage", "flame", "launcher", "arm64", "terraform", "node3"]
}

module "lxc_arm_dashy" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 134
  hostname     = "dashy"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.134/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["dashboard", "dashy", "widgets", "arm64", "terraform", "node3"]
}

module "lxc_arm_shlink" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 135
  hostname     = "shlink"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.135/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["url-shortener", "shlink", "analytics", "arm64", "terraform", "node3"]
}

module "lxc_arm_pastefy" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 136
  hostname     = "pastefy"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 48
  disk_size    = "2G"
  ip_address   = "192.168.64.136/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["pastebin", "pastefy", "markdown", "arm64", "terraform", "node3"]
}

module "lxc_arm_pingvin" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 137
  hostname     = "pingvin"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.137/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["file-sharing", "transfers", "privacy", "arm64", "terraform", "node3"]
}

module "lxc_arm_rssbridge" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 138
  hostname     = "rssbridge"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 48
  disk_size    = "2G"
  ip_address   = "192.168.64.138/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["rss", "feeds", "syndication", "arm64", "terraform", "node3"]
}

module "lxc_arm_playwright" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 139
  hostname     = "playwright"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 2
  memory       = 192
  disk_size    = "2G"
  ip_address   = "192.168.64.139/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["automation", "playwright", "browser", "arm64", "terraform", "node3"]
}

module "lxc_arm_uptime_probe" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 140
  hostname     = "uptime-probe"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.140/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["monitoring", "prober", "latency", "arm64", "terraform", "node3"]
}

module "lxc_arm_dns_bench" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 141
  hostname     = "dns-bench"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 48
  disk_size    = "2G"
  ip_address   = "192.168.64.141/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["dns", "benchmarks", "dnssec", "arm64", "terraform", "node3"]
}

module "lxc_arm_excalidraw" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 142
  hostname     = "excalidraw"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.142/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["whiteboard", "sketching", "diagrams", "arm64", "terraform", "node3"]
}

module "lxc_arm_snagim" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 143
  hostname     = "snagim"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 48
  disk_size    = "2G"
  ip_address   = "192.168.64.143/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["images", "screenshots", "media", "arm64", "terraform", "node3"]
}

module "lxc_arm_whoogle_tor" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 144
  hostname     = "whoogle-tor"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 96
  disk_size    = "2G"
  ip_address   = "192.168.64.144/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["privacy", "search", "tor-network", "arm64", "terraform", "node3"]
}

module "lxc_arm_heimdall" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 145
  hostname     = "heimdall"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.145/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["dashboard", "heimdall", "launcher", "arm64", "terraform", "node3"]
}

module "lxc_arm_arm_pbs" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 146
  hostname     = "arm-pbs"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 2
  memory       = 512
  disk_size    = "2G"
  ip_address   = "192.168.64.146/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["backup", "pbs", "deduplication", "arm64", "terraform", "node3"]
}

module "lxc_arm_arm_pdm" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 147
  hostname     = "arm-pdm"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 2
  memory       = 512
  disk_size    = "2G"
  ip_address   = "192.168.64.147/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["management", "pdm", "datacenter", "arm64", "terraform", "node3"]
}

module "lxc_arm_arm_pmg" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 148
  hostname     = "arm-pmg"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 2
  memory       = 512
  disk_size    = "2G"
  ip_address   = "192.168.64.148/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["security", "mail", "pmg", "antispam", "arm64", "terraform", "node3"]
}

module "lxc_arm_renovate_gitops" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.utility_node
  vmid         = 149
  hostname     = "renovate-gitops"
  ostemplate   = var.alpine_template_arm
  ostype       = "alpine"
  cores        = 2
  memory       = 192
  disk_size    = "4G"
  ip_address   = "192.168.64.149/24"
  gateway      = var.gateway_ip_arm
  nameserver   = var.nameserver_ip_arm
  vlan_tag     = 20
  unprivileged = true
  tags         = ["gitops", "renovatebot", "automation", "arm64", "terraform", "node3"]
}

