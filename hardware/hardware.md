# Hardware

This document describes the physical host(s) underpinning this homelab's services layer — specs, virtualization approach, and how the available resources map to running workloads. It exists so that capacity questions ("can this host take one more service?") and recovery questions ("what am I rebuilding, exactly?") have a single place to be answered.

This file describes hardware and host-level virtualization only. Service definitions live under `/services`; deployment automation lives in the Ansible inventory. Network topology (VLANs, firewall, routing) is out of scope here and is tracked in the `opnsense` service folder.

---

## Host: `proxmox` (Node 1 — Primary Hypervisor)

### Hardware

| Component | Spec |
| --- | --- |
| CPU | Intel Core i3-10100F — 4 cores / 8 threads @ 4.30 GHz |
| GPU | NVIDIA GeForce GTX 1050 Ti — 4 GB VRAM |
| RAM | 12 GB DDR4-2133 (12,288 MB) |
| Storage | 512 GB SSD |
| PSU | Coldex 350W Pure Sine Wave |

**Capacity notes:**

* 12 GB of RAM provides expanded headroom on this host, allowing concurrent operation of enterprise VMs (Windows Server 2025 Datacenter, Windows Server 2019 Licență, Metasploitable Licență, RHEL 9.8, OpenStack, Metasploitable 2, T-Pot Honeypot, Security Onion, REMnux, OPNsense) alongside native Wazuh 4.14 SIEM/XDR and GPU-accelerated ML workloads (Ollama, Faster-Whisper) with active VirtIO ballooning and ZRAM swap compression.
* The GTX 1050 Ti's 4 GB VRAM limits model size/batch size for ML experimentation and is shared with Frigate if GPU-accelerated detection is enabled for the NVR — these two workloads compete for the same VRAM budget and shouldn't be assumed to coexist at full load without checking.
* 512 GB SSD is the single storage tier — there is currently no separate fast/slow tier, so backup jobs, Frigate's recording retention, and VM/container disk growth all draw from the same pool. Worth tracking usage per-workload if any one of them starts growing unpredictably (Frigate recordings are the most likely culprit).

### Software & Infrastructure

| Layer | Detail |
| --- | --- |
| Hypervisor OS | Proxmox VE 9.2 (Debian 13 Trixie base) |
| Kernel | Linux 7.0 version pve |
| Native Host Security | Wazuh Manager 4.14 SIEM / XDR (Ports 1514, 1515, 55000) |
| Networking | Tailscale (mesh VPN) |
| Virtualization | LXC containers & QEMU VMs |

### Usage Profile

This host currently serves ten primary virtualization roles:

1. **Perimeter Firewall & NGFW** — OPNsense (VM 200) with 4 GB RAM (VirtIO ballooning: 2–4 GB) and VirtIO multi-VLAN networking for boundary defense, Zenarmor L7, CrowdSec IPS, and Unbound DNS.
2. **Enterprise Identity & Active Directory** — Windows Server 2025 Datacenter (VM 201) with 8 GB RAM (VirtIO ballooning: 4–8 GB), GTX 1050 Ti PCIe passthrough, and domain controller services.
3. **Enterprise Linux & Containerization** — Red Hat Enterprise Linux 9.8 (VM 202) with 2 GB RAM (VirtIO ballooning: 1–2 GB), SELinux Enforcing, and rootless Podman quadlets.
4. **Enterprise Private Cloud Virtualization** — OpenStack 2024.1 Caracal (VM 203) with 4 GB RAM (VirtIO ballooning: 2–4 GB) and 32 GB NVMe for IaaS compute (Nova), SDN networking (Neutron), and Horizon Web Dashboard.
5. **Cybersecurity Vulnerability & Exploit Lab** — Metasploitable 2 (VM 204) with 512 MB RAM and 8 GB NVMe for penetration testing, red teaming with Metasploit Framework, and Suricata/Wazuh detection signature calibration.
6. **Multi-Honeypot Threat Intelligence & Telemetry** — T-Pot 24.04 (VM 205) with 8 GB RAM (VirtIO ballooning: 4–8 GB) and 60 GB NVMe for decoy sensor emulation (Cowrie, Dionaea, Honeytrap, Elastic, Kibana, Suricata).
7. **Enterprise SIEM, HIDS & SOC Platform** — Security Onion 3.2 (VM 206) with 8 GB RAM (VirtIO ballooning: 4–8 GB) and 50 GB NVMe for Zeek, Suricata, Elastic, and Kibana SOC alerting.
8. **Malware Analysis & Reverse Engineering Toolkit** — REMnux v7 Noble (VM 207) with 4 GB RAM (VirtIO ballooning: 2–4 GB) and 40 GB NVMe for dynamic malware analysis, memory forensics (Volatility), and Ghidra reverse engineering.
9. **Bachelor's Thesis (Lucrare de Licență) · Active Directory & Security Lab** — Windows Server 2019 Standard (VM 300) with 8 GB RAM (VirtIO ballooning: 4–8 GB) and 64 GB NVMe with Massgrave KMS/GVLK licensing integration for domain trust, GPO testing, and academic thesis research.
10. **Bachelor's Thesis (Lucrare de Licență) · Cybersecurity Pentest Proving Ground** — Metasploitable Linux Target (VM 301) with 2 GB RAM (VirtIO ballooning: 1–2 GB) and 20 GB NVMe for dedicated offensive testing, red teaming, and Wazuh/Suricata detection rule calibration.

