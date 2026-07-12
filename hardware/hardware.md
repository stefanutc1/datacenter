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
| RAM | 8 GB DDR4 |
| Storage | 512 GB SSD |
| PSU | Coldex 350W Pure Sine Wave |

**Capacity notes:**

* 8 GB of RAM is the primary constraint on this host. It sets a hard ceiling on how many concurrent LXC containers/VMs are practical, particularly with an ML workload (PyTorch/CUDA) in the mix — memory headroom, not CPU, is the first thing to check before adding a new service here.
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

This host currently serves four primary roles:

1. **Development environment** — Debian + XFCE, used as a general-purpose dev workspace.
2. **Machine learning experimentation** — CUDA/PyTorch, GPU-passthrough dependent on the GTX 1050 Ti above.
3. **Backup Server (NAS)** — backup target for this host's own VMs/containers.
4. **Home surveillance** — Frigate NVR, GPU acceleration shared with the ML role where applicable.

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
3. **Cluster Staging & Development** — Serving as a non-disruptive sandbox for testing Proxmox VE updates, automation playbooks, and multi-node cluster topologies.

---

## Adding a New Host

When a new host joins the homelab, duplicate the `## Host: <name>` section above rather than merging specs into one table — each host gets its own hardware, software, and usage profile block. This keeps per-host capacity reasoning legible as the infrastructure grows, and each section should stay traceable to its corresponding `host_vars/<hostname>.yml` entry in the Ansible inventory (see `CONTRIBUTING.md`, §5.1).
