# ==============================================================================
# LOGGING SINK & BIGQUERY (SECURITY AUDIT EXPORT FROM T-POT / WAZUH SIEM)
# ==============================================================================

resource "google_bigquery_dataset" "security_siem_logs" {
  dataset_id                  = "homelab_security_telemetry"
  friendly_name               = "Homelab Security SIEM & Honeypot Telemetry"
  description                 = "BigQuery dataset storing critical T-Pot honeypot attacks and Wazuh SIEM alert streams"
  location                    = var.region
  default_table_expiration_ms = 7776000000 # 90 Days log retention

  labels = var.tags
}

resource "google_logging_project_sink" "security_alert_sink" {
  name        = "homelab-security-alerts-sink"
  destination = "bigquery.googleapis.com/projects/${var.project_id}/datasets/${google_bigquery_dataset.security_siem_logs.dataset_id}"
  filter      = "severity >= WARNING AND jsonPayload.alert_level >= 10"

  unique_writer_identity = true
}

resource "google_project_iam_member" "bigquery_sink_writer" {
  project = var.project_id
  role    = "roles/bigquery.dataEditor"
  member  = google_logging_project_sink.security_alert_sink.writer_identity
}
