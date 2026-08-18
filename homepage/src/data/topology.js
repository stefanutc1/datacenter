export const networkTopology = {
  vlans: [
    {
      id: 10,
      name: 'VLAN 10 - Management & Hypervisors',
      subnet: '10.0.10.0/24',
      gateway: '10.0.10.1',
      description: 'Proxmox VE hypervisors, IPMI management, managed switch control planes, and PDU controllers.',
      color: '#3498db',
      devices: [
        { name: 'PVE-01 (Proxmox Primary)', ip: '10.0.10.10', role: 'Compute Node & NVMe Pool' },
        { name: 'PVE-02 (Proxmox Secondary)', ip: '10.0.10.11', role: 'Compute Node & High Availability' },
        { name: 'OPNsense Firewall (LAN)', ip: '10.0.10.1', role: 'Gateway & DNS' },
        { name: 'Pi-hole Primary DNS', ip: '10.0.10.5', role: 'Ad-blocking & Local DNS' }
      ]
    },
    {
      id: 20,
      name: 'VLAN 20 - Smart Home & IoT',
      subnet: '10.0.20.0/24',
      gateway: '10.0.20.1',
      description: 'Isolated subnet for ESP32 edge sensors, Zigbee gateways, Shelly relays, and IP security cameras.',
      color: '#2ecc71',
      devices: [
        { name: 'Home Assistant Core', ip: '10.0.20.10', role: 'IoT Automation Hub' },
        { name: 'Frigate NVR (Cameras)', ip: '10.0.20.15', role: 'AI Video Analysis' },
        { name: 'Zigbee2MQTT Gateway', ip: '10.0.20.20', role: 'Zigbee Coordinator' },
        { name: 'ESP32 Room Nodes (x8)', ip: '10.0.20.50-58', role: 'Climate & Presence Sensing' }
      ]
    },
    {
      id: 30,
      name: 'VLAN 30 - Application Compute & Storage',
      subnet: '10.0.30.0/24',
      gateway: '10.0.30.1',
      description: 'Dedicated Docker hosts, K3s Kubernetes cluster nodes, TrueNAS / ZFS storage pools, and databases.',
      color: '#9b59b6',
      devices: [
        { name: 'Docker Host 01 (Services)', ip: '10.0.30.20', role: 'Docker Compose Workloads' },
        { name: 'Docker Host 02 (Media)', ip: '10.0.30.21', role: 'Jellyfin & Servarr Suite' },
        { name: 'ZFS Storage Pool (NFS/SMB)', ip: '10.0.30.30', role: 'Primary 40TB Storage Pool' },
        { name: 'Prometheus & Grafana Stack', ip: '10.0.30.40', role: 'Telemetry Aggregation' }
      ]
    },
    {
      id: 40,
      name: 'VLAN 40 - Ingress & DMZ',
      subnet: '10.0.40.0/24',
      gateway: '10.0.40.1',
      description: 'Public-facing reverse proxies, Cloudflare Zero-Trust connectors, and Web Application Firewalls (CrowdSec).',
      color: '#e74c3c',
      devices: [
        { name: 'Nginx Proxy Manager', ip: '10.0.40.10', role: 'Ingress SSL Termination' },
        { name: 'Authelia SSO Gateway', ip: '10.0.40.12', role: '2FA Forward Authentication' },
        { name: 'Cloudflare Tunnel Daemon', ip: '10.0.40.15', role: 'Encrypted Zero-Trust Ingress' }
      ]
    }
  ],
  overlayMesh: {
    name: 'NetBird Zero-Trust Mesh',
    range: '100.64.0.0/10',
    protocol: 'WireGuard Kernel Module',
    features: ['Peer-to-peer routing', 'Split DNS', 'MFA endpoint posture check', 'Remote LAN routing']
  }
};
