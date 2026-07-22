terraform {
  required_version = ">= 1.5.0"
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "~> 0.68.0"
    }
  }
}

provider "proxmox" {
  endpoint  = "https://proxmox:8006/"
  api_token = "terraform@pve!token-id="
  insecure  = true
}
