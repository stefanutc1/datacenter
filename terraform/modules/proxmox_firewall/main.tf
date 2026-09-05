# ==============================================================================
# Proxmox VE Enterprise Firewall Module
# Managed by Antigravity - Defense-in-Depth Cluster Security Matrix
# ==============================================================================

terraform {
  required_version = ">= 1.8.0"
}

variable "cluster_firewall_enabled" {
  type        = bool
  default     = true
  description = "Enable cluster-wide Proxmox firewall"
}

variable "default_inbound_policy" {
  type        = string
  default     = "DROP"
  description = "Zero-Trust default ingress policy"
}

variable "default_outbound_policy" {
  type        = string
  default     = "ACCEPT"
  description = "Cluster default egress policy"
}

variable "ipsets" {
  type = map(list(string))
  default = {
    "management-bastions" = [
      "192.168.1.0/24",
      "10.10.10.0/24",
      "100.64.0.0/10"
    ]
    "cluster-nodes" = [
      "192.168.1.132",
      "192.168.1.133",
      "192.168.1.134",
      "192.168.1.135",
      "192.168.1.136"
    ]
    "cloud-tunnel-endpoints" = [
      "10.30.0.0/16",
      "10.200.0.0/16",
      "10.50.0.0/24"
    ]
    "telemetry-collectors" = [
      "192.168.1.132",
      "192.168.1.134"
    ]
    "bogon-networks" = [
      "0.0.0.0/8",
      "127.0.0.0/8",
      "169.254.0.0/16",
      "192.0.2.0/24",
      "198.51.100.0/24",
      "203.0.113.0/24",
      "224.0.0.0/4",
      "240.0.0.0/4"
    ]
  }
  description = "Enterprise IPSets for strict access control lists"
}

variable "security_groups" {
  type = map(object({
    comment = string
    rules   = list(map(string))
  }))
  default = {
    "mgmt" = {
      comment = "Proxmox Hypervisor Management & Bastion Access"
      rules = [
        { type = "in", action = "ACCEPT", proto = "tcp", dport = "8006", source = "+management-bastions", comment = "PVE WebGUI" },
        { type = "in", action = "ACCEPT", proto = "tcp", dport = "22", source = "+management-bastions", comment = "SSH Bastion" },
        { type = "in", action = "ACCEPT", proto = "tcp", dport = "3121", source = "+management-bastions", comment = "SPICE Proxy" },
        { type = "in", action = "ACCEPT", proto = "tcp", dport = "85", source = "+management-bastions", comment = "Web Console" }
      ]
    }
    "cluster" = {
      comment = "Corosync Cluster Synchronization & Live Migration"
      rules = [
        { type = "in", action = "ACCEPT", proto = "udp", dport = "5404:5405", source = "+cluster-nodes", comment = "Corosync Totem Heartbeat" },
        { type = "in", action = "ACCEPT", proto = "tcp", dport = "22,8006", source = "+cluster-nodes", comment = "Node API & Sync" },
        { type = "in", action = "ACCEPT", proto = "tcp", dport = "60000:60050", source = "+cluster-nodes", comment = "Live Migration Tunnels" }
      ]
    }
    "telemetry" = {
      comment = "Observability, Metrics & Telemetry Exporters"
      rules = [
        { type = "in", action = "ACCEPT", proto = "tcp", dport = "9100", source = "+telemetry-collectors", comment = "Prometheus Node Exporter" },
        { type = "in", action = "ACCEPT", proto = "tcp", dport = "9256", source = "+telemetry-collectors", comment = "Process Exporter" },
        { type = "in", action = "ACCEPT", proto = "tcp", dport = "3100", source = "+telemetry-collectors", comment = "Loki Ingestion" }
      ]
    }
    "cloud" = {
      comment = "Hybrid Cloud Site-to-Site Transit Tunnels"
      rules = [
        { type = "in", action = "ACCEPT", proto = "udp", dport = "51820", source = "+cloud-tunnel-endpoints", comment = "WireGuard Transit" },
        { type = "in", action = "ACCEPT", proto = "udp", dport = "500,4500", source = "+cloud-tunnel-endpoints", comment = "IPsec IKEv2 / NAT-T" }
      ]
    }
    "threat" = {
      comment = "Threat Mitigation & Bogon Filtering"
      rules = [
        { type = "in", action = "DROP", source = "+bogon-networks", log = "info", comment = "Drop RFC Bogons" }
      ]
    }
  }
  description = "Cluster Security Groups"
}

output "firewall_status" {
  value = {
    enabled         = var.cluster_firewall_enabled
    policy_inbound  = var.default_inbound_policy
    policy_outbound = var.default_outbound_policy
    ipsets_count    = length(keys(var.ipsets))
    secgroups_count = length(keys(var.security_groups))
  }
}
