# ==============================================================================
# PROXMOX CORE LXC CONTAINERS (NODE 1 — Intel Core i3-10100F)
# ==============================================================================

module "lxc_npm" {
  source       = "../modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 100
  hostname     = "npm"
  cores        = 2
  memory       = 112
  disk_size    = "4G"
  ip_address   = "192.168.1.100/24"
  gateway      = "192.168.1.132"
  vlan_tag     = 20
  unprivileged = true
  tags         = ["ingress", "proxy", "ssl", "terraform"]
}

module "lxc_vaultwarden" {
  source       = "../modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 101
  hostname     = "vaultwarden"
  cores        = 1
  memory       = 64
  disk_size    = "4G"
  ip_address   = "192.168.1.101/24"
  gateway      = "192.168.1.132"
  vlan_tag     = 20
  unprivileged = true
  tags         = ["security", "passwords", "terraform"]
}

module "lxc_immich" {
  source       = "../modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 103
  hostname     = "immich"
  cores        = 4
  memory       = 896
  disk_size    = "64G"
  ip_address   = "192.168.1.103/24"
  gateway      = "192.168.1.132"
  vlan_tag     = 20
  unprivileged = true
  tags         = ["storage", "media", "ai", "terraform"]
}

module "lxc_homeassistant" {
  source       = "../modules/proxmox_lxc"
  target_node  = var.primary_node
  vmid         = 106
  hostname     = "homeassistant"
  cores        = 2
  memory       = 384
  disk_size    = "16G"
  ip_address   = "192.168.1.106/24"
  gateway      = "192.168.1.132"
  vlan_tag     = 20
  unprivileged = false
  tags         = ["automation", "iot", "mqtt", "terraform"]
}

module "lxc_ollama_gpu" {
  source                 = "../modules/proxmox_lxc"
  target_node            = var.primary_node
  vmid                   = 115
  hostname               = "ollama-gpu"
  cores                  = 4
  memory                 = 2048
  disk_size              = "25G"
  ip_address             = "192.168.1.115/24"
  gateway                = "192.168.1.132"
  vlan_tag               = 20
  unprivileged           = false
  passthrough_nvidia_gpu = true
  tags                   = ["ai", "llm", "cuda", "gtx1050ti", "terraform"]
}

# ==============================================================================
# PROXMOX SECONDARY LXC CONTAINERS (NODE 3 — Apple MacBook Air M1 ARM64 UTM)
# ==============================================================================

module "lxc_gitea" {
  source       = "../modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 109
  hostname     = "gitea"
  cores        = 2
  memory       = 160
  disk_size    = "16G"
  ip_address   = "192.168.64.109/24"
  gateway      = "192.168.64.1"
  vlan_tag     = 20
  unprivileged = true
  tags         = ["git", "devops", "arm64", "terraform"]
}

module "lxc_woodpecker" {
  source       = "../modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 110
  hostname     = "woodpecker-ci"
  cores        = 2
  memory       = 192
  disk_size    = "8G"
  ip_address   = "192.168.64.110/24"
  gateway      = "192.168.64.1"
  vlan_tag     = 20
  unprivileged = true
  tags         = ["ci", "builds", "arm64", "terraform"]
}

module "lxc_tempo_tracing" {
  source       = "../modules/proxmox_lxc"
  target_node  = var.secondary_node
  vmid         = 118
  hostname     = "tempo-tracer"
  cores        = 2
  memory       = 256
  disk_size    = "8G"
  ip_address   = "192.168.64.118/24"
  gateway      = "192.168.64.1"
  vlan_tag     = 20
  unprivileged = true
  tags         = ["monitoring", "tracing", "tempo", "arm64", "terraform"]
}
