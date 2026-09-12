# ==============================================================================
# ACTIVE DIRECTORY LAB INFRASTRUCTURE (FLEET 400 - 410)
# Multi-Generation Active Directory Enterprise Laboratory
# Windows Server 2025, 2022, 2019, 2016, 2012 R2, 2008 R2, 2003 R2, Win 7, Win 10, Win 11, RHEL 9.8
# Provider: bpg/proxmox (Proxmox VE REST API)
# Node: Node 1 (x86_64)
# ==============================================================================

# VM 400: Windows Server 2025 Standard/Datacenter Domain Controller
module "vm_ad2025" {
  source                 = "../modules/proxmox_vm"
  target_node            = var.primary_node
  vmid                   = 400
  name                   = "ad2025"
  description            = "Active Directory Lab - Windows Server 2025 Domain Controller (GTX 1050 Ti PCIe Passthrough)"
  cores                  = 6
  memory                 = 8192
  balloon                = 4096
  disk_size              = 256
  storage_pool           = "local-lvm"
  pci_passthrough_device = "gtx1050ti"
  onboot                 = false
  tags                   = ["active-directory", "ad2025", "domain-controller", "gtx1050ti", "microsoft", "server2025", "terraform", "windows"]
}

# VM 401: Windows Server 2022 Standard/Datacenter Domain Controller
module "vm_ad2022" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 401
  name         = "ad2022"
  description  = "Active Directory Lab - Windows Server 2022 Domain Controller"
  cores        = 2
  memory       = 4096
  balloon      = 2048
  disk_size    = 60
  storage_pool = "local-lvm"
  onboot       = false
  tags         = ["active-directory", "ad2022", "domain-controller", "microsoft", "server2022", "terraform", "windows"]
}

# VM 402: Windows Server 2019 Standard Domain Controller
module "vm_ad2019" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 402
  name         = "ad2019"
  description  = "Active Directory Lab - Windows Server 2019 Domain Controller"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 128
  storage_pool = "local-lvm"
  onboot       = false
  tags         = ["active-directory", "ad2019", "domain-controller", "microsoft", "server2019", "terraform", "windows"]
}

# VM 403: Windows Server 2016 Standard Domain Controller
module "vm_ad2016" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 403
  name         = "ad2016"
  description  = "Active Directory Lab - Windows Server 2016 Domain Controller"
  cores        = 2
  memory       = 3072
  balloon      = 2048
  disk_size    = 50
  storage_pool = "local-lvm"
  onboot       = false
  tags         = ["active-directory", "ad2016", "domain-controller", "microsoft", "server2016", "terraform", "windows"]
}

# VM 404: Windows Server 2012 R2 Standard Domain Controller
module "vm_ad2012" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 404
  name         = "ad2012"
  description  = "Active Directory Lab - Windows Server 2012 R2 Domain Controller"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 40
  storage_pool = "local-lvm"
  onboot       = false
  tags         = ["active-directory", "ad2012", "domain-controller", "microsoft", "server2012r2", "terraform", "windows"]
}

# VM 405: Windows Server 2008 R2 SP1 Standard Domain Controller
module "vm_ad2008" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 405
  name         = "ad2008"
  description  = "Active Directory Lab - Windows Server 2008 R2 SP1 Domain Controller"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 40
  storage_pool = "local-lvm"
  onboot       = false
  tags         = ["active-directory", "ad2008", "domain-controller", "microsoft", "server2008r2", "terraform", "windows"]
}

# VM 406: Windows 10 Enterprise Domain Member Client
module "vm_adwin10" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 406
  name         = "adwin10"
  description  = "Active Directory Lab - Windows 10 Enterprise Domain Member Client"
  cores        = 2
  memory       = 3072
  balloon      = 2048
  disk_size    = 50
  storage_pool = "local-lvm"
  onboot       = false
  tags         = ["active-directory", "adwin10", "client", "domain-client", "microsoft", "terraform", "windows10"]
}

# VM 407: Windows 11 Enterprise Domain Member Client
module "vm_adwin11" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 407
  name         = "adwin11"
  description  = "Active Directory Lab - Windows 11 Enterprise Domain Member Client"
  cores        = 2
  memory       = 4096
  balloon      = 2048
  disk_size    = 60
  storage_pool = "local-lvm"
  onboot       = false
  tags         = ["active-directory", "adwin11", "client", "domain-client", "microsoft", "terraform", "windows11"]
}

# VM 408: Windows 7 Ultimate SP1 Domain Member Client
module "vm_adwin7" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 408
  name         = "adwin7"
  description  = "Active Directory Lab - Windows 7 Ultimate SP1 Domain Member Client"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 50
  storage_pool = "local-lvm"
  onboot       = false
  tags         = ["active-directory", "adwin7", "client", "domain-client", "microsoft", "terraform", "windows7"]
}

# VM 409: Red Hat Enterprise Linux 9.8 Workload (Active Directory Integrated)
module "vm_adrhel" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 409
  name         = "adrhel"
  description  = "Active Directory Lab - Red Hat Enterprise Linux 9.8 Domain Workload (SSSD / Realm Join, Kerberos)"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 50
  storage_pool = "local-lvm"
  onboot       = false
  tags         = ["active-directory", "adrhel", "linux", "redhat", "rhel", "sssd", "terraform"]
}

# VM 410: Windows Server 2003 R2 SP2 Enterprise Domain Controller
module "vm_ad2003" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 410
  name         = "ad2003"
  description  = "Active Directory Lab - Windows Server 2003 R2 SP2 Enterprise Domain Controller"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 40
  storage_pool = "local-lvm"
  onboot       = false
  tags         = ["active-directory", "ad2003", "domain-controller", "legacy", "microsoft", "server2003", "terraform"]
}

