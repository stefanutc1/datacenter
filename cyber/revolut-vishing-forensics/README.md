<div align="center">

# Revolut Vishing Forensics

**Voice Phishing (Vishing) · Caller ID Spoofing · FinTech Fraud · Real-Time Credential Harvesting**

A forensic analysis, threat intelligence breakdown, and takedown case study of an advanced voice phishing (vishing) and SMS-spoofing campaign targeting Revolut digital banking users.

[![License](https://img.shields.io/badge/License-MIT-1D3557?style=flat-square)](LICENSE)
[![MITRE ATT&CK](https://img.shields.io/badge/MITRE_ATT%26CK-T1566.004-red?style=flat-square)](studiu_de_caz.md)
[![Case Study](https://img.shields.io/badge/Document-Studiu_de_Caz-22c55e?style=flat-square)](studiu_de_caz.md)
[![Wiki Hub](https://img.shields.io/badge/Wiki_Hub-GitHub_Pages-22c55e?style=flat-square&logo=githubpages&logoColor=white)](https://stefannut.github.io/revolut-vishing-forensics/)
[![Docker Package](https://img.shields.io/badge/GHCR-Docker_Package-2563eb?style=flat-square&logo=docker&logoColor=white)](https://github.com/stefannut/revolut-vishing-forensics/pkgs/container/revolut-vishing-forensics-web)
[![Author](https://img.shields.io/badge/Author-stefannut-blue?style=flat-square)](https://github.com/stefannut)

</div>

---

## Executive Summary

This repository contains the full forensic investigation of an organized multi-stage financial cybercrime campaign. Threat actors weaponized **SIP VoIP Caller ID Spoofing** to impersonate Revolut's anti-fraud department, establishing psychological authority and urgency before delivering SMS-based phishing links.

The backend infrastructure utilized dynamically cloned payment interfaces to harvest primary account numbers (PAN), CVVs, and real-time One-Time Passwords (OTP / 3D Secure), while simultaneously coercing victims into approving in-app biometric push notifications to finalize unauthorized fund exfiltration.

---

## Attack Lifecycle & Infrastructure

```mermaid
flowchart TD
 Attacker([" Threat Actor"])

 subgraph TELEPHONY["Stage 1: Telephony & Social Engineering"]
 VOIP["SIP VoIP Gateway\nCaller ID Spoofing (0749-XXX-XXX)"]
 PRETEXT["Authoritative Pretext:\n'Fraudulent transaction detected'"]
 end

 subgraph DELIVERY["Stage 2: Smishing & Link Obfuscation"]
 SMS["Spoofed SMS Delivery\nURL Shortener (bit.ly / t.co)"]
 CLONE["Cloned FinTech Gateway\n(Let's Encrypt SSL · TLD: .tk / .xyz)"]
 end

 subgraph INTERCEPTION["Stage 3: Real-Time Harvesting & Proxy"]
 PORTAL["Fake Revolut Card Portal\nHarvests PAN, CVV, Expiry"]
 RELAY["Automated C2 Relay\nImmediate API Injection to Bank"]
 end

 subgraph FRAUD["Stage 4: 3DS Bypass & Exfiltration"]
 OTP["Victim submits 3DS / SMS OTP"]
 APP_AUTH["Victim approves In-App Push Prompt"]
 CASHOUT["Unauthorized Transfer Completed\n(SEPA Instant / Crypto Rail)"]
 end

 Attacker --> VOIP
 VOIP --> PRETEXT
 PRETEXT --> SMS
 SMS --> CLONE
 CLONE --> PORTAL
 PORTAL --> RELAY
 RELAY --> OTP
 OTP --> APP_AUTH
 APP_AUTH --> CASHOUT
 CASHOUT --> Attacker
```

---

## Repository Structure & Documentation

- ** [`studiu_de_caz.md`](studiu_de_caz.md)** — Exhaustive technical case study in Romanian analyzing the telephony spoofing mechanics, real-time OTP proxy relay, full IOC matrix, and MITRE ATT&CK mapping.
- ** [`technical-analysis.md`](technical-analysis.md)** — Network protocol analysis, HTTP 302 redirection chains, and User-Agent fingerprinting mechanisms.
- ** [`revolut-report.md`](revolut-report.md)** — Incident report and forensic telemetry submitted to Revolut Financial Security.
- ** [`revolut-response.md`](revolut-response.md)** — Formal acknowledgment and technical responses from the banking security team.
- ** [`takedown.md`](takedown.md)** — Domain registrar and host abuse reporting records for infrastructure dismantling.

---

## Key Forensic Findings

1. **SIP Trunking Abuse**: Threat actors utilized unauthenticated foreign SIP providers permitting custom `P-Asserted-Identity` headers to impersonate Romanian national mobile prefixes (`0749-XXX-XXX`).
2. **Reverse Proxy Credential Forwarding**: Harvested card telemetry was forwarded to live banking sessions within $<5$ seconds to intercept short-lived SMS OTP codes.
3. **Evasion Techniques**: 302 redirect funnels specifically rejected desktop User-Agents to prevent indexing by automated threat intelligence crawlers.

---

## License & Attribution

Maintained by [`@stefannut`](https://github.com/stefannut). Distributed under the [MIT License](LICENSE).
