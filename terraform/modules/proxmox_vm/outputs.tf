output "id" {
  value       = proxmox_virtual_environment_vm.vm.id
  description = "Proxmox VM resource identifier"
}

output "vm_id" {
  value       = proxmox_virtual_environment_vm.vm.vm_id
  description = "Proxmox numeric VMID"
}

output "name" {
  value       = var.name
  description = "Configured VM name"
}
