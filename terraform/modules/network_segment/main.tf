terraform {
  required_version = ">= 1.8.0"
}

variable "vlan_id" {
  type        = number
  description = "802.1Q VLAN Tag ID"
}

variable "name" {
  type        = string
  description = "Segment description name (e.g. Mgmt, Core, CyberLab, DMZ, IoT)"
}

variable "cidr" {
  type        = string
  description = "Subnet CIDR notation (e.g. 192.168.20.0/24)"
}

variable "gateway" {
  type        = string
  description = "Gateway IP address on OPNsense"
}

variable "default_firewall_policy" {
  type        = string
  description = "Firewall default posture (PASS or DROP)"
  default     = "DROP"
}

output "vlan_id" {
  value = var.vlan_id
}

output "subnet" {
  value = var.cidr
}

output "gateway" {
  value = var.gateway
}

output "policy" {
  value = var.default_firewall_policy
}
