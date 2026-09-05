# Revolut Telephony Voice Phishing (Vishing) & 3DS Relay Forensics

Maintainer: **@stefanutc1** | Classification: **TLP:CLEAR** | Standards: **ISO/IEC 27037:2012 · MITRE ATT&CK v14** | License: **MIT**

---

## 1. Purpose

This project documents a technical teardown of an aggressive Voice Phishing (Vishing) and SMS-spoofing campaign targeting digital banking users across Romania and the European Union. Threat actors leveraged SIP VoIP Caller ID Spoofing to impersonate official anti-fraud representatives and dynamic reverse proxy portals to intercept card credentials and 3D Secure (3DS) SMS OTP codes in real time.

---

## 2. Scope

* **In Scope**:
  * SIP VoIP packet inspection (`P-Asserted-Identity` and `From` header forgery).
  * Analysis of dynamic phishing reverse proxy infrastructure (Let's Encrypt SSL, HTTP 302 redirect chains).
  * Anti-analysis evasion mechanics (mobile User-Agent gating returning HTTP 404 to desktop crawlers).
  * Real-time 3D Secure OTP relay timing measurements (<3 seconds).
  * Suricata and Sigma rule authoring.
* **Out of Scope**:
  * Compromise of internal banking core ledgers or payment gateways.
  * Direct interception of GSM radio base stations (IMSI catchers).

---

## 3. Architecture & Telephony Relay Flow

```text
[ Threat Actor / Voice Operator ]
       │
       ▼ (SIP INVITE with spoofed P-Asserted-Identity: "+40749...")
[ Wholesale SIP VoIP Trunk Gateway (195.138.22.14) ]
       │
       ▼ (Inbound call displaying authentic banking caller ID)
[ Target User (+40 Mobile) ]
       │
       ▼ (Directs user to SMS link via pretext: "Suspicious transaction detected")
[ Cloned Banking Verification Portal (revolut-security-verification.xyz) ]
       │
       ▼ (User enters PAN, CVV, expiry date, and 3DS SMS OTP)
[ Real-Time C2 Relay Engine ]
       │
       ▼ (Injects OTP into legitimate banking API in <3 seconds)
[ Card Issuer / 3DS Gateway ] ──► [ Fraudulent Cashout Executed ]
```

---

## 4. Input Artifacts & Indicators (IoCs)

| Indicator Type | Value | Provenance | Threat Context |
| :--- | :--- | :---: | :--- |
| `phone-prefix` | `0749-XXX-XXX` | FACT | Romanian national mobile range used for inbound spoofed vishing |
| `domain-name` | `revolut-security-verification.xyz` | FACT | Primary card harvesting portal |
| `domain-name` | `secure-revolut-app.top` | FACT | Secondary redirection and OTP capture host |
| `ipv4-addr` | `195.138.22.14` | FACT | Wholesale SIP proxy gateway origin (HostKey Netherlands) |
| `traffic-filtering` | `Mobile User-Agent Gating` | FACT | HTTP 404 served to desktop security sandboxes |

---

## 5. Output & Detection Signatures

* **Suricata Network Rule**:
  ```text
  drop sip any any -> $HOME_NET 5060 (msg:"CYBER-LAB Spoofed P-Asserted-Identity from Untrusted Trunk"; content:"P-Asserted-Identity|3a|"; content:"+40749"; sid:1000001; rev:1;)
  ```
* **Firewall Drop Rule**: Generated automatically via `python3 -m cyber firewall`.

---

## 6. Requirements & Reproduction

```bash
# Analyze telephony investigation report and export STIX 2.1 bundle
python3 -m cyber analyze revolut-vishing-forensics/case_study.md \
  --title "Revolut Telephony Vishing Investigation" \
  --stix stix-revolut-vishing.json \
  --sqlite evidence-revolut-vishing.db

# Validate Suricata network signatures
python3 scripts/validate_suricata.py
```

---

## 7. Limitations & Scope Boundaries

* **Operator Location**: Call center operators utilized encrypted WebRTC proxies behind the wholesale SIP gateway, obscuring their physical geolocation.

---

## 8. Responsible Disclosure

Telemetry and rogue SIP trunk origin IPs were communicated to the upstream carrier NOC and registrars, leading to infrastructure takedown within 6 hours.
