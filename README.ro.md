<div align="center">

# Homelab — Ghid Tehnic de Arhitectură & Infrastructură

**[ Read in English (README.md) ](README.md)**

[![CI Validation](https://github.com/stefanutc1/homelab/actions/workflows/ci.yml/badge.svg)](https://github.com/stefanutc1/homelab/actions/workflows/ci.yml)
[![CD Deployment](https://github.com/stefanutc1/homelab/actions/workflows/cd.yml/badge.svg)](https://github.com/stefanutc1/homelab/actions/workflows/cd.yml)
[![Infrastructure](https://img.shields.io/badge/Infrastructur%C4%83-Proxmox%20%7C%20OMV%20%7C%20Apple%20Silicon-blue?style=flat&logo=proxmox)](https://github.com/stefanutc1/homelab)
[![Securitate](https://img.shields.io/badge/Securitate-Wazuh%20%7C%20Suricata%20%7C%20T--Pot-emerald?style=flat&logo=shield)](https://github.com/stefanutc1/homelab/tree/main/cyber)
[![Licență](https://img.shields.io/badge/Licen%C8%9B%C4%83-MIT-gray?style=flat)](LICENSE)

</div>

Monorepo declarativ de infrastructură și plan de control automatizat. Integrează compute bare-metal pe Apple Silicon ARM64, virtualizare Proxmox VE pe Intel x86_64, stocare OpenMediaVault ZFS, segmentare firewall OPNsense, poligon de securitate cibernetică (SOC/SIEM/DFIR/T-Pot), rulare locală de modele LLM prin Ollama pe GPU NVIDIA GTX 1050 Ti și motorul de orchestrare autonom **ELO Control Plane**.

---

## 1. Structura Flotei Hardware Fizice (4 Noduri)

| Nod | Hardware / Șasiu | CPU / Arhitectură | GPU / Accelerator | RAM | Stocare | Rol Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`proxmox` (Nod 1)** | Custom Desktop PC | Intel Core i3-10100F (4C/8T @ 4.30 GHz) | NVIDIA GeForce GTX 1050 Ti (4GB) | 8 GB DDR4 | 512 GB SSD | Hypervisor principal: Windows Server 2025 AD, OPNsense, Ollama GPU, Servicii Core |
| **`openmediavault` (Nod 2)** | Laptop ASUS X451MA | Intel Celeron N2830 (2C/2T @ 2.16 GHz) | Intel HD Graphics | 2 GB DDR3 | 500 GB HDD | NAS centralizat SMB/NFS, backup Proxmox vzdump, arhivă Wikipedia offline (Kiwix) |
| **`proxmox2` (Nod 3)** | Apple MacBook Air M1 (2020) | Apple M1 (8 Nuclee: 4P + 4E) / NPU 16-Core | Apple Metal GPU | 8 GB Unified (4GB VM) | Apple APFS NVMe | Hypervisor secundar ARM64 (UTM), telemetrie Grafana/Prometheus/Tempo, Gitea, CI/CD, ELO |
| **`k8s-node-04` (Nod 4)** | Custom ATX Chassis | AMD Athlon II X2 220 (2C/2T @ 2.80 GHz) | NVIDIA GeForce GTS 250 (1GB) | 4 GB DDR3 | 80 GB HDD (NFS) | Worker Kubernetes (Talos Linux / k3s-agent), joburi batch, senzor eBPF Tetragon |

---

## 2. Segmentare de Rețea & Matrice VLAN

* **VLAN 10 (Management & Storage)**: `192.168.1.0/24` — Interfețe Proxmox, switch-uri gestionate, OMV NAS, IPMI.
* **VLAN 20 (Servicii Core & Producție)**: `192.168.1.0/24` & `192.168.64.0/24` — NPM Ingress, Vaultwarden, Immich, Nextcloud, Home Assistant, Gitea, Ollama.
* **VLAN 30 (CyberLab & Sandboxes)**: `192.168.30.0/24` — Wazuh SIEM/XDR, Suricata, Atomic Red Team, CAPEv2 / Cuckoo Sandbox (Win10 + INetSim).
* **VLAN 40 (DMZ Honeynet Deception)**: `192.168.40.0/24` — Cluster T-Pot (Cowrie SSH/Telnet, Dionaea, RDP honeypot) cu raportare automată AbuseIPDB.
* **VLAN 50 (IoT & Senzori Edge)**: `192.168.50.0/24` — Radare mmWave ESP32, relee de irigație, gateway Zigbee.

---

## 3. Tehnologii & Instrumente de Securitate Cibernetică

* **Sisteme de Operare & AD**: Windows Server 2025 Datacenter, Active Directory (AD DS), Group Policy (GPO), Talos Linux, NixOS, Debian, Alpine.
* **Rețea & Captură Pachete**: TCP/IP, Wireshark, tcpdump, VLAN 802.1Q, WireGuard VPN, OPNsense Firewall.
* **SIEM, EDR & Detecție**: Wazuh Manager 4.8 (SIEM/XDR), Suricata IDS/IPS, Snort, Sysmon (configurație SwiftOnSecurity), CrowdSec, Auditd FIM, Cilium Tetragon eBPF, Falco.
* **Deception & Honeypots**: T-Pot, Cowrie, Dionaea, RDP Honeypot, Honeytrap.
* **Testare & Emulare Adversar**: Atomic Red Team (MITRE ATT&CK), Nmap, Nessus, OpenVAS, Burp Suite, BloodHound.
* **Threat Intel & Reguli**: Reguli Sigma, Reguli YARA, MISP Threat Sharing cu export automat în OPNsense, CyberChef.
* **DFIR & Analiză Malware**: CAPEv2, Cuckoo Sandbox, Volatility (triage memorie), Autopsy (forensics pe disc), Ghidra, IDA Pro, x64dbg, INetSim.
* **Automatizare SecOps**: PowerShell Core, Python 3.12, Git, Ansible, Woodpecker CI, Shuffle/n8n SOAR.

---

## 4. Infrastructură ca și Cod (Terraform & Proxmox)

Toate containerele LXC și mașinile virtuale sunt definite declarativ în folderul `terraform/`:

```bash
cd terraform/proxmox
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

Module incluse:
* `modules/proxmox_lxc`: Alocare automată CPU, memorie RAM, pool ZFS, tagging VLAN și passthrough PCIe GPU NVIDIA.
* `modules/proxmox_vm`: Provizionare VM-uri cu QEMU agent, Cloud-Init, discuri VirtIO SCSI și interfețe de rețea multi-VLAN.

---

## 5. Observabilitate & Stack LGTM + Tracing

* **Metrici**: Prometheus TSDB + `node_exporter` + `postgres_exporter` + `redis_exporter`.
* **Loguri**: Grafana Loki alimentat prin Vector și Fluent-bit.
* **Tracing Distribuit**: Grafana Tempo primind span-uri OpenTelemetry (OTLP gRPC :4317 / HTTP :4318).
* **Dashboard-uri**: Grafana centralizat corelând metricile hardware cu logurile de securitate Wazuh și urmele de latență Tempo.
* **eBPF Runtime Security**: Cilium Tetragon & Falco monitorizând apelurile de sistem kernel (`sys_execve`, `sys_openat`).

---

## 6. Inteligență Artificială Locală & Knowledge Base Offline

* **Ollama pe GPU Dedicat (Node 1)**: Rulare locală a modelelor `Qwen2.5-Coder-1.5B/3B`, `Llama-3.2-3B` și `DeepSeek-R1-Distill-Qwen-1.5B` pe placa video NVIDIA GeForce GTX 1050 Ti (4GB VRAM).
* **Wikipedia Self-Hosted (Node 2)**: Arhivă completă offline în format ZIM (Wikipedia, Wiktionary, StackOverflow) servită prin Kiwix la portul `:8085`.

---

## 7. Ingineria Haosului & Recuperare în caz de Dezastru (DR)

* **Testare DR Automatizată (`scripts/disaster-recovery/dr_vzdump_restore.sh`)**: Script ce descarcă cel mai recent backup vzdump, îl restaurează într-o mașină virtuală izolată în VLAN 99, execută verificări de sănătate (HTTP 200 / integritate DB) și o distruge automat.
* **Simulator Chaos (`scripts/chaos/chaos_runner.sh`)**: Injectare de consum 100% CPU (`stress-ng`), presiune pe RAM, latență de rețea și pachete pierdute (`tc qdisc netem`).

---

## 8. Web App & Digital Twin Interactiv

Aplicația web este construită în Angular 20 Standalone cu TypeScript, Tailwind CSS (paletă Charcoal Obsidian & Emerald), comutator bilingv RO/EN și vizualizare spațială 3D a topologiei homelab-ului:

* **Site Live**: [https://stefanutc1.github.io/homelab/](https://stefanutc1.github.io/homelab/)
* **Cod Sursă Frontend**: `web/`
