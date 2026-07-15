# Hardware

This document describes the physical host(s) underpinning this Kubernetes's services layer — specs, virtualization approach, and how the available resources map to running workloads. It exists so that capacity questions ("can this host take one more service?") and recovery questions ("what am I rebuilding, exactly?") have a single place to be answered.

## This file describes hardware and host-level virtualization only.

## Host: `kubernetes1`

### Hardware

| Component | Spec |
| --- | --- |
| CPU | AMD Athlon X2 220 — 2 cores / 2 threads @ 2.80 GHz |
| GPU | NVIDIA GeForce GTS 250 — 1 GB VRAM |
| RAM | 4 GB DDR3 |
| Storage | 80 GB HDD |

**Capacity notes:**

* 4 GB of RAM is the primary constraint on this node. It strictly limits the scale and number of pods that can be scheduled here, requiring a lightweight container runtime and OS layer.
* The AMD Athlon X2 processor and 80 GB HDD storage tier provide limited throughput and IOPS, making this node suitable strictly for lightweight worker tasks, testing, or edge components rather than heavy databases or storage-intensive workloads.

### Software & Infrastructure

| Layer | Detail |
| --- | --- |
| OS | Alpine Linux |
| Orchestration | k0s (Kubernetes) |
| Networking | Tailscale (mesh VPN) / Container Network Interface (CNI) |

**Notes:**

* Alpine Linux provides a minimal, resource-efficient base OS footprint to preserve as much of the 4 GB RAM budget as possible for Kubernetes workloads.
* k0s manages the lightweight Kubernetes worker node environment, linking this physical machine directly to the repository's Kubernetes track.

### Usage Profile

This host serves as a dedicated Kubernetes worker node:

1. **Lightweight Kubernetes Workloads** — Running non-critical pods, testing deployments, and serving as an experimental edge worker within the repository's Kubernetes track.

---

## Adding a New Host

When a new host joins the homelab, duplicate the `## Host: <name>` section above rather than merging specs into one table — each host gets its own hardware, software, and usage profile block. This keeps per-host capacity reasoning legible as the infrastructure grows past a single machine, and each section should stay traceable to its corresponding `host_vars/<hostname>.yml` entry in the Ansible inventory (see `CONTRIBUTING.md`, §5.1).
