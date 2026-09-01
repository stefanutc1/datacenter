output "pbs_worm_bucket_name" {
  description = "GCP Cloud Storage Bucket with WORM Object Locking for PBS/Restic backups"
  value       = google_storage_bucket.pbs_worm_backups.name
}

output "workload_identity_provider" {
  description = "GCP Workload Identity Provider resource name for keyless CI/CD"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "cloud_dns_nameservers" {
  description = "Authoritative Cloud DNS nameservers for external DNS fallback"
  value       = google_dns_managed_zone.public_zone.name_servers
}

output "bigquery_siem_dataset" {
  description = "BigQuery dataset ID for T-Pot honeypots & Wazuh SIEM telemetry"
  value       = google_bigquery_dataset.security_siem_logs.dataset_id
}
