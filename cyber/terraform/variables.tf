variable "lab_network_cidr" {
  description = "Isolated laboratory subnet CIDR"
  type        = string
  default     = "192.168.64.0/24"
}

variable "nodes" {
  description = "Laboratory node definitions"
  type = map(object({
    ip    = string
    role  = string
    cores = number
    ram_mb = number
  }))
  default = {
    "cyber-node01" = {
      ip     = "192.168.64.10"
      role   = "target-primary"
      cores  = 2
      ram_mb = 2048
    }
    "cyber-node02" = {
      ip     = "192.168.64.20"
      role   = "dmz-web"
      cores  = 2
      ram_mb = 2048
    }
    "cyber-soc01" = {
      ip     = "192.168.64.30"
      role   = "siem-soc"
      cores  = 4
      ram_mb = 4096
    }
  }
}
