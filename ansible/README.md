# Homelab Configuration Management (Ansible)

Production-grade, idempotent configuration management for physical hypervisors, storage nodes, and LXC containers.

---

## 1. Responsibilities & Ownership

| Layer | Responsibility | Ownership |
| :--- | :--- | :--- |
| **Ansible (CM)** | **HOW it is configured** | OS baseline, packages, systemd services, users, SSH hardening, application prerequisites |
| **Terraform (IaC)** | **WHAT exists** | Virtual Machines, LXC Containers, vCPUs, RAM limits, ZFS disks, VLAN tags, IP assignments |
| **Operations (Automation)** | **WHAT happens next** | Health checks, self-healing, snapshot retention, housekeeping, drift monitoring |

---

## 2. Directory Structure

```
ansible/
├── ansible.cfg                # Pipelining, forks, callback plugins, fact caching
├── inventories/
│   └── homelab/
│       └── hosts.yml          # Structured hierarchical inventory (hypervisors, LXCs, VMs)
├── group_vars/
│   ├── all/                   # Global baseline variables & vault template
│   ├── hypervisors/           # Proxmox VE & ZFS tuning parameters
│   └── lxc_containers/        # Container limits & Docker daemon optimizations
├── roles/
│   ├── base/                  # Timezone, locale, package repositories, essential tools
│   ├── users/                 # Admin users, sudoers, wheel, authorized keys
│   ├── ssh/                   # Hardened sshd_config (Ed25519 only, no root password)
│   ├── system_hardening/      # Kernel sysctl parameters, umask, security limits
│   ├── docker/                # Docker CE & Compose V2 with daemon.json limits
│   ├── monitoring_node/       # Prometheus Node Exporter systemd unit & metrics
│   ├── ollama/                # Ollama GPU service on CT 110 with API verification
│   └── zfs_tuning/            # ZFS ARC memory ceilings and monthly scrub timers
├── playbooks/
│   ├── site.yml               # Master cluster configuration orchestration
│   └── maintenance.yml        # Rolling package updates, docker pruning, reboot checks
└── README.md
```

---

## 3. Operational Runbook

```bash
# 1. Syntax check
ansible-playbook --syntax-check playbooks/site.yml

# 2. Dry-Run / Idempotency check (No modifications)
ansible-playbook playbooks/site.yml --check --diff

# 3. Apply configuration
ansible-playbook playbooks/site.yml

# 4. Rolling maintenance (1 host at a time)
ansible-playbook playbooks/maintenance.yml
```

---

## 4. Idempotency & Safe Execution

* **Native Modules**: All roles use native Ansible modules (`ansible.builtin.template`, `ansible.builtin.service`, `ansible.posix.sysctl`) instead of raw shell scripts.
* **Handlers**: Services are restarted only when configuration files change.
* **Dry-Run**: Always run with `--check --diff` before applying changes in production.
