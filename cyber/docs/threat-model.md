# CyberLab Threat Modeling & MITRE ATT&CK Mapping

This document details the threat modeling framework utilized across CyberLab.

## Threat Actors & Scenarios

1. **Initial Access via Exposed Services (T1190)**: Exploitation of vulnerable web components hosted on DMZ nodes.
2. **Credential Brute Force (T1110)**: Automated password guessing against SSH or Web portals. Mitigated via Fail2ban, key-only SSH, and port relocation (2222).
3. **Privilege Escalation (T1548)**: Exploitation of setuid binaries or sudo misconfigurations. Monitored via real-time Auditd syscall triggers (`-S execve -C uid!=euid`).
4. **Kernel Persistence (T1547.006)**: Unauthorized kernel module insertion. Monitored via Auditd (`-S init_module,finit_module,delete_module`).
5. **Lateral Movement (T1021)**: Pivoting between virtual nodes. Restricted by strict host-level UFW egress and ingress filtering.
