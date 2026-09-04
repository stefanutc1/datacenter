export interface HardwareNode {
  id: string;
  name: string;
  machine: string;
  machineRo?: string;
  role: string;
  roleRo?: string;
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
  tagsRo?: string[];
  workloads: string[];
  ballooningTable?: {
    vmid: number;
    name: string;
    os: string;
    allocatedMb: number;
    balloonMinMb: number;
    purpose: string;
    purposeRo?: string;
  }[];
}

export const HARDWARE_NODES: HardwareNode[] = [
  {
    id: 'node1-pve',
    name: 'Proxmox Primary (pve)',
    machine: 'Custom Desktop Compute Chassis',
    machineRo: 'Șasiu Desktop Compute Custom',
    role: 'Serves as the primary x86_64 virtualization hypervisor for the entire homelab. It runs the perimeter OPNsense firewall, core enterprise virtual machines with active VirtIO ballooning, and dedicated GPU-accelerated local AI inference workloads.',
    roleRo: 'Servește drept hypervisor primar de virtualizare x86_64 pentru întregul homelab. Rulează firewall-ul perimetral OPNsense, mașinile virtuale enterprise cu balonare activă VirtIO și sarcinile de inferență AI locală accelerate pe GPU.',
    cpu: 'Intel Core i3-10100F (4 Cores / 8 Threads @ 4.30 GHz Turbo)',
    gpu: 'NVIDIA GeForce GTX 1050 Ti (4GB VRAM · PCIe Passthrough to Ollama / ML Workbench & Faster-Whisper)',
    ram: '12,288 MB DDR4 (12 GB DDR4-2133)',
    zram: '6.0 GB /dev/zram0 (lz4 compression, swappiness 60, priority 100 · Protects NVMe disk endurance)',
    storage: '512 GB SSD (Local LVM Thin Pool · 310 GB Available)',
    psu: 'Coldex 350W Pure Sine Wave Power Supply',
    os: 'Proxmox VE 9.2 (Linux 7.0 pve kernel · zram-tools enabled)',
    ip: '192.168.1.132 (OPNsense: 192.168.1.134:8443)',
    status: 'OPERATIONAL',
    tags: ['Primary Hypervisor', 'x86_64 Bare-Metal', 'ZRAM lz4 (6.0GB)', 'PCIe GPU Passthrough', 'VirtIO Ballooning', 'Enterprise VMs'],
    tagsRo: ['Hypervisor Primar', 'x86_64 Bare-Metal', 'ZRAM lz4 (6.0GB)', 'GPU PCIe Passthrough', 'Balonare VirtIO', 'VM-uri Enterprise'],
    ballooningTable: [
      { 
        vmid: 200, 
        name: 'opnsense', 
        os: 'Hardened FreeBSD 14', 
        allocatedMb: 2048, 
        balloonMinMb: 1024, 
        purpose: 'Core Perimeter Firewall & Suricata IDS/IPS',
        purposeRo: 'Firewall Central Perimetral & IDS/IPS Suricata'
      },
      { 
        vmid: 201, 
        name: 'windows', 
        os: 'Windows Server 2025 Datacenter', 
        allocatedMb: 7168, 
        balloonMinMb: 4096, 
        purpose: 'Active Directory DS, GPO & GTX 1050 Ti PCIe Passthrough (Ballooning: 4096 MB - 7168 MB)',
        purposeRo: 'Active Directory DS, GPO & GPU Passthrough GTX 1050 Ti (Balonare: 4096 MB - 7168 MB)'
      },
      { 
        vmid: 202, 
        name: 'rhel', 
        os: 'RHEL 9.8 Enterprise', 
        allocatedMb: 2048, 
        balloonMinMb: 1024, 
        purpose: 'SELinux Enforcing, Enterprise Services & Podman Engine (Ballooning: 1 GB - 2 GB)',
        purposeRo: 'SELinux Enforcing, Servicii Enterprise & Podman Engine (Balonare: 1 GB - 2 GB)'
      },
      { 
        vmid: 203, 
        name: 'freebsd', 
        os: 'FreeBSD 15.1-RELEASE', 
        allocatedMb: 1024, 
        balloonMinMb: 512, 
        purpose: 'OpenZFS Storage Pool & BSD Jails Lab (Ballooning: 512 MB - 1 GB)',
        purposeRo: 'Pool Stocare OpenZFS & Laborator BSD Jails (Balonare: 512 MB - 1 GB)'
      },
      { 
        vmid: 204, 
        name: 'openbsd', 
        os: 'OpenBSD 7.9 Bastion', 
        allocatedMb: 1024, 
        balloonMinMb: 512, 
        purpose: 'Hardened Jump Host, Packet Filter PF & unveil/pledge (Ballooning: 512 MB - 1 GB)',
        purposeRo: 'Jump Host Bastion Securizat, Packet Filter PF & unveil/pledge (Balonare: 512 MB - 1 GB)'
      },
      { 
        vmid: 205, 
        name: 'talos', 
        os: 'Talos Linux 1.7', 
        allocatedMb: 2048, 
        balloonMinMb: 1024, 
        purpose: 'Immutable API-Driven Kubernetes Node & Cilium CNI (Ballooning: 1 GB - 2 GB)',
        purposeRo: 'Nod Kubernetes Imutabil Gestionat prin API & Cilium CNI (Balonare: 1 GB - 2 GB)'
      },
      { 
        vmid: 206, 
        name: 'macos', 
        os: 'macOS Monterey 12.7', 
        allocatedMb: 7168, 
        balloonMinMb: 2048, 
        purpose: 'OpenCore KVM Hackintosh (Sanitized bootloader in /mac/EFI), Xcode CI/CD Build Runner & Apple GUI Testing (Ballooning: 2 GB - 7 GB)',
        purposeRo: 'OpenCore KVM Hackintosh (Bootloader anonimizat în /mac/EFI), Runner Build CI/CD Xcode & Mediu Testare Apple (Balonare: 2 GB - 7 GB)'
      },
      { 
        vmid: 207, 
        name: 'openindiana', 
        os: 'OpenIndiana Hipster 2024.10', 
        allocatedMb: 3072, 
        balloonMinMb: 1536, 
        purpose: 'illumos/Solaris Kernel, Reference Enterprise ZFS, Solaris Zones & DTrace (Ballooning: 1.5 GB - 3 GB)',
        purposeRo: 'Kernel illumos/Solaris, Pool-uri Enterprise ZFS de Referință, Zone Solaris & DTrace (Balonare: 1.5 GB - 3 GB)'
      },
      { 
        vmid: 208, 
        name: 'netbsd', 
        os: 'NetBSD 10.0', 
        allocatedMb: 512, 
        balloonMinMb: 256, 
        purpose: 'Clean Portable Unix Architecture, Rump Anykernel Prototyping & pkgsrc (Ballooning: 256 MB - 512 MB)',
        purposeRo: 'Arhitectură Unix Ultra-Portabilă, Prototipare Rump Anykernel & pkgsrc (Balonare: 256 MB - 512 MB)'
      },
      { 
        vmid: 209, 
        name: 'nixos', 
        os: 'NixOS 24.11 (Minimal)', 
        allocatedMb: 1024, 
        balloonMinMb: 512, 
        purpose: 'Minimal Declarative Linux, Flakes Reproducible Builds & Atomic Rollback Lab (Ballooning: 512 MB - 1 GB)',
        purposeRo: 'Linux Declarativ Minimal, Build-uri Reproductibile prin Flakes & Laborator Rollback Atomic (Balonare: 512 MB - 1 GB)'
      },
      { 
        vmid: 210, 
        name: 'dragonflybsd', 
        os: 'DragonFly BSD 6.4', 
        allocatedMb: 1024, 
        balloonMinMb: 512, 
        purpose: 'HAMMER2 Storage Engine, Hybrid Microkernel & Lockless Multiprocessing (Ballooning: 512 MB - 1 GB)',
        purposeRo: 'Motor de Stocare HAMMER2, Microkernel Hibrid & Procesare Concurentă Fără Blocaje (Balonare: 512 MB - 1 GB)'
      },
      { 
        vmid: 211, 
        name: 'openstack', 
        os: 'Ubuntu 24.04 LTS / Kolla OpenStack 2024.1', 
        allocatedMb: 4096, 
        balloonMinMb: 2048, 
        purpose: 'OpenStack Enterprise Private Cloud Controller (Nova, Neutron, Keystone, Glance, Horizon Dashboard)',
        purposeRo: 'Controller Cloud Privat OpenStack Enterprise (Calcul Nova, Rețele Neutron, Keystone IAM, Panou Horizon)'
      }
    ],
    workloads: [
      'VM 200: OPNsense Core Firewall (2048 MB / Balloon: 1024 MB · Suricata IDS/IPS, CrowdSec Bouncer, GeoIP Drop, DoT Quad9, Telegraf, Monit, GitOps, FRR BGP, Tailscale, NetFlow)',
      'VM 201: Windows Server 2025 Datacenter (7168 MB / Balloon: 4096 MB [4-7 GB] · GPU Passthrough)',
      'VM 202: Red Hat Enterprise Linux 9.8 (2048 MB / Balloon: 1024 MB [1-2 GB])',
      'VM 203: FreeBSD 15.1-RELEASE (1024 MB / Balloon: 512 MB [512 MB - 1 GB])',
      'VM 204: OpenBSD 7.9 (1024 MB / Balloon: 512 MB [512 MB - 1 GB])',
      'VM 205: Talos Linux 1.7 (2048 MB / Balloon: 1024 MB [1-2 GB])',
      'VM 206: macOS Monterey 12.7 (7168 MB / Balloon: 2048 MB [2-7 GB] · OpenCore KVM Hackintosh)',
      'VM 207: OpenIndiana Hipster (3072 MB / Balloon: 1536 MB [1.5-3 GB] · 50 GB NVMe · illumos ZFS & Solaris Zones)',
      'VM 208: NetBSD 10.0 (512 MB / Balloon: 256 MB [256-512 MB] · 12 GB NVMe · Rump Anykernel & pkgsrc)',
      'VM 209: NixOS 24.11 Minimal (1024 MB / Balloon: 512 MB [512 MB - 1 GB] · 22 GB NVMe · Declarative Flakes & Atomic Rollbacks)',
      'VM 210: DragonFly BSD 6.4 (1024 MB / Balloon: 512 MB [512 MB - 1 GB] · 15 GB NVMe · HAMMER2 Journaling FS & Hybrid Microkernel)',
      'VM 211: OpenStack Enterprise Cloud Controller (4096 MB / Balloon: 2048 MB · 32 GB NVMe · Nova, Neutron, Keystone, Glance, Horizon Dashboard)',
      'CT 100-109: Core Ingress & Network: Nginx Ingress, Pi-hole DNS, Tailscale, Immich AI, Nextcloud, CrowdSec, Home Assistant, n8n, Scrutiny, Media Suite',
      'CT 110-111: Ollama GPU LLM Server & Open-WebUI Assistant (CUDA GTX 1050 Ti Passthrough)',
      'CT 112: Faster-Whisper GPU Speech-to-Text Transcriber (CUDA Accelerated)',
      'CT 113: Flowise Agentic AI Workflow & LangChain Graph Engine',
      'CT 114: Paperless-AI Automated Document Analysis & DeepSeek Vision Tagging',
      'CT 115: Code-Server Web IDE (VS Code Cloud Workspace)',
      'CT 116: Proxmox Backup Server (PBS Enterprise Deduplication & Verification)',
      'CT 117: Proxmox Datacenter Manager (PDM Multi-Cluster Fleet UI)',
      'CT 118: Woodpecker CI Server & Runner on Alpine Linux backed by k0s Kubernetes Engine'
    ]
  },
  {
    id: 'node2-omv',
    name: 'OpenMediaVault NAS (openmediavault)',
    machine: 'ASUS X451MA Laptop Chassis',
    machineRo: 'Șasiu Laptop ASUS X451MA',
    role: 'Provides centralized network-attached storage using resilient ZFS mirror pools. It hosts high-capacity SMB and NFS file shares, stores daily hypervisor snapshot backups, and serves offline knowledge archives.',
    roleRo: 'Furnizează stocare centralizată atașată în rețea (NAS) folosind pool-uri redundante ZFS mirror. Găzduiește partajări SMB și NFS de mare capacitate, stochează backup-urile zilnice ale hypervisorilor și servește arhive offline de cunoștințe.',
    cpu: 'Intel Celeron N2830 (2 Cores / 2 Threads @ 2.16 GHz, 2.41 GHz Burst)',
    gpu: 'Intel HD Graphics (Bay Trail Integrated)',
    ram: '2,048 MB DDR3 Low-Voltage',
    storage: '500 GB HDD (SATA II Mechanical Pool)',
    os: 'OpenMediaVault (OMV) / Debian Linux 12',
    ip: '192.168.1.135',
    status: 'OPERATIONAL',
    tags: ['ZFS Storage Pool', 'Centralized NAS', 'NFS / SMB Shares', 'Proxmox VZDump Target', 'Offline Wikipedia'],
    tagsRo: ['Pool Stocare ZFS', 'NAS Centralizat', 'Partajări NFS / SMB', 'Țintă Backup VZDump', 'Wikipedia Offline'],
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
    machineRo: 'Apple MacBook Air (M1, 2020)',
    role: 'Acts as an energy-efficient ARM64 development and observability hypervisor. It runs full-stack telemetry pipelines, continuous integration runners, private identity authorities, and lightweight microservices.',
    roleRo: 'Funcționează ca un hypervisor ARM64 ultra-eficient din punct de vedere energetic pentru dezvoltare și observabilitate. Rulează stiva completă de telemetrie LGTM, runneri de integrare continuă, autorități private de identitate și microservicii.',
    cpu: 'Apple M1 (8 Cores: 4 Performance Firestorm + 4 Efficiency Icestorm, 16-Core NPU)',
    ram: '8,192 MB Unified Memory (4,096 MB dedicated to UTM Proxmox ARM64 VM)',
    zram: '1.9 GB /dev/zram0 (lz4 compression, swappiness 20, priority 100 · High-speed memory compression)',
    storage: '55 GB NVMe SSD Pool (41 GB rootfs LVM Thin · 30 GB Available)',
    os: 'Proxmox VE on ARM via UTM (QEMU Apple Hypervisor.framework · zram-tools enabled)',
    ip: '192.168.64.14',
    status: 'OPERATIONAL',
    tags: ['Apple Silicon ARM64', 'High Efficiency', 'ZRAM lz4 (1.9GB)', 'LGTM Observability', 'Gitea & Woodpecker CI', 'RenovateBot GitOps'],
    tagsRo: ['Apple Silicon ARM64', 'Eficiență Energetică Ridicată', 'ZRAM lz4 (1.9GB)', 'Observabilitate LGTM', 'Gitea & Woodpecker CI', 'RenovateBot GitOps'],
    workloads: [
      'CT 100-145: IT-Tools, Actual Budget, Trilium, ChangeDetection, Scrutiny, Uptime Kuma, Vaultwarden, Monitoring, Authelia, Gitea, Woodpecker, Telemetry & Heimdall',
      'CT 146-147: Proxmox Backup Server (PBS) & Proxmox Datacenter Manager (PDM)',
      'CT 148: RenovateBot On-Premise GitOps Dependency Engine',
      'CT 149-158: Transmission, Kavita, Stirling-PDF, Audiobookshelf, TubeArchivist, Calibre-Web, CyberChef, Draw.io, RomM, EmulatorJS',
      'CT 159: VS Code Server Cloud IDE ARM64',
      'CT 160-181: Paperless-ngx, MinIO S3, Meilisearch, Vector, SearXNG, NetAlertX, RustDesk, Kopia, WG-Easy, pgAdmin4, Dozzle, Kiwix, HedgeDoc, Glances, Dufs, Gotify, Miniflux, Grocy, Chrony NTP, Linkwarden, SNMP, SearXNG-Redis'
    ]
  },
  {
    id: 'kubernetes-node',
    name: 'Kubernetes Worker (kubernetes)',
    machine: 'Custom ATX Compute Chassis',
    machineRo: 'Șasiu ATX Compute Custom',
    role: 'Operates as a dedicated bare-metal Kubernetes worker node for batch jobs and container execution. It runs kernel-level eBPF security sensors and continuous telemetry agents to maintain cluster resilience.',
    roleRo: 'Funcționează ca un nod worker Kubernetes bare-metal dedicat pentru sarcini batch și execuție de containere. Rulează senzori de securitate eBPF la nivel de kernel și agenți de telemetrie continuă.',
    cpu: 'AMD Athlon II X2 220 (2 Cores / 2 Threads @ 2.80 GHz Regor / AM3)',
    gpu: 'NVIDIA GeForce GTS 250 (1GB GDDR3 / 256-bit Bus)',
    ram: '4,096 MB DDR3',
    storage: '80 GB HDD (SATA II / 7200 RPM local cache; persistență pe NFS)',
    psu: 'Standard ATX Power Supply Unit',
    os: 'Talos Linux / Debian Base with containerd CRI & k3s-agent',
    ip: '192.168.1.18',
    status: 'OPERATIONAL',
    tags: ['Kubernetes Fleet', 'ArgoCD GitOps', 'Cilium eBPF', 'Rook Ceph Storage', 'CoreDNS', 'Twingate ZTNA', 'Woodpecker CI'],
    tagsRo: ['Flotă Kubernetes', 'ArgoCD GitOps', 'Cilium eBPF', 'Stocare Rook Ceph', 'CoreDNS', 'Twingate ZTNA', 'Woodpecker CI'],
    workloads: [
      'ArgoCD Declarative Continuous Delivery & GitOps App Controller',
      'Cilium eBPF CNI with WireGuard Transparent Encryption & Hubble UI',
      'Rook Ceph Distributed Cloud-Native Block (RBD) & CephFS Storage',
      'CoreDNS In-Cluster Split-Horizon DNS & Pi-hole Resolver Forwarder',
      'Twingate Zero-Trust Remote Access Connector (P2P Mesh)',
      'Woodpecker CI Runner Agent for Automated Kubernetes Testing'
    ]
  }
];
