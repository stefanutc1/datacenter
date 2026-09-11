# ==============================================================================
# PROXMOX VIRTUAL MACHINES (DEEP INFRASTRUCTURE & CYBER DEFENSE)
# ==============================================================================

# VM 200: OPNsense Stateful Core Firewall & Suricata IDS/IPS
module "vm_opnsense" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 200
  name         = "opnsense-firewall"
  description  = "Perimeter Security Gateway, WireGuard VPN & Suricata/Snort DPI"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 16
  storage_pool = "local-lvm"
  vlan_tag     = 10
  tags         = ["network", "firewall", "ids-ips", "terraform"]
}

# VM 201: Windows Server 2025 Datacenter (Active Directory & GPO Lab)
module "vm_windows_server_2025" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 201
  name         = "win-server-2025"
  description  = "Active Directory Domain Services (AD DS), DNS, GPO & Sysmon Forwarding"
  cores        = 2
  memory       = 7168
  balloon      = 4096
  disk_size    = 120
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["windows", "active-directory", "sysmon", "terraform"]
}

# VM 202: Red Hat Enterprise Linux 9.8 (SELinux Enforcing, Podman Rootless)
module "vm_rhel" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 202
  name         = "rhel"
  description  = "Red Hat Enterprise Linux 9.8 (SELinux Enforcing, Podman Rootless, Enterprise Workload)"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 50
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["rhel", "redhat", "enterprise", "selinux", "podman", "terraform"]
}

# VM 203: OpenStack Private Cloud Controller & Compute
module "vm_openstack" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 203
  name         = "openstack"
  description  = "OpenStack Enterprise Private Cloud Controller & Compute (Nova, Neutron, Keystone, Glance, Horizon)"
  cores        = 2
  memory       = 4096
  balloon      = 2048
  disk_size    = 32
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["openstack", "cloud", "iaas", "nova", "neutron", "horizon", "terraform"]
}

# VM 204: Metasploitable 2 (Intentionally Vulnerable Linux Target)
module "vm_metasploitable2" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 204
  name         = "metasploitable2"
  description  = "Metasploitable 2 (Intentionally Vulnerable Linux Target, Penetration Testing & IDS/IPS Tuning)"
  cores        = 1
  memory       = 512
  disk_size    = 8
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["cyber", "metasploit", "metasploitable2", "penetration-testing", "red-team", "terraform"]
}

# VM 205: T-Pot Multi-Honeypot Platform in Isolated DMZ
module "vm_tpot_honeypot" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 205
  name         = "tpot-honeypot-dmz"
  description  = "Multi-honeypot platform (Cowrie, Dionaea, Honeytrap, Elastic, Kibana, Suricata)"
  cores        = 4
  memory       = 8192
  balloon      = 4096
  disk_size    = 60
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["cyber", "honeypot", "tpot", "threat-intel", "elastic", "suricata", "terraform"]
}

# VM 206: Security Onion / Wazuh SIEM Platform
module "vm_securityonion" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 206
  name         = "securityonion"
  description  = "Security Onion / Wazuh SIEM Platform (Zeek, Suricata, Elastic, Kibana & HIDS Monitoring)"
  cores        = 4
  memory       = 8192
  balloon      = 4096
  disk_size    = 50
  storage_pool = "local-lvm"
  vlan_tag     = 30
  tags         = ["blue-team", "hids", "log-analysis", "security-onion", "siem", "wazuh", "terraform"]
}

# VM 207: REMnux Linux Toolkit (Malware Analysis, DFIR & Reverse Engineering)
module "vm_remnux" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 207
  name         = "remnux"
  description  = "REMnux Linux Toolkit (Malware Analysis, Reverse Engineering, Memory Forensics & DFIR)"
  cores        = 2
  memory       = 4096
  balloon      = 2048
  disk_size    = 40
  storage_pool = "local-lvm"
  vlan_tag     = 35
  tags         = ["cyber", "dfir", "malware-analysis", "remnux", "reverse-engineering", "terraform"]
}

# VM 300: Bachelor Thesis Lab (Lucrare de Licență) - Windows Server 2019 Standard
module "vm_windows_server_licenta" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 300
  name         = "windows-server-licenta"
  description  = "Bachelor Thesis Lab (Lucrare de Licenta) - Windows Server 2019 Standard (Massgrave GVLK / KMS Activation, Active Directory DS & Domain Security Lab)"
  cores        = 4
  memory       = 8192
  balloon      = 4096
  disk_size    = 64
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["windows", "server", "active-directory", "licenta", "bachelor-thesis", "terraform"]
}

# VM 301: Bachelor Thesis Lab (Lucrare de Licență) - Metasploitable Target
module "vm_metasploitable_licenta" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 301
  name         = "metasploitable-licenta"
  description  = "Bachelor Thesis Lab (Lucrare de Licenta) - Metasploitable Linux Target (Penetration Testing, Red Teaming & Suricata/Wazuh Vulnerability Lab)"
  cores        = 2
  memory       = 2048
  balloon      = 1024
  disk_size    = 20
  storage_pool = "local-lvm"
  vlan_tag     = 40
  tags         = ["cyber", "licenta", "bachelor-thesis", "metasploit", "metasploitable", "pentest", "red-team", "terraform"]
}

