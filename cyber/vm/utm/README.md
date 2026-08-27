# 🛡️ CyberLab UTM Virtual Machines (macOS Hypervisor)

Declarative UTM `.utm` virtual machine packages and hardware configurations for offensive security, malware analysis, and detection engineering on Apple Silicon & macOS.

---

## 📋 CyberLab UTM VM Matrix

| VM Name | Target OS | vCPUs | RAM | Architecture | Network Forwarding | Role / Function |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **Windows 10 Enterprise** | Windows 10 Enterprise | 2 | 4096 MB | `aarch64` / `x86_64` | `13389:3389` (RDP) | Victim Endpoint, EDR Telemetry, Sysmon Auditing |
| **Kali Linux Offensive** | Kali Rolling | 2 | 4096 MB | `aarch64` / `x86_64` | `2222:22` (SSH) | Adversary Emulation, Metasploit, Burp Suite, Nmap |

---

## 🔐 Access Standards & Secret Management

- **Windows 10 Enterprise:** `Administrator` (Configured via Local Security Policy / Vault)
- **Kali Linux Offensive:** `kali` (SSH Key Authorization)
- **Wazuh Manager & SIEM:** `admin` (Managed via `.env` / SOPS)
- **Grafana / Loki:** `admin` (Injected via Docker Secrets)

---

## 🚀 Launching VMs via UTM

\`\`\`bash
# Open Windows 10 in UTM
open "Windows 10.utm"

# Open Kali Linux in UTM
open "Kali Linux.utm"
\`\`\`
