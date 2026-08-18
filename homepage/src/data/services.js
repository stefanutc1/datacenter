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
  { id: 'productivity', name: 'Productivity & Notes', icon: 'file-text' }
];

export const services = [
  {
    id: 'homeassistant',
    name: 'Home Assistant Core',
    category: 'iot',
    port: 8123,
    internalUrl: 'http://homeassistant.homelab.lan:8123',
    icon: 'home',
    color: '#03a9f4',
    image: 'homeassistant/home-assistant:latest',
    containerName: 'homeassistant',
    status: 'online',
    tags: ['Zigbee', 'Matter', 'Automations', 'IoT', 'MQTT'],
    description: 'Central open-source home automation hub integrating ESP32 nodes, Zigbee sensors, Shelly relays, and custom security scripts.',
    features: [
      'Local-first privacy and telemetry-free automation engine',
      'Integration with ESP32 edge sensors, Frigate NVR, and Zigbee2MQTT',
      'Custom Lovelace dashboards and mobile push notifications via Webhook',
      'Automated night modes, presence detection, and HVAC management'
    ],
    volumes: [
      './configurations.yaml:/config/configuration.yaml',
      './automations.yaml:/config/automations.yaml',
      './scenes.yaml:/config/scenes.yaml',
      './scripts.yaml:/config/scripts.yaml'
    ],
    envVars: [
      'TZ=Europe/Bucharest'
    ],
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
      - ./config:/config
      - /run/dbus:/run/dbus:ro`,
    wikiMarkdown: `### Home Assistant Overview
Home Assistant acts as the main nervous system for the homelab physical environment. It receives sensor telemetry from ESP32 nodes across VLAN 20 (IoT) and coordinates heating, lighting, and security alarms.

#### Network & Security
- Isolated on **VLAN 20 (IoT)** with strict mDNS reflection into **VLAN 10 (Trusted)**.
- Traefik/Nginx Proxy Manager terminates SSL on \`https://hass.homelab.lan\`.
- Authentik SSO proxy protection enabled for external access.`
  },
  {
    id: 'immich',
    name: 'Immich Photos & Video',
    category: 'cloud',
    port: 2283,
    internalUrl: 'http://immich.homelab.lan:2283',
    icon: 'image',
    color: '#4255ff',
    image: 'ghcr.io/immich-app/immich-server:release',
    containerName: 'immich_server',
    status: 'online',
    tags: ['Machine Learning', 'Photo Backup', 'Facial Recognition', 'Clip Search', 'Mobile Sync'],
    description: 'High-performance self-hosted backup solution for photos and videos with on-device machine learning, facial recognition, and CLIP search.',
    features: [
      'Automatic background camera roll backup from iOS & Android devices',
      'Hardware-accelerated transcoding with Intel QuickSync / NVIDIA NVENC',
      'Local facial recognition, semantic CLIP search, and reverse geocoding',
      'Multi-user isolation with shared partner libraries and public albums'
    ],
    volumes: [
      './upload:/usr/src/app/upload',
      '/etc/localtime:/etc/localtime:ro'
    ],
    envVars: [
      'DB_DATABASE_NAME=immich',
      'DB_USERNAME=postgres',
      'REDIS_HOSTNAME=immich_redis'
    ],
    composeCode: `services:
  immich-server:
    container_name: immich_server
    image: ghcr.io/immich-app/immich-server:release
    volumes:
      - /mnt/storage/photos:/usr/src/app/upload
    environment:
      - DB_HOSTNAME=immich_postgres
      - DB_USERNAME=postgres
      - DB_DATABASE_NAME=immich
      - REDIS_HOSTNAME=immich_redis
    ports:
      - "2283:2283"
    restart: unless-stopped`,
    wikiMarkdown: `### Immich Architecture
Immich replaces proprietary cloud storage with self-hosted high-speed backups. It operates a Microservices topology comprising \`immich-server\`, \`immich-machine-learning\`, \`immich_redis\`, and a PostgreSQL database with \`pgvector\` extension for semantic image searches.`
  },
  {
    id: 'vaultwarden',
    name: 'Vaultwarden Password Vault',
    category: 'security',
    port: 8080,
    internalUrl: 'http://vaultwarden.homelab.lan:8080',
    icon: 'lock',
    color: '#175ddc',
    image: 'vaultwarden/server:latest',
    containerName: 'vaultwarden',
    status: 'online',
    tags: ['Bitwarden API', 'Zero-Knowledge', '2FA', 'Passkeys', 'Rust'],
    description: 'Lightweight Bitwarden-compatible password and secret manager written in Rust. Provides end-to-end encrypted storage for passwords, 2FA tokens, and passkeys.',
    features: [
      'Zero-knowledge encryption for secrets, cards, notes, and 2FA seeds',
      'Compatible with official Bitwarden extensions, mobile apps, and CLI',
      'Emergency access, organization vaults, and secure item send',
      'Automated encrypted backups to S3/MinIO via SQLite snapshot hooks'
    ],
    volumes: [
      './vw-data:/data'
    ],
    envVars: [
      'SIGNUPS_ALLOWED=false',
      'WEBSOCKET_ENABLED=true',
      'DOMAIN=https://vault.homelab.lan'
    ],
    composeCode: `services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    environment:
      - SIGNUPS_ALLOWED=false
      - WEBSOCKET_ENABLED=true
      - DOMAIN=https://vault.homelab.lan
    volumes:
      - ./vw-data:/data
    ports:
      - "8080:80"`,
    wikiMarkdown: `### Vaultwarden Security Policy
Vaultwarden is locked down behind Authelia / Cloudflare Tunnel zero-trust authentication. Signups are disabled (\`SIGNUPS_ALLOWED=false\`) post-initialization. Automated backup cron scripts execute daily SQLite VACUUM snapshots replicated to remote storage.`
  },
  {
    id: 'nextcloud',
    name: 'Nextcloud Hub',
    category: 'cloud',
    port: 8081,
    internalUrl: 'http://nextcloud.homelab.lan:8081',
    icon: 'server',
    color: '#0082c9',
    image: 'nextcloud:latest',
    containerName: 'nextcloud-app',
    status: 'online',
    tags: ['Cloud Storage', 'WebDAV', 'Office Docs', 'Contacts', 'Calendar'],
    description: 'Self-hosted productivity platform offering file synchronization, WebDAV endpoints, collaborative online document editing, and calendar/contacts sync.',
    features: [
      'End-to-end synchronized file explorer with desktop and mobile clients',
      'Integrated Nextcloud Office / Collabora Online document editing',
      'CalDAV & CardDAV sync for personal calendar and contact management',
      'High-throughput Redis file locking and MariaDB transactional storage'
    ],
    volumes: [
      './html:/var/www/html',
      './db:/var/lib/mysql'
    ],
    envVars: [
      'MYSQL_DATABASE=nextcloud',
      'REDIS_HOST=nextcloud-redis'
    ],
    composeCode: `services:
  db:
    image: mariadb:10.6
    volumes:
      - ./db:/var/lib/mysql
    environment:
      - MYSQL_DATABASE=nextcloud
    restart: always
  app:
    image: nextcloud:latest
    ports:
      - "8081:80"
    volumes:
      - ./html:/var/www/html
    restart: always`,
    wikiMarkdown: `### Storage Layout
Nextcloud stores user files on a ZFS mirrored storage pool mounted at \`/mnt/storage/nextcloud\`. External WebDAV shares allow seamless integration into mobile operating systems.`
  },
  {
    id: 'grafana',
    name: 'Grafana Telemetry & Dashboards',
    category: 'monitoring',
    port: 3000,
    internalUrl: 'http://grafana.homelab.lan:3000',
    icon: 'bar-chart-2',
    color: '#f46800',
    image: 'grafana/grafana-oss:latest',
    containerName: 'grafana',
    status: 'online',
    tags: ['Prometheus', 'Loki', 'Node Exporter', 'InfluxDB', 'Dashboards'],
    description: 'Industry-standard analytics and interactive visualization platform aggregating metrics from Prometheus, Telegraf, Proxmox, and Docker daemon exporters.',
    features: [
      'Real-time dashboards for CPU, RAM, NVMe ZFS pools, and 10GbE network throughput',
      'Preconfigured alerting rules routing alerts to Discord and Home Assistant mobile app',
      'Logs aggregation and correlation with Grafana Loki',
      'Authentik / Authelia OAuth2 Single Sign-On integration'
    ],
    volumes: [
      'grafana_data:/var/lib/grafana'
    ],
    envVars: [
      'GF_SECURITY_ADMIN_USER=admin',
      'GF_USERS_ALLOW_SIGN_UP=false'
    ],
    composeCode: `services:
  grafana:
    image: grafana/grafana-oss:latest
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana`,
    wikiMarkdown: `### Key Dashboards
1. **Node Exporter Full**: Proxmox host metrics (iowait, temperature, RAM).
2. **OPNsense Firewall Overview**: WAN throughput, states table, and gateway latencies.
3. **ZFS Storage Pool Health**: Pool capacity, scrub progress, and disk IOPS.`
  },
  {
    id: 'prometheus',
    name: 'Prometheus & Alertmanager',
    category: 'monitoring',
    port: 9090,
    internalUrl: 'http://prometheus.homelab.lan:9090',
    icon: 'activity',
    color: '#e6522c',
    image: 'prom/prometheus:latest',
    containerName: 'prometheus',
    status: 'online',
    tags: ['Time Series', 'Metrics Scraping', 'Alertmanager', 'PromQL', 'SNMP'],
    description: 'Time-series monitoring database scraping endpoints across all containers, Proxmox hypervisors, and OPNsense routers on a 15-second polling interval.',
    features: [
      'Service discovery for dynamic Docker and Kubernetes targets',
      'PromQL query engine for real-time alerting and capacity planning',
      'Alertmanager clustering with Discord/Telegram webhook dispatching',
      'Low memory footprint with 30-day WAL retention on NVMe storage'
    ],
    volumes: [
      './prometheus.yml:/etc/prometheus/prometheus.yml',
      './rules:/etc/prometheus/rules',
      'prometheus_data:/prometheus'
    ],
    envVars: [],
    composeCode: `services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=30d'`,
    wikiMarkdown: `### Scraping Targets
- **Node Exporter**: Proxmox VE 01 & 02 (\`:9100\`)
- **cAdvisor**: Docker container CPU/Memory/Network stats (\`:8080\`)
- **OPNsense Telegraf**: Firewall & interface metrics (\`:9273\`)
- **Pi-hole Exporter**: DNS queries & blocked domain stats (\`:9617\`)`
  },
  {
    id: 'uptime-kuma',
    name: 'Uptime Kuma Status Monitor',
    category: 'monitoring',
    port: 3001,
    internalUrl: 'http://uptime.homelab.lan:3001',
    icon: 'check-circle',
    color: '#5cdd8b',
    image: 'louislam/uptime-kuma:latest',
    containerName: 'uptime-kuma',
    status: 'online',
    tags: ['Ping', 'HTTP Check', 'TCP Port', 'Status Page', 'Alerts'],
    description: 'Self-hosted uptime monitoring tool tracking HTTP/HTTPS status, TCP ports, DNS resolution, and SSL certificate expiration across all homelab nodes.',
    features: [
      'Sub-minute health pings for internal services and public endpoints',
      'SSL certificate expiry monitoring with 14-day early warning alerts',
      'Public & internal status pages with incident history and maintenance schedules',
      'Immediate alert delivery to Discord, Pushover, and Telegram channels'
    ],
    volumes: [
      './uptime-kuma-data:/app/data'
    ],
    envVars: [],
    composeCode: `services:
  uptime-kuma:
    image: louislam/uptime-kuma:latest
    container_name: uptime-kuma
    volumes:
      - ./uptime-kuma-data:/app/data
    ports:
      - "3001:3001"
    restart: unless-stopped`,
    wikiMarkdown: `### Monitored Endpoints
Uptime Kuma monitors over 35 healthcheck endpoints including WAN gateway latency, Proxmox cluster quorum, DNS resolution response time, and reverse proxy availability.`
  },
  {
    id: 'n8n',
    name: 'n8n Workflow Automation',
    category: 'automation',
    port: 5678,
    internalUrl: 'http://n8n.homelab.lan:5678',
    icon: 'shuffle',
    color: '#ff6d5a',
    image: 'n8nio/n8n:latest',
    containerName: 'n8n',
    status: 'online',
    tags: ['Webhooks', 'ETL', 'API Integrations', 'AI Agents', 'Automation'],
    description: 'Fair-code workflow automation tool connecting self-hosted APIs, webhooks, databases, and LLMs into automated event-driven pipelines.',
    features: [
      'Visual node-based canvas for orchestrating complex multi-step workflows',
      'Native integrations with Home Assistant, Gitea, Nextcloud, and Postgres',
      'Automated daily backup verification and off-site replication alerts',
      'AI Agent nodes capable of calling internal MCP tools and database queries'
    ],
    volumes: [
      'n8n_data:/home/node/.n8n'
    ],
    envVars: [
      'N8N_ENCRYPTION_KEY=***',
      'N8N_HOST=n8n.homelab.lan',
      'N8N_PORT=5678',
      'N8N_PROTOCOL=https'
    ],
    composeCode: `services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_ENCRYPTION_KEY=your_key_here
    volumes:
      - n8n_data:/home/node/.n8n`,
    wikiMarkdown: `### Active Automations
1. **GitHub/Gitea Release Watcher**: Triggers Docker Compose pull and rollout upon new releases.
2. **Weekly ZFS Scrub Report**: Parses \`zpool status\` and sends summary cards to Discord.
3. **ISP Speedtest & Outage Logger**: Runs hourly speedtests and stores results in InfluxDB.`
  },
  {
    id: 'gitea',
    name: 'Gitea Git Forge & Actions',
    category: 'devops',
    port: 3000,
    internalUrl: 'http://git.homelab.lan:3000',
    icon: 'git-commit',
    color: '#609926',
    image: 'gitea/gitea:latest',
    containerName: 'gitea',
    status: 'online',
    tags: ['Git', 'CI/CD Actions', 'Code Review', 'Container Registry', 'GitOps'],
    description: 'Painless self-hosted Git service providing repository hosting, pull requests, issue tracking, and Gitea Actions CI/CD workflows.',
    features: [
      'Ultra-fast Git operations with low memory footprint (<100MB RAM)',
      'Built-in Gitea Actions compatible with GitHub Actions workflow syntax',
      'Integrated OCI Container Registry for homelab Docker images',
      'SSH key authentication and Webhook integration with Woodpecker CI / n8n'
    ],
    volumes: [
      './data:/data',
      '/etc/timezone:/etc/timezone:ro',
      '/etc/localtime:/etc/localtime:ro'
    ],
    envVars: [
      'GITEA__database__DB_TYPE=sqlite3'
    ],
    composeCode: `services:
  gitea:
    image: gitea/gitea:latest
    container_name: gitea
    restart: unless-stopped
    environment:
      - USER_UID=1000
      - USER_GID=1000
    volumes:
      - ./data:/data
    ports:
      - "3000:3000"
      - "222:22"`,
    wikiMarkdown: `### GitOps & Repository Setup
Gitea hosts the source-of-truth repositories for Ansible playbooks, Terraform infrastructure definitions, and Kubernetes K3s Helm charts.`
  },
  {
    id: 'woodpecker-ci',
    name: 'Woodpecker CI/CD Engine',
    category: 'devops',
    port: 8000,
    internalUrl: 'http://ci.homelab.lan:8000',
    icon: 'play-circle',
    color: '#2185d0',
    image: 'woodpeckerci/woodpecker-server:latest',
    containerName: 'woodpecker-server',
    status: 'online',
    tags: ['Continuous Integration', 'Pipelines', 'Docker in Docker', 'Builds'],
    description: 'Lightweight community-driven continuous integration server. Executes automated pipeline steps inside isolated Docker containers.',
    features: [
      'Declarative pipeline syntax (\`.woodpecker.yaml\`) with containerized steps',
      'Automated linting, unit testing, and multi-arch Docker image builds',
      'Secret management with repository and organization level access control',
      'Direct deployment webhooks into Proxmox and Kubernetes clusters'
    ],
    volumes: [
      'woodpecker-server-data:/var/lib/woodpecker'
    ],
    envVars: [
      'WOODPECKER_OPEN=true',
      'WOODPECKER_HOST=http://ci.homelab.lan:8000'
    ],
    composeCode: `services:
  woodpecker-server:
    image: woodpeckerci/woodpecker-server:latest
    container_name: woodpecker-server
    restart: unless-stopped
    ports:
      - "8000:8000"
      - "9000:9000"
    environment:
      - WOODPECKER_OPEN=true
      - WOODPECKER_HOST=http://ci.homelab.lan:8000
    volumes:
      - woodpecker-server-data:/var/lib/woodpecker
  woodpecker-agent:
    image: woodpeckerci/woodpecker-agent:latest
    container_name: woodpecker-agent
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock`,
    wikiMarkdown: `### Pipelines
Woodpecker builds and publishes Docker containers for internal tools, runs Ansible syntax linters, and validates Terraform infrastructure manifests automatically on commit.`
  },
  {
    id: 'nginx-proxy-manager',
    name: 'Nginx Proxy Manager',
    category: 'networking',
    port: 81,
    internalUrl: 'http://npm.homelab.lan:81',
    icon: 'globe',
    color: '#009688',
    image: 'jc21/nginx-proxy-manager:2.11.3',
    containerName: 'nginx-proxy-manager',
    status: 'online',
    tags: ["Reverse Proxy", "Let's Encrypt SSL", "Wildcard Certs", "Access Lists"],
    description: "Intuitive web management UI for forward and reverse proxy routing, automated Let's Encrypt SSL certificate provisioning, and HTTP security policies.",
    features: [
      'Automated DNS-01 challenge SSL certificate renewal with Cloudflare API',
      'Fine-grained IP Access Lists and HTTP Basic Authentication overlays',
      'Custom Nginx location blocks, WebSocket proxying, and HTTP/2 support',
      'Stream routing for TCP/UDP database and game server ports'
    ],
    volumes: [
      './data:/data',
      './letsencrypt:/etc/letsencrypt'
    ],
    envVars: [
      'DISABLE_IPV6=true'
    ],
    composeCode: `services:
  npm:
    image: jc21/nginx-proxy-manager:2.11.3
    container_name: nginx-proxy-manager
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "81:81"
    environment:
      - DISABLE_IPV6=true
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt`,
    wikiMarkdown: `### Proxy Routing Overview
NPM routes all incoming traffic from \`*.homelab.lan\` domains directly to the corresponding container ports with HTTP Strict Transport Security (HSTS) headers.`
  },
  {
    id: 'pi-hole',
    name: 'Pi-hole DNS Sinkhole & Adblock',
    category: 'networking',
    port: 8082,
    internalUrl: 'http://pihole.homelab.lan:8082/admin',
    icon: 'shield',
    color: '#f03a17',
    image: 'pihole/pihole:latest',
    containerName: 'pihole',
    status: 'online',
    tags: ['DNS Sinkhole', 'Ad Blocking', 'Local DNS Records', 'DHCP', 'DoH'],
    description: 'Network-wide advertisement blocking and DNS sinkhole protecting all homelab and home network devices without client-side software.',
    features: [
      'Blocks tracking domains, telemetry, and malware at the DNS level',
      'Authoritative local DNS resolver mapping \`*.homelab.lan\` hostnames',
      'High-speed in-memory caching reducing DNS lookup latency to <1ms',
      'Upstream DNS-over-HTTPS (DoH) forwarding through Cloudflare & Quad9'
    ],
    volumes: [
      './etc-pihole:/etc/pihole',
      './etc-dnsmasq.d:/etc/dnsmasq.d'
    ],
    envVars: [
      'TZ=Europe/Bucharest',
      'WEBPASSWORD=***'
    ],
    composeCode: `services:
  pihole:
    image: pihole/pihole:latest
    container_name: pihole
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "8082:80"
    environment:
      - TZ=Europe/Bucharest
    volumes:
      - ./etc-pihole:/etc/pihole
      - ./etc-dnsmasq.d:/etc/dnsmasq.d
    restart: unless-stopped`,
    wikiMarkdown: `### DNS Configuration
Primary DNS server is configured via OPNsense DHCP server to broadcast Pi-hole IP \`10.0.10.5\` across all client subnets.`
  },
  {
    id: 'netbird',
    name: 'NetBird Zero-Trust Mesh VPN',
    category: 'networking',
    port: 33073,
    internalUrl: 'https://netbird.homelab.lan:33073',
    icon: 'radio',
    color: '#ff6600',
    image: 'netbirdio/netbird:0.28.8',
    containerName: 'netbird-client',
    status: 'online',
    tags: ['WireGuard', 'Zero-Trust', 'Peer-to-Peer', 'Mesh VPN', 'MFA'],
    description: 'Zero-configuration WireGuard-based overlay network connecting remote laptops, mobile devices, and off-site servers directly into the homelab private mesh.',
    features: [
      'High-speed peer-to-peer WireGuard connections bypassing NAT and CGNAT',
      'Identity-aware access control routing specific services to authorized users',
      'Encrypted mesh tunnels with kernel-level performance on Linux nodes',
      'DNS routing over mesh with internal domain split-tunneling'
    ],
    volumes: [],
    envVars: [
      'NB_MANAGEMENT_URL=https://netbird.homelab.lan:33073'
    ],
    composeCode: `services:
  netbird-client:
    image: netbirdio/netbird:0.28.8
    container_name: netbird-client
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
      - SYS_ADMIN
    environment:
      - NB_MANAGEMENT_URL=https://netbird.homelab.lan:33073`,
    wikiMarkdown: `### Mesh Network
NetBird assigns each node an immutable IP address in the \`100.64.0.0/10\` CGNAT range, allowing direct SSH, Proxmox web access, and NFS shares from anywhere securely.`
  },
  {
    id: 'authelia',
    name: 'Authelia 2FA & SSO Portal',
    category: 'security',
    port: 9091,
    internalUrl: 'http://authelia.homelab.lan:9091',
    icon: 'key',
    color: '#0055ff',
    image: 'authelia/authelia:latest',
    containerName: 'authelia',
    status: 'online',
    tags: ['Single Sign-On', 'FIDO2 / WebAuthn', 'TOTP 2FA', 'OpenID Connect'],
    description: 'Open-source authentication and authorization server providing two-factor authentication and single sign-on (SSO) protection for reverse-proxied homelab web apps.',
    features: [
      'Multi-factor authentication supporting hardware security keys (FIDO2/WebAuthn) and TOTP',
      'Forward auth integration with Nginx Proxy Manager and Traefik',
      'OpenID Connect (OIDC) identity provider for Grafana, Gitea, and Nextcloud',
      'Brute-force protection and IP-based rate limiting'
    ],
    volumes: [
      './config:/config'
    ],
    envVars: [],
    composeCode: `services:
  authelia:
    image: authelia/authelia:latest
    container_name: authelia
    restart: unless-stopped
    ports:
      - "9091:9091"
    volumes:
      - ./config:/config`,
    wikiMarkdown: `### Protection Policy
Critical services without native multi-user security (e.g. Scrutiny, IT-Tools, ChangeDetection) are guarded behind Authelia 2FA forward auth gateways.`
  },
  {
    id: 'authentik',
    name: 'Authentik Identity Provider',
    category: 'security',
    port: 9000,
    internalUrl: 'http://authentik.homelab.lan:9000',
    icon: 'user-check',
    color: '#e84393',
    image: 'ghcr.io/goauthentik/server:latest',
    containerName: 'authentik_server',
    status: 'online',
    tags: ['OAuth2', 'SAML', 'LDAP Outpost', 'Enterprise SSO', 'Identity'],
    description: 'Comprehensive identity management platform with built-in OAuth2/OIDC, SAML, and LDAP outpost proxies for directory synchronization across all services.',
    features: [
      'Enterprise-grade OAuth2 and OpenID Connect provider',
      'Embedded LDAP outpost allowing legacy appliances to authenticate against single database',
      'Custom user enrollment, password self-service, and Passkey passcodes',
      'Detailed audit logs and session management with instantaneous revocation'
    ],
    volumes: [
      './media:/media',
      './custom-templates:/templates'
    ],
    envVars: [
      'AUTHENTIK_SECRET_KEY=***',
      'AUTHENTIK_REDIS__HOST=redis'
    ],
    composeCode: `services:
  server:
    image: ghcr.io/goauthentik/server:latest
    container_name: authentik_server
    restart: unless-stopped
    ports:
      - "9000:9000"
      - "9443:9443"
    environment:
      - AUTHENTIK_REDIS__HOST=redis
      - AUTHENTIK_POSTGRESQL__HOST=postgresql`,
    wikiMarkdown: `### Enterprise Identity
Authentik centralizes all homelab accounts into a single directory, providing SSO across Gitea, Grafana, Nextcloud, and Proxmox VE.`
  },
  {
    id: 'crowdsec',
    name: 'CrowdSec Cyber Defense & LAPI',
    category: 'security',
    port: 8080,
    internalUrl: 'http://crowdsec.homelab.lan:8080',
    icon: 'shield-alert',
    color: '#0984e3',
    image: 'crowdsecurity/crowdsec:latest',
    containerName: 'crowdsec',
    status: 'online',
    tags: ['Intrusion Prevention', 'Log Parsing', 'Crowdsourced CTI', 'Bouncer', 'Firewall'],
    description: 'Collaborative, open-source security engine analyzing logs from Nginx, OPNsense, and SSH daemons to detect brute-force attacks and apply instant IP bans.',
    features: [
      'Real-time behavioral log analysis for SSH, HTTP 4xx scanners, and API abusers',
      'Crowdsourced reputation database sharing malicious IP blocklists globally',
      'Remediation bouncers installed on OPNsense firewall and Nginx reverse proxies',
      'Prometheus metric export for Grafana intrusion monitoring'
    ],
    volumes: [
      '/var/log:/var/log:ro',
      './config:/etc/crowdsec',
      './data:/var/lib/crowdsec/data'
    ],
    envVars: [],
    composeCode: `services:
  crowdsec:
    image: crowdsecurity/crowdsec:latest
    container_name: crowdsec
    restart: unless-stopped
    environment:
      - COLLECTIONS=crowdsecurity/nginx crowdsecurity/sshd
    volumes:
      - /var/log:/var/log:ro
      - ./config:/etc/crowdsec`,
    wikiMarkdown: `### Collaborative Security
When CrowdSec detects port scanning or dictionary attacks on public services, it pushes the offending IP to OPNsense pf tables and reports the signature to the global threat mesh.`
  },
  {
    id: 'frigate',
    name: 'Frigate NVR & AI Vision',
    category: 'iot',
    port: 5000,
    internalUrl: 'http://frigate.homelab.lan:5000',
    icon: 'video',
    color: '#00cec9',
    image: 'ghcr.io/blakeblackshear/frigate:stable',
    containerName: 'frigate',
    status: 'online',
    tags: ['NVR', 'Google Coral TPU', 'Object Detection', 'RTSP', 'Home Assistant'],
    description: 'Complete network video recorder (NVR) with real-time AI object detection powered by Google Coral TPU and hardware-accelerated video decoding.',
    features: [
      'Sub-10ms object detection for persons, vehicles, and pets using Coral Edge TPU',
      'RTSP/WebRTC low-latency camera stream restreaming with go2rtc',
      'Rich event clips and snapshot publishing to Home Assistant via MQTT',
      'Continuous 24/7 recording with retention tiering based on motion triggers'
    ],
    volumes: [
      '/etc/localtime:/etc/localtime:ro',
      './config.yml:/config/config.yml:ro',
      '/mnt/storage/nvr:/media/frigate'
    ],
    envVars: [
      'FRIGATE_RTSP_PASSWORD=***'
    ],
    composeCode: `services:
  frigate:
    container_name: frigate
    privileged: true
    restart: unless-stopped
    image: ghcr.io/blakeblackshear/frigate:stable
    shm_size: "128mb"
    devices:
      - /dev/bus/usb:/dev/bus/usb
    volumes:
      - ./config.yml:/config/config.yml
      - /mnt/storage/nvr:/media/frigate
    ports:
      - "5000:5000"
      - "8554:8554"
      - "8555:8555/tcp"
      - "8555:8555/udp"`,
    wikiMarkdown: `### Hardware Acceleration
Frigate leverages an M.2 Google Coral Edge TPU and Intel QuickSync / iGPU VA-API for decoding 4K H.265 camera feeds at minimal CPU utilization.`
  },
  {
    id: 'arr-suite',
    name: 'Servarr Media Automation Suite',
    category: 'media',
    port: 8096,
    internalUrl: 'http://jellyfin.homelab.lan:8096',
    icon: 'tv',
    color: '#a29bfe',
    image: 'jellyfin/jellyfin:latest',
    containerName: 'jellyfin',
    status: 'online',
    tags: ['Jellyfin', 'Sonarr', 'Radarr', 'Prowlarr', 'Bazarr', 'Transmission'],
    description: 'Integrated media center and automated collection pipeline featuring Jellyfin streaming server, Sonarr/Radarr indexers, Prowlarr proxies, and Transmission.',
    features: [
      'Jellyfin Media Server with 4K HDR transcoding and multi-device streaming',
      'Sonarr (TV:8989) and Radarr (Movies:7878) automated quality management',
      'Prowlarr (9696) centralized Torrent/Usenet tracker management',
      'Bazarr (6767) subtitle synchronization in multiple languages'
    ],
    volumes: [
      '/mnt/storage/media:/media',
      './config:/config'
    ],
    envVars: [
      'PUID=1000',
      'PGID=1000',
      'TZ=Europe/Bucharest'
    ],
    composeCode: `services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    ports:
      - "8096:8096"
    volumes:
      - ./jellyfin/config:/config
      - /mnt/storage/media:/media
    restart: unless-stopped`,
    wikiMarkdown: `### Port Map for Media Suite
- **Jellyfin**: \`8096\`
- **Sonarr**: \`8989\`
- **Radarr**: \`7878\`
- **Prowlarr**: \`9696\`
- **Bazarr**: \`6767\`
- **Transmission**: \`9091\``
  },
  {
    id: 'actualbudget',
    name: 'Actual Budget',
    category: 'productivity',
    port: 5006,
    internalUrl: 'http://budget.homelab.lan:5006',
    icon: 'dollar-sign',
    color: '#00b894',
    image: 'actualbudget/actual-server:latest',
    containerName: 'actualbudget',
    status: 'online',
    tags: ['Personal Finance', 'Zero-Based Budget', 'Bank Sync', 'Privacy', 'SQLite'],
    description: 'Privacy-focused zero-based envelope personal budgeting application with multi-device synchronization, bank syncing, and end-to-end encryption.',
    features: [
      'Zero-based envelope budgeting method keeping finances intentional',
      'End-to-end client encryption with offline-first desktop & mobile apps',
      'Automated bank account transaction imports through GoCardless / SimpleFIN',
      'Fast and reliable SQLite database backend with automated file backups'
    ],
    volumes: [
      './actual-data:/data'
    ],
    envVars: [],
    composeCode: `services:
  actualbudget:
    image: actualbudget/actual-server:latest
    container_name: actualbudget
    restart: unless-stopped
    ports:
      - "5006:5006"
    volumes:
      - ./actual-data:/data`,
    wikiMarkdown: `### Financial Privacy
Actual Budget keeps all bank accounts, transaction histories, and budgets private on the homelab NVMe storage without third-party cloud data harvesting.`
  },
  {
    id: 'alist',
    name: 'AList Unified Storage Aggregator',
    category: 'cloud',
    port: 5244,
    internalUrl: 'http://alist.homelab.lan:5244',
    icon: 'hard-drive',
    color: '#0984e3',
    image: 'xhofe/alist:latest',
    containerName: 'alist',
    status: 'online',
    tags: ['WebDAV', 'Cloud Aggregator', 'S3', 'Google Drive', 'OneDrive'],
    description: 'File list program supporting multiple storage backends, mounting local disks, S3 buckets, Google Drive, and OneDrive into a single unified WebDAV gateway.',
    features: [
      'Aggregates local ZFS storage, remote S3 buckets, and cloud drives into one portal',
      'WebDAV protocol server allowing desktop file manager mounts',
      'Online preview for videos, audio, PDF, office documents, and code files',
      'Multi-threaded download acceleration and batch offline download engine'
    ],
    volumes: [
      './data:/opt/alist/data',
      '/mnt/storage:/mnt/storage'
    ],
    envVars: [],
    composeCode: `services:
  alist:
    image: xhofe/alist:latest
    container_name: alist
    restart: unless-stopped
    volumes:
      - ./data:/opt/alist/data
      - /mnt/storage:/mnt/storage
    ports:
      - "5244:5244"
    environment:
      - PUID=0
      - PGID=0
      - UMASK=022`,
    wikiMarkdown: `### Storage Gateway
AList acts as a file gateway across physical servers and cloud buckets, providing uniform WebDAV endpoints for Kodi and mobile media players.`
  },
  {
    id: 'filebrowser',
    name: 'FileBrowser Web Manager',
    category: 'cloud',
    port: 8080,
    internalUrl: 'http://files.homelab.lan:8080',
    icon: 'folder',
    color: '#6c5ce7',
    image: 'filebrowser/filebrowser:latest',
    containerName: 'filebrowser',
    status: 'online',
    tags: ['File Manager', 'Web Interface', 'Upload/Download', 'User Permissions'],
    description: 'Clean and lightweight web-based file manager for uploading, managing, editing, and sharing files directly from homelab storage directories.',
    features: [
      'Modern web UI for browsing ZFS datasets and Docker volume directories',
      'In-browser text and code editor with syntax highlighting',
      'Public sharing links with custom expiration dates and passwords',
      'Granular user permissions and path restrictions'
    ],
    volumes: [
      '/mnt/storage:/srv',
      './filebrowser.db:/database/filebrowser.db',
      './settings.json:/config/settings.json'
    ],
    envVars: [],
    composeCode: `services:
  filebrowser:
    image: filebrowser/filebrowser:latest
    container_name: filebrowser
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - /mnt/storage:/srv
      - ./filebrowser.db:/database/filebrowser.db
      - ./settings.json:/config/settings.json`,
    wikiMarkdown: `### Administration
FileBrowser provides emergency web-based access to configuration files, ISO installers, and container volumes when SSH is not convenient.`
  },
  {
    id: 'trillium-notes',
    name: 'Trilium Personal Knowledge Base',
    category: 'productivity',
    port: 8080,
    internalUrl: 'http://notes.homelab.lan:8080',
    icon: 'book-open',
    color: '#6c5ce7',
    image: 'zedrr/trilium:latest',
    containerName: 'trilium-notes',
    status: 'online',
    tags: ['Knowledge Base', 'Hierarchical Notes', 'Markdown', 'Code Snippets', 'Diagrams'],
    description: 'Hierarchical note-taking application designed for building large personal knowledge bases, system runbooks, and technical documentation.',
    features: [
      'Tree structure with infinite note hierarchy and note cloning attributes',
      'Rich Markdown editor, code execution sandbox, and embedded Excalidraw diagrams',
      'End-to-end synchronization with desktop desktop clients',
      'Full-text search, note encryption, and version history snapshots'
    ],
    volumes: [
      'trilium-data:/home/node/trilium-data'
    ],
    envVars: [],
    composeCode: `services:
  trilium:
    image: zedrr/trilium:latest
    container_name: trilium-notes
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - trilium-data:/home/node/trilium-data`,
    wikiMarkdown: `### Homelab Runbooks
Trilium stores all disaster recovery procedures, hardware serial numbers, network IP allocations, and step-by-step service onboarding runbooks.`
  },
  {
    id: 'scrutiny',
    name: 'Scrutiny S.M.A.R.T. Drive Health',
    category: 'monitoring',
    port: 8080,
    internalUrl: 'http://scrutiny.homelab.lan:8080',
    icon: 'disc',
    color: '#e17055',
    image: 'ghcr.io/analogj/scrutiny:master-omnibus',
    containerName: 'scrutiny',
    status: 'online',
    tags: ['Hard Drives', 'NVMe', 'S.M.A.R.T. Health', 'Temperature', 'Failure Prediction'],
    description: 'Hard drive S.M.A.R.T. health monitoring and dashboard service tracking drive temperatures, bad sectors, power-on hours, and failure probability.',
    features: [
      'Automatic S.M.A.R.T. attribute scraping across SATA SSDs, HDDs, and NVMe drives',
      'Historical temperature tracking and degradation curve forecasting',
      'Failure prediction thresholds based on Backblaze disk statistics',
      'Discord and email notifications on drive health threshold breaches'
    ],
    volumes: [
      '/run/udev:/run/udev:ro',
      'scrutiny_data:/opt/scrutiny/config',
      'scrutiny_db:/opt/scrutiny/influxdb'
    ],
    envVars: [],
    composeCode: `services:
  scrutiny:
    image: ghcr.io/analogj/scrutiny:master-omnibus
    container_name: scrutiny
    restart: unless-stopped
    ports:
      - "8080:8080"
      - "8086:8086"
    cap_add:
      - SYS_RAWIO
      - SYS_ADMIN
    volumes:
      - /run/udev:/run/udev:ro
      - scrutiny_data:/opt/scrutiny/config
      - scrutiny_db:/opt/scrutiny/influxdb
    devices:
      - /dev/sda
      - /dev/sdb
      - /dev/nvme0n1`,
    wikiMarkdown: `### Storage Array Health
Scrutiny monitors all 8 SAS/SATA drives in the main ZFS array and the NVMe cache drives on Proxmox nodes to detect failing disks before data loss occurs.`
  },
  {
    id: 'it-tools',
    name: 'IT-Tools Handy Utilities',
    category: 'productivity',
    port: 8080,
    internalUrl: 'http://tools.homelab.lan:8080',
    icon: 'tool',
    color: '#00cec9',
    image: 'corentinth/it-tools:latest',
    containerName: 'it-tools',
    status: 'online',
    tags: ['Developer Tools', 'JWT', 'Base64', 'Subnet Calc', 'Cert Inspector', 'Regex'],
    description: 'Collection of handy online tools for developers, sysadmins, and engineers: JWT decoders, Subnet calculators, Docker run converters, and Hash generators.',
    features: [
      'Over 70+ built-in developer tools running entirely client-side in browser',
      'Network subnet calculators, CIDR lookups, and MAC address parsers',
      'Cryptography tools: HMAC, RSA key generator, Bcrypt hasher, and UUID generator',
      'Formatters and converters for JSON, YAML, TOML, XML, and SQL'
    ],
    volumes: [],
    envVars: [],
    composeCode: `services:
  it-tools:
    image: corentinth/it-tools:latest
    container_name: it-tools
    restart: unless-stopped
    ports:
      - "8080:80"`,
    wikiMarkdown: `### Offline Utility Suite
IT-Tools is deployed locally to ensure all token parsing, base64 decoding, and certificate inspection happens securely without leaking secrets to third-party web tools.`
  },
  {
    id: 'changedetection',
    name: 'ChangeDetection.io Website Monitor',
    category: 'automation',
    port: 5000,
    internalUrl: 'http://changedetection.homelab.lan:5000',
    icon: 'eye',
    color: '#fdcb6e',
    image: 'ghcr.io/dgtlmoon/changedetection.io:latest',
    containerName: 'changedetection',
    status: 'online',
    tags: ['Web Scraping', 'Change Monitoring', 'Restock Alert', 'Price Tracker', 'Diff Viewer'],
    description: 'Automated website change detection, price monitoring, and restock notification engine with visual browser-based diff inspection.',
    features: [
      'Monitors web pages, API endpoints, and PDF documents for content changes',
      'Visual CSS selector filtering and JavaScript rendering with Playwright',
      'Visual interactive diff viewer highlighting added and removed text',
      'Webhook notifications dispatched to Discord, Home Assistant, and Matrix'
    ],
    volumes: [
      './datastore:/datastore'
    ],
    envVars: [],
    composeCode: `services:
  changedetection:
    image: ghcr.io/dgtlmoon/changedetection.io:latest
    container_name: changedetection
    hostname: changedetection
    volumes:
      - ./datastore:/datastore
    ports:
      - "5000:5000"
    restart: unless-stopped`,
    wikiMarkdown: `### Change Alerts
Tracks firmware release pages, security advisory CVE feeds, and hardware restock availability automatically.`
  },
  {
    id: 'opnsense',
    name: 'OPNsense Core Firewall & HAProxy',
    category: 'networking',
    port: 443,
    internalUrl: 'https://opnsense.homelab.lan',
    icon: 'shield',
    color: '#d63031',
    image: 'Bare-Metal Appliance / FreeBSDBase',
    containerName: 'opnsense-core-firewall',
    status: 'online',
    tags: ['Firewall', 'VLANs', 'HAProxy', 'WireGuard', 'Unbound DNS', 'Suricata IDS'],
    description: 'Dedicated enterprise router and firewall gateway managing multi-gigabit WAN connectivity, inter-VLAN routing, and stateful packet inspection.',
    features: [
      'Stateful packet inspection with Suricata IDS/IPS intrusion prevention',
      'Inter-VLAN firewall rules isolating Management, Trusted, IoT, and DMZ tiers',
      'Dual-WAN failover with automatic latency and packet loss tracking',
      'Embedded HAProxy reverse proxy load balancing internal ingress traffic'
    ],
    volumes: [
      './topology.md',
      './telegraf.conf',
      './backup.py'
    ],
    envVars: [],
    composeCode: `# OPNsense runs on dedicated appliance hardware or Proxmox VM with PCI-e NIC passthrough.
# Config files in services/opnsense contain Telegraf exporters and backup scripts.`,
    wikiMarkdown: `### Network Subnets (VLAN Topology)
- **VLAN 10 (Management)**: \`10.0.10.0/24\` (Proxmox nodes, IPMI, Switches, PDUs)
- **VLAN 20 (IoT)**: \`10.0.20.0/24\` (Home Assistant, ESP32 sensors, Zigbee gateways, IP cameras)
- **VLAN 30 (Services / Compute)**: \`10.0.30.0/24\` (Docker nodes, Kubernetes K3s, Storage)
- **VLAN 40 (DMZ / Ingress)**: \`10.0.40.0/24\` (Reverse proxies, public facing services)`
  }
];
