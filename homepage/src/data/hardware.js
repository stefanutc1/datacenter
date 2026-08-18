export const hardwareNodes = [
  {
    id: 'proxmox-01',
    name: 'proxmox',
    displayName: 'Node 1 — Primary Hypervisor',
    role: 'Compute, ML Sandbox & Home NVR',
    os: 'Proxmox VE 9.2 (Linux 7.0 pve)',
    virtualization: 'LXC Containers & QEMU VMs',
    mesh: 'Tailscale Mesh Node',
    badgeColor: '#e67e22',
    specs: {
      cpu: 'Intel Core i3-10100F (4C / 8T @ 4.30 GHz)',
      gpu: 'NVIDIA GeForce GTX 1050 Ti (4 GB VRAM)',
      ram: '8 GB DDR4',
      storage: '512 GB SSD (Single Tier Pool)',
      psu: 'Coldex 350W Pure Sine Wave'
    },
    capacityNotes: [
      '8 GB RAM is the primary host constraint, setting the ceiling for concurrent LXC/VM workloads.',
      'GTX 1050 Ti (4 GB VRAM) is shared between PyTorch/CUDA ML experimentation and Frigate NVR.',
      '512 GB SSD serves as the unified storage tier for VM disks, Frigate recordings, and container caches.'
    ],
    workloads: [
      'Development Workspace (Debian + XFCE)',
      'Machine Learning Experimentation (CUDA / PyTorch GPU-Passthrough)',
      'Backup Target for local VMs & Containers',
      'Home Surveillance (Frigate NVR with NVENC acceleration)'
    ]
  },
  {
    id: 'omv-02',
    name: 'openmediavault',
    displayName: 'Node 2 — Storage NAS',
    role: 'Centralized File Storage & Backup Repo',
    os: 'OpenMediaVault (OMV)',
    virtualization: 'Bare-Metal Appliance',
    mesh: 'Local LAN / Tailscale',
    badgeColor: '#27ae60',
    specs: {
      machine: 'ASUS X451MA Laptop',
      cpu: 'Intel Celeron N2830 (2C / 2T @ 2.16 - 2.41 GHz)',
      gpu: 'Intel HD Graphics (Bay Trail)',
      ram: '2 GB DDR3',
      storage: '500 GB HDD (SATA)',
      psu: 'Low-Power AC Adapter + Internal Battery Backup'
    },
    capacityNotes: [
      '2 GB RAM restricts host strictly to lightweight storage, NFS/SMB shares, and cron rsync jobs.',
      'Intel Celeron N2830 and 500 GB HDD optimized for power efficiency and secondary off-hypervisor backups.'
    ],
    workloads: [
      'Centralized Storage & Network Shares (SMB / NFS)',
      'Secondary Backup Destination for Proxmox snapshots'
    ]
  },
  {
    id: 'proxmox-arm-03',
    name: 'proxmox2',
    displayName: 'Node 3 — ARM64 Hypervisor',
    role: 'ARM64 Workloads, Staging & Redundancy',
    os: 'Proxmox VE on ARM (ARM64 Port in UTM)',
    virtualization: 'UTM / QEMU (Apple Hypervisor.framework)',
    mesh: 'Tailscale Mesh Node',
    badgeColor: '#9b59b6',
    specs: {
      machine: 'Apple MacBook Air (M1, 2020)',
      architecture: 'ARM64 (aarch64)',
      cpu: 'Apple M1 (8 Cores: 4 Performance + 4 Efficiency, 16-Core Neural Engine)',
      ram: '8 GB Unified Memory (4 GB dedicated to PVE VM)',
      storage: 'Apple APFS NVMe SSD Pool (High-IOPS)',
      psu: 'Fanless 24/7 Silent Operation + Battery UPS'
    },
    capacityNotes: [
      '4 GB RAM allocated to virtualized Proxmox instance (4 GB reserved for macOS host).',
      'Apple M1 provides exceptional energy efficiency, silent fanless compute, and high single-thread speeds.',
      'Runs Proxmox VE ARM64 nested inside UTM on macOS with Hypervisor.framework acceleration.'
    ],
    workloads: [
      'ARM64 Multi-Arch Container Builds & Go/Rust compilation',
      'Secondary Redundant Hypervisor (Pi-hole DNS, IoT webhooks, Health pingers)',
      'Cluster Staging & Automation Playbook Sandbox'
    ]
  }
];
