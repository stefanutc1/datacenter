output "id" {
  value       = proxmox_virtual_environment_container.container.id
  description = "Proxmox resource ID of the container"
}

output "vm_id" {
  value       = proxmox_virtual_environment_container.container.vm_id
  description = "Assigned VMID"
}

output "hostname" {
  value       = var.hostname
  description = "Configured hostname"
}

output "ip_address" {
  value       = var.ip_address
  description = "Configured static IPv4 address"
}
