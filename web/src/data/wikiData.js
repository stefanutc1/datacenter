export const homelabArticles = [
  {
    id: "overview",
    title: "system overview",
    category: "architecture",
    icon: "sys",
    summary: "high-level architecture, design philosophy, and hardware topology.",
    content: `# homelab infrastructure overview

the homelab is a fully declarative, self-hosted infrastructure platform engineered on **proxmox ve 8/9**, **ansible**, **terraform**, and a **k3s kubernetes** cluster with **fluxcd gitops** continuous reconciliation.

## core design principles

1. **infrastructure as code (iac)**: every virtual machine, network bridge, and firewall policy is declared in code.
2. **zero-trust network segmentation**: workloads are isolated across dedicated vlans (management, core, apps, k8s, iot).
3. **automated hardening**: cis benchmark kernel sysctl parameters and restrictive access controls deployed via ansible.
4. **gitops continuous delivery**: kubernetes manifests reconciled automatically from github with self-healing.
5. **edge iot convergence**: direct telemetry integration with esp32 microcontrollers for garden irrigation and occupancy sensing.

---

## high-level topology

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│                    proxmox ve hypervisor                     │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  core infrastructure (vlan 10)                        │   │
│  │  opnsense firewall · pi-hole dns · tailscale mesh     │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  ingress & authentication (vlan 10)                   │   │
│  │  nginx proxy manager (ssl) · authelia sso + 2fa       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  observability stack (vlan 20)                        │   │
│  │  prometheus + alertmanager · grafana · uptime kuma    │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  application services (vlan 20)                       │   │
│  │  immich · nextcloud · vaultwarden · n8n · gitea      │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  k3s kubernetes cluster (vlan 30)                     │   │
│  │  fluxcd gitops synchronization engine                 │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
\`\`\`
`
  },
  {
    id: "networking",
    title: "vlans & networking",
    category: "architecture",
    icon: "net",
    summary: "subnet planning, 802.1q vlan tags, and opnsense routing rules.",
    content: `# network topology & vlan planning

the homelab relies on strict l2/l3 segmentation orchestrated via an opnsense virtual appliance.

## subnet allocations

| vlan id | subnet cidr | interface | purpose | ingress policy |
| :--- | :--- | :--- | :--- | :--- |
| **vlan 1** | \`192.168.1.0/24\` | \`vmbr0\` | hypervisor management | admin workstation only |
| **vlan 10** | \`192.168.10.0/24\` | \`vmbr0.10\` | core infrastructure | npm, authelia, pi-hole, tailscale |
| **vlan 20** | \`192.168.20.0/24\` | \`vmbr0.20\` | application stacks | docker hosts and persistent storage |
| **vlan 30** | \`192.168.30.0/24\` | \`vmbr0.30\` | kubernetes cluster | k3s nodes, cilium / flannel overlay |
| **vlan 40** | \`192.168.40.0/24\` | \`vmbr0.40\` | iot & embedded devices | esp32 nodes, home assistant sensors |

---

## ingress & sso routing flow

all incoming http/https requests follow a strict forward-authentication sequence:

1. client resolves \`*.lan\` to nginx proxy manager (\`192.168.1.3\`) via pi-hole.
2. npm terminates ssl and triggers a sub-request to authelia (\`http://192.168.1.20:9091/api/verify\`).
3. authelia validates the session cookie and evaluates 2fa totp policy.
4. on http 200 response, npm forwards the request to the upstream container.
`
  },
  {
    id: "services",
    title: "services catalog",
    category: "services",
    icon: "svc",
    summary: "detailed reference for containerized applications.",
    content: `# containerized services catalog

all application services run as modular docker compose stacks managed under the \`services/\` directory.

## core infrastructure & ingress
- **nginx proxy manager** (\`:80\`, \`:443\`, \`:81\`): ssl termination and automated certificate renewal.
- **authelia** (\`:9091\`): single sign-on and multi-factor authentication forward proxy.
- **pi-hole** (\`:53\`, \`:8080\`): network-wide dns sinkhole and local hostname resolution.
- **tailscale**: wireguard-based zero-trust overlay mesh vpn.

## observability & monitoring
- **prometheus** (\`:9090\`): time-series metrics engine scraping hosts and containers.
- **grafana** (\`:3000\`): telemetry visualization and dashboard analytics.
- **loki** (\`:3100\`): high-efficiency log aggregation engine.
- **uptime kuma** (\`:3001\`): real-time http, tcp, and dns service uptime monitor.
- **scrutiny** (\`:8080\`): s.m.a.r.t. storage drive health monitoring daemon.

## data & productivity
- **immich** (\`:2283\`): self-hosted high-performance photo and video backup.
- **nextcloud** (\`:80\`): enterprise file synchronization and team collaboration.
- **vaultwarden** (\`:8080\`): bitwarden-compatible lightweight password vault.
- **n8n** (\`:5678\`): node-based workflow automation and webhook orchestration.
- **gitea** (\`:3000\`): self-hosted git source control management.
- **woodpecker ci** (\`:8000\`): container-native ci/cd automation engine.
`
  },
  {
    id: "iac",
    title: "terraform & multi-hypervisor",
    category: "iac",
    icon: "iac",
    summary: "terraform modules, cloud-init templates, and hypervisor drivers.",
    content: `# infrastructure as code (terraform)

the homelab leverages terraform to maintain immutable infrastructure across hypervisors.

## proxmox vm module (\`terraform/modules/proxmox_vm/\`)

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

## supported hypervisors
- **proxmox ve** (\`hypervisors/proxmox/\`): primary production platform for qemu vms and lxc containers.
- **xen** (\`hypervisors/xen/\`): xen hypervisor domain definitions.
- **vmware esxi** (\`hypervisors/esxi/\`): vsphere terraform provider configurations.
- **hyper-v** (\`hypervisors/hyperv/\`): windows server generation 2 virtual machines.
- **freebsd bhyve** (\`hypervisors/bhyve/\`): lightweight bsd hypervisor provisioning.
`
  },
  {
    id: "kubernetes",
    title: "kubernetes & fluxcd gitops",
    category: "kubernetes",
    icon: "k8s",
    summary: "k3s cluster bootstrapping, kustomization manifests, and gitops sync.",
    content: `# kubernetes & gitops engine

the container orchestration tier is powered by **k3s** and reconciled continuously via **fluxcd**.

## gitops sync architecture

fluxcd continuously reconciles the cluster state against \`kubernetes/gitops/\`:

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

## key highlights
- **automated pruning**: deleted manifests in git are immediately removed from the cluster.
- **zero drift**: any manual cluster modifications are automatically reverted to match the git state.
- **resource optimization**: traefik and servicelb are disabled in favor of external npm routing.
`
  },
  {
    id: "esp32",
    title: "esp32 embedded systems",
    category: "edge / iot",
    icon: "iot",
    summary: "garden irrigation scheduling and physical occupancy sensors.",
    content: `# esp32 embedded edge projects

## 1. automated irrigation controller (\`esp32/irrigation/\`)

microcontroller firmware written in c++ for intelligent garden valve control:
- **\`ore.cpp\`**: rtc scheduling engine managing multi-zone timing.
- **\`vreme.cpp\`**: weather and soil moisture telemetry integration.
- **\`control.cpp\`**: digital relay actuation with watchdog safety shutoff timers.

## 2. footprint occupancy sensor (\`esp32/footprint/\`)

- dual pir and ultrasonic sensor sampling with signal de-bouncing.
- publishes mqtt occupancy events to home assistant on topic \`homelab/sensors/footprint/state\`.
`
  },
  {
    id: "runbooks",
    title: "disaster recovery & 10h+ emergency sop",
    category: "operations",
    icon: "sop",
    summary: "standard operating procedure for prolonged 10+ hour power outages, graceful cascading shutdown, surge isolation, and staged cold boot.",
    content: `# runbooks, disaster recovery & 10+ hour emergency sop

## extended 10+ hour power outage standard operating procedure (sop)

during prolonged blackouts ($> 10\\text{ hours}$), battery-backed ups reserves cannot sustain full compute workloads. to protect storage pools, database write journals, and delicate electronics from dirty dismounts or grid recovery power surges, follow this 4-phase protocol:

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────┐
│               10+ hour extended power outage protocol lifecycle             │
│                                                                             │
│  [t+0m] ───► [t+5m] ──────────► [t+15m - 10h+] ─────► [grid return] ──────► │
│  grid loss   cascading shutdown  physical isolation    staged cold boot     │
│  & alert     tier 4 ─► tier 0   surge & battery off   opnsense ─► apps      │
└─────────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

### phase 1: automated & cascading graceful shutdown (t+0m – t+15m)

the automated script \`/opt/homelab/scripts/emergency-shutdown.sh\` executes the shutdown order:

1. **tier 4 (heavy workloads & media lxcs - t+2m):**
   - stops jellyfin, immich, nextcloud, torrent
   - \`docker compose -f /opt/homelab/media/docker-compose.yml stop\`
2. **tier 3 (virtual machines - t+5m):**
   - alpine server (202)
   - \`qm shutdown 202 --timeout 30\`
3. **tier 2 (databases & storage flushes - t+8m):**
   - postgresql, mariadb, redis, vaultwarden
   - \`sync && docker compose -f /opt/homelab/core/docker-compose.yml stop\`
4. **tier 1 (ingress & auth - t+12m):**
   - npm, authelia, pi-hole
   - \`pct shutdown 101 102 100\`
5. **tier 0 (core gateway & hypervisor - t+14m):**
   - opnsense (200), commit \`sync\`, proxmox host \`poweroff\`.

---

### phase 2: long-term 10+ hour outage hardening & physical preservation

1. **surge suppressor isolation:** physically unplug the master surge protector from the wall outlet. when the municipal grid returns after widespread outages, severe voltage inrush spikes occur during utility transformer re-energization.
2. **ups battery protection:** switch off the physical ups master switch once all nodes have cleanly shut down. leaving the inverter running empty can drain battery cells below their critical cutoff voltage.
3. **out-of-band telemetry:** out-of-band monitoring via battery-backed cellular gateway or remote status notification.

---

### phase 3: grid restoration & staged cold-boot sequence

execute the sequential restoration script \`/opt/homelab/scripts/cold-boot-sequence.sh\`:

1. **grid stabilization window:** wait 5–10 minutes after grid return for ac voltage stabilization (clean $230\\text{v} \\pm 5\\%$ @ $50\\text{hz}$).
2. **re-engage surge suppressor & ups:** verify input voltage and normal bypass charging state.
3. **power on hypervisor (\`pve\`):** boot proxmox ve hardware.
4. **sequential boot hierarchy:**
   - \`qm start 200\` (opnsense gateway — wait 30s for wan routing & dhcp).
   - \`pct start 100\` (pi-hole dns — enables internal name resolution).
   - \`pct start 101 && pct start 102\` (npm ingress & authelia sso).
   - \`pct start 103..113\` (databases & core infrastructure).
   - \`pct start 114..119 && qm start 202\` (applications, media & workload vms).

---

### phase 4: post-recovery integrity scrub & verification

\`\`\`bash
# 1. verify storage health
df -h -t nfs4,nfs

# 2. verify container health
pct list
docker ps -a --filter "status=exited"

# 3. database checksums
sudo -u postgres psql -c "SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database;"
\`\`\`

---

## 2. automated backup hierarchy & 3-2-1 strategy

- **proxmox backup server (pbs):** daily deduplicated snapshots of containers and kvm vms with encrypted remote sync.
- **offsite cold storage:** weekly encrypted backup of critical configs (\`/etc/pve\`, \`/etc/network/interfaces\`, \`/opt/homelab\`).
`
  },
  {
    id: "virtual-machines",
    title: "virtual machines (kvm)",
    category: "hypervisors",
    icon: "kvm",
    summary: "declarative specifications, cloud-init automation, and virtio hardware acceleration for vm 200 and vm 202.",
    content: `# proxmox ve kvm virtual machines architecture

in addition to lightweight lxc containers, the homelab platform runs dedicated **kvm virtual machines** for workloads requiring kernel isolation, paravirtualized network appliances, and full guest operating systems.

---

## virtual machine inventory matrix

| vmid | name | operating system | vcpus | ram | storage disk | network bridge | primary protocol | role / function |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **200** | \`opnsense\` | freebsd 14.x / opnsense | 2 | 1024 mb | 16 gb ssd (\`local-lvm\`) | \`vmbr0\` (wan) + \`vmbr1\` (lan) | webgui (\`:8443\`) | core firewall, nat gateway, wireguard |
| **202** | \`alpine-server\` | alpine linux v3.21 virt | 2 | 256 mb | 25 gb nvme (\`local-lvm\`) | \`vmbr0\` (management) | ssh (\`:22\`), openrc | ultra-lean alpine microservices |

---

## access standards & secret management

all virtual machines and container services adhere to zero-plaintext secrets policy:
- **primary administrator:** \`Stefanut\` / \`root\` (configured via sops / cloud-init)
- **secret storage:** vaultwarden & encrypted secrets repository
- **ssh key authentication:** hypervisor \`id_ed25519.pub\` injected via cloud-init

---

## 1. opnsense virtual router (vm 200)

- **architecture**: dual-interface virtual appliance connecting physical uplink to virtual internal lan.
- **memory footprint**: tuned to **1024 mb ram** with memory ballooning.
- **routing**: inter-vlan routing, stateful inspection, and crowdsec ips/ids remediation bouncer.
- **access**: webgui at \`https://192.168.1.132:8443\` or \`https://opnsense.lan\`.

## 2. alpine linux server (vm 202)

- **base platform**: ultra-lean **alpine linux v3.21 virt** kernel with openrc init system and \`musl\` libc.
- **micro footprint**: allocated only **256 mb ram** (ballooning to 128 mb), consuming $< 60\\text{ mb}$ idle ram.
- **network**: static ip \`192.168.1.202/24\`, gateway \`192.168.1.1\`, dns \`192.168.1.4\` (\`alpine.lan\`).
`
  }
];

