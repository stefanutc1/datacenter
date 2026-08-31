export interface HardwareNode {
  id: string;
  name: string;
  machine: string;
  role: string;
  ip: string;
  os: string;
  cpu: string;
  gpu?: string;
  ram: string;
  storage: string;
  psu?: string;
  status: 'ONLINE' | 'STANDBY';
  color: string;
  workloads: string[];
}

export const HARDWARE_NODES: HardwareNode[] = [
  {
    id: 'node1-pve',
    name: 'Node 1 — Primary Hypervisor (proxmox)',
    machine: 'Custom Desktop Compute PC',
    role: 'Primary Hypervisor, VM Host, ML Experimentation & Surveillance',
    ip: '192.168.1.132',
    os: 'Proxmox VE 9.2 (Linux 7.0 pve kernel)',
    cpu: 'Intel Core i3-10100F (4 Cores / 8 Threads @ 4.30 GHz)',
    gpu: 'NVIDIA GeForce GTX 1050 Ti (4 GB VRAM)',
    ram: '8 GB DDR4 (7,808 MB allocated across VMs & LXCs)',
    storage: '512 GB SSD (Single Storage Tier)',
    psu: 'Coldex 350W Pure Sine Wave',
    status: 'ONLINE',
    color: '#8da3b8',
    workloads: [
      'Windows Server 2025 Datacenter (VM 201 · Active Directory & Sysmon)',
      'OPNsense Core Gateway (VM 200 · Stateful Firewall & Suricata IDS/IPS)',
      'Machine Learning & Dev Workspace (CUDA / PyTorch / GTX 1050 Ti Passthrough)',
      'Home Surveillance NVR (Frigate NVR with GPU hardware acceleration)',
      'Core LXC Fleet (Immich AI, Jellyfin, Home Assistant, n8n, NPM, Authelia)'
    ]
  },
  {
    id: 'node2-omv',
    name: 'Node 2 — Storage NAS (openmediavault)',
    machine: 'ASUS X451MA Laptop',
    role: 'Centralized File Storage (SMB/NFS) & Secondary Backup Target',
    ip: '192.168.1.135',
    os: 'OpenMediaVault (OMV) / Debian Linux',
    cpu: 'Intel Celeron N2830 (2 Cores / 2 Threads @ 2.16 GHz, burst 2.41 GHz)',
    gpu: 'Intel HD Graphics (Bay Trail)',
    ram: '2 GB DDR3 (Dedicated Storage Ceiling)',
    storage: '500 GB HDD (Central Network Storage Pool)',
    status: 'ONLINE',
    color: '#6e9e75',
    workloads: [
      'Centralized Storage & File Sharing (SMB / NFS Shares)',
      'Secondary Backup Destination (Off-host repository for Proxmox backups)',
      'Dedicated media & document storage repository for Immich & Jellyfin',
      'Scrutiny S.M.A.R.T. Drive Health Monitoring Daemon'
    ]
  },
  {
    id: 'node3-arm',
    name: 'Node 3 — ARM64 Hypervisor (proxmox2)',
    machine: 'Apple MacBook Air (M1, 2020)',
    role: 'ARM64 Workload Validation, Multi-Arch Builds & Secondary PVE',
    ip: '192.168.64.14',
    os: 'Proxmox VE on ARM (ARM64 Port) via UTM (Hypervisor.framework)',
    cpu: 'Apple M1 — 8 Cores (4 Performance + 4 Efficiency) / 16-Core Neural Engine',
    ram: '8 GB Unified LPDDR4X (4 GB dedicated to Proxmox ARM64 VM)',
    storage: 'High-speed Apple APFS NVMe SSD Pool',
    status: 'ONLINE',
    color: '#a87db8',
    workloads: [
      'ARM64 Workload Validation & Native Multi-Arch Docker/Go/Rust builds',
      'Unified Telemetry Cluster: Grafana Dashboards / Prometheus TSDB / Loki',
      'Woodpecker CI Continuous Integration Engine & Gitea Git Forge',
      'Actual Budget, Trilium Knowledge Base, ChangeDetection.io',
      'ELO Autonomous AI Control Plane Daemon (Metal MPS Acceleration)'
    ]
  },
  {
    id: 'k8s-node4',
    name: 'Node 4 — Kubernetes Worker (k8s-node-04)',
    machine: 'Custom ATX Compute Chassis',
    role: 'Bare-Metal Kubernetes Worker (k3s-agent) & Stateless Compute Offloading',
    ip: '192.168.1.18',
    os: 'Alpine Linux / Debian Base with containerd CRI',
    cpu: 'AMD Athlon II X2 220 (2 Cores / 2 Threads @ 2.80 GHz Regor / AM3)',
    gpu: 'NVIDIA GeForce GTS 250 (1 GB GDDR3, 55nm / 256-bit bus)',
    ram: '4 GB DDR3',
    storage: '80 GB HDD (SATA II / 7200 RPM local cache; NFS remote state)',
    psu: 'ATX Power Supply Unit',
    status: 'ONLINE',
    color: '#8da3b8',
    workloads: [
      'Kubernetes Cluster Worker (k3s-agent container runtime)',
      'Stateless Compute Offloading (Batch processing & worker queues)',
      'Distributed CI Build Runner Pods',
      'Multi-Node Physical Cluster Fault Tolerance & Resilience'
    ]
  }
];
