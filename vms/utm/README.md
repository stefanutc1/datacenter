# 🍏 Apple Silicon & macOS UTM Virtual Machines

This module contains declarative UTM `.utm` virtual machine packages and hardware configurations for local edge virtualization on macOS using Apple's Hypervisor.framework and QEMU.

---

## 📋 Local UTM Virtual Machine Matrix

| VM Name | Guest OS | vCPUs | RAM | Architecture | Network Mode | Exposed Ports | Primary Role |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| **Windows 10 Enterprise** | Windows 10 x64 / ARM64 | 2 | 4096 MB | `aarch64` / `x86_64` | Shared NAT | `13389` (RDP) | Endpoint Simulation, Malware Sandbox |
| **Kali Linux Offensive** | Kali Linux 2024.x | 2 | 4096 MB | `aarch64` / `x86_64` | Shared NAT | `2222` (SSH) | Red Team, Penetration Testing, Exploitation |

---

## 🔑 Default Credentials

- **Windows 10:** `Stefanut` / `Stefanut005` (or `Administrator` / `Stefanut005`)
- **Kali Linux:** `Stefanut` / `Stefanut005` (or default `kali` / `kali`)

---

## 🚀 Quick Launch Instructions

Launch directly into UTM on macOS:

\`\`\`bash
# Open Windows 10 in UTM
open "/Users/s3nnnzzzatyeeee/Documents/UTM/Windows 10.utm"

# Open Kali Linux in UTM
open "/Users/s3nnnzzzatyeeee/Documents/UTM/Kali Linux.utm"
\`\`\`
