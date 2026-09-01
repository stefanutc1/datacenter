export interface HardwareNode {
  id: string;
  name: string;
  machine: string;
  role: string;
  cpu: string;
  gpu?: string;
  ram: string;
  zram?: string;
  storage: string;
  psu?: string;
  os: string;
  ip: string;
  status: 'OPERATIONAL' | 'STANDBY';
  tags: string[];
  workloads: string[];
  ballooningTable?: {
    vmid: number;
    name: string;
    os: string;
    allocatedMb: number;
    balloonMinMb: number;
    purpose: string;
  }[];
}

export const HARDWARE_NODES: HardwareNode[] = [
  {
    id: 'node1-pve',
    name: 'Proxmox Primary (pve)',
    machine: 'Custom Desktop Compute Chassis',
    role: 'Serves as the primary x86_64 virtualization hypervisor for the entire homelab. It runs the perimeter OPNsense firewall, core enterprise virtual machines with active VirtIO ballooning, and dedicated GPU-accelerated local AI inference workloads.',
    cpu: 'Intel Core i3-10100F (4 Cores / 8 Threads @ 4.30 GHz Turbo)',
    gpu: 'NVIDIA GeForce GTX 1050 Ti (4GB VRAM · PCIe Passthrough to Ollama / ML Workbench & Faster-Whisper)',
    ram: '8,192 MB DDR4 (Upgrading to 12,288 MB DDR4)',
    zram: '3.8 GB /dev/zram0 (lz4 compression, swappiness 60, priority 100 · Protects NVMe disk endurance)',
    storage: '512 GB SSD (Local LVM Thin Pool · 310 GB Available)',
    psu: 'Coldex 350W Pure Sine Wave Power Supply',
    os: 'Proxmox VE 9.2 (Linux 7.0 pve kernel · zram-tools enabled)',
    ip: '192.168.1.132 (OPNsense: 192.168.1.134:8443)',
    status: 'OPERATIONAL',
    tags: ['Primary Hypervisor', 'x86_64 Bare-Metal', 'ZRAM lz4 (3.8GB)', 'PCIe GPU Passthrough', 'VirtIO Ballooning', 'Enterprise VMs'],
    ballooningTable: [
      { vmid: 200, name: 'opnsense', os: 'Hardened FreeBSD 14', allocatedMb: 2048, balloonMinMb: 1024, purpose: 'Core Perimeter Firewall & Suricata IDS/IPS' },
      { vmid: 201, name: 'windows', os: 'Windows Server 2025', allocatedMb: 4096, balloonMinMb: 2048, purpose: 'Active Directory DS, GPO & GTX 1050 Ti PCIe Passthrough' },
      { vmid: 202, name: 'rhel', os: 'RHEL 9.8 Enterprise', allocatedMb: 2048, balloonMinMb: 1024, purpose: 'SELinux Enforcing, Enterprise Services & Podman Engine' },
      { vmid: 203, name: 'freebsd', os: 'FreeBSD 15.1-RELEASE', allocatedMb: 1536, balloonMinMb: 768, purpose: 'OpenZFS Storage Pool & BSD Jails Lab' },
      { vmid: 204, name: 'openbsd', os: 'OpenBSD 7.9 Bastion', allocatedMb: 1536, balloonMinMb: 768, purpose: 'Hardened Jump Host, Packet Filter PF & unveil/pledge' },
      { vmid: 205, name: 'talos', os: 'Talos Linux 1.7', allocatedMb: 2048, balloonMinMb: 1024, purpose: 'Immutable API-Driven Kubernetes Node & Cilium CNI' }
    ],
    workloads: [
      'VM 200: OPNsense Core Firewall (2048 MB / Balloon: 1024 MB)',
      'VM 201: Windows Server 2025 Datacenter (4096 MB / Balloon: 2048 MB · GPU Passthrough)',
      'VM 202: Red Hat Enterprise Linux 9.8 (2048 MB / Balloon: 1024 MB)',
      'VM 203: FreeBSD 15.1-RELEASE (1536 MB / Balloon: 768 MB)',
      'VM 204: OpenBSD 7.9 (1536 MB / Balloon: 768 MB)',
      'VM 205: Talos Linux 1.7 (2048 MB / Balloon: 1024 MB)',
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
    role: 'Provides centralized network-attached storage using resilient ZFS mirror pools. It hosts high-capacity SMB and NFS file shares, stores daily hypervisor snapshot backups, and serves offline knowledge archives.',
    cpu: 'Intel Celeron N2830 (2 Cores / 2 Threads @ 2.16 GHz, 2.41 GHz Burst)',
    gpu: 'Intel HD Graphics (Bay Trail Integrated)',
    ram: '2,048 MB DDR3 Low-Voltage',
    storage: '500 GB HDD (SATA II Mechanical Pool)',
    os: 'OpenMediaVault (OMV) / Debian Linux 12',
    ip: '192.168.1.135',
    status: 'OPERATIONAL',
    tags: ['ZFS Storage Pool', 'Centralized NAS', 'NFS / SMB Shares', 'Proxmox VZDump Target', 'Offline Wikipedia'],
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
    name: 'Proxmox ARM64 (pve)',
    machine: 'Apple MacBook Air (M1, 2020)',
    role: 'Acts as an energy-efficient ARM64 development and observability hypervisor. It runs full-stack telemetry pipelines, continuous integration runners, private identity authorities, and lightweight microservices.',
    cpu: 'Apple M1 (8 Cores: 4 Performance Firestorm + 4 Efficiency Icestorm, 16-Core NPU)',
    ram: '8,192 MB Unified Memory (4,096 MB dedicated to UTM Proxmox ARM64 VM)',
    zram: '1.9 GB /dev/zram0 (lz4 compression, swappiness 20, priority 100 · High-speed memory compression)',
    storage: '55 GB NVMe SSD Pool (41 GB rootfs LVM Thin · 30 GB Available)',
    os: 'Proxmox VE on ARM via UTM (QEMU Apple Hypervisor.framework · zram-tools enabled)',
    ip: '192.168.64.14',
    status: 'OPERATIONAL',
    tags: ['Apple Silicon ARM64', 'High Efficiency', 'ZRAM lz4 (1.9GB)', 'LGTM Observability', 'Gitea & Woodpecker CI', 'RenovateBot GitOps'],
    workloads: [
      'CT 100-109: IT-Tools, Actual Budget, Trilium, ChangeDetection, Scrutiny, Uptime Kuma, Vaultwarden, Prometheus/Grafana, Authelia, Gitea',
      'CT 110-119: Woodpecker CI, Gatus Health, ntfy Push, Linkding, Step-CA PKI, Tailscale ARM, Beszel Telemetry, PocketBase, Homepage, Speedtest-Tracker',
      'CT 120-129: Memos, Wallos, SyncThing, Microbin, Vikunja, Blackbox Exporter, YourSpotify, Web-Check OSINT, Opengist, Flatnotes',
      'CT 130-139: Bark Server, Shiori, Whoogle, Flame, Dashy, Shlink, Pastefy, Pingvin-Share, RSS-Bridge, Playwright-Probe',
      'CT 140-149: Uptime-Probe, DNS-Bench, Excalidraw, Snagim, Whoogle-Tor, Heimdall, PBS, PDM, PMG, RenovateBot GitOps Engine'
    ]
  },
  {
    id: 'kubernetes-node',
    name: 'Kubernetes Worker (kubernetes)',
    machine: 'Custom ATX Compute Chassis',
    role: 'Operates as a dedicated bare-metal Kubernetes worker node for batch jobs and container execution. It runs kernel-level eBPF security sensors and continuous telemetry agents to maintain cluster resilience.',
    cpu: 'AMD Athlon II X2 220 (2 Cores / 2 Threads @ 2.80 GHz Regor / AM3)',
    gpu: 'NVIDIA GeForce GTS 250 (1GB GDDR3 / 256-bit Bus)',
    ram: '4,096 MB DDR3',
    storage: '80 GB HDD (SATA II / 7200 RPM local cache; persistență pe NFS)',
    psu: 'Standard ATX Power Supply Unit',
    os: 'Talos Linux / Debian Base with containerd CRI & k3s-agent',
    ip: '192.168.1.18',
    status: 'OPERATIONAL',
    tags: ['Kubernetes Worker', 'Talos Linux / k3s', 'eBPF Security', 'Cilium Tetragon', 'Batch Workloads'],
    workloads: [
      'k3s-agent / Talos Linux Lightweight Kubernetes Node',
      'Cilium Tetragon eBPF Kernel Runtime Security Sensor',
      'Woodpecker CI Container Runner Agent',
      'Prometheus node_exporter Telemetry Agent'
    ]
  }
];
