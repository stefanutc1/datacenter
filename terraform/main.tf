# ==============================================================================
# HOMELAB INFRASTRUCTURE AS CODE — MAIN ENTRYPOINT
# Provider: bpg/proxmox (Proxmox VE REST API)
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
# 2. PROXMOX CORE LXC CONTAINERS (NODE 1 — Intel Core i3-10100F x86_64)
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
  tags         = ["ingress", "proxy", "ssl", "terraform"]
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
  tags         = ["dns", "sinkhole", "terraform"]
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
  tags         = ["vpn", "wireguard", "mesh", "terraform"]
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
  tags         = ["storage", "media", "ai", "terraform"]
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
  tags         = ["storage", "cloud", "webdav", "terraform"]
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
  tags         = ["security", "ips", "threat-intel", "terraform"]
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
  unprivileged = false
  tags         = ["automation", "iot", "mqtt", "terraform"]
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
  tags         = ["automation", "soar", "workflows", "terraform"]
}

module "lxc_ollama_gpu" {
  source                 = "./modules/proxmox_lxc"
  target_node            = var.primary_node
  vmid                   = 110
  hostname               = "ollama"
  ostemplate             = var.debian_template
  ostype                 = "debian"
  cores                  = 4
  memory                 = 2048
  disk_size              = "16G"
  ip_address             = "192.168.1.110/24"
  gateway                = var.gateway_ip
  nameserver             = var.nameserver_ip
  vlan_tag               = 20
  unprivileged           = false
  passthrough_nvidia_gpu = true
  tags                   = ["ai", "llm", "cuda", "gtx1050ti", "local-ai", "terraform"]
}

module "lxc_open_webui" {
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
  tags         = ["ai", "webui", "chat", "terraform"]
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
  tags         = ["dms", "ocr", "documents", "terraform"]
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
  tags         = ["storage", "s3", "minio", "terraform"]
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
  tags         = ["media", "torrent", "vpn", "terraform"]
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
  tags         = ["media", "books", "reader", "terraform"]
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
  tags         = ["pdf", "tools", "ocr", "terraform"]
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
  tags         = ["search", "engine", "meilisearch", "terraform"]
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
  tags         = ["observability", "logs", "vector", "terraform"]
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
  tags         = ["ai", "whisper", "stt", "terraform"]
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
  tags         = ["dev", "vscode", "codeserver", "terraform"]
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
  tags         = ["db", "postgres", "pgadmin", "terraform"]
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
  tags         = ["security", "dfir", "cyberchef", "terraform"]
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
  tags         = ["diagrams", "drawio", "tools", "terraform"]
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
  tags         = ["logs", "dozzle", "observability", "terraform"]
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
  tags         = ["knowledge", "wikipedia", "kiwix", "terraform"]
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
  tags         = ["gaming", "romm", "retro", "terraform"]
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
  tags         = ["gaming", "emulatorjs", "web", "terraform"]
}

# ------------------------------------------------------------------------------
# 3. PROXMOX UTILITY CONTAINERS (NODE 3 — Apple MacBook Air M1 ARM64 UTM)
# ------------------------------------------------------------------------------
module "lxc_gitea" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 109
  hostname     = "gitea"
  ostemplate   = var.debian_arm64_template
  ostype       = "debian"
  cores        = 2
  memory       = 160
  disk_size    = "16G"
  ip_address   = "192.168.64.109/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["git", "scm", "arm64", "terraform"]
}

module "lxc_woodpecker" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 111
  hostname     = "woodpecker"
  ostemplate   = var.debian_arm64_template
  ostype       = "debian"
  cores        = 2
  memory       = 192
  disk_size    = "8G"
  ip_address   = "192.168.64.111/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["ci", "builds", "arm64", "terraform"]
}

module "lxc_tempo" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 118
  hostname     = "tempo"
  ostemplate   = var.debian_arm64_template
  ostype       = "debian"
  cores        = 2
  memory       = 256
  disk_size    = "8G"
  ip_address   = "192.168.64.118/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["observability", "tracing", "otlp", "arm64", "terraform"]
}

module "lxc_gatus" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 120
  hostname     = "gatus"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.120/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["monitoring", "status", "arm64", "terraform"]
}

module "lxc_ntfy" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 121
  hostname     = "ntfy"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.121/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["alerts", "notifications", "arm64", "terraform"]
}

module "lxc_linkding" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 122
  hostname     = "linkding"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 96
  disk_size    = "2G"
  ip_address   = "192.168.64.122/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["bookmarks", "search", "arm64", "terraform"]
}

module "lxc_step_ca" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 123
  hostname     = "stepca"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 96
  disk_size    = "2G"
  ip_address   = "192.168.64.123/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["security", "pki", "tls", "arm64", "terraform"]
}

module "lxc_tailscale_arm" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 124
  hostname     = "tailscale-arm"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 96
  disk_size    = "2G"
  ip_address   = "192.168.64.124/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["vpn", "tailscale", "mesh", "arm64", "terraform"]
}

module "lxc_beszel" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 125
  hostname     = "beszel"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "2G"
  ip_address   = "192.168.64.125/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["telemetry", "monitoring", "arm64", "terraform"]
}

module "lxc_homepage" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 134
  hostname     = "homepage"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "1G"
  ip_address   = "192.168.64.134/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["dashboard", "homepage", "arm64", "terraform"]
}

