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
    role: 'Primary virtualization host, OPNsense firewall, Windows Server Active Directory, Ollama GPU LLM & core LXCs',
    cpu: 'Intel Core i3-10100F (4 Cores / 8 Threads @ 4.30 GHz Turbo)',
    gpu: 'NVIDIA GeForce GTX 1050 Ti (4GB VRAM · PCIe Passthrough to Ollama / ML Workbench & Frigate NVR)',
    ram: '8,192 MB DDR4 (Single Channel)',
    storage: '512 GB SSD (Single Tier Local Storage)',
    psu: 'Coldex 350W Pure Sine Wave Power Supply',
    os: 'Proxmox VE 9.2 (Linux 7.0 pve kernel)',
    ip: '192.168.1.132 (OPNsense: 192.168.1.132:8443)',
    status: 'OPERATIONAL',
    workloads: [
      'VM 200: OPNsense Core Firewall & Suricata IDS/IPS',
      'VM 201: Windows Server 2025 Datacenter (AD DS / GPO)',
      'CT 115: Ollama GPU Inference (Qwen2.5-Coder / DeepSeek-R1)',
      'CT 100: Nginx Proxy Manager (SSL Termination & Ingress)',
      'CT 101: Vaultwarden Zero-Knowledge Password Vault',
      'CT 103: Immich High-Res Backup & Facial Recognition',
      'CT 104: Nextcloud Hub (File Sync & Collaboration)',
      'CT 105: FileBrowser Quantum Storage Explorer',
      'CT 106: Home Assistant Core Automation Engine',
      'CT 107: n8n Workflow Automation Engine',
      'CT 108: Authelia Single Sign-On & WebAuthn 2FA',
      'CT 109: Jellyfin Media Server (Hardware Transcoding)'
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
    role: 'ARM64 development hypervisor, telemetry stack, Tempo distributed tracing, Git repository, and ELO AI autonomous control plane',
    cpu: 'Apple M1 (8 Cores: 4 Performance Firestorm + 4 Efficiency Icestorm, 16-Core NPU)',
    ram: '8,192 MB Unified Memory (4,096 MB dedicated to UTM Proxmox ARM64 VM)',
    storage: 'Apple APFS NVMe SSD Storage Pool',
    os: 'Proxmox VE on ARM via UTM (QEMU Apple Hypervisor.framework)',
    ip: '192.168.64.14',
    status: 'OPERATIONAL',
    workloads: [
      'ELO Autonomous AI Orchestration Daemon (FastAPI)',
      'CT 107: Monitoring Suite (Grafana / Prometheus TSDB / Loki)',
      'CT 118: Grafana Tempo Distributed Tracing Engine (OTLP)',
      'CT 109: Gitea Self-Hosted Git Forge & Review System',
      'CT 110: Woodpecker CI/CD Automated Build Engine',
      'CT 101: Actual Budget Local Finance Server',
      'CT 102: Trilium Hierarchical Knowledge Notes',
      'CT 103: ChangeDetection IO Real-Time Web Monitor'
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
