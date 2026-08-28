# DFIR & Incident Response

## 1. Live Triage Artifact Collector (`forensics/triage_collector.sh`)

Gathers non-volatile and volatile system artifacts during live incident investigation:
- Running processes, open network sockets (`ss -tulpn`), and established connections.
- Logged-in users (`who`, `w`, `lastlog`), crontabs, and systemd timers.
- Loaded kernel modules (`lsmod`) and SUID binaries.
- Packages all artifacts into a timestamped, SHA-256 verified `tar.gz` archive in `/tmp`.

## 2. Volatile RAM Acquisition (`forensics/memory_dump.sh`)

Dumps physical RAM using AVML / LiME into `/tmp/memory.raw` for offline Volatility 3 analysis.

## 3. Emergency Network Isolation Playbook

Quarantines a compromised host in seconds while preserving controller SSH access:

```bash
ansible-playbook -i inventory/hosts.yml ansible/playbooks/incident_response.yml -e target_host=cyber-node01
```
