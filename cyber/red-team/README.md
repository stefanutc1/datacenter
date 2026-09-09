# Red Teaming, Adversary Simulation & Container Breakout Suite

Acest modul conține uneltele de securitate ofensivă utilizate pentru auditarea continuă a barierelor de izolare, testarea timpilor de reacție ai SOC-ului (Wazuh SIEM pe VM 217 / Proxmox) și validarea deciziilor automate ale sistemelor de protecție (CrowdSec & Suricata).

---

## 1. Structura Modulului

| Script | Rol & Tehnologie | Obiectiv Principal |
| :--- | :--- | :--- |
| [`container_escape_audit.py`](container_escape_audit.py) | Python 3 / Kernel Audit | Verificare capabilități periculoase (`CAP_SYS_ADMIN`, `CAP_SYS_PTRACE`), socket-uri containere (`docker.sock`, `containerd.sock`), `cgroups release_agent` și namespaces partajate (`hostPID`, `hostNetwork`). |
| [`atomic_red_team_runner.py`](atomic_red_team_runner.py) | Python 3 / MITRE ATT&CK | Execuție automată de tehnici non-distructive (T1059.004, T1082, T1046, T1552) pentru validarea generării alertelor în Wazuh și CrowdSec. |
| [`post_exploitation.py`](post_exploitation.py) | Python 3 / Audit Privilegii | Evaluare vectori de escaladare privilegii, permisiuni chei SSH, variabile de mediu cu secrete în clar și căi `PATH` nesecurizate. |

---

## 2. Audit Container Escape (`container_escape_audit.py`)

Verifică dacă un container din Kubernetes (Talos) sau Docker dispune de configurații vulnerabile ce ar permite evadarea în sistemul de operare gazdă (host):

```bash
# Execuție audit direct în container
python3 cyber/red-team/container_escape_audit.py

# Ieșire în format JSON structurat pentru pipeline-ul de securitate
python3 cyber/red-team/container_escape_audit.py --json
```

### Verificări incluse:
1. **Linux Capabilities**: Decodare mască `CapEff` din `/proc/self/status` (alertare la `CAP_SYS_ADMIN`, `CAP_SYS_MODULE`, `CAP_SYS_PTRACE`, `CAP_DAC_OVERRIDE`, `CAP_NET_ADMIN`).
2. **Socket-uri expuse**: Scanare `/var/run/docker.sock`, `/run/containerd/containerd.sock`, `/run/crio/crio.sock`.
3. **Puncte de montare gazdă**: Identificare `/etc/shadow`, `/proc/sys`, `/sys/fs/cgroup`.
4. **Izolare Namespaces**: Verificare dacă PID 1 este procesul containerizat sau `systemd`/`init` de pe host (`hostPID: true`).
5. **Politici de Kernel**: Validare stare profil Seccomp (filtru strict mode 2) și AppArmor/SELinux.

---

## 3. Simulator Adversar Atomic Red Team (`atomic_red_team_runner.py`)

Simulează acțiuni ale unui atacator pentru a măsura latența de detecție:

```bash
# Rulare baterie de tehnici pe nodul local sau container staging
python3 cyber/red-team/atomic_red_team_runner.py 127.0.0.1
```

### Tehnici MITRE ATT&CK simulate:
* **T1082 (System Information Discovery)**: Execuție comenzi de recunoaștere hardware/OS (`uname -a`).
* **T1059.004 (Unix Shell Encoded Execution)**: Rulare payload-uri codificate base64 pentru verificarea regulii Wazuh 80710.
* **T1552.001 (Credentials In Files)**: Căutare fișiere canary tokens pentru declanșarea File Integrity Monitoring (FIM / Syscheck).
* **T1046 (Network Service Discovery)**: Scanare porturi interne către servicii core pentru testarea bouncer-ului CrowdSec.

---

## 4. Corelare Defensivă (Blue Team SOC Integration)

Fiecare execuție Red Team este corelată automat cu evenimentele înregistrate de:
1. **Wazuh SIEM**: Alerte de nivel 7+ la execuție de comenzi anormale și acces canary files.
2. **Suricata IDS (OPNsense VM 200)**: Semnături de scanare porturi interne și trafic neautorizat inter-VLAN.
3. **Cilium Hubble eBPF**: Fluxuri `drop` la încălcarea politicilor mTLS L7 dintre containere.
