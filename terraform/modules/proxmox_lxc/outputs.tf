output "id" {
  value       = proxmox_virtual_environment_container.container.id
  description = "Proxmox unique resource ID of the container"
}

output "vm_id" {
  value       = proxmox_virtual_environment_container.container.vm_id
  description = "Assigned 3-digit VMID"
}

output "hostname" {
  value       = var.hostname
  description = "Configured container hostname"
}

output "ip_address" {
  value       = var.ip_address
  description = "Static IPv4 address and subnet"
}

output "node" {
  value       = var.target_node
  description = "Assigned compute host node"
}

output "vlan_id" {
  value       = var.vlan_tag
  description = "Assigned network VLAN tag"
}
