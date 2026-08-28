# CIS Ubuntu Linux 24.04 LTS Benchmark Compliance Matrix

| CIS Control | Description | CyberLab Implementation | Status |
| :--- | :--- | :--- | :--- |
| **5.2.1** | Ensure SSH Protocol is set to 2 | `ansible/roles/hardening/templates/sshd_config.j2` |  Enforced |
| **5.2.2** | Ensure SSH LogLevel is VERBOSE | `LogLevel VERBOSE` in `sshd_config.j2` |  Enforced |
| **5.2.4** | Ensure SSH PermitRootLogin is disabled | `PermitRootLogin no` in `sshd_config.j2` |  Enforced |
| **5.2.8** | Ensure SSH PasswordAuthentication is disabled | `PasswordAuthentication no` in `sshd_config.j2` |  Enforced |
| **3.5.1** | Ensure UFW is active and enabled | `ansible/roles/hardening/tasks/main.yml` |  Enforced |
| **4.1.1** | Ensure auditd is installed and enabled | `ansible/roles/auditd_fim/tasks/main.yml` |  Enforced |
| **4.1.3** | Ensure system identity changes are audited | `audit/rules/50-identity.rules` |  Enforced |
| **4.1.11** | Ensure kernel module loading is audited | `audit/rules/30-os-hardening.rules` |  Enforced |
