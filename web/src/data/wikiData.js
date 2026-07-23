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
  }
];

export const homelabServices = [
  { name: "Nginx Proxy Manager", category: "Ingress", port: 81, status: "Active", domain: "npm.homelab.local", icon: "🌐" },
  { name: "Authelia", category: "Ingress", port: 9091, status: "Active", domain: "auth.homelab.local", icon: "🔐" },
  { name: "Pi-hole", category: "Networking", port: 53, status: "Active", domain: "pihole.homelab.local", icon: "🛡️" },
  { name: "NetBird", category: "Networking", port: 33073, status: "Active", domain: "Mesh Overlay", icon: "🔗" },
  { name: "Prometheus", category: "Observability", port: 9090, status: "Active", domain: "prometheus.homelab.local", icon: "📈" },
  { name: "Alertmanager", category: "Observability", port: 9093, status: "Active", domain: "alerts.homelab.local", icon: "🔔" },
  { name: "Grafana", category: "Observability", port: 3000, status: "Active", domain: "grafana.homelab.local", icon: "📊" },
  { name: "Uptime Kuma", category: "Observability", port: 3001, status: "Active", domain: "status.homelab.local", icon: "⏱️" },
  { name: "Scrutiny", category: "Observability", port: 8080, status: "Active", domain: "disks.homelab.local", icon: "💾" },
  { name: "Immich", category: "Storage & Media", port: 2283, status: "Active", domain: "photos.homelab.local", icon: "📸" },
  { name: "Nextcloud", category: "Storage & Media", port: 80, status: "Active", domain: "cloud.homelab.local", icon: "☁️" },
  { name: "AList", category: "Storage & Media", port: 5244, status: "Active", domain: "files.homelab.local", icon: "📁" },
  { name: "FileBrowser", category: "Storage & Media", port: 8082, status: "Active", domain: "browser.homelab.local", icon: "📂" },
  { name: "Home Assistant", category: "Automation", port: 8123, status: "Active", domain: "home.homelab.local", icon: "💡" },
  { name: "Frigate", category: "Automation", port: 5000, status: "Active", domain: "nvr.homelab.local", icon: "📹" },
  { name: "n8n", category: "Automation", port: 5678, status: "Active", domain: "n8n.homelab.local", icon: "⚡" },
  { name: "Gitea", category: "DevOps", port: 3001, status: "Active", domain: "git.homelab.local", icon: "🐙" },
  { name: "Woodpecker CI", category: "DevOps", port: 8000, status: "Active", domain: "ci.homelab.local", icon: "🔨" },
  { name: "Vaultwarden", category: "Productivity", port: 80, status: "Active", domain: "vault.homelab.local", icon: "🔒" },
  { name: "Trillium Notes", category: "Productivity", port: 8080, status: "Active", domain: "notes.homelab.local", icon: "📝" },
  { name: "Actual Budget", category: "Productivity", port: 5006, status: "Active", domain: "budget.homelab.local", icon: "💰" },
  { name: "IT-Tools", category: "Utilities", port: 80, status: "Active", domain: "tools.homelab.local", icon: "🧰" }
];
