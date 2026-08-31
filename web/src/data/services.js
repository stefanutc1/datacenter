export const categories = [
  { id: 'all', name: 'All Services', icon: 'layers' },
  { id: 'ai', name: 'AI & Control', icon: 'zap' },
  { id: 'media', name: 'Media & Streaming', icon: 'film' },
  { id: 'iot', name: 'Smart Home & IoT', icon: 'cpu' },
  { id: 'security', name: 'Security & Identity', icon: 'shield-check' },
  { id: 'cloud', name: 'Storage & Cloud', icon: 'cloud' },
  { id: 'monitoring', name: 'Observability & Metrics', icon: 'activity' },
  { id: 'automation', name: 'Automation & Workflow', icon: 'git-branch' },
  { id: 'devops', name: 'CI/CD & Git', icon: 'terminal' },
  { id: 'networking', name: 'Networking & DNS', icon: 'globe' },
  { id: 'productivity', name: 'Productivity & Notes', icon: 'file-text' },
  { id: 'vms', name: 'Virtual Machines (VMs)', icon: 'cpu' }
];

export const services = [
  {
    id: 'elo-core',
    logo: 'icons/python.svg',
    name: 'ELO Control Plane',
    category: 'ai',
    ip: '192.168.1.133',
    port: 8000,
    ipUrl: 'http://192.168.1.133:8000',
    domain: 'elo.lan',
    domainUrl: 'http://elo.lan',
    internalUrl: 'http://192.168.1.133:8000',
    icon: 'zap',
    color: '#8e44ad',
    image: 'elo-core:latest',
    containerName: 'elo_core',
    status: 'online',
    ram: '512 MB',
    storage: '2 GB',
    node: 'Apple M1 (ARM64)',
    tags: ['AI Agent', 'FastAPI', 'pgvector RAG', 'ESP32 Presence', 'Automation Agents', 'Metal MPS'],
    description: 'AI control plane for Proxmox VE, OPNsense, Home Assistant, and ZFS. Features persistent pgvector memory, ESP32 room-awareness, modular automation agents, and LLM fallback routing.',
    features: [
      'Zero-Cost LLM Cascade: Gemini 2.5 Flash -> Groq LPU -> OpenRouter :free -> Local Ollama Metal MPS',
      'ESP32 mmWave / BLE presence room-awareness with contextual entity routing',
      'Automation Agents: SecOps Threat Hunter, SysAdmin Optimizer, Smart Energy, Storage Health',
      'Persistent semantic memory RAG using PostgreSQL pgvector (128-dim embeddings)'
    ],
    volumes: ['/var/log/elo:/app/logs'],
    envVars: ['PRIMARY_LLM_PROVIDER=gemini', 'FALLBACK_LLM_PROVIDER=groq', 'LOCAL_LLM_BASE_URL=http://localhost:11434'],
    composeCode: `services:
  elo-core:
    image: elo-core:latest
    container_name: elo_core
    restart: unless-stopped
    ports:
      - '8000:8000'
    environment:
      - PRIMARY_LLM_PROVIDER=gemini
      - FALLBACK_LLM_PROVIDER=groq
      - LOCAL_LLM_BASE_URL=http://localhost:11434`,
    wikiMarkdown: `### ELO AI Control Plane Architecture
ELO runs on the Apple Silicon M1 node (192.168.1.133) providing autonomous infrastructure orchestration with biometric macOS Gatekeeper challenge authorization.`
  },
  {
    id: 'antigravity-mcp',
    logo: 'icons/python.svg',
    name: 'Antigravity Homelab MCP Server',
    category: 'ai',
    ip: '192.168.1.133',
    port: 8000,
    ipUrl: 'http://192.168.1.133:8000/docs',
    domain: 'mcp.lan',
    domainUrl: 'http://mcp.lan',
    internalUrl: 'http://192.168.1.133:8000',
    icon: 'cpu',
    color: '#3498db',
    image: 'antigravity-mcp:latest',
    containerName: 'antigravity_mcp',
    status: 'online',
    ram: '256 MB',
    storage: '1 GB',
    node: 'Apple M1 (ARM64)',
    tags: ['Model Context Protocol', 'AI Tools', 'JSON-RPC', 'Proxmox API', 'OPNsense API'],
    description: 'Model Context Protocol (MCP) server providing live homelab infrastructure inspection, container telemetry, and command execution tools to AI assistants.',
    features: [
      'Full MCP 2024-11-05 standard implementation over stdio and HTTP JSON-RPC',
      'Live tool execution for Proxmox status, OPNsense IP blocks, Home Assistant automations',
      'Native integration with Antigravity, Claude Desktop, and Cursor'
    ],
    volumes: ['/ai:/app/ai'],
    envVars: ['MCP_TRANSPORT=stdio'],
    composeCode: `services:
  antigravity-mcp:
    build: ./ai
    container_name: antigravity_mcp
    restart: unless-stopped`,
    wikiMarkdown: `### Antigravity MCP Server
Located in ai/, connects AI coding assistants directly to homelab runtime telemetry.`
  },
  {
    id: 'proxmox-hypervisor',
    logo: 'icons/proxmox.svg',
    name: 'Proxmox VE Hypervisor',
    category: 'networking',
    ip: '192.168.1.132',
    port: 8006,
    ipUrl: 'https://192.168.1.132:8006',
    domain: 'pve.lan',
    domainUrl: 'https://pve.lan',
    internalUrl: 'https://192.168.1.132:8006',
    icon: 'server',
    color: '#e67e22',
    image: 'bare-metal:proxmox-ve-9.2',
    containerName: 'pve_host',
    status: 'online',
    ram: '8 GB',
    storage: '512 GB SSD',
    node: 'Node 1 (x86_64)',
    tags: ['Hypervisor', 'KVM', 'LXC', 'Debian 12', 'ZFS'],
    description: 'Primary bare-metal hypervisor node hosting all homelab virtual machines, LXC microservices, Frigate NVR, and ML experimentation workloads.',
    features: [
      'Intel Core i3-10100F (4C / 8T) with NVIDIA GTX 1050 Ti GPU passthrough',
      'LXC container density and QEMU hardware-assisted virtualization',
      'Integrated firewall, network bridges, and local-lvm storage tier'
    ],
    volumes: ['/etc/pve:/etc/pve'],
    envVars: [],
    composeCode: `# Bare-metal Proxmox VE 9.2 Host: 192.168.1.132:8006`,
    wikiMarkdown: `### Proxmox VE Node 1
Primary compute node at 192.168.1.132.`
  },
  {
    id: 'openmediavault-nas',
    logo: 'icons/nextcloud.svg',
    name: 'OpenMediaVault Storage NAS',
    category: 'cloud',
    ip: '192.168.1.135',
    port: 80,
    ipUrl: 'http://192.168.1.135',
    domain: 'nas.lan',
    domainUrl: 'http://nas.lan',
    internalUrl: 'http://192.168.1.135',
    icon: 'hard-drive',
    color: '#27ae60',
    image: 'bare-metal:openmediavault-7',
    containerName: 'omv_host',
    status: 'online',
    ram: '2 GB',
    storage: '500 GB HDD',
    node: 'Node 2 (Storage NAS)',
    tags: ['NAS', 'ZFS', 'SMB / NFS', 'Backups', 'Debian 12'],
    description: 'Centralized NAS appliance providing SMB/NFS file shares, ZFS snapshot datasets, and secondary backup repository for all homelab VMs.',
    features: [
      'ZFS dataset redundancy with predictive SMART health healing',
      'Automated rsync backup sync from Proxmox cluster',
      'Low-power dedicated storage architecture on ASUS X451MA'
    ],
    volumes: ['/srv/zfs:/srv/zfs'],
    envVars: [],
    composeCode: `# Bare-metal OpenMediaVault NAS Host: 192.168.1.135:80`,
    wikiMarkdown: `### OpenMediaVault Storage Node
Central storage NAS at 192.168.1.135.`
  },
  {
    id: 'nginx-proxy-manager',
    logo: 'icons/nginx-proxy-manager.svg',
    name: 'Nginx Proxy Manager',
    category: 'networking',
    ip: '192.168.1.3',
    port: 81,
    ipUrl: 'http://192.168.1.3:81',
    domain: 'nginx.lan',
    domainUrl: 'http://nginx.lan',
    internalUrl: 'http://nginx.lan',
    icon: 'globe',
    color: '#009688',
    image: 'jc21/nginx-proxy-manager:latest',
    containerName: 'npm',
    status: 'online',
    ram: '112 MB',
    storage: '4 GB SSD',
    node: 'Node 1 (x86_64 · CT 100)',
    tags: ['Reverse Proxy', 'SSL / TLS', 'Let\'s Encrypt', 'Ingress', 'Port Forwarding'],
    description: 'Reverse proxy management dashboard providing automated SSL provisioning, WebSocket proxying, and local domain routing for all homelab services.',
    features: [
      'Automated Let\'s Encrypt SSL/TLS certificates and renewal loops',
      'Wildcard *.lan domain routing through Pi-hole DNS sinkhole',
      'WebSocket upgrade passthrough and HTTP/2 acceleration',
      'Granular Access Lists and Basic Authentication gatekeeper'
    ],
    volumes: ['/data:/data', '/etc/letsencrypt:/etc/letsencrypt'],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  npm:
    image: 'jc21/nginx-proxy-manager:latest'
    container_name: npm
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt`,
    wikiMarkdown: `### Nginx Proxy Manager Architecture
NPM operates in LXC 100 as the edge reverse proxy for the entire 192.168.1.0/24 subnet. All \`*.lan\` domains resolve to NPM (\`192.168.1.3\`) via Pi-hole DNS.`
  },
  {
    id: 'pi-hole',
    name: 'Pi-hole DNS Sinkhole & Adblock',
    category: 'networking',
    ip: '192.168.1.4',
    port: 8080,
    ipUrl: 'http://192.168.1.4:8080/admin/',
    domain: 'pihole.lan',
    domainUrl: 'http://pihole.lan/admin/',
    internalUrl: 'http://pihole.lan/admin/',
    icon: 'shield',
    color: '#e74c3c',
    image: 'pihole/pihole:latest',
    containerName: 'pihole',
    status: 'online',
    ram: '96 MB',
    storage: '4 GB SSD',
    node: 'Node 1 (x86_64 · CT 101)',
    tags: ['DNS', 'Adblock', 'FTL Engine', 'Local DNS', 'Wildcards'],
    description: 'Network-wide DNS sinkhole, tracker blocker, and local authoritative DNS server resolving *.lan domains to Nginx Proxy Manager.',
    features: [
      'Authoritative local DNS records for *.lan homelab microservices',
      'Gravity blocklists for tracker, telemetry, and malware mitigation',
      'FTL DNS caching engine with sub-millisecond query latency',
      'Web administrative console with query inspection and audit logs'
    ],
    volumes: ['/etc/pihole:/etc/pihole', '/etc/dnsmasq.d:/etc/dnsmasq.d'],
    envVars: ['TZ=Europe/Bucharest', 'FTLCONF_LOCAL_IPV4=192.168.1.4'],
    composeCode: `services:
  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "8080:80/tcp"
    environment:
      TZ: 'Europe/Bucharest'
    volumes:
      - ./etc-pihole:/etc/pihole
      - ./etc-dnsmasq.d:/etc/dnsmasq.d
    restart: unless-stopped`,
    wikiMarkdown: `### Pi-hole Local DNS Integration
Pi-hole runs inside LXC 101 on IP \`192.168.1.4\`. Its \`pihole.toml\` and dnsmasq config contain authoritative entries and wildcards resolving all \`*.lan\` requests to Nginx Proxy Manager (\`192.168.1.3\`).`
  },
  {
    id: 'homeassistant',
    logo: 'icons/homeassistant.svg',
    name: 'Home Assistant Core',
    category: 'iot',
    ip: '192.168.1.10',
    port: 8123,
    ipUrl: 'http://192.168.1.10:8123',
    domain: 'ha.lan',
    domainUrl: 'http://ha.lan',
    internalUrl: 'http://ha.lan',
    icon: 'home',
    color: '#03a9f4',
    image: 'homeassistant/home-assistant:latest',
    containerName: 'homeassistant',
    status: 'online',
    ram: '384 MB',
    storage: '16 GB SSD',
    node: 'Node 1 (x86_64 · CT 106)',
    tags: ['Smart Home', 'Automations', 'IoT', 'Zigbee', 'MQTT'],
    description: 'Central open-source home automation platform integrating ESP32 nodes, Zigbee sensors, Shelly relays, and custom security scripts.',
    features: [
      'Local-first privacy and telemetry-free automation engine',
      'Integration with ESP32 edge sensors, Frigate NVR, and Zigbee2MQTT',
      'Custom Lovelace dashboards and mobile push notifications via Webhook',
      'Automated night modes, presence detection, and HVAC management'
    ],
    volumes: ['./config:/config'],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  homeassistant:
    container_name: homeassistant
    image: ghcr.io/home-assistant/home-assistant:stable
    restart: unless-stopped
    privileged: true
    network_mode: host
    environment:
      - TZ=Europe/Bucharest
    volumes:
      - ./config:/config`,
    wikiMarkdown: `### Home Assistant Overview
Home Assistant acts as the main nervous system for the homelab physical environment. It runs on LXC 106 on Primary Hypervisor (Node 1, x86_64) and is reverse-proxied via \`ha.lan\` and \`homeassistant.lan\`.`
  },
  {
    id: 'immich',
    logo: 'icons/immich.svg',
    name: 'Immich Photos & Video',
    category: 'cloud',
    ip: '192.168.1.15',
    port: 2283,
    ipUrl: 'http://192.168.1.15:2283',
    domain: 'immich.lan',
    domainUrl: 'http://immich.lan',
    internalUrl: 'http://immich.lan',
    icon: 'image',
    color: '#3498db',
    image: 'ghcr.io/immich-app/immich-server:release',
    containerName: 'immich_server',
    status: 'online',
    ram: '896 MB',
    storage: '40 GB SSD',
    node: 'Node 1 (x86_64 · CT 103)',
    tags: ['Photos', 'Backup', 'Facial Recognition', 'ML / AI', 'Mobile Sync'],
    description: 'High-performance self-hosted backup and media exploration solution featuring machine learning facial clustering, CLIP search, and automated smartphone uploads.',
    features: [
      'Automated background background mobile media sync (iOS / Android)',
      'Hardware-accelerated transcoding (NVENC / QuickSync / VAAPI)',
      'Facial recognition, object classification, and spatial map browsing',
      'Multi-user isolation with partner sharing libraries and albums'
    ],
    volumes: ['/mnt/storage/photos:/usr/src/app/upload', './immich_postgres:/var/lib/postgresql/data'],
    envVars: ['DB_DATABASE_NAME=immich', 'TZ=Europe/Bucharest'],
    composeCode: `services:
  immich-server:
    image: ghcr.io/immich-app/immich-server:release
    container_name: immich_server
    restart: unless-stopped
    ports:
      - "2283:2283"
    volumes:
      - /mnt/storage/photos:/usr/src/app/upload`,
    wikiMarkdown: `### Immich Media Platform
Immich runs in LXC 103 on Primary Hypervisor (Node 1, x86_64) with dedicated PostgreSQL 16 vector store and Redis caching instance.`
  },
  {
    id: 'vaultwarden',
    logo: 'icons/vaultwarden.svg',
    name: 'Vaultwarden Password Vault',
    category: 'security',
    ip: '192.168.64.21',
    port: 8080,
    ipUrl: 'http://192.168.64.21:8080',
    domain: 'vaultwarden.lan',
    domainUrl: 'http://vaultwarden.lan',
    internalUrl: 'http://192.168.64.21:8080',
    icon: 'lock',
    color: '#175ddc',
    image: 'vaultwarden/server:latest',
    containerName: 'vaultwarden',
    status: 'online',
    ram: '96 MB',
    storage: '4 GB NVMe',
    node: 'Node 3 (ARM64 · CT 106)',
    tags: ['ARM64 Node 3', 'Bitwarden', 'Passwords', '2FA / TOTP', 'Secrets', 'Zero-Knowledge'],
    description: 'Lightweight Rust implementation of Bitwarden backend providing zero-knowledge encrypted credential storage and TOTP authenticator.',
    features: [
      'Full compatibility with official Bitwarden desktop and mobile clients',
      'Zero-knowledge end-to-end AES-256 encrypted vault replication',
      'Built-in TOTP two-factor authenticator generation and vault sharing',
      'Encrypted backup export and emergency access delegation'
    ],
    volumes: ['./vw-data:/data'],
    envVars: ['SIGNUPS_ALLOWED=true', 'WEBSOCKET_ENABLED=true'],
    composeCode: `services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./vw-data:/data`,
    wikiMarkdown: `### Vaultwarden Overview
Vaultwarden is deployed on ARM64 Hypervisor (Node 3, LXC 106) on port 8080 and routed via \`vaultwarden.lan\` / \`http://192.168.64.21:8080\`.`
  },
  {
    id: 'nextcloud',
    logo: 'icons/nextcloud.svg',
    name: 'Nextcloud Hub',
    category: 'cloud',
    ip: '192.168.1.8',
    port: 80,
    ipUrl: 'http://192.168.1.8',
    domain: 'nextcloud.lan',
    domainUrl: 'http://nextcloud.lan',
    internalUrl: 'http://nextcloud.lan',
    icon: 'cloud',
    color: '#0082c9',
    image: 'nextcloud:latest',
    containerName: 'nextcloud',
    status: 'online',
    ram: '96 MB',
    storage: '20 GB SSD',
    node: 'Node 1 (x86_64 · CT 104)',
    tags: ['Storage', 'WebDAV', 'Office', 'Sync', 'Calendars'],
    description: 'Self-hosted cloud platform featuring file sync, calendar/contacts sharing, collaborative document editing, and WebDAV endpoints.',
    features: [
      'Client file synchronization across Linux, macOS, Windows, iOS, and Android',
      'Integrated Nextcloud Office / Collaboratory real-time editing',
      'CalDAV/CardDAV protocol support for seamless device sync',
      'Server-side encryption and granular file access auditing'
    ],
    volumes: ['./html:/var/www/html'],
    envVars: ['POSTGRES_DB=nextcloud', 'POSTGRES_USER=nextcloud', 'TZ=Europe/Bucharest'],
    composeCode: `services:
  nextcloud:
    image: nextcloud:latest
    container_name: nextcloud
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./html:/var/www/html`,
    wikiMarkdown: `### Nextcloud Hub
Nextcloud is deployed on LXC 104 on Primary Hypervisor (Node 1, x86_64) and accessible via \`nextcloud.lan\`.`
  },
  {
    id: 'grafana',
    logo: 'icons/grafana.svg',
    name: 'Grafana Telemetry & Dashboards',
    category: 'monitoring',
    ip: '192.168.64.24',
    port: 3000,
    ipUrl: 'http://192.168.64.24:3000',
    domain: 'grafana.lan',
    domainUrl: 'http://grafana.lan',
    internalUrl: 'http://192.168.64.24:3000',
    icon: 'bar-chart-2',
    color: '#f46800',
    image: 'grafana/grafana-oss:latest',
    containerName: 'grafana',
    status: 'online',
    ram: '448 MB',
    storage: '16 GB NVMe',
    node: 'Node 3 (ARM64 · CT 107)',
    tags: ['ARM64 Node 3', 'Metrics', 'Dashboards', 'Prometheus', 'Loki', 'Visualizations'],
    description: 'Central visualization and analytics platform aggregating Prometheus hardware metrics, Loki logs, and Proxmox node health.',
    features: [
      'Real-time dashboards for CPU, RAM, disk I/O, and network bandwidth',
      'Unified search across structured logs powered by Grafana Loki',
      'Custom alert rules routed to Discord and email Webhooks',
      'Interactive drilldown into containerized workloads and host temperatures'
    ],
    volumes: ['./grafana_data:/var/lib/grafana'],
    envVars: ['GF_SECURITY_ADMIN_USER=admin', 'GF_USERS_ALLOW_SIGN_UP=false'],
    composeCode: `services:
  grafana:
    image: grafana/grafana-oss:latest
    container_name: grafana
    ports:
      - "3000:3000"
    restart: unless-stopped`,
    wikiMarkdown: `### Grafana Observability
Grafana runs on ARM64 Hypervisor (Node 3, LXC 107) alongside Prometheus and Loki, routed via \`grafana.lan\` / \`http://192.168.64.24:3000\`.`
  },
  {
    id: 'prometheus',
    logo: 'icons/prometheus.svg',
    name: 'Prometheus TSDB Engine',
    category: 'monitoring',
    ip: '192.168.64.24',
    port: 9090,
    ipUrl: 'http://192.168.64.24:9090',
    domain: 'prometheus.lan',
    domainUrl: 'http://prometheus.lan',
    internalUrl: 'http://192.168.64.24:9090',
    icon: 'activity',
    color: '#e6522c',
    image: 'prom/prometheus:latest',
    containerName: 'prometheus',
    status: 'online',
    ram: '448 MB',
    storage: '16 GB NVMe',
    node: 'Node 3 (ARM64 · CT 107)',
    tags: ['ARM64 Node 3', 'Time Series', 'Metrics', 'Scraping', 'Alerting', 'Exporters'],
    description: 'High-efficiency time-series metric collector scraping node-exporter, Proxmox hypervisor telemetry, and container runtime statistics.',
    features: [
      'Multi-dimensional data model with PromQL query language',
      'Automated scrape target discovery across 192.168.1.0/24 and 192.168.64.0/24',
      'Efficient local TSDB storage with configurable retention policies',
      'Alert rule evaluation and dispatch to Alertmanager'
    ],
    volumes: ['./prometheus.yml:/etc/prometheus/prometheus.yml', './prom_data:/prometheus'],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    restart: unless-stopped`,
    wikiMarkdown: `### Prometheus Metrics Engine
Prometheus runs on ARM64 Hypervisor (Node 3, LXC 107) and scrapes Node-Exporter on port 9100 across Proxmox nodes and LXC containers.`
  },
  {
    id: 'loki',
    logo: 'icons/loki.svg',
    name: 'Grafana Loki Log Engine',
    category: 'monitoring',
    ip: '192.168.64.24',
    port: 3100,
    ipUrl: 'http://192.168.64.24:3100',
    domain: 'loki.lan',
    domainUrl: 'http://loki.lan',
    internalUrl: 'http://192.168.64.24:3100',
    icon: 'file-text',
    color: '#e17055',
    image: 'grafana/loki:latest',
    containerName: 'loki',
    status: 'online',
    ram: '448 MB',
    storage: '16 GB NVMe',
    node: 'Node 3 (ARM64 · CT 107)',
    tags: ['ARM64 Node 3', 'Logs', 'Promtail', 'LogQL', 'Audit', 'Aggregator'],
    description: 'Horizontally-scalable log aggregation system indexing metadata labels to ingest syslog and Docker container logs with minimal overhead.',
    features: [
      'LogQL querying integrated natively inside Grafana dashboards',
      'Promtail log shipping from Proxmox host and LXC container runtimes',
      'Ultra-efficient label indexing without storing raw text index trees'
    ],
    volumes: ['./loki-config.yml:/etc/loki/local-config.yaml'],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  loki:
    image: grafana/loki:latest
    container_name: loki
    ports:
      - "3100:3100"
    restart: unless-stopped`,
    wikiMarkdown: `### Loki Log Aggregator
Loki is deployed on ARM64 Hypervisor (Node 3, LXC 107) and accessible via \`loki.lan\` / \`http://192.168.64.24:3100\`.`
  },
  {
    id: 'uptime-kuma',
    logo: 'icons/uptime-kuma.svg',
    name: 'Uptime Kuma Status Monitor',
    category: 'monitoring',
    ip: '192.168.64.23',
    port: 3001,
    ipUrl: 'http://192.168.64.23:3001',
    domain: 'uptime.lan',
    domainUrl: 'http://uptime.lan',
    internalUrl: 'http://192.168.64.23:3001',
    icon: 'check-circle',
    color: '#5cd85a',
    image: 'louislam/uptime-kuma:1',
    containerName: 'uptime-kuma',
    status: 'online',
    ram: '80 MB',
    storage: '4 GB NVMe',
    node: 'Node 3 (ARM64 · CT 105)',
    tags: ['ARM64 Node 3', 'Uptime', 'Ping', 'Status Page', 'Alerts', 'Health Check'],
    description: 'Self-hosted monitoring tool tracking HTTP status, TCP ports, DNS latency, and SSL certificate validity with public status badges.',
    features: [
      'Real-time ping, HTTP 200, TCP port, and certificate expiration checks',
      'Customizable status page for internal users and guest networks',
      'Notification triggers across Discord, Telegram, and Email',
      'Response time historical graphs and SLA availability tracking'
    ],
    volumes: ['./data:/app/data'],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: uptime-kuma
    ports:
      - "3001:3001"
    restart: unless-stopped`,
    wikiMarkdown: `### Uptime Kuma Monitor
Uptime Kuma runs on ARM64 Hypervisor (Node 3, LXC 105) and verifies endpoints every 20 seconds.`
  },
  {
    id: 'n8n',
    logo: 'icons/n8n.svg',
    name: 'n8n Workflow Automation',
    category: 'automation',
    ip: '192.168.1.13',
    port: 5678,
    ipUrl: 'http://192.168.1.13:5678',
    domain: 'n8n.lan',
    domainUrl: 'http://n8n.lan',
    internalUrl: 'http://n8n.lan',
    icon: 'shuffle',
    color: '#ff6d5a',
    image: 'n8nio/n8n:latest',
    containerName: 'n8n',
    status: 'online',
    ram: '384 MB',
    storage: '8 GB SSD',
    node: 'Node 1 (x86_64 · CT 107)',
    tags: ['No-Code', 'Automation', 'Webhooks', 'Pipelines', 'API Integrations'],
    description: 'Fair-code workflow automation platform connecting 400+ third-party APIs, local scripts, MQTT brokers, and webhooks with low-code visual nodes.',
    features: [
      'Automated homelab backup verification and Telegram notifications',
      'Smart home event transformations between ESP32 and Home Assistant',
      'Scheduled cron routines for database dumps and GitHub sync',
      'Custom JavaScript/Python code execution nodes for complex payload parsing'
    ],
    volumes: ['./data:/home/node/.n8n'],
    envVars: ['N8N_HOST=n8n.lan', 'GENERIC_TIMEZONE=Europe/Bucharest'],
    composeCode: `services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    ports:
      - "5678:5678"
    restart: unless-stopped`,
    wikiMarkdown: `### n8n Automation Engine
n8n is deployed on LXC 107 on Primary Hypervisor (Node 1, x86_64) and accessible via \`n8n.lan\`.`
  },
  {
    id: 'gitea',
    logo: 'icons/gitea.svg',
    name: 'Gitea Git Forge & Actions',
    category: 'devops',
    ip: '192.168.64.25',
    port: 3000,
    ipUrl: 'http://192.168.64.25:3000',
    domain: 'git.lan',
    domainUrl: 'http://git.lan',
    internalUrl: 'http://192.168.64.25:3000',
    icon: 'git-pull-request',
    color: '#609926',
    image: 'gitea/gitea:latest',
    containerName: 'gitea',
    status: 'online',
    ram: '160 MB',
    storage: '10 GB NVMe',
    node: 'Node 3 (ARM64 · CT 109)',
    tags: ['ARM64 Node 3', 'Git', 'Repositories', 'Code Review', 'CI/CD', 'GitOps'],
    description: 'Lightweight self-hosted Git version control forge supporting pull requests, issue tracking, and mirror synchronization with GitHub.',
    features: [
      'Ultra-fast Git operations with SQLite/PostgreSQL storage',
      'Two-way repository mirror replication with upstream GitHub repos',
      'Built-in Webhooks triggering Woodpecker CI and FluxCD GitOps pipelines',
      'SSH key authentication and GPG commit verification'
    ],
    volumes: ['./data:/data', '/etc/timezone:/etc/timezone:ro'],
    envVars: ['USER_UID=1000', 'USER_GID=1000', 'TZ=Europe/Bucharest'],
    composeCode: `services:
  gitea:
    image: gitea/gitea:latest
    container_name: gitea
    ports:
      - "3000:3000"
      - "2222:22"
    restart: unless-stopped`,
    wikiMarkdown: `### Gitea Git Forge
Gitea runs on ARM64 Hypervisor (Node 3, LXC 109) and hosts internal Git repositories and configuration manifests.`
  },
  {
    id: 'woodpecker-ci',
    logo: 'icons/woodpecker.svg',
    name: 'Woodpecker CI/CD Engine',
    category: 'devops',
    ip: '192.168.64.26',
    port: 8000,
    ipUrl: 'http://192.168.64.26:8000',
    domain: 'ci.lan',
    domainUrl: 'http://ci.lan',
    internalUrl: 'http://192.168.64.26:8000',
    icon: 'cpu',
    color: '#2ecc71',
    image: 'woodpeckerci/woodpecker-server:latest',
    containerName: 'woodpecker-server',
    status: 'online',
    ram: '192 MB',
    storage: '8 GB NVMe',
    node: 'Node 3 (ARM64 · CT 110)',
    tags: ['ARM64 Node 3', 'CI/CD', 'Pipelines', 'Docker in Docker', 'Linting', 'Continuous Testing'],
    description: 'Community-driven container-native continuous integration engine executing automated test suites, linting, and Docker container builds.',
    features: [
      'YAML pipeline definitions declared directly in repository root (.woodpecker.yml)',
      'Isolated Docker agent execution runners with ephemeral container lifetimes',
      'Automated Ansible playbook linting and unit test execution on Git push',
      'Webhook triggers from Gitea and GitHub webhooks'
    ],
    volumes: ['./woodpecker_data:/var/lib/woodpecker'],
    envVars: ['WOODPECKER_GITEA=true', 'WOODPECKER_SERVER_URL=http://woodpecker.lan'],
    composeCode: `services:
  woodpecker-server:
    image: woodpeckerci/woodpecker-server:latest
    container_name: woodpecker-server
    ports:
      - "8000:8000"
    restart: unless-stopped`,
    wikiMarkdown: `### Woodpecker CI
Woodpecker CI is deployed on ARM64 Hypervisor (Node 3, LXC 110) and automates build verification.`
  },
  {
    id: 'authelia',
    logo: 'icons/authelia.svg',
    name: 'Authelia 2FA & SSO Portal',
    category: 'security',
    ip: '192.168.64.20',
    port: 9091,
    ipUrl: 'http://192.168.64.20:9091',
    domain: 'auth.lan',
    domainUrl: 'http://auth.lan',
    internalUrl: 'http://192.168.64.20:9091',
    icon: 'key',
    color: '#0984e3',
    image: 'authelia/authelia:latest',
    containerName: 'authelia',
    status: 'online',
    ram: '96 MB',
    storage: '4 GB NVMe',
    node: 'Node 3 (ARM64 · CT 108)',
    tags: ['ARM64 Node 3', 'SSO', '2FA', 'OpenID Connect', 'Forward Auth', 'Identity'],
    description: 'Open-source authentication server providing Single Sign-On (SSO) and multi-factor authentication (TOTP, WebAuthn/FIDO2) for reverse proxy ingress.',
    features: [
      'Two-factor authentication via TOTP authenticator apps and FIDO2/WebAuthn keys',
      'Seamless Nginx Proxy Manager forward-auth middleware integration',
      'Granular rule policies per subdomain, user group, and source subnet',
      'Argon2id password hashing and brute-force protection'
    ],
    volumes: ['./config:/config'],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  authelia:
    image: authelia/authelia:latest
    container_name: authelia
    ports:
      - "9091:9091"
    restart: unless-stopped`,
    wikiMarkdown: `### Authelia SSO
Authelia runs in LXC 108 on Utility Hypervisor (Node 3, ARM64) and acts as the gatekeeper for local domain access.`
  },
  {
    id: 'crowdsec',
    logo: 'icons/crowdsec.svg',
    name: 'CrowdSec Cyber Defense & LAPI',
    category: 'security',
    ip: '192.168.1.9',
    port: 8080,
    ipUrl: 'http://192.168.1.9:8080',
    domain: 'crowdsec.lan',
    domainUrl: 'http://crowdsec.lan',
    internalUrl: 'http://crowdsec.lan',
    icon: 'shield',
    color: '#e84393',
    image: 'crowdsecurity/crowdsec:latest',
    containerName: 'crowdsec',
    status: 'online',
    ram: '128 MB',
    storage: '4 GB SSD',
    node: 'Node 1 (x86_64 · CT 105)',
    tags: ['IPS / IDS', 'Firewall', 'Threat Intelligence', 'Log Analysis', 'Banning'],
    description: 'Crowd-sourced behavioral intrusion prevention system parsing reverse proxy and SSH logs to detect and neutralize brute-force attacks.',
    features: [
      'Real-time behavioral analysis of Nginx, SSH, and HTTP request logs',
      'Community consensus threat intelligence blocklists covering 100k+ malicious IPs',
      'OPNsense and nftables remediation bouncers blocking bad actors at layer 3',
      'Local API (LAPI) daemon managing alert decisions and bouncer subscriptions'
    ],
    volumes: ['./config:/etc/crowdsec', './data:/var/lib/crowdsec/data'],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  crowdsec:
    image: crowdsecurity/crowdsec:latest
    container_name: crowdsec
    ports:
      - "8080:8080"
    restart: unless-stopped`,
    wikiMarkdown: `### CrowdSec IDS/IPS
CrowdSec protects the homelab against automated scanning, brute-force, and exploit attempts.`
  },
  {
    id: 'jellyfin',
    logo: 'icons/jellyfin.svg',
    name: 'Jellyfin Media Server',
    category: 'media',
    ip: '192.168.1.21',
    port: 8096,
    ipUrl: 'http://192.168.1.21:8096',
    domain: 'jellyfin.lan',
    domainUrl: 'http://jellyfin.lan',
    internalUrl: 'http://jellyfin.lan',
    icon: 'tv',
    color: '#a29bfe',
    image: 'jellyfin/jellyfin:latest',
    containerName: 'jellyfin',
    status: 'online',
    ram: '896 MB',
    storage: '50 GB SSD',
    node: 'Node 1 (x86_64 · CT 109)',
    tags: ['Media Server', 'Streaming', 'Movies', 'TV Shows', 'DLNA'],
    description: 'Free and open-source media streaming server with multi-user profiles, metadata scraping, and hardware transcoding.',
    features: [
      'High-definition video streaming across Smart TVs, Android, iOS, and Web',
      'Automated subtitle retrieval and rich artwork/metadata scraping',
      'Granular parental controls and individual user watch progress sync',
      'Integrated DLNA broadcasting for local network media players'
    ],
    volumes: ['./jellyfin_config:/config', '/mnt/storage/media:/media'],
    envVars: ['PUID=1000', 'PGID=1000', 'TZ=Europe/Bucharest'],
    composeCode: `services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    ports:
      - "8096:8096"
    restart: unless-stopped`,
    wikiMarkdown: `### Jellyfin Media Server
Jellyfin runs on LXC 109 on Primary Hypervisor (Node 1, x86_64) alongside the Servarr suite on IP \`192.168.1.21\`.`
  },
  {
    id: 'radarr',
    logo: 'icons/radarr.svg',
    name: 'Radarr Movie Automation',
    category: 'media',
    ip: '192.168.1.21',
    port: 7878,
    ipUrl: 'http://192.168.1.21:7878',
    domain: 'radarr.lan',
    domainUrl: 'http://radarr.lan',
    internalUrl: 'http://radarr.lan',
    icon: 'film',
    color: '#f39c12',
    image: 'lscr.io/linuxserver/radarr:latest',
    containerName: 'radarr',
    status: 'online',
    ram: '896 MB',
    storage: '50 GB SSD',
    node: 'Node 1 (x86_64 · CT 109)',
    tags: ['Movies', 'Servarr', 'Automated Downloads', 'Indexers', 'qBit'],
    description: 'Automated movie collection manager that monitors RSS feeds for new films, upgrades quality, and integrates with download clients.',
    features: [
      'Automated movie release tracking and calendar scheduling',
      'Custom quality profiles (4K HDR, 1080p Remux, 720p)',
      'Seamless integration with Prowlarr indexers and qBittorrent',
      'Automatic file renaming, folder organization, and Jellyfin notification'
    ],
    volumes: ['./radarr_config:/config', '/mnt/storage/media/movies:/movies'],
    envVars: ['PUID=1000', 'PGID=1000', 'TZ=Europe/Bucharest'],
    composeCode: `services:
  radarr:
    image: lscr.io/linuxserver/radarr:latest
    container_name: radarr
    ports:
      - "7878:7878"
    restart: unless-stopped`,
    wikiMarkdown: `### Radarr Movie Manager
Radarr is deployed in LXC 112 on Primary Hypervisor (Node 1, x86_64) and managed via \`radarr.lan\`.`
  },
  {
    id: 'sonarr',
    logo: 'icons/sonarr.svg',
    name: 'Sonarr TV Series Automation',
    category: 'media',
    ip: '192.168.1.21',
    port: 8989,
    ipUrl: 'http://192.168.1.21:8989',
    domain: 'sonarr.lan',
    domainUrl: 'http://sonarr.lan',
    internalUrl: 'http://sonarr.lan',
    icon: 'tv',
    color: '#00cec9',
    image: 'lscr.io/linuxserver/sonarr:latest',
    containerName: 'sonarr',
    status: 'online',
    ram: '896 MB',
    storage: '50 GB SSD',
    node: 'Node 1 (x86_64 · CT 109)',
    tags: ['TV Shows', 'Servarr', 'Episodes', 'Indexers', 'Quality Upgrades'],
    description: 'Smart PVR for TV series newsgroup and BitTorrent users, automating episode tracking, downloading, and library renaming.',
    features: [
      'Automated episode monitoring, downloading, and season packing',
      'Intelligent quality upgrading based on custom score thresholds',
      'Calendar view of upcoming television premieres and season finales',
      'Auto-tagging and hardlink integration into Jellyfin TV libraries'
    ],
    volumes: ['./sonarr_config:/config', '/mnt/storage/media/tv:/tv'],
    envVars: ['PUID=1000', 'PGID=1000', 'TZ=Europe/Bucharest'],
    composeCode: `services:
  sonarr:
    image: lscr.io/linuxserver/sonarr:latest
    container_name: sonarr
    ports:
      - "8989:8989"
    restart: unless-stopped`,
    wikiMarkdown: `### Sonarr TV Series Manager
Sonarr runs on LXC 112 on Primary Hypervisor (Node 1, x86_64) and is accessible via \`sonarr.lan\`.`
  },
  {
    id: 'prowlarr',
    logo: 'icons/prowlarr.svg',
    name: 'Prowlarr Indexer Proxy',
    category: 'media',
    ip: '192.168.1.21',
    port: 9696,
    ipUrl: 'http://192.168.1.21:9696',
    domain: 'prowlarr.lan',
    domainUrl: 'http://prowlarr.lan',
    internalUrl: 'http://prowlarr.lan',
    icon: 'search',
    color: '#ff7675',
    image: 'lscr.io/linuxserver/prowlarr:latest',
    containerName: 'prowlarr',
    status: 'online',
    ram: '896 MB',
    storage: '50 GB SSD',
    node: 'Node 1 (x86_64 · CT 109)',
    tags: ['Indexers', 'Torrents', 'Usenet', 'Proxy', 'Servarr'],
    description: 'Centralized indexer manager that integrates directly with Radarr and Sonarr to sync 500+ Torrent and Usenet indexers seamlessly.',
    features: [
      'Centralized configuration of public, semi-private, and private trackers',
      'One-click synchronization of indexers to Radarr, Sonarr, and Lidarr',
      'Indexer health monitoring, response latency graphs, and query logging',
      'FlareSolverr and proxy integration for anti-bot bypass'
    ],
    volumes: ['./prowlarr_config:/config'],
    envVars: ['PUID=1000', 'PGID=1000', 'TZ=Europe/Bucharest'],
    composeCode: `services:
  prowlarr:
    image: lscr.io/linuxserver/prowlarr:latest
    container_name: prowlarr
    ports:
      - "9696:9696"
    restart: unless-stopped`,
    wikiMarkdown: `### Prowlarr Indexer Manager
Prowlarr is deployed in LXC 112 on Primary Hypervisor (Node 1, x86_64) and accessible via \`prowlarr.lan\`.`
  },
  {
    id: 'bazarr',
    logo: 'icons/bazarr.svg',
    name: 'Bazarr Subtitle Synchronizer',
    category: 'media',
    ip: '192.168.1.21',
    port: 6767,
    ipUrl: 'http://192.168.1.21:6767',
    domain: 'bazarr.lan',
    domainUrl: 'http://bazarr.lan',
    internalUrl: 'http://bazarr.lan',
    icon: 'message-square',
    color: '#6c5ce7',
    image: 'lscr.io/linuxserver/bazarr:latest',
    containerName: 'bazarr',
    status: 'online',
    ram: '896 MB',
    storage: '50 GB SSD',
    node: 'Node 1 (x86_64 · CT 109)',
    tags: ['Subtitles', 'Sync', 'Multilingual', 'Servarr', 'OpenSubtitles'],
    description: 'Companion application to Sonarr and Radarr that automates the search, download, and audio-synchronization of subtitles in multiple languages.',
    features: [
      'Automatic subtitle fetching across OpenSubtitles, Subscene, and Podnapisi',
      'Audio sync alignment using FFmpeg to prevent subtitle drift',
      'Multi-language profiles with fallback language chains',
      'Automatic embedded subtitle extraction and clean naming conventions'
    ],
    volumes: ['./bazarr_config:/config', '/mnt/storage/media:/media'],
    envVars: ['PUID=1000', 'PGID=1000', 'TZ=Europe/Bucharest'],
    composeCode: `services:
  bazarr:
    image: lscr.io/linuxserver/bazarr:latest
    container_name: bazarr
    ports:
      - "6767:6767"
    restart: unless-stopped`,
    wikiMarkdown: `### Bazarr Subtitle Downloader
Bazarr is deployed in LXC 112 on Primary Hypervisor (Node 1, x86_64) and accessible via \`bazarr.lan\`.`
  },
  {
    id: 'qbittorrent',
    logo: 'icons/qbittorrent.svg',
    name: 'qBittorrent Web Client',
    category: 'media',
    ip: '192.168.1.21',
    port: 8080,
    ipUrl: 'http://192.168.1.21:8080',
    domain: 'qbittorrent.lan',
    domainUrl: 'http://qbittorrent.lan',
    internalUrl: 'http://qbittorrent.lan',
    icon: 'download-cloud',
    color: '#2980b9',
    image: 'lscr.io/linuxserver/qbittorrent:latest',
    containerName: 'qbittorrent',
    status: 'online',
    ram: '896 MB',
    storage: '50 GB SSD',
    node: 'Node 1 (x86_64 · CT 109)',
    tags: ['Torrents', 'Downloads', 'P2P', 'Bandwidth Management', 'Servarr'],
    description: 'Lightweight, high-performance BitTorrent client with feature-rich WebUI, speed scheduling, and granular category tagging.',
    features: [
      'Category-based download path management for Radarr and Sonarr',
      'Bandwidth throttling, scheduling, and sequential downloading',
      'Built-in search plugins and WebUI authentication security',
      'Direct storage bindings to ZFS media dataset'
    ],
    volumes: ['./qbit_config:/config', '/mnt/storage/downloads:/downloads'],
    envVars: ['PUID=1000', 'PGID=1000', 'TZ=Europe/Bucharest'],
    composeCode: `services:
  qbittorrent:
    image: lscr.io/linuxserver/qbittorrent:latest
    container_name: qbittorrent
    ports:
      - "8080:8080"
    restart: unless-stopped`,
    wikiMarkdown: `### qBittorrent Downloader
qBittorrent runs in LXC 112 on Primary Hypervisor (Node 1, x86_64) and handles all automated Servarr downloads.`
  },
  {
    id: 'actualbudget',
    logo: 'icons/actualbudget.svg',
    name: 'Actual Budget',
    category: 'productivity',
    ip: '192.168.64.16',
    port: 5006,
    ipUrl: 'http://192.168.64.16:5006',
    domain: 'actualbudget.lan',
    domainUrl: 'http://actualbudget.lan',
    internalUrl: 'http://192.168.64.16:5006',
    icon: 'dollar-sign',
    color: '#27ae60',
    image: 'actualbudget/actual-server:latest',
    containerName: 'actualbudget',
    status: 'online',
    ram: '160 MB',
    storage: '4 GB NVMe',
    node: 'Node 3 (ARM64 · CT 101)',
    tags: ['ARM64 Node 3', 'Finance', 'Budgeting', 'Zero-Based', 'Privacy', 'Encrypted Sync'],
    description: 'Privacy-focused zero-based envelope budgeting application with encrypted client-side synchronization and automated bank statement parsing.',
    features: [
      'Zero-based envelope budgeting methodology with monthly roll-over',
      'End-to-end client-side encryption across desktop, mobile, and web',
      'OFX, QFX, and CSV transaction imports with automated category matching',
      'Custom budget rules, recurring transactions, and net worth reports'
    ],
    volumes: ['./data:/data'],
    envVars: ['PORT=5006'],
    composeCode: `services:
  actualbudget:
    image: actualbudget/actual-server:latest
    container_name: actualbudget
    ports:
      - "5006:5006"
    restart: unless-stopped`,
    wikiMarkdown: `### Actual Budget Overview
Actual Budget runs on ARM64 Hypervisor (Node 3, LXC 101) and is accessible via \`actualbudget.lan\` / \`http://192.168.64.16:5006\`.`
  },
  {
    id: 'changedetection',
    logo: 'icons/changedetection.svg',
    name: 'ChangeDetection.io Monitor',
    category: 'automation',
    ip: '192.168.64.18',
    port: 5000,
    ipUrl: 'http://192.168.64.18:5000',
    domain: 'changedetection.lan',
    domainUrl: 'http://changedetection.lan',
    internalUrl: 'http://192.168.64.18:5000',
    icon: 'eye',
    color: '#d63031',
    image: 'dgtlmoon/changedetection.io:latest',
    containerName: 'changedetection',
    status: 'online',
    ram: '160 MB',
    storage: '4 GB NVMe',
    node: 'Node 3 (ARM64 · CT 103)',
    tags: ['ARM64 Node 3', 'Web Monitor', 'Diff Tracker', 'Restock Alerts', 'Scraping', 'Webhooks'],
    description: 'Automated website change detection and notification tool monitoring price updates, restock alerts, API changes, and DOM element mutations.',
    features: [
      'Visual CSS and XPath selector filtering to monitor specific page regions',
      'Side-by-side visual and text diffs highlighting exact additions/deletions',
      'Playwright / Chromium rendering support for JavaScript-heavy dynamic websites',
      'Instant notification triggers via Discord, Telegram, Webhook, and Email'
    ],
    volumes: ['./datastore:/datastore'],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  changedetection:
    image: dgtlmoon/changedetection.io:latest
    container_name: changedetection
    ports:
      - "5000:5000"
    restart: unless-stopped`,
    wikiMarkdown: `### ChangeDetection.io
ChangeDetection runs on ARM64 Hypervisor (Node 3, LXC 103) and monitors web page changes automatically via \`changedetection.lan\` / \`http://192.168.64.18:5000\`.`
  },
  {
    id: 'trillium-notes',
    name: 'Trilium Personal Knowledge Base',
    category: 'productivity',
    ip: '192.168.64.17',
    port: 8080,
    ipUrl: 'http://192.168.64.17:8080',
    domain: 'trilium.lan',
    domainUrl: 'http://trilium.lan',
    internalUrl: 'http://192.168.64.17:8080',
    icon: 'book-open',
    color: '#8e44ad',
    image: 'zadam/trilium:latest',
    containerName: 'trilium',
    status: 'online',
    ram: '160 MB',
    storage: '8 GB NVMe',
    node: 'Node 3 (ARM64 · CT 102)',
    tags: ['ARM64 Node 3', 'Notes', 'Knowledge Base', 'Markdown', 'Mind Maps', 'Encryption'],
    description: 'Hierarchical note-taking application designed for building extensive personal knowledge bases with rich text, code snippets, and mind maps.',
    features: [
      'Infinite tree hierarchy and clone notes with multi-parent placement',
      'Rich text editing with MathJax formulas, code highlighting, and diagrams',
      'Full-text search with attribute filtering and relation link graphs',
      'Per-note encryption and automated periodic database snapshot backups'
    ],
    volumes: ['./trilium-data:/home/node/trilium-data'],
    envVars: ['TRILIUM_DATA_DIR=/home/node/trilium-data'],
    composeCode: `services:
  trilium:
    image: zadam/trilium:latest
    container_name: trilium
    ports:
      - "8080:8080"
    restart: unless-stopped`,
    wikiMarkdown: `### Trilium Notes
Trilium Notes runs on ARM64 Hypervisor (Node 3, LXC 102) and is accessible via \`trilium.lan\` / \`http://192.168.64.17:8080\`.`
  },
  {
    id: 'scrutiny',
    logo: 'icons/scrutiny.svg',
    name: 'Scrutiny S.M.A.R.T. Drive Health (x86_64)',
    category: 'monitoring',
    ip: '192.168.1.18',
    port: 8080,
    ipUrl: 'http://192.168.1.18:8080',
    domain: 'scrutiny.lan',
    domainUrl: 'http://scrutiny.lan',
    internalUrl: 'http://scrutiny.lan',
    icon: 'disc',
    color: '#e67e22',
    image: 'ghcr.io/analogj/scrutiny:master-omnibus',
    containerName: 'scrutiny',
    status: 'online',
    ram: '96 MB',
    storage: '4 GB SSD',
    node: 'Node 1 (x86_64 · CT 108)',
    tags: ['x86_64 Node 1', 'S.M.A.R.T.', 'Storage Health', 'SSD Wear', 'Drive Telemetry', 'Alerts'],
    description: 'Hard drive health dashboard tracking S.M.A.R.T. metrics, temperature trends, and failure probabilities across SSD and HDD storage devices.',
    features: [
      'Automated smartctl daemon inspection across all hypervisor storage disks',
      'SSD endurance calculation and wear percentage remaining estimation',
      'Historical temperature tracking graphs with critical threshold warnings',
      'Webhook alerting before catastrophic drive sector degradation occurs'
    ],
    volumes: ['./config:/opt/scrutiny/config', '/run/udev:/run/udev:ro'],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  scrutiny:
    image: ghcr.io/analogj/scrutiny:master-omnibus
    container_name: scrutiny
    ports:
      - "8080:8080"
    restart: unless-stopped`,
    wikiMarkdown: `### Scrutiny Disk Health
Scrutiny is deployed in LXC 108 on Primary Hypervisor (Node 1, x86_64) and monitors drive telemetry via \`scrutiny.lan\` / \`http://192.168.1.18:8080\`.`
  },
  {
    id: 'scrutiny-arm',
    logo: 'icons/scrutiny.svg',
    name: 'Scrutiny S.M.A.R.T. Drive Health (ARM64)',
    category: 'monitoring',
    ip: '192.168.64.19',
    port: 8088,
    ipUrl: 'http://192.168.64.19:8088',
    domain: 'scrutiny-arm.lan',
    domainUrl: 'http://scrutiny-arm.lan',
    internalUrl: 'http://192.168.64.19:8088',
    icon: 'disc',
    color: '#9b59b6',
    image: 'ghcr.io/analogj/scrutiny:master-omnibus',
    containerName: 'scrutiny_arm',
    status: 'online',
    ram: '96 MB',
    storage: '4 GB NVMe',
    node: 'Node 3 (ARM64 · CT 104)',
    tags: ['ARM64 Node 3', 'S.M.A.R.T.', 'Storage Health', 'NVMe Wear', 'Drive Telemetry'],
    description: 'ARM64 disk telemetry and storage health collector monitoring NVMe SSD endurance and performance on Apple Silicon.',
    features: [
      'Native ARM64 container runtime for Apple Silicon storage telemetry',
      'NVMe temperature, wear level and endurance monitoring',
      'InfluxDB metrics backend with embedded web UI on port 8088'
    ],
    volumes: ['./config:/opt/scrutiny/config'],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  scrutiny:
    image: ghcr.io/analogj/scrutiny:master-omnibus
    container_name: scrutiny
    ports:
      - "8088:8080"
    restart: unless-stopped`,
    wikiMarkdown: `### Scrutiny ARM64
Scrutiny ARM64 is deployed in LXC 104 on ARM64 Hypervisor (Node 3) and accessible via \`http://192.168.64.19:8088\`.`
  },
  {
    id: 'it-tools',
    logo: 'icons/it-tools.svg',
    name: 'IT-Tools Handy Utilities',
    category: 'productivity',
    ip: '192.168.64.15',
    port: 8080,
    ipUrl: 'http://192.168.64.15:8080',
    domain: 'it-tools.lan',
    domainUrl: 'http://it-tools.lan',
    internalUrl: 'http://192.168.64.15:8080',
    icon: 'tool',
    color: '#00b894',
    image: 'corentinth/it-tools:latest',
    containerName: 'it-tools',
    status: 'online',
    ram: '64 MB',
    storage: '2 GB NVMe',
    node: 'Node 3 (ARM64 · CT 100)',
    tags: ['ARM64 Node 3', 'Dev Tools', 'Cheatsheets', 'Converters', 'Generators', 'Network Tools'],
    description: 'Collection of handy online tools for developers and system administrators including JWT decoders, UUID generators, subnet calculators, and hashers.',
    features: [
      'Client-side execution with zero telemetry or data retention',
      '70+ utilities covering crypto, network calculations, formatting, and conversion',
      'Offline PWA support for air-gapped system maintenance sessions',
      'Instant JSON formatting, Regex testing, and base64 encoders'
    ],
    volumes: [],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  it-tools:
    image: corentinth/it-tools:latest
    container_name: it-tools
    ports:
      - "8080:80"
    restart: unless-stopped`,
    wikiMarkdown: `### IT-Tools Utility Suite
IT-Tools runs in LXC 100 on ARM64 Hypervisor (Node 3) and is accessible via \`it-tools.lan\` / \`http://192.168.64.15:8080\`.`
  },
  {
    id: 'opnsense-vm',
    logo: 'icons/opnsense.svg',
    name: 'OPNsense Core Gateway & Firewall',
    category: 'vms',
    ip: '192.168.1.132',
    port: 8443,
    ipUrl: 'https://192.168.1.132:8443',
    domain: 'opnsense.lan',
    domainUrl: 'https://opnsense.lan',
    internalUrl: 'https://192.168.1.132:8443',
    icon: 'shield',
    color: '#e74c3c',
    image: 'OPNsense 24.x (FreeBSD KVM)',
    containerName: 'VM 200',
    status: 'online',
    ram: '1024 MB (1 GB)',
    storage: '16 GB SSD',
    node: 'Node 1 (x86_64 · VM 200)',
    tags: ['OPNsense', 'VM 200', 'Firewall', 'Gateway', 'HAProxy', 'WireGuard'],
    description: 'Virtual router and firewall appliance providing layer-3 routing, inter-VLAN isolation, HAProxy reverse proxy, and WireGuard VPN.',
    features: [
      'Dual-interface architecture: vmbr0 (WAN) and vmbr1 (LAN)',
      'Stateful firewall rules and CrowdSec IPS/IDS remediation bouncer',
      'High-performance WireGuard and OpenVPN site-to-site tunnels',
      'WebGUI management on port 8443 with user Stefanut / root'
    ],
    volumes: ['local-lvm:vm-200-disk-0 (16 GB)'],
    envVars: ['ADMIN_USER=root', 'WEBGUI_PORT=8443'],
    composeCode: `qm create 200 --name opnsense --memory 1024 --cores 2 --net0 virtio,bridge=vmbr0 --net1 virtio,bridge=vmbr1`,
    wikiMarkdown: `### OPNsense Core Gateway (VM 200)
OPNsense runs as a dedicated KVM guest on VMID 200 routing traffic across virtual bridges.`
  },
  {
    id: 'windows-server',
    logo: 'icons/windows.svg',
    name: 'Windows Server 2025 Datacenter',
    category: 'vms',
    ip: '192.168.1.132',
    port: 3389,
    ipUrl: 'http://192.168.1.132:3389',
    domain: 'winserver.lan',
    domainUrl: 'http://winserver.lan',
    internalUrl: 'http://192.168.1.132:3389',
    icon: 'monitor',
    color: '#00a4ef',
    image: 'Windows Server 2025 x64 (UEFI/OVMF)',
    containerName: 'VM 201',
    status: 'online',
    ram: '4096 MB (4 GB)',
    storage: '120 GB NVMe',
    node: 'Node 1 (x86_64 · VM 201)',
    tags: ['x86_64 Node 1', 'Windows Server 2025', 'VM 201', 'Active Directory', 'RDP', 'KVM Q35'],
    description: 'Windows Server 2025 virtual machine running with OVMF UEFI, TPM 2.0, VirtIO storage & network controllers, 4GB RAM, and 120GB NVMe disk.',
    features: [
      'Modern Windows Server 2025 architecture with UEFI OVMF BIOS and TPM 2.0',
      'High-performance VirtIO SCSI single controller with 120GB disk storage',
      'Remote Desktop Protocol (RDP) administration on port 3389',
      'Active Directory Domain Services (AD DS) and Group Policy orchestration'
    ],
    volumes: ['local-lvm:vm-201-disk-1 (120 GB)', 'local-lvm:vm-201-disk-0 (4 MB EFI)', 'local-lvm:vm-201-disk-2 (4 MB TPM)'],
    envVars: ['RDP_PORT=3389', 'MEMORY_MB=4096', 'CORES=2'],
    composeCode: `qm create 201 --name windows --memory 4096 --cores 2 --cpu x86-64-v2-AES --bios ovmf --machine q35 --efidisk0 local-lvm:vm-201-disk-0,efitype=4m --tpmstate0 local-lvm:vm-201-disk-2,version=v2.0 --scsi0 local-lvm:vm-201-disk-1,size=120G --net0 virtio,bridge=vmbr0`,
    wikiMarkdown: `### Windows Server 2025 (VM 201)
Windows Server 2025 runs as VM 201 on Primary Hypervisor (Node 1, x86_64) configured with 4GB RAM, 2 vCPUs, and 120GB NVMe storage.`
  }
];
