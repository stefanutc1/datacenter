variable "proxmox_endpoint" {
  type        = string
  description = "Proxmox VE REST API URL (e.g. https://192.168.1.132:8006/)"
  default     = "https://192.168.1.132:8006/"
}

variable "proxmox_api_token" {
  type        = string
  description = "Proxmox VE API Token (USER@REALM!TOKENID=UUID)"
  sensitive   = true
  default     = "root@pam!terraform=00000000-0000-0000-0000-000000000000"
}

variable "proxmox_insecure" {
  type        = bool
  description = "Disable TLS certificate validation for internal self-signed certs"
  default     = true
}

variable "primary_node" {
  type        = string
  description = "Primary x86_64 Proxmox node name"
  default     = "proxmox"
}

variable "secondary_node" {
  type        = string
  description = "Secondary ARM64 Apple M1 Proxmox node name"
  default     = "proxmox2"
}

variable "gateway_ip" {
  type        = string
  description = "Default LAN gateway IP"
  default     = "192.168.1.1"
}

variable "nameserver_ip" {
  type        = string
  description = "Default DNS nameserver IP"
  default     = "192.168.1.1"
}

variable "debian_template" {
  type        = string
  description = "Debian 13 x86_64 OS template"
  default     = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst"
}

variable "debian_arm64_template" {
  type        = string
  description = "Debian 13 ARM64 OS template"
  default     = "local:vztmpl/debian-13-standard_13.6-1_arm64.tar.zst"
}

variable "alpine_template" {
  type        = string
  description = "Alpine 3.24 x86_64 OS template"
  default     = "local:vztmpl/alpine-3.24-default_20260714_amd64.tar.xz"
}

variable "utility_node" {
  type        = string
  description = "Utility ARM64 Apple M1 Proxmox node name"
  default     = "proxmox2"
}

variable "alpine_template_arm" {
  type        = string
  description = "Alpine 3.24 ARM64 OS template"
  default     = "local:vztmpl/alpine-3.24-default_20260228_arm64.tar.xz"
}

variable "debian_template_arm" {
  type        = string
  description = "Debian 13 ARM64 OS template"
  default     = "local:vztmpl/debian-13-standard_13.6-1_arm64.tar.zst"
}

variable "gateway_ip_arm" {
  type        = string
  description = "ARM64 Subnet Gateway IP"
  default     = "192.168.64.1"
}

variable "nameserver_ip_arm" {
  type        = string
  description = "ARM64 Subnet DNS Nameserver IP"
  default     = "192.168.64.1"
}

