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

### Aktive LXC-Container

| VMID | Hostname | Basis-OS | vCPU | Zugewiesener RAM | Speicherpool | Statische IP | Kategorie | Primärer Dienst |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **100** | `nginx` | Alpine 3.20 | 1 | 112 MB | `local-lvm:3G` | `192.168.1.3` | Ingress | Nginx Proxy Manager + CrowdSec Bouncer |
| **101** | `pihole` | Alpine 3.20 | 1 | 64 MB | `local-lvm:2G` | `192.168.1.4` | DNS | Interner DNS-Resolver & Werbeblocker |
| **102** | `tailscale` | Alpine 3.20 | 1 | 64 MB | `local-lvm:2G` | `192.168.1.5` | VPN | WireGuard Mesh Subnetz-Router |
| **103** | `immich` | Debian 12 | 4 | 896 MB | `local-lvm:32G` | `192.168.1.6` | Storage / KI | Fotoverwaltung & ML-Gesichtserkennung |
| **104** | `nextcloud` | Debian 12 | 2 | 512 MB | `local-lvm:16G` | `192.168.1.7` | Storage | Enterprise Cloud & WebDAV-Synchronisation |
| **105** | `crowdsec` | Alpine 3.20 | 1 | 96 MB | `local-lvm:2G` | `192.168.1.8` | Sicherheit | Threat-Intelligence & Entscheidungs-Engine |
| **106** | `homeassistant` | Debian 12 | 2 | 384 MB | `local-lvm:16G` | `192.168.1.9` | Automation | Smart Home Zentrale, Zigbee & ESP32 |
| **107** | `n8n` | Alpine 3.20 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.10` | Automation | Workflow-Orchestrierung & SOAR-Playbooks |
| **108** | `authentik` | Debian 12 | 2 | 512 MB | `local-lvm:8G` | `192.168.1.11` | Sicherheit | FIDO2 / Passkeys Identity Provider |
| **109** | `media-suite` | Debian 12 | 4 | 896 MB | `local-lvm:32G` | `192.168.1.12` | Medien | Jellyfin Medienserver mit GPU-Transcoding |
| **110** | `ollama` | Debian 13 | 4 | 2.048 MB | `local-lvm:16G` | `192.168.1.110` | Lokale KI | LLM GPU-Inferenz (Qwen2.5-Coder, Llama-3.2) |
| **118** | `tempo` | Alpine 3.20 | 2 | 256 MB | `local-lvm:8G` | `192.168.64.118` | Monitoring | Grafana Tempo Distributed Tracing Backend |

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
