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

# VM 201: OpenStack Private Cloud Controller & Compute
module "vm_openstack" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 201
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

# VM 202: Metasploitable 2 (Intentionally Vulnerable Linux Target)
module "vm_metasploitable2" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 202
  name         = "metasploitable2"
  description  = "Metasploitable 2 (Intentionally Vulnerable Linux Target, Penetration Testing & IDS/IPS Tuning)"
  cores        = 1
  memory       = 512
  disk_size    = 8
  storage_pool = "local-lvm"
  vlan_tag     = 20
  tags         = ["cyber", "metasploit", "metasploitable2", "penetration-testing", "red-team", "terraform"]
}

# VM 203: T-Pot Multi-Honeypot Platform in Isolated DMZ
module "vm_tpot_honeypot" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 203
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

# VM 204: Security Onion / Wazuh SIEM Platform
module "vm_securityonion" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 204
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

# VM 205: REMnux Linux Toolkit (Malware Analysis, DFIR & Reverse Engineering)
module "vm_remnux" {
  source       = "../modules/proxmox_vm"
  target_node  = var.primary_node
  vmid         = 205
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

# ------------------------------------------------------------------------------
# BACHELOR THESIS / FACULTY LABS (VM 300, 301, 302 & CT 303)
# Dedicated declarative configuration moved to terraform/proxmox/licenta.tf
# ------------------------------------------------------------------------------


