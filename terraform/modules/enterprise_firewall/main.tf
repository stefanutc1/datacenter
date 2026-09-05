# ==============================================================================
# Enterprise Firewall Module (FortiGate-VM / Cisco ASAv)
# Managed by Antigravity - Dual-Firewall Perimeter Defense
# ==============================================================================

terraform {
  required_version = ">= 1.8.0"
}

variable "vmid" {
  type        = number
  default     = 221
  description = "Proxmox VMID for the Enterprise Firewall Appliance"
}

variable "appliance_type" {
  type        = string
  default     = "fortigate" # Options: fortigate, cisco-asav
  description = "Type of enterprise firewall appliance"
}

variable "vm_name" {
  type        = string
  default     = "fortigate-vm"
  description = "Firewall hostname"
}

variable "cores" {
  type        = number
  default     = 2
  description = "vCPU count"
}

variable "memory_mb" {
  type        = number
  default     = 2048
  description = "RAM allocated in MB"
}

variable "disk_size_gb" {
  type        = number
  default     = 10
  description = "Boot disk capacity in GB"
}

variable "storage_pool" {
  type        = string
  default     = "local-lvm"
  description = "Target storage pool on Proxmox"
}

variable "networks" {
  type = map(object({
    bridge      = string
    model       = string
    vlan_tag    = optional(number)
    ip_address  = string
    description = string
  }))
  default = {
    "port1_transit" = {
      bridge      = "vmbr2"
      model       = "virtio"
      ip_address  = "10.10.20.2/30"
      description = "WAN / Transit link to OPNsense"
    }
    "port2_mgmt" = {
      bridge      = "vmbr0"
      model       = "virtio"
      ip_address  = "192.168.1.136/24"
      description = "Management GUI & SSH (Out-of-Band)"
    }
    "port3_dmz" = {
      bridge      = "vmbr3"
      model       = "virtio"
      ip_address  = "10.10.30.1/24"
      description = "DMZ & Honeypot micro-segment"
    }
    "port4_core" = {
      bridge      = "vmbr4"
      model       = "virtio"
      ip_address  = "10.10.40.1/24"
      description = "Internal Enterprise Trusted Core"
    }
  }
  description = "Network topology for the enterprise firewall"
}

variable "routing" {
  type = object({
    default_gateway  = string
    transit_opnsense = string
    bgp_enabled      = bool
    local_as         = number
    peer_as          = number
    peer_ip          = string
  })
  default = {
    default_gateway  = "10.10.20.1" # OPNsense Transit Interface
    transit_opnsense = "10.10.20.1"
    bgp_enabled      = true
    local_as         = 65002
    peer_as          = 65000
    peer_ip          = "10.10.20.1"
  }
  description = "Routing & Peering configuration"
}

output "firewall_vm" {
  value = {
    vmid         = var.vmid
    name         = var.vm_name
    type         = var.appliance_type
    memory_mb    = var.memory_mb
    cores        = var.cores
    interfaces   = var.networks
    routing_peer = var.routing
  }
}
