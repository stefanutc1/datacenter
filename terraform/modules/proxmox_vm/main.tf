terraform {
  required_providers {
    proxmox = {
      source  = "telmate/proxmox"
      version = ">= 2.9.14"
    }
  }
}

resource "proxmox_vm_qemu" "vm_instance" {
  name        = var.vm_name
  target_node = var.target_node
  clone       = "ubuntu-2404-cloudinit-template"
  cores       = var.vm_cores
  sockets     = 1
  memory      = var.vm_memory
  os_type     = "cloud-init"
  scsihw      = "virtio-scsi-pci"
  bootdisk    = "scsi0"

  disk {
    slot    = 0
    size    = var.vm_disk_size
    type    = "scsi"
    storage = "local-lvm"
  }

  network {
    model  = "virtio"
    bridge = "vmbr0"
  }
}
