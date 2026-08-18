export const categories = [
  { id: 'all', name: 'All Services', icon: 'layers' },
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
    id: 'nginx-proxy-manager',
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
Home Assistant acts as the main nervous system for the homelab physical environment. It runs on LXC 107 and is reverse-proxied via \`ha.lan\` and \`homeassistant.lan\`.`
  },
  {
    id: 'immich',
    name: 'Immich Photos & Video',
    category: 'cloud',
    ip: '192.168.1.15',
    port: 2283,
    ipUrl: 'http://192.168.1.15:2283',
    domain: 'immich.lan',
    domainUrl: 'http://immich.lan',
    internalUrl: 'http://immich.lan',
    icon: 'image',
    color: '#4285f4',
    image: 'ghcr.io/immich-app/immich-server:release',
    containerName: 'immich_server',
    status: 'online',
    tags: ['Photos', 'Backup', 'AI Facial Recognition', 'Mobile Sync', 'RAW Support'],
    description: 'High-performance self-hosted backup and gallery solution for photos and videos featuring AI facial clustering and CLIP search.',
    features: [
      'Automated background backup from iOS and Android devices',
      'On-device AI facial recognition and semantic CLIP search',
      'Hardware-accelerated video transcoding and thumbnail generation',
      'Multi-user shared partner libraries and album collaboration'
    ],
    volumes: ['/mnt/storage/photos:/usr/src/app/upload', './pgdata:/var/lib/postgresql/data'],
    envVars: ['DB_DATABASE_NAME=immich', 'DB_USERNAME=postgres', 'TZ=Europe/Bucharest'],
    composeCode: `services:
  immich-server:
    container_name: immich_server
    image: ghcr.io/immich-app/immich-server:release
    ports:
      - "2283:2283"
    restart: unless-stopped`,
    wikiMarkdown: `### Immich Architecture
Immich runs in LXC 103 with dedicated PostgreSQL 16 vector store and Redis caching instance.`
  },
  {
    id: 'vaultwarden',
    name: 'Vaultwarden Password Vault',
    category: 'security',
    ip: '192.168.1.16',
    port: 8080,
    ipUrl: 'http://192.168.1.16:8080',
    domain: 'vaultwarden.lan',
    domainUrl: 'http://vaultwarden.lan',
    internalUrl: 'http://vaultwarden.lan',
    icon: 'lock',
    color: '#175ddc',
    image: 'vaultwarden/server:latest',
    containerName: 'vaultwarden',
    status: 'online',
    tags: ['Bitwarden', 'Passwords', '2FA / TOTP', 'Secrets', 'Zero-Knowledge'],
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
Vaultwarden is deployed in LXC 112 on port 8080 and routed via \`vaultwarden.lan\`.`
  },
  {
    id: 'nextcloud',
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
    tags: ['Storage', 'WebDAV', 'Office', 'Sync', 'Calendars'],
    description: 'Enterprise-grade private cloud platform featuring file sync, calendar/contacts sharing, collaborative document editing, and WebDAV endpoints.',
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
Nextcloud is deployed on LXC 105 and accessible via \`nextcloud.lan\`.`
  },
  {
    id: 'grafana',
    name: 'Grafana Telemetry & Dashboards',
    category: 'monitoring',
    ip: '192.168.1.11',
    port: 3000,
    ipUrl: 'http://192.168.1.11:3000',
    domain: 'grafana.lan',
    domainUrl: 'http://grafana.lan',
    internalUrl: 'http://grafana.lan',
    icon: 'bar-chart-2',
    color: '#f46800',
    image: 'grafana/grafana:latest',
    containerName: 'grafana',
    status: 'online',
    tags: ['Metrics', 'Dashboards', 'Prometheus', 'Loki', 'Visualizations'],
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
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    restart: unless-stopped`,
    wikiMarkdown: `### Grafana Observability
Grafana runs in LXC 108 alongside Prometheus and Loki, routed via \`grafana.lan\`.`
  },
  {
    id: 'prometheus',
    name: 'Prometheus TSDB Engine',
    category: 'monitoring',
    ip: '192.168.1.11',
    port: 9090,
    ipUrl: 'http://192.168.1.11:9090',
    domain: 'prometheus.lan',
    domainUrl: 'http://prometheus.lan',
    internalUrl: 'http://prometheus.lan',
    icon: 'activity',
    color: '#e6522c',
    image: 'prom/prometheus:latest',
    containerName: 'prometheus',
    status: 'online',
    tags: ['Time Series', 'Metrics', 'Scraping', 'Alerting', 'Exporters'],
    description: 'High-efficiency time-series metric collector scraping node-exporter, Proxmox hypervisor telemetry, and container runtime statistics.',
    features: [
      'Multi-dimensional data model with PromQL query language',
      'Automated scrape target discovery across 192.168.1.0/24',
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
Prometheus scrapes Node-Exporter on port 9100 across Proxmox nodes and LXC containers.`
  },
  {
    id: 'loki',
    name: 'Grafana Loki Log Engine',
    category: 'monitoring',
    ip: '192.168.1.11',
    port: 3100,
    ipUrl: 'http://192.168.1.11:3100',
    domain: 'loki.lan',
    domainUrl: 'http://loki.lan',
    internalUrl: 'http://loki.lan',
    icon: 'file-text',
    color: '#e17055',
    image: 'grafana/loki:latest',
    containerName: 'loki',
    status: 'online',
    tags: ['Logs', 'Promtail', 'LogQL', 'Audit', 'Aggregator'],
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
Loki is deployed in LXC 108 and accessible via \`loki.lan\`.`
  },
  {
    id: 'uptime-kuma',
    name: 'Uptime Kuma Status Monitor',
    category: 'monitoring',
    ip: '192.168.1.7',
    port: 3001,
    ipUrl: 'http://192.168.1.7:3001',
    domain: 'uptime.lan',
    domainUrl: 'http://uptime.lan',
    internalUrl: 'http://uptime.lan',
    icon: 'check-circle',
    color: '#5cd85a',
    image: 'louislam/uptime-kuma:1',
    containerName: 'uptime-kuma',
    status: 'online',
    tags: ['Uptime', 'Ping', 'Status Page', 'Alerts', 'Health Check'],
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
Uptime Kuma runs on LXC 104 and verifies endpoints every 20 seconds.`
  },
  {
    id: 'n8n',
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
n8n is deployed on LXC 110 and accessible via \`n8n.lan\`.`
  },
  {
    id: 'gitea',
    name: 'Gitea Git Forge & Actions',
    category: 'devops',
    ip: '192.168.1.17',
    port: 3000,
    ipUrl: 'http://192.168.1.17:3000',
    domain: 'gitea.lan',
    domainUrl: 'http://gitea.lan',
    internalUrl: 'http://gitea.lan',
    icon: 'git-pull-request',
    color: '#609926',
    image: 'gitea/gitea:latest',
    containerName: 'gitea',
    status: 'online',
    tags: ['Git', 'Repositories', 'Code Review', 'CI/CD', 'GitOps'],
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
Gitea runs on LXC 113 and hosts internal Git repositories and configuration manifests.`
  },
  {
    id: 'woodpecker-ci',
    name: 'Woodpecker CI/CD Engine',
    category: 'devops',
    ip: '192.168.1.14',
    port: 8000,
    ipUrl: 'http://192.168.1.14:8000',
    domain: 'woodpecker.lan',
    domainUrl: 'http://woodpecker.lan',
    internalUrl: 'http://woodpecker.lan',
    icon: 'cpu',
    color: '#2ecc71',
    image: 'woodpeckerci/woodpecker-server:latest',
    containerName: 'woodpecker-server',
    status: 'online',
    tags: ['CI/CD', 'Pipelines', 'Docker in Docker', 'Linting', 'Continuous Testing'],
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
Woodpecker CI is deployed on LXC 111 and automates build verification.`
  },
  {
    id: 'authelia',
    name: 'Authelia 2FA & SSO Portal',
    category: 'security',
    ip: '192.168.1.20',
    port: 9091,
    ipUrl: 'http://192.168.1.20:9091',
    domain: 'authelia.lan',
    domainUrl: 'http://authelia.lan',
    internalUrl: 'http://authelia.lan',
    icon: 'key',
    color: '#0984e3',
    image: 'authelia/authelia:latest',
    containerName: 'authelia',
    status: 'online',
    tags: ['SSO', '2FA', 'OpenID Connect', 'Forward Auth', 'Identity'],
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
Authelia runs in LXC 116 and acts as the gatekeeper for local domain access.`
  },
  {
    id: 'crowdsec',
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
Jellyfin runs on LXC 117 alongside the Servarr suite on IP \`192.168.1.21\`.`
  },
  {
    id: 'radarr',
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
Radarr is deployed in LXC 117 and managed via \`radarr.lan\`.`
  },
  {
    id: 'sonarr',
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
Sonarr runs on LXC 117 and is accessible via \`sonarr.lan\`.`
  },
  {
    id: 'prowlarr',
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
Prowlarr is deployed in LXC 117 and accessible via \`prowlarr.lan\`.`
  },
  {
    id: 'bazarr',
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
Bazarr is deployed in LXC 117 and accessible via \`bazarr.lan\`.`
  },
  {
    id: 'qbittorrent',
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
qBittorrent runs in LXC 117 and handles all automated Servarr downloads.`
  },
  {
    id: 'actualbudget',
    name: 'Actual Budget',
    category: 'productivity',
    ip: '192.168.1.22',
    port: 5006,
    ipUrl: 'http://192.168.1.22:5006',
    domain: 'actualbudget.lan',
    domainUrl: 'http://actualbudget.lan',
    internalUrl: 'http://actualbudget.lan',
    icon: 'dollar-sign',
    color: '#27ae60',
    image: 'actualbudget/actual-server:latest',
    containerName: 'actualbudget',
    status: 'online',
    tags: ['Finance', 'Budgeting', 'Zero-Based', 'Privacy', 'Encrypted Sync'],
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
Actual Budget runs on LXC 118 and is accessible via \`actualbudget.lan\`.`
  },
  {
    id: 'filebrowser',
    name: 'FileBrowser Web Manager',
    category: 'cloud',
    ip: '192.168.1.23',
    port: 8082,
    ipUrl: 'http://192.168.1.23:8082',
    domain: 'filebrowser.lan',
    domainUrl: 'http://filebrowser.lan',
    internalUrl: 'http://filebrowser.lan',
    icon: 'folder',
    color: '#3498db',
    image: 'filebrowser/filebrowser:latest',
    containerName: 'filebrowser',
    status: 'online',
    tags: ['File Manager', 'Uploads', 'Previews', 'WebUI', 'Quick Share'],
    description: 'Lightweight web-based file management interface with direct filesystem access, drag-and-drop uploads, media previews, and temporary share links.',
    features: [
      'Instant browsing of ZFS pools and local backup volumes',
      'In-browser video, image, PDF, and syntax-highlighted code previewing',
      'User permissions with customizable base directories and quotas',
      'Direct command execution and file archive creation/extraction'
    ],
    volumes: ['./data:/data', '/srv:/srv'],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  filebrowser:
    image: filebrowser/filebrowser:latest
    container_name: filebrowser
    ports:
      - "8082:80"
    restart: unless-stopped`,
    wikiMarkdown: `### FileBrowser Storage Manager
FileBrowser is deployed on LXC 119 and accessible via \`filebrowser.lan\`.`
  },
  {
    id: 'changedetection',
    name: 'ChangeDetection.io Monitor',
    category: 'automation',
    ip: '192.168.1.24',
    port: 5000,
    ipUrl: 'http://192.168.1.24:5000',
    domain: 'changedetection.lan',
    domainUrl: 'http://changedetection.lan',
    internalUrl: 'http://changedetection.lan',
    icon: 'eye',
    color: '#d63031',
    image: 'dgtlmoon/changedetection.io:latest',
    containerName: 'changedetection',
    status: 'online',
    tags: ['Web Monitor', 'Diff Tracker', 'Restock Alerts', 'Scraping', 'Webhooks'],
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
ChangeDetection runs on LXC 120 and monitors web page changes automatically.`
  },
  {
    id: 'alist',
    name: 'AList Unified Storage Aggregator',
    category: 'cloud',
    ip: '192.168.1.25',
    port: 5244,
    ipUrl: 'http://192.168.1.25:5244',
    domain: 'alist.lan',
    domainUrl: 'http://alist.lan',
    internalUrl: 'http://alist.lan',
    icon: 'hard-drive',
    color: '#16a085',
    image: 'xhofe/alist:latest',
    containerName: 'alist',
    status: 'online',
    tags: ['Storage', 'Cloud Drives', 'WebDAV', 'Aggregation', 'Direct Link'],
    description: 'File list program aggregating local ZFS storage, Google Drive, OneDrive, S3 buckets, and WebDAV providers into a single unified directory.',
    features: [
      'Aggregation of 30+ cloud storage backends into a single mount tree',
      'WebDAV server endpoints enabling native OS mounting of all cloud drives',
      'Direct link generation and video preview transcoding without downloading',
      'Offline file download forwarding to Aria2 and qBittorrent engines'
    ],
    volumes: ['./data:/opt/alist/data'],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  alist:
    image: xhofe/alist:latest
    container_name: alist
    ports:
      - "5244:5244"
    restart: unless-stopped`,
    wikiMarkdown: `### AList Storage Gateway
AList is deployed in LXC 121 and accessible via \`alist.lan\`.`
  },
  {
    id: 'trillium-notes',
    name: 'Trilium Personal Knowledge Base',
    category: 'productivity',
    ip: '192.168.1.19',
    port: 8080,
    ipUrl: 'http://192.168.1.19:8080',
    domain: 'trilium.lan',
    domainUrl: 'http://trilium.lan',
    internalUrl: 'http://trilium.lan',
    icon: 'book-open',
    color: '#8e44ad',
    image: 'zadam/trilium:latest',
    containerName: 'trilium',
    status: 'online',
    tags: ['Notes', 'Knowledge Base', 'Markdown', 'Mind Maps', 'Encryption'],
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
Trilium Notes runs in LXC 115 and is accessible via \`trilium.lan\`.`
  },
  {
    id: 'scrutiny',
    name: 'Scrutiny S.M.A.R.T. Drive Health',
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
    tags: ['S.M.A.R.T.', 'Storage Health', 'SSD Wear', 'Drive Telemetry', 'Alerts'],
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
Scrutiny is deployed in LXC 114 and monitors drive telemetry via \`scrutiny.lan\`.`
  },
  {
    id: 'it-tools',
    name: 'IT-Tools Handy Utilities',
    category: 'productivity',
    ip: '192.168.1.12',
    port: 80,
    ipUrl: 'http://192.168.1.12',
    domain: 'it-tools.lan',
    domainUrl: 'http://it-tools.lan',
    internalUrl: 'http://it-tools.lan',
    icon: 'tool',
    color: '#00b894',
    image: 'corentinth/it-tools:latest',
    containerName: 'it-tools',
    status: 'online',
    tags: ['Dev Tools', 'Cheatsheets', 'Converters', 'Generators', 'Network Tools'],
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
      - "80:80"
    restart: unless-stopped`,
    wikiMarkdown: `### IT-Tools Utility Suite
IT-Tools runs in LXC 109 and is accessible via \`it-tools.lan\`.`
  },
  {
    id: 'homelab-homepage',
    name: 'Homelab Unified Dashboard',
    category: 'productivity',
    ip: '192.168.1.26',
    port: 8085,
    ipUrl: 'http://192.168.1.26:8085',
    domain: 'homepage.lan',
    domainUrl: 'http://homepage.lan',
    internalUrl: 'http://homepage.lan',
    icon: 'grid',
    color: '#6366f1',
    image: 'nginx:alpine',
    containerName: 'homelab-homepage',
    status: 'online',
    tags: ['Dashboard', 'Vue.js', 'Service Portal', 'Live Health', 'Hardware Matrix'],
    description: 'High-performance interactive portal and service directory presenting real-time system health, IP and domain endpoints, and Docker compose specs.',
    features: [
      'Real-time endpoint cards showing direct IP (:port) and local domain (*.lan)',
      'Port allocation matrix and hardware resource telemetry breakdown',
      'Interactive Docker Compose and configuration inspector modals',
      'Instant full-text search with category filtering and favorite pinning'
    ],
    volumes: ['./dist:/usr/share/nginx/html:ro'],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  homepage:
    image: nginx:alpine
    container_name: homelab-homepage
    ports:
      - "8085:80"
    volumes:
      - ./dist:/usr/share/nginx/html:ro
    restart: unless-stopped`,
    wikiMarkdown: `### Homelab Dashboard
The central dashboard is deployed on LXC 122 and routed via \`homepage.lan\` and \`homelab.lan\`.`
  },
  {
    id: 'web-wiki',
    name: 'Homelab Architecture Wiki',
    category: 'devops',
    ip: '192.168.1.27',
    port: 80,
    ipUrl: 'http://192.168.1.27',
    domain: 'wiki.lan',
    domainUrl: 'http://wiki.lan',
    internalUrl: 'http://wiki.lan',
    icon: 'book',
    color: '#0984e3',
    image: 'nginx:alpine',
    containerName: 'web-wiki',
    status: 'online',
    tags: ['Wiki', 'Documentation', 'Architecture', 'Topology', 'Runbooks'],
    description: 'Comprehensive engineering documentation and architectural reference detailing VLAN layouts, disaster recovery runbooks, and automation scripts.',
    features: [
      'Interactive Markdown documentation reader with deep link navigation',
      'Network segmentation diagrams and VLAN isolation security rules',
      'ESP32 embedded automation source walkthroughs and wiring guides',
      'Full disaster recovery cold-start runbooks and backup procedures'
    ],
    volumes: ['./dist:/usr/share/nginx/html:ro'],
    envVars: ['TZ=Europe/Bucharest'],
    composeCode: `services:
  wiki:
    image: nginx:alpine
    container_name: web-wiki
    ports:
      - "80:80"
    volumes:
      - ./dist:/usr/share/nginx/html:ro
    restart: unless-stopped`,
    wikiMarkdown: `### Homelab Architecture Wiki
The documentation wiki is deployed on LXC 123 and accessible via \`wiki.lan\`.`
  },
  {
    id: 'opnsense-vm',
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
    tags: ['OPNsense', 'VM 200', 'Firewall', 'Gateway', 'HAProxy', 'WireGuard'],
    description: 'Enterprise virtual router and stateful firewall appliance providing layer-3 routing, inter-VLAN isolation, HAProxy reverse proxy, and WireGuard VPN.',
    features: [
      'Dual-interface architecture: vmbr0 (WAN) and vmbr1 (LAN)',
      'Stateful firewall rules and CrowdSec IPS/IDS remediation bouncer',
      'High-performance WireGuard and OpenVPN site-to-site tunnels',
      'WebGUI management on port 8443 with user Stefanut / root'
    ],
    volumes: ['local-lvm:vm-200-disk-0 (16 GB)'],
    envVars: ['ADMIN_USER=root', 'WEBGUI_PORT=8443'],
    composeCode: `qm create 200 --name opnsense --memory 2048 --cores 2 --net0 virtio,bridge=vmbr0 --net1 virtio,bridge=vmbr1`,
    wikiMarkdown: `### OPNsense Core Gateway (VM 200)
OPNsense runs as a dedicated KVM guest on VMID 200 routing traffic across virtual bridges.`
  },
  {
    id: 'windows-server',
    name: 'Windows Server 2022 / 2025',
    category: 'vms',
    ip: '192.168.1.201',
    port: 3389,
    ipUrl: 'http://192.168.1.201:3389',
    domain: 'winserver.lan',
    domainUrl: 'http://winserver.lan',
    internalUrl: 'http://winserver.lan',
    icon: 'server',
    color: '#00a8ff',
    image: 'Windows Server (OVMF UEFI)',
    containerName: 'VM 201',
    status: 'online',
    tags: ['Windows Server', 'VM 201', 'Active Directory', 'RDP', 'WinRM', 'KVM'],
    description: 'Enterprise Windows Server KVM guest virtual machine running on Proxmox VE with Active Directory, RDP remote desktop, and VirtIO acceleration.',
    features: [
      'Windows Server Standard edition with UEFI/OVMF 4M firmware',
      'Remote Desktop Protocol (RDP) enabled on port 3389',
      'Primary administrator account Stefanut with password Stefanut005',
      'VirtIO SCSI single disk controller with SSD TRIM/discard on local-lvm'
    ],
    volumes: ['local-lvm:vm-201-disk-1 (40 GB NVMe)', 'local:iso/virtio-win.iso'],
    envVars: ['ADMIN_USER=Stefanut', 'RDP_PORT=3389', 'WINRM_PORT=5985'],
    composeCode: `qm create 201 --name windows-server-2022 --memory 3072 --balloon 2048 --cores 2 --cpu host --machine q35 --bios ovmf --scsi0 local-lvm:40,discard=on,ssd=1 --net0 virtio,bridge=vmbr0`,
    wikiMarkdown: `### Windows Server (VM 201)
Windows Server is provisioned as KVM guest VM 201 with 40 GB NVMe disk and VirtIO drivers.`
  },
  {
    id: 'ubuntu-server',
    name: 'Ubuntu Server 24.04 LTS',
    category: 'vms',
    ip: '192.168.1.202',
    port: 22,
    ipUrl: 'http://192.168.1.202:22',
    domain: 'ubuntu.lan',
    domainUrl: 'http://ubuntu.lan',
    internalUrl: 'http://ubuntu.lan',
    icon: 'terminal',
    color: '#e67e22',
    image: 'Ubuntu 24.04 Noble (Cloud-Init)',
    containerName: 'VM 202',
    status: 'online',
    tags: ['Ubuntu 24.04', 'VM 202', 'Cloud-Init', 'SSH', 'Docker', 'KVM'],
    description: 'Ubuntu Server 24.04 LTS Noble Numbat cloud-init virtual machine configured with user Stefanut, SSH key authorization, and QEMU guest agent.',
    features: [
      'Automated Cloud-Init provisioning with user Stefanut (password: Stefanut005)',
      'QEMU Guest Agent enabled for seamless hypervisor metrics and shutdown sync',
      'Static IP configuration (192.168.1.202/24) with Pi-hole DNS (192.168.1.4)',
      '25 GB NVMe paravirtualized disk with VirtIO SCSI single controller'
    ],
    volumes: ['local-lvm:vm-202-disk-0 (25 GB)', 'local-lvm:vm-202-cloudinit'],
    envVars: ['CI_USER=Stefanut', 'SSH_PORT=22', 'IP=192.168.1.202/24'],
    composeCode: `qm create 202 --name ubuntu-server-2404 --memory 2048 --balloon 1024 --cores 2 --cpu host --scsi0 local-lvm:vm-202-disk-0,discard=on,ssd=1 --ide2 local-lvm:cloudinit --net0 virtio,bridge=vmbr0`,
    wikiMarkdown: `### Ubuntu Server (VM 202)
Ubuntu Server 24.04 LTS runs as VM 202 with cloud-init automation and SSH authentication.`
  }
];