export const homelabServices = [
  { name: "nginx proxy manager", logo: "icons/nginx-proxy-manager.svg", category: "ingress", ip: "192.168.1.3", port: 81, ipUrl: "http://192.168.1.3:81", domain: "nginx.lan", domainUrl: "http://nginx.lan", status: "active" },
  { name: "authelia sso", logo: "icons/authelia.svg", category: "ingress", ip: "192.168.1.20", port: 9091, ipUrl: "http://192.168.1.20:9091", domain: "authelia.lan", domainUrl: "http://authelia.lan", status: "active" },
  { name: "pi-hole dns", logo: "icons/pihole.svg", category: "networking", ip: "192.168.1.4", port: 8080, ipUrl: "http://192.168.1.4:8080/admin/", domain: "pihole.lan", domainUrl: "http://pihole.lan/admin/", status: "active" },
  { name: "prometheus", logo: "icons/prometheus.svg", category: "observability", ip: "192.168.1.11", port: 9090, ipUrl: "http://192.168.1.11:9090", domain: "prometheus.lan", domainUrl: "http://prometheus.lan", status: "active" },
  { name: "grafana dashboards", logo: "icons/grafana.svg", category: "observability", ip: "192.168.1.11", port: 3000, ipUrl: "http://192.168.1.11:3000", domain: "grafana.lan", domainUrl: "http://grafana.lan", status: "active" },
  { name: "loki log engine", logo: "icons/loki.svg", category: "observability", ip: "192.168.1.11", port: 3100, ipUrl: "http://192.168.1.11:3100", domain: "loki.lan", domainUrl: "http://loki.lan", status: "active" },
  { name: "uptime kuma", logo: "icons/uptime-kuma.svg", category: "observability", ip: "192.168.1.7", port: 3001, ipUrl: "http://192.168.1.7:3001", domain: "uptime.lan", domainUrl: "http://uptime.lan", status: "active" },
  { name: "scrutiny s.m.a.r.t.", logo: "icons/scrutiny.svg", category: "observability", ip: "192.168.1.18", port: 8080, ipUrl: "http://192.168.1.18:8080", domain: "scrutiny.lan", domainUrl: "http://scrutiny.lan", status: "active" },
  { name: "crowdsec lapi", logo: "icons/crowdsec.svg", category: "security", ip: "192.168.1.9", port: 8080, ipUrl: "http://192.168.1.9:8080", domain: "crowdsec.lan", domainUrl: "http://crowdsec.lan", status: "active" },
  { name: "immich photos", logo: "icons/immich.svg", category: "storage & media", ip: "192.168.1.15", port: 2283, ipUrl: "http://192.168.1.15:2283", domain: "immich.lan", domainUrl: "http://immich.lan", status: "active" },
  { name: "nextcloud hub", logo: "icons/nextcloud.svg", category: "storage & media", ip: "192.168.1.8", port: 80, ipUrl: "http://192.168.1.8", domain: "nextcloud.lan", domainUrl: "http://nextcloud.lan", status: "active" },
  { name: "jellyfin media", logo: "icons/jellyfin.svg", category: "storage & media", ip: "192.168.1.21", port: 8096, ipUrl: "http://192.168.1.21:8096", domain: "jellyfin.lan", domainUrl: "http://jellyfin.lan", status: "active" },
  { name: "radarr movies", logo: "icons/radarr.svg", category: "storage & media", ip: "192.168.1.21", port: 7878, ipUrl: "http://192.168.1.21:7878", domain: "radarr.lan", domainUrl: "http://radarr.lan", status: "active" },
  { name: "sonarr tv", logo: "icons/sonarr.svg", category: "storage & media", ip: "192.168.1.21", port: 8989, ipUrl: "http://192.168.1.21:8989", domain: "sonarr.lan", domainUrl: "http://sonarr.lan", status: "active" },
  { name: "prowlarr indexers", logo: "icons/prowlarr.svg", category: "storage & media", ip: "192.168.1.21", port: 9696, ipUrl: "http://192.168.1.21:9696", domain: "prowlarr.lan", domainUrl: "http://prowlarr.lan", status: "active" },
  { name: "bazarr subtitles", logo: "icons/bazarr.svg", category: "storage & media", ip: "192.168.1.21", port: 6767, ipUrl: "http://192.168.1.21:6767", domain: "bazarr.lan", domainUrl: "http://bazarr.lan", status: "active" },
  { name: "qbittorrent", logo: "icons/qbittorrent.svg", category: "storage & media", ip: "192.168.1.21", port: 8080, ipUrl: "http://192.168.1.21:8080", domain: "qbittorrent.lan", domainUrl: "http://qbittorrent.lan", status: "active" },
  { name: "home assistant", logo: "icons/homeassistant.svg", category: "automation", ip: "192.168.1.10", port: 8123, ipUrl: "http://192.168.1.10:8123", domain: "ha.lan", domainUrl: "http://ha.lan", status: "active" },
  { name: "n8n automation", logo: "icons/n8n.svg", category: "automation", ip: "192.168.1.13", port: 5678, ipUrl: "http://192.168.1.13:5678", domain: "n8n.lan", domainUrl: "http://n8n.lan", status: "active" },
  { name: "changedetection", logo: "icons/changedetection.svg", category: "automation", ip: "192.168.1.24", port: 5000, ipUrl: "http://192.168.1.24:5000", domain: "changedetection.lan", domainUrl: "http://changedetection.lan", status: "active" },
  { name: "gitea forge", logo: "icons/gitea.svg", category: "devops", ip: "192.168.1.17", port: 3000, ipUrl: "http://192.168.1.17:3000", domain: "gitea.lan", domainUrl: "http://gitea.lan", status: "active" },
  { name: "woodpecker ci", logo: "icons/woodpecker.svg", category: "devops", ip: "192.168.1.14", port: 8000, ipUrl: "http://192.168.1.14:8000", domain: "woodpecker.lan", domainUrl: "http://woodpecker.lan", status: "active" },
  { name: "vaultwarden", logo: "icons/vaultwarden.svg", category: "productivity", ip: "192.168.1.16", port: 8080, ipUrl: "http://192.168.1.16:8080", domain: "vaultwarden.lan", domainUrl: "http://vaultwarden.lan", status: "active" },
  { name: "trilium notes", logo: "icons/trilium.svg", category: "productivity", ip: "192.168.1.19", port: 8080, ipUrl: "http://192.168.1.19:8080", domain: "trilium.lan", domainUrl: "http://trilium.lan", status: "active" },
  { name: "actual budget", logo: "icons/actualbudget.svg", category: "productivity", ip: "192.168.1.22", port: 5006, ipUrl: "http://192.168.1.22:5006", domain: "actualbudget.lan", domainUrl: "http://actualbudget.lan", status: "active" },
  { name: "it-tools", logo: "icons/it-tools.svg", category: "utilities", ip: "192.168.1.12", port: 80, ipUrl: "http://192.168.1.12", domain: "it-tools.lan", domainUrl: "http://it-tools.lan", status: "active" },
  { name: "opnsense gateway", logo: "icons/opnsense.svg", category: "virtual machines", ip: "192.168.1.132", port: 8443, ipUrl: "https://192.168.1.132:8443", domain: "opnsense.lan", domainUrl: "https://opnsense.lan", status: "active" },
  { name: "alpine server", logo: "icons/alpine.svg", category: "virtual machines", ip: "192.168.1.202", port: 22, ipUrl: "http://192.168.1.202:22", domain: "alpine.lan", domainUrl: "http://alpine.lan", status: "active" }
];
