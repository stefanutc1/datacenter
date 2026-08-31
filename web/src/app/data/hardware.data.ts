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
    role: 'Primary virtualization host, OPNsense firewall, Windows Server AD, Ollama GPU LLM, Paperless DMS, Open-WebUI & enterprise core LXCs',
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
      'CT 110: Ollama GPU LLM Engine (Qwen2.5-Coder / DeepSeek-R1)',
      'CT 111: Open-WebUI AI ChatGPT Interface (:3080)',
      'CT 112: Paperless-ngx Document OCR & DMS (:8005)',
      'CT 113: MinIO S3 Object Storage Cluster (:9000/:9001)',
      'CT 114: Transmission BitTorrent Isolated Gateway (:9091)',
      'CT 115: Kavita Digital Book & Comic Reader (:5005)',
      'CT 116: Stirling-PDF Offline PDF Toolset (:8085)',
      'CT 117: Meilisearch Ultra-Fast Full-Text Engine (:7700)',
      'CT 118: Vector Rust Log Routing & Processing (:8686)',
      'CT 119: Faster-Whisper Speech-to-Text CUDA (:8000)',
      'CT 100: Nginx Proxy Manager (Ingress & SSL)',
      'CT 101: Pi-hole DNS Sinkhole & Local Resolver',
      'CT 102: Tailscale Primary WireGuard Mesh Node',
      'CT 104: Nextcloud Enterprise Hub & Storage',
      'CT 105: CrowdSec Collaborative Cyber Defense IPS',
      'CT 106: Home Assistant Core Automation Engine',
      'CT 130-138: SearXNG, Flowise, NetAlertX, RustDesk, Audiobookshelf, TubeArchivist, Kopia, WG-Easy, Calibre-Web',
      'CT 140-147: Code-Server IDE, pgAdmin4, CyberChef, Draw.io, Dozzle, Kiwix Wiki, RomM, EmulatorJS'
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
    storage: 'Apple APFS NVMe SSD Storage Pool',
    os: 'Proxmox VE on ARM via UTM (QEMU Apple Hypervisor.framework)',
    ip: '192.168.64.14',
    status: 'OPERATIONAL',
    workloads: [
      'CT 104: Scrutiny S.M.A.R.T. Drive Health Monitor',
      'CT 105: Uptime Kuma SLA & Service Availability Engine',
      'CT 107: Prometheus TSDB & Grafana Central Dashboards',
      'CT 120: Gatus Health & Status Engine in Go (:8080)',
      'CT 121: Ntfy.sh Private Push Notifications Hub (:8081)',
      'CT 122: Linkding Bookmark & Technical Search Manager (:9090)',
      'CT 123: Step-CA Private Automated TLS PKI Authority (:9000)',
      'CT 124: Tailscale ARM Mesh Subnet Router (192.168.64.0/24)',
      'CT 125: Beszel High-Resolution System Telemetry (1s)',
      'CT 134: Homepage Unified Homelab Command Dashboard (:3000)',
      'CT 135: Speedtest-Tracker Automated Jitter & Bandwidth Telemetry',
      'CT 136: Memos Privacy-First Fast Knowledge Capture (:5230)',
      'CT 137: Wallos Recurring Expense & Subscription Tracker (:8282)',
      'CT 138: SyncThing Peer-to-Peer Bidirectional File Synchronization',
      'CT 139: Microbin Encrypted Self-Destructing Rust Pastebin (:8089)',
      'CT 140: Vikunja Project & Task Management Platform (:3456)',
      'CT 141: Prometheus Blackbox Exporter (ICMP / TLS Expiry)',
      'CT 142: YourSpotify Private Listening History & Analytics',
      'CT 143-149: Web-Check OSINT, Opengist, Flatnotes, Bark Server, Shiori, Whoogle, Flame'
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
