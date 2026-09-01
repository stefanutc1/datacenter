terraform {
  required_version = ">= 1.8.0"
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = ">= 0.60.0"
    }
  }
}

resource "proxmox_virtual_environment_vm" "vm" {
  node_name   = var.target_node
  vm_id       = var.vmid
  name        = var.name
  description = var.description
  tags        = var.tags
  on_boot     = var.onboot
  started     = true

  agent {
    enabled = true
    timeout = "10m"
  }

  cpu {
    cores   = var.cores
    sockets = var.sockets
    type    = var.cpu_type
  }

  memory {
    dedicated = var.memory
    floating  = var.balloon > 0 ? var.balloon : var.memory
  }

  disk {
    datastore_id = var.storage_pool
    size         = var.disk_size
    interface    = "scsihw0"
    iothread     = true
    discard      = "on"
    ssd          = true
  }

  network_device {
    bridge      = "vmbr0"
    vlan_id     = var.vlan_tag
    model       = "virtio"
    mac_address = var.mac_address != "" ? var.mac_address : null
    firewall    = true
  }

  operating_system {
    type = "l26"
  }

  dynamic "hostpci" {
    for_each = var.pci_passthrough_device != "" ? [1] : []
    content {
      device = "hostpci0"
      id     = var.pci_passthrough_device
      pcie   = true
      rombar = true
    }
  }

  lifecycle {
    prevent_destroy = false
  }
}
