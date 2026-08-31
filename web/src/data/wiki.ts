export interface WikiArticle {
  id: string;
  section: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  content: string;
}

export interface CyberTool {
  name: string;
  category: string;
  port: number;
  status: string;
  type: string;
  logo: string;
}

export const homelabArticles: WikiArticle[] = [
  {
    id: "overview",
    section: "homelab",
    title: "system overview",
    category: "architecture",
    icon: "sys",
    summary: "high-level architecture, design philosophy, and hardware topology.",
    content: `# homelab infrastructure overview

the homelab is a fully declarative, self-hosted infrastructure platform engineered on **proxmox ve 8/9**, **ansible**, **terraform**, and a **k3s kubernetes** cluster with **fluxcd gitops** continuous reconciliation.

## core design principles

1. **infrastructure as code (iac)**: every virtual machine, network bridge, and firewall policy is declared in code.
2. **zero-trust network segmentation**: workloads are isolated across dedicated vlans (management, core, apps, k8s, iot).
3. **automated hardening**: cis benchmark kernel sysctl parameters and restrictive access controls deployed via ansible.
4. **gitops continuous delivery**: kubernetes manifests reconciled automatically from github with self-healing.
5. **edge iot convergence**: direct telemetry integration with esp32 microcontrollers for garden irrigation and occupancy sensing.

---

## high-level topology

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│                    proxmox ve hypervisor                     │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  core infrastructure (vlan 10)                        │   │
│  │  opnsense firewall · pi-hole dns · tailscale mesh     │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  ingress & authentication (vlan 10)                   │   │
│  │  nginx proxy manager (ssl) · authelia sso + 2fa       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  observability stack (vlan 20)                        │   │
│  │  prometheus + alertmanager · grafana · uptime kuma    │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  application services (vlan 20)                       │   │
│  │  immich · nextcloud · vaultwarden · n8n · gitea      │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  k3s kubernetes cluster (vlan 30)                     │   │
│  │  fluxcd gitops synchronization engine                 │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
\`\`\`
`
  },
  {
    id: "networking",
    section: "homelab",
    title: "vlans & networking",
    category: "architecture",
    icon: "net",
    summary: "opnsense layer-3 routing, vlan segmentation, wireguard mesh, and pi-hole adblocking.",
    content: `# vlan architecture & network segmentation

network isolation is managed through **opnsense** virtual firewall and physical managed layer-2 switches.

## vlan matrix

| vlan id | subnet | name | access rules |
| :---: | :--- | :--- | :--- |
| **1** | \`192.168.1.0/24\` | management | physical hypervisor, ipmi, switches. admin-only mac whitelist. |
| **10** | \`192.168.10.0/24\` | core & ingress | reverse proxy, opnsense, authelia sso, pi-hole dns. |
| **20** | \`192.168.20.0/24\` | apps & storage | media, nextcloud, immich, vaultwarden. no direct wan exposure. |
| **30** | \`192.168.30.0/24\` | kubernetes (k3s) | worker and control plane nodes. overlay pod network: \`10.42.0.0/16\`. |
| **40** | \`192.168.40.0/24\` | iot & esp32 | isolated edge devices, mqtt traffic to home assistant only. |
`
  },
  {
    id: "iac",
    section: "homelab",
    title: "iac & automation",
    category: "automation",
    icon: "iac",
    summary: "ansible playbooks, cis system hardening, and terraform proxmox vm modules.",
    content: `# infrastructure as code & system hardening

all nodes are provisioned and configured automatically without manual interventions.

## 1. terraform proxmox vm module (\`terraform/modules/proxmox_vm/\`)
provisions cloud-init enabled ubuntu 24.04 lts virtual machines:
- dynamic cpu and memory allocation
- virtio disk bus with ssd emulation and \`discard=on\`
- automated ssh ed25519 key injection

## 2. ansible system hardening (\`ansible/roles/system_hardening/\`)
enforces cis level 1 benchmark baselines:
- kernel sysctl hardening (\`net.ipv4.tcp_syncookies = 1\`, \`fs.protected_hardlinks = 1\`)
- restrictive default umask (\`027\`)
- passwordless sudo disabled for standard accounts
`
  },
  {
    id: "services",
    section: "homelab",
    title: "services catalog & hardware allocations",
    category: "catalog",
    icon: "svc",
    summary: "comprehensive catalog of self-hosted services with per-container ram and storage allocations across x86_64 and arm64 nodes.",
    content: `# self-hosted application catalog & hardware allocations

the platform operates containerized microservices and virtual machines distributed across dual proxmox hypervisors:

---

## 1. node 1 (x86_64 core · 192.168.1.132)

| vmid / id | service | ram allocated | storage allocated | ip & port | domain | description |
| :---: | :--- | :---: | :---: | :--- | :--- | :--- |
| **vm 200** | opnsense gateway | 1024 mb (1 gb) | 16 gb ssd | \`192.168.1.132:8443\` | \`opnsense.lan\` | core stateful firewall & wireguard router |
| **vm 201** | windows server 2025 | 4096 mb (4 gb) | 120 gb nvme | \`192.168.1.132:3389\` | \`winserver.lan\` | active directory, rdp, enterprise services |
| **ct 100** | nginx proxy manager | 112 mb | 4 gb ssd | \`192.168.1.3:81\` | \`nginx.lan\` | reverse proxy & let's encrypt ssl certificates |
| **ct 101** | pi-hole dns | 96 mb | 4 gb ssd | \`192.168.1.4:80\` | \`pihole.lan\` | dns sinkhole & adblock resolver |
| **ct 102** | tailscale mesh | 96 mb | 4 gb ssd | \`192.168.1.5\` | \`tailscale.lan\` | wireguard mesh subnet router |
| **ct 103** | immich photos & ai | 896 mb | 40 gb ssd | \`192.168.1.15:2283\` | \`immich.lan\` | photo backup & facial recognition |
| **ct 104** | nextcloud hub | 96 mb | 20 gb ssd | \`192.168.1.8:80\` | \`nextcloud.lan\` | self-hosted cloud storage & file sync |
| **ct 105** | crowdsec ips | 128 mb | 4 gb ssd | \`192.168.1.9:8080\` | \`crowdsec.lan\` | intrusion prevention & lapi defense |
| **ct 106** | home assistant | 384 mb | 16 gb ssd | \`192.168.1.10:8123\` | \`ha.lan\` | smart home automation & esp32 hub |
| **ct 107** | n8n automations | 384 mb | 8 gb ssd | \`192.168.1.13:5678\` | \`n8n.lan\` | workflow automation & webhook engine |
| **ct 108** | scrutiny smart (x64) | 96 mb | 4 gb ssd | \`192.168.1.18:8080\` | \`scrutiny.lan\` | nvme/sata smart disk health monitor |
| **ct 109** | media suite (jellyfin) | 896 mb | 50 gb ssd | \`192.168.1.21:8096\` | \`jellyfin.lan\` | jellyfin, radarr, sonarr, prowlarr, qbittorrent |

---

## 2. node 3 (arm64 utility · 192.168.64.14)

| vmid / id | service | ram allocated | storage allocated | ip & port | domain | boot policy | description |
| :---: | :--- | :---: | :---: | :--- | :--- | :---: | :--- |
| **ct 100** | it-tools | 64 mb | 2 gb nvme | \`192.168.64.15:8080\` | \`it-tools.lan\` | on-demand | developer web tools & utilities |
| **ct 101** | actual budget | 160 mb | 4 gb nvme | \`192.168.64.16:5006\` | \`actualbudget.lan\` | on-demand | zero-based private budgeting |
| **ct 102** | trilium notes | 160 mb | 8 gb nvme | \`192.168.64.17:8080\` | \`trilium.lan\` | on-demand | hierarchical knowledge base |
| **ct 103** | changedetection | 160 mb | 4 gb nvme | \`192.168.64.18:5000\` | \`changedetection.lan\` | on-demand | web page diff & restock monitor |
| **ct 104** | scrutiny smart (arm) | 96 mb | 4 gb nvme | \`192.168.64.19:8088\` | \`scrutiny-arm.lan\` | onboot: 1 | apple silicon nvme smart health |
| **ct 105** | uptime kuma | 80 mb | 4 gb nvme | \`192.168.64.23:3001\` | \`uptime.lan\` | onboot: 1 | real-time service status monitor |
| **ct 106** | vaultwarden | 96 mb | 4 gb nvme | \`192.168.64.21:8080\` | \`vaultwarden.lan\` | on-demand | rust password vault |
| **ct 107** | monitoring (grafana) | 448 mb | 16 gb nvme | \`192.168.64.24:3000\` | \`grafana.lan\` | onboot: 1 | prometheus, grafana & loki logs |
| **ct 108** | authelia 2fa | 96 mb | 4 gb nvme | \`192.168.64.20:9091\` | \`auth.lan\` | on-demand | 2fa sso portal |
| **ct 109** | gitea forge | 160 mb | 10 gb nvme | \`192.168.64.25:3000\` | \`git.lan\` | on-demand | git repository & actions forge |
| **ct 110** | woodpecker ci | 192 mb | 8 gb nvme | \`192.168.64.26:8000\` | \`ci.lan\` | on-demand | container ci/cd pipeline engine |
`
  },
  {
    id: "k8s",
    section: "homelab",
    title: "kubernetes & gitops",
    category: "kubernetes",
    icon: "k8s",
    summary: "k3s lightweight cluster architecture and fluxcd git repository reconciliation.",
    content: `# kubernetes (k3s) & fluxcd gitops

workloads requiring high availability and automatic horizontal scaling run on a multi-node **k3s** cluster.

## fluxcd continuous delivery
manifests under \`kubernetes/gitops/clusters/homelab/\` are continuously tracked by fluxcd:
- **polling interval**: 5 minutes
- **pruning**: enabled (orphaned resources automatically garbage collected)
- **kustomization**: modular overlay structures for dev and production
`
  },
  {
    id: "monitoring",
    section: "homelab",
    title: "monitoring & alerting",
    category: "observability",
    icon: "mon",
    summary: "prometheus metrics scraping, discord webhook alert routing, and grafana dashboards.",
    content: `# observability & alerting stack

## 1. prometheus metrics collection
scrapes metrics from \`node_exporter\`, \`cadvisor\`, and native application metrics endpoints every 15s.

## 2. alertmanager rules (\`services/prometheus/rules/\`)
- **HostHighCpuLoad**: warning when CPU idle $< 15\\%$ for 5m.
- **HostOutOfMemory**: critical alert when available RAM $< 10\\%$ for 3m.
- **DiskSpaceFillingUp**: warning when disk usage $> 85\\%$.

alerts are routed in real-time to discord channels via the \`alertmanager-discord\` webhook relay.
`
  },
  {
    id: "recovery",
    section: "homelab",
    title: "disaster recovery",
    category: "operations",
    icon: "rec",
    summary: "backup schedules, proxmox backup server, rsync storage, and emergency runbooks.",
    content: `# disaster recovery & runbooks

## 3-2-1 backup strategy
1. **nightly snapshots**: proxmox backup server (pbs) deduplicated block-level backups.
2. **database dumps**: automated daily sql dumps of vaultwarden, gitea, and authelia databases.
3. **offsite cold storage**: encrypted rclone synchronization to secondary offsite object storage.
`
  },
  {
    id: "esp32",
    section: "homelab",
    title: "esp32 edge systems",
    category: "edge iot",
    icon: "iot",
    summary: "arduino c++ firmware, automated solenoid irrigation, and footprint presence sensors.",
    content: `# esp32 embedded edge systems

located in \`esp32/\`, edge microcontrollers extend homelab automation into the physical world.

## 1. irrigation controller (\`esp32/irrigation/\`)
- **weather integration**: checks temperature and rain predictions before actuation.
- **zone control**: multi-channel relay board controlling 12V solenoid water valves.

## 2. footprint presence sensor (\`esp32/footprint/\`)
- pir and ultrasonic sensors detecting physical room presence.
- publishes instant mqtt state updates to home assistant for lighting automation.
`
  },
  {
    id: "vms",
    section: "homelab",
    title: "virtual machines (kvm)",
    category: "hypervisors",
    icon: "kvm",
    summary: "declarative specifications, cloud-init automation, and virtio hardware acceleration for vm 200 and vm 201.",
    content: `# proxmox ve kvm virtual machines architecture

in addition to lightweight lxc containers, the homelab platform runs dedicated **kvm virtual machines** for workloads requiring kernel isolation, paravirtualized network appliances, and full guest operating systems.

---

## virtual machine inventory matrix

| vmid | name | operating system | vcpus | ram | storage disk | network bridge | primary protocol | role / function |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **200** | \`opnsense\` | freebsd 14.x / opnsense | 2 | 1024 mb | 16 gb ssd (\`local-lvm\`) | \`vmbr0\` (wan) + \`vmbr1\` (lan) | webgui (\`:8443\`) | core firewall, nat gateway, wireguard |
| **201** | \`windows\` | windows server 2025 x64 | 2 | 4096 mb | 120 gb nvme (\`local-lvm\`) | \`vmbr0\` (management) | rdp (\`:3389\`), ovmf/tpm | active directory, enterprise services |

---

## 1. opnsense virtual router (vm 200)
- **architecture**: dual-interface virtual appliance connecting physical uplink to virtual internal lan.
- **memory footprint**: tuned to **1024 mb ram** with memory ballooning.
- **routing**: inter-vlan routing, stateful inspection, and crowdsec ips/ids remediation bouncer.
- **access**: webgui at \`https://192.168.1.132:8443\` or \`https://opnsense.lan\`.

## 2. windows server 2025 (vm 201)
- **base platform**: enterprise **windows server 2025 x64** running on kvm with ovmf uefi and tpm 2.0.
- **hardware allocation**: **4096 mb ram**, 2 vcpus, and **120 gb virtio scsi single** storage disk.
- **network & access**: static ip \`192.168.1.132:3389\`, rdp administration, active directory domain services (\`winserver.lan\`).
`
  },
  {
    id: "elo-control-plane",
    section: "homelab",
    title: "elo autonomous ai control plane",
    category: "ai & automation",
    icon: "ai",
    summary: "agentic control plane with pgvector semantic memory, esp32 presence, automation agents, and zero-cost free-tier cascade.",
    content: `# elo: autonomous agentic homelab control plane

**ELO (Enhanced Local Orchestrator)** is a self-hosted autonomous AI control plane for Proxmox VE, OPNsense, Home Assistant, and ZFS storage systems.

\`\`\`mermaid
graph TD
    User["User (Web / macOS App / Telegram)"] --> Gatekeeper["Security Gatekeeper (L0–L3 Rings)"]
    Gatekeeper --> Router["CascadeRouter (Free-Tier Optimized)"]
    Router -->|Tier 1| Gemini["Google Gemini (2.5 Flash / Pro)"]
    Router -->|Tier 2 (Quota/429)| Groq["Groq LPU (Llama 3.3 70B Versatile)"]
    Router -->|Tier 3 (Rate Limit)| OpenRouter["OpenRouter Hub (:free Pool)"]
    Router -->|Tier 4 (Offline)| Ollama["Local Ollama (Apple M1 Metal MPS)"]
    Router -->|Tier 5| Mock["Mock Deterministic Failsafe"]
\`\`\`

---

## core autonomous features (phases 1–6)

### 1. persistent semantic memory with \`pgvector\`
- full vector indexing for homelab runbooks, inventory, and conversation logs.
- deterministic 128-dimensional dense embeddings with cosine similarity search.
- persistent long-term recall of user preferences, VM contexts, and previous incident resolutions.

### 2. hardware esp32 & room-awareness
- microcontrollers across the home stream BLE / mmWave radar telemetry over MQTT.
- ELO resolves physical room zones (**Birou**, **Living**, **Server Room**, **Dormitor**) and dynamically routes generic vocal/text commands (*"turn on the lights"*) to the proximity Home Assistant entities.

### 3. autonomous specialized automation agents
-  **SecOps Threat-Hunter Agent**: analyzes Wazuh XDR and Suricata NIDS logs; executes instant quarantine on OPNsense at \`192.168.1.132:8443\`.
-  **SysAdmin Optimizer Agent**: correlates cluster telemetry, identifies memory bloat, recommends KSM deduplication, and cleans Docker cache.
-  **Smart Home Energy Agent**: monitors power consumption across Home Assistant & Shelly smart plugs; flags vampire loads during idle hours.
-  **Predictive Storage Healer**: tracks SMART disk health metrics and proactively triggers ZFS safety snapshots on OpenMediaVault (\`192.168.1.135\`).

### 4. native macos desktop application (.net 10)
- native C# application packaged into a self-contained DMG installer (\`elo-desktop-macos.dmg\`) with auto-reconnecting WebSocket telemetry and biometric Touch ID confirmation.
`
  },
  {
    id: "antigravity-mcp",
    section: "homelab",
    title: "antigravity mcp server",
    category: "ai & automation",
    icon: "sys",
    summary: "model context protocol (mcp) server exposing live homelab tools to ai agents.",
    content: `# antigravity mcp server (\`ai/\`)

located under \`ai/\`, this service implements the **Model Context Protocol (MCP)** specification over stdio and HTTP JSON-RPC.

## exposed mcp tool endpoints:
- \`homelab_list_services\`: retrieves live status of all 31 Docker compose microservices.
- \`proxmox_get_cluster\`: scrapes node status, CPU/RAM utilization, and VM states from Proxmox VE (\`192.168.1.132\`).
- \`opnsense_block_ip\`: injects stateful firewall blacklist rules on OPNsense gateway.
- \`homeassistant_call_service\`: executes home automation domain actions.
- \`zfs_snapshot_dataset\`: creates instant ZFS dataset snapshots on NAS (\`192.168.1.135\`).
`
  },
  {
    id: "multi-distro-cicd",
    section: "homelab",
    title: "multi-linux ci/cd & devsecops",
    category: "automation",
    icon: "sast",
    summary: "github actions matrix pipeline across 6 linux distros, devsecops scanning, and automatic readme sync.",
    content: `# multi-distribution linux ci/cd pipeline

the continuous integration and delivery architecture under \`.github/workflows/\` enforces multi-distribution compatibility and enterprise DevSecOps baselines.

## 1. multi-linux compatibility matrix (\`distro-compatibility-matrix\`)
automatically executes the entire test suite on 6 native Linux containers:
-  **Debian 12 Bookworm** (\`glibc\` — base for Proxmox VE & OpenMediaVault)
-  **Ubuntu 24.04 LTS Noble** (\`glibc\`)
-  **Alpine Linux 3.24** (\`musl libc\` — ultra-lightweight container fleet)
-  **Rocky Linux 9** (RPM / RHEL)
-  **Fedora 40** (modern RPM upstream)
-  **Arch Linux** (rolling release bleeding-edge)

## 2. devsecops security scanning
- **Gitleaks**: zero-tolerance secrets and credential leak detection.
- **Bandit SAST**: Python AST vulnerability analysis.
- **Trivy Vulnerability Scanner**: filesystem, base image, and CVE auditor.
- **Portable ShellCheck-Py**: POSIX shell script static analysis.

## 3. automated readme.md & metrics sync
- dynamically inspects active workloads, registered ELO tools (19 tools), and test suites (28/28 passed).
- automatically updates root documentation badges on every push.
`
  }
];

