export const homelabArticles = [
  {
    id: "overview",
    title: "System Overview",
    category: "Architecture",
    icon: "🏠",
    summary: "High-level architecture, design philosophy, and hardware topology.",
    content: `# 🏠 Homelab Infrastructure Overview

The Homelab is a fully declarative, self-hosted infrastructure platform engineered on **Proxmox VE 8/9**, **Ansible**, **Terraform**, and a **k3s Kubernetes** cluster with **FluxCD GitOps** continuous reconciliation.

## Core Design Principles

1. **Infrastructure as Code (IaC)**: Every virtual machine, network bridge, and firewall policy is declared in code.
2. **Zero-Trust Network Segmentation**: Workloads are isolated across dedicated VLANs (Management, Core, Apps, K8s, IoT).
3. **Automated Hardening**: CIS benchmark kernel sysctl parameters and restrictive access controls deployed via Ansible.
4. **GitOps Continuous Delivery**: Kubernetes manifests reconciled automatically from GitHub with self-healing.
5. **Edge IoT Convergence**: Direct telemetry integration with ESP32 microcontrollers for garden irrigation and occupancy sensing.

---

## High-Level Topology

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│                    Proxmox VE Hypervisor                     │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  Core Infrastructure (VLAN 10)                        │   │
│  │  OPNsense Firewall · Pi-hole DNS · NetBird Mesh VPN   │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  Ingress & Authentication (VLAN 10)                   │   │
│  │  Nginx Proxy Manager (SSL) · Authelia SSO + 2FA       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  Observability Stack (VLAN 20)                        │   │
│  │  Prometheus + Alertmanager · Grafana · Uptime Kuma    │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  Application Services (VLAN 20)                       │   │
│  │  Immich · Nextcloud · Vaultwarden · n8n · Gitea      │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  k3s Kubernetes Cluster (VLAN 30)                     │   │
│  │  FluxCD GitOps Synchronization Engine                 │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
\`\`\`
`
  },
  {
    id: "networking",
    title: "VLANs & Networking",
    category: "Architecture",
    icon: "🌐",
    summary: "Subnet planning, 802.1Q VLAN tags, and OPNsense routing rules.",
    content: `# 🌐 Network Topology & VLAN Planning

The homelab relies on strict L2/L3 segmentation orchestrated via an OPNsense virtual appliance.

## Subnet Allocations

| VLAN ID | Subnet CIDR | Interface | Purpose | Ingress Policy |
| :--- | :--- | :--- | :--- | :--- |
| **VLAN 1** | \`192.168.1.0/24\` | \`vmbr0\` | Hypervisor Management | Admin workstation only |
| **VLAN 10** | \`192.168.10.0/24\` | \`vmbr0.10\` | Core Infrastructure | NPM, Authelia, Pi-hole, NetBird |
| **VLAN 20** | \`192.168.20.0/24\` | \`vmbr0.20\` | Application Stacks | Docker hosts and persistent storage |
| **VLAN 30** | \`192.168.30.0/24\` | \`vmbr0.30\` | Kubernetes Cluster | k3s nodes, Cilium / Flannel overlay |
| **VLAN 40** | \`192.168.40.0/24\` | \`vmbr0.40\` | IoT & Embedded Devices | ESP32 nodes, Home Assistant sensors |

---

## Ingress & SSO Routing Flow

All incoming HTTP/HTTPS requests follow a strict forward-authentication sequence:

1. Client resolves \`*.homelab.local\` to Nginx Proxy Manager (\`192.168.10.5\`) via Pi-hole.
2. NPM terminates SSL and triggers a sub-request to Authelia (\`http://authelia:9091/api/verify\`).
3. Authelia validates the session cookie and evaluates 2FA Duo / TOTP policy.
4. On HTTP 200 response, NPM forwards the request to the upstream Docker container.
`
  },
  {
    id: "services",
    title: "Services Catalog",
    category: "Services",
    icon: "📦",
    summary: "Detailed reference for all 30+ containerized applications.",
    content: `# 📦 Containerized Services Catalog

All application services run as modular Docker Compose stacks managed under the \`services/\` directory.

## Core Infrastructure & Ingress
- **Nginx Proxy Manager** (\`:80\`, \`:443\`, \`:81\`): SSL termination and Let's Encrypt auto-renewal.
- **Authelia** (\`:9091\`): Single Sign-On and multi-factor authentication forward proxy.
- **Pi-hole** (\`:53\`, \`:80\`): Network-wide DNS sinkhole and local hostname resolution.
- **NetBird** (\`:33073\`): WireGuard-based zero-trust overlay mesh VPN.

## Observability & Monitoring
- **Prometheus** (\`:9090\`): Time-series metrics engine scraping hosts and containers.
- **Alertmanager** (\`:9093\`): Alert deduplication, grouping, and Discord webhook dispatch.
- **Grafana** (\`:3000\`): Telemetry visualization and dashboard analytics.
- **Uptime Kuma** (\`:3001\`): Real-time HTTP, TCP, and DNS service uptime monitor.
- **Scrutiny** (\`:8080\`): S.M.A.R.T. storage drive health monitoring daemon.

## Data & Productivity
- **Immich** (\`:2283\`): Self-hosted high-performance photo and video backup.
- **Nextcloud** (\`:80\`): Enterprise file synchronization and team collaboration.
- **Vaultwarden** (\`:80\`): Bitwarden-compatible lightweight password vault.
- **AList** (\`:5244\`): Unified file list and multi-cloud storage gateway.
- **FileBrowser** (\`:8082\`): Lightweight web-based file management interface.
- **n8n** (\`:5678\`): Node-based workflow automation and webhook orchestration.
- **Gitea** (\`:3001\`): Self-hosted Git source control management.
- **Woodpecker CI** (\`:8000\`): Container-native CI/CD automation engine.
`
  },
  {
    id: "iac",
    title: "Terraform & Multi-Hypervisor",
    category: "IaC",
    icon: "🏗️",
    summary: "Terraform modules, cloud-init templates, and hypervisor drivers.",
    content: `# 🏗️ Infrastructure as Code (Terraform)

The homelab leverages Terraform to maintain immutable infrastructure across multiple hypervisors.

## Proxmox VM Module (\`terraform/modules/proxmox_vm/\`)

\`\`\`hcl
module "k3s_worker_01" {
  source         = "./modules/proxmox_vm"
  vm_name        = "k3s-worker-01"
  target_node    = "pve"
  vm_cores       = 4
  vm_memory      = 8192
  vm_disk_size   = "64G"
  network_bridge = "vmbr0"
  vlan_tag       = 30
}
\`\`\`

## Supported Hypervisors
- **Proxmox VE** (\`hypervisors/proxmox/\`): Primary production platform for QEMU VMs and LXC containers.
- **Xen** (\`hypervisors/xen/\`): Xen hypervisor domain definitions.
- **VMware ESXi** (\`hypervisors/esxi/\`): vSphere Terraform provider configurations.
- **Hyper-V** (\`hypervisors/hyperv/\`): Windows Server Generation 2 virtual machines.
- **FreeBSD bhyve** (\`hypervisors/bhyve/\`): Lightweight BSD hypervisor provisioning.
`
  },
  {
    id: "kubernetes",
    title: "Kubernetes & FluxCD GitOps",
    category: "Kubernetes",
    icon: "☸️",
    summary: "k3s cluster bootstrapping, Kustomization manifests, and GitOps sync.",
    content: `# ☸️ Kubernetes & GitOps Engine

The container orchestration tier is powered by **k3s** and reconciled continuously via **FluxCD**.

## GitOps Sync Architecture

FluxCD continuously reconciles the cluster state against \`kubernetes/gitops/\`:

\`\`\`yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: homelab-repo
  namespace: flux-system
spec:
  interval: 5m0s
  url: https://github.com/stefannut/homelab
  ref:
    branch: main
\`\`\`

## Key Highlights
- **Automated Pruning**: Deleted manifests in Git are immediately removed from the cluster.
- **Zero Drift**: Any manual cluster modifications are automatically reverted to match the Git state.
- **Resource Optimization**: Traefik and ServiceLB are disabled in favor of external NPM routing.
`
  },
  {
    id: "esp32",
    title: "ESP32 Embedded Systems",
    category: "Edge / IoT",
    icon: "🌿",
    summary: "Garden irrigation scheduling and physical occupancy sensors.",
    content: `# 🌿 ESP32 Embedded Edge Projects

## 1. Automated Irrigation Controller (\`esp32/irrigation/\`)

Microcontroller firmware written in C++ for intelligent garden valve control:
- **\`ore.cpp\`**: RTC scheduling engine managing multi-zone timing.
- **\`vreme.cpp\`**: Weather and soil moisture telemetry integration (skips watering during rain events).
- **\`control.cpp\`**: Digital relay actuation with watchdog safety shutoff timers.

## 2. Footprint Occupancy Sensor (\`esp32/footprint/\`)

- Dual PIR and ultrasonic sensor sampling with signal de-bouncing.
- Publishes MQTT occupancy events to Home Assistant on topic \`homelab/sensors/footprint/state\`.
`
  },
  {
    id: "runbooks",
    title: "Runbooks & Disaster Recovery",
    category: "Operations",
    icon: "🚨",
    summary: "Cold start procedure, ZFS snapshot recovery, and backup routines.",
    content: `# 🚨 Runbooks & Disaster Recovery

## Cold Start Procedure (Power Recovery)

In the event of a total blackout, restore services in this precise order:

1. **Verify UPS**: Ensure physical battery $> 50\\%$.
2. **Switching**: Power on managed switches and confirm VLAN trunking.
3. **Hypervisor**: Boot Proxmox host (\`pve\`).
4. **Firewall / Routing**: Start OPNsense VM and verify default gateway reachability.
5. **DNS Engine**: Start Pi-hole and verify resolution (\`nslookup npm.homelab.local\`).
6. **Ingress & Auth**: Bring up Nginx Proxy Manager and Authelia.
7. **Application Layer**: Execute \`docker compose up -d\` across all service stacks.

## Backup Verification
- PostgreSQL dumps automated daily at 03:00 UTC.
- Proxmox Backup Server (PBS) differential snapshots taken weekly.
`
  },
  {
    id: "virtual-machines",
    title: "Virtual Machines (KVM)",
    category: "Hypervisors",
    icon: "🖥️",
    summary: "Declarative specifications, Cloud-Init automation, and VirtIO hardware acceleration for VM 200, 201, and 202.",
    content: `# 🖥️ Proxmox VE KVM Virtual Machines Architecture

In addition to lightweight LXC containers, the homelab platform runs dedicated **KVM Virtual Machines** for workloads requiring kernel isolation, paravirtualized network appliances, and full guest operating systems.

---

## 📋 Virtual Machine Inventory Matrix

| VMID | Name | Operating System | vCPUs | RAM | Storage Disk | Network Bridge | Primary Protocol | Role / Function |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **200** | \`opnsense\` | FreeBSD 14.x / OPNsense | 2 | 2048 MB | 16 GB SSD (\`local-lvm\`) | \`vmbr0\` (WAN) + \`vmbr1\` (LAN) | WebGUI (\`:8443\`) | Core Firewall, NAT Gateway, WireGuard |
| **201** | \`windows-server\` | Windows Server 2022 / 2025 | 2 | 3072 MB | 40 GB NVMe (\`local-lvm\`) | \`vmbr0\` (Management) | RDP (\`:3389\`), WinRM (\`:5985\`) | Active Directory Domain Services, DNS |
| **202** | \`ubuntu-server\` | Ubuntu Server 24.04 LTS | 2 | 2048 MB | 25 GB NVMe (\`local-lvm\`) | \`vmbr0\` (Management) | SSH (\`:22\`), QEMU Guest Agent | Cloud-Init Microservices, Automation |

---

## 🔐 Uniform Credentials & Access Standards

All virtual machines are pre-configured with standardized administrative credentials:
- **Primary Administrator:** \`Stefanut\`
- **Default Password:** \`Stefanut005\`
- **SSH Key Authentication:** Hypervisor \`id_ed25519.pub\` injected via Cloud-Init

---

## 1. OPNsense Virtual Router (VM 200)

- **Architecture**: Dual-interface virtual appliance connecting physical uplink to virtual internal LAN.
- **Routing**: Inter-VLAN routing, stateful inspection, and CrowdSec IPS/IDS remediation bouncer.
- **Access**: WebGUI at \`https://192.168.1.132:8443\` or \`https://opnsense.lan\`.

## 2. Windows Server 2022 / 2025 (VM 201)

- **Configuration**: \`q35\` chipset with \`OVMF (UEFI)\` 4M firmware and TPM 2.0 emulation.
- **Storage**: \`virtio-scsi-single\` controller with SSD discard enabled on \`local-lvm\`.
- **Automation**: Unattended answer file (\`vms/windows-server/autounattend.xml\`) injects drivers and creates user \`Stefanut\`.
- **Access**: RDP on port \`3389\` (\`winserver.lan:3389\`).

## 3. Ubuntu Server 24.04 LTS Noble Numbat (VM 202)

- **Cloud-Init Engine**: Automated fast-clone provisioning from \`noble-server-cloudimg-amd64.img\`.
- **Telemetry**: QEMU Guest Agent communicates live IP addresses and memory usage to Proxmox.
- **Network**: Static IP \`192.168.1.202/24\`, Gateway \`192.168.1.1\`, DNS \`192.168.1.4\` (\`ubuntu.lan\`).
`
  }
];

