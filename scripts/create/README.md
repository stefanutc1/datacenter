# Homelab Fleet Automation: Creation & Recreation Scripts

Acest director conține scripturile automate shell pentru crearea și recrearea întregii flote de mașini virtuale (VMs) și containere (LXCs) pe ambele noduri Proxmox VE din infrastructură:

- **Node 1 (`192.168.1.132` / `pve-node1`)**: Arhitectură **x86_64 / amd64**
- **Node 3 (`192.168.64.14` / `pve-arm`)**: Arhitectură **ARM64 / aarch64** (Apple Silicon M1 via UTM)

---

## Structura Directoarelor

```tree
scripts/create/
├── README.md                     # Această documentație
├── arm/
│   └── recreate_lxcs.sh          # Recreează toate cele 82 containere LXC (100-181) pe nodul ARM64
└── x64/
    ├── create_lxcs.sh            # Creează toate cele 15 containere LXC (101-115) pe nodul x86_64
    └── create_vms.sh             # Creează toate cele 21 mașini virtuale (200-220) pe nodul x86_64
```

---

## 1. Node 1 (x86_64) — Virtual Machines

**Script:** `scripts/create/x64/create_vms.sh`  
**Destinație:** Node 1 (`pve-node1`, `192.168.1.132`)

### Comenzi & Utilizare

```bash
# Execuție standard (sare peste VM-urile care există deja)
bash scripts/create/x64/create_vms.sh

# Suprascriere / Forțare recreare (șterge VM-ul existent și îl recreează)
bash scripts/create/x64/create_vms.sh --force

# Personalizare prin variabile de mediu (opțional):
STORAGE="local-lvm" ISO_STORAGE="local:iso" BRIDGE="vmbr0" bash scripts/create/x64/create_vms.sh
```

### Inventar VM-uri x86_64 (200–220)

| VMID | Hostname / Nume | Cores | RAM / Min (MB) | Disk | Rețea / IP | OS / ISO / Note |
|:---|:---|:---:|:---:|:---:|:---|:---|
| **200** | `opnsense` | 4 | 4096 / 2048 | 32G | VirtIO (`vmbr0`, `vmbr1`) | OPNsense Firewall / Router Core |
| **201** | `pbs` | 4 | 8192 / 4096 | 64G | VirtIO (`192.168.1.201/24`) | Proxmox Backup Server x64 |
| **202** | `pdm` | 4 | 4096 / 2048 | 32G | VirtIO (`192.168.1.202/24`) | Proxmox Datacenter Manager |
| **203** | `k8s-master-01` | 4 | 8192 / 4096 | 50G | VirtIO (`192.168.1.203/24`) | Kubernetes Control Plane (Cilium, ArgoCD, Rook-Ceph) |
| **204** | `k8s-worker-01` | 4 | 8192 / 4096 | 50G | VirtIO (`192.168.1.204/24`) | Kubernetes Worker Node |
| **205** | `openstack-controller` | 6 | 16384 / 8192 | 100G | VirtIO (`192.168.1.205/24`) | OpenStack Control Plane & Services |
| **206** | `openstack-compute-01`| 6 | 16384 / 8192 | 100G | VirtIO (`192.168.1.206/24`) | OpenStack Compute (Nova / Neutron) |
| **207** | `truenas-scale` | 4 | 16384 / 8192 | 64G | VirtIO (`192.168.1.207/24`) | TrueNAS SCALE Storage Appliance |
| **208** | `talos-control-01` | 2 | 4096 / 2048 | 32G | VirtIO (`192.168.1.208/24`) | Talos Immutable Linux K8s Master |
| **209** | `talos-worker-01` | 4 | 8192 / 4096 | 50G | VirtIO (`192.168.1.209/24`) | Talos Immutable Linux K8s Worker |
| **210** | `harvester-hci-01` | 4 | 16384 / 8192 | 100G | VirtIO (`192.168.1.210/24`) | Harvester HCI Node |
| **211** | `vyos-router` | 2 | 2048 / 1024 | 16G | VirtIO (`192.168.1.211/24`) | VyOS Enterprise BGP/OSPF Router |
| **212** | `metasploitable2` | 1 | 1024 / 512 | 10G | VirtIO (`192.168.1.212/24`) | Metasploitable 2 Vulnerable Lab VM |
| **213** | `kali-rolling` | 4 | 8192 / 4096 | 60G | VirtIO (`192.168.1.213/24`) | Kali Linux Offensive Security Platform |
| **214** | `parrot-sec` | 4 | 8192 / 4096 | 60G | VirtIO (`192.168.1.214/24`) | Parrot Security OS Workstation |
| **215** | `commando-vm` | 4 | 8192 / 4096 | 80G | VirtIO (`192.168.1.215/24`) | Windows Commando VM (Red Teaming) |
| **216** | `blackarch` | 4 | 8192 / 4096 | 60G | VirtIO (`192.168.1.216/24`) | BlackArch Linux Penetration Testing |
| **217** | `wazuh-siem` | 4 | 8192 / 4096 | 80G | VirtIO (`192.168.1.217/24`) | Wazuh SIEM & XDR Server |
| **218** | `remnux` | 4 | 8192 / 4096 | 60G | VirtIO (`192.168.1.218/24`) | REMnux Malware Analysis & Reverse Engineering |
| **219** | `redox-os` | 2 | 2048 / 1024 | 20G | VirtIO (`192.168.1.219/24`) | Redox OS (Rust Microkernel) |
| **220** | `freedos` | 1 | 512 / 256 | 5G | e1000 (`192.168.1.220/24`) | FreeDOS Legacy & x86 Assembly Lab |

