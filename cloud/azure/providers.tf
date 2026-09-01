terraform {
  required_version = ">= 1.8.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.48"
    }
  }

  # Backend state configuration (Azure Blob Storage or local)
  # backend "azurerm" {
  #   resource_group_name  = "rg-homelab-tfstate"
  #   storage_account_name = "sthomelabtfstate"
  #   container_name       = "tfstate"
  #   key                  = "azure.homelab.tfstate"
  # }
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy    = false
      recover_soft_deleted_key_vaults = true
    }
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

provider "azuread" {}
