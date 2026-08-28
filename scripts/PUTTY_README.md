# 📟 PuTTY Admin Toolkit (Perl & Ruby)

> **Production-ready suite of terminal administration scripts, live log monitors, SSH helpers, and session converters crafted for Unix/Linux sysadmins connecting via PuTTY and OpenSSH.**

![Perl](https://img.shields.io/badge/Perl-5.18%2B-39457E?style=flat-square&logo=perl&logoColor=white)
![Ruby](https://img.shields.io/badge/Ruby-2.7%20%7C%203.x-CC342D?style=flat-square&logo=ruby&logoColor=white)
![SSH](https://img.shields.io/badge/Protocol-OpenSSH%20%2F%20PuTTY-000000?style=flat-square&logo=gnubash&logoColor=white)
![Release](https://img.shields.io/badge/Release-v1.0.0-2E7D32?style=flat-square&logo=github&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-1D3557?style=flat-square&logo=gnu&logoColor=white)

---

## 📖 Overview

The **PuTTY Admin Toolkit** bridges the gap between Windows PuTTY session management and Unix/Linux command-line workflows. Whether managing hundreds of remote servers, establishing multi-hop SSH tunnels, monitoring real-time network traffic sockets, or synchronizing terminal ANSI palettes across workstations, this toolkit provides lightweight, dependency-free automation.

---

## 🛠️ Tool Inventory

### 🐪 Perl Administration Tools (`perl/`)

| Script | Purpose & Capabilities |
| :--- | :--- |
| **[`putty_session_mgr.pl`](./perl/putty_session_mgr.pl)** | Parses Windows Registry exports (`.reg`) of PuTTY sessions and converts them into native OpenSSH `~/.ssh/config` blocks. |
| **[`batch_ssh_exec.pl`](./perl/batch_ssh_exec.pl)** | Concurrently executes commands across multiple remote servers defined in an INI inventory with aggregated stdout/stderr reporting. |
| **[`netstat_traffic_watch.pl`](./perl/netstat_traffic_watch.pl)** | Live terminal network watcher displaying active TCP/UDP sockets, connection states (`ESTABLISHED`, `TIME_WAIT`), and bandwidth metrics. |
| **[`ppk_key_helper.pl`](./perl/ppk_key_helper.pl)** | Inspects, validates, and extracts OpenSSH public/private keys from PuTTY `.ppk` files. |
| **[`sysmon_terminal.pl`](./perl/sysmon_terminal.pl)** | Real-time ASCII dashboard displaying CPU, RAM, load averages, disk I/O, and active user sessions. |
| **[`remote_tail_alert.pl`](./perl/remote_tail_alert.pl)** | Streams remote log files over SSH with customizable regex highlight filters and audible terminal bell notifications (`\a`). |

### 💎 Ruby Server Utilities (`ruby/`)

| Script | Purpose & Capabilities |
| :--- | :--- |
| **[`ssh_tunnel_helper.rb`](./ruby/ssh_tunnel_helper.rb)** | YAML-configured SSH port forwarding manager supporting local, remote, and dynamic SOCKS5 proxies with auto-reconnect. |
| **[`putty_session_sync.rb`](./ruby/putty_session_sync.rb)** | Bidirectional sync of PuTTY profiles, keybindings, and 24-bit TrueColor ANSI color palettes across Linux, macOS, and Windows. |
| **[`server_audit.rb`](./ruby/server_audit.rb)** | Automated security compliance and SSH hardening auditor (checks `sshd_config`, PAM configurations, and permissions). |
| **[`db_backup_rotator.rb`](./ruby/db_backup_rotator.rb)** | Automated backup rotation policy engine for MySQL/PostgreSQL dumps with SHA-256 integrity verification. |
| **[`log_analyzer.rb`](./ruby/log_analyzer.rb)** | Forensic log parser identifying authentication failure anomalies, IP geographic distributions, and HTTP error spikes. |
| **[`ansi_dashboard.rb`](./ruby/ansi_dashboard.rb)** | Interactive terminal dashboard presenting live server metrics and active session states. |

---

## 🚀 Quick Start & Usage Examples

### 1. Convert PuTTY Registry Sessions to OpenSSH Config
```bash
perl perl/putty_session_mgr.pl -f config/sessions.reg -e ~/.ssh/config
```

### 2. Execute Batch Commands Across Server Fleets
```bash
perl perl/batch_ssh_exec.pl --hosts config/hosts.example.ini --cmd "uptime && df -h /"
```

### 3. Monitor Network Traffic & Socket State
```bash
perl perl/netstat_traffic_watch.pl --interval 2 --filter ESTABLISHED
```

### 4. Manage SSH Tunnels via YAML
```bash
ruby ruby/ssh_tunnel_helper.rb --config config/tunnels.example.yaml --daemon
```

### 5. Run Server Security Audit
```bash
ruby ruby/server_audit.rb --strict --report audit_report.json
```

---

## 📂 Repository Structure

```
putty-admin-scripts/
├── config/                  # Example configuration files (INI, YAML, REG)
├── docs/                    # Detailed documentation & ANSI color palettes
│   ├── ansi_colors.md
│   ├── dev_notes.md
│   └── putty_troubleshooting.md
├── perl/                    # Perl automation scripts & shared libraries
├── ruby/                    # Ruby utilities & server auditing tools
├── tests/                   # Automated unit & integration tests
├── Makefile                 # Test runners and linting targets
├── Gemfile                  # Ruby dependencies
├── cpanfile                 # Perl module declarations
└── README.md                # Project documentation
```

---

## 🤝 Contributing

Contributions, bug reports, and pull requests are welcomed! Please adhere to standard Perl / Ruby coding standards.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
Copyright (c) 2026 stefannut.
