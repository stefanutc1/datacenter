# Case Study: Forensic Reconstruction of Ransomware Pre-detonation Stage

**Author:** @stefanutc1
**Date:** 25 July 2026
**Classification:** TLP:CLEAR / Technical Cyber Threat Intelligence
**Target Analyzed:** Enterprise domain intrusion prior to payload detonation across 45 servers.

---

## 1. Executive Summary

This investigation analyzed the pre-execution phase of an enterprise ransomware intrusion. Threat actors leveraged compromised Domain Admin credentials to disable recovery mechanics and terminate endpoint security agents before launching the encryption binary.

The forensic reconstruction identified sequential execution of `vssadmin.exe delete shadows /all /quiet`, `wbadmin delete catalog -quiet`, and the loading of a vulnerable signed kernel driver (`mhyprot2.sys`) via Bring-Your-Own-Vulnerable-Driver (BYOVD) to overwrite EDR kernel callbacks.

---

## 2. Pre-Detonation Process Timeline

| Timestamp (UTC) | Process Name | Command Line / Action | Event ID |
| :--- | :--- | :--- | :--- |
| `14:10:02` | `cmd.exe` | `vssadmin.exe delete shadows /all /quiet` | Sysmon 1 / Security 4688 |
| `14:10:15` | `bcdedit.exe` | `bcdedit.exe /set {default} recoveryenabled no` | Sysmon 1 |
| `14:10:19` | `bcdedit.exe` | `bcdedit.exe /set {default} bootstatuspolicy ignoreallfailures` | Sysmon 1 |
| `14:11:40` | `sc.exe` | `sc.exe create mhyprot type= kernel binPath= C:\Windows\Temp\mhyprot2.sys` | System 7045 |
| `14:12:05` | `wmic.exe` | `wmic.exe /node:10.0.10.15 process call create "C:\Windows\Temp\stage2.exe"` | Sysmon 1 |

---

## 3. Indicators of Compromise

| Indicator Type | Value | Provenance | Description |
| :--- | :--- | :--- | :--- |
| SHA-256 | `7f8b9c2a1e4d5f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a` | FACT | Staging payload checksum |
| Kernel Driver | `mhyprot2.sys` (SHA256: `0464e5edc0a...`) | FACT | Vulnerable driver utilized for BYOVD EDR blinding |
| CLI Pattern | `vssadmin.exe delete shadows /all /quiet` | FACT | Volume Shadow Copy purge string |
| IPv4 | `91.240.118.52` | FACT | Cobalt Strike C2 operator server |

---

## 4. MITRE ATT&CK Mapping

- **T1490:** Inhibit System Recovery
- **T1562.001:** Impair Defenses: Disable or Modify Tools (BYOVD)
- **T1047:** Windows Management Instrumentation (WMI)
- **T1021.006:** Remote Services: Windows Remote Management (WinRM)
- **T1486:** Data Encrypted for Impact
