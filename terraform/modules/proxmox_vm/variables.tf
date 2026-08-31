variable "target_node" {
  type        = string
  description = "Target Proxmox node to provision the VM on"
  default     = "proxmox"
}

variable "vmid" {
  type        = number
  description = "Unique numeric VMID (e.g. 200, 201, 204, 205, 206)"
}

variable "name" {
  type        = string
  description = "VM hostname / name"
}

variable "description" {
  type        = string
  description = "Description in Proxmox UI"
  default     = "Managed declaratively via Terraform"
}

variable "cores" {
  type        = number
  description = "Number of vCPU cores"
  default     = 2
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
  description = "RAM allocated in MB"
  default     = 2048
}

variable "disk_size" {
  type        = number
  description = "Disk size in GB"
  default     = 32
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
