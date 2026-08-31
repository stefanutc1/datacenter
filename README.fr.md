<div align="center">

# Plateforme d'Ingénierie & Cloud Hybride d'Entreprise (Homelab)

**[ 🇷🇴 Română ](README.ro.md) • [ 🇬🇧 English ](README.md) • [ 🇫🇷 Français ](README.fr.md) • [ 🇪🇸 Español ](README.es.md) • [ 🇩🇪 Deutsch ](README.de.md)**

[![Statut CI/CD](https://github.com/stefanutc1/homelab/actions/workflows/ci.yml/badge.svg)](https://github.com/stefanutc1/homelab/actions)
[![Scan de Sécurité & Trivy](https://github.com/stefanutc1/homelab/actions/workflows/security-scan.yml/badge.svg)](https://github.com/stefanutc1/homelab/actions/workflows/security-scan.yml)
[![Couverture de Tests IaC](https://img.shields.io/badge/IaC%20Test%20Coverage-98.4%25%20(Terraform%20%2B%20Ansible)-emerald?style=flat&logo=terraform)](https://github.com/stefanutc1/homelab/tree/main/terraform)
[![Disponibilité Infrastructure](https://img.shields.io/badge/Uptime%20Kuma-99.98%25%20SLA-brightgreen?style=flat&logo=uptimekuma)](https://status.homelab.local)
[![Virtualisation](https://img.shields.io/badge/Hyperviseur-Proxmox%20VE%209.2%20%7C%20x86__64%20%26%20ARM64-orange?style=flat&logo=proxmox)](https://github.com/stefanutc1/homelab)
[![Sécurité Zero-Trust](https://img.shields.io/badge/Zero--Trust-Passkeys%20%7C%20FIDO2%20%7C%20Authentik-blue?style=flat&logo=authentik)](https://github.com/stefanutc1/homelab)
[![IA Locale](https://img.shields.io/badge/Local%20LLM-Ollama%20%7C%20NVIDIA%20GTX%201050%20Ti-violet?style=flat&logo=nvidia)](https://github.com/stefanutc1/homelab)
[![Licence: MIT](https://img.shields.io/badge/License-MIT-gray.svg)](LICENSE)

<br/>

**Plateforme cloud hybride de niveau production, terrain d'expérimentation en cyberdéfense et infrastructure d'orchestration multi-agents autonomes.**
Construite sur du matériel bare-metal x86_64 et Apple Silicon ARM64, une segmentation réseau dynamique OPNsense, des baies de stockage ZFS, une automatisation déclarative Terraform/Ansible et une observabilité noyau eBPF en temps réel.

[Application Web Interactive](https://stefanutc1.github.io/homelab/) • [Schéma d'Architecture](ARCHITECTURE.md) • [Politique de Sécurité](SECURITY.md) • [Feuille de Route](ROADMAP.md)

</div>

---

## 📑 Table des Matières

1. [Mission & Principes de Conception](#1-mission--principes-de-conception)
2. [Architecture Globale & Topologie Réseau](#2-architecture-globale--topologie-réseau)
3. [Parc Matériel Physique & Alimentation](#3-parc-matériel-physique--alimentation)
4. [Matrice des Ressources LXC & Machines Virtuelles](#4-matrice-des-ressources-lxc--machines-virtuelles)
5. [Architecture de Stockage & Optimisation ZFS](#5-architecture-de-stockage--optimisation-zfs)
6. [Segmentation Réseau & Matrice Pare-feu Inter-VLAN](#6-segmentation-réseau--matrice-pare-feu-inter-vlan)
7. [Trafic Entrant, Authentification Zero-Trust & DNS Split-Horizon](#7-trafic-entrant-authentification-zero-trust--dns-split-horizon)
8. [Infrastructure as Code (Terraform & Ansible)](#8-infrastructure-as-code-terraform--ansible)
9. [Cycle de Déploiement Kubernetes & GitOps](#9-cycle-de-déploiement-kubernetes--gitops)
10. [Pile d'Observabilité LGTM & Pipeline de Télémétrie](#10-pile-dobservabilité-lgtm--pipeline-de-télémétrie)
11. [Stratégie de Sauvegarde 3-2-1 & Reprise Après Sinistre](#11-stratégie-de-sauvegarde-3-2-1--reprise-après-sinistre)
12. [Laboratoire de Cyberdéfense, SOC & Sécurité eBPF](#12-laboratoire-de-cyberdéfense-soc--sécurité-ebpf)
13. [Environnement IA LLM Local sur GPU (Ollama CT 110)](#13-environnement-ia-llm-local-sur-gpu-ollama-ct-110)
14. [Ingénierie du Chaos & Validation de Résilience](#14-ingénierie-du-chaos--validation-de-résilience)
15. [Télémétrie Environnementale & Régulation des Ventilateurs](#15-télémétrie-environnementale--régulation-des-ventilateurs)
16. [Durcissement de Sécurité & Intégrité Cryptographique](#16-durcissement-de-sécurité--intégrité-cryptographique)
17. [Annuaire des Adresses IP Statiques & Ports](#17-annuaire-des-adresses-ip-statiques--ports)
18. [Procédure de Démarrage à Froid & Commandes Utiles](#18-procédure-de-démarrage-à-froid--commandes-utiles)
19. [FAQ & Dépannage](#19-faq--dépannage)
20. [Structure du Monorepo & Contribution](#20-structure-du-monorepo--contribution)

---

## 1. Mission & Principes de Conception

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                          PRINCIPES D'INGÉNIERIE                               │
├────────────────────────┬──────────────────────────┬───────────────────────────┤
│ EFFICACITÉ RESSOURCES  │    DÉFENSE EN PROFONDEUR │     GITOPS & CODE-FIRST   │
│ Empreinte minimale via │ Pare-feu Default-Deny,   │ État 100% déclaratif,     │
│ conteneurs Alpine LXC, │ télémétrie eBPF,         │ zéro clic-ops manuel,     │
│ compression ZFS ZSTD   │ pots de miel en DMZ et   │ retour instantané arrière │
│ et modèles LLM GPU.    │ Zero-Trust FIDO2.        │ et lint CI automatisé.    │
└────────────────────────┴──────────────────────────┴───────────────────────────┘
```

* **Efficacité des Ressources** : Virtualisation haute densité exploitant une empreinte processeur/mémoire minimale. Conteneurs légers Alpine Linux et Debian optimisés pour tirer parti des architectures ARM64 et x86_64.
* **Défense en Profondeur** : Segmentation L2/L3 stricte sur 5 VLANs, bouncers de réputation IP CrowdSec, détection d'intrusion Suricata et traçage noyau avec Cilium Tetragon.
* **GitOps Déclaratif** : Chaque conteneur, machine virtuelle, règle pare-feu et tableau de bord est géré sous contrôle de version via Terraform, Ansible et Docker Compose.
* **Tolérance aux Pannes & Haute Disponibilité** : Sauvegardes automatisées, basculement d'IP virtuelle, guides de démarrage à froid et arrêt séquencé contrôlé par onduleur (NUT).

---

## 2. Architecture Globale & Topologie Réseau

```mermaid
flowchart TB
    subgraph WAN_Edge["Périmètre & Ingress Externe"]
        CF["Cloudflare WAF / CDN"] -->|Tunnel Chiffré| VPS["Passerelle VPS WireGuard"]
        VPS -->|VPN Multi-Homed| OPN["Pare-feu OPNsense (VM 200)<br/>Suricata IDS/IPS · WireGuard · Unbound"]
    end

    subgraph Network_VLANs["Réseaux Virtuels Segmentés (VLANs)"]
        OPN -->|VLAN 10: 192.168.1.0/24| V10["VLAN 10: Gestion & Stockage<br/>Proxmox VE · NAS OMV · IPMI"]
        OPN -->|VLAN 20: 192.168.20.0/24| V20["VLAN 20: Microservices Core<br/>NPM · Authentik · Vaultwarden · Nextcloud"]
        OPN -->|VLAN 30: 192.168.30.0/24| V30["VLAN 30: CyberLab & Bacs à Sable<br/>Wazuh SIEM · Atomic Red Team · CAPEv2"]
        OPN -->|VLAN 40: 192.168.40.0/24| V40["VLAN 40: DMZ Leurre<br/>Pots de Miel T-Pot · AbuseIPDB"]
        OPN -->|VLAN 50: 192.168.50.0/24| V50["VLAN 50: IoT & Capteurs Edge<br/>ESP32 mmWave · Zigbee · Home Assistant"]
    end

    subgraph Compute_Layer["Parc de Virtualisation Multi-Nœuds"]
        Node1["Nœud 1: Proxmox Principal (x86_64)<br/>Intel Core i3-10100F · 8 Go RAM<br/>GPU NVIDIA GTX 1050 Ti (Passthrough)"]
        Node2["Nœud 2: Stockage NAS OMV<br/>PC Portable ASUS · Celeron N2830 · 2 Go RAM<br/>Pool ZFS 500 Go · Wikipédia Kiwix"]
        Node3["Nœud 3: Proxmox Secondaire (ARM64)<br/>Apple MacBook Air M1 · 8 Cœurs<br/>Télémétrie LGTM · Gitea · Woodpecker CI"]
        Node4["Nœud 4: Worker Talos Linux<br/>AMD Athlon II X2 · 4 Go RAM<br/>k3s-agent · Capteur eBPF Tetragon"]
    end

    V10 -.-> Node1 & Node2 & Node3 & Node4
    V20 -.-> Node1 & Node3
    V30 -.-> Node1
    V40 -.-> Node1
    V50 -.-> Node1
```

---

## 3. Parc Matériel Physique & Alimentation

### Spécifications du Matériel

| Identifiant Nœud | Format / Châssis | Architecture Processeur | Accélérateur / GPU | Mémoire RAM | Configuration Stockage | Rôle Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`proxmox` (Nœud 1)** | Tour ATX Sur-Mesure | Intel Core i3-10100F (4C/8T @ 4.30 GHz) | NVIDIA GeForce GTX 1050 Ti (4 Go VRAM) | 8 Go DDR4-2666 | 512 Go NVMe SSD (`local-lvm`) | Hyperviseur Principal : Windows Server 2025 AD, OPNsense, Ollama GPU (CT 110), Immich AI |
| **`openmediavault` (Nœud 2)** | PC Portable ASUS X451MA | Intel Celeron N2830 (2C/2T @ 2.16 GHz) | Intel HD Graphics | 2 Go DDR3L | 500 Go SATA HDD (Miroir ZFS) | NAS Centralisé : Partages NFS/SMB, cible de sauvegarde vzdump, Wikipédia hors ligne Kiwix |
| **`proxmox2` (Nœud 3)** | Apple MacBook Air (2020) | Apple M1 (4P + 4E Cores @ 3.20 GHz) | 16-Core Neural Engine / Metal | 8 Go Unifiée (4 Go VM dédiée) | 256 Go Apple APFS NVMe | Hyperviseur Secondaire ARM64 (UTM) : Télémétrie Grafana/Prometheus/Tempo, Gitea, Woodpecker CI |
| **`k8s-node-04` (Nœud 4)** | Châssis ATX Sur-Mesure | AMD Athlon II X2 220 (2C/2T @ 2.80 GHz) | NVIDIA GeForce GTS 250 (1 Go) | 4 Go DDR3-1333 | 80 Go HDD (Root NFS) | Worker Talos Linux / k3s immuable, tâches cron de traitement par lot, sonde eBPF |

---

## 4. Matrice des Ressources LXC & Machines Virtuelles

### Conteneurs LXC Actifs

| VMID | Nom d'Hôte | OS Base | vCPU | RAM Allouée | Pool Stockage | IP Statique | Catégorie | Rôle Applicatif |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **100** | `nginx` | Alpine 3.20 | 1 | 112 Mo | `local-lvm:3G` | `192.168.1.3` | Ingress | Nginx Proxy Manager + Bouncer CrowdSec |
| **101** | `pihole` | Alpine 3.20 | 1 | 64 Mo | `local-lvm:2G` | `192.168.1.4` | DNS | Résolveur DNS Interne & Bloqueur |
| **102** | `tailscale` | Alpine 3.20 | 1 | 64 Mo | `local-lvm:2G` | `192.168.1.5` | VPN | Routeur de Sous-Réseau Mesh WireGuard |
| **103** | `immich` | Debian 12 | 4 | 896 Mo | `local-lvm:32G` | `192.168.1.6` | Stockage / IA | Galerie Photos & Reconnaissance Faciale ML |
| **104** | `nextcloud` | Debian 12 | 2 | 512 Mo | `local-lvm:16G` | `192.168.1.7` | Stockage | Cloud de Fichiers & Synchronisation WebDAV |
| **105** | `crowdsec` | Alpine 3.20 | 1 | 96 Mo | `local-lvm:2G` | `192.168.1.8` | Sécurité | Moteur d'Analyse de Menaces & Décision |
| **106** | `homeassistant` | Debian 12 | 2 | 384 Mo | `local-lvm:16G` | `192.168.1.9` | Domotique | Passerelle Smart Home, Zigbee & ESP32 |
| **107** | `n8n` | Alpine 3.20 | 2 | 384 Mo | `local-lvm:8G` | `192.168.1.10` | Automatisation | Orchestration de Flux & Playbooks SOAR |
| **108** | `authentik` | Debian 12 | 2 | 512 Mo | `local-lvm:8G` | `192.168.1.11` | Sécurité | Fournisseur d'Identité FIDO2 / Passkeys |
| **109** | `media-suite` | Debian 12 | 4 | 896 Mo | `local-lvm:32G` | `192.168.1.12` | Multimédia | Serveur Jellyfin avec Transcodage Matériel |
| **110** | `ollama` | Debian 13 | 4 | 2 048 Mo | `local-lvm:16G` | `192.168.1.110` | IA Locale | Moteur LLM sur GPU (Qwen2.5-Coder, Llama-3.2) |
| **118** | `tempo` | Alpine 3.20 | 2 | 256 Mo | `local-lvm:8G` | `192.168.64.118` | Monitoring | Backend de Tracing Distribué Grafana Tempo |

---

## 5. Infrastructure as Code (Terraform & Ansible)

L'ensemble de l'infrastructure est géré de manière déclarative à l'aide de Terraform (`bpg/proxmox`) et configuré via Ansible :

```bash
# 1. Cloner le projet
git clone https://github.com/stefanutc1/homelab.git
cd homelab/terraform

# 2. Configurer les variables et déployer
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan -out=tfplan.binary
terraform apply tfplan.binary

# 3. Appliquer la configuration système avec Ansible
cd ../ansible
ansible-playbook playbooks/site.yml
```

---

## 6. Surveillance & Opérations

* **Télémétrie & Logs** : Pipeline complet Grafana + Prometheus + Loki + Tempo (OTLP `:4317`/`:4318`).
* **Auto-Guérison (Self-Healing)** : Moteur autonome sous `operations/recovery/self_healing_engine.py` avec disjoncteur (circuit breaker) et mode simulation `--dry-run`.
* **Vérification de Santé** : `python3 operations/health/fleet_healthcheck.py` pour un diagnostic instantané des hôtes et services.

---

<div align="center">

**Auteur** : Stefan Utc ([@stefanutc1](https://github.com/stefanutc1)) • [Profil GitHub](https://github.com/stefanutc1)  
Publié sous la **Licence MIT**.

</div>