export const cyberArticles: WikiArticle[] = [
  {
    id: "cyber-overview",
    section: "cyber",
    title: "soc & security overview",
    category: "cyber architecture",
    icon: "soc",
    summary: "high-level cyber proving ground architecture, xdr telemetry, and offensive/defensive tracks.",
    content: `# cyberlab security architecture overview

cyberlab is a defensive proving ground and security laboratory built on **utm / qemu**, **proxmox ve**, **ansible**, **wazuh xdr 4.8**, and **grafana loki**.

## core engineering tracks

1. **host hardening**: immutable baselines enforcing cis ubuntu 24.04 benchmarks, ssh ed25519 cryptography, and ufw default drop policies.
2. **centralized telemetry**: scalable log streaming from auditd (fim), auth.log, and suricata nids into wazuh siem and grafana loki.
3. **offensive security emulation**: atomic red team test suites, bloodhound active directory attack paths, and linpeas privilege escalation analysis.
4. **dfir & incident response**: automated volatile artifact collection, memory dumping, chainsaw event log triage, and emergency host quarantine.
5. **ai threat intelligence**: native python agents parsing iocs and mapping alerts to the mitre att&ck matrix.

---

## lab segmentation

\`\`\`
┌─────────────────────────────────────────────────────────┐
│              host hypervisor (utm / proxmox ve)         │
│                                                         │
│  cyber-ctrl (192.168.64.2) ── ssh :2222 ─────────────┐  │
│  ansible + terraform controller                       │  │
│                                                       ▼  │
│  vlan 10 — hardened production                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │  cyber-node01 (192.168.64.10)                    │    │
│  │  auditd fim · ssh:2222 · fail2ban · promtail     │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  vlan 20 — dmz & honey services                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  cyber-node02 (192.168.64.20)                    │    │
│  │  exposed web target · suricata mirror            │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  vlan 30 — soc analytics layer                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │  wazuh manager (:1514/:55000) · loki (:3100)     │    │
│  │  grafana (:3000) · suricata nids · ai agent      │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
\`\`\`
`
  },
  {
    id: "cyber-siem",
    section: "cyber",
    title: "siem & soc operations",
    category: "blue team",
    icon: "siem",
    summary: "wazuh xdr, grafana loki log aggregation, promtail rules, and cyberchef workbench.",
    content: `# siem & telemetry operations

## 1. wazuh xdr 4.8 (\`cyber/services/wazuh/\`)
- **wazuh manager**: central engine collecting security events, triggering active responses, and calculating cis compliance scores.
- **wazuh dashboard**: security dashboard on \`https://localhost:443\`.

## 2. grafana loki logging pipeline (\`cyber/services/loki-grafana/\`)
promtail agents stream real-time logs to loki:
- \`/var/log/audit/audit.log\` $\to$ cis file integrity monitoring (fim).
- \`/var/log/auth.log\` $\to$ ssh connections, failed logins, and \`sudo\` actions.
- \`/var/log/suricata/eve.json\` $\to$ nids network security alerts.

## 3. cyberchef (\`cyber/services/cyberchef/\`)
self-hosted forensic data deobfuscation and decoding utility running on port \`8088\`.
`
  },
  {
    id: "cyber-hardening",
    section: "cyber",
    title: "cis baseline & hardening",
    category: "defense",
    icon: "cis",
    summary: "ansible host hardening, ssh port 2222, fail2ban ips, and auditd fim rules.",
    content: `# host hardening & cis benchmarks

hardening is fully automated via ansible roles in \`cyber/ansible/roles/\`:

## ssh security baseline
- port moved to non-standard \`2222\`.
- \`PasswordAuthentication no\` (strictly ed25519 / rsa 4096 keys).
- ciphers restricted to \`chacha20-poly1305@openssh.com,aes256-gcm@openssh.com\`.

## kernel sysctl parameters (\`roles/common\`)
\`\`\`ini
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
kernel.randomize_va_space = 2
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.tcp_syncookies = 1
\`\`\`

## auditd file integrity monitoring (\`roles/auditd_fim\`)
monitors sensitive paths: \`/etc/passwd\`, \`/etc/shadow\`, \`/etc/sudoers\`, \`/bin\`, \`/sbin\`, and logs privilege escalation attempts.
`
  },
  {
    id: "cyber-offensive",
    section: "cyber",
    title: "offensive research & emulation",
    category: "red team",
    icon: "off",
    summary: "atomic red team execution harness, bloodhound ad analysis, and linpeas triage.",
    content: `# offensive security & threat emulation

## 1. atomic red team harness (\`cyber/ctf/atomic_red_team/\`)
automated runner executing mitre att&ck techniques:
- **T1059.004**: shell execution and obfuscation.
- **T1053.003**: cron-based persistence.
- **T1548.001**: suid binary privilege escalation.

## 2. bloodhound ad attack paths (\`cyber/ctf/bloodhound/\`)
cypher query analyzer finding critical active directory privilege escalation paths:
- shortest path to domain admin.
- over-permissioned user accounts and dcsync rights.

## 3. linpeas output classifier (\`cyber/ctf/peass/\`)
categorizes raw linpeas output into high, medium, and low security risk findings.
`
  },
  {
    id: "cyber-dfir",
    section: "cyber",
    title: "dfir & incident response",
    category: "forensics",
    icon: "dfir",
    summary: "live triage acquisition, volatile ram dumps, chainsaw event log analysis, and host quarantine.",
    content: `# dfir & incident response playbook

## 1. live triage artifact collector (\`cyber/forensics/triage_collector.sh\`)
collects volatile triage artifacts into a timestamped sha-256 archive:
- active processes, open sockets (\`ss -tulpn\`), logged-in users, crontabs, and suid binaries.

## 2. emergency host quarantine
when compromise is detected on \`cyber-node01\`, execute instant firewall isolation:

\`\`\`bash
ansible-playbook -i inventory/hosts.yml ansible/playbooks/incident_response.yml -e target_host=cyber-node01
\`\`\`
`
  },
  {
    id: "cyber-devsecops",
    section: "cyber",
    title: "devsecops & static analysis",
    category: "devsecops",
    icon: "sast",
    summary: "semgrep sast rules, trivy container scans, and trufflehog secrets detection.",
    content: `# devsecops & security scanning

automated scanning pipelines in \`cyber/scripts/\`:

- **semgrep sast** (\`scripts/run_semgrep_sast.sh\`): custom rules for iac templates and python scripts.
- **trivy vulnerability scanner** (\`scripts/trivy_security_scan.sh\`): scans filesystem and container images.
- **trufflehog** (\`scripts/trufflehog_scan.sh\`): scans git commit histories for exposed secrets and tokens.
`
  },
  {
    id: "cyber-ai",
    section: "cyber",
    title: "ai threat hunting agent",
    category: "ai ops",
    icon: "ai",
    summary: "python log correlation, regex ioc parser, and mitre classification.",
    content: `# ai threat hunting & correlation agent

native python intelligence tools under \`cyber/ai/\`:

## \`cyber/ai/agent.py\`
- ingests raw auth and syslog streams.
- identifies brute-force authentication attempts and anomalous privilege escalations.
- classifies findings against the mitre att&ck matrix and outputs markdown incident reports.

## \`cyber/ai/ioc_extractor.py\`
- extracts ipv4, ipv6, fqdns, emails, and sha-256 hashes in structured json.
`
  },
  {
    id: "cyber-vms-utm",
    section: "cyber",
    title: "utm virtual machines (macos)",
    category: "cyber architecture",
    icon: "utm",
    summary: "windows 10 victim endpoint & kali linux offensive penetration testing sandbox.",
    content: `# cyberlab utm virtual machines (macos / apple silicon)

declarative virtualization packages configured via apple hypervisor.framework and qemu:

---

## local utm vm matrix

| vm name | target os | vcpus | ram | network forwarding | role / function |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **windows 10** | windows 10 x64 / arm64 | 2 | 4096 mb | \`13389:3389\` (rdp) | victim endpoint, sysmon edr telemetry, malware sandbox |
| **kali linux offensive** | kali rolling 2024.x | 2 | 4096 mb | \`2222:22\` (ssh) | attack emulator, metasploit, burp suite, nmap |

---

## access standards & secret management
- **windows 10:** \`administrator\` (configured via local security policy / vault)
- **kali linux offensive:** \`kali\` (ssh key authorization)
- **wazuh dashboard:** \`admin\` (managed via \`.env\` & sops)
- **grafana loki:** \`admin\` (injected via docker secrets)
`
  }
];

