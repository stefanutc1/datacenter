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

* 12 GB of RAM provides expanded headroom on this host, allowing concurrent operation of enterprise VMs (Windows Server 2025 Datacenter, macOS Monterey, OpenIndiana, NetBSD, NixOS, DragonFly BSD, OpenStack, Metasploitable 2, T-Pot Honeypot, Haiku, Plan 9, ReactOS, Security Onion, REMnux, Redox OS, FreeDOS, RHEL, FreeBSD, OpenBSD, Talos) alongside GPU-accelerated ML workloads (Ollama, Faster-Whisper) with active VirtIO ballooning and ZRAM swap compression.
* The GTX 1050 Ti's 4 GB VRAM limits model size/batch size for ML experimentation and is shared with Frigate if GPU-accelerated detection is enabled for the NVR — these two workloads compete for the same VRAM budget and shouldn't be assumed to coexist at full load without checking.
* 512 GB SSD is the single storage tier — there is currently no separate fast/slow tier, so backup jobs, Frigate's recording retention, and VM/container disk growth all draw from the same pool. Worth tracking usage per-workload if any one of them starts growing unpredictably (Frigate recordings are the most likely culprit).

### Software & Infrastructure

| Layer | Detail |
| --- | --- |
| Hypervisor OS | Proxmox VE 9.2 |
| Kernel | Linux 7.0 version pve |
| Networking | Tailscale (mesh VPN) |
| Virtualization | LXC containers & QEMU VMs |

### Usage Profile

This host currently serves nineteen primary roles:

1. **Development environment** — Debian + XFCE, used as a general-purpose dev workspace.
2. **Machine learning experimentation** — CUDA/PyTorch, GPU-passthrough dependent on the GTX 1050 Ti above.
3. **Backup Server (NAS)** — backup target for this host's own VMs/containers.
4. **Home surveillance** — Frigate NVR, GPU acceleration shared with the ML role where applicable.
5. **Apple ecosystem & CI/CD testing** — macOS Monterey 12.7 (VM 206) booted via sanitized OpenCore EFI (`/mac/EFI`) with VirtIO memory ballooning (2–7 GB) and native Xcode build runner capabilities.
6. **Solaris & illumos ZFS reference lab** — OpenIndiana Hipster (VM 207) with 3 GB RAM (VirtIO ballooning: 1.5–3 GB) and 50 GB NVMe for reference OpenZFS storage pools, Solaris Zones, and DTrace dynamic tracing.
7. **Clean Unix & Rump kernel testing** — NetBSD 10.0 (VM 208) with 512 MB RAM (VirtIO ballooning: 256–512 MB) and 12 GB NVMe for componentized Rump kernel research and pkgsrc multi-platform packaging.
8. **Declarative Linux & reproducible infrastructure** — NixOS 24.11 Minimal (VM 209) with 1 GB RAM (VirtIO ballooning: 512 MB - 1 GB) and 22 GB NVMe for Nix Flakes hermetic pipelines and atomic rollback verification.
9. **HAMMER2 journaling storage & microkernel concurrency** — DragonFly BSD 6.4 (VM 210) with 1 GB RAM (VirtIO ballooning: 512 MB - 1 GB) and 15 GB NVMe for lockless multi-core scaling and HAMMER2 cluster filesystem research.
10. **Enterprise private cloud virtualization** — OpenStack 2024.1 Caracal (VM 211) with 4 GB RAM (VirtIO ballooning: 2–4 GB) and 32 GB NVMe for IaaS compute (Nova), SDN networking (Neutron), and Horizon Web Dashboard.
11. **Cybersecurity vulnerability & exploit lab** — Metasploitable 2 (VM 212) with 512 MB RAM and 8 GB NVMe for penetration testing, red teaming with Metasploit Framework, and Suricata/Wazuh detection signature calibration.
12. **Multi-honeypot threat intelligence & attack telemetry** — T-Pot 24.04 (VM 213) with 8 GB RAM (VirtIO ballooning: 4–8 GB) and 60 GB NVMe for decoy sensor emulation (Cowrie, Dionaea, Honeytrap, Elastic, Kibana, Suricata).
13. **BeOS-inspired modular C++ desktop architecture** — Haiku R1/beta5 (VM 214) with 2 GB RAM (VirtIO ballooning: 1–2 GB) and 20 GB NVMe for C++ object-oriented OS research, modular application kits, and OpenBFS indexed filesystem validation.
14. **Distributed computing & 9P filesystem research** — Plan 9 from Bell Labs / 9front (VM 215) with 512 MB RAM and 12 GB IDE for per-process namespaces, synthetic file interfaces, and 9P remote resource mapping.
15. **Windows NT clean-room binary compatibility** — ReactOS 0.4.16 (VM 216) with 1 GB RAM and 32 GB IDE for reverse-engineered NT kernel architecture, native Win32 subsystem testing, and PE executable execution without Microsoft licensing.
16. **Enterprise SIEM, HIDS & network security monitoring** — Security Onion 3.2 / Wazuh SIEM (VM 217) with 8 GB RAM (VirtIO ballooning: 4–8 GB) and 50 GB NVMe for Zeek, Suricata, Elastic, and Kibana SOC alerting.
17. **Malware analysis & reverse engineering toolkit** — REMnux v7 / Noble (VM 218) with 4 GB RAM (VirtIO ballooning: 2–4 GB) and 40 GB NVMe for dynamic malware analysis, memory forensics (Volatility), and Ghidra reverse engineering.
18. **Rust-based microkernel & memory safety architecture** — Redox OS 0.9.0 (VM 219) with 2 GB RAM (VirtIO ballooning: 1–2 GB) and 10 GB NVMe for RedoxFS, user-space drivers, and Minix/Plan 9-inspired design.
19. **Real-mode x86 Assembly & legacy computing lab** — FreeDOS 1.3 (VM 220) with 512 MB RAM (VirtIO ballooning: 256–512 MB) and 2 GB IDE for 16-bit real-mode x86 Assembly execution and legacy industrial system testing.

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

