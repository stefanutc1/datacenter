locals {
  lxc_containers = {
    100 = { name = "nginx",            ostemplate = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst" },
    101 = { name = "pihole",            ostemplate = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst" },
    102 = { name = "tailscale",         ostemplate = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst" },
    103 = { name = "vaultwarden",       ostemplate = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst" },
    104 = { name = "uptimekumah",       ostemplate = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst" },
    105 = { name = "alpine-nextcloud",  ostemplate = "local:vztmpl/alpine-3.24-default_20260714_amd64.tar.xz" },
    106 = { name = "jellyfin",          ostemplate = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst" },
    107 = { name = "homarr",            ostemplate = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst" },
    108 = { name = "homeassistant",     ostemplate = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst" },
    109 = { name = "immich",            ostemplate = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst" },
    110 = { name = "prometheus",        ostemplate = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst" },
    111 = { name = "alpine-grafana",    ostemplate = "local:vztmpl/alpine-3.24-default_20260714_amd64.tar.xz" },
    112 = { name = "alpine-gitea",      ostemplate = "local:vztmpl/alpine-3.24-default_20260714_amd64.tar.xz" },
    113 = { name = "n8n",               ostemplate = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst" },
    114 = { name = "woodpecker",        ostemplate = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst" },
    115 = { name = "alpine-it-tools",   ostemplate = "local:vztmpl/alpine-3.24-default_20260714_amd64.tar.xz" },
    116 = { name = "alpine-scrutiny",   ostemplate = "local:vztmpl/alpine-3.24-default_20260714_amd64.tar.xz" },
    117 = { name = "influxdb",          ostemplate = "local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst" }
  }
}

resource "proxmox_virtual_environment_container" "lxc" {
  for_each = local.lxc_containers

  node_name    = "proxmox"
  vm_id        = each.key
  description  = "Managed by Terraform"
  unprivileged = true

  operating_system {
    template_file_id = each.value.ostemplate
    type             = strcontains(lower(each.value.name), "debian") ? "debian" : "alpine"
  }

  initialization {
    hostname = each.value.name
    user_account {
      password = ""
    }
    ip_config {
      ipv4 {
        address = "dhcp"
      }
    }
  }

  network_interface {
    name   = "eth0"
    bridge = "vmbr0"
  }

  disk {
    datastore_id = "local-lvm"
    size         = 8
  }
}

resource "proxmox_virtual_environment_vm" "opnsense" {
  node_name   = "proxmox"
  vm_id       = 200
  name        = "opnsense"
  description = "Managed by Terraform - Router/Firewall"

  cpu {
    cores = 2
    type  = "host"
  }

  memory {
    dedicated = 2048
  }

  disk {
    datastore_id = "local-lvm"
    file_format  = "raw"
    size         = 20
    interface    = "scsi0"
  }

  network_device {
    bridge = "vmbr0"
  }
  
  network_device {
    bridge = "vmbr1"
  }

  boot_order = ["scsi0"]
}