---

## Host: `openmediavault` (Node 2 — Storage NAS)

### Hardware

| Component | Spec |
| --- | --- |
| Physical Machine | ASUS X451MA Laptop |
| CPU | Intel Celeron N2830 — 2 cores / 2 threads @ 2.16 GHz (burst up to 2.41 GHz) |
| GPU | Intel HD Graphics (Bay Trail) |
| RAM | 2 GB DDR3 |
| Storage | 500 GB HDD |

**Capacity notes:**

* 2 GB of RAM is a tight constraint, restricting this host strictly to lightweight storage and file-sharing tasks without heavy background applications or memory-intensive services.
* The Intel Celeron N2830 processor and single 500 GB HDD are optimized for low-power, centralized file storage and secondary backups rather than high-throughput or concurrent multi-user processing.

### Software & Infrastructure

| Layer | Detail |
| --- | --- |
| OS | OpenMediaVault (OMV) |
| File Sharing / Services | SMB / NFS |

### Usage Profile

This host serves as the dedicated network-attached storage (NAS) and secondary backup destination:

1. **Centralized Storage & File Sharing** — Providing local network file shares (SMB/NFS) for household devices and workflows.
2. **Secondary Backup Destination** — Acting as an off-host repository for homelab data backups, separating storage from the main Proxmox execution environment.

---

## Host: `k8s-node-04` (Node 4 — Kubernetes Worker Node)

### Hardware

| Component | Spec |
| --- | --- |
| Physical Machine | Custom ATX Compute Chassis |
| Architecture | x86_64 (`amd64`) |
| CPU | AMD Athlon II X2 220 — 2 Cores / 2 Threads @ 2.80 GHz (Regor / AM3) |
| GPU | NVIDIA GeForce GTS 250 — 1 GB GDDR3 (55nm / 256-bit bus) |
| RAM | 4 GB DDR3 |
| Storage | 80 GB HDD (SATA II / 7200 RPM) |
| PSU | ATX Power Supply Unit |

**Capacity notes:**

* **Memory Ceiling**: 4 GB DDR3 RAM is tuned strictly for lightweight container runtime execution (`containerd`) and `k3s-agent` background processing. Memory limits are enforced per-pod using resource requests and limits in Kubernetes manifests.
* **Compute Allocation**: The dual-core AMD Athlon II X2 220 processor handles asynchronous batch processing, CI/CD runner jobs, and stateless microservices without choking the primary hypervisor.
* **Storage Footprint**: The 80 GB SATA HDD serves as the local OS root partition and ephemeral container image cache, with persistent state stored remotely over NFS on OpenMediaVault NAS (Node 2).

### Software & Infrastructure

| Layer | Detail |
| --- | --- |
| Operating System | Alpine Linux / Debian Base |
| Kubernetes Distribution | k3s (Lightweight Kubernetes Worker Agent) |
| Container Runtime | containerd (CRI) |
| Networking | Flannel CNI / Kube-VIP / Tailscale mesh VPN node |
| Node Role | Kubernetes Worker / General Compute Node |

### Usage Profile

This host serves as the dedicated bare-metal Kubernetes worker node:

1. **Kubernetes Cluster Worker (`k3s-agent`)** — Scheduling lightweight containerized microservices, scheduled batch jobs, and background workers.
2. **Stateless Compute Offloading** — Offloading non-critical application workloads and worker queues from the primary Proxmox hypervisor.
3. **Multi-Node Cluster Resilience** — Providing physical node diversity across the homelab cluster topology.

---

## Adding a New Host

When a new host joins the homelab, duplicate the `## Host: <name>` section above rather than merging specs into one table — each host gets its own hardware, software, and usage profile block. This keeps per-host capacity reasoning legible as the infrastructure grows, and each section should stay traceable to its corresponding `host_vars/<hostname>.yml` entry in the Ansible inventory (configured via Ansible inventory and Terraform).
