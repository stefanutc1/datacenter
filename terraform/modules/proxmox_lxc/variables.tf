variable "target_node" {
  type        = string
  description = "Target Proxmox node to provision the LXC container on (e.g. proxmox, proxmox2)"
  default     = "proxmox"
}

variable "vmid" {
  type        = number
  description = "Unique numeric VMID for the container (e.g. 100, 101, 115)"
}

variable "hostname" {
  type        = string
  description = "Hostname for the LXC container"
}

variable "ostemplate" {
  type        = string
  description = "Storage volume containing the OS template (e.g. local:vztmpl/alpine-3.20-default_20240606_amd64.tar.xz)"
  default     = "local:vztmpl/debian-12-standard_12.7-1_amd64.tar.zst"
}

variable "cores" {
  type        = number
  description = "Number of CPU cores allocated to the container"
  default     = 2
}

variable "memory" {
  type        = number
  description = "RAM allocated in MB"
  default     = 512
}

variable "swap" {
  type        = number
  description = "Swap memory in MB"
  default     = 512
}

variable "disk_size" {
  type        = string
  description = "Root filesystem disk size (e.g. 8G, 16G, 32G)"
  default     = "8G"
}

variable "storage_pool" {
  type        = string
  description = "Target storage pool on the Proxmox host (e.g. local-lvm, local-zfs)"
  default     = "local-lvm"
}

variable "ip_address" {
  type        = string
  description = "Static IPv4 CIDR address (e.g. 192.168.1.100/24)"
}

variable "gateway" {
  type        = string
  description = "Default gateway IPv4 address (e.g. 192.168.1.1 or 192.168.1.132)"
  default     = "192.168.1.132"
}

variable "vlan_tag" {
  type        = number
  description = "VLAN tag for network segmentation (e.g. 10, 20, 30, 40, 50)"
  default     = 20
}

variable "unprivileged" {
  type        = bool
  description = "Whether to create an unprivileged LXC container for security"
  default     = true
}

variable "tags" {
  type        = list(string)
  description = "Metadata tags in Proxmox UI"
  default     = ["terraform", "homelab", "production"]
}

variable "passthrough_nvidia_gpu" {
  type        = bool
  description = "Whether to pass through NVIDIA GTX 1050 Ti GPU devices to container"
  default     = false
}