export const allArticles = [...homelabArticles, ...cyberArticles];

export const homelabServices = [
  { name: "elo ai control plane", logo: "icons/python.svg", category: "ai & automation", ip: "192.168.1.133", port: 8000, ipUrl: "http://192.168.1.133:8000", domain: "elo.lan", domainUrl: "http://elo.lan", status: "active" },
  { name: "antigravity mcp server", logo: "icons/python.svg", category: "ai & automation", ip: "192.168.1.133", port: 8000, ipUrl: "http://192.168.1.133:8000/docs", domain: "mcp.lan", domainUrl: "http://mcp.lan", status: "active" },
  { name: "proxmox ve hypervisor", logo: "icons/proxmox.svg", category: "infrastructure", ip: "192.168.1.132", port: 8006, ipUrl: "https://192.168.1.132:8006", domain: "pve.lan", domainUrl: "https://pve.lan", status: "active" },
  { name: "proxmox ve arm64 hypervisor", logo: "icons/proxmox.svg", category: "infrastructure", ip: "192.168.64.14", port: 8006, ipUrl: "https://192.168.64.14:8006", domain: "pve-arm.lan", domainUrl: "https://pve-arm.lan", status: "active" },
  { name: "openmediavault nas", logo: "icons/nextcloud.svg", category: "infrastructure", ip: "192.168.1.135", port: 80, ipUrl: "http://192.168.1.135", domain: "nas.lan", domainUrl: "http://nas.lan", status: "active" },
  { name: "nginx proxy manager", logo: "icons/nginx-proxy-manager.svg", category: "ingress", ip: "192.168.1.3", port: 81, ipUrl: "http://192.168.1.3:81", domain: "nginx.lan", domainUrl: "http://nginx.lan", status: "active" },
  { name: "authelia sso", logo: "icons/authelia.svg", category: "ingress", ip: "192.168.1.20", port: 9091, ipUrl: "http://192.168.64.20:9091", domain: "authelia.lan", domainUrl: "http://authelia.lan", status: "active" },
  { name: "pi-hole dns", logo: "icons/pihole.svg", category: "networking", ip: "192.168.1.4", port: 8080, ipUrl: "http://192.168.1.4:8080/admin/", domain: "pihole.lan", domainUrl: "http://pihole.lan/admin/", status: "active" },
  { name: "prometheus", logo: "icons/prometheus.svg", category: "observability", ip: "192.168.1.11", port: 9090, ipUrl: "http://192.168.1.11:9090", domain: "prometheus.lan", domainUrl: "http://prometheus.lan", status: "active" },
  { name: "grafana dashboards", logo: "icons/grafana.svg", category: "observability", ip: "192.168.1.11", port: 3000, ipUrl: "http://192.168.1.11:3000", domain: "grafana.lan", domainUrl: "http://grafana.lan", status: "active" },
  { name: "loki log engine", logo: "icons/loki.svg", category: "observability", ip: "192.168.1.11", port: 3100, ipUrl: "http://192.168.1.11:3100", domain: "loki.lan", domainUrl: "http://loki.lan", status: "active" },
  { name: "uptime kuma", logo: "icons/uptime-kuma.svg", category: "observability", ip: "192.168.1.7", port: 3001, ipUrl: "http://192.168.64.23:3001", domain: "uptime.lan", domainUrl: "http://uptime.lan", status: "active" },
  { name: "scrutiny s.m.a.r.t.", logo: "icons/scrutiny.svg", category: "observability", ip: "192.168.1.18", port: 8080, ipUrl: "http://192.168.1.18:8080", domain: "scrutiny.lan", domainUrl: "http://scrutiny.lan", status: "active" },
  { name: "crowdsec lapi", logo: "icons/crowdsec.svg", category: "security", ip: "192.168.1.9", port: 8080, ipUrl: "http://192.168.1.9:8080", domain: "crowdsec.lan", domainUrl: "http://crowdsec.lan", status: "active" },
  { name: "immich photos", logo: "icons/immich.svg", category: "storage & media", ip: "192.168.1.15", port: 2283, ipUrl: "http://192.168.1.15:2283", domain: "immich.lan", domainUrl: "http://immich.lan", status: "active" },
  { name: "nextcloud hub", logo: "icons/nextcloud.svg", category: "storage & media", ip: "192.168.1.8", port: 80, ipUrl: "http://192.168.1.8", domain: "nextcloud.lan", domainUrl: "http://nextcloud.lan", status: "active" },
  { name: "jellyfin media", logo: "icons/jellyfin.svg", category: "storage & media", ip: "192.168.1.21", port: 8096, ipUrl: "http://192.168.1.21:8096", domain: "jellyfin.lan", domainUrl: "http://jellyfin.lan", status: "active" },
  { name: "radarr movies", logo: "icons/radarr.svg", category: "storage & media", ip: "192.168.1.21", port: 7878, ipUrl: "http://192.168.1.21:7878", domain: "radarr.lan", domainUrl: "http://radarr.lan", status: "active" },
  { name: "sonarr tv", logo: "icons/sonarr.svg", category: "storage & media", ip: "192.168.1.21", port: 8989, ipUrl: "http://192.168.1.21:8989", domain: "sonarr.lan", domainUrl: "http://sonarr.lan", status: "active" },
  { name: "prowlarr indexers", logo: "icons/prowlarr.svg", category: "storage & media", ip: "192.168.1.21", port: 9696, ipUrl: "http://192.168.1.21:9696", domain: "prowlarr.lan", domainUrl: "http://prowlarr.lan", status: "active" },
  { name: "bazarr subtitles", logo: "icons/bazarr.svg", category: "storage & media", ip: "192.168.1.21", port: 6767, ipUrl: "http://192.168.1.21:6767", domain: "bazarr.lan", domainUrl: "http://bazarr.lan", status: "active" },
  { name: "qbittorrent", logo: "icons/qbittorrent.svg", category: "storage & media", ip: "192.168.1.21", port: 8080, ipUrl: "http://192.168.1.21:8080", domain: "qbittorrent.lan", domainUrl: "http://qbittorrent.lan", status: "active" },
  { name: "home assistant", logo: "icons/homeassistant.svg", category: "automation", ip: "192.168.1.10", port: 8123, ipUrl: "http://192.168.1.10:8123", domain: "ha.lan", domainUrl: "http://ha.lan", status: "active" },
  { name: "n8n automation", logo: "icons/n8n.svg", category: "automation", ip: "192.168.1.13", port: 5678, ipUrl: "http://192.168.1.13:5678", domain: "n8n.lan", domainUrl: "http://n8n.lan", status: "active" },
  { name: "changedetection", logo: "icons/changedetection.svg", category: "automation", ip: "192.168.1.24", port: 5000, ipUrl: "http://192.168.1.24:5000", domain: "changedetection.lan", domainUrl: "http://changedetection.lan", status: "active" },
  { name: "gitea forge", logo: "icons/gitea.svg", category: "devops", ip: "192.168.1.17", port: 3000, ipUrl: "http://192.168.64.25:3000", domain: "gitea.lan", domainUrl: "http://gitea.lan", status: "active" },
  { name: "woodpecker ci", logo: "icons/woodpecker.svg", category: "devops", ip: "192.168.1.14", port: 8000, ipUrl: "http://192.168.1.14:8000", domain: "woodpecker.lan", domainUrl: "http://woodpecker.lan", status: "active" },
  { name: "vaultwarden", logo: "icons/vaultwarden.svg", category: "productivity", ip: "192.168.1.16", port: 8080, ipUrl: "http://192.168.64.21:8080", domain: "vaultwarden.lan", domainUrl: "http://vaultwarden.lan", status: "active" },
  { name: "trilium notes", logo: "icons/trilium.svg", category: "productivity", ip: "192.168.1.19", port: 8080, ipUrl: "http://192.168.1.19:8080", domain: "trilium.lan", domainUrl: "http://trilium.lan", status: "active" },
  { name: "actual budget", logo: "icons/actualbudget.svg", category: "productivity", ip: "192.168.1.22", port: 5006, ipUrl: "http://192.168.1.22:5006", domain: "actualbudget.lan", domainUrl: "http://actualbudget.lan", status: "active" },
  { name: "it-tools", logo: "icons/it-tools.svg", category: "utilities", ip: "192.168.1.12", port: 80, ipUrl: "http://192.168.1.12", domain: "it-tools.lan", domainUrl: "http://it-tools.lan", status: "active" },
  { name: "opnsense gateway", logo: "icons/opnsense.svg", category: "virtual machines", ip: "192.168.1.132", port: 8443, ipUrl: "https://192.168.1.132:8443", domain: "opnsense.lan", domainUrl: "https://opnsense.lan", status: "active" },
  { name: "windows server 2025", logo: "icons/windows.svg", category: "virtual machines", ip: "192.168.1.132", port: 3389, ipUrl: "http://192.168.1.132:3389", domain: "winserver.lan", domainUrl: "http://winserver.lan", status: "active" }
];

