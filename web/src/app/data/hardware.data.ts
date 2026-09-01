export interface HardwareNode {
  id: string;
  name: string;
  machine: string;
  role: string;
  cpu: string;
  gpu?: string;
  ram: string;
  storage: string;
  psu?: string;
  os: string;
  ip: string;
  status: 'OPERATIONAL' | 'STANDBY';
  workloads: string[];
}

export const HARDWARE_NODES: HardwareNode[] = [
  {
    id: 'node1-pve',
    name: 'Proxmox Primary (proxmox)',
    machine: 'Custom Desktop Compute Chassis',
    role: 'Primary virtualization host, OPNsense firewall, Windows Server AD, Red Hat Enterprise Linux, FreeBSD, OpenBSD, Talos Linux Kubernetes, Ollama GPU LLM, Paperless DMS & core fleet',
    cpu: 'Intel Core i3-10100F (4 Cores / 8 Threads @ 4.30 GHz Turbo)',
    gpu: 'NVIDIA GeForce GTX 1050 Ti (4GB VRAM · PCIe Passthrough to Ollama / ML Workbench & Faster-Whisper)',
    ram: '8,192 MB DDR4 (Upgrading to 12,288 MB DDR4)',
    storage: '512 GB SSD (Local LVM Thin Pool · 310 GB Available)',
    psu: 'Coldex 350W Pure Sine Wave Power Supply',
    os: 'Proxmox VE 9.2 (Linux 7.0 pve kernel)',
    ip: '192.168.1.132 (OPNsense: 192.168.1.132:8443)',
    status: 'OPERATIONAL',
    workloads: [
      'VM 200: OPNsense Core Firewall & Suricata IDS/IPS',
      'VM 201: Windows Server 2025 Datacenter (AD DS / GPO)',
      'VM 202: Red Hat Enterprise Linux 9.4 (RHEL Enterprise Workload)',
      'VM 203: FreeBSD 14.1-RELEASE (ZFS Storage & BSD Network Lab)',
      'VM 204: OpenBSD 7.5 (PF Packet Filter & Hardened Bastion)',
      'VM 205: Talos Linux 1.7 (Immutable, Hardened API-Driven Kubernetes Node)',
      'CT 100-109: Nginx Ingress, Pi-hole DNS, Tailscale, Immich AI, Nextcloud, CrowdSec, Home Assistant, n8n, Scrutiny, Media Suite',
      'CT 110-119: Ollama LLM, Open-WebUI, Paperless-ngx, MinIO S3, Transmission, Kavita, Stirling-PDF, Meilisearch, Vector, Faster-Whisper',
      'CT 120-129: SearXNG, Flowise, NetAlertX, RustDesk, Audiobookshelf, TubeArchivist, Kopia, WG-Easy, Calibre-Web, Code-Server IDE',
      'CT 130-139: pgAdmin4, CyberChef, Draw.io, Dozzle, Kiwix Wiki, RomM, EmulatorJS, HedgeDoc, Glances, Dufs',
      'CT 140-148: Gotify, Miniflux, Grocy, Paperless-AI, Chrony NTP, Linkwarden, Beszel-Agent, SNMP Collector, SearXNG-Redis',
      'CT 149-151: Proxmox Backup Server (PBS), Proxmox Datacenter Manager (PDM), Proxmox Mail Gateway (PMG)'
    ]
  },
  {
    id: 'node2-omv',
    name: 'OpenMediaVault NAS (openmediavault)',
    machine: 'ASUS X451MA Laptop Chassis',
    role: 'Centralized network attached storage (SMB/NFS), Proxmox snapshot backup target, media archive, and offline Kiwix Wikipedia mirror',
    cpu: 'Intel Celeron N2830 (2 Cores / 2 Threads @ 2.16 GHz, 2.41 GHz Burst)',
    gpu: 'Intel HD Graphics (Bay Trail Integrated)',
    ram: '2,048 MB DDR3 Low-Voltage',
    storage: '500 GB HDD (SATA II Mechanical Pool)',
    os: 'OpenMediaVault (OMV) / Debian Linux 12',
    ip: '192.168.1.135',
    status: 'OPERATIONAL',
    workloads: [
      'OpenMediaVault Core Storage Engine (ZFS / ext4)',
      'NFS & SMB Centralized Storage Shares',
      'Proxmox VE Daily Backup Repository (VZDump)',
      'Kiwix Offline Wikipedia & StackOverflow ZIM Server (:8085)',
      'Immich Photo Library & Jellyfin Media Storage Pool'
    ]
  },
  {
    id: 'node3-arm',
    name: 'Proxmox ARM64 (proxmox2)',
    machine: 'Apple MacBook Air (M1, 2020)',
    role: 'ARM64 development hypervisor, telemetry stack, Tempo distributed tracing, Homepage dashboard, Gatus health, and Go/Rust microservices',
    cpu: 'Apple M1 (8 Cores: 4 Performance Firestorm + 4 Efficiency Icestorm, 16-Core NPU)',
    ram: '8,192 MB Unified Memory (4,096 MB dedicated to UTM Proxmox ARM64 VM)',
    storage: '55 GB NVMe SSD Pool (41 GB rootfs LVM Thin · 30 GB Available)',
    os: 'Proxmox VE on ARM via UTM (QEMU Apple Hypervisor.framework)',
    ip: '192.168.64.14',
    status: 'OPERATIONAL',
    workloads: [
      'CT 100-109: IT-Tools, Actual Budget, Trilium, ChangeDetection, Scrutiny, Uptime Kuma, Vaultwarden, Prometheus/Grafana, Authelia, Gitea',
      'CT 110-119: Woodpecker CI, Gatus Health, ntfy Push, Linkding, Step-CA PKI, Tailscale ARM, Beszel Telemetry, PocketBase, Homepage, Speedtest-Tracker',
      'CT 120-129: Memos, Wallos, SyncThing, Microbin, Vikunja, Blackbox Exporter, YourSpotify, Web-Check OSINT, Opengist, Flatnotes',
      'CT 130-139: Bark Server, Shiori, Whoogle, Flame, Dashy, Shlink, Pastefy, Pingvin-Share, RSS-Bridge, Playwright-Probe',
      'CT 140-148: Uptime-Probe, DNS-Bench, Excalidraw, Snagim, Whoogle-Tor, Heimdall, Proxmox Backup Server (PBS), Proxmox Datacenter Manager (PDM), Proxmox Mail Gateway (PMG)'
    ]
  },
  {
    id: 'k8s-node4',
    name: 'Kubernetes Worker (k8s-node-04)',
    machine: 'Custom ATX Compute Chassis',
    role: 'Dedicated Kubernetes cluster worker node for batch container jobs, Tetragon eBPF telemetry, and failover resilience',
    cpu: 'AMD Athlon II X2 220 (2 Cores / 2 Threads @ 2.80 GHz Regor / AM3)',
    gpu: 'NVIDIA GeForce GTS 250 (1GB GDDR3 / 256-bit Bus)',
    ram: '4,096 MB DDR3',
    storage: '80 GB HDD (SATA II / 7200 RPM local cache; persistență pe NFS)',
    psu: 'Standard ATX Power Supply Unit',
    os: 'Talos Linux / Debian Base with containerd CRI & k3s-agent',
    ip: '192.168.1.18',
    status: 'OPERATIONAL',
    workloads: [
      'k3s-agent / Talos Linux Lightweight Kubernetes Node',
      'Cilium Tetragon eBPF Kernel Runtime Security Sensor',
      'Woodpecker CI Container Runner Agent',
      'Prometheus node_exporter Telemetry Agent'
    ]
  }
];
