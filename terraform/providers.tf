terraform {
  required_version = ">= 1.8.0"

  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = ">= 0.60.0"
    }
  }

  backend "s3" {
    bucket                      = "terraform-state"
    key                         = "infrastructure/terraform.tfstate"
    region                      = "us-east-1"
    endpoint                    = "http://192.168.1.161:9000" # MinIO CT 161 / PBS S3 API
    dynamodb_endpoint           = "http://192.168.1.161:9000" # DynamoDB-compatible state lock table
    dynamodb_table              = "terraform-locks"
    encrypt                     = true
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    use_path_style              = true
  }
}

provider "proxmox" {
  endpoint  = var.proxmox_endpoint
  api_token = var.proxmox_api_token
  insecure  = var.proxmox_insecure

  ssh {
    agent    = true
    username = "root"
  }
}
