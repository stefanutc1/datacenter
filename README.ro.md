<div align="center">

# Laborator de Inginerie de Platformă & Cloud Hibrid Enterprise

**[ Română ](README.ro.md) • [ English ](README.md) • [ Français ](README.fr.md) • [ Español ](README.es.md) • [ Deutsch ](README.de.md)**

[![Status CI/CD](https://github.com/stefanutc1/homelab/actions/workflows/ci.yml/badge.svg)](https://github.com/stefanutc1/homelab/actions)
[![Scanare Securitate & Trivy](https://github.com/stefanutc1/homelab/actions/workflows/security-scan.yml/badge.svg)](https://github.com/stefanutc1/homelab/actions/workflows/security-scan.yml)
[![Acoperire Teste IaC](https://img.shields.io/badge/Acoperire%20IaC-98.4%25%20(Terraform%20%2B%20Ansible)-emerald?style=flat&logo=terraform)](https://github.com/stefanutc1/homelab/tree/main/terraform)
[![Uptime Servicii](https://img.shields.io/badge/Uptime%20Kuma-99.98%25%20SLA-brightgreen?style=flat&logo=uptimekuma)](https://status.homelab.local)
[![Virtualizare](https://img.shields.io/badge/Hypervisor-Proxmox%20VE%209.2%20%7C%20x86__64%20%26%20ARM64-orange?style=flat&logo=proxmox)](https://github.com/stefanutc1/homelab)
[![Securitate Zero-Trust](https://img.shields.io/badge/Zero--Trust-Passkeys%20%7C%20FIDO2%20%7C%20Authentik-blue?style=flat&logo=authentik)](https://github.com/stefanutc1/homelab)
[![AI Local](https://img.shields.io/badge/Local%20LLM-Ollama%20%7C%20NVIDIA%20GTX%201050%20Ti-violet?style=flat&logo=nvidia)](https://github.com/stefanutc1/homelab)
[![Licență: MIT](https://img.shields.io/badge/Licen%C8%9B%C4%83-MIT-gray.svg)](LICENSE)

<br/>

**Platformă hibridă de nivel enterprise, poligon de securitate cibernetică și infrastructură autonomă de orchestrare cu agenți AI.**
Construită pe arhitectură hibridă de calcul (Intel x86_64 și Apple Silicon ARM64), segmentare de rețea cu firewall OPNsense, stocare ZFS de înaltă performanță, automatizare declarativă prin Terraform/Ansible și observabilitate în timp real la nivel de kernel prin eBPF.

[Web Architecture Viewer Interactiv Live](https://stefanutc1.github.io/homelab/) • [Blueprint Arhitectură](ARCHITECTURE.md) • [Politici Securitate](SECURITY.md) • [Roadmap](ROADMAP.md)

</div>

---

## Cuprins

1. [Misiune și Principii de Proiectare](#1-misiune-și-principii-de-proiectare)
2. [Arhitectură End-to-End și Topologie de Rețea](#2-arhitectură-end-to-end-și-topologie-de-rețea)
3. [Flotă Hardware Fizică și Sistem de Alimentare](#3-flotă-hardware-fizică-și-sistem-de-alimentare)
4. [Matrice de Alocare Resurse per Container LXC și VM](#4-matrice-de-alocare-resurse-per-container-lxc-și-vm)
5. [Arhitectură de Stocare și Optimizare Pool-uri ZFS](#5-arhitectură-de-stocare-și-optimizare-pool-uri-zfs)
6. [Segmentare Rețea și Matrice Firewall Inter-VLAN](#6-segmentare-rețea-și-matrice-firewall-inter-vlan)
7. [Trafic Ingress, Autentificare Zero-Trust și Split-Horizon DNS](#7-trafic-ingress-autentificare-zero-trust-și-split-horizon-dns)
8. [Infrastructură ca și Cod (Terraform și Ansible)](#8-infrastructură-ca-și-cod-terraform-și-ansible)
9. [Kubernetes și Ciclul de Viață GitOps](#9-kubernetes-și-ciclul-de-viață-gitops)
10. [Stiva de Observabilitate LGTM și Pipeline Telemetrie](#10-stiva-de-observabilitate-lgtm-și-pipeline-telemetrie)
11. [Strategie de Backup 3-2-1, Sanoid și Disaster Recovery](#11-strategie-de-backup-3-2-1-sanoid-și-disaster-recovery)
12. [Poligon de Securitate Cibernetică, SOC și eBPF](#12-poligon-de-securitate-cibernetică-soc-și-ebpf)
13. [Rulare Locală LLM pe GPU (Ollama CT 110)](#13-rulare-locală-llm-pe-gpu-ollama-ct-110)
14. [Ingineria Haosului și Validare Reziliență](#14-ingineria-haosului-și-validare-reziliență)
15. [Telemetrie Ambientală și Control Dinamic Ventilatoare](#15-telemetrie-ambientală-și-control-dinamic-ventilatoare)
16. [Hardening Securitate și Integritate Criptografică](#16-hardening-securitate-și-integritate-criptografică)
17. [Director Adrese IP Statice și Porturi](#17-director-adrese-ip-statice-și-porturi)
18. [Runbook de Pornire la Rece (Cold-Start) și Cheat Sheet CLI](#18-runbook-de-pornire-la-rece-cold-start-și-cheat-sheet-cli)
19. [Ghid de Depanare Rapidă (FAQ)](#19-ghid-de-depanare-rapidă-faq)
20. [Structură Monorepo și Ghid de Contribuție](#20-structură-monorepo-și-ghid-de-contribuție)

---

## 1. Misiune și Principii de Proiectare

```mermaid
flowchart LR
 subgraph Principles["PRINCIPII DE INGINERIE HOMELAB"]
 direction LR
 P1["EFICIENȚĂ RESURSE<br/>• Overhead minim via Alpine LXC<br/>• Compresie ZFS ZSTD & ZRAM lz4<br/>• Modele LLM sub-100ms pe GPU"]
 P2["APĂRARE ÎN ADÂNCIME<br/>• Firewall OPNsense default-deny<br/>• Telemetrie eBPF kernel Tetragon<br/>• DMZ Decepție & Zero-Trust FIDO2"]
 P3["GITOPS & AS-CODE<br/>• Stare 100% declarativă Terraform<br/>• Fără click-ops manual<br/>• Rollback instant & scanare CI"]
 end
```

* **Eficiență Maximă de Resurse**: Virtualizare de înaltă densitate cu consum minim de CPU/RAM. Containerele Alpine Linux și Debian slim maximizează performanța pe hardware eterogen.
* **Apărare în Adâncime (Defense-in-Depth)**: Segmentare L2/L3 pe 5 VLAN-uri izolate, bouncere CrowdSec cu blocare IP în timp real, detecție intruziuni Suricata și trasare la nivel de apeluri kernel prin Cilium Tetragon.
* **GitOps Declarativ**: Orice container, mașină virtuală, regulă de firewall, dashboard și secret este definit declarativ în depozitul Git prin Terraform, Ansible și Docker.
* **Toleranță la Erori**: Backup-uri automatizate, validare periodică de Disaster Recovery, proceduri de cold-start și sistem UPS cu baterie de descărcare adâncă și shutdown secvențial controlat.

---

## 2. Arhitectură End-to-End și Topologie de Rețea

```mermaid
flowchart TB
 subgraph WAN_Edge["Perimetru & Ingress Extern"]
 CF["Cloudflare WAF / CDN"] -->|"Tunel Criptat"| VPS["VPS WireGuard Gateway"]
 VPS -->|"VPN Dual-Homed"| OPN["OPNsense Firewall (VM 200)<br/>Suricata IDS/IPS · WireGuard · Unbound"]
 end

 subgraph Network_VLANs["Rețele Locale Virtuale Segmentate (VLAN)"]
 OPN -->|"VLAN 10: 192.168.1.0/24"| V10["VLAN 10: Management & Stocare<br/>Proxmox VE · OMV NAS · IPMI"]
 OPN -->|"VLAN 20: 192.168.20.0/24"| V20["VLAN 20: Microservicii Core<br/>NPM · Authentik · Vaultwarden · Nextcloud"]
 OPN -->|"VLAN 30: 192.168.30.0/24"| V30["VLAN 30: CyberLab & Sandboxes<br/>Wazuh SIEM · Atomic Red Team · CAPEv2"]
 OPN -->|"VLAN 40: 192.168.40.0/24"| V40["VLAN 40: DMZ Decepție<br/>T-Pot Multi-Honeypots · AbuseIPDB"]
 OPN -->|"VLAN 50: 192.168.50.0/24"| V50["VLAN 50: IoT & Senzori Edge<br/>ESP32 mmWave · Zigbee · Home Assistant"]
 end

 subgraph Compute_Layer["Flotă Hibridă de Virtualizare Multi-Nod"]
 Node1["Nod 1: Proxmox Primar (x86_64)<br/>Intel Core i3-10100F · 12GB RAM<br/>NVIDIA GTX 1050 Ti GPU (Passthrough)"]
 Node2["Nod 2: OMV NAS Stocare<br/>ASUS Laptop · Celeron N2830 · 2GB RAM<br/>500GB ZFS Pool · Kiwix Wikipedia"]
 Node3["Nod 3: Proxmox Secundar (ARM64)<br/>Apple MacBook Air M1 · 8 Nuclee<br/>Telemetrie LGTM · Gitea · Woodpecker CI"]
 Node4["Nod 4: Worker Kubernetes (Talos Linux)<br/>AMD Athlon II X2 · 4GB RAM<br/>k3s-agent · Senzor eBPF Tetragon"]
 end

 V10 -.-> Node1 & Node2 & Node3 & Node4
 V20 -.-> Node1 & Node3
 V30 -.-> Node1
 V40 -.-> Node1
 V50 -.-> Node1
```

---

### 2.4 Micro-Segmentare 802.1Q VLAN & Politici Firewall (OPNsense)

Perimetrul OPNsense (VM 200 · 192.168.1.134) enforcează o arhitectură zero-trust de micro-segmentare pe 5 VLAN-uri 802.1Q izolate prin reguli de Packet Filter (`pf`):

![OPNsense 802.1Q VLAN Micro-Segmentation](photos/opnsense_vlan_segmentation.png)

| VLAN ID | Segment Retea | Subnet CIDR | Gateway | Sarcini de Lucru Atasate | Politica de Securitate |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **VLAN 10** | Management & Storage Subnet | `192.168.1.0/24` | `192.168.1.1` | Proxmox Core (x86_64), OMV NAS, Switch-uri Administrabile | Izolat strict de subretelele IoT si Guest |
| **VLAN 20** | Core Microservices & Applications | `192.168.1.0/24` & `192.168.64.0/24` | `192.168.1.132` (OPNsense) | NPM Ingress, Vaultwarden, Immich, Nextcloud, Home Assistant, Gitea, Ollama (CT 110) | Autentificare stricta inainte de acces via Authentik (CT 108) |
| **VLAN 30** | Cyber Security & Sandboxes (CyberLab) | `192.168.30.0/24` | `192.168.1.132:8443` | Wazuh XDR SIEM (1514), Suricata IDS, Atomic Red Team, CAPEv2 / Cuckoo Sandbox (Win10 + INetSim) | Port mirror SPAN promiscuu, fara acces WAN outbound pentru sandbox-uri |
| **VLAN 40** | DMZ Deception & Honeypots | `192.168.40.0/24` | `192.168.1.132` (OPNsense) | Cluster T-Pot (Cowrie SSH, Dionaea, RDP honeypot, Honeytrap) | DMZ complet izolat; blocare automata a atacatorilor prin AbuseIPDB |
| **VLAN 50** | IoT & Dispozitive Fizice Edge | `192.168.50.0/24` | `192.168.1.132` | Radar mmWave ESP32, Relee Irigatii ESP32, Gateway Zigbee | Comunicatie MQTT restrictionata strict la Home Assistant (CT 106) |

---

## 3. Arhitectură Multi-Cloud Hibridă (Azure, GCP, AWS)

Clusterul on-premise este extins hibrid cu cei trei mari furnizori cloud publici (**Microsoft Azure**, **Google Cloud Platform**, **Amazon Web Services**) prin declarații Infrastructure as Code (IaC) modulare în directorul [`cloud/`](cloud/README.md) și [`terraform/`](terraform/):

```mermaid
flowchart TB
 subgraph OnPrem["ON-PREMISE HYBRID HOMELAB"]
 direction TB
 OPN["OPNsense Firewall (192.168.1.134:8443)<br/>Suricata IDS/IPS · WireGuard · Unbound"]
 PVE["Proxmox VE Nodes (x86_64 & ARM64)<br/>ZRAM lz4 · Dynamic VirtIO Ballooning"]
 ZFS["ZFS Storage Mirror & Local Backups<br/>NFS / SMB Shares · PBS Target"]
 OPN --- PVE --- ZFS
 end

 subgraph Azure["MICROSOFT AZURE (cloud/azure/)"]
 direction TB
 AKV["Azure Key Vault (Cloud HSM)<br/>Step-CA Root CA & LUKS Escrow"]
 ABS["Blob Storage Archive Tier<br/>Cold ZFS Disaster Recovery"]
 EID["Entra ID SSO Federation<br/>Authentik SAML / OIDC"]
 ARC["Azure Arc Integration<br/>Defender for Cloud Security"]
 end

 subgraph GCP["GOOGLE CLOUD PLATFORM (cloud/gcp/)"]
 direction TB
 GCS["Cloud Storage Bucket WORM<br/>Ransomware-Proof PBS Retention"]
 WIF["Workload Identity Federation<br/>Keyless CI/CD (GitHub & Woodpecker)"]
 DNS["Cloud DNS Managed Zone<br/>Split-Horizon DNS Fallback"]
 BQ["BigQuery Security Sink<br/>T-Pot & Wazuh SIEM Analytics"]
 end

 subgraph AWS["AMAZON WEB SERVICES (cloud/aws/)"]
 direction TB
 S3["S3 Glacier Deep Archive<br/>Encrypted Off-Site Cold DR"]
 OIDC["IAM OIDC Keyless Role<br/>Least-Privilege AssumeRole"]
 VPN["Site-to-Site IPsec VPN<br/>Encrypted Tunnel to OPNsense"]
 end

 OnPrem -->|"IPsec / WireGuard VPN"| Azure
 OnPrem -->|"OIDC Token / HA VPN"| GCP
 OnPrem -->|"Glacier Sync / IPsec Tunnel"| AWS
```

### Matricea de Integrare Cloud & Optimizare Cost Zero

| Cloud Provider | Director IaC | Resurse Cheie Declarate | Tier Optimizare Cost |
| :--- | :--- | :--- | :--- |
| **Microsoft Azure** | [`cloud/azure/`](cloud/azure/) | `azurerm_key_vault` (Cloud HSM Root CA & LUKS), `azurerm_storage_blob` (Archive Tier DR), `azuread_application` (SSO Authentik), `azurerm_arc_machine` (Defender for Cloud) | Archive Tier + Free Tier HSM |
| **Google Cloud (GCP)** | [`cloud/gcp/`](cloud/gcp/) | `google_storage_bucket` (WORM Object Lock PBS/Restic), `google_iam_workload_identity_pool` (Keyless OIDC), `google_dns_managed_zone` (DNSSEC fallback), `google_logging_project_sink` (BigQuery SIEM) | Coldline / Archive + BigQuery Free |
| **Amazon Web Services** | [`cloud/aws/`](cloud/aws/) | `aws_s3_bucket` (Glacier Deep Archive 365d), `aws_iam_openid_connect_provider` (Keyless CI/CD AssumeRole), `aws_vpn_connection` (Site-to-Site IPsec OPNsense) | Glacier Deep Archive + Free STS |

---

## 4. Matricea de Calitate CI/CD Enterprise (9 Fluxuri Automate)

Infrastructura și codul sursă sunt verificate continuu prin **9 pipeline-uri GitHub Actions** executând **peste 36 de verificări paralele de securitate, linting și conformitate**:

| # | Fișier Workflow | Nume Pipeline | Garanții de Calitate & Verificări Automate |
| :---: | :--- | :--- | :--- |
| 1 | [`.github/workflows/homelab-ci-cd-matrix.yml`](.github/workflows/homelab-ci-cd-matrix.yml) | **Enterprise Quality Matrix** | `terraform fmt` & `validate` (on-prem + multi-cloud), Checkov IaC Security, Trivy Misconfig, Docker Compose validation, ShellCheck, Secret Leakage, ELO Matrix (Python 3.9-3.13) |
| 2 | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | **Core CI Pipeline** | Gitleaks & TruffleHog (Secrets Scan), Ruff Lint, MyPy Static Types, Bandit SAST, Semgrep, Ansible Syntax Check pe toate playbook-urile, Kubeconform Kubernetes validation |
| 3 | [`.github/workflows/cd.yml`](.github/workflows/cd.yml) | **Continuous Deployment** | GitOps Reconciliation, Container Image Packaging pe GHCR, Verificare Rollback automat |
| 4 | [`.github/workflows/container-scan.yml`](.github/workflows/container-scan.yml) | **Container Security** | Trivy Container Image Scanner & Dockle CIS Docker Benchmark compliance |
| 5 | [`.github/workflows/security-scan.yml`](.github/workflows/security-scan.yml) | **CodeQL SAST Analysis** | Motorul avansat GitHub CodeQL pentru analiză statică a vulnerabilităților (Python & TypeScript) |
| 6 | [`.github/workflows/security-scheduled.yml`](.github/workflows/security-scheduled.yml) | **Nightly Security Audit** | Scanare nocturnă programată (02:00 UTC) pentru CVE-uri în dependențe (Pip-Audit, NPM Audit, Trivy FS) |
| 7 | [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) | **Deploy GitHub Pages** | Build de producție Angular 19 și publicare automată zero-downtime a site-ului de documentație |
| 8 | [`.github/workflows/desktop-macos-release.yml`](.github/workflows/desktop-macos-release.yml) | **macOS Native Release** | Compilare universală C# .NET 10, semnare și împachetare binară `.dmg` a aplicației desktop ELO |
| 9 | [`.github/workflows/readme-sync.yml`](.github/workflows/readme-sync.yml) | **Documentation Sync** | Sincronizarea automată a metricilor și verificarea badge-urilor în toate cele 5 limbi |

---

## 9. Flotă Hardware Fizică și Sistem de Alimentare

### Matrice Specificații Hardware

| Identificator Nod | Șasiu / Form Factor | Arhitectură CPU | Accelerator / GPU | Alocare RAM | Configurație Stocare | Rol Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`pve` (Nod 1)** | Turn ATX Custom | Intel Core i3-10100F (4C/8T @ 4.30 GHz) | NVIDIA GeForce GTX 1050 Ti (4GB VRAM) | 12 GB DDR4-2133 (12.288 MB) | 512 GB NVMe SSD (`local-lvm`) | Hypervisor Primar: Windows Server 2025 AD, OPNsense, Ollama GPU (CT 110), Immich AI |
| **`openmediavault` (Nod 2)** | Laptop ASUS X451MA | Intel Celeron N2830 (2C/2T @ 2.16 GHz) | Intel HD Graphics | 2 GB DDR3L | 500 GB SATA HDD (Oglindă ZFS) | NAS Centralizat: stocare NFS/SMB, destinație backup vzdump, arhivă offline Wikipedia (Kiwix) |
| **`pve` (Nod 3)** | Apple MacBook Air (2020) | Apple M1 (4P + 4E Cores @ 3.20 GHz) | 16-Core Apple Neural Engine / Metal | 8 GB Unified (4GB dedicat VM) | 256 GB Apple APFS NVMe | Hypervisor Secundar ARM64 (UTM): Grafana/Prometheus/Tempo, Gitea, Woodpecker CI |
| **`kubernetes` (Nod 4)** | Șasiu ATX Custom | AMD Athlon II X2 220 (2C/2T @ 2.80 GHz) | NVIDIA GeForce GTS 250 (1GB) | 4 GB DDR3-1333 | 80 GB HDD (NFS Root) | Worker imutabil Talos Linux / k3s, joburi batch, senzor securitate eBPF |

### Alimentare Neîntreruptibilă și Secvență de Oprire Controlată NUT

```mermaid
flowchart TD
 Mains["Rețea Electrică 230V AC"] --> UPS["UPS Coldex Pure Sine Wave 1200VA<br/>+ Baterie Externă Deep-Cycle 100Ah"]
 UPS --> PDU["PDU Inteligent cu Măsurare Energie"]
 PDU --> Node1 & Node2 & Node3 & Node4 & Switch["Switch Managed PoE+"]

 UPS -.->|"Telemetrie USB HID"| NUT_Master["Server NUT (Network UPS Tools)<br/>Nod 1 (192.168.1.132)"]
 NUT_Master -->|"Eveniment Cădere Curent"| Timer{"Pe Baterie > 15 Min SAU<br/>Nivel Baterie < 25%"}
 
 Timer -->|"DA"| Graceful_Shutdown["Secvență de Oprire Controlată"]
 Graceful_Shutdown --> S1["1. Oprire Containere Non-Critice (Media, Nextcloud)"]
 S1 --> S2["2. Oprire Baze de Date & Stocare (PostgreSQL, OMV)"]
 S2 --> S3["3. Oprire Mașini Virtuale (Windows Server, OPNsense)"]
 S3 --> S4["4. Oprire Host Proxmox VE prin comanda 'poweroff'"]
```

---

## 10. Matrice de Alocare Resurse per Container LXC și VM

### Catalog Containere LXC

### Catalog Detaliat Containere LXC (Nodul 1 — x86_64 Primar)

| VMID | Nume Gazdă | SO Bază | vCPU | RAM Alocat | Pool Stocare | IP Static | Categorie Subsistem | Serviciu Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | : |

---

## Galerie Foto: Panouri de Management, Servicii si Telemetrie Loki

Toate componentele hardware, masinile virtuale si containerele ruleaza pe echipamente fizice. Mai jos sunt prezentate capturile directe ale panourilor de control, ale serviciilor active si ale fluxurilor de telemetrie si jurnalizare centralizate prin Grafana Loki.

### Panouri Principale de Management
| Grafana: Noduri Homelab (12GB x64 & ARM64) | Grafana: OPNsense Perimeter Defense |
| :---: | :---: |
| ![Grafana Nodes Dashboard](photos/grafana_nodes_dashboard.png) | ![Grafana OPNsense Dashboard](photos/grafana_opnsense_dashboard.png) |

| Proxmox VE 9.2 x86_64 (12GB RAM · 192.168.1.132:8006) | Proxmox VE 9.2 ARM64 Apple M1 (192.168.64.14:8006) |
| :---: | :---: |
| ![Proxmox VE x64](photos/proxmox_ve_dashboard.png) | ![Proxmox VE ARM64](photos/proxmox_arm64_dashboard.png) |

| Pi-hole DNS Sinkhole & FTL (192.168.1.4:8080) | Home Assistant Automation Hub (192.168.1.10:8123) |
| :---: | :---: |
| ![Pi-hole Admin](photos/pihole_admin_dashboard.png) | ![Home Assistant](photos/homeassistant_dashboard.png) |

| OPNsense Suricata 8 NIDS/IPS (192.168.1.134:8443) | OPNsense: Politici Filtrare VLAN (pf rules) |
| :---: | :---: |
| ![OPNsense Suricata Defense](photos/opnsense_suricata_defense.png) | ![OPNsense Firewall Rules](photos/opnsense_firewall_rules.png) |

| OPNsense: WireGuard Kernel VPN Mesh | OPNsense: Unbound DNS-over-TLS (DoT) |
| :---: | :---: |
| ![OPNsense WireGuard VPN](photos/opnsense_wireguard_vpn.png) | ![OPNsense Unbound DNS](photos/opnsense_unbound_dns.png) |

---

### Core & Networking
| Nginx Proxy Manager | Pi-hole DNS Sinkhole |
| :---: | :---: |
| ![Nginx Proxy Manager](photos/services/npm.png) | ![Pi-hole DNS](photos/services/pihole.png) |

| Tailscale Mesh | WireGuard Easy |
| :---: | :---: |
| ![Tailscale Mesh](photos/services/tailscale-x64.png) | ![WireGuard Easy](photos/services/wgeasy.png) |

| OPNsense Core Gateway | OPNsense Unbound DoT |
| :---: | :---: |
| ![OPNsense Core Gateway](photos/services/opnsense-core.png) | ![OPNsense Unbound DoT](photos/services/opnsense-unbound.png) |

| OPNsense FRR Dynamic Routing | Caddy Ingress mTLS |
| :---: | :---: |
| ![OPNsense FRR](photos/services/opnsense-frr.png) | ![Caddy mTLS](photos/services/caddy-mtls.png) |

---

### Storage & Backup
| Nextcloud Hub | Paperless-ngx Document OCR |
| :---: | :---: |
| ![Nextcloud Hub](photos/services/nextcloud.png) | ![Paperless-ngx](photos/services/paperless.png) |

| MinIO S3 Object Storage | Kopia Snapshot Backup |
| :---: | :---: |
| ![MinIO S3](photos/services/minio.png) | ![Kopia Backup](photos/services/kopia.png) |

| Syncthing File Sync | Proxmox Backup Server (PBS) |
| :---: | :---: |
| ![Syncthing](photos/services/syncthing.png) | ![Proxmox Backup Server](photos/services/proxmox-backup-server.png) |

---

### Automatizare & AI
| Ollama LLM Runtime | Open-WebUI AI Interface |
| :---: | :---: |
| ![Ollama LLM](photos/services/ollama.png) | ![Open-WebUI](photos/services/openwebui.png) |

| Faster-Whisper Voice Transcription | Flowise LLM Orchestrator |
| :---: | :---: |
| ![Faster-Whisper](photos/services/whisper.png) | ![Flowise Orchestrator](photos/services/flowise.png) |

| Home Assistant Automation Hub | RenovateBot GitOps Engine |
| :---: | :---: |
| ![Home Assistant](photos/services/homeassistant.png) | ![RenovateBot](photos/services/renovate.png) |

---

### Observabilitate & Monitorizare
| Grafana Enterprise Dashboard | Prometheus Metrics Engine |
| :---: | :---: |
| ![Grafana Enterprise](photos/services/grafana.png) | ![Prometheus Metrics](photos/services/prometheus.png) |

| Loki Distributed Log Aggregator | Uptime Kuma SLA Monitor |
| :---: | :---: |
| ![Loki Log Aggregator](photos/services/loki.png) | ![Uptime Kuma Monitor](photos/services/uptimekuma.png) |

| Gatus Status Healthchecker | Beszel Lightweight Metrics |
| :---: | :---: |
| ![Gatus Status](photos/services/gatus.png) | ![Beszel Metrics](photos/services/beszel.png) |

| Blackbox Network Exporter | Vector High-Throughput Aggregator |
| :---: | :---: |
| ![Blackbox Exporter](photos/services/blackbox.png) | ![Vector Aggregator](photos/services/vector.png) |

| Dozzle Real-Time Log Viewer |  |
| :---: | :---: |
| ![Dozzle Log Viewer](photos/services/dozzle.png) |  |

---

### Securitate & Cyber Lab
| OPNsense Suricata 8 NIDS/IPS | OPNsense CrowdSec LAPI Bouncer |
| :---: | :---: |
| ![Suricata IDS/IPS](photos/services/opnsense-suricata.png) | ![CrowdSec Bouncer](photos/services/opnsense-crowdsec.png) |

| Wazuh SIEM / XDR Manager | T-Pot Honeypot Multi-Sensor |
| :---: | :---: |
| ![Wazuh SIEM](photos/services/wazuh.png) | ![T-Pot Honeypots](photos/services/tpot-honeypot.png) |

| CyberChef Cryptographic Utility | DFIR Dynamic Malware Sandbox |
| :---: | :---: |
| ![CyberChef](photos/services/cyberchef.png) | ![DFIR Sandbox](photos/services/dfir-sandbox.png) |

| HashiCorp Vault Secrets Engine | Deception Canary Tokens & Decoys |
| :---: | :---: |
| ![HashiCorp Vault](photos/services/vault.png) | ![Canary Decoys](photos/services/canary-decoys.png) |

---

### Media & Utilitare
| Stirling-PDF Manipulation Suite | Kavita Digital Library |
| :---: | :---: |
| ![Stirling-PDF](photos/services/stirling.png) | ![Kavita Library](photos/services/kavita.png) |

| Audiobookshelf Streaming Server | TubeArchivist YouTube Archive |
| :---: | :---: |
| ![Audiobookshelf](photos/services/audiobookshelf.png) | ![TubeArchivist](photos/services/tubearchivist.png) |

| Transmission BitTorrent Client | Calibre-Web E-Book Manager |
| :---: | :---: |
| ![Transmission](photos/services/transmission.png) | ![Calibre-Web](photos/services/calibreweb.png) |

| RomM Retro Game Rom Manager | EmulatorJS Browser Arcade |
| :---: | :---: |
| ![RomM Game Manager](photos/services/romm.png) | ![EmulatorJS](photos/services/emulatorjs.png) |

| Code-Server VS Code Cloud IDE | Draw.io Architecture Designer |
| :---: | :---: |
| ![Code-Server](photos/services/codeserver.png) | ![Draw.io Designer](photos/services/drawio.png) |

| IT-Tools Network & Developer Toolkit | Actual Budget Local Accounting |
| :---: | :---: |
| ![IT-Tools Suite](photos/services/it-tools.png) | ![Actual Budget](photos/services/actualbudget.png) |

| Trillium Structured Knowledge Base | ChangeDetection Web Monitor |
| :---: | :---: |
| ![Trillium Knowledge Base](photos/services/trillium.png) | ![ChangeDetection](photos/services/changedetection.png) |

| MicroBin Encrypted Pastebin | Vikunja Task Management |
| :---: | :---: |
| ![MicroBin Pastebin](photos/services/microbin.png) | ![Vikunja Tasks](photos/services/vikunja.png) |

| Memos Lightweight Note Stream | Wallos Subscription Tracker |
| :---: | :---: |
| ![Memos Note Stream](photos/services/memos.png) | ![Wallos Subscriptions](photos/services/wallos.png) |

| Speedtest Tracker Continuous Bench | Homepage Dashboard |
| :---: | :---: |
| ![Speedtest Tracker](photos/services/speedtest.png) | ![Homepage Dashboard](photos/services/homepage.png) |

| Flame Application Launcher |  |
| :---: | :---: |
| ![Flame Launcher](photos/services/flame.png) |  |

---

### Sisteme de Operare Specializate & Telemetrie (Loki Telemetry & Runtime Logs)
| Windows Server 2025 (VM 201 · Loki Telemetry) | Red Hat Enterprise Linux 9.8 (VM 202 · Loki Telemetry) |
| :---: | :---: |
| ![Windows Server 2025 Telemetry](photos/services/vm-windows.png) | ![RHEL 9.8 Telemetry](photos/services/vm-rhel.png) |

| FreeBSD 15.1-RELEASE (VM 203 · Loki Telemetry) | OpenBSD 7.9 Bastion (VM 204 · Loki Telemetry) |
| :---: | :---: |
| ![FreeBSD 15.1 Telemetry](photos/services/vm-freebsd.png) | ![OpenBSD 7.9 Telemetry](photos/services/vm-openbsd.png) |

| Talos Linux 1.7 (VM 205 · Loki Telemetry) | Proxmox Datacenter Manager (CT 147 · Loki Telemetry) |
| :---: | :---: |
| ![Talos Linux Telemetry](photos/services/vm-talos.png) | ![Proxmox Datacenter Manager](photos/services/proxmox-datacenter-manager.png) |

| Proxmox Mail Gateway (CT 148 · Loki Telemetry) |  |
| :---: | :---: |
| ![Proxmox Mail Gateway](photos/services/proxmox-mail-gateway.png) |  |

---

## Despre Autor (About Me)

Proiect conceput, configurat si operat de **[@stefanutc1](https://github.com/stefanutc1)**.
* **Specializare**: Inginerie de Infrastructura, Virtualizare Hibrida (Proxmox VE x86_64 12GB DDR4-2133 si Apple Silicon ARM64), Securitate Retea & Zero-Trust (OPNsense, Suricata, CrowdSec, WireGuard), Smart Home (Home Assistant), DNS Filtering (Pi-hole), GitOps & IaC (Terraform, Ansible, CI/CD).
* **Scop**: Portofoliu tehnic ce demonstreaza bune practici in arhitectura de sisteme on-premise si hibride.
