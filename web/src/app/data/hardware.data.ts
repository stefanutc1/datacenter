export interface HardwareNode {
  id: string;
  name: string;
  role: string;
  ip: string;
  os: string;
  cpu: string;
  ram: string;
  storage: string;
  status: 'ONLINE' | 'STANDBY';
  color: string;
  workloads: string[];
}

export const HARDWARE_NODES: HardwareNode[] = [
  {
    id: 'node1-pve',
    name: 'Node 1 — Primary Core (x86_64)',
    role: 'Primary Hypervisor & Security Router Host',
    ip: '192.168.1.130',
    os: 'Proxmox VE 8.2 (Debian 12 Bookworm)',
    cpu: 'Intel Core i5-6500T (4 Cores, up to 3.10 GHz)',
    ram: '8,192 MB DDR4 (Allocated: 7,808 MB)',
    storage: '512 GB NVMe SSD Pool',
    status: 'ONLINE',
    color: '#00e5ff',
    workloads: [
      'Windows Server 2025 (VM 201 · 4GB RAM)',
      'OPNsense Firewall & Router (VM 200 · 1GB RAM)',
      'Immich Photos AI (CT 103 · 896MB RAM)',
      'Jellyfin Media Suite (CT 109 · 896MB RAM)',
      'Home Assistant Core (CT 106 · 384MB RAM)',
      'n8n Automation (CT 107 · 384MB RAM)',
      'Nginx Proxy Manager (CT 100 · 112MB RAM)',
      'Authelia, Vaultwarden, Nextcloud, FileBrowser'
    ]
  },
  {
    id: 'node3-arm',
    name: 'Node 3 — Secondary Proxmox (Apple M1 ARM64)',
    role: 'ARM64 Compute Hypervisor & CI/CD Engine',
    ip: '192.168.64.1',
    os: 'Proxmox VE 8.x / UTM Virtualization Host',
    cpu: 'Apple M1 Silicon (8-Core CPU / 8-Core GPU / 16-Core Neural Engine)',
    ram: '4,096 MB Dedicated (8GB Unified)',
    storage: '256 GB Apple NVMe SSD',
    status: 'ONLINE',
    color: '#a855f7',
    workloads: [
      'Monitoring Suite: Grafana / Prom / Loki (CT 107 · 448MB)',
      'Woodpecker CI Engine (CT 110 · 192MB)',
      'Gitea Git Forge (CT 109 · 160MB)',
      'Actual Budget (CT 101 · 160MB)',
      'Trilium Knowledge Notes (CT 102 · 160MB)',
      'ChangeDetection IO (CT 103 · 160MB)',
      'ELO Autonomous AI Control Plane Engine'
    ]
  },
  {
    id: 'node2-omv',
    name: 'Node 2 — Central Storage (OMV NAS)',
    role: 'ZFS Storage Pools, NFS / SMB Media Shares',
    ip: '192.168.1.131',
    os: 'OpenMediaVault 7 (Debian 12)',
    cpu: 'Dual Core Low-Power Storage SoC',
    ram: '4,096 MB DDR3',
    storage: '500 GB SATA Storage Pool (ZFS Mirror)',
    status: 'ONLINE',
    color: '#10b981',
    workloads: [
      'NFS Shared Mounts for Immich & Jellyfin',
      'Automated Daily Proxmox Snapshot Backups',
      'SMB Public & Private Document Shares',
      'Scrutiny SMART Hard Drive Health Daemon'
    ]
  },
  {
    id: 'k8s-node4',
    name: 'Node 4 — Container Orchestration (k3s)',
    role: 'Lightweight Kubernetes Worker & GitOps Engine',
    ip: '192.168.1.140',
    os: 'Ubuntu Server 24.04 LTS (k3s v1.30)',
    cpu: 'Quad Core x86_64 Workload Node',
    ram: '4,096 MB DDR4',
    storage: '120 GB SSD System Drive',
    status: 'ONLINE',
    color: '#06b6d4',
    workloads: [
      'k3s MicroK8s Control Plane',
      'FluxCD GitOps Ingress',
      'Distributed CI Build Runner Pods',
      'Prometheus Node Exporter DaemonSet'
    ]
  }
];
