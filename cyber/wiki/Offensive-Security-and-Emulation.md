# ⚔️ Offensive Security & Emulation

## 1. Atomic Red Team Harness (`ctf/atomic_red_team/`)

Python test harness (`execution_harness.py`) executing mapped MITRE ATT&CK attack techniques:
- **T1059.004** — Command & Scripting Interpreter (Unix Shell).
- **T1053.003** — Scheduled Task / Cron persistence.
- **T1548.001** — Setuid / Setgid privilege escalation.
- **T1070.004** — Indicator Removal: File Deletion.

## 2. BloodHound Active Directory Path Analyzer (`ctf/bloodhound/`)

Automated Cypher query engine (`attack_path_analyzer.py`) identifying shortest attack paths to Domain Admins, DCSync rights, and unconstrained delegation misconfigurations.

## 3. LinPEAS Output Parser (`ctf/peass/`)

`analyze_linpeas.py` categorizes raw LinPEAS output into high, medium, and low security risk categories for automated triage.
