# Steam OpenID 2.0 AiTM & Browser-in-the-Middle Forensic Analysis

Maintainer: **@stefanutc1** | Classification: **TLP:CLEAR** | Standards: **ISO/IEC 27037:2012 · MITRE ATT&CK v14** | License: **MIT**

---

## 1. Purpose

This project documents a forensic investigation into an active credential harvesting and inventory liquidation campaign targeting competitive gaming users (CS2, Dota 2). The threat actors deployed Browser-in-the-Middle (BitM) in-DOM popup simulation to capture OpenID 2.0 authentication tokens and mobile Steam Guard TOTP codes in real time, automatically provisioning Steam Web API keys and locking victim accounts with Family View PINs.

---

## 2. Scope

* **In Scope**:
  * In-DOM simulated popup window reverse engineering (`main.bundle.js`).
  * Packet trace analysis of real-time credential relay to reverse proxy origin (`185.220.101.44` / `AS202425`).
  * Post-exploitation token replay and Valve Web API provisioning dynamics.
  * Authorship and validation of Sigma and YARA detection signatures.
* **Out of Scope**:
  * Off-path brute-forcing of Steam Guard TOTP algorithms.
  * Exploitation of backend database vulnerabilities on the attacker's infrastructure.

---

## 3. Architecture & Attack Lifecycle

```text
[ Victim User ]
       │
       ▼ (Clicks "Vote via Steam" on tournament lure)
[ In-DOM Fake Window (steamcommunity-openid-auth.com) ]
       │
       ▼ (Submits username, password, Steam Guard TOTP)
[ AiTM Reverse Proxy C2 (185.220.101.44) ]
       │
       ▼ (Relays credentials in real-time)
[ Valve OpenID 2.0 IdP (steamcommunity.com) ]
       │
       ▼ (Returns authenticated cookies: steamLoginSecure, sessionid)
[ Automated Hijack Bot ]
       │
       ├─► Configures Family View 4-digit PIN (Locks account settings)
       └─► Provisions Steam Web API Key & intercepts trade offers
```

---

## 4. Implementation Details

* **DOM Emulation Mechanics**: Rather than spawning an OS-level window via `window.open()`, the site injects a fixed `<div>` overlay mimicking Chrome window chrome, an address bar displaying `https://steamcommunity.com/openid/login`, and an SVG SSL padlock icon.
* **Session Relay**: Credentials and TOTP codes are transmitted via `POST /api/v2/auth/steam_callback` to the proxy, which handshakes with Valve's authentication servers within 2.8 seconds.
* **Account Lockout**: The bot immediately issues `POST /parental/ajaxsetparentalsettings` with an attacker-selected 4-digit PIN, blocking the owner from accessing security settings or revoking sessions.

---

## 5. Input Artifacts & Indicators (IoCs)

| Indicator Type | Value | Provenance | Description |
| :--- | :--- | :---: | :--- |
| `domain-name` | `cs2-tournament-bracket.top` | FACT | Ingress phishing landing domain |
| `domain-name` | `vote-league-cup.com` | FACT | Secondary tournament lure domain |
| `autonomous-system` | `AS202425` | FACT | Offshore bulletproof hosting ASN |
| `api-endpoint` | `/api/v2/auth/steam_callback` | FACT | Credential harvesting endpoint |
| `api-endpoint` | `/api/v2/stream/event` | FACT | Event telemetry streaming endpoint |
| `session-cookie` | `steamLoginSecure` | FACT | Primary authentication token |
| `session-cookie` | `sessionid` | FACT | Session state identifier |

---

## 6. Output & Detection Signatures

* **Sigma Detection Rule**: [`Potential OpenID Session Token Replay`](case_study.md#5-mitre-attck-matrix-mapping) (`c4e3b129-87a1-42e5-9fa2-8b894172a392`).
* **YARA Detection Signature**: `Phish_BitM_Steam_Popup` matching in-DOM fake window string identifiers.
* **Threat Intelligence Bundle**: `stix-openid-aitm.json` compliant with OASIS STIX 2.1 schema.

---

## 7. Requirements & Reproduction

```bash
# Analyze case study evidence and export STIX 2.1 + SQLite database
python3 -m cyber analyze openid-mitm-phishing-forensics/case_study.md \
  --title "Steam OpenID AiTM Investigation" \
  --stix stix-openid-aitm.json \
  --sqlite evidence-openid-aitm.db

# Validate detection rule syntax
python3 scripts/validate_yara.py
python3 scripts/validate_sigma.py
```

---

## 8. Limitations & Scope Boundaries

* **Historical Credential Database**: The threat actor's private backend database could not be observed due to hosting isolation.
* **Egress Proxy Rotation**: Subsequent automated scrapers were blocked once the proxy host implemented IP whitelisting.

---

## 9. Security Considerations & Responsible Disclosure

This investigation was performed on captured offline packet traces. Indicators of compromise were submitted to upstream hosting providers and registrar abuse contacts, resulting in domain suspension within 24 hours of disclosure.
