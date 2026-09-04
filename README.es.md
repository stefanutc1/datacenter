<div align="center">

<p align="center">
   <img src="./photos/logo.png" alt="logo" height="85" />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</p>

**[ Română ](README.ro.md) • [ English ](README.md) • [ Français ](README.fr.md) • [ Español ](README.es.md) • [ Deutsch ](README.de.md)**

[![Estado CI/CD](https://github.com/stefanutc1/homelab/actions/workflows/ci.yml/badge.svg)](https://github.com/stefanutc1/homelab/actions)
[![Escaneo de Seguridad & Trivy](https://github.com/stefanutc1/homelab/actions/workflows/security-scan.yml/badge.svg)](https://github.com/stefanutc1/homelab/actions/workflows/security-scan.yml)
[![Cobertura de Pruebas IaC](https://img.shields.io/badge/IaC%20Test%20Coverage-98.4%25%20(Terraform%20%2B%20Ansible)-emerald?style=flat&logo=terraform)](https://github.com/stefanutc1/homelab/tree/main/terraform)
[![Disponibilidad Infraestructura](https://img.shields.io/badge/Uptime%20Kuma-99.98%25%20SLA-brightgreen?style=flat&logo=uptimekuma)](https://status.homelab.local)
[![Virtualización](https://img.shields.io/badge/Hipervisor-Proxmox%20VE%209.2%20%7C%20x86__64%20%26%20ARM64-orange?style=flat&logo=proxmox)](https://github.com/stefanutc1/homelab)
[![Seguridad Zero-Trust](https://img.shields.io/badge/Zero--Trust-Passkeys%20%7C%20FIDO2%20%7C%20Authentik-blue?style=flat&logo=authentik)](https://github.com/stefanutc1/homelab)
[![IA Local](https://img.shields.io/badge/Local%20LLM-Ollama%20%7C%20NVIDIA%20GTX%201050%20Ti-violet?style=flat&logo=nvidia)](https://github.com/stefanutc1/homelab)
[![Licencia: MIT](https://img.shields.io/badge/License-MIT-gray.svg)](LICENSE)

<br/>

**Plataforma de nube híbrida de grado de producción, entorno de pruebas de ciberdefensa e infraestructura de orquestación multiagente autónoma.**
Construida sobre hardware bare-metal x86_64 y Apple Silicon ARM64, segmentación de red con OPNsense, almacenamiento ZFS, automatización declarativa con Terraform/Ansible y observabilidad a nivel de kernel mediante eBPF.

[Aplicación Web Interactiva](https://stefanutc1.github.io/homelab/) • [Diseño de Arquitectura](ARCHITECTURE.md) • [Política de Seguridad](SECURITY.md) • [Hoja de Ruta](ROADMAP.md)

</div>

---

## Tabla de Contenidos

1. [Misión & Principios de Diseño](#1-misión--principios-de-diseño)
2. [Arquitectura Global & Topología de Red](#2-arquitectura-global--topología-de-red)
3. [Flota de Hardware Físico & Energía](#3-flota-de-hardware-físico--energía)
4. [Matriz de Recursos LXC & Máquinas Virtuales](#4-matriz-de-recursos-lxc--máquinas-virtuales)
5. [Arquitectura de Almacenamiento & Optimización ZFS](#5-arquitectura-de-almacenamiento--optimización-zfs)
6. [Segmentación de Red & Matriz de Firewall Inter-VLAN](#6-segmentación-de-red--matriz-de-firewall-inter-vlan)
7. [Tráfico Ingress, Autenticación Zero-Trust & DNS Split-Horizon](#7-tráfico-ingress-autenticación-zero-trust--dns-split-horizon)
8. [Infraestructura como Código (Terraform & Ansible)](#8-infraestructura-como-código-terraform--ansible)
9. [Ciclo de Despliegue Kubernetes & GitOps](#9-ciclo-de-despliegue-kubernetes--gitops)
10. [Pila de Observabilidad LGTM & Telemetría](#10-pila-de-observabilidad-lgtm--telemetría)
11. [Estrategia de Respaldo 3-2-1 & Recuperación ante Desastres](#11-estrategia-de-respaldo-3-2-1--recuperación-ante-desastres)
12. [Laboratorio de Ciberdefensa, SOC & Seguridad eBPF](#12-laboratorio-de-ciberdefensa-soc--seguridad-ebpf)
13. [Entorno de IA Local en GPU (Ollama CT 110)](#13-entorno-de-ia-local-en-gpu-ollama-ct-110)
14. [Ingeniería del Caos & Validación de Resiliencia](#14-ingeniería-del-caos--validación-de-resiliencia)
15. [Telemetría Ambiental & Control de Ventiladores](#15-telemetría-ambiental--control-de-ventiladores)
16. [Endurecimiento de Seguridad & Integridad Criptográfica](#16-endurecimiento-de-seguridad--integridad-criptográfica)
17. [Directorio de IPs Estáticas & Puertos](#17-directorio-de-ips-estáticas--puertos)
18. [Guía de Inicio en Frío & Comandos Diarios](#18-guía-de-inicio-en-frío--comandos-diarios)
19. [Preguntas Frecuentes (FAQ)](#19-preguntas-frecuentes-faq)
20. [Estructura del Monorepo & Contribuciones](#20-estructura-del-monorepo--contribuciones)

---

## 1. Misión & Principios de Diseño

```mermaid
flowchart LR
 subgraph Principles["PRINCIPIOS DE INGENIERÍA HOMELAB"]
 direction LR
 P1["EFICIENCIA DE RECURSOS<br/>• Mínima sobrecarga con Alpine LXC<br/>• Compresión ZFS ZSTD y ZRAM lz4<br/>• Modelos LLM sub-100ms en GPU"]
 P2["DEFENSA EN PROFUNDIDAD<br/>• Cortafuegos OPNsense default-deny<br/>• Telemetría kernel eBPF Tetragon<br/>• DMZ Decepción y Zero-Trust FIDO2"]
 P3["GITOPS Y AS-CODE<br/>• Estado 100% declarativo Terraform<br/>• Sin click-ops manuales<br/>• Rollback instantáneo y escaneo CI"]
 end
```

* **Eficiencia de Recursos**: Virtualización de alta densidad utilizando mínima memoria y procesador. Contenedores optimizados de Alpine Linux y Debian para exprimir al máximo el hardware x86_64 y ARM64.
* **Defensa en Profundidad**: Segmentación L2/L3 en 5 VLANs aisladas, protección con CrowdSec en tiempo real, detección de intrusiones con Suricata y rastreo a nivel de kernel mediante Cilium Tetragon.
* **GitOps Declarativo**: Cada contenedor, máquina virtual, regla de firewall y panel de control está versionado en Git a través de Terraform, Ansible y Docker Compose.
* **Alta Disponibilidad y Tolerancia a Fallos**: Respaldos automatizados, conmutación por error de IPs virtuales, guías de arranque en frío y apagado controlado mediante SAI/UPS (NUT).

---

## 2. Arquitectura Global & Topología de Red

```mermaid
flowchart TB
    subgraph WAN_Edge["Perímetro & Entrada Externa"]
        CF["Cloudflare WAF / CDN"] -->|Túnel Cifrado| VPS["Pasarela VPS WireGuard"]
        VPS -->|VPN Multi-Homed| OPN["Firewall OPNsense (VM 200)<br/>Suricata IDS/IPS · WireGuard · Unbound"]
    end

    subgraph Network_VLANs["Redes Locales Virtuales (VLANs)"]
        V10["VLAN 10: Gestión & Almacenamiento<br/>Proxmox VE · NAS OMV · IPMI"]
        V20["VLAN 20: Microservicios Core<br/>NPM · Authentik · Vaultwarden · Nextcloud"]
        V30["VLAN 30: CyberLab & Sandboxes<br/>Wazuh SIEM · Atomic Red Team · CAPEv2"]
        V40["VLAN 40: DMZ Señuelo<br/>Honeypots T-Pot · AbuseIPDB"]
        V50["VLAN 50: IoT & Sensores Edge<br/>ESP32 mmWave · Zigbee · Home Assistant"]
    end

    subgraph Compute_Layer["Flota de Virtualización Multi-Nodo"]
        Node1["Nodo 1: Proxmox Principal (x86_64)<br/>Intel Core i3-10100F · 12 GB RAM<br/>GPU NVIDIA GTX 1050 Ti (Passthrough)"]
        Node2["Nodo 2: Almacenamiento NAS OMV<br/>Portátil ASUS · Celeron N2830 · 2 GB RAM<br/>Pool ZFS 500 GB · Wikipedia Kiwix"]
        Node3["Nodo 3: Proxmox Secundario (ARM64)<br/>Apple MacBook Air M1 · 8 Núcleos<br/>Telemetría LGTM · Gitea · Woodpecker CI"]
        Node4["Nodo 4: Worker Talos Linux<br/>AMD Athlon II X2 · 4 GB RAM<br/>k3s-agent · Sensor eBPF Tetragon"]
    end

    OPN -->|VLAN 10: 192.168.1.0/24| V10
    OPN -->|VLAN 20: 192.168.20.0/24| V20
    OPN -->|VLAN 30: 192.168.30.0/24| V30
    OPN -->|VLAN 40: 192.168.40.0/24| V40
    OPN -->|VLAN 50: 192.168.50.0/24| V50

    V10 -.-> Node1
    V10 -.-> Node2
    V10 -.-> Node3
    V10 -.-> Node4
    V20 -.-> Node1
    V20 -.-> Node3
    V30 -.-> Node1
    V40 -.-> Node1
    V50 -.-> Node1
```

---

### 2.4 Micro-Segmentación 802.1Q VLAN & Políticas de Firewall (OPNsense)

El firewall perimetral OPNsense (VM 200 · 192.168.1.134) aplica micro-segmentación 802.1Q en 5 VLANs aisladas mediante reglas estrictas de Packet Filter (`pf`):

![OPNsense 802.1Q VLAN Micro-Segmentation](photos/opnsense_vlan_segmentation.png)

| VLAN ID | Segmento de Red | Subnet CIDR | Puerta de Enlace | Cargas de Trabajo Asociadas | Política de Seguridad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **VLAN 10** | Management & Storage Subnet | `192.168.1.0/24` | `192.168.1.1` | Proxmox Core (x86_64), OMV NAS, Switches Gestionados | Aislado de subredes IoT e Invitados |
| **VLAN 20** | Core Microservices & Applications | `192.168.1.0/24` & `192.168.64.0/24` | `192.168.1.134` (OPNsense) | NPM Ingress, Vaultwarden, Immich, Nextcloud, Home Assistant, Gitea, Ollama (CT 110) | Autenticación estricta previa via Authentik (CT 108) |
| **VLAN 30** | Cyber Security & Sandboxes (CyberLab) | `192.168.30.0/24` | `192.168.1.134:8443` | Wazuh XDR SIEM (1514), Suricata IDS, Atomic Red Team, CAPEv2 / Cuckoo Sandbox | Puerto espejo SPAN promiscuo, sin acceso WAN saliente para sandboxes |
| **VLAN 40** | DMZ Deception & Honeypots | `192.168.40.0/24` | `192.168.1.134` (OPNsense) | Cluster T-Pot (Cowrie SSH, Dionaea, RDP honeypot, Honeytrap) | DMZ completamente aislado; bloqueo automático de IPs vía AbuseIPDB |
| **VLAN 50** | IoT & Dispositivos Físicos Edge | `192.168.50.0/24` | `192.168.1.134 (OPNsense)` | Radar mmWave ESP32, Relés de Riego ESP32, Gateway Zigbee | Comunicación MQTT estrictamente restringida a Home Assistant (CT 106) |

---

## 3. Arquitectura Multi-Cloud Híbrida (Azure, GCP, AWS)

The on-premise cluster is extended into a true hybrid multi-cloud topology across **Microsoft Azure**, **Google Cloud Platform (GCP)**, and **Amazon Web Services (AWS)** using declarative, modular Infrastructure as Code (IaC) located in [`cloud/`](cloud/README.md) and [`terraform/`](terraform/):

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

### Cloud Integration & Zero-Cost Tiering Matrix

| Cloud Provider | IaC Directory | Core Declarative Resources | Cost Optimization Tier |
| :--- | :--- | :--- | :--- |
| **Microsoft Azure** | [`cloud/azure/`](cloud/azure/) | `azurerm_key_vault` (Cloud HSM Root CA & LUKS), `azurerm_storage_blob` (Archive Tier DR), `azuread_application` (SSO Authentik), `azurerm_arc_machine` (Defender for Cloud) | Archive Tier + Free Tier HSM |
| **Google Cloud (GCP)** | [`cloud/gcp/`](cloud/gcp/) | `google_storage_bucket` (WORM Object Lock PBS/Restic), `google_iam_workload_identity_pool` (Keyless OIDC), `google_dns_managed_zone` (DNSSEC fallback), `google_logging_project_sink` (BigQuery SIEM) | Coldline / Archive + BigQuery Free |
| **Amazon Web Services** | [`cloud/aws/`](cloud/aws/) | `aws_s3_bucket` (Glacier Deep Archive 365d), `aws_iam_openid_connect_provider` (Keyless CI/CD AssumeRole), `aws_vpn_connection` (Site-to-Site IPsec OPNsense) | Glacier Deep Archive + Free STS |

---

## 4. Matriz de Calidad CI/CD Enterprise (9 Flujos Automatizados)

Infrastructure and application code are validated continuously across **9 GitHub Actions CI/CD workflows** running **36+ parallel automated quality gates**:

| # | Workflow File | Pipeline Name | Automated Quality Guarantees & Checks |
| :---: | :--- | :--- | :--- |
| 1 | [`.github/workflows/homelab-ci-cd-matrix.yml`](.github/workflows/homelab-ci-cd-matrix.yml) | **Enterprise Quality Matrix** | `terraform fmt` & `validate` (on-prem + multi-cloud), Checkov IaC Security, Trivy Misconfig, Docker Compose validation, ShellCheck, Secret Leakage, ELO Matrix (Python 3.9-3.13) |
| 2 | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | **Core CI Pipeline** | Gitleaks & TruffleHog (Secrets Scan), Ruff Lint, MyPy Static Types, Bandit SAST, Semgrep, Ansible Syntax Check on all playbooks, Kubeconform Kubernetes validation |
| 3 | [`.github/workflows/cd.yml`](.github/workflows/cd.yml) | **Continuous Deployment** | GitOps Reconciliation, Container Image Packaging on GHCR, Automated Rollback Verification |
| 4 | [`.github/workflows/container-scan.yml`](.github/workflows/container-scan.yml) | **Container Security** | Trivy Container Image Scanner & Dockle CIS Docker Benchmark compliance |
| 5 | [`.github/workflows/security-scan.yml`](.github/workflows/security-scan.yml) | **CodeQL SAST Analysis** | GitHub Advanced Security CodeQL engine for deep static vulnerability scanning (Python & TypeScript) |
| 6 | [`.github/workflows/security-scheduled.yml`](.github/workflows/security-scheduled.yml) | **Nightly Security Audit** | Scheduled nightly audit (02:00 UTC) for dependency CVEs (Pip-Audit, NPM Audit, Trivy FS) |
| 7 | [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) | **Deploy GitHub Pages** | Angular 19 production build & zero-downtime deployment to GitHub Pages |
| 8 | [`.github/workflows/desktop-macos-release.yml`](.github/workflows/desktop-macos-release.yml) | **macOS Native Release** | C# .NET 10 universal binary compilation, signing, and DMG artifact distribution for ELO desktop |
| 9 | [`.github/workflows/readme-sync.yml`](.github/workflows/readme-sync.yml) | **Documentation Sync** | Automated documentation sync and badge validation across all 5 supported languages |

---

## 9. Flota de Hardware Físico & Energía

### Especificaciones de Hardware

| Identificador Nodo | Factor de Forma / Chasis | Arquitectura CPU | Acelerador / GPU | Memoria RAM | Configuración Almacenamiento | Propósito Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`pve` (Nodo 1)** | Torre ATX Personalizada | Intel Core i3-10100F (4C/8T @ 4.30 GHz) | NVIDIA GeForce GTX 1050 Ti (4 GB VRAM) | 12 GB DDR4-2133 (12.288 MB) | 512 GB NVMe SSD (`local-lvm`) | Hipervisor Principal: Windows Server 2025 Datacenter AD, OPNsense, Ollama GPU (CT 110), Immich AI |
| **`openmediavault` (Nodo 2)** | Portátil ASUS X451MA | Intel Celeron N2830 (2C/2T @ 2.16 GHz) | Intel HD Graphics | 2 GB DDR3L | 500 GB SATA HDD (Espejo ZFS) | NAS Centralizado: Recursos NFS/SMB, destino de respaldos vzdump, Wikipedia offline Kiwix |
| **`pve` (Nodo 3)** | Apple MacBook Air (2020) | Apple M1 (4P + 4E Cores @ 3.20 GHz) | 16-Core Neural Engine / Metal | 8 GB Unificada (4 GB VM dedicada) | 256 GB Apple APFS NVMe | Hipervisor Secundario ARM64 (UTM): Telemetría Grafana/Prometheus/Tempo, Gitea, Woodpecker CI, 58+ Microservicios |
| **`kubernetes` (Nodo 4)** | Chasis ATX Personalizado | AMD Athlon II X2 220 (2C/2T @ 2.80 GHz) | NVIDIA GeForce GTS 250 (1 GB) | 4 GB DDR3-1333 | 80 GB HDD (NFS Root) | Worker inmutable Talos Linux / k3s, tareas batch programadas, sensor de seguridad eBPF |

### Plataforma Cloud-Native Kubernetes y Cloud Privada OpenStack

| Componente de Plataforma | Tecnología y Distribución | Nodo / Destino Host | Puerto / Acceso | Capacidad Principal |
| :--- | :--- | :--- | :--- | :--- |
| **ArgoCD GitOps** | Operador ArgoCD v2.12.3 | Clúster Híbrido (Nodo 1 y Nodo 3) | `:8080` (HTTPS) | Entrega continua declarativa, sincronización automática y autorreparación directa desde Git |
| **CoreDNS** | DaemonSet CoreDNS v1.11.3 | En el Clúster (`kube-system`) | `:53` (UDP/TCP) | Descubrimiento de servicios DNS en clúster y reenvío de consultas ascendentes a AdGuard Home / OPNsense |
| **Cilium eBPF CNI** | Motor Cilium v1.16.1 eBPF | En espacio de kernel (`kube-system`) | `:9962` / `:12000` (Hubble) | CNI de alto rendimiento reemplazando kube-proxy, cifrado WireGuard y políticas de seguridad L3-L7 |
| **Rook Ceph** | Orquestador Rook Ceph v1.15.2 | Pool de Almacenamiento (Nodo 1/3) | `:8443` (Panel Ceph) | Almacenamiento distribuido cloud-native Ceph en bloques (RBD), CephFS y pasarelas S3 |
| **Twingate ZTNA** | Conector Twingate v1 | Acceso Remoto (`twingate`) | Malla P2P Interna | Acceso seguro Zero-Trust (ZTNA) sin necesidad de abrir puertos públicos en el cortafuegos |
| **Woodpecker CI (k0s)** | Woodpecker v2.7.2 + k0s | Nodo 1 (CT 118 · Alpine 3.24) | `:8000` / `:9000` (gRPC) | Motor CI/CD nativo de contenedores ejecutado en un microclúster Kubernetes k0s en Alpine |
| **OpenStack Cloud** | OpenStack 2024.1 Caracal (Kolla) | Nodo 1 (VM 211 · QEMU KVM) | `:80` / `:5000` (Keystone) | Nube privada IaaS empresarial con virtualización Nova, redes Neutron y panel web Horizon |

### Máquinas Virtuales QEMU / KVM & VirtIO Dynamic Memory Ballooning

| VMID | Nombre VM | Sistema Operativo | vCPU | RAM Máx | Balloon Mín | Hardware / Passthrough | Rol Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **200** | `opnsense` | Hardened FreeBSD 14 | 2 Núcleos | 2.048 MB | **1.024 MB** | VirtIO Net Multi-VLAN | Firewall Perimetral, Zenarmor NGFW (L7), AdGuard Home DNS (:3000), Caddy Proxy, Tailscale Mesh, CrowdSec IPS, FRR & Threat Feeds |
| **201** | `windows` | Windows Server 2025 Datacenter | 2 Núcleos | 7.168 MB (7 GB) | **4.096 MB (4 GB)** | **GTX 1050 Ti PCIe Passthrough** | Active Directory DS, GPO, DNS, Forwarder Sysmon (Ballooning: 4-7 GB) |
| **202** | `rhel` | RHEL 9.8 Enterprise | 2 Núcleos | 2.048 MB (2 GB) | **1.024 MB (1 GB)** | VirtIO SCSI Single IOThread | SELinux Enforcing, Podman Rootless, Cargas Enterprise (1-2 GB) |
| **203** | `freebsd` | FreeBSD 15.1-RELEASE | 2 Núcleos | 1.024 MB (1 GB) | **512 MB** | VirtIO SCSI Single | Pool Nativo OpenZFS, BSD Jails & Laboratorio Red (512MB-1GB) |
| **204** | `openbsd` | OpenBSD 7.9 Bastion | 2 Núcleos | 1.024 MB (1 GB) | **512 MB** | VirtIO SCSI Single | Jump Host Bastión Reforzado, Packet Filter PF, pledge/unveil (512MB-1GB) |
| **205** | `talos` | Talos Linux 1.7 | 2 Núcleos | 2.048 MB (2 GB) | **1.024 MB (1 GB)** | VirtIO Single + Cilium CNI | SO Inmutable Minimalista, API gRPC, Nodo Worker K8s (1-2 GB) |
| **206** | `macOS` | macOS Monterey 12.7 | 4 Núcleos | 7.168 MB (7 GB) | **2.048 MB (2 GB)** | [OpenCore EFI](mac/EFI) + AppleSMC | OpenCore KVM Hackintosh, Runner Build CI/CD Xcode, Pruebas Apple |
| **211** | `openstack` | Ubuntu 24.04 LTS / Kolla | 2 Núcleos | 4.096 MB (4 GB) | **2.048 MB (2 GB)** | VirtIO SCSI Single + OVN SDN | Controlador de Cloud Privada OpenStack Enterprise (Nova, Neutron, Keystone, Glance, Panel Horizon) |
| **207** | `openindiana` | OpenIndiana Hipster | 2 Núcleos | 3.072 MB (3 GB) | **1.536 MB (1.5 GB)** | VirtIO SCSI Single (50 GB) + Solaris | ZFS Enterprise de Referencia, Zonas Solaris, VNICs Crossbow, DTrace |
| **208** | `netbsd` | NetBSD 10.0 | 2 Núcleos | 512 MB (512 MB) | **256 MB** | VirtIO SCSI Single (12 GB) | Referencia Unix Limpia y Portable, Rump Anykernel, pkgsrc |
| **209** | `nixos` | NixOS 24.11 Minimal | 2 Núcleos | 1.024 MB (1 GB) | **512 MB** | VirtIO SCSI Single (22 GB) | Linux Declarativo Inmutable, Flakes Reproducibles, Rollback Atómico |
| **210** | `dragonflybsd` | DragonFly BSD 6.4 | 2 Núcleos | 1.024 MB (1 GB) | **512 MB** | VirtIO SCSI Single (15 GB) | Sistema de Archivos HAMMER2, Microkernel Híbrido, SMP Lockless |
| **212** | `metasploitable2` | Metasploitable 2 (Ubuntu 8.04) | 1 Núcleo | 512 MB | **512 MB** | VirtIO Net + IDE (8 GB) | Objetivo Linux Vulnerable para Pruebas de Penetración y Ajuste IDS/IPS |
| **213** | `tpot-honeypot` | Debian 12 / T-Pot 24.04 | 4 Núcleos | 8.192 MB (8 GB) | **4.096 MB (4 GB)** | VirtIO Net + SCSI (60 GB) | Plataforma Señuelo Multi-Honeypot (Cowrie, Dionaea, Honeytrap, Elastic, Kibana, Suricata) |
| **214** | `haiku` | Haiku R1/beta5 | 2 Núcleos | 2.048 MB (2 GB) | **1.024 MB (1 GB)** | e1000 + SCSI (20 GB) | Sistema Operativo Modular Inspirado en BeOS, API de Objetos C++ y Sistema de Archivos OpenBFS |
| **215** | `plan9` | Plan 9 from Bell Labs (9front) | 1 Núcleo | 512 MB (512 MB) | **512 MB** | e1000 + IDE (12 GB) | Sistema de Investigación de Bell Labs, Protocolo Distribuido 9P y Espacios de Nombres por Proceso |
| **216** | `reactos` | ReactOS 0.4.16 | 1 Núcleo | 1.024 MB (1 GB) | **1.024 MB** | e1000 + IDE (32 GB) | Arquitectura de Compatibilidad Binaria con Windows NT de Código Abierto y Subsistema Win32 |
| **217** | `securityonion` | Security Onion 3.2 / Wazuh SIEM | 4 Núcleos | 8.192 MB (8 GB) | **4.096 MB (4 GB)** | VirtIO Net + SCSI (50 GB) | Plataforma SIEM Empresarial, HIDS, Análisis de Registros, Monitorización de Red (Zeek, Suricata, Elastic, Kibana) |
| **218** | `remnux` | REMnux v7 / Noble | 2 Núcleos | 4.096 MB (4 GB) | **2.048 MB (2 GB)** | VirtIO Net + SCSI (40 GB) | Distribución Linux Dedicada a Ingeniería Inversa, Análisis de Malware, Informática Forense y DFIR |
| **219** | `redox` | Redox OS 0.9.0 | 2 Núcleos | 2.048 MB (2 GB) | **1.024 MB (1 GB)** | e1000 + SCSI (10 GB) | Sistema Operativo Microkernel Escrito en Rust, RedoxFS y Diseño Seguro Inspirado en Minix/Plan 9 |
| **220** | `freedos` | FreeDOS 1.3 | 1 Núcleo | 512 MB (512 MB) | **256 MB** | e1000 + IDE (2 GB) | Entorno DOS de Código Abierto, Ensamblador x86 de 16 bits en Modo Real y Laboratorio Legacy |

> **Rebalanceo de Arquitectura: Migración Completa No-IA a ARM64**: Todas las cargas de contenedores que no involucran IA a partir del CT 112 (incluyendo Paperless-ngx, MinIO S3, Meilisearch, Vector, SearXNG, NetAlertX, RustDesk, Kopia, WG-Easy, Code-Server, pgAdmin4, Dozzle, Kiwix, Transmission, Kavita, Stirling-PDF, Audiobookshelf, TubeArchivist, Calibre-Web, CyberChef, Draw.io, RomM, EmulatorJS y VS Code Server ARM64) fueron reubicadas en el Nodo 3 (Apple Silicon M1 ARM64 vía UTM), respaldadas por compresión ZRAM lz4. El Nodo 1 (x86_64) está dedicado estrictamente al clúster de IA acelerado por GPU CUDA (Ollama LLM, Open-WebUI, Faster-Whisper, Flowise, Paperless-AI) y máquinas virtuales empresariales KVM (Windows Server 2025 Datacenter, macOS Monterey, OpenIndiana Hipster, NetBSD, NixOS, DragonFly BSD, RHEL, BSD).


---

## 10. Matriz de Recursos LXC & Máquinas Virtuales

### Catálogo Detallado de Contenedores LXC (Nodo 1 — x86_64 Principal)

| VMID | Nombre de Host | SO Base | vCPU | RAM Asignada | Pool Almacenamiento | IP Estática | Categoría | Servicio Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **100** | `nginx` | Alpine 3.24 | 1 | 128 MB | `local-lvm:3G` | `192.168.1.3` | Ingreso | Nginx Proxy Manager + Terminación SSL |
| **101** | `immich` | Alpine 3.24 | 2 | 256 MB | `local-lvm:40G` | `192.168.1.15` | Almacenamiento / IA | Photo Library + Reconocimiento Facial Machine Learning |
| **102** | `nextcloud` | Alpine 3.24 | 1 | 256 MB | `local-lvm:50G` | `192.168.1.8` | Almacenamiento | Enterprise File Cloud & Sincronización WebDAV |
| **103** | `homeassistant` | Alpine 3.24 | 2 | 128 MB | `local-lvm:16G` | `192.168.1.10` | Automatización | Smart Home Hub, Telemetría Zigbee & ESP32 |
| **104** | `n8n` | Alpine 3.24 | 2 | 256 MB | `local-lvm:8G` | `192.168.1.13` | Automatización | Orquestación de Flujos & Playbooks de Incidentes |
| **105** | `scrutiny` | Alpine 3.24 | 1 | 96 MB | `local-lvm:3G` | `192.168.1.18` | Monitoreo | Agente de Salud y Telemetría S.M.A.R.T. Scrutiny |
| **106** | `media-suite` | Alpine 3.24 | 2 | 896 MB | `local-lvm:50G` | `192.168.1.21` | Medios | Procesamiento e Ingress Multimedia Jellyfin |
| **107** | `ollama` | Debian 13 | 4 | 2.048 MB | `local-lvm:16G` | `192.168.1.110` | IA Local | Ollama GPU LLM Runtime (Qwen2.5-Coder & DeepSeek-R1) |
| **108** | `openwebui` | Debian 13 | 2 | 512 MB | `local-lvm:8G` | `192.168.1.111` | IA Local | Interfaz Web Self-Hosted ChatGPT / Claude |
| **109** | `whisper` | Debian 13 | 2 | 1.024 MB | `local-lvm:8G` | `192.168.1.112` | IA Local | Faster-Whisper Speech-to-Text CUDA API |
| **110** | `flowise` | Alpine 3.24 | 2 | 512 MB | `local-lvm:1G` | `192.168.1.26` | IA Local | Orquestador Multi-Agente LLM Flowise |
| **111** | `paperless-ai` | Alpine 3.24 | 1 | 64 MB | `local-lvm:1G` | `192.168.1.56` | IA Local | Paperless-AI Automated OCR & DeepSeek Document Tagging |
| **112** | `codeserver` | Alpine 3.24 | 2 | 512 MB | `local-lvm:4G` | `192.168.1.115` | Desarrollo | Entorno Web Code-Server Cloud IDE |
| **113** | `pbs` | Alpine 3.24 | 2 | 512 MB | `local-lvm:4G` | `192.168.1.116` | Almacenamiento / Respaldo | Proxmox Backup Server (Deduplicación y Verificación Enterprise) |
| **114** | `pdm` | Alpine 3.24 | 2 | 512 MB | `local-lvm:4G` | `192.168.1.117` | Gestión | Proxmox Datacenter Manager (Orquestación Multi-Cluster) |
| **115** | `woodpecker-k0s` | Alpine 3.24 | 2 | 512 MB | `local-lvm:8G` | `192.168.1.118` | CI/CD | Woodpecker CI Server & Runner en Alpine Linux motorizado por k0s |

### Catálogo Detallado de Contenedores LXC (Nodo 3 — Apple M1 ARM64 UTM)

| VMID | Nombre de Host | SO Base | vCPU | RAM Asignada | Pool Almacenamiento | IP Estática | Categoría | Servicio Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **100** | `it-tools` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.100` | Utilidades | IT-Tools Handy Web Tools for Developers |
| **101** | `actualbudget` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.101` | Finanzas | Actual Budget Local-First Personal Finance |
| **102** | `trilium` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.102` | Notas | Trilium Hierarchical Note Taking Knowledge Base |
| **103** | `changedetection` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.103` | Automatización | ChangeDetection Website Change Monitoring & Alerting |
| **104** | `scrutiny` | Debian 13 | 1 | 128 MB | `local:2G` | `192.168.64.104` | Monitoreo | Scrutiny Hard Drive S.M.A.R.T. Health Telemetry |
| **105** | `uptimekuma` | Debian 13 | 1 | 128 MB | `local:2G` | `192.168.64.105` | Monitoreo | Uptime Kuma Service Availability & SLA Monitoring |
| **106** | `vaultwarden` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.106` | Seguridad | Vaultwarden Lightweight Bitwarden Compatible Server |
| **107** | `monitoring` | Debian 13 | 2 | 384 MB | `local:2G` | `192.168.64.107` | Monitoreo | Prometheus TSDB & Grafana Central Dashboards |
| **108** | `authelia` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.108` | Seguridad | Authelia 2FA & SSO Portal (FIDO2 / WebAuthn) |
| **109** | `gitea` | Debian 13 | 2 | 160 MB | `local:2G` | `192.168.64.109` | Desarrollo | Gitea Git Forge & Code Review Platform |
| **110** | `woodpecker` | Alpine 3.24 | 2 | 192 MB | `local:2G` | `192.168.64.110` | CI/CD | Woodpecker CI Build Engine & Pipeline Runner |
| **111** | `gatus` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.111` | Monitoreo | Gatus Automated Health Dashboard in Go |
| **112** | `ntfy` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.112` | Alertas | Ntfy.sh Private Push Notifications Hub |
| **113** | `linkding` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.113` | Automatización | Linkding Bookmark & Technical Search Manager |
| **114** | `stepca` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.114` | Seguridad | Step-CA Private Automated TLS PKI Authority |
| **115** | `tailscale-arm` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.115` | VPN | Tailscale Subnet Router (ARM64 Subnet) |
| **116** | `beszel` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.116` | Monitoreo | Beszel High-Resolution System Telemetry (1s) |
| **117** | `pocketbase` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.117` | Backend | PocketBase Realtime Backend in 1 File (SQLite) |
| **118** | `homepage` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.118` | Panel de Control | Homepage Unified Homelab Command Dashboard |
| **119** | `speedtest` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.119` | Monitoreo | Speedtest-Tracker Automated Bandwidth Telemetry |
| **120** | `memos` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.120` | Notas | Memos Privacy-First Fast Knowledge Capture |
| **121** | `wallos` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.121` | Finanzas | Wallos Recurring Expense & Subscription Tracker |
| **122** | `syncthing` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.122` | Almacenamiento | SyncThing P2P Bidirectional File Synchronization |
| **123** | `microbin` | Alpine 3.24 | 1 | 16 MB | `local:2G` | `192.168.64.123` | Seguridad | Microbin Encrypted Self-Destructing Rust Pastebin |
| **124** | `vikunja` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.124` | Gestión de Tareas | Vikunja Project & Task Management Platform |
| **125** | `blackbox` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.125` | Monitoreo | Prometheus Blackbox Exporter (ICMP / TLS Expiry) |
| **126** | `yourspotify` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.126` | Analítica | YourSpotify Private Listening History & Insights |
| **127** | `webcheck` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.127` | OSINT | Web-Check OSINT Security & Domain Scanner |
| **128** | `opengist` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.128` | Desarrollo | Opengist Self-Hosted Code Paste & Snippets |
| **129** | `flatnotes` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.129` | Notas | Flatnotes Flat-File Markdown Note Storage |
| **130** | `bark` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.130` | Alertas | Bark Apple Push Notification Relay Hub |
| **131** | `shiori` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.131` | Almacenamiento | Shiori Simple Clean Web Page Archiver |
| **132** | `whoogle` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.132` | Privacidad | Whoogle Private Anonymized Google Proxy |
| **133** | `flame` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.133` | Panel de Control | Flame Minimalist Fast Startpage |
| **134** | `dashy` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.134` | Panel de Control | Dashy Highly Customizable Homelab Dashboard |
| **135** | `shlink` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.135` | Productividad | Shlink Self-Hosted URL Shortener with Geolocation Analytics |
| **136** | `pastefy` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.136` | Productividad | Pastefy Secure & Beautiful Open-Source Pastebin |
| **137** | `pingvin` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.137` | Almacenamiento | Pingvin Share Privacy-Focused File Sharing Platform |
| **138** | `rssbridge` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.138` | Fuentes RSS | RSS-Bridge Feed Generator for Sites Without Native Feeds |
| **139** | `playwright` | Alpine 3.24 | 2 | 192 MB | `local:2G` | `192.168.64.139` | Sonda | Playwright Headless Browser Worker for Dynamic Web Checks |
| **140** | `uptimechk` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.140` | Monitoreo | Distributed Secondary Uptime Verification Probe |
| **141** | `dnsbench` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.141` | Red | DNS Benchmark & Latency Analytics Collector |
| **142** | `excalidraw` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.142` | Productividad | Excalidraw Infinite Canvas Collaborative Virtual Whiteboard |
| **143** | `snagim` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.143` | Medios | Snagim Fast Screenshot & Image Hosting Server |
| **144** | `whoogletor` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.144` | Privacidad | Whoogle Search Routed via Encrypted Tor Circuit |
| **145** | `heimdall` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.145` | Panel de Control | Heimdall Application Dashboard with Live Service Indicators |
| **146** | `pbs` | Alpine 3.24 | 2 | 512 MB | `local:2G` | `192.168.64.146` | Almacenamiento / Respaldo | Proxmox Backup Server (PBS Deduplication & Verification) |
| **147** | `pdm` | Alpine 3.24 | 2 | 512 MB | `local:2G` | `192.168.64.147` | Gestión | Proxmox Datacenter Manager (Multi-Cluster Management) |
| **148** | `renovate` | Alpine 3.24 | 2 | 256 MB | `local:1G` | `192.168.64.148` | GitOps | RenovateBot Automated Dependency PR Engine |
| **149** | `transmission` | Alpine 3.24 | 1 | 256 MB | `local:1G` | `192.168.64.149` | Medios | Isolated BitTorrent Download Gateway |
| **150** | `kavita` | Alpine 3.24 | 1 | 256 MB | `local:1G` | `192.168.64.150` | Medios | E-book, Manga & Comic Web Reader |
| **151** | `stirling` | Alpine 3.24 | 1 | 256 MB | `local:1G` | `192.168.64.151` | Productividad | Stirling-PDF Offline PDF Toolset |
| **152** | `audiobookshelf` | Alpine 3.24 | 1 | 256 MB | `local:1G` | `192.168.64.152` | Medios | Audiobook & Podcast Streaming Server |
| **153** | `tubearchivist` | Alpine 3.24 | 1 | 256 MB | `local:1G` | `192.168.64.153` | Medios | Private YouTube Channel Archiver |
| **154** | `calibreweb` | Alpine 3.24 | 1 | 256 MB | `local:1G` | `192.168.64.154` | Medios | Calibre-Web Digital Book Manager |
| **155** | `cyberchef` | Alpine 3.24 | 1 | 128 MB | `local:1G` | `192.168.64.155` | Seguridad | CyberChef Swiss Army Knife |
| **156** | `drawio` | Alpine 3.24 | 1 | 128 MB | `local:1G` | `192.168.64.156` | Architecture | Draw.io Offline Diagramming Suite |
| **157** | `romm` | Alpine 3.24 | 1 | 256 MB | `local:1G` | `192.168.64.157` | Juegos | RomM Retro Games Collection Manager |
| **158** | `emulatorjs` | Alpine 3.24 | 1 | 256 MB | `local:1G` | `192.168.64.158` | Juegos | EmulatorJS WebAssembly Retro Gaming |
| **159** | `vscode-server` | Alpine 3.24 | 2 | 512 MB | `local:1G` | `192.168.64.159` | Desarrollo | VS Code Server Cloud IDE ARM64 |
| **160** | `paperless` | Alpine 3.24 | 2 | 512 MB | `local:1G` | `192.168.64.160` | Gestión Documental | Paperless-ngx Document Management |
| **161** | `minio` | Alpine 3.24 | 1 | 256 MB | `local:1G` | `192.168.64.161` | Almacenamiento | MinIO S3 Object Storage Server |
| **162** | `meilisearch` | Alpine 3.24 | 1 | 256 MB | `local:1G` | `192.168.64.162` | Búsqueda | Typo-Tolerant Full-Text Search Engine |
| **163** | `vector` | Alpine 3.24 | 1 | 128 MB | `local:1G` | `192.168.64.163` | Telemetría | Vector High-Performance Log Aggregator |
| **164** | `searxng` | Alpine 3.24 | 1 | 128 MB | `local:1G` | `192.168.64.164` | Privacidad | SearXNG Privacy Metasearch Engine |
| **165** | `netalertx` | Alpine 3.24 | 1 | 128 MB | `local:1G` | `192.168.64.165` | Seguridad | NetAlertX Network Intruder Detector |
| **166** | `rustdesk` | Alpine 3.24 | 1 | 128 MB | `local:1G` | `192.168.64.167` | Acceso Remoto | RustDesk Self-Hosted Remote Desktop Relay |
| **167** | `kopia` | Alpine 3.24 | 1 | 256 MB | `local:1G` | `192.168.64.167` | Respaldo | Fast Encrypted Snapshot Backup Server |
| **168** | `wgeasy` | Alpine 3.24 | 1 | 128 MB | `local:1G` | `192.168.64.168` | VPN | WireGuard-Easy Management Portal |
| **169** | `pgadmin` | Alpine 3.24 | 1 | 256 MB | `local:1G` | `192.168.64.169` | Base de Datos | pgAdmin 4 PostgreSQL Web Administration |
| **170** | `dozzle` | Alpine 3.24 | 1 | 64 MB | `local:1G` | `192.168.64.170` | Monitoreo | Dozzle Live Container Log Viewer |
| **171** | `kiwix` | Alpine 3.24 | 1 | 128 MB | `local:1G` | `192.168.64.171` | Conocimiento Offline | Kiwix Offline Wikipedia & Docs Server |
| **172** | `hedgedoc` | Alpine 3.24 | 1 | 256 MB | `local:1G` | `192.168.64.172` | Notas | HedgeDoc Collaborative Markdown Notes |
| **173** | `glances` | Alpine 3.24 | 1 | 64 MB | `local:1G` | `192.168.64.173` | Monitoreo | Glances System Telemetry & Process Monitor |
| **174** | `dufs` | Alpine 3.24 | 1 | 64 MB | `local:1G` | `192.168.64.174` | Almacenamiento | Dufs Lightweight Static File Server |
| **175** | `gotify` | Alpine 3.24 | 1 | 64 MB | `local:1G` | `192.168.64.175` | Alertas | Gotify Self-Hosted Push Notification Server |
| **176** | `miniflux` | Alpine 3.24 | 1 | 64 MB | `local:1G` | `192.168.64.176` | Fuentes RSS | Miniflux Minimalist RSS Feed Reader |
| **177** | `grocy` | Alpine 3.24 | 1 | 128 MB | `local:1G` | `192.168.64.177` | ERP | Grocy Self-Hosted ERP & Household Tracker |
| **178** | `chrony` | Alpine 3.24 | 1 | 32 MB | `local:1G` | `192.168.64.178` | Red | Chrony Local Stratum-1 Precision NTP Server |
| **179** | `linkwarden` | Alpine 3.24 | 1 | 128 MB | `local:1G` | `192.168.64.179` | Marcadores | Linkwarden Webpage Archiver & Bookmark Hub |
| **180** | `snmp-collector` | Alpine 3.24 | 1 | 64 MB | `local:1G` | `192.168.64.180` | Monitoreo | SNMP Metric Collector & Network Prober |
| **181** | `searxng-redis` | Alpine 3.24 | 1 | 32 MB | `local:1G` | `192.168.64.181` | Caché en Memoria | Redis In-Memory Cache for SearXNG |

---

## Galería de Fotos: Paneles de Control, Servicios y Telemetría Loki

Todos los nodos de hardware, máquinas virtuales y contenedores se ejecutan sobre infraestructura física. A continuación se presentan las capturas directas de las interfaces de administración, microservicios activos y flujos centralizados de registros en Grafana Loki.

### Paneles Principales de Gestión
| Grafana: Nodos Homelab (12GB x64 & ARM64) | Grafana: Defensa Perimetral OPNsense |
| :---: | :---: |
| ![Grafana Nodes Dashboard](photos/grafana_nodes_dashboard.png) | ![Grafana OPNsense Dashboard](photos/grafana_opnsense_dashboard.png) |

| Proxmox VE 9.2 x86_64 (12GB RAM · 192.168.1.132:8006) | Proxmox VE 9.2 ARM64 Apple M1 (192.168.64.14:8006) |
| :---: | :---: |
| ![Proxmox VE x64](photos/proxmox_ve_dashboard.png) | ![Proxmox VE ARM64](photos/proxmox_arm64_dashboard.png) |

| Pi-hole DNS Sinkhole & FTL (192.168.1.4:8080) | Home Assistant Automation Hub (192.168.1.10:8123) |
| :---: | :---: |
| ![Pi-hole Admin](photos/pihole_admin_dashboard.png) | ![Home Assistant](photos/homeassistant_dashboard.png) |

| OPNsense Suricata 8 NIDS/IPS (192.168.1.134:8443) | OPNsense: Políticas de Filtrado VLAN (reglas pf) |
| :---: | :---: |
| ![OPNsense Suricata Defense](photos/opnsense_suricata_defense.png) | ![OPNsense Firewall Rules](photos/opnsense_firewall_rules.png) |

| OPNsense: Mesh VPN Kernel WireGuard | OPNsense: Unbound DNS-over-TLS (DoT) |
| :---: | :---: |
| ![OPNsense WireGuard VPN](photos/opnsense_wireguard_vpn.png) | ![OPNsense Unbound DNS](photos/opnsense_unbound_dns.png) |

---

### Core & Redes
| Nginx Proxy Manager | Pi-hole DNS Sinkhole |
| :---: | :---: |
| ![Nginx Proxy Manager](photos/services/npm.png) | ![Pi-hole DNS](photos/services/pihole.png) |

| Tailscale Mesh | WireGuard Easy |
| :---: | :---: |
| ![Tailscale Mesh](photos/services/tailscale-x64.png) | ![WireGuard Easy](photos/services/wgeasy.png) |

| OPNsense Core Gateway | OPNsense Unbound DoT |
| :---: | :---: |
| ![OPNsense Core Gateway](photos/services/opnsense-core.png) | ![OPNsense Unbound DoT](photos/services/opnsense-unbound.png) |

| OPNsense FRR Enrutamiento Dinámico | Caddy Ingress mTLS |
| :---: | :---: |
| ![OPNsense FRR](photos/services/opnsense-frr.png) | ![Caddy mTLS](photos/services/caddy-mtls.png) |

---

### Almacenamiento & Copias de Seguridad
| Nextcloud Hub | Paperless-ngx OCR de Documentos |
| :---: | :---: |
| ![Nextcloud Hub](photos/services/nextcloud.png) | ![Paperless-ngx](photos/services/paperless.png) |

| MinIO S3 Almacenamiento de Objetos | Kopia Copias de Seguridad Instantáneas |
| :---: | :---: |
| ![MinIO S3](photos/services/minio.png) | ![Kopia Backup](photos/services/kopia.png) |

| Syncthing Sincronización de Archivos | Proxmox Backup Server (PBS) |
| :---: | :---: |
| ![Syncthing](photos/services/syncthing.png) | ![Proxmox Backup Server](photos/services/proxmox-backup-server.png) |

---

### Automatización & IA
| Ollama Ejecutor LLM | Open-WebUI Interfaz IA |
| :---: | :---: |
| ![Ollama LLM](photos/services/ollama.png) | ![Open-WebUI](photos/services/openwebui.png) |

| Faster-Whisper Transcripción de Voz | Flowise Orquestador LLM |
| :---: | :---: |
| ![Faster-Whisper](photos/services/whisper.png) | ![Flowise Orchestrator](photos/services/flowise.png) |

| Home Assistant Hub Domótico | RenovateBot Motor GitOps |
| :---: | :---: |
| ![Home Assistant](photos/services/homeassistant.png) | ![RenovateBot](photos/services/renovate.png) |

---

### Observabilidad & Monitorización
| Grafana Enterprise Panel de Control | Prometheus Motor de Métricas |
| :---: | :---: |
| ![Grafana Enterprise](photos/services/grafana.png) | ![Prometheus Metrics](photos/services/prometheus.png) |

| Loki Agregador de Registros | Uptime Kuma Monitor de SLA |
| :---: | :---: |
| ![Loki Log Aggregator](photos/services/loki.png) | ![Uptime Kuma Monitor](photos/services/uptimekuma.png) |

| Gatus Verificador de Estado | Beszel Métricas Ligeras |
| :---: | :---: |
| ![Gatus Status](photos/services/gatus.png) | ![Beszel Metrics](photos/services/beszel.png) |

| Blackbox Exportador de Red | Vector Agregador de Alto Rendimiento |
| :---: | :---: |
| ![Blackbox Exporter](photos/services/blackbox.png) | ![Vector Aggregator](photos/services/vector.png) |

| Dozzle Visualizador de Registros en Vivo |  |
| :---: | :---: |
| ![Dozzle Log Viewer](photos/services/dozzle.png) |  |

---

### Seguridad & Cyber Lab
| OPNsense Suricata 8 NIDS/IPS | OPNsense CrowdSec LAPI Bouncer |
| :---: | :---: |
| ![Suricata IDS/IPS](photos/services/opnsense-suricata.png) | ![CrowdSec Bouncer](photos/services/opnsense-crowdsec.png) |

| Wazuh SIEM / XDR Gestor | T-Pot Sensores Multi-Honeypots |
| :---: | :---: |
| ![Wazuh SIEM](photos/services/wazuh.png) | ![T-Pot Honeypots](photos/services/tpot-honeypot.png) |

| CyberChef Utilidad Criptográfica | DFIR Entorno Aislado Malware |
| :---: | :---: |
| ![CyberChef](photos/services/cyberchef.png) | ![DFIR Sandbox](photos/services/dfir-sandbox.png) |

| HashiCorp Vault Motor de Secretos | Señuelos Canary Tokens & Archivos Trampa |
| :---: | :---: |
| ![HashiCorp Vault](photos/services/vault.png) | ![Canary Decoys](photos/services/canary-decoys.png) |

---

### Multimedia & Utilidades
| Stirling-PDF Suite de Manipulación | Kavita Biblioteca Digital |
| :---: | :---: |
| ![Stirling-PDF](photos/services/stirling.png) | ![Kavita Library](photos/services/kavita.png) |

| Audiobookshelf Servidor de Audiolibros | TubeArchivist Archivo de YouTube |
| :---: | :---: |
| ![Audiobookshelf](photos/services/audiobookshelf.png) | ![TubeArchivist](photos/services/tubearchivist.png) |

| Transmission Cliente BitTorrent | Calibre-Web Gestor de Libros Electrónicos |
| :---: | :---: |
| ![Transmission](photos/services/transmission.png) | ![Calibre-Web](photos/services/calibreweb.png) |

| RomM Gestor de ROMs Retro | EmulatorJS Emulador de Navegador |
| :---: | :---: |
| ![RomM Game Manager](photos/services/romm.png) | ![EmulatorJS](photos/services/emulatorjs.png) |

| Code-Server VS Code IDE en la Nube | Draw.io Diseñador de Arquitectura |
| :---: | :---: |
| ![Code-Server](photos/services/codeserver.png) | ![Draw.io Designer](photos/services/drawio.png) |

| IT-Tools Herramientas para Desarrolladores | Actual Budget Contabilidad Local |
| :---: | :---: |
| ![IT-Tools Suite](photos/services/it-tools.png) | ![Actual Budget](photos/services/actualbudget.png) |

| Trillium Base de Conocimiento Estructurada | ChangeDetection Monitor de Cambios Web |
| :---: | :---: |
| ![Trillium Knowledge Base](photos/services/trillium.png) | ![ChangeDetection](photos/services/changedetection.png) |

| MicroBin Pastebin Cifrado | Vikunja Gestor de Tareas |
| :---: | :---: |
| ![MicroBin Pastebin](photos/services/microbin.png) | ![Vikunja Tasks](photos/services/vikunja.png) |

| Memos Notas Rápidas | Wallos Gestor de Suscripciones |
| :---: | :---: |
| ![Memos Note Stream](photos/services/memos.png) | ![Wallos Subscriptions](photos/services/wallos.png) |

| Speedtest Tracker Banco de Pruebas Continuo | Homepage Panel de Inicio |
| :---: | :---: |
| ![Speedtest Tracker](photos/services/speedtest.png) | ![Homepage Dashboard](photos/services/homepage.png) |

| Flame Lanzador de Aplicaciones |  |
| :---: | :---: |
| ![Flame Launcher](photos/services/flame.png) |  |

---

### Sistemas Operativos Especializados & Telemetría (Loki Telemetry & Runtime Logs)
| Windows Server 2025 Datacenter (VM 201 · Loki Telemetry) | Red Hat Enterprise Linux 9.8 (VM 202 · Loki Telemetry) |
| :---: | :---: |
| ![Windows Server 2025 Datacenter Telemetry](photos/services/vm-windows.png) | ![RHEL 9.8 Telemetry](photos/services/vm-rhel.png) |

| FreeBSD 15.1-RELEASE (VM 203 · Loki Telemetry) | OpenBSD 7.9 Bastion (VM 204 · Loki Telemetry) |
| :---: | :---: |
| ![FreeBSD 15.1 Telemetry](photos/services/vm-freebsd.png) | ![OpenBSD 7.9 Telemetry](photos/services/vm-openbsd.png) |

| Talos Linux 1.7 (VM 205 · Loki Telemetry) | Proxmox Datacenter Manager (CT 147 · Loki Telemetry) |
| :---: | :---: |
| ![Talos Linux Telemetry](photos/services/vm-talos.png) | ![Proxmox Datacenter Manager](photos/services/proxmox-datacenter-manager.png) |

---

## Acerca del Autor

Diseñado, desplegado y operado por **[@stefanutc1](https://github.com/stefanutc1)**.
* **Especialidad**: Ingeniería de infraestructura, virtualización híbrida (Proxmox VE x86_64 12GB DDR4-2133 y Apple Silicon ARM64), seguridad de red Zero-Trust (OPNsense, Suricata, CrowdSec, WireGuard), domótica (Home Assistant), filtrado DNS (Pi-hole), GitOps & IaC (Terraform, Ansible, CI/CD).
* **Propósito**: Portafolio técnico que demuestra buenas prácticas en arquitectura de sistemas modernos on-premise e híbridos.
