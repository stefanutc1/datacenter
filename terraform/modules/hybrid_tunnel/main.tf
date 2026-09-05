# ==============================================================================
# Cloud <-> Datacenter Hybrid Tunnel Module
# Managed by Antigravity - High Performance Multi-Cloud Interconnect
# ==============================================================================

terraform {
  required_version = ">= 1.8.0"
}

variable "wireguard_tunnel" {
  type = object({
    enabled           = bool
    listen_port       = number
    datacenter_ip     = string
    cloud_gateway_ip  = string
    mtu               = number
    keepalive_seconds = number
    allowed_ips       = list(string)
  })
  default = {
    enabled           = true
    listen_port       = 51820
    datacenter_ip     = "10.50.0.1/30"
    cloud_gateway_ip  = "10.50.0.2/30"
    mtu               = 1420
    keepalive_seconds = 25
    allowed_ips = [
      "10.30.0.0/16",  # AWS VPC
      "10.200.0.0/16", # GCP VPC
      "10.50.0.0/24"   # WireGuard Transit
    ]
  }
  description = "Site-to-Site WireGuard high performance hybrid tunnel"
}

variable "ipsec_vti" {
  type = object({
    enabled     = bool
    ike_version = number
    encryption  = string
    integrity   = string
    dh_group    = number
    bgp_enabled = bool
    local_asn   = number
    cloud_asn   = number
  })
  default = {
    enabled     = true
    ike_version = 2
    encryption  = "aes256gcm"
    integrity   = "sha384"
    dh_group    = 21
    bgp_enabled = true
    local_asn   = 65000
    cloud_asn   = 65001
  }
  description = "Route-based IPsec VTI with BGP failover to Cloud Routers"
}

variable "zero_trust_tunnel" {
  type = object({
    provider     = string
    tunnel_name  = string
    ingress_mode = string
  })
  default = {
    provider     = "cloudflare"
    tunnel_name  = "datacenter-zero-trust-ingress"
    ingress_mode = "out-of-band-encrypted"
  }
  description = "Zero-Trust overlay ingress tunnel for resilience"
}

output "hybrid_connectivity" {
  value = {
    wireguard  = var.wireguard_tunnel
    ipsec_vti  = var.ipsec_vti
    zero_trust = var.zero_trust_tunnel
  }
}
