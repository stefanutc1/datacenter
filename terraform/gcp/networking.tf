# ==============================================================================
# GCP VPC & HYBRID CLOUD INTERCONNECT / VPN TO OPNSENSE
# ==============================================================================

resource "google_compute_network" "vpc" {
  name                    = "vpc-homelab-gcp-hub"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet_services" {
  name          = "snet-gcp-services"
  ip_cidr_range = "10.200.1.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id
}

resource "google_compute_ha_vpn_gateway" "ha_gateway" {
  name    = "gw-homelab-ha-vpn"
  network = google_compute_network.vpc.id
  region  = var.region
}

resource "google_compute_router" "router" {
  name    = "cr-homelab-bgp-router"
  network = google_compute_network.vpc.id
  region  = var.region
  bgp {
    asn = 65001
  }
}
