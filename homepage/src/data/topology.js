export const networkTopology = {
  vlans: [
    {
      id: 10,
      name: 'Management & Primary Hypervisor',
      subnet: '10.0.10.0/24',
      gateway: '10.0.10.1',
      description: 'Proxmox primary hypervisor host, ARM64 hypervisor, OPNsense gateway, and Pi-hole DNS resolver.',
      color: '#e67e22',
      devices: [
        { name: 'proxmox (Node 1)', ip: '10.0.10.10', role: 'Intel i3-10100F · GTX 1050 Ti · 8GB RAM · 512GB SSD' },
        { name: 'proxmox2 (Node 3 - ARM64)', ip: '10.0.10.12', role: 'Apple M1 (8-Core) · 4GB Allocated VM · APFS NVMe' },
        { name: 'openmediavault (Node 2 - NAS)', ip: '10.0.10.15', role: 'Intel Celeron N2830 · 2GB RAM · 500GB HDD (SMB/NFS)' },
        { name: 'OPNsense Firewall & Gateway', ip: '10.0.10.1', role: 'Core Routing & Security Engine' },
        { name: 'Pi-hole DNS Sinkhole', ip: '10.0.10.5', role: 'Primary DNS & Ad-blocker' }
      ]
    },
    {
      id: 20,
      name: 'Smart Home, IoT & Surveillance',
      subnet: '10.0.20.0/24',
      gateway: '10.0.20.1',
      description: 'Isolated subnet for ESP32 edge sensor nodes, Zigbee coordinators, Home Assistant, and Frigate NVR.',
      color: '#2ecc71',
      devices: [
        { name: 'Home Assistant Core', ip: '10.0.20.10', role: 'Home Automation & IoT Engine' },
        { name: 'Frigate NVR (GTX 1050 Ti NVENC)', ip: '10.0.20.14', role: 'GPU-Accelerated Object Detection' },
        { name: 'ESP32 Edge Microcontrollers', ip: '10.0.20.50-58', role: 'Environmental & Presence Sensors' },
        { name: 'Zigbee2MQTT Gateway', ip: '10.0.20.20', role: 'Coordinator for Wireless Sensors' }
      ]
    },
    {
      id: 30,
      name: 'Application Workloads & Storage',
      subnet: '10.0.30.0/24',
      gateway: '10.0.30.1',
      description: 'Docker container workloads, media streaming stack, OpenMediaVault SMB/NFS storage shares, and monitoring.',
      color: '#9b59b6',
      devices: [
        { name: 'Docker Services Engine', ip: '10.0.30.20', role: 'FastAPI, n8n, Gitea, Woodpecker CI' },
        { name: 'Media Automation Stack', ip: '10.0.30.21', role: 'Jellyfin, Sonarr, Radarr, Prowlarr' },
        { name: 'OMV Network Storage Pool', ip: '10.0.30.30', role: '500GB HDD Local Network Share' },
        { name: 'Prometheus & Grafana Hub', ip: '10.0.30.40', role: 'Metrics Scraping & Log Aggregation' }
      ]
    },
    {
      id: 40,
      name: 'Ingress & Zero-Trust Perimeter',
      subnet: '10.0.40.0/24',
      gateway: '10.0.40.1',
      description: 'Reverse proxies terminating SSL certificates, Authelia 2FA gatekeeper, and Cloudflare/Tailscale tunnels.',
      color: '#e74c3c',
      devices: [
        { name: 'Nginx Proxy Manager', ip: '10.0.40.10', role: 'Let\'s Encrypt SSL & Reverse Proxy' },
        { name: 'Authelia Forward Auth Gateway', ip: '10.0.40.12', role: 'FIDO2 / TOTP 2FA Authentication' },
        { name: 'Tailscale / Cloudflare Tunnel', ip: '10.0.40.15', role: 'Encrypted Peer-to-Peer Mesh Ingress' }
      ]
    }
  ],
  overlayMesh: {
    name: 'Tailscale & NetBird Mesh Network',
    range: '100.64.0.0/10',
    protocol: 'WireGuard Kernel Module',
    features: [
      'Multi-node point-to-point WireGuard mesh',
      'Encrypted inter-hypervisor replication',
      'Zero-configuration NAT traversal',
      'Unified subnet routing to Proxmox and OMV'
    ]
  }
};
