<div align="center">

# Plataforma de Ingeniería y Nube Híbrida Empresarial (Homelab)

**[ 🇷🇴 Română ](README.ro.md) • [ 🇬🇧 English ](README.md) • [ 🇫🇷 Français ](README.fr.md) • [ 🇪🇸 Español ](README.es.md) • [ 🇩🇪 Deutsch ](README.de.md)**

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

## 📑 Tabla de Contenidos

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

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                          PRINCIPIOS DE INGENIERÍA                             │
├────────────────────────┬──────────────────────────┬───────────────────────────┤
│ EFICIENCIA EN RECURSOS │   DEFENSA EN PROFUNDIDAD │    GITOPS Y CODE-FIRST    │
│ Mínimo consumo con     │ Firewall Default-Deny,   │ Estado 100% declarativo,  │
│ contenedores Alpine,   │ telemetría kernel eBPF,  │ sin cambios manuales,     │
│ compresión ZFS ZSTD    │ honeypots en DMZ y       │ rollback inmediato y      │
│ y modelos LLM en GPU.  │ Zero-Trust con FIDO2.    │ validación CI automática. │
└────────────────────────┴──────────────────────────┴───────────────────────────┘
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
        OPN -->|VLAN 10: 192.168.1.0/24| V10["VLAN 10: Gestión & Almacenamiento<br/>Proxmox VE · NAS OMV · IPMI"]
        OPN -->|VLAN 20: 192.168.20.0/24| V20["VLAN 20: Microservicios Core<br/>NPM · Authentik · Vaultwarden · Nextcloud"]
        OPN -->|VLAN 30: 192.168.30.0/24| V30["VLAN 30: CyberLab & Sandboxes<br/>Wazuh SIEM · Atomic Red Team · CAPEv2"]
        OPN -->|VLAN 40: 192.168.40.0/24| V40["VLAN 40: DMZ Señuelo<br/>Honeypots T-Pot · AbuseIPDB"]
        OPN -->|VLAN 50: 192.168.50.0/24| V50["VLAN 50: IoT & Sensores Edge<br/>ESP32 mmWave · Zigbee · Home Assistant"]
    end

    subgraph Compute_Layer["Flota de Virtualización Multi-Nodo"]
        Node1["Nodo 1: Proxmox Principal (x86_64)<br/>Intel Core i3-10100F · 8 GB RAM<br/>GPU NVIDIA GTX 1050 Ti (Passthrough)"]
        Node2["Nodo 2: Almacenamiento NAS OMV<br/>Portátil ASUS · Celeron N2830 · 2 GB RAM<br/>Pool ZFS 500 GB · Wikipedia Kiwix"]
        Node3["Nodo 3: Proxmox Secundario (ARM64)<br/>Apple MacBook Air M1 · 8 Núcleos<br/>Telemetría LGTM · Gitea · Woodpecker CI"]
        Node4["Nodo 4: Worker Talos Linux<br/>AMD Athlon II X2 · 4 GB RAM<br/>k3s-agent · Sensor eBPF Tetragon"]
    end

    V10 -.-> Node1 & Node2 & Node3 & Node4
    V20 -.-> Node1 & Node3
    V30 -.-> Node1
    V40 -.-> Node1
    V50 -.-> Node1
