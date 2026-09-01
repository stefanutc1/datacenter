variable "target_node" {
  type        = string
  description = "Target Proxmox node to provision the VM on"
  default     = "proxmox"

  validation {
    condition     = length(var.target_node) > 0
    error_message = "The target_node variable must not be empty."
  }
}

variable "vmid" {
  type        = number
  description = "Unique numeric VMID (e.g. 200, 201, 204, 205, 206)"

  validation {
    condition     = var.vmid >= 100 && var.vmid <= 999
    error_message = "The VMID must be between 100 and 999."
  }
}

variable "name" {
  type        = string
  description = "VM hostname / name"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.name))
    error_message = "VM name must contain only lowercase alphanumeric characters and hyphens."
  }
}

variable "description" {
  type        = string
  description = "Description metadata in Proxmox UI"
  default     = "Managed declaratively via Terraform"
}

variable "cores" {
  type        = number
  description = "Number of vCPU cores"
  default     = 2

  validation {
    condition     = var.cores >= 1 && var.cores <= 32
    error_message = "Number of cores must be between 1 and 32."
  }
}

variable "sockets" {
  type        = number
  description = "Number of CPU sockets"
  default     = 1
}

variable "cpu_type" {
  type        = string
  description = "QEMU CPU emulation model (e.g. host, kvm64, x86-64-v2-AES)"
  default     = "host"
}

variable "memory" {
  type        = number
  description = "Dedicated RAM allocated in MB"
  default     = 2048

  validation {
    condition     = var.memory >= 512 && var.memory <= 65536
    error_message = "Memory must be between 512 MB and 65,536 MB (64GB)."
  }
}

variable "disk_size" {
  type        = number
  description = "Disk size in GB"
  default     = 32

  validation {
    condition     = var.disk_size >= 8 && var.disk_size <= 2000
    error_message = "Disk size must be between 8 GB and 2000 GB."
  }
}

variable "storage_pool" {
  type        = string
  description = "Target storage pool on the Proxmox host"
  default     = "local-lvm"
}

variable "iso_file_id" {
  type        = string
  description = "Proxmox ISO image identifier or Cloud-Init image ID"
  default     = ""
}

variable "vlan_tag" {
  type        = number
  description = "VLAN ID for network segmentation"
  default     = 20
}

variable "mac_address" {
  type        = string
  description = "Explicit MAC address (optional)"
  default     = ""
}

variable "tags" {
  type        = list(string)
  description = "Metadata tags in Proxmox UI"
  default     = ["terraform", "homelab", "vm"]
}

variable "pci_passthrough_device" {
  type        = string
  description = "PCI device ID for GPU / NPU passthrough (e.g. 0000:01:00.0)"
  default     = ""
}

variable "onboot" {
  type        = bool
  description = "Start VM on host boot"
  default     = true
}

variable "balloon" {
  type        = number
  description = "Minimum VirtIO dynamic memory balloon in MB (0 to disable)"
  default     = 0
}

