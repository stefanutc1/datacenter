export interface TopologyNode {
  id: string;
  name: string;
  sublabel: string;
  ip: string;
  port?: number;
  category: 'compute' | 'network' | 'security' | 'services' | 'elo' | 'storage' | 'edge';
  tier: number;
  status: 'OPERATIONAL' | 'STANDBY' | 'MAINTENANCE';
  x: number;
  y: number;
  z: number;
  color: string;
  icon?: string;
  hardware?: {
    node: string;
    ram: string;
    storage: string;
  };
  role: string;
  connections: string[];
}

export interface TopologyLink {
  from: string;
  to: string;
  protocol?: string;
  color: string;
}

export const TOPOLOGY_NODES: TopologyNode[] = [
  // TIER 0: WAN / EDGE GATEWAY
  {
    id: 'wan-gw',
    name: 'WAN Ingress',
    sublabel: 'Fiber Optical ONT',
    ip: '192.168.1.1',
    category: 'network',
    tier: 0,
    status: 'OPERATIONAL',
    x: 0,
    y: -220,
    z: -180,
    color: '#00e5ff',
    icon: 'opnsense',
    role: 'Primary Gigabit WAN Uplink and external boundary',
    connections: ['opnsense-gw']
  },

  // TIER 1: PERIMETER SECURITY GATEWAY
  {
    id: 'opnsense-gw',
    name: 'OPNsense Firewall',
    sublabel: 'VM 200 · Hardened FreeBSD',
    ip: '192.168.1.132',
    port: 8443,
    category: 'security',
    tier: 1,
    status: 'OPERATIONAL',
    x: 0,
    y: -140,
    z: -120,
    color: '#f59e0b',
    icon: 'opnsense',
    hardware: { node: 'Node 1 (x86_64)', ram: '1,024 MB', storage: '32 GB ZFS' },
    role: 'Stateful firewall, Suricata IDS/IPS, WireGuard site-to-site & VLAN routing',
    connections: ['node1-pve', 'node3-arm', 'node2-omv', 'k8s-node4', 'npm-ingress', 'wireguard-mesh', 'wazuh-siem']
  },

  // TIER 2: PRIMARY COMPUTE HYPERVISORS
  {
    id: 'node1-pve',
    name: 'Proxmox Core (x86_64)',
    sublabel: 'Node 1 · Core Hypervisor',
    ip: '192.168.1.130',
    port: 8006,
    category: 'compute',
    tier: 2,
    status: 'OPERATIONAL',
    x: -160,
    y: -50,
    z: -40,
    color: '#38bdf8',
    icon: 'proxmox',
    hardware: { node: 'Intel Core i5-6500T', ram: '8,192 MB DDR4', storage: '512 GB SSD' },
    role: 'Primary virtualization host for core services, OPNsense and Windows Server 2025',
    connections: ['win-server', 'npm-ingress', 'immich-core', 'jellyfin-media', 'homeassistant-core', 'n8n-auto', 'vaultwarden-core']
  },
  {
    id: 'node3-arm',
    name: 'Proxmox ARM64 (Apple M1)',
    sublabel: 'Node 3 · Secondary Hypervisor',
    ip: '192.168.64.1',
    port: 8006,
    category: 'compute',
    tier: 2,
    status: 'OPERATIONAL',
    x: 160,
    y: -50,
    z: -40,
    color: '#a855f7',
    icon: 'utm',
    hardware: { node: 'Apple M1 (8 Core GPU)', ram: '4,096 MB Dedicated', storage: '256 GB NVMe' },
    role: 'Secondary ARM64 hypervisor hosting CI/CD, Git, telemetry and utility LXCs',
    connections: ['gitea-forge', 'woodpecker-ci', 'grafana-dash', 'prometheus-tsdb', 'trilium-notes', 'actualbudget-app']
  },
  {
    id: 'node2-omv',
    name: 'OpenMediaVault NAS',
    sublabel: 'Node 2 · Central Storage',
    ip: '192.168.1.131',
    port: 80,
    category: 'storage',
    tier: 2,
    status: 'OPERATIONAL',
    x: -240,
    y: 40,
    z: 20,
    color: '#10b981',
    icon: 'filebrowser',
    hardware: { node: 'Node 2 (OMV 7)', ram: '4,096 MB', storage: '500 GB SATA Pool' },
    role: 'NFS & SMB network storage pools, automated ZFS snapshots and media repository',
    connections: ['immich-core', 'jellyfin-media', 'scrutiny-smart']
  },
  {
    id: 'k8s-node4',
    name: 'k3s Cluster Control',
    sublabel: 'Node 4 · MicroK8s Engine',
    ip: '192.168.1.140',
    port: 6443,
    category: 'compute',
    tier: 2,
    status: 'OPERATIONAL',
    x: 240,
    y: 40,
    z: 20,
    color: '#06b6d4',
    icon: 'ubuntu',
    hardware: { node: 'Node 4 (k3s Node)', ram: '4,096 MB', storage: '120 GB SSD' },
    role: 'Lightweight Kubernetes cluster running containerized microservices and ingress',
    connections: ['woodpecker-ci', 'prometheus-tsdb']
  },

  // TIER 3: INGRESS & IDENTITY
  {
    id: 'npm-ingress',
    name: 'Nginx Proxy Manager',
    sublabel: 'CT 100 · Reverse Proxy',
    ip: '192.168.1.100',
    port: 81,
    category: 'network',
    tier: 3,
    status: 'OPERATIONAL',
    x: -80,
    y: 40,
    z: 40,
    color: '#00e5ff',
    icon: 'nginx-proxy-manager',
    hardware: { node: 'Node 1 (x86_64)', ram: '112 MB', storage: '4 GB' },
    role: 'SSL termination, Let’s Encrypt wildcard certificates and domain routing',
    connections: ['authelia-auth', 'vaultwarden-core', 'immich-core', 'homeassistant-core', 'nextcloud-core']
  },
  {
    id: 'authelia-auth',
    name: 'Authelia Forward Auth',
    sublabel: 'CT 108 · 2FA & SSO Gate',
    ip: '192.168.1.108',
    port: 9091,
    category: 'security',
    tier: 3,
    status: 'OPERATIONAL',
    x: 80,
    y: 40,
    z: 40,
    color: '#f59e0b',
    icon: 'authelia',
    hardware: { node: 'Node 1 (x86_64)', ram: '128 MB', storage: '4 GB' },
    role: 'Single Sign-On authentication and multi-factor forward protection for web endpoints',
    connections: ['vaultwarden-core', 'nextcloud-core', 'gitea-forge']
  },

  // TIER 4: CORE SERVICES & VIRTUAL MACHINES
  {
    id: 'win-server',
    name: 'Windows Server 2025',
    sublabel: 'VM 201 · Active Directory',
    ip: '192.168.1.201',
    category: 'compute',
    tier: 4,
    status: 'OPERATIONAL',
    x: -200,
    y: 120,
    z: 80,
    color: '#00a4ef',
    icon: 'windows',
    hardware: { node: 'Node 1 (x86_64)', ram: '4,096 MB', storage: '64 GB' },
    role: 'Windows Server 2025 enterprise directory testing, IIS and Group Policy sandbox',
    connections: ['wazuh-siem']
  },
  {
    id: 'vaultwarden-core',
    name: 'Vaultwarden',
    sublabel: 'CT 101 · Secrets Management',
    ip: '192.168.1.101',
    port: 8080,
    category: 'security',
    tier: 4,
    status: 'OPERATIONAL',
    x: -120,
    y: 130,
    z: 90,
    color: '#f59e0b',
    icon: 'vaultwarden',
    hardware: { node: 'Node 1 (x86_64)', ram: '64 MB', storage: '4 GB' },
    role: 'Bitwarden-compatible zero-knowledge password and credentials vault',
    connections: ['node2-omv']
  },
  {
    id: 'immich-core',
    name: 'Immich High-Res Backup',
    sublabel: 'CT 103 · Photo Processing',
    ip: '192.168.1.103',
    port: 2283,
    category: 'services',
    tier: 4,
    status: 'OPERATIONAL',
    x: -40,
    y: 140,
    z: 100,
    color: '#10b981',
    icon: 'immich',
    hardware: { node: 'Node 1 (x86_64)', ram: '896 MB', storage: '64 GB' },
    role: 'High-performance self-hosted photo backup, facial recognition & machine learning',
    connections: ['node2-omv']
  },
  {
    id: 'nextcloud-core',
    name: 'Nextcloud Hub',
    sublabel: 'CT 104 · File Sync & CalDAV',
    ip: '192.168.1.104',
    port: 80,
    category: 'services',
    tier: 4,
    status: 'OPERATIONAL',
    x: 40,
    y: 140,
    z: 100,
    color: '#0082c9',
    icon: 'nextcloud',
    hardware: { node: 'Node 1 (x86_64)', ram: '160 MB', storage: '32 GB' },
    role: 'Decentralized cloud collaboration, document editing, and calendars',
    connections: ['node2-omv']
  },
  {
    id: 'homeassistant-core',
    name: 'Home Assistant',
    sublabel: 'CT 106 · Automation Core',
    ip: '192.168.1.106',
    port: 8123,
    category: 'services',
    tier: 4,
    status: 'OPERATIONAL',
    x: 120,
    y: 130,
    z: 90,
    color: '#03a9f4',
    icon: 'homeassistant',
    hardware: { node: 'Node 1 (x86_64)', ram: '384 MB', storage: '16 GB' },
    role: 'Central smart home telemetry aggregator, MQTT broker and presence coordinator',
    connections: ['esp32-radar', 'esp32-irrigation', 'n8n-auto']
  },
  {
    id: 'jellyfin-media',
    name: 'Jellyfin Media Server',
    sublabel: 'CT 109 · Hardware Transcode',
    ip: '192.168.1.109',
    port: 8096,
    category: 'services',
    tier: 4,
    status: 'OPERATIONAL',
    x: 200,
    y: 120,
    z: 80,
    color: '#aa5cc3',
    icon: 'jellyfin',
    hardware: { node: 'Node 1 (x86_64)', ram: '896 MB', storage: '64 GB' },
    role: 'Local streaming server with QuickSync hardware transcoding',
    connections: ['node2-omv']
  },

  // TIER 5: AI & AUTONOMOUS CONTROL PLANE (ELO)
  {
    id: 'elo-core',
    name: 'ELO AI Autonomous Core',
    sublabel: 'FastAPI · LLM Fallback Cascade',
    ip: '192.168.64.1',
    port: 8000,
    category: 'elo',
    tier: 5,
    status: 'OPERATIONAL',
    x: 0,
    y: 200,
    z: 140,
    color: '#a855f7',
    icon: 'python',
    hardware: { node: 'Node 3 (Apple M1)', ram: '1,024 MB', storage: '10 GB' },
    role: 'Autonomous AI orchestration engine, multi-provider model fallback, and natural cluster assistant',
    connections: ['gitea-forge', 'homeassistant-core', 'wazuh-siem', 'opnsense-gw']
  },

  // TIER 6: OBSERVABILITY & SIEM
  {
    id: 'wazuh-siem',
    name: 'Wazuh XDR & SIEM',
    sublabel: 'CyberLab · Security Monitoring',
    ip: '192.168.30.10',
    port: 1514,
    category: 'security',
    tier: 6,
    status: 'OPERATIONAL',
    x: -140,
    y: 220,
    z: 160,
    color: '#f59e0b',
    icon: 'wazuh',
    hardware: { node: 'Security Subnet', ram: '2,048 MB', storage: '50 GB' },
    role: 'Host intrusion detection, log integrity verification and incident response telemetry',
    connections: ['opnsense-gw', 'win-server']
  },
  {
    id: 'grafana-dash',
    name: 'Grafana Telemetry',
    sublabel: 'CT 107 · Metrics Visualization',
    ip: '192.168.64.107',
    port: 3000,
    category: 'services',
    tier: 6,
    status: 'OPERATIONAL',
    x: 140,
    y: 220,
    z: 160,
    color: '#f97316',
    icon: 'grafana',
    hardware: { node: 'Node 3 (ARM64)', ram: '448 MB (Shared)', storage: '10 GB' },
    role: 'Unified dashboards for system CPU/RAM, network bandwidth, SMART disk health & logs',
    connections: ['prometheus-tsdb', 'scrutiny-smart']
  },
  {
    id: 'prometheus-tsdb',
    name: 'Prometheus TSDB',
    sublabel: 'Time-Series Collector',
    ip: '192.168.64.107',
    port: 9090,
    category: 'services',
    tier: 6,
    status: 'OPERATIONAL',
    x: 200,
    y: 230,
    z: 170,
    color: '#e6522c',
    icon: 'prometheus',
    hardware: { node: 'Node 3 (ARM64)', ram: 'Included in Monitoring', storage: '10 GB' },
    role: 'Time-series metrics scraping from node_exporter across all hypervisors and LXCs',
    connections: ['node1-pve', 'node3-arm', 'node2-omv']
  },

  // TIER 7: PHYSICAL EDGE & IOT SENSORS
  {
    id: 'esp32-radar',
    name: 'ESP32 mmWave Radar',
    sublabel: 'LD2410 Presence Sensor',
    ip: '192.168.50.21',
    category: 'edge',
    tier: 7,
    status: 'OPERATIONAL',
    x: -80,
    y: 290,
    z: 210,
    color: '#10b981',
    icon: 'homeassistant',
    role: 'Sub-millimeter micro-motion and human presence detection over local MQTT',
    connections: ['homeassistant-core']
  },
  {
    id: 'esp32-irrigation',
    name: 'ESP32 Solenoid Controller',
    sublabel: 'Custom Firmware Relay',
    ip: '192.168.50.22',
    category: 'edge',
    tier: 7,
    status: 'OPERATIONAL',
    x: 80,
    y: 290,
    z: 210,
    color: '#10b981',
    icon: 'homeassistant',
    role: 'Autonomous smart irrigation system with soil moisture feedback loops',
    connections: ['homeassistant-core']
  },

  // TIER 8: AUTOMATION & CI/CD
  {
    id: 'gitea-forge',
    name: 'Gitea Git Forge',
    sublabel: 'CT 109 · Self-Hosted Repos',
    ip: '192.168.64.109',
    port: 3000,
    category: 'services',
    tier: 8,
    status: 'OPERATIONAL',
    x: -60,
    y: -80,
    z: -10,
    color: '#609926',
    icon: 'gitea',
    hardware: { node: 'Node 3 (ARM64)', ram: '160 MB', storage: '16 GB' },
    role: 'Private Git repository hosting with webhooks to Woodpecker CI and ELO agents',
    connections: ['woodpecker-ci', 'elo-core']
  },
  {
    id: 'woodpecker-ci',
    name: 'Woodpecker CI',
    sublabel: 'CT 110 · Lightweight CI/CD',
    ip: '192.168.64.110',
    port: 8000,
    category: 'services',
    tier: 8,
    status: 'OPERATIONAL',
    x: 60,
    y: -80,
    z: -10,
    color: '#00e5ff',
    icon: 'woodpecker',
    hardware: { node: 'Node 3 (ARM64)', ram: '192 MB', storage: '8 GB' },
    role: 'Containerized continuous integration pipeline executing automated testing on commit',
    connections: ['k8s-node4', 'node1-pve']
  }
];

