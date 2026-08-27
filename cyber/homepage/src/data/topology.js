export const networkZones = [
  {
    name: 'vlan 10 — hardened prod',
    cidr: '192.168.64.0/28',
    color: '#6b9e78',
    description: 'enforces cis ubuntu benchmarks, ssh on port 2222, fail2ban ips, and promtail log streaming.',
    nodes: [
      { hostname: 'cyber-node01', ip: '192.168.64.10', role: 'hardened workload host', status: 'protected', ports: '2222 (ssh)' }
    ]
  },
  {
    name: 'vlan 20 — dmz & honeypots',
    cidr: '192.168.64.16/28',
    color: '#b8555a',
    description: 'exposed vulnerable targets with suricata span port traffic mirroring for intrusion analysis.',
    nodes: [
      { hostname: 'cyber-node02', ip: '192.168.64.20', role: 'vulnerable target / honey', status: 'monitored', ports: '80 (http), 8080' }
    ]
  },
  {
    name: 'vlan 30 — soc analytics layer',
    cidr: '192.168.64.32/28',
    color: '#c89b9e',
    description: 'secure aggregation plane for siem indexing, grafana dashboards, and automated ai hunting.',
    nodes: [
      { hostname: 'wazuh-manager', ip: '192.168.64.33', role: 'wazuh 4.8 master node', status: 'active', ports: '1514, 55000, 443' },
      { hostname: 'loki-grafana', ip: '192.168.64.34', role: 'grafana loki central', status: 'active', ports: '3000, 3100' }
    ]
  },
  {
    name: 'edge hypervisor (utm sandbox)',
    cidr: '192.168.64.0/24 (shared nat)',
    color: '#baa6a8',
    description: 'apple silicon hypervisor.framework sandboxes for offensive emulation and malware analysis.',
    nodes: [
      { hostname: 'kali-offensive', ip: '127.0.0.1:2222', role: 'offensive security sandbox', status: 'ready', ports: '2222 -> 22 (ssh)' },
      { hostname: 'win10-victim', ip: '127.0.0.1:13389', role: 'windows 10 sysmon edr', status: 'ready', ports: '13389 -> 3389 (rdp)' }
    ]
  }
];
