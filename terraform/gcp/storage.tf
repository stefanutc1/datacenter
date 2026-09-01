# ==============================================================================
# CLOUD STORAGE BUCKET WITH WORM OBJECT LOCKING (RANSOMWARE-PROOF PBS BACKUPS)
# ==============================================================================

resource "google_storage_bucket" "pbs_worm_backups" {
  name                        = var.backup_bucket_name
  location                    = var.region
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  force_destroy               = false

  # WORM (Write Once Read Many) Retention Policy for Ransomware Protection
  retention_policy {
    is_locked        = false   # Set to true for irreversible immutable lock
    retention_period = 2592000 # 30 Days immutable retention in seconds
  }

  versioning {
    enabled = true
  }

  # Lifecycle rules: Transition to Coldline after 30 days and Archive after 90 days
  lifecycle_rule {
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
    condition {
      age = 30
    }
  }

  lifecycle_rule {
    action {
      type          = "SetStorageClass"
      storage_class = "ARCHIVE"
    }
    condition {
      age = 90
    }
  }

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age                = 365
      num_newer_versions = 3
    }
  }

  labels = var.tags
}
