variable "vm_name" {
  description = "Target virtual machine name"
  type        = string
}

variable "target_node" {
  description = "Proxmox cluster target node"
  type        = string
  default     = "pve"
}

variable "vm_cores" {
  description = "Number of CPU cores"
  type        = number
  default     = 2
}

variable "vm_memory" {
  description = "Memory allocation in MB"
  type        = number
  default     = 4096
}

variable "vm_disk_size" {
  description = "Root disk size specification"
  type        = string
  default     = "32G"
}
