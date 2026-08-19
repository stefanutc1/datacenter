# 🖥️ Proxmox VE Virtual Machines (KVM)

This directory contains declarative specifications, automated provisioning scripts, and infrastructure-as-code configurations for all **KVM Virtual Machines** deployed on the Proxmox VE hypervisor cluster.

---

## 📋 Virtual Machine Inventory Matrix

| VMID | Name | Operating System | vCPUs | RAM (Alloc/Max) | Boot Disk | Primary Network | Primary Protocol | Role / Function |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| **200** | `opnsense` | FreeBSD 14.x / OPNsense | 2 | 1024 MB | 16 GB SSD | `vmbr1` (LAN) & `vmbr0` (WAN) | WebGUI (`:8443`), SSH | Core Gateway, NAT, HAProxy, WireGuard |
| **201** | `alpine-server` | Alpine Linux v3.21 Virt | 2 | 256 MB (128 MB Balloon) | 25 GB NVMe | `vmbr0` (Management) | SSH (`:22`), QEMU Guest Agent | Ultra-Lean Alpine Microservices |

---

## 🔐 Access Standards & Secrets Policy

All virtual machine templates and automated provisioning scripts enforce zero-plaintext credential standards:

- **Primary Administrator User:** `Stefanut` / `root` (Configured via SOPS / Cloud-Init)
- **Secret Management:** Vaultwarden & Encrypted Secrets Repository
- **Authorized SSH Keys:** `~/.ssh/id_ed25519.pub` (injected via Cloud-Init metadata)

---

## 📂 Subdirectories & Provisioning Modules

- **[`alpine-server/`](./alpine-server/)**: Ultra-lean Alpine Linux v3.21 Cloud-Init, OpenRC init scripts, and minimal RAM tuning.
- **[`opnsense/`](./opnsense/)**: Core virtual firewall gateway routing rules, VLAN trunking, and high-availability configuration.
