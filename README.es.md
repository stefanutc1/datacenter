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

```mermaid
flowchart LR
    subgraph Principles["PRINCIPIOS DE INGENIERÍA HOMELAB"]
        direction LR
        P1["⚡ EFICIENCIA DE RECURSOS<br/>• Mínima sobrecarga con Alpine LXC<br/>• Compresión ZFS ZSTD y ZRAM lz4<br/>• Modelos LLM sub-100ms en GPU"]
        P2["🛡️ DEFENSA EN PROFUNDIDAD<br/>• Cortafuegos OPNsense default-deny<br/>• Telemetría kernel eBPF Tetragon<br/>• DMZ Decepción y Zero-Trust FIDO2"]
        P3["🔄 GITOPS Y AS-CODE<br/>• Estado 100% declarativo Terraform<br/>• Sin click-ops manuales<br/>• Rollback instantáneo y escaneo CI"]
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
| **`pve` (Nodo 1)** | Torre ATX Personalizada | Intel Core i3-10100F (4C/8T @ 4.30 GHz) | NVIDIA GeForce GTX 1050 Ti (4 GB VRAM) | 8 GB DDR4-2666 | 512 GB NVMe SSD (`local-lvm`) | Hipervisor Principal: Windows Server 2025 AD, OPNsense, Ollama GPU (CT 110), Immich AI |
| **`openmediavault` (Nodo 2)** | Portátil ASUS X451MA | Intel Celeron N2830 (2C/2T @ 2.16 GHz) | Intel HD Graphics | 2 GB DDR3L | 500 GB SATA HDD (Espejo ZFS) | NAS Centralizado: Recursos NFS/SMB, destino de respaldos vzdump, Wikipedia offline Kiwix |
| **`pve` (Nodo 3)** | Apple MacBook Air (2020) | Apple M1 (4P + 4E Cores @ 3.20 GHz) | 16-Core Neural Engine / Metal | 8 GB Unificada (4 GB VM dedicada) | 256 GB Apple APFS NVMe | Hipervisor Secundario ARM64 (UTM): Telemetría Grafana/Prometheus/Tempo, Gitea, Woodpecker CI |
| **`kubernetes` (Nodo 4)** | Chasis ATX Personalizado | AMD Athlon II X2 220 (2C/2T @ 2.80 GHz) | NVIDIA GeForce GTS 250 (1 GB) | 4 GB DDR3-1333 | 80 GB HDD (NFS Root) | Worker inmutable Talos Linux / k3s, tareas batch programadas, sensor de seguridad eBPF |

---

## 4. Matriz de Recursos LXC & Máquinas Virtuales

### Catálogo Detallado de Contenedores LXC (Nodo 1 — x86_64 Principal)

| VMID | Nombre de Host | SO Base | vCPU | RAM Asignada | Pool Almacenamiento | IP Estática | Categoría | Servicio Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **100** | `nginx` | Debian 13 | 2 | 112 MB | `local-lvm:4G` | `192.168.1.3` | Ingress | Nginx Proxy Manager + Bouncer CrowdSec |
| **101** | `pihole` | Debian 13 | 1 | 96 MB | `local-lvm:4G` | `192.168.1.4` | DNS | Servidor DNS Interno & Bloqueador de Publicidad |
| **102** | `tailscale` | Debian 13 | 1 | 96 MB | `local-lvm:4G` | `192.168.1.5` | VPN | Enrutador de Subred WireGuard Mesh Principal |
| **103** | `immich` | Debian 13 | 4 | 896 MB | `local-lvm:32G` | `192.168.1.15` | Storage / IA | Galería de Fotos & Reconocimiento Facial ML |
| **104** | `nextcloud` | Debian 13 | 2 | 512 MB | `local-lvm:20G` | `192.168.1.8` | Storage | Nube de Archivos & Sincronización WebDAV |
| **105** | `crowdsec` | Debian 13 | 1 | 128 MB | `local-lvm:4G` | `192.168.1.9` | Seguridad | Agente de Ciberseguridad & Motor de Decisiones IPS |
| **106** | `homeassistant` | Debian 13 | 2 | 384 MB | `local-lvm:16G` | `192.168.1.10` | Domótica | Servidor Smart Home, Zigbee & Sensores ESP32 |
| **107** | `n8n` | Debian 13 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.13` | Automatización | Orquestación de Flujos de Trabajo & SOAR |
| **110** | `ollama` | Debian 13 | 4 | 2.048 MB | `local-lvm:16G` | `192.168.1.110` | IA Local | Motor LLM en GPU (Qwen2.5-Coder & DeepSeek-R1) |
| **111** | `openwebui` | Debian 13 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.111` | IA Local | Interfaz Web IA conectada a Ollama |
| **112** | `paperless` | Debian 13 | 2 | 768 MB | `local-lvm:20G` | `192.168.1.16` | Storage / DMS | Gestión Documental & Reconocimiento OCR Tesseract |
| **113** | `minio` | Alpine 3.24 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.17` | Storage | Servidor de Almacenamiento de Objetos S3 |
| **114** | `transmission` | Alpine 3.24 | 1 | 256 MB | `local-lvm:8G` | `192.168.1.19` | Multimedia | Cliente BitTorrent Aislado |
| **115** | `kavita` | Alpine 3.24 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.20` | Multimedia | Lector Digital de Libros, Cómics y Manga |
| **116** | `stirling` | Alpine 3.24 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.21` | Herramientas | Suite Completa de Manipulación de PDF Offline |
| **117** | `meilisearch` | Alpine 3.24 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.22` | Búsqueda | Motor de Búsqueda de Texto Completo Ultrarrápido |
| **118** | `vector` | Alpine 3.24 | 1 | 128 MB | `local-lvm:4G` | `192.168.1.23` | Monitoreo | Enrutador y Agregador de Logs en Rust |
| **119** | `whisper` | Debian 13 | 2 | 1.024 MB | `local-lvm:8G` | `192.168.1.24` | IA Local | API de Transcripción de Voz Speech-to-Text CUDA |
| **130** | `searxng` | Alpine 3.24 | 2 | 256 MB | `local-lvm:4G` | `192.168.1.25` | Privacidad | Metabuscador Agregado sin Rastreo |
| **131** | `flowise` | Alpine 3.24 | 2 | 512 MB | `local-lvm:4G` | `192.168.1.26` | IA Local | Constructor Visual de Agentes y Flujos LLM |
| **132** | `netalertx` | Alpine 3.24 | 1 | 128 MB | `local-lvm:4G` | `192.168.1.27` | Seguridad | Detector de Intrusos en Red Wi-Fi / LAN |
| **133** | `rustdesk` | Alpine 3.24 | 1 | 128 MB | `local-lvm:2G` | `192.168.1.28` | Remoto | Servidor Retransmisor de Escritorio Remoto Rust |
| **134** | `audiobookshelf` | Alpine 3.24 | 2 | 256 MB | `local-lvm:4G` | `192.168.1.29` | Multimedia | Servidor de Audiolibros y Podcasts con Sincronización |
| **135** | `tubearchivist` | Alpine 3.24 | 2 | 512 MB | `local-lvm:8G` | `192.168.1.30` | Multimedia | Archivo y Reproducción Offline de Canales de YouTube |
| **136** | `kopia` | Alpine 3.24 | 1 | 128 MB | `local-lvm:4G` | `192.168.1.31` | Backup | Copias de Seguridad Cifradas con Deduplicación |
| **137** | `wgeasy` | Alpine 3.24 | 1 | 128 MB | `local-lvm:2G` | `192.168.1.32` | VPN | Portal Web Simple para WireGuard |
| **138** | `calibreweb` | Alpine 3.24 | 1 | 128 MB | `local-lvm:4G` | `192.168.1.33` | Multimedia | Biblioteca Digital de Libros Calibre |
| **140** | `codeserver` | Alpine 3.24 | 2 | 384 MB | `local-lvm:8G` | `192.168.1.40` | Desarrollo | Entorno Completo VS Code en Navegador Web |
| **141** | `pgadmin` | Alpine 3.24 | 1 | 192 MB | `local-lvm:4G` | `192.168.1.41` | Base Datos | Interfaz de Administración Visual PostgreSQL |
| **142** | `cyberchef` | Alpine 3.24 | 1 | 64 MB | `local-lvm:2G` | `192.168.1.42` | DFIR / Cripto | Navaja Suiza de Criptoanálisis y Decodificación |
| **143** | `drawio` | Alpine 3.24 | 1 | 96 MB | `local-lvm:2G` | `192.168.1.43` | Arquitectura | Editor de Diagramas Técnicos y Topologías de Red |
| **144** | `dozzle` | Alpine 3.24 | 1 | 48 MB | `local-lvm:2G` | `192.168.1.44` | Monitoreo | Visualizador en Tiempo Real de Logs de Contenedores |
| **145** | `kiwix` | Alpine 3.24 | 1 | 96 MB | `local-lvm:4G` | `192.168.1.45` | Conocimiento | Servidor Offline de Wikipedia, ArchWiki & Docs |
| **146** | `romm` | Alpine 3.24 | 2 | 192 MB | `local-lvm:8G` | `192.168.1.46` | Retrojuegos | Gestor de Colecciones de Videojuegos Retro & ROMs |
| **147** | `emulatorjs` | Alpine 3.24 | 1 | 96 MB | `local-lvm:4G` | `192.168.1.47` | Retrojuegos | Emulación de Videojuegos Retro vía WebAssembly |
| **149** | `pbs` | Alpine 3.24 | 2 | 512 MB | `local-lvm:2G` | `192.168.1.149` | Almacenamiento / Backup | Proxmox Backup Server (Deduplicación & Verificación de Snapshots) |
| **150** | `pdm` | Alpine 3.24 | 2 | 512 MB | `local-lvm:2G` | `192.168.1.150` | Gestión | Proxmox Datacenter Manager (Consola Centralizada Multi-Cluster) |
| **151** | `pmg` | Alpine 3.24 | 2 | 512 MB | `local-lvm:2G` | `192.168.1.151` | Seguridad / Correo | Proxmox Mail Gateway (Protección Antispam & ClamAV) |

### Catálogo Detallado de Contenedores LXC (Nodo 3 — Apple M1 ARM64 UTM)

| VMID | Nombre de Host | SO Base | vCPU | RAM Asignada | Pool Almacenamiento | IP Estática | Categoría | Servicio Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **100** | `it-tools` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.100` | Utilidades | IT-Tools Colección de Herramientas Web para Desarrolladores |
| **101** | `actualbudget` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.101` | Finanzas | Actual Budget Gestión Financiera Personal Local |
| **102** | `trilium` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.102` | Notas | Base de Conocimiento y Notas Jerárquicas Markdown |
| **103** | `changedetection` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.103` | Automatización | Monitoreo de Cambios en Páginas Web & Alertas |
| **104** | `scrutiny` | Debian 13 | 1 | 128 MB | `local:2G` | `192.168.64.104` | Monitoreo | Telemetría S.M.A.R.T. de Salud de Discos Duros |
| **105** | `uptimekuma` | Debian 13 | 1 | 128 MB | `local:2G` | `192.168.64.105` | Monitoreo | Monitoreo de Disponibilidad de Servicios & SLA |
| **106** | `vaultwarden` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.106` | Seguridad | Gestor de Contraseñas Cifrado Bitwarden |
| **107** | `monitoring` | Debian 13 | 2 | 384 MB | `local:2G` | `192.168.64.107` | Monitoreo | Prometheus TSDB & Cuadros de Mando Grafana |
| **108** | `authelia` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.108` | Seguridad | Portal de Autenticación 2FA & SSO (FIDO2) |
| **109** | `gitea` | Debian 13 | 2 | 160 MB | `local:2G` | `192.168.64.109` | Desarrollo | Forge Git Autoalojado & Revisión de Código |
| **110** | `woodpecker` | Alpine 3.24 | 2 | 192 MB | `local:2G` | `192.168.64.110` | CI/CD | Motor de Compilación Automatizada Woodpecker CI |
| **111** | `gatus` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.111` | Monitoreo | Panel Automatizado de Estado de Servicios en Go |
| **112** | `ntfy` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.112` | Alertas | Hub de Notificaciones Push Privadas en Móvil |
| **113** | `linkding` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.122` | Automatización | Gestor de Marcadores Web & Búsqueda Técnica |
| **114** | `stepca` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.114` | Seguridad | Autoridad PKI Interna & Automatización TLS ACME |
| **115** | `tailscale-arm` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.115` | VPN | Enrutador de Subred Tailscale (Segmento ARM64) |
| **116** | `beszel` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.116` | Monitoreo | Telemetría de Sistema en Alta Resolución (1s) |
| **117** | `pocketbase` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.117` | Backend | Backend Completo en 1 Solo Archivo (SQLite) |
| **118** | `homepage` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.118` | Dashboard | Tablero de Inicio Unificado para todo el Homelab |
| **119** | `speedtest` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.119` | Monitoreo | Telemetría Automatizada de Ancho de Banda y Jitter |
| **120** | `memos` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.120` | Notas | Notas Rápidas Markdown & Microblogging |
| **121** | `wallos` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.121` | Finanzas | Rastreador de Gastos y Suscripciones Recurrentes |
| **122** | `syncthing` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.122` | Storage | Sincronización Continua de Archivos P2P |
| **123** | `microbin` | Alpine 3.24 | 1 | 16 MB | `local:2G` | `192.168.64.123` | Seguridad | Pastebin Cifrado con Autodestrucción en Rust |
| **124** | `vikunja` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.124` | Tareas | Gestor de Proyectos y Tareas Kanban |
| **125** | `blackbox` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.125` | Monitoreo | Sondas Prometheus (ICMP / Puertos / Expiración SSL) |
| **126** | `yourspotify` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.126` | Estadísticas | Historial de Reproducción Privado & Estadísticas |
| **127** | `webcheck` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.127` | OSINT | Escáner OSINT de Seguridad y Análisis de Dominios |
| **128** | `opengist` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.128` | Desarrollo | Almacenamiento Privado de Fragmentos de Código |
| **129** | `flatnotes` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.129` | Notas | Editor Minimalista de Notas Markdown en Archivo |
| **130** | `bark` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.130` | Alertas | Retransmisor de Notificaciones Nativas Apple iOS |
| **131** | `shiori` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.131` | Storage | Archivado Limpio de Páginas Web en Texto Plano |
| **132** | `whoogle` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.132` | Privacidad | Proxy Privado de Búsqueda de Google sin Tracking |
| **133** | `flame` | Alpine 3.24 | 1 | 32 MB | `local:2G` | `192.168.64.133` | Dashboard | Página de Inicio Minimalista para Navegador |
| **134** | `dashy` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.134` | Dashboard | Tablero de Inicio Totalmente Personalizable |
| **135** | `shlink` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.135` | Productividad | Acortador de Enlaces con Métricas Geográficas |
| **136** | `pastefy` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.136` | Productividad | Pastebin Seguro y Elegante con Soporte Markdown |
| **137** | `pingvin` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.137` | Almacenamiento | Plataforma Privada de Compartición de Archivos |
| **138** | `rssbridge` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.138` | Feeds | Generador de Feeds RSS para Sitios sin Soporte Nativo |
| **139** | `playwright` | Alpine 3.24 | 2 | 192 MB | `local:2G` | `192.168.64.139` | Sonda | Worker Headless Browser para Renderizado Web |
| **140** | `uptimechk` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.140` | Monitoreo | Sonda Secundaria de Verificación de Disponibilidad |
| **141** | `dnsbench` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.141` | Red | Medición y Benchmarking de Latencia DNS |
| **142** | `excalidraw` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.142` | Productividad | Pizarra Virtual Colaborativa Excalidraw |
| **143** | `snagim` | Alpine 3.24 | 1 | 48 MB | `local:2G` | `192.168.64.143` | Medios | Servidor Rápido de Alojamiento de Capturas |
| **144** | `whoogletor` | Alpine 3.24 | 1 | 96 MB | `local:2G` | `192.168.64.144` | Privacidad | Búsqueda Whoogle Enrutada vía Circuito Tor |
| **145** | `heimdall` | Alpine 3.24 | 1 | 64 MB | `local:2G` | `192.168.64.145` | Dashboard | Tablero de Aplicaciones con Estado en Tiempo Real |
| **146** | `pbs` | Alpine 3.24 | 2 | 512 MB | `local:2G` | `192.168.64.146` | Almacenamiento / Backup | Proxmox Backup Server (Deduplicación & Verificación) |
| **147** | `pdm` | Alpine 3.24 | 2 | 512 MB | `local:2G` | `192.168.64.147` | Gestión | Proxmox Datacenter Manager (Orquestador Multi-Cluster) |
| **148** | `pmg` | Alpine 3.24 | 2 | 512 MB | `local:2G` | `192.168.64.148` | Seguridad / Correo | Proxmox Mail Gateway (Protección Antispam & ClamAV) |

