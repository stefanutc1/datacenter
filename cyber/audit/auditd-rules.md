# File Integrity Monitoring (FIM) Policies

To monitor modifications made to critical system files, add the following rules to `/etc/audit/rules.d/audit.rules` on the monitored nodes:

```text
# Monitor user and group account modifications
-w /etc/passwd -p wa -k identity_changes
-w /etc/group -p wa -k identity_changes
-w /etc/shadow -p wa -k identity_changes
-w /etc/sudoers -p wa -k privilege_escalation

# Monitor network configuration modifications
-w /etc/hosts -p wa -k network_modifications
-w /etc/resolv.conf -p wa -k network_modifications

# Monitor execution of critical administrative commands
-a always,exit -F arch=b64 -S execve -F euid=0 -k root_commands