---

## 2. Node 1 (x86_64) — LXC Containers

**Script:** `scripts/create/x64/create_lxcs.sh`  
**Destinație:** Node 1 (`pve-node1`, `192.168.1.132`)

### Comenzi & Utilizare

```bash
# Execuție standard (sare peste containerele care există deja)
bash scripts/create/x64/create_lxcs.sh

# Forțare recreare (șterge containerul existent și îl recreează)
bash scripts/create/x64/create_lxcs.sh --force

# Suprascriere parametri de rețea sau stocare:
STORAGE="local-lvm" GATEWAY="192.168.1.1" BRIDGE="vmbr0" bash scripts/create/x64/create_lxcs.sh
```

> **Notă de Securitate & Consolidare Rețea:** Serviciile perimetrale **Nginx Ingress Reverse Proxy** (cu terminare SSL/TLS wildcard și WebSockets), **AdGuard Home** (înlocuitorul modern pentru Pi-hole cu split-DNS), **Tailscale Mesh Gateway** și **CrowdSec LAPI & Remediation Bouncer** rulează integrate nativ la nivel de perimetru direct pe firewall-ul **OPNsense (`VM 200` · `192.168.1.134`)**, gestionând tabelele dinamice Packet Filter (`pf`) (`crowdsec_blocklists`), listele de amenințări externe (`threatfeed_*`) și interfața mesh VPN, fiind eliminate complet containerele LXC redundante de pe nodul x86_64.

### Inventar Containere x86_64 (101–115)

| CTID | Hostname | Cores | RAM / Swap (MB) | Disk | IP (`vmbr0`) | Gateway | Template / Note |
|:---|:---|:---:|:---:|:---:|:---|:---|:---|
| **101** | `immich` | 2 | 256 / 512 | 40G | `192.168.1.15/24` | `192.168.1.1` | Alpine 3.24 · Storage & AI Photo Library |
| **102** | `nextcloud` | 1 | 256 / 512 | 50G | `192.168.1.8/24` | `192.168.1.1` | Alpine 3.24 · Enterprise File Cloud & WebDAV |
| **103** | `homeassistant` | 2 | 128 / 128 | 16G | `192.168.1.10/24` | `192.168.1.1` | Alpine 3.24 · Smart Home Hub & ESP32 Telemetry |
| **104** | `n8n` | 2 | 256 / 512 | 8G | `192.168.1.13/24` | `192.168.1.1` | Alpine 3.24 · Workflow Orchestration Engine |
| **105** | `scrutiny` | 1 | 96 / 32 | 3G | `192.168.1.18/24` | `192.168.1.1` | Alpine 3.24 · S.M.A.R.T. Drive Health Agent |
| **106** | `media-suite` | 2 | 896 / 256 | 50G | `192.168.1.21/24` | `192.168.1.1` | Alpine 3.24 · Jellyfin Media Processing Ingress |
| **107** | `ollama` | 4 | 2048 / 1024 | 16G | `192.168.1.110/24` | `192.168.1.1` | Debian 13 · Ollama GPU LLM Runtime |
| **108** | `openwebui` | 2 | 512 / 512 | 8G | `192.168.1.111/24` | `192.168.1.1` | Debian 13 · Self-Hosted ChatGPT / WebUI |
| **109** | `whisper` | 2 | 1024 / 1024 | 8G | `192.168.1.112/24` | `192.168.1.1` | Debian 13 · Faster-Whisper Speech-to-Text CUDA |
| **110** | `flowise` | 2 | 512 / 512 | 1G | `192.168.1.26/24` | `192.168.1.1` | Alpine 3.24 · Flowise Multi-Agent Orchestrator |
| **111** | `paperless-ai` | 1 | 64 / 64 | 1G | `192.168.1.56/24` | `192.168.1.1` | Alpine 3.24 · Automated OCR & DeepSeek Document Tagging |
| **112** | `code-server` | 2 | 512 / 512 | 4G | `192.168.1.115/24` | `192.168.1.1` | Alpine 3.24 · Code-Server Cloud IDE Web Workspace |
| **113** | `proxmox-backup-server` | 2 | 512 / 512 | 4G | `192.168.1.116/24` | `192.168.1.1` | Alpine 3.24 · Proxmox Backup Server (PBS) |
| **114** | `proxmox-datacenter-manager` | 2 | 512 / 512 | 4G | `192.168.1.117/24` | `192.168.1.1` | Alpine 3.24 · Proxmox Datacenter Manager (PDM) |
| **115** | `woodpecker-k0s` | 2 | 512 / 512 | 8G | `192.168.1.118/24` | `192.168.1.1` | Alpine 3.24 · Woodpecker CI pe micro-cluster k0s |