### Machines Virtuelles QEMU / KVM & VirtIO Memory Ballooning

| VMID | Nom VM | Système d'Exploitation | vCPU | RAM Max | Balloon Min | Passthrough / Matériel | Rôle Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **200** | `opnsense` | Hardened FreeBSD 14 | 2 Coeurs | 2.048 Mo | **1.024 Mo** | VirtIO Net Multi-VLAN | Pare-feu Périmétrique, Suricata IDS/IPS, Rotation Clés WireGuard |
| **201** | `windows` | Windows Server 2025 | 2 Coeurs | 4.096 Mo | **2.048 Mo** | **GTX 1050 Ti PCIe Passthrough** | Active Directory (AD DS), GPO, DNS, Télémetrie Sysmon |
| **202** | `rhel` | RHEL 9.8 Enterprise | 2 Coeurs | 2.048 Mo | **1.024 Mo** | VirtIO SCSI Single IOThread | SELinux Enforcing, Podman Rootless, Services Entreprise |
| **203** | `freebsd` | FreeBSD 15.1-RELEASE | 2 Coeurs | 1.536 Mo | **768 Mo** | VirtIO SCSI Single | Stockage Natif OpenZFS, FreeBSD Jails & Laboratoire Réseau |
| **204** | `openbsd` | OpenBSD 7.9 Bastion | 2 Coeurs | 1.536 Mo | **768 Mo** | VirtIO SCSI Single | Bastion Sécurisé Jump Host, Filtre PF, pledge/unveil |
| **205** | `talos` | Talos Linux 1.7 | 2 Coeurs | 2.048 Mo | **1.024 Mo** | VirtIO Single + Cilium CNI | OS Immuable Minimaliste, API Déclarative gRPC, Kubernetes |
| **206** | `capev2` | Sandbox Win10 / Linux | 4 Coeurs | 4.096 Mo | **2.048 Mo** | Isolation Complète (Air-Gap) | Sandbox d'Analyse Malware Dynamique, Volatility & Cuckoo |

