variable "location" {
  type        = string
  description = "Azure primary region for resource deployment"
  default     = "westeurope"
}

variable "resource_group_name" {
  type        = string
  description = "Name of the resource group"
  default     = "rg-homelab-hybrid-cloud"
}

variable "storage_account_name" {
  type        = string
  description = "Globally unique name for Azure Storage Account (disaster recovery & archive)"
  default     = "sthomelabbackupdr2026"
}

variable "key_vault_name" {
  type        = string
  description = "Globally unique name for Azure Key Vault HSM"
  default     = "kv-homelab-pki-vault"
}

variable "onprem_gateway_public_ip" {
  type        = string
  description = "Public static IP of the on-premise OPNsense firewall"
  default     = "203.0.113.1"
}

variable "onprem_vlan20_cidr" {
  type        = string
  description = "On-premise core microservices subnet CIDR"
  default     = "192.168.20.0/24"
}

variable "tags" {
  type        = map(string)
  description = "Resource tags"
  default = {
    Environment = "Hybrid-Cloud"
    Project     = "Homelab-Enterprise"
    ManagedBy   = "Terraform"
    CostCenter  = "Zero-Cost-Tier"
  }
}
