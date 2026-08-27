# Proxmox VE LXC / VM Provisioning Configuration for CyberLab
# Requires telmate/proxmox or bpg/proxmox provider

terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = ">= 0.50.0"
    }
  }
}

# Example Proxmox Target Container Definition
# resource "proxmox_virtual_environment_container" "cyber_node" {
#   node_name = "pve"
#   vm_id     = 801
#   initialization {
#     hostname = "cyber-node01"
#     ip_config {
#       ipv4 {
#         address = "192.168.64.10/24"
#         gateway = "192.168.64.1"
#       }
#     }
#   }
# }
