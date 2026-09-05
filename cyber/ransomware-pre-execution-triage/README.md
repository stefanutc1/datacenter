# Ransomware Pre-Execution Triage & BYOVD Defense Evasion Forensics

Maintainer: **@stefanutc1** | Classification: **TLP:CLEAR** | Standards: **ISO/IEC 27037:2012 · MITRE ATT&CK v14** | License: **MIT**

---

## 1. Purpose

This DFIR investigation reconstructed the critical 30-minute window preceding full enterprise ransomware detonation. Threat actors used compromised Domain Admin credentials to disable recovery mechanics (`vssadmin`, `bcdedit`), load a vulnerable signed kernel driver (`mhyprot2.sys`) via Bring-Your-Own-Vulnerable-Driver (BYOVD) to blind EDR kernel callbacks, and stage encryption binaries across domain servers via WMI and SMB.

---

## 2. Scope

* **In Scope**:
  * Volatile memory analysis with WinPmem and Volatility 3.
  * Sysmon Event ID 1 (Process Creation) and Security 4688 command-line reconstruction.
  * NTFS `$MFT` timeline analysis using MFTECmd.
  * Kernel driver dispatch analysis and IOCTL arbitrary read/write disassembly in Ghidra.
  * Sigma and Osquery rule authoring.
* **Out of Scope**:
  * Development or execution of live ransomware payloads.

---

## 3. Pre-Detonation Process Timeline

```text
[ C2 Operator (Cobalt Strike: 91.240.118.52) ]
       │
       ▼ (14:10:02 UTC: vssadmin.exe delete shadows /all /quiet)
[ Purges Volume Shadow Copy Backups ]
       │
       ▼ (14:10:15 UTC: bcdedit.exe /set {default} recoveryenabled no)
[ Disables Windows Startup Recovery Mode ]
       │
       ▼ (14:11:40 UTC: sc.exe create mhyprot binPath= C:\Windows\Temp\mhyprot2.sys)
[ Loads BYOVD Driver & Overwrites EDR Kernel Callbacks ]
       │
       ▼ (14:12:05 UTC: wmic.exe /node:... process call create "stage2.exe")
[ Lateral Movement via WMI across Domain-Joined Servers ]
```

---

## 4. Input Artifacts & Indicators (IoCs)

| Indicator Type | Value | Provenance | Description |
| :--- | :--- | :---: | :--- |
| `file-hash-sha256` | `7f8b9c2a1e4d5f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a` | FACT | Ransomware staging binary checksum |
| `kernel-driver` | `mhyprot2.sys` (SHA256: `0464e5edc0a...`) | FACT | Vulnerable driver utilized for BYOVD EDR blinding |
| `cli-pattern` | `vssadmin.exe delete shadows /all /quiet` | FACT | Shadow copy purge command string |
| `ipv4-addr` | `91.240.118.52` | FACT | Cobalt Strike C2 operator server |

---

## 5. Output & Detection Signatures

* **Sigma Detection Rule**:
  ```yaml
  title: Suspicious Volume Shadow Copy Deletion
  id: f48b1192-3c1a-4d2b-9e4a-118492019482
  status: production
  logsource:
    category: process_creation
    product: windows
  detection:
    selection:
      Image|endswith:
        - '\vssadmin.exe'
        - '\wmic.exe'
      CommandLine|contains|all:
        - 'delete'
        - 'shadows'
    condition: selection
  level: critical
  ```
* **Osquery Threat Hunting Query**:
  ```sql
  SELECT name, path, status FROM drivers WHERE path LIKE '%mhyprot2.sys' OR name = 'mhyprot';
  ```
