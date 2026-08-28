# Hardening & CIS Compliance

## Ansible Baseline Roles

### 1. `roles/common`
- Synchronizes NTP clocks via Chrony.
- Enforces strict kernel sysctl security parameters:
  - `fs.protected_hardlinks = 1`
  - `fs.protected_symlinks = 1`
  - `kernel.randomize_va_space = 2` (ASLR)
  - `net.ipv4.conf.all.accept_redirects = 0`

### 2. `roles/hardening`
- Moves SSH listener to port `2222`.
- Enforces Ed25519-only public key authentication (`PasswordAuthentication no`).
- Restricts SSH ciphers to `chacha20-poly1305@openssh.com,aes256-gcm@openssh.com`.
- Configures UFW with a default `DROP` policy on incoming connections.
- Provisions Fail2ban jails with aggressive ban escalation timers.

### 3. `roles/auditd_fim`
- Deploys CIS Ubuntu 24.04 Auditd rules.
- Monitors critical filesystem paths: `/etc/passwd`, `/etc/shadow`, `/etc/sudoers`, `/bin`, `/sbin`.
- Logs all privilege escalation attempts (`uid != euid`) and kernel module loading syscalls (`init_module`, `finit_module`, `delete_module`).