module "lxc_speedtest" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 135
  hostname     = "speedtest"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 96
  disk_size    = "1G"
  ip_address   = "192.168.64.135/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["network", "speedtest", "arm64", "terraform"]
}

module "lxc_memos" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 136
  hostname     = "memos"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 32
  disk_size    = "1G"
  ip_address   = "192.168.64.136/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["notes", "memos", "arm64", "terraform"]
}

module "lxc_wallos" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 137
  hostname     = "wallos"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 48
  disk_size    = "1G"
  ip_address   = "192.168.64.137/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["budget", "wallos", "arm64", "terraform"]
}

module "lxc_syncthing" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 138
  hostname     = "syncthing"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "1G"
  ip_address   = "192.168.64.138/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["sync", "syncthing", "arm64", "terraform"]
}

module "lxc_microbin" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 139
  hostname     = "microbin"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 16
  disk_size    = "1G"
  ip_address   = "192.168.64.139/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["pastebin", "microbin", "arm64", "terraform"]
}

module "lxc_vikunja" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 140
  hostname     = "vikunja"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "1G"
  ip_address   = "192.168.64.140/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["tasks", "vikunja", "arm64", "terraform"]
}

module "lxc_blackbox" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 141
  hostname     = "blackbox"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 32
  disk_size    = "1G"
  ip_address   = "192.168.64.141/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["monitoring", "blackbox", "arm64", "terraform"]
}

module "lxc_yourspotify" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 142
  hostname     = "yourspotify"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "1G"
  ip_address   = "192.168.64.142/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["music", "analytics", "arm64", "terraform"]
}

module "lxc_webcheck" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 143
  hostname     = "webcheck"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "1G"
  ip_address   = "192.168.64.143/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["osint", "security", "webcheck", "arm64", "terraform"]
}

module "lxc_opengist" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 144
  hostname     = "opengist"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 48
  disk_size    = "1G"
  ip_address   = "192.168.64.144/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["gists", "snippets", "opengist", "arm64", "terraform"]
}

module "lxc_flatnotes" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 145
  hostname     = "flatnotes"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 32
  disk_size    = "1G"
  ip_address   = "192.168.64.145/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["notes", "markdown", "flatnotes", "arm64", "terraform"]
}

module "lxc_bark" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 146
  hostname     = "bark"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 32
  disk_size    = "1G"
  ip_address   = "192.168.64.146/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["alerts", "bark", "apple", "arm64", "terraform"]
}

module "lxc_shiori" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 147
  hostname     = "shiori"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 32
  disk_size    = "1G"
  ip_address   = "192.168.64.147/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["bookmarks", "archiver", "shiori", "arm64", "terraform"]
}

module "lxc_whoogle" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 148
  hostname     = "whoogle"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 64
  disk_size    = "1G"
  ip_address   = "192.168.64.148/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["search", "whoogle", "privacy", "arm64", "terraform"]
}

module "lxc_flame" {
  source       = "./modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 149
  hostname     = "flame"
  ostemplate   = var.alpine_arm64_template
  ostype       = "alpine"
  cores        = 1
  memory       = 32
  disk_size    = "1G"
  ip_address   = "192.168.64.149/24"
  gateway      = "192.168.64.1"
  nameserver   = var.nameserver_ip
  vlan_tag     = 20
  unprivileged = true
  tags         = ["startpage", "flame", "dashboard", "arm64", "terraform"]
}

# ------------------------------------------------------------------------------
# 4. PROXMOX VIRTUAL MACHINES (QEMU / KVM)
# ------------------------------------------------------------------------------
module "vm_opnsense" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 200
  name         = "opnsense"
  description  = "Perimeter Security Gateway, WireGuard VPN & Suricata/Snort DPI"
  cores        = 2
  memory       = 1024
  disk_size    = 32
  storage_pool = "local-lvm"
  vlan_tag     = 10
  tags         = ["network", "firewall", "ids-ips", "terraform"]
}

module "vm_windows_server_2025" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 201
  name         = "winserver"
  description  = "Active Directory Domain Services (AD DS), DNS, GPO & Sysmon Forwarding"
  cores        = 4
  memory       = 4096
  disk_size    = 64
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["windows", "active-directory", "sysmon", "terraform"]
}

module "vm_talos_kubernetes" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 204
  name         = "talos-k8s"
  description  = "Zero-SSH, API-managed immutable Kubernetes control-plane/worker"
  cores        = 2
  memory       = 2048
  disk_size    = 30
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["kubernetes", "talos", "immutable", "terraform"]
}

module "vm_tpot_honeypot" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 205
  name         = "tpot-dmz"
  description  = "Multi-honeypot platform (Cowrie, Dionaea, RDP honeypot) with AbuseIPDB"
  cores        = 4
  memory       = 3072
  disk_size    = 40
  storage_pool = "local-lvm"
  vlan_tag     = 40
  tags         = ["cyber", "honeypot", "tpot", "dmz", "terraform"]
}

module "vm_capev2_sandbox" {
  source       = "./modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 206
  name         = "capev2-sandbox"
  description  = "Air-gapped malware detonation sandbox with automated snapshot restore"
  cores        = 4
  memory       = 4096
  disk_size    = 100
  storage_pool = "local-lvm"
  vlan_tag     = 30
  tags         = ["cyber", "sandbox", "capev2", "malware", "dfir", "terraform"]
}
