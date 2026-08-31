variable "target_node" {
  type        = string
  description = "Target Proxmox node to provision the LXC container on (e.g. proxmox, proxmox2)"
  default     = "proxmox"

  validation {
    condition     = length(var.target_node) > 0
    error_message = "The target_node variable must not be empty."
  }
}

variable "vmid" {
  type        = number
  description = "Unique numeric VMID for the container (e.g. 100, 101, 110)"

  validation {
    condition     = var.vmid >= 100 && var.vmid <= 999
    error_message = "The VMID must be a valid 3-digit numeric ID between 100 and 999."
  }
}

variable "hostname" {
  type        = string
  description = "Hostname for the LXC container"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.hostname))
    error_message = "Hostname must contain only lowercase alphanumeric characters and hyphens."
  }
}

variable "ostemplate" {
  type        = string
  description = "Storage volume containing the OS template (e.g. local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst)"
  default     = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst"
}

variable "ostype" {
  type        = string
  description = "OS distribution family (debian, alpine, ubuntu)"
  default     = "debian"

  validation {
    condition     = contains(["debian", "alpine", "ubuntu"], var.ostype)
    error_message = "Supported OS types are: debian, alpine, ubuntu."
  }
}

variable "cores" {
  type        = number
  description = "Number of CPU cores allocated to the container"
  default     = 2

  validation {
    condition     = var.cores >= 1 && var.cores <= 16
    error_message = "Allocated CPU cores must be between 1 and 16."
  }
}

variable "memory" {
  type        = number
  description = "RAM allocated in MB"
  default     = 512

  validation {
    condition     = var.memory >= 64 && var.memory <= 32768
    error_message = "Memory must be between 64 MB and 32,768 MB (32GB)."
  }
}

variable "swap" {
  type        = number
  description = "Swap memory in MB"
  default     = 512
}

variable "disk_size" {
  type        = string
  description = "Root filesystem disk size (e.g. 4G, 8G, 16G, 32G)"
  default     = "8G"

  validation {
    condition     = can(regex("^[0-9]+G$", var.disk_size))
    error_message = "Disk size must be formatted as an integer followed by 'G' (e.g., '16G')."
  }
}

variable "storage_pool" {
  type        = string
  description = "Target storage pool on the Proxmox host (e.g. local-lvm, local-zfs)"
  default     = "local-lvm"
}

variable "ip_address" {
  type        = string
  description = "Static IPv4 CIDR address (e.g. 192.168.1.110/24)"

  validation {
    condition     = can(regex("^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/[0-9]{1,2}$", var.ip_address))
    error_message = "IP address must be a valid IPv4 CIDR notation (e.g., 192.168.1.110/24)."
  }
}

variable "gateway" {
  type        = string
  description = "Default gateway IPv4 address (e.g. 192.168.1.1 or 192.168.1.132)"
  default     = "192.168.1.1"

  validation {
    condition     = can(regex("^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$", var.gateway))
    error_message = "Gateway must be a valid IPv4 address."
  }
}

variable "nameserver" {
  type        = string
  description = "DNS nameserver for the container"
  default     = "192.168.1.1"
}

variable "vlan_tag" {
  type        = number
  description = "VLAN tag for network segmentation (e.g. 10, 20, 30, 40, 50)"
  default     = 20
}

variable "unprivileged" {
  type        = bool
  description = "Whether to create an unprivileged LXC container for security isolation"
  default     = true
}

variable "nesting" {
  type        = bool
  description = "Enable container nesting feature (required for Docker inside LXC)"
  default     = true
}

variable "onboot" {
  type        = bool
  description = "Whether to start container automatically on host boot"
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

variable "ssh_public_keys" {
  type        = list(string)
  description = "List of authorized SSH public keys to install in root account"
  default = [
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExampleHomelabManagementKey2026 admin@homelab"
  ]
}
