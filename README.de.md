<div align="center">

# Enterprise Hybrid Cloud & Platform Engineering Lab (Homelab)

**[ 🇷🇴 Română ](README.ro.md) • [ 🇬🇧 English ](README.md) • [ 🇫🇷 Français ](README.fr.md) • [ 🇪🇸 Español ](README.es.md) • [ 🇩🇪 Deutsch ](README.de.md)**

[![CI/CD Status](https://github.com/stefanutc1/homelab/actions/workflows/ci.yml/badge.svg)](https://github.com/stefanutc1/homelab/actions)
[![Sicherheits-Scan & Trivy](https://github.com/stefanutc1/homelab/actions/workflows/security-scan.yml/badge.svg)](https://github.com/stefanutc1/homelab/actions/workflows/security-scan.yml)
[![IaC Testabdeckung](https://img.shields.io/badge/IaC%20Test%20Coverage-98.4%25%20(Terraform%20%2B%20Ansible)-emerald?style=flat&logo=terraform)](https://github.com/stefanutc1/homelab/tree/main/terraform)
[![Infrastruktur Uptime](https://img.shields.io/badge/Uptime%20Kuma-99.98%25%20SLA-brightgreen?style=flat&logo=uptimekuma)](https://status.homelab.local)
[![Virtualisierung](https://img.shields.io/badge/Hypervisor-Proxmox%20VE%209.2%20%7C%20x86__64%20%26%20ARM64-orange?style=flat&logo=proxmox)](https://github.com/stefanutc1/homelab)
[![Zero-Trust Sicherheit](https://img.shields.io/badge/Zero--Trust-Passkeys%20%7C%20FIDO2%20%7C%20Authentik-blue?style=flat&logo=authentik)](https://github.com/stefanutc1/homelab)
[![Lokale KI](https://img.shields.io/badge/Local%20LLM-Ollama%20%7C%20NVIDIA%20GTX%201050%20Ti-violet?style=flat&logo=nvidia)](https://github.com/stefanutc1/homelab)
[![Lizenz: MIT](https://img.shields.io/badge/License-MIT-gray.svg)](LICENSE)

<br/>

**Produktionsreife Hybrid-Cloud-Plattform, Cyber-Defense-Testumgebung und autonome Multi-Agenten-Orchestrierung.**
Aufgebaut auf Bare-Metal x86_64 und Apple Silicon ARM64 Hardware, dynamischer OPNsense-Netzwerksegmentierung, ZFS-Speicherpools, deklarativer Terraform/Ansible-Automatisierung und Kernel-Echtzeitbeobachtbarkeit via eBPF.

[Interaktive Web-Anwendung](https://stefanutc1.github.io/homelab/) • [Architektur-Blueprint](ARCHITECTURE.md) • [Sicherheitsrichtlinie](SECURITY.md) • [Roadmap](ROADMAP.md)

</div>

---

## 📑 Inhaltsverzeichnis

1. [Mission & Designprinzipien](#1-mission--designprinzipien)
2. [Gesamtarchitektur & Netzwerktopologie](#2-gesamtarchitektur--netzwerktopologie)
3. [Physische Hardware-Flotte & Stromversorgung](#3-physische-hardware-flotte--stromversorgung)
4. [LXC-Container & VM-Ressourcenmatrix](#4-lxc-container--vm-ressourcenmatrix)
5. [Speicherarchitektur & ZFS-Optimierung](#5-speicherarchitektur--zfs-optimierung)
6. [Netzwerksegmentierung & Inter-VLAN-Firewall-Matrix](#6-netzwerksegmentierung--inter-vlan-firewall-matrix)
7. [Ingress-Traffic, Zero-Trust-Authentifizierung & Split-Horizon DNS](#7-ingress-traffic-zero-trust-authentifizierung--split-horizon-dns)
8. [Infrastructure as Code (Terraform & Ansible)](#8-infrastructure-as-code-terraform--ansible)
9. [Kubernetes & GitOps Deployment-Lebenszyklus](#9-kubernetes--gitops-deployment-lebenszyklus)
10. [LGTM-Observability-Stack & Telemetrie](#10-lgtm-observability-stack--telemetrie)
11. [3-2-1 Backup-Strategie & Disaster Recovery](#11-3-2-1-backup-strategie--disaster-recovery)
12. [Cyber-Defense-Labor, SOC & eBPF-Sicherheit](#12-cyber-defense-labor-soc--ebpf-sicherheit)
13. [Lokale GPU KI-Laufzeitumgebung (Ollama CT 110)](#13-lokale-gpu-ki-laufzeitumgebung-ollama-ct-110)
14. [Chaos Engineering & Resilienz-Validierung](#14-chaos-engineering--resilienz-validierung)
15. [Umgebungstelemetrie & Lüftersteuerung](#15-umgebungstelemetrie--lüftersteuerung)
16. [Sicherheitshärtung & Kryptografische Integrität](#16-sicherheitshärtung--kryptografische-integrität)
17. [Statische IP- und Port-Übersicht](#17-statische-ip--und-port-übersicht)
18. [Kaltstart-Runbook & Tägliche Befehle](#18-kaltstart-runbook--tägliche-befehle)
19. [Häufige Fragen (FAQ)](#19-häufige-fragen-faq)
20. [Monorepo-Struktur & Mitwirken](#20-monorepo-struktur--mitwirken)

---

## 1. Mission & Designprinzipien

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           INGENIEURSPRINZIPIEN                                │
├────────────────────────┬──────────────────────────┬───────────────────────────┤
│ RESSOURCENEFFIZIENZ    │ TIEFENGESCHÜTZTE ABWEHR  │     GITOPS & CODE-FIRST   │
│ Minimaler Overhead mit │ Default-Deny-Firewalls,  │ 100% deklarativer Status, │
│ Alpine LXC-Containern, │ eBPF-Kernel-Telemetrie,  │ keine manuellen Klicks,   │
│ ZFS ZSTD-Kompression   │ DMZ-Honeypots und        │ sofortiger Snapshot-      │
│ und GPU-LLM-Inferenz.  │ FIDO2 Zero-Trust.        │ Rollback und automatisches│
│                        │                          │ CI-Linting.               │
└────────────────────────┴──────────────────────────┴───────────────────────────┘
```

* **Ressourceneffizienz**: Hochdichte Virtualisierung mit minimalem CPU- und RAM-Bedarf. Optimierte Alpine Linux- und Debian-Container schöpfen das Potenzial von x86_64- und ARM64-Hardware voll aus.
* **Tiefengestaffelte Verteidigung**: Strenge L2/L3-Segmentierung über 5 getrennte VLANs, CrowdSec-Echtzeitblockierung, Suricata-Angriffserkennung und Kernel-Tracing via Cilium Tetragon.
* **Deklaratives GitOps**: Jeder Container, jede virtuelle Maschine, jede Firewallregel und jedes Dashboard wird versionskontrolliert über Terraform, Ansible und Docker Compose verwaltet.
* **Hochverfügbarkeit & Fehlertoleranz**: Automatisierte Disaster-Recovery-Snapshots, virtuelle IP-Ausfallsicherung, Kaltstart-Leitfäden und USV-gesteuerte Abschaltung via NUT.

---

## 2. Gesamtarchitektur & Netzwerktopologie

```mermaid
flowchart TB
    subgraph WAN_Edge["Perimeter & Externer Ingress"]
        CF["Cloudflare WAF / CDN"] -->|Verschlüsselter Tunnel| VPS["VPS WireGuard Gateway"]
        VPS -->|Dual-Homed VPN| OPN["OPNsense Firewall (VM 200)<br/>Suricata IDS/IPS · WireGuard · Unbound"]
    end

    subgraph Network_VLANs["Segmentierte Virtuelle Netzwerke (VLANs)"]
        OPN -->|VLAN 10: 192.168.1.0/24| V10["VLAN 10: Management & Speicher<br/>Proxmox VE · OMV NAS · IPMI"]
        OPN -->|VLAN 20: 192.168.20.0/24| V20["VLAN 20: Core Microservices<br/>NPM · Authentik · Vaultwarden · Nextcloud"]
        OPN -->|VLAN 30: 192.168.30.0/24| V30["VLAN 30: CyberLab & Sandboxes<br/>Wazuh SIEM · Atomic Red Team · CAPEv2"]
        OPN -->|VLAN 40: 192.168.40.0/24| V40["VLAN 40: DMZ Täuschung<br/>T-Pot Honeypots · AbuseIPDB"]
        OPN -->|VLAN 50: 192.168.50.0/24| V50["VLAN 50: IoT & Edge-Sensoren<br/>ESP32 mmWave · Zigbee · Home Assistant"]
    end

    subgraph Compute_Layer["Hybride Multi-Node Virtualisierungsflotte"]
        Node1["Node 1: Proxmox Primär (x86_64)<br/>Intel Core i3-10100F · 8 GB RAM<br/>NVIDIA GTX 1050 Ti GPU (Passthrough)"]
        Node2["Node 2: OMV NAS Speicher<br/>ASUS Laptop · Celeron N2830 · 2 GB RAM<br/>500 GB ZFS-Pool · Offline-Wikipedia Kiwix"]
        Node3["Node 3: Proxmox Sekundär (ARM64)<br/>Apple MacBook Air M1 · 8 Kerne<br/>LGTM Telemetrie · Gitea · Woodpecker CI"]
        Node4["Node 4: Talos Linux Worker<br/>AMD Athlon II X2 · 4 GB RAM<br/>k3s-agent · eBPF Tetragon Sensor"]
    end

    V10 -.-> Node1 & Node2 & Node3 & Node4
    V20 -.-> Node1 & Node3
    V30 -.-> Node1
    V40 -.-> Node1
    V50 -.-> Node1
```

---

## 3. Physische Hardware-Flotte & Stromversorgung

### Hardware-Spezifikationen

| Node-ID | Formfaktor / Gehäuse | CPU-Architektur | Beschleuniger / GPU | RAM-Kapazität | Speicher-Konfiguration | Hauptaufgabe |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`proxmox` (Node 1)** | Custom ATX Tower | Intel Core i3-10100F (4C/8T @ 4.30 GHz) | NVIDIA GeForce GTX 1050 Ti (4 GB VRAM) | 8 GB DDR4-2666 | 512 GB NVMe SSD (`local-lvm`) | Primärer Hypervisor: Windows Server 2025 AD, OPNsense, Ollama GPU (CT 110), Immich AI |
| **`openmediavault` (Node 2)** | ASUS X451MA Laptop | Intel Celeron N2830 (2C/2T @ 2.16 GHz) | Intel HD Graphics | 2 GB DDR3L | 500 GB SATA HDD (ZFS Mirror) | Zentraler NAS: NFS/SMB-Shares, vzdump-Backup-Ziel, Offline-Wikipedia Kiwix |
| **`proxmox2` (Node 3)** | Apple MacBook Air (2020) | Apple M1 (4P + 4E Cores @ 3.20 GHz) | 16-Core Neural Engine / Metal | 8 GB Unified (4 GB dedizierte VM) | 256 GB Apple APFS NVMe | Sekundärer ARM64 Hypervisor (UTM): Grafana/Prometheus/Tempo Telemetrie, Gitea, Woodpecker CI |
| **`k8s-node-04` (Node 4)** | Custom ATX Gehäuse | AMD Athlon II X2 220 (2C/2T @ 2.80 GHz) | NVIDIA GeForce GTS 250 (1 GB) | 4 GB DDR3-1333 | 80 GB HDD (NFS Root) | Immutabler Talos Linux / k3s Worker, Batch-Cron-Jobs, eBPF-Sicherheits-Sonde |

---

## 4. LXC-Container & VM-Ressourcenmatrix

### Detaillierter LXC-Container-Katalog (Knoten 1 — x86_64 Primär)

| VMID | Hostname | Basis-OS | vCPU | Zugewiesener RAM | Speicherpool | Statische IP | Kategorie | Primärer Dienst |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **100** | `nginx` | Debian 13 | 2 | 112 MB | `local-lvm:4G` | `192.168.1.3` | Ingress | Nginx Proxy Manager + CrowdSec Bouncer |
| **101** | `pihole` | Debian 13 | 1 | 96 MB | `local-lvm:4G` | `192.168.1.4` | DNS | Interner DNS-Resolver & Werbeblocker |
| **102** | `tailscale` | Debian 13 | 1 | 96 MB | `local-lvm:4G` | `192.168.1.5` | VPN | WireGuard Mesh Subnetz-Router Primär |
| **103** | `immich` | Debian 13 | 4 | 896 MB | `local-lvm:32G` | `192.168.1.15` | Storage / KI | Fotoverwaltung & ML-Gesichtserkennung |
| **104** | `nextcloud` | Debian 13 | 2 | 512 MB | `local-lvm:20G` | `192.168.1.8` | Storage | Enterprise Cloud & WebDAV-Synchronisation |
| **105** | `crowdsec` | Debian 13 | 1 | 128 MB | `local-lvm:4G` | `192.168.1.9` | Sicherheit | Threat-Intelligence & Entscheidungs-Engine IPS |
| **106** | `homeassistant` | Debian 13 | 2 | 384 MB | `local-lvm:16G` | `192.168.1.10` | Automation | Smart Home Zentrale, Zigbee & ESP32 |
| **107** | `n8n` | Debian 13 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.13` | Automation | Workflow-Orchestrierung & SOAR-Playbooks |
| **110** | `ollama` | Debian 13 | 4 | 2.048 MB | `local-lvm:16G` | `192.168.1.110` | Lokale KI | LLM GPU-Inferenz (Qwen2.5-Coder & DeepSeek-R1) |
| **111** | `openwebui` | Debian 13 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.111` | Lokale KI | ChatGPT Web-Oberfläche für Ollama |
| **112** | `paperless` | Debian 13 | 2 | 768 MB | `local-lvm:20G` | `192.168.1.16` | Storage / DMS | Dokumenten-Management & Tesseract OCR |
| **113** | `minio` | Alpine 3.24 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.17` | Storage | AWS S3-kompatibler Objektspeicher-Server |
| **114** | `transmission` | Alpine 3.24 | 1 | 256 MB | `local-lvm:8G` | `192.168.1.19` | Medien | Isolierter BitTorrent-Download-Client |
| **115** | `kavita` | Alpine 3.24 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.20` | Medien | Digitaler E-Book-, Manga- & Comic-Reader |
| **116** | `stirling` | Alpine 3.24 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.21` | Werkzeuge | Lokale Offline-PDF-Verarbeitungssuite |
| **117** | `meilisearch` | Alpine 3.24 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.22` | Suche | Ultraschnelle Volltext-Suchmaschine |
| **118** | `vector` | Alpine 3.24 | 1 | 128 MB | `local-lvm:4G` | `192.168.1.23` | Monitoring | Rust Telemetrie- und Log-Pipeline |
| **119** | `whisper` | Debian 13 | 2 | 1.024 MB | `local-lvm:8G` | `192.168.1.24` | Lokale KI | Faster-Whisper Sprach-zu-Text CUDA API |
| **130** | `searxng` | Alpine 3.24 | 2 | 256 MB | `local-lvm:4G` | `192.168.1.25` | Privatsphäre | Metasuchmaschine ohne Tracking |
| **131** | `flowise` | Alpine 3.24 | 2 | 512 MB | `local-lvm:4G` | `192.168.1.26` | Lokale KI | Visueller LLM-Agenten & Flow-Builder |
| **132** | `netalertx` | Alpine 3.24 | 1 | 128 MB | `local-lvm:4G` | `192.168.1.27` | Sicherheit | WLAN- und Netzwerk-Eindringungserkennung |
| **133** | `rustdesk` | Alpine 3.24 | 1 | 128 MB | `local-lvm:2G` | `192.168.1.28` | Remote | Self-Hosted Remote-Desktop-Relais in Rust |
| **134** | `audiobookshelf` | Alpine 3.24 | 2 | 256 MB | `local-lvm:4G` | `192.168.1.29` | Medien | Hörbuch- und Podcast-Streaming-Server |
| **135** | `tubearchivist` | Alpine 3.24 | 2 | 512 MB | `local-lvm:8G` | `192.168.1.30` | Medien | Lokales Archivieren von YouTube-Kanälen |
| **136** | `kopia` | Alpine 3.24 | 1 | 128 MB | `local-lvm:4G` | `192.168.1.31` | Backup | Verschlüsseltes Snapshot-Backup mit Deduplizierung |
| **137** | `wgeasy` | Alpine 3.24 | 1 | 128 MB | `local-lvm:2G` | `192.168.1.32` | VPN | Einfaches WireGuard Management-Portal |
| **138** | `calibreweb` | Alpine 3.24 | 1 | 128 MB | `local-lvm:4G` | `192.168.1.33` | Medien | Calibre Web-Bibliotheksverwaltung |
| **140** | `codeserver` | Alpine 3.24 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.40` | Entwicklung | Vollwertiges Visual Studio Code im Browser |
| **141** | `pgadmin` | Alpine 3.24 | 1 | 192 MB | `local-lvm:4G` | `192.168.1.41` | Datenbank | Visuelle PostgreSQL Datenbank-Verwaltung |
| **142** | `cyberchef` | Alpine 3.24 | 1 | 64 MB | `local-lvm:2G` | `192.168.1.42` | DFIR / Krypto | Schweizer Taschenmesser für Kryptoanalyse |
| **143** | `drawio` | Alpine 3.24 | 1 | 96 MB | `local-lvm:2G` | `192.168.1.43` | Architektur | Offline-Diagrammerstellung für Netzwerktopologien |
| **144** | `dozzle` | Alpine 3.24 | 1 | 48 MB | `local-lvm:2G` | `192.168.1.44` | Monitoring | Echtzeit-Container-Log-Betrachter |
| **145** | `kiwix` | Alpine 3.24 | 1 | 96 MB | `local-lvm:4G` | `192.168.1.45` | Wissen | Offline-Server für Wikipedia, ArchWiki & Docs |
| **146** | `romm` | Alpine 3.24 | 2 | 192 MB | `local-lvm:8G` | `192.168.1.46` | Retro-Gaming | Retro-Spiele & ROM-Sammlungsverwaltung |
| **147** | `emulatorjs` | Alpine 3.24 | 1 | 96 MB | `local-lvm:4G` | `192.168.1.47` | Retro-Gaming | Retro-Spiele direkt im Browser mit WebAssembly |
| **149** | `pbs` | Alpine 3.24 | 2 | 512 MB | `local-lvm:2G` | `192.168.1.149` | Speicher / Backup | Proxmox Backup Server (Deduplizierung & Snapshot-Prüfung) |
| **150** | `pdm` | Alpine 3.24 | 2 | 512 MB | `local-lvm:2G` | `192.168.1.150` | Management | Proxmox Datacenter Manager (Zentrale Multi-Cluster-Flotte) |
| **151** | `pmg` | Alpine 3.24 | 2 | 512 MB | `local-lvm:2G` | `192.168.1.151` | Sicherheit / Mail | Proxmox Mail Gateway (Anti-Spam & ClamAV Schutz) |

### Detaillierter LXC-Container-Katalog (Knoten 3 — Apple M1 ARM64 UTM)

| VMID | Hostname | Basis-OS | vCPU | Zugewiesener RAM | Speicherpool | Statische IP | Kategorie | Primärer Dienst |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **100** | `it-tools` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.100` | Utilities | IT-Tools Praktische Web-Werkzeuge für Entwickler |
| **101** | `actualbudget` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.101` | Finanzen | Actual Budget Lokale Finanzverwaltung |
| **102** | `trilium` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.102` | Notizen | Hierarchische Wissensdatenbank und Notizspeicher |
| **103** | `changedetection` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.103` | Automation | Webseiten-Änderungsüberwachung & Benachrichtigung |
| **104** | `scrutiny` | Debian 13 | 1 | 128 MB | `local:2G` | `192.168.64.104` | Monitoring | Festplatten-Gesundheits-Telemetrie S.M.A.R.T. |
| **105** | `uptimekuma` | Debian 13 | 1 | 128 MB | `local:4G` | `192.168.64.105` | Monitoring | Dienstverfügbarkeits- und SLA-Überwachung |
| **106** | `vaultwarden` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.106` | Sicherheit | Bitwarden-kompatibler Passwort-Manager |
| **107** | `monitoring` | Debian 13 | 2 | 384 MB | `local:2G` | `192.168.64.107` | Monitoring | Prometheus TSDB & Grafana Dashboards |
| **108** | `authelia` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.108` | Sicherheit | Authelia 2FA & SSO Portal (FIDO2 / WebAuthn) |
| **109** | `gitea` | Debian 13 | 2 | 160 MB | `local:2G` | `192.168.64.109` | Entwicklung | Self-Hosted Git-Forge & Code-Review |
| **110** | `woodpecker` | Alpine 3.24 | 2 | 192 MB | `local:2G` | `192.168.64.110` | CI/CD | Woodpecker CI Automatisierungs-Engine |
| **111** | `gatus` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.111` | Monitoring | Automatisches Status-Dashboard in Go |
| **112** | `ntfy` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.112` | Benachrichtigung| Private Push-Benachrichtigungen aufs Smartphone |
| **113** | `linkding` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.122` | Automation | Lesezeichen-Manager & Technische Suche |
| **114** | `stepca` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.114` | Sicherheit | Private PKI-Zertifizierungsstelle & ACME TLS |
| **115** | `tailscale-arm` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.115` | VPN | Tailscale Subnetz-Router (ARM64-Segment) |
| **116** | `beszel` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.116` | Monitoring | Hochauflösende 1s-System-Telemetrie |
| **117** | `pocketbase` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.117` | Backend | Vollständiges SQLite-Echtzeit-Backend in 1 Datei |
| **118** | `homepage` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.118` | Dashboard | Zentrales Homelab Übersichts-Dashboard |
| **119** | `speedtest` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.119` | Monitoring | Automatisierte Bandbreiten- & Jitter-Telemetrie |
| **120** | `memos` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.120` | Notizen | Schnelle Markdown-Notizen & Wissensspeicher |
| **121** | `wallos` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.121` | Finanzen | Ausgaben- und Abonnement-Tracker |
| **122** | `syncthing` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.122` | Storage | Kontinuierliche P2P-Dateisynchronisation |
| **123** | `microbin` | Alpine 3.24 | 1 | 16 MB | `local:2G` | `192.168.64.123` | Sicherheit | Verschlüsseltes Pastebin in Rust |
| **124** | `vikunja` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.124` | Aufgaben | Aufgabenverwaltung & Kanban-Projekt-Boards |
| **125** | `blackbox` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.125` | Monitoring | Prometheus Blackbox-Sonde (ICMP / TLS-Ablauf) |
| **126** | `yourspotify` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.126` | Analytik | Private Spotify-Hörstatistiken |
| **127** | `webcheck` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.127` | OSINT | OSINT-Sicherheitsscanner & Domänen-Prüfung |
| **128** | `opengist` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.128` | Entwicklung | Privater Code-Snippet & Gist-Speicher |
| **129** | `flatnotes` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.129` | Notizen | Minimalistischer Flat-File Markdown Notiz-Editor |
| **130** | `bark` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.130` | Benachrichtigung| Apple iOS Native Push-Benachrichtigungen |
| **131** | `shiori` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.131` | Storage | Webseiten-Archivierung in Reintext in Go |
| **132** | `whoogle` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.132` | Privatsphäre | Anonymisierte Google-Suche ohne Werbung |
| **133** | `flame` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.133` | Dashboard | Minimalistische Startseite für den Browser |
| **134** | `dashy` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.134` | Dashboard | Hochgradig anpassbares Homelab-Dashboard |
| **135** | `shlink` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.135` | Produktivität | URL-Kürzer mit Geolokalisierungs-Statistiken |
| **136** | `pastefy` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.136` | Produktivität | Sicheres und ansprechendes Pastebin |
| **137** | `pingvin` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.137` | Speicher | Private File-Sharing-Plattform |
| **138** | `rssbridge` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.138` | Feeds | RSS-Feed-Generator für externe Webseiten |
| **139** | `playwright` | Alpine 3.24 | 2 | 192 MB | `local:2G` | `192.168.64.139` | Sonde | Headless Browser Worker für dynamische Checks |
| **140** | `uptimechk` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.140` | Monitoring | Sekundäre Uptime-Verifizierungssonde |
| **141** | `dnsbench` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.141` | Netzwerk | DNS-Benchmark und Latenz-Analytik |
| **142** | `excalidraw` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.142` | Produktivität | Kollaboratives Whiteboard Excalidraw |
| **143** | `snagim` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.143` | Medien | Schneller Screenshot-Hosting-Server |
| **144** | `whoogletor` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.144` | Privatsphäre | Verschlüsselte Google-Suche über das Tor-Netzwerk |
| **145** | `heimdall` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.145` | Dashboard | Anwendungs-Dashboard mit Live-Statusanzeigen |
| **146** | `pbs` | Alpine 3.24 | 2 | 512 MB | `local:2G` | `192.168.64.146` | Speicher / Backup | Proxmox Backup Server (Deduplizierung & Prüfung) |
| **147** | `pdm` | Alpine 3.24 | 2 | 512 MB | `local:2G` | `192.168.64.147` | Management | Proxmox Datacenter Manager (Flotten-Orchestrierung) |
| **148** | `pmg` | Alpine 3.24 | 2 | 512 MB | `local:2G` | `192.168.64.148` | Sicherheit / Mail | Proxmox Mail Gateway (Spam-Schutz & ClamAV) |

### Virtuelle Maschinen (QEMU / KVM)

| VMID | Name | Kerne / Sockets | RAM | Festplattengröße | Netzwerkschnittstelle | Primäre Rolle |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **200** | `opnsense-firewall` | 2C / 1S | 1.024 MB | 16 GB SSD | Multi-VLAN Trunk | Perimeter-Stateful-Firewall, Suricata IDS/IPS, WireGuard Gateway |
| **201** | `win-server-2025` | 4C / 1S | 4.096 MB | 120 GB SSD | VLAN 20 (`192.168.20.201`) | Active Directory (AD DS), DNS, Gruppenrichtlinien (GPO), Sysmon |
| **202** | `rhel-enterprise` | 2C / 1S | 2.048 MB | 50 GB SSD | VLAN 20 (`192.168.1.202`) | Red Hat Enterprise Linux 9 (SELinux Enforcing, Podman, Enterprise Stack) |
| **203** | `freebsd-storage` | 2C / 1S | 1.536 MB | 25 GB SSD | VLAN 20 (`192.168.1.203`) | FreeBSD 14.1-RELEASE (Nativer OpenZFS Speicher, BSD Jails & Netzwerk-Lab) |
| **204** | `openbsd-bastion` | 2C / 1S | 1.536 MB | 25 GB SSD | VLAN 20 (`192.168.1.204`) | OpenBSD 7.5 (Gehärteter Bastion Jump Host, Paketfilter PF, pledge/unveil) |
| **205** | `talos-k8s-node` | 2C / 1S | 2.048 MB | 32 GB SSD | VLAN 20 (`192.168.1.205`) | Talos Linux 1.7 (Unveränderliches Minimal-OS, Deklarative gRPC-API, Kubernetes) |
| **206** | `capev2-malware-sandbox` | 4C / 1S | 4.096 MB | 100 GB SSD | VLAN 30 (`192.168.30.206`) | Isolierte Malware-Analyse Sandbox (Win10 + INetSim + Volatility) |

---

## 5. Infrastructure as Code (Terraform & Ansible)

```bash
# 1. Repository klonen
git clone https://github.com/stefanutc1/homelab.git
cd homelab/terraform

# 2. Variablen anpassen und Cluster bereitstellen
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan -out=tfplan.binary
terraform apply tfplan.binary

# 3. Systemkonfiguration mit Ansible anwenden
cd ../ansible
ansible-playbook playbooks/site.yml
```

---

<div align="center">

**Autor**: [@stefanutc1](https://github.com/stefanutc1)  
Veröffentlicht unter der **MIT-Lizenz**.

</div>