export const homelabServices = [
  { name: "Nginx Proxy Manager", category: "Ingress", ip: "192.168.1.3", port: 81, ipUrl: "http://192.168.1.3:81", domain: "nginx.lan", domainUrl: "http://nginx.lan", status: "Active", icon: "🌐" },
  { name: "Authelia SSO", category: "Ingress", ip: "192.168.1.20", port: 9091, ipUrl: "http://192.168.1.20:9091", domain: "authelia.lan", domainUrl: "http://authelia.lan", status: "Active", icon: "🔐" },
  { name: "Pi-hole DNS", category: "Networking", ip: "192.168.1.4", port: 8080, ipUrl: "http://192.168.1.4:8080/admin/", domain: "pihole.lan", domainUrl: "http://pihole.lan/admin/", status: "Active", icon: "🛡️" },
  { name: "Prometheus", category: "Observability", ip: "192.168.1.11", port: 9090, ipUrl: "http://192.168.1.11:9090", domain: "prometheus.lan", domainUrl: "http://prometheus.lan", status: "Active", icon: "📈" },
  { name: "Grafana Dashboards", category: "Observability", ip: "192.168.1.11", port: 3000, ipUrl: "http://192.168.1.11:3000", domain: "grafana.lan", domainUrl: "http://grafana.lan", status: "Active", icon: "📊" },
  { name: "Loki Log Engine", category: "Observability", ip: "192.168.1.11", port: 3100, ipUrl: "http://192.168.1.11:3100", domain: "loki.lan", domainUrl: "http://loki.lan", status: "Active", icon: "📑" },
  { name: "Uptime Kuma", category: "Observability", ip: "192.168.1.7", port: 3001, ipUrl: "http://192.168.1.7:3001", domain: "uptime.lan", domainUrl: "http://uptime.lan", status: "Active", icon: "⏱️" },
  { name: "Scrutiny S.M.A.R.T.", category: "Observability", ip: "192.168.1.18", port: 8080, ipUrl: "http://192.168.1.18:8080", domain: "scrutiny.lan", domainUrl: "http://scrutiny.lan", status: "Active", icon: "💾" },
  { name: "CrowdSec LAPI", category: "Security", ip: "192.168.1.9", port: 8080, ipUrl: "http://192.168.1.9:8080", domain: "crowdsec.lan", domainUrl: "http://crowdsec.lan", status: "Active", icon: "🛡️" },
  { name: "Immich Photos", category: "Storage & Media", ip: "192.168.1.15", port: 2283, ipUrl: "http://192.168.1.15:2283", domain: "immich.lan", domainUrl: "http://immich.lan", status: "Active", icon: "📸" },
  { name: "Nextcloud Hub", category: "Storage & Media", ip: "192.168.1.8", port: 80, ipUrl: "http://192.168.1.8", domain: "nextcloud.lan", domainUrl: "http://nextcloud.lan", status: "Active", icon: "☁️" },
  { name: "Jellyfin Media", category: "Storage & Media", ip: "192.168.1.21", port: 8096, ipUrl: "http://192.168.1.21:8096", domain: "jellyfin.lan", domainUrl: "http://jellyfin.lan", status: "Active", icon: "🎬" },
  { name: "Radarr Movies", category: "Storage & Media", ip: "192.168.1.21", port: 7878, ipUrl: "http://192.168.1.21:7878", domain: "radarr.lan", domainUrl: "http://radarr.lan", status: "Active", icon: "🎥" },
  { name: "Sonarr TV", category: "Storage & Media", ip: "192.168.1.21", port: 8989, ipUrl: "http://192.168.1.21:8989", domain: "sonarr.lan", domainUrl: "http://sonarr.lan", status: "Active", icon: "📺" },
  { name: "Prowlarr Indexers", category: "Storage & Media", ip: "192.168.1.21", port: 9696, ipUrl: "http://192.168.1.21:9696", domain: "prowlarr.lan", domainUrl: "http://prowlarr.lan", status: "Active", icon: "🔍" },
  { name: "Bazarr Subtitles", category: "Storage & Media", ip: "192.168.1.21", port: 6767, ipUrl: "http://192.168.1.21:6767", domain: "bazarr.lan", domainUrl: "http://bazarr.lan", status: "Active", icon: "💬" },
  { name: "qBittorrent", category: "Storage & Media", ip: "192.168.1.21", port: 8080, ipUrl: "http://192.168.1.21:8080", domain: "qbittorrent.lan", domainUrl: "http://qbittorrent.lan", status: "Active", icon: "📥" },
  { name: "AList Storage", category: "Storage & Media", ip: "192.168.1.25", port: 5244, ipUrl: "http://192.168.1.25:5244", domain: "alist.lan", domainUrl: "http://alist.lan", status: "Active", icon: "📁" },
  { name: "FileBrowser", category: "Storage & Media", ip: "192.168.1.23", port: 8082, ipUrl: "http://192.168.1.23:8082", domain: "filebrowser.lan", domainUrl: "http://filebrowser.lan", status: "Active", icon: "📂" },
  { name: "Home Assistant", category: "Automation", ip: "192.168.1.10", port: 8123, ipUrl: "http://192.168.1.10:8123", domain: "ha.lan", domainUrl: "http://ha.lan", status: "Active", icon: "💡" },
  { name: "n8n Automation", category: "Automation", ip: "192.168.1.13", port: 5678, ipUrl: "http://192.168.1.13:5678", domain: "n8n.lan", domainUrl: "http://n8n.lan", status: "Active", icon: "⚡" },
  { name: "ChangeDetection", category: "Automation", ip: "192.168.1.24", port: 5000, ipUrl: "http://192.168.1.24:5000", domain: "changedetection.lan", domainUrl: "http://changedetection.lan", status: "Active", icon: "👁️" },
  { name: "Gitea Forge", category: "DevOps", ip: "192.168.1.17", port: 3000, ipUrl: "http://192.168.1.17:3000", domain: "gitea.lan", domainUrl: "http://gitea.lan", status: "Active", icon: "🐙" },
  { name: "Woodpecker CI", category: "DevOps", ip: "192.168.1.14", port: 8000, ipUrl: "http://192.168.1.14:8000", domain: "woodpecker.lan", domainUrl: "http://woodpecker.lan", status: "Active", icon: "🔨" },
  { name: "Vaultwarden", category: "Productivity", ip: "192.168.1.16", port: 8080, ipUrl: "http://192.168.1.16:8080", domain: "vaultwarden.lan", domainUrl: "http://vaultwarden.lan", status: "Active", icon: "🔒" },
  { name: "Trilium Notes", category: "Productivity", ip: "192.168.1.19", port: 8080, ipUrl: "http://192.168.1.19:8080", domain: "trilium.lan", domainUrl: "http://trilium.lan", status: "Active", icon: "📝" },
  { name: "Actual Budget", category: "Productivity", ip: "192.168.1.22", port: 5006, ipUrl: "http://192.168.1.22:5006", domain: "actualbudget.lan", domainUrl: "http://actualbudget.lan", status: "Active", icon: "💰" },
  { name: "IT-Tools", category: "Utilities", ip: "192.168.1.12", port: 80, ipUrl: "http://192.168.1.12", domain: "it-tools.lan", domainUrl: "http://it-tools.lan", status: "Active", icon: "🧰" },
  { name: "OPNsense Gateway", category: "Virtual Machines", ip: "192.168.1.132", port: 8443, ipUrl: "https://192.168.1.132:8443", domain: "opnsense.lan", domainUrl: "https://opnsense.lan", status: "Active", icon: "🛡️" },
  { name: "Windows Server 2022", category: "Virtual Machines", ip: "192.168.1.201", port: 3389, ipUrl: "http://192.168.1.201:3389", domain: "winserver.lan", domainUrl: "http://winserver.lan", status: "Active", icon: "🪟" },
  { name: "Ubuntu Server 24.04", category: "Virtual Machines", ip: "192.168.1.202", port: 22, ipUrl: "http://192.168.1.202:22", domain: "ubuntu.lan", domainUrl: "http://ubuntu.lan", status: "Active", icon: "🐧" }
];