export const TOPOLOGY_LINKS: TopologyLink[] = [
  { from: 'wan-gw', to: 'opnsense-gw', protocol: 'WAN/VLAN 1', color: '#00e5ff' },
  { from: 'opnsense-gw', to: 'node1-pve', protocol: 'Trunk LACP', color: '#38bdf8' },
  { from: 'opnsense-gw', to: 'node3-arm', protocol: 'VLAN 20', color: '#a855f7' },
  { from: 'opnsense-gw', to: 'node2-omv', protocol: 'VLAN 10', color: '#10b981' },
  { from: 'opnsense-gw', to: 'k8s-node4', protocol: 'VLAN 20', color: '#06b6d4' },
  { from: 'opnsense-gw', to: 'wazuh-siem', protocol: 'SPAN / VLAN 30', color: '#f59e0b' },
  { from: 'node1-pve', to: 'npm-ingress', protocol: 'Internal Bridge', color: '#00e5ff' },
  { from: 'node1-pve', to: 'win-server', protocol: 'KVM VirtIO', color: '#00a4ef' },
  { from: 'npm-ingress', to: 'vaultwarden-core', protocol: 'HTTP Proxy', color: '#f59e0b' },
  { from: 'npm-ingress', to: 'immich-core', protocol: 'HTTP Proxy', color: '#10b981' },
  { from: 'npm-ingress', to: 'nextcloud-core', protocol: 'HTTP Proxy', color: '#0082c9' },
  { from: 'npm-ingress', to: 'homeassistant-core', protocol: 'WebSocket', color: '#03a9f4' },
  { from: 'npm-ingress', to: 'jellyfin-media', protocol: 'HTTP Stream', color: '#aa5cc3' },
  { from: 'immich-core', to: 'node2-omv', protocol: 'NFS Mount', color: '#10b981' },
  { from: 'jellyfin-media', to: 'node2-omv', protocol: 'NFS Mount', color: '#10b981' },
  { from: 'homeassistant-core', to: 'esp32-radar', protocol: 'MQTT', color: '#10b981' },
  { from: 'homeassistant-core', to: 'esp32-irrigation', protocol: 'MQTT', color: '#10b981' },
  { from: 'node3-arm', to: 'gitea-forge', protocol: 'LXC Bridge', color: '#609926' },
  { from: 'node3-arm', to: 'woodpecker-ci', protocol: 'LXC Bridge', color: '#00e5ff' },
  { from: 'node3-arm', to: 'grafana-dash', protocol: 'LXC Bridge', color: '#f97316' },
  { from: 'grafana-dash', to: 'prometheus-tsdb', protocol: 'PromQL', color: '#e6522c' },
  { from: 'prometheus-tsdb', to: 'node1-pve', protocol: 'node_exporter', color: '#38bdf8' },
  { from: 'prometheus-tsdb', to: 'node3-arm', protocol: 'node_exporter', color: '#a855f7' },
  { from: 'gitea-forge', to: 'woodpecker-ci', protocol: 'Webhook', color: '#609926' },
  { from: 'elo-core', to: 'homeassistant-core', protocol: 'REST API', color: '#a855f7' },
  { from: 'elo-core', to: 'wazuh-siem', protocol: 'REST API', color: '#f59e0b' }
];