```

---

## 3. Flota de Hardware Físico & Energía

### Especificaciones de Hardware

| Identificador Nodo | Factor de Forma / Chasis | Arquitectura CPU | Acelerador / GPU | Memoria RAM | Configuración Almacenamiento | Propósito Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`proxmox` (Nodo 1)** | Torre ATX Personalizada | Intel Core i3-10100F (4C/8T @ 4.30 GHz) | NVIDIA GeForce GTX 1050 Ti (4 GB VRAM) | 8 GB DDR4-2666 | 512 GB NVMe SSD (`local-lvm`) | Hipervisor Principal: Windows Server 2025 AD, OPNsense, Ollama GPU (CT 110), Immich AI |
| **`openmediavault` (Nodo 2)** | Portátil ASUS X451MA | Intel Celeron N2830 (2C/2T @ 2.16 GHz) | Intel HD Graphics | 2 GB DDR3L | 500 GB SATA HDD (Espejo ZFS) | NAS Centralizado: Recursos NFS/SMB, destino de respaldos vzdump, Wikipedia offline Kiwix |
| **`proxmox2` (Nodo 3)** | Apple MacBook Air (2020) | Apple M1 (4P + 4E Cores @ 3.20 GHz) | 16-Core Neural Engine / Metal | 8 GB Unificada (4 GB VM dedicada) | 256 GB Apple APFS NVMe | Hipervisor Secundario ARM64 (UTM): Telemetría Grafana/Prometheus/Tempo, Gitea, Woodpecker CI |
| **`k8s-node-04` (Nodo 4)** | Chasis ATX Personalizado | AMD Athlon II X2 220 (2C/2T @ 2.80 GHz) | NVIDIA GeForce GTS 250 (1 GB) | 4 GB DDR3-1333 | 80 GB HDD (NFS Root) | Worker inmutable Talos Linux / k3s, tareas batch programadas, sensor de seguridad eBPF |

---

## 4. Matriz de Recursos LXC & Máquinas Virtuales

### Contenedores LXC Activos

| VMID | Nombre de Host | SO Base | vCPU | RAM Asignada | Pool Almacenamiento | IP Estática | Categoría | Servicio Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **100** | `nginx` | Alpine 3.20 | 1 | 112 MB | `local-lvm:3G` | `192.168.1.3` | Ingress | Nginx Proxy Manager + Bouncer CrowdSec |
| **101** | `pihole` | Alpine 3.20 | 1 | 64 MB | `local-lvm:2G` | `192.168.1.4` | DNS | Servidor DNS Interno & Bloqueador de Publicidad |
| **102** | `tailscale` | Alpine 3.20 | 1 | 64 MB | `local-lvm:2G` | `192.168.1.5` | VPN | Enrutador de Subred WireGuard Mesh |
| **103** | `immich` | Debian 12 | 4 | 896 MB | `local-lvm:32G` | `192.168.1.6` | Storage / IA | Galería de Fotos & Reconocimiento Facial ML |
| **104** | `nextcloud` | Debian 12 | 2 | 512 MB | `local-lvm:16G` | `192.168.1.7` | Storage | Nube de Archivos & Sincronización WebDAV |
| **105** | `crowdsec` | Alpine 3.20 | 1 | 96 MB | `local-lvm:2G` | `192.168.1.8` | Seguridad | Agente de Ciberseguridad & Motor de Decisiones |
| **106** | `homeassistant` | Debian 12 | 2 | 384 MB | `local-lvm:16G` | `192.168.1.9` | Domótica | Servidor Smart Home, Zigbee & Sensores ESP32 |
| **107** | `n8n` | Alpine 3.20 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.10` | Automatización | Orquestación de Flujos de Trabajo & SOAR |
| **108** | `authentik` | Debian 12 | 2 | 512 MB | `local-lvm:8G` | `192.168.1.11` | Seguridad | Proveedor de Identidad FIDO2 / Passkeys |
| **109** | `media-suite` | Debian 12 | 4 | 896 MB | `local-lvm:32G` | `192.168.1.12` | Multimedia | Servidor Jellyfin con Transcodificación por GPU |
| **110** | `ollama` | Debian 13 | 4 | 2.048 MB | `local-lvm:16G` | `192.168.1.110` | IA Local | Motor LLM en GPU (Qwen2.5-Coder, Llama-3.2) |
| **118** | `tempo` | Alpine 3.20 | 2 | 256 MB | `local-lvm:8G` | `192.168.64.118` | Monitoreo | Backend de Rastreo Distribuido Grafana Tempo |

---

## 5. Infraestructura como Código (Terraform & Ansible)

```bash
# 1. Clonar el repositorio
git clone https://github.com/stefanutc1/homelab.git
cd homelab/terraform

# 2. Configurar variables y desplegar
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan -out=tfplan.binary
terraform apply tfplan.binary

# 3. Aplicar configuración de sistemas con Ansible
cd ../ansible
ansible-playbook playbooks/site.yml
```

---

<div align="center">

**Autor**: Stefan Utc ([@stefanutc1](https://github.com/stefanutc1)) • [Perfil de GitHub](https://github.com/stefanutc1)  
Distribuido bajo la **Licencia MIT**.

</div>
