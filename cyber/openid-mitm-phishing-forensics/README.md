<div align="center">

# OpenID MITM Phishing Forensics

**Steam OpenID Protocol · Adversary-in-the-Middle (AiTM) · Browser-in-the-Middle (BitM) · Threat Intelligence**

A comprehensive technical investigation and forensic teardown of an advanced Adversary-in-the-Middle (AiTM) phishing campaign targeting Steam OpenID authentication, Steam Guard session tokens, and digital inventory assets.

[![License](https://img.shields.io/badge/License-MIT-1D3557?style=flat-square)](LICENSE)
[![MITRE ATT&CK](https://img.shields.io/badge/MITRE_ATT%26CK-T1557.001-red?style=flat-square)](studiu_de_caz.md)
[![Case Study](https://img.shields.io/badge/Document-Studiu_de_Caz-22c55e?style=flat-square)](studiu_de_caz.md)
[![Wiki Hub](https://img.shields.io/badge/Wiki_Hub-GitHub_Pages-22c55e?style=flat-square&logo=githubpages&logoColor=white)](https://stefannut.github.io/OpenID-MITM-Phishing-Forensics/)
[![Docker Package](https://img.shields.io/badge/GHCR-Docker_Package-2563eb?style=flat-square&logo=docker&logoColor=white)](https://github.com/stefannut/OpenID-MITM-Phishing-Forensics/pkgs/container/openid-mitm-phishing-forensics-web)
[![Author](https://img.shields.io/badge/Author-stefannut-blue?style=flat-square)](https://github.com/stefannut)

</div>

---

## Executive Summary

This repository documents the forensic analysis of a real-world **Adversary-in-the-Middle (AiTM)** phishing infrastructure targeting Steam platform users. The threat actor engineered a high-fidelity **Browser-in-the-Middle (BitM)** phishing portal pretending to be an esports tournament voting platform. 

The malicious infrastructure intercepted live OpenID 2.0 authentication exchanges, captured Steam Guard TOTP tokens, harvested session cookies (`steamLoginSecure`, `sessionid`), and abused Steam Web API Keys alongside Family View PIN locks to automate inventory theft.

---

## Attack Lifecycle & Architecture

```mermaid
sequenceDiagram
 autonumber
 actor Victim as Utilizator Victimă
 participant FakeSite as Phishing Portal (BitM Fake Window)
 participant AttackerProxy as AiTM Reverse Proxy C2
 participant SteamAuth as Valve Steam OpenID (steamcommunity.com)
 actor AttackerBot as Automated Trade Bot

 Victim->>FakeSite: 1. Clicks tournament link & clicks "Login with Steam"
 FakeSite->>Victim: 2. Renders fake popup window with simulated SSL bar
 Victim->>FakeSite: 3. Enters credentials & Steam Guard 2FA code
 FakeSite->>AttackerProxy: 4. Relays credentials via JSON POST in real-time
 AttackerProxy->>SteamAuth: 5. Executes legitimate OpenID handshake
 SteamAuth-->>AttackerProxy: 6. Issues session cookies (steamLoginSecure, sessionid)
 AttackerProxy->>AttackerBot: 7. Transfers session context to trading bot
 AttackerBot->>SteamAuth: 8. Locks account settings with Family View PIN
 AttackerBot->>SteamAuth: 9. Generates Web API Key & intercepts trade offers
 AttackerProxy-->>FakeSite: 10. Displays error message ("Vote recorded / Server busy")
```

---

## Repository Structure & Documentation

- ** [`studiu_de_caz.md`](studiu_de_caz.md)** — Exhaustive technical case study in Romanian covering threat actor mechanics, session relay, Family View lockout bypass, full IOC matrix, and MITRE ATT&CK mapping.
- ** [`technical-analysis.md`](technical-analysis.md)** — In-depth breakdown of frontend JavaScript obfuscation, reverse proxy relay mechanics, and credential harvesting payloads.
- ** [`steam-report.md`](steam-report.md)** — Security disclosure report and forensic findings submitted to Valve Security.
- ** [`executive-summary.md`](executive-summary.md)** — High-level threat intelligence summary for incident responders.

---

## Forensic Lab Environment

All analysis was performed inside an isolated, air-gapped testbed:
- **Hypervisor**: Oracle VirtualBox on isolated host OS.
- **Network**: NAT-only network isolation, routed through an intercepting Burp Suite Professional proxy.
- **Target Credentials**: Ephemeral test Steam accounts registered via disposable identities with zero attached personal assets.
- **Triage**: Full packet capture (PCAP), DOM snapshotting, and minified JS de-obfuscation.

---

## Key Mitigations

1. **Verify OpenID Authentication Behavior**: A legitimate Steam OpenID popup on a trusted browser will recognize your existing active session on `steamcommunity.com` and ask for a single-click confirmation ("Sign In") without prompting for your password or TOTP code again.
2. **Audit Web API Keys**: Periodically inspect `https://steamcommunity.com/dev/apikey` for unauthorized API keys.
3. **DNS Sinkholing**: Implement automated threat feed blocklists for newly registered domains (NRDs) matching gaming and tournament keywords.

---

## License & Attribution

Maintained by [`@stefannut`](https://github.com/stefannut). Distributed under the [MIT License](LICENSE).
