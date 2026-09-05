# AiTM Session Hijacking & FIDO2/Passkey Cookie Stealing Bypass

Maintainer: **@stefanutc1** | Classification: **TLP:CLEAR** | Standards: **ISO/IEC 27037:2012 · MITRE ATT&CK v14** | License: **MIT**

---

## 1. Purpose

This research evaluates how transparent reverse proxy frameworks (Evilginx3 / Muraena) intercept authentication handshakes when hardware-bound FIDO2 / WebAuthn / Passkey credentials are utilized. Although WebAuthn assertions are cryptographically bound to the relying party origin, identity providers issue ambient HTTP cookies (`ESTSAUTH`, `ESTSAUTHPERSISTENT`) once authentication succeeds. An adversary capturing these cookies across a proxied TLS stream can replay sessions on secondary devices without possessing the physical authenticator.

---

## 2. Scope

* **In Scope**:
  * Reverse proxy TLS termination and real-time WebAuthn challenge/assertion relay.
  * Extraction and parsing of persistent session cookies (`ESTSAUTHPERSISTENT`).
  * Automated headless replay for OAuth2 API token acquisition.
  * Evaluation of mitigation controls: Continuous Access Evaluation (CAE) and Device Bound Session Credentials (DBSC).
* **Out of Scope**:
  * Cryptographic factoring or cloning of physical FIDO2 secure enclave private keys.
  * Exploitation of client-side TPM hardware modules.

---

## 3. Architecture & Attack Lifecycle

```text
[ Victim User ]
       │
       ▼ (Navigates to phishing link: login.microsoftonline-auth.com)
[ Evilginx3 Transparent Reverse Proxy (185.196.8.21) ]
       │
       ▼ (Relays login request to authentic IdP)
[ Microsoft Entra ID / OAuth2 IdP ]
       │
       ▼ (Issues WebAuthn hardware challenge)
[ Victim touches FIDO2 Security Key / Windows Hello ]
       │
       ▼ (Signs challenge for proxy origin; IdP validates and issues cookies)
[ Proxy Captures ESTSAUTHPERSISTENT Cookies ]
       │
       ▼ (Exfiltrates cookie bundle to automation worker)
[ Threat Actor Replay Worker ] ──► [ Obtains Graph API Tokens on Independent IP ]
```

---

## 4. Input Artifacts & Indicators (IoCs)

| Indicator Type | Value | Provenance | Description |
| :--- | :--- | :---: | :--- |
| `domain-name` | `login.microsoftonline-auth.com` | FACT | Reverse proxy frontend hostname |
| `ipv4-addr` | `185.196.8.21` | FACT | Proxy origin hosting server (AS200114) |
| `cookie-name` | `ESTSAUTHPERSISTENT` | FACT | Target session authorization token |
| `cookie-name` | `ESTSAUTH` | FACT | Ambient authentication cookie |

---

## 5. Output & Detection Signatures

* **Sigma Detection Rule**:
  ```yaml
  title: Suspicious Identity Provider Token Request from Non-Compliant Device
  id: a8912b44-9124-4f2a-8910-184920194820
  status: production
  logsource:
    service: signinlogs
  detection:
    selection:
      AppDisplayName: 'Azure Portal'
      DeviceTrustType: 'None'
      IPAddressType: 'Public'
    condition: selection
  level: high
  ```

---

## 6. Requirements & Reproduction

```bash
# Deobfuscate relay scripts or parse captured tokens
python3 -m cyber deobfuscate "captured_relay_payload.txt"

# Validate Sigma rules against official schema
python3 scripts/validate_sigma.py
```

---

## 7. Limitations & Defensive Countermeasures

* **Device-Bound Conditional Access**: Policies requiring compliant, enrolled Intune devices successfully prevent token replay from unmanaged threat actor endpoints.
* **Continuous Access Evaluation (CAE)**: Real-time revocation upon IP address change blocks downstream API abuse.
