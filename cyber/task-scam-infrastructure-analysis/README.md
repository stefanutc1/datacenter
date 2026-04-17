<div align="center">

# Task Scam Infrastructure Analysis

**Pig Butchering · Fake Job Platform · API Reverse Engineering · Vulnerability Assessment · Crypto Drainage**

A comprehensive technical teardown, API disclosure analysis, and threat intelligence study of a fraudulent "Task Scam" / Pig Butchering web platform engineered to drain cryptocurrency deposits from victims.

[![License](https://img.shields.io/badge/License-MIT-1D3557?style=flat-square)](LICENSE)
[![MITRE ATT&CK](https://img.shields.io/badge/MITRE_ATT%26CK-T1499-red?style=flat-square)](studiu_de_caz.md)
[![Case Study](https://img.shields.io/badge/Document-Studiu_de_Caz-22c55e?style=flat-square)](studiu_de_caz.md)
[![Wiki Hub](https://img.shields.io/badge/Wiki_Hub-GitHub_Pages-22c55e?style=flat-square&logo=githubpages&logoColor=white)](https://stefannut.github.io/Task-Scam-Infrastructure-Analysis/)
[![Docker Package](https://img.shields.io/badge/GHCR-Docker_Package-2563eb?style=flat-square&logo=docker&logoColor=white)](https://github.com/stefannut/Task-Scam-Infrastructure-Analysis/pkgs/container/task-scam-infrastructure-analysis-web)
[![Author](https://img.shields.io/badge/Author-stefannut-blue?style=flat-square)](https://github.com/stefannut)

</div>

---

## 🎯 Executive Summary

This repository documents the forensic analysis and security evaluation of an active **Task Scam** platform (a hybrid high-yield investment fraud / Pig Butchering scheme). Victims were recruited via WhatsApp/Telegram under the pretext of remote part-time jobs reviewing e-commerce items.

Through traffic interception (Burp Suite) and API endpoint interrogation, the investigation revealed definitive backend evidence of deliberate financial deception, including a **hardcoded withdrawal kill-switch**, simulated fake profits, geographic campaign locks, and systemic backend injection vulnerabilities.

---

## 🏗️ Architecture & Fraud Mechanism

```mermaid
flowchart TD
    Victim(["👤 Victim User"])
    Admin(["🕵️ Threat Actor Admin Panel"])

    subgraph FRONTEND["Frontend Presentation Layer"]
        UI["Vue.js Web Application\nSimulated Task Dashboard & Fake Balance"]
        FEED["Fabricated Activity & News Feed\n(/api/v1/site/config data)"]
    end

    subgraph BACKEND["Backend & API Layer"]
        API_CONFIG["/api/v1/site/config\nWithdrawal Kill-Switch: false\nCountry Code Lock: +40"]
        API_AUTH["/api/v1/user/auth/*\nSQL Injection Surface on invite_code"]
        DB[(Target Database & Campaign Ledger)]
    end

    subgraph TRAP["Financial Drain Trap"]
        DEPOSIT["USDT TRC-20 Deposit\nMandatory 'VIP Task Unlock'"]
        WALLET["Attacker Consolidation Wallet\n(Laundering through Mixers/Bridges)"]
        BLOCK["Withdrawal Blocked\n'Tax / Verification Fee Required'"]
    end

    Victim -->|Registers via invite_code: 888888| UI
    UI <--> API_CONFIG
    UI <--> API_AUTH
    API_AUTH <--> DB
    Admin -->|Alters task rewards & margins| DB
    UI -->|Displays fake earnings| FEED
    FEED -->|Lured into depositing funds| DEPOSIT
    DEPOSIT --> WALLET
    Victim -.->|Attempts withdrawal| BLOCK
    BLOCK -->|Funds permanently locked| Admin
```

---

## 📑 Repository Structure & Documentation

- **📄 [`studiu_de_caz.md`](studiu_de_caz.md)** — Exhaustive technical case study in Romanian analyzing the business model, API config kill-switches, SQL injection surface, crypto flows, and MITRE ATT&CK mapping.
- **📄 [`API_exposure.md`](API_exposure.md)** — In-depth breakdown of the `/api/v1/site/config` endpoint disclosure and hardcoded withdrawal restrictions.
- **📄 [`SQLI.md`](SQLI.md)** — Vulnerability audit of input sanitization across the `username` and `invite_code` fields.
- **📄 [`ui_manipulation.md`](ui_manipulation.md)** — Analysis of client-side cosmetic manipulation techniques and fake WebSocket transactions.
- **📄 [`fingerprinting.md`](fingerprinting.md)** — Tech stack profiling (PHP/Laravel backend, Vue.js SPA, Cloudflare configuration).
- **📄 [`investigation.md`](investigation.md)** — Lab setup and traffic capture methodology.

---

## 🔬 Key Technical Discoveries

1. **The "Withdrawal Kill-Switch"**: In `/api/v1/site/config`, `withdrawMethodBank` and `withdrawMethodRevolut` are hardcoded to `false`. While the UI displays bank and card withdrawal options, the backend silently rejects all fiat cashout requests.
2. **Geographic Campaign Targeting**: The platform enforced `defaultCountryCode: "+40"` to isolate and target Romanian mobile numbers.
3. **Insecure Backend Query Logic**: The registration endpoint lacked server-side input validation and prepared statements, creating exposure to blind SQL injection.

---

## ⚖️ License & Attribution

Maintained by [`@stefannut`](https://github.com/stefannut). Distributed under the [MIT License](LICENSE).
