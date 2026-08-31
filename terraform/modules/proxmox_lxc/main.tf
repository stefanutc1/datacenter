terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = ">= 0.60.0"
    }
  }
}

resource "proxmox_virtual_environment_container" "container" {
  node_name    = var.target_node
  vm_id        = var.vmid
  unprivileged = var.unprivileged
  tags         = var.tags

  initialization {
    hostname = var.hostname

    ip_config {
      ipv4 {
        address = var.ip_address
        gateway = var.gateway
      }
    }

    user_account {
      keys = [
        "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExampleHomelabManagementKey2026 admin@homelab"
      ]
    }
  }

  cpu {
    cores = var.cores
  }

  memory {
    dedicated = var.memory
    swap      = var.swap
  }

  disk {
    datastore_id = var.storage_pool
    size         = tonumber(replace(var.disk_size, "G", ""))
  }

  network_interface {
    name     = "eth0"
    bridge   = "vmbr0"
    vlan_id  = var.vlan_tag
    firewall = true
  }

  operating_system {
    template_file_id = var.ostemplate
    type             = "debian"
  }

  features {
    nesting = true
  }
}