---

## 3. Node 3 (ARM64) — LXC Containers Recreation

**Script:** `scripts/create/arm/recreate_lxcs.sh`  
**Destinație:** Node 3 (`pve-arm`, `192.168.64.14`)

### Comenzi & Utilizare

```bash
# Execuție standard (sare peste containerele care există deja)
bash scripts/create/arm/recreate_lxcs.sh

# Recreare forțată (șterge containerele existente și le recreează de la zero)
bash scripts/create/arm/recreate_lxcs.sh --recreate
# sau:
bash scripts/create/arm/recreate_lxcs.sh --force

# Suprascriere parametri de rețea sau stocare:
STORAGE="local-lvm" GATEWAY="192.168.64.1" BRIDGE="vmbr0" bash scripts/create/arm/recreate_lxcs.sh
```

### Sumar Flotă ARM64 (82 Containere, 100–181)

Toate containerele ARM64 rulează pe **Alpine Linux 3.24 ARM64** cu alocare ultra-eficientă (majoritatea **256MB RAM / 512MB Swap / 4GB Disk**), având IP-uri mapate 1-la-1 cu ID-ul containerului în subnetul `192.168.64.0/24`:

- **Developer Tools & Utilities (100–108):** `it-tools`, `cyberchef`, `pastebin`, `speedtest`, `uptime-kuma`, `stirling-pdf`, `code-server-arm` (decommissioned/redirected), `dockge`, `portainer`
- **Media & Entertainment (109–120):** `jellyfin`, `plex`, `radarr`, `sonarr`, `lidarr`, `bazarr`, `prowlarr`, `qbittorrent`, `transmission`, `calibre`, `kavita`, `audiobookshelf`
- **Productivity & Notes (121–129):** `nextcloud`, `owncloud`, `trilium`, `memos`, `hedgedoc`, `vikunja`, `freshrss`, `wallabag`, `linkding`
- **Home Automation & IoT (130–136):** `home-assistant`, `nodered`, `zigbee2mqtt`, `mosquitto`, `esphome`, `zwave-js`, `tasmoadmin`
- **Security, Auth & Passwords (137–144):** `vaultwarden`, `authentik`, `authelia`, `crowdsec`, `adguard-home`, `pi-hole`, `fail2ban`, `wazuh-agent`
- **Monitoring & Observability (145–154):** `prometheus`, `grafana`, `loki`, `promtail`, `influxdb`, `telegraf`, `netdata`, `glances`, `dozzle`, `scrutiny`
- **Database & Storage Services (155–163):** `postgres`, `mysql`, `mariadb`, `redis`, `keydb`, `mongodb`, `couchdb`, `clickhouse`, `minio`
- **Communication & Collaboration (164–172):** `synapse`, `element`, `zulip`, `mattermost`, `rocketchat`, `gotify`, `ntfy`, `mailcow`, `postfix`
- **Networking & DNS Services (173–181):** `blocky`, `unbound`, `coredns`, `dnsmasq`, `technitium`, `tailscale`, `headscale`, `searxng`, `searxng-redis`

---

## Detalii Tehnice & Securitate

1. **Idempotență**: Fiecare script verifică dacă un VMID/CTID există înainte de a-l crea (`pct status <id>` / `qm status <id>`). Dacă există și flag-ul `--force` / `--recreate` nu este prezent, va trece mai departe fără a distruge datele.
2. **Template Auto-Discovery**: Scripturile caută automat template-urile `alpine` și `debian` disponibile local în `/var/lib/vz/template/cache/` potrivite pentru arhitectura nodului (amd64 sau arm64).
3. **Nesting & Unprivileged**: Containerele sunt create unprivileged (`unprivileged 1`) cu suport de nesting activat (`features: nesting=1`) pentru compatibilitate cu Docker și runtime-uri containerizate.
4. **QEMU Guest Agent**: Toate VM-urile au `agent: 1` activat pentru comunicare transparentă cu hypervisorul Proxmox.
