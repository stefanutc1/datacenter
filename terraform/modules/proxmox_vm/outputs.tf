output "vm_id" {
  description = "Allocated Proxmox VM ID"
  value       = proxmox_vm_qemu.vm_instance.id
}

output "vm_name" {
  description = "Virtual machine hostname"
  value       = proxmox_vm_qemu.vm_instance.name
}
