# 🛠️ Homelab Automation, DevOps & Low-Level Scripts

This directory provides automated multi-platform scripts (**Bash `.sh`**, **PowerShell `.ps1`**, and **x86-64 Assembly `.asm`**) for managing the Proxmox VE hypervisor, LXC containers, KVM virtual machines, networking, and low-level kernel diagnostics.

---

## 📋 Script Inventory & Matrix

| Script Name | Bash (`.sh`) | PowerShell (`.ps1`) | Assembly (`.asm`) | Purpose / Description |
| :--- | :---: | :---: | :---: | :--- |
| **Emergency Shutdown** | [`emergency-shutdown.sh`](./emergency-shutdown.sh) | [`emergency-shutdown.ps1`](./emergency-shutdown.ps1) | — | 4-Phase cascading shutdown for 10h+ power outages with NFS unmounting |
| **Cold Boot Sequence** | [`cold-boot-sequence.sh`](./cold-boot-sequence.sh) | [`cold-boot-sequence.ps1`](./cold-boot-sequence.ps1) | — | Staged power-on sequence ensuring router $\rightarrow$ DNS $\rightarrow$ DB $\rightarrow$ App order |
| **RAM Optimization** | [`optimize-proxmox-ram.sh`](./optimize-proxmox-ram.sh) | [`optimize-proxmox-ram.ps1`](./optimize-proxmox-ram.ps1) | — | Aggressive container RAM tuning, KSM page deduplication & kernel sysctl |
| **Post-Install Hardening** | [`proxmox-post-install.sh`](./proxmox-post-install.sh) | [`proxmox-post-install.ps1`](./proxmox-post-install.ps1) | — | No-subscription repos, TCP BBR, Intel IOMMU, journal limits & fstrim |
| **Subscription Nag Remover**| [`pve-remove-nag.sh`](./pve-remove-nag.sh) | [`pve-remove-nag.ps1`](./pve-remove-nag.ps1) | — | Patches Proxmox Web GUI to remove "No valid subscription" pop-up nag |
| **Fleet Healthcheck** | [`healthcheck-fleet.sh`](./healthcheck-fleet.sh) | [`healthcheck-fleet.ps1`](./healthcheck-fleet.ps1) | — | Audits all 24 LXCs, 3 VMs, thermal sensors & OpenMediaVault NAS status |
| **Configuration Backup** | [`backup-configs.sh`](./backup-configs.sh) | [`backup-configs.ps1`](./backup-configs.ps1) | — | Archives PVE `.conf` files, storage, networking and generates `.tar.gz` |
| **Subnet Network Scan** | [`network-scan.sh`](./network-scan.sh) | [`network-scan.ps1`](./network-scan.ps1) | — | Fast parallel ARP / ICMP subnet discovery for `192.168.1.0/24` |
| **Kernel Sysinfo** | — | — | [`sysinfo.asm`](./sysinfo.asm) | Queries Linux kernel `sys_sysinfo` (syscall 99) without libc |
| **CPUID & Virtualization** | — | — | [`cpuid.asm`](./cpuid.asm) | Direct x86 CPUID query for CPU vendor & hypervisor presence bit |
| **Emergency Kernel Reboot**| — | — | [`reboot.asm`](./reboot.asm) | Direct Linux `sys_reboot` (syscall 169) using kernel magic numbers |
| **Vectorized Memzero** | — | — | [`memzero.asm`](./memzero.asm) | High-speed 64-bit buffer zeroization and cache clearance in assembly |
| **Storage Status & Log** | — | — | [`diskcheck.asm`](./diskcheck.asm), [`log.asm`](./log.asm), [`hexdump.asm`](./hexdump.asm) | Micro low-level diagnostics and file manipulation utilities |

---

## 🚀 Execution Guide

### Bash Scripts (Linux / Proxmox VE):
```bash
chmod +x scripts/*.sh
./scripts/healthcheck-fleet.sh
./scripts/optimize-proxmox-ram.sh
```

### PowerShell Scripts (Windows / macOS / Linux with pwsh):
```powershell
./scripts/healthcheck-fleet.ps1 -PveHost "192.168.1.132"
./scripts/backup-configs.ps1 -PveHost "192.168.1.132" -LocalBackupDir "./backups"
```

### Compiling & Running Assembly Scripts (NASM on Linux x86_64):
```bash
nasm -f elf64 scripts/sysinfo.asm -o sysinfo.o
ld sysinfo.o -o sysinfo
./sysinfo

nasm -f elf64 scripts/cpuid.asm -o cpuid.o
ld cpuid.o -o cpuid
./cpuid
```