### Optimisation Mémoire Hôte: ZRAM / ZSWAP Fast RAM Compression

* **Algorithme**: `lz4` ultra-rapide avec overhead CPU < 1%.
* **Nœud 1 (x86_64) ZRAM**: `/dev/zram0` (3.8 Go RAM compressé swap, priorité 100, `vm.swappiness = 60`, `vm.vfs_cache_pressure = 50`).
* **Nœud 3 (ARM64) ZRAM**: `/dev/zram0` (1.9 Go RAM compressé swap, priorité 100, `vm.swappiness = 20`, `vm.vfs_cache_pressure = 50`).
* **Protection NVMe**: Les pages de mémoire swap sont compressées directement en RAM, éliminant l'usure des disques SSD NVMe.

### Sécurité Zero-Trust & Proving Ground Entreprise

1. **HashiCorp Vault / OpenBao**: Gestion centralisée des secrets sans fichiers `.env` locaux exposés.
2. **Module Kernel WireGuard sur OPNsense avec Rotation Automatique des Clés**: Rotation périodique des clés Curve25519 et PSK via Ansible/cron.
3. **mTLS (Mutual TLS) Inter-Services**: Authentification mutuelle par certificats clients entre proxies et backends critiques du VLAN 20.
4. **Canary Honeytokens & Fichiers Pièges**: Fichiers leurres (`passwords.csv`, `aws_keys.env`) en DMZ déclenchant des alertes Telegram/ntfy.
5. **RenovateBot GitOps On-Premise**: Mises à jour automatisées des conteneurs et modules Terraform via Pull Requests Gitea.

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

**Autor**: [@stefanutc1](https://github.com/stefanutc1)  
Distribuido bajo la **Licencia MIT**.

</div>