export const cyberlabTools: CyberTool[] = [
  { name: "wazuh manager / xdr", category: "siem", port: 1514, status: "active", type: "xdr / siem", logo: "icons/wazuh.svg" },
  { name: "grafana loki", category: "siem", port: 3100, status: "active", type: "log aggregator", logo: "icons/loki.svg" },
  { name: "suricata nids", category: "detection", port: 0, status: "active", type: "packet inspection", logo: "icons/suricata.svg" },
  { name: "cyberchef", category: "forensics", port: 8088, status: "active", type: "data decoder", logo: "icons/cyberchef.svg" },
  { name: "atomic red team", category: "red team", port: 0, status: "ready", type: "mitre att&ck emulation", logo: "icons/atomicredteam.svg" },
  { name: "bloodhound", category: "red team", port: 0, status: "ready", type: "ad path graph", logo: "icons/bloodhound.svg" },
  { name: "linpeas parser", category: "red team", port: 0, status: "ready", type: "privesc triage", logo: "icons/linux.svg" },
  { name: "chainsaw", category: "forensics", port: 0, status: "ready", type: "evtx log triage", logo: "icons/chainsaw.svg" },
  { name: "semgrep sast", category: "devsecops", port: 0, status: "ready", type: "code & iac scanner", logo: "icons/semgrep.svg" },
  { name: "trivy scanner", category: "devsecops", port: 0, status: "ready", type: "vulnerability auditor", logo: "icons/trivy.svg" },
  { name: "trufflehog", category: "devsecops", port: 0, status: "ready", type: "secrets scanner", logo: "icons/trufflehog.svg" },
  { name: "wireshark packet analysis", category: "forensics", port: 0, status: "ready", type: "pcap deep inspection", logo: "icons/wireshark.svg" },
  { name: "metasploit framework", category: "red team", port: 0, status: "ready", type: "exploitation platform", logo: "icons/metasploit.svg" },
  { name: "burp suite community", category: "red team", port: 8080, status: "ready", type: "web security testing", logo: "icons/burpsuite.svg" },
  { name: "kali linux (utm vm)", category: "red team", port: 2222, status: "active", type: "offensive security vm", logo: "icons/kali.svg" },
  { name: "windows 10 (utm vm)", category: "defense", port: 13389, status: "active", type: "victim endpoint vm", logo: "icons/windows.svg" },
  { name: "ai correlation agent", category: "ai ops", port: 0, status: "active", type: "mitre att&ck classifier", logo: "icons/python.svg" }
];
