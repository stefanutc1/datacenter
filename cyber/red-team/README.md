# Security Auditing & Detection Tests

Acest modul conține scripturile pentru auditarea configurațiilor de izolare a containerelor și verificarea regulilor de detecție în Wazuh SIEM și CrowdSec.

---

## 1. Scripturi

| Script | Rol & Limbaj | Obiectiv Principal |
| :--- | :--- | :--- |
| [`container_audit.py`](container_audit.py) | Python 3 | Verificare capabilități Linux (`CAP_SYS_ADMIN`, `CAP_SYS_PTRACE`), socket-uri expuse (`docker.sock`, `containerd.sock`), `cgroups` și namespaces partajate (`hostPID`, `hostNetwork`). |
| [`sec_tests.py`](sec_tests.py) | Python 3 | Execuție automată de tehnici non-distructive (T1059.004, T1082, T1046, T1552) pentru validarea generării alertelor în Wazuh și CrowdSec. |
| [`priv_check.py`](priv_check.py) | Python 3 | Evaluare permisiuni chei SSH, variabile de mediu cu secrete în clar și căi `PATH` perisabile. |

---

## 2. Audit Container (`container_audit.py`)

Verifică dacă un container din Kubernetes sau Docker conține configurații vulnerabile:

```bash
# Execuție audit direct în container
python3 cyber/red-team/container_audit.py

# Ieșire în format JSON
python3 cyber/red-team/container_audit.py --json
```

### Verificări:
1. **Linux Capabilities**: Decodare mască `CapEff` din `/proc/self/status` (`CAP_SYS_ADMIN`, `CAP_SYS_MODULE`, `CAP_SYS_PTRACE`, `CAP_DAC_OVERRIDE`, `CAP_NET_ADMIN`).
2. **Socket-uri expuse**: Scanare `/var/run/docker.sock`, `/run/containerd/containerd.sock`, `/run/crio/crio.sock`.
3. **Puncte de montare**: Identificare `/etc/shadow`, `/proc/sys`, `/sys/fs/cgroup`.
4. **Izolare Namespaces**: Verificare dacă PID 1 este procesul containerului sau `init` de pe host (`hostPID`).
5. **Politici Kernel**: Validare stare profil Seccomp și AppArmor.

---

## 3. Teste de Detecție (`sec_tests.py`)

Rulează verificări controlate pentru a măsura recepționarea alertelor:

```bash
# Rulare baterie de teste pe nodul local sau container staging
python3 cyber/red-team/sec_tests.py 127.0.0.1
```

### Tehnici simulate:
* **T1082**: Comenzi de identificare hardware/OS (`uname -a`).
* **T1059.004**: Execuție payload codificat base64 pentru testare regulă Wazuh 80710.
* **T1552.001**: Acces fișiere canary tokens pentru declanșare FIM.
* **T1046**: Scanare porturi interne pentru testare alertă CrowdSec/Suricata.

---

## 4. Corelare Defensivă (Blue Team SOC Integration)

Fiecare execuție Red Team este corelată automat cu evenimentele înregistrate de:
1. **Wazuh SIEM**: Alerte de nivel 7+ la execuție de comenzi anormale și acces canary files.
2. **Suricata IDS (OPNsense VM 200)**: Semnături de scanare porturi interne și trafic neautorizat inter-VLAN.
3. **Cilium Hubble eBPF**: Fluxuri `drop` la încălcarea politicilor mTLS L7 dintre containere.
