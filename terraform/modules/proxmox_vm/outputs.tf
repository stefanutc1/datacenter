output "id" {
  value       = proxmox_virtual_environment_vm.vm.id
  description = "Proxmox VM resource identifier"
}

output "vm_id" {
  value       = proxmox_virtual_environment_vm.vm.vm_id
  description = "Assigned 3-digit numeric VMID"
}

output "name" {
  value       = var.name
  description = "Configured VM name"
}

output "node" {
  value       = var.target_node
  description = "Target hypervisor node"
}
