# ==============================================================================
# AZURE BLOB STORAGE (ARCHIVE TIER DISASTER RECOVERY TARGET FOR ZFS SNAPSHOTS)
# ==============================================================================

resource "azurerm_storage_account" "dr_storage" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
  min_tls_version          = "TLS1_2"

  blob_properties {
    versioning_enabled = true
    delete_retention_policy {
      days = 30
    }
  }

  tags = var.tags
}

resource "azurerm_storage_container" "zfs_snapshots_dr" {
  name                  = "zfs-encrypted-snapshots"
  storage_account_name  = azurerm_storage_account.dr_storage.name
  container_access_type = "private"
}

# Automatic Lifecycle Policy: Move to Archive Tier after 30 days (infinitesimal cost)
resource "azurerm_storage_management_policy" "dr_lifecycle" {
  storage_account_id = azurerm_storage_account.dr_storage.id

  rule {
    name    = "archive-zfs-backups-after-30-days"
    enabled = true
    filters {
      prefix_match = ["zfs-encrypted-snapshots/"]
      blob_types   = ["blockBlob"]
    }
    actions {
      base_blob {
        tier_to_cool_after_days_since_modification_greater_than    = 7
        tier_to_archive_after_days_since_modification_greater_than = 30
        delete_after_days_since_modification_greater_than          = 365
      }
      snapshot {
        delete_after_days_since_creation_greater_than = 90
      }
    }
  }
}
