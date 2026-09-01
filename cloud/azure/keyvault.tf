# ==============================================================================
# AZURE KEY VAULT (CLOUD HSM FOR STEP-CA ROOT CA & LUKS DISK ENCRYPTION KEYS)
# ==============================================================================

data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "vault" {
  name                        = var.key_vault_name
  location                    = azurerm_resource_group.rg.location
  resource_group_name         = azurerm_resource_group.rg.name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = "standard"
  soft_delete_retention_days  = 90
  purge_protection_enabled    = true
  enable_rbac_authorization   = true
  enabled_for_disk_encryption = true

  network_acls {
    default_action = "Allow"
    bypass         = "AzureServices"
  }

  tags = var.tags
}

# Offline Step-CA Root CA Backup Key (RSA 4096)
resource "azurerm_key_vault_key" "stepca_root_key" {
  name         = "stepca-root-ca-backup-key"
  key_vault_id = azurerm_key_vault.vault.id
  key_type     = "RSA"
  key_size     = 4096

  key_opts = [
    "decrypt",
    "encrypt",
    "sign",
    "verify",
    "wrapKey",
    "unwrapKey"
  ]

  tags = var.tags
}

# LUKS Tang/Clevis Master Recovery Key
resource "azurerm_key_vault_key" "luks_clevis_key" {
  name         = "luks-tang-clevis-master-key"
  key_vault_id = azurerm_key_vault.vault.id
  key_type     = "RSA"
  key_size     = 4096

  key_opts = [
    "decrypt",
    "encrypt",
    "unwrapKey",
    "wrapKey"
  ]

  tags = var.tags
}
