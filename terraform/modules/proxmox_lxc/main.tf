terraform {
  required_version = ">= 1.8.0"
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
  started      = true

  initialization {
    hostname = var.hostname

    ip_config {
      ipv4 {
        address = var.ip_address
        gateway = var.gateway
      }
    }

    dns {
      servers = [var.nameserver]
    }

    user_account {
      keys = var.ssh_public_keys
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
    type             = var.ostype
  }

  features {
    nesting = var.nesting
  }

  lifecycle {
    prevent_destroy = false
    ignore_changes = [
      initialization[0].user_account[0].password
    ]
  }
}