## Host: `proxmox2` (Node 3 — ARM64 Hypervisor on Apple Silicon)

### Hardware

| Component | Spec |
| --- | --- |
| Physical Machine | Apple MacBook Air (M1, 2020) |
| Architecture | ARM64 (`aarch64`) |
| CPU | Apple M1 — 8 Cores (4 Performance Firestorm + 4 Efficiency Icestorm) / 16-Core Neural Engine |
| Total Host RAM | 8 GB Unified Memory (LPDDR4X) |
| **Allocated VM RAM** | **4 GB RAM dedicated to Proxmox VE ARM64 instance** |
| Virtualization Hypervisor | **UTM** (QEMU 7+ with Apple `Hypervisor.framework` hardware acceleration) |
| Storage | High-speed Apple APFS NVMe SSD pool |

**Capacity notes:**

* **Memory Budget**: 4 GB of RAM is allocated to the virtualized Proxmox instance (leaving 4 GB for the macOS host system). This budget is ideal for lightweight ARM64 LXC micro-containers, low-footprint background runners, and DNS/automation services.
* **Compute & Power Efficiency**: The Apple M1 architecture delivers exceptional single-thread performance and energy efficiency (fanless design), allowing silent 24/7 background operation.
* **Virtualization Layer**: Runs Proxmox VE ARM64 nested inside UTM on macOS, providing a full PVE web interface and LXC container support on Apple Silicon.

### Software & Infrastructure

| Layer | Detail |
| --- | --- |
| Hypervisor OS | Proxmox VE on ARM (ARM64 Port) |
| Virtualization Engine | UTM / QEMU on macOS (Apple Silicon) |
| Host Virtualization Mode | Hypervisor.framework (Near-native ARM execution) |
| Networking | Bridged / Shared Network + Tailscale mesh VPN node |
| Guest Virtualization | ARM64 LXC Containers & QEMU aarch64 VMs |

### Usage Profile

This host serves as the dedicated ARM64 compute and secondary hypervisor node:

1. **ARM64 Workload Validation & Multi-Arch Builds** — Testing and building native ARM64 Docker images, Go/Rust binaries, and embedded firmware.
2. **Secondary High-Efficiency Hypervisor** — Hosting secondary redundant services (Pi-hole secondary DNS, healthcheck pingers, IoT webhooks) that stay online with minimal power draw.
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
