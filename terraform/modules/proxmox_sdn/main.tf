# ==============================================================================
# Proxmox Software Defined Networking (SDN) Module
# Managed by Antigravity - Datacenter Core Networking
# ==============================================================================

terraform {
  required_version = ">= 1.8.0"
}

variable "sdn_zones" {
  type = map(object({
    type = string
    ipam = optional(string, "pve")
    mtu  = optional(number, 1500)
  }))
  default = {
    "datacenter-vlan" = {
      type = "vlan"
      ipam = "pve"
      mtu  = 1500
    }
    "datacenter-core" = {
      type = "simple"
      ipam = "pve"
      mtu  = 1500
    }
  }
  description = "Proxmox SDN Zones definition (VLAN, Simple, EVPN)"
}

variable "vnets" {
  type = map(object({
    zone    = string
    tag     = optional(number)
    subnet  = string
    gateway = string
    comment = string
  }))
  default = {
    "vnet-mgmt" = {
      zone    = "datacenter-vlan"
      tag     = 10
      subnet  = "10.10.10.0/24"
      gateway = "10.10.10.1"
      comment = "Hypervisor & Out-of-band Management Network"
    }
    "vnet-transit" = {
      zone    = "datacenter-core"
      tag     = 20
      subnet  = "10.10.20.0/30"
      gateway = "10.10.20.1"
      comment = "Dual-Firewall Transit Network (OPNsense <-> FortiGate/ASAv)"
    }
    "vnet-dmz" = {
      zone    = "datacenter-vlan"
      tag     = 30
      subnet  = "10.10.30.0/24"
      gateway = "10.10.30.1"
      comment = "DMZ Ingress & Perimeter Honeypots"
    }
    "vnet-trusted" = {
      zone    = "datacenter-vlan"
      tag     = 40
      subnet  = "10.10.40.0/24"
      gateway = "10.10.40.1"
      comment = "Trusted Enterprise Workloads & Core Database Fleet"
    }
    "vnet-cloud" = {
      zone    = "datacenter-core"
      tag     = 50
      subnet  = "10.10.50.0/24"
      gateway = "10.10.50.1"
      comment = "Hybrid Cloud Transit (WireGuard / IPsec VTI)"
    }
    "vnet-lab" = {
      zone    = "datacenter-vlan"
      tag     = 60
      subnet  = "10.10.60.0/24"
      gateway = "10.10.60.1"
      comment = "Isolated Cyber Range, Malware Analysis & Sandboxing"
    }
  }
  description = "Virtual Networks (VNets) declared in Proxmox SDN"
}

output "zones" {
  value       = var.sdn_zones
  description = "Configured Proxmox SDN Zones"
}

output "virtual_networks" {
  value       = var.vnets
  description = "Configured Proxmox SDN VNets"
}
