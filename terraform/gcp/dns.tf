# ==============================================================================
# CLOUD DNS MANAGED ZONE (EXTERNAL FALLBACK & CLOUDFLARE SYNC)
# ==============================================================================

resource "google_dns_managed_zone" "public_zone" {
  name        = "homelab-public-zone"
  dns_name    = var.domain_name
  description = "Public authoritative DNS zone for Homelab split-horizon fallback"
  visibility  = "public"

  dnssec_config {
    state = "on"
  }

  labels = var.tags
}

resource "google_dns_record_set" "vpn_endpoint" {
  name         = "vpn.${google_dns_managed_zone.public_zone.dns_name}"
  managed_zone = google_dns_managed_zone.public_zone.name
  type         = "A"
  ttl          = 300
  rrdatas      = ["203.0.113.1"] # Dynamic DNS fallback point
}
