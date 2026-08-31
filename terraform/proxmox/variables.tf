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
