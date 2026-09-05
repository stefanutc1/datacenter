# Case Study: Forensic Analysis of AiTM Session Cookie Stealing Post-FIDO2 Authentication

**Author:** @stefanutc1
**Date:** 14 February 2026
**Classification:** TLP:CLEAR / Technical Cyber Threat Intelligence
**Target Analyzed:** Transparent reverse proxy architecture targeting enterprise OAuth2 / Entra ID logins.

---

## 1. Executive Summary

This case study investigates how Adversary-in-the-Middle (AiTM) reverse proxy frameworks bypass FIDO2 / Passkey protections without cracking or spoofing cryptographic keys. By terminating and relaying HTTP traffic between the victim and the legitimate Identity Provider (IdP), the proxy extracts persistent session cookies after the hardware token challenge succeeds.

The extracted cookies (`ESTSAUTH`, `ESTSAUTHPERSISTENT`) are subsequently replayed from automated headless browser instances to generate API access tokens, bypass conditional access controls, and establish persistence.

---

## 2. Attack Execution Chain

1. **Lure & Navigation:** The victim receives a targeted link directing them to `login.microsoftonline-auth.com` hosted behind an Evilginx3 instance with a valid Let's Encrypt TLS certificate.
2. **Challenge Relay:** The proxy forwards the login request to `login.microsoftonline.com`. The IdP issues a FIDO2 assertion request, which the proxy passes down to the victim browser.
3. **Hardware Touch:** The victim touches their FIDO2 security key or verifies with Windows Hello / Touch ID. The browser signs the challenge with the key bound to the proxy origin.
4. **Cookie Interception:** The IdP validates the signed payload and responds with HTTP `302 Found` along with `Set-Cookie` headers containing the persistent session tokens.
5. **Token Extraction:** Evilginx3 parses the response buffer, stores the cookie key-value pairs, and proxies the 302 redirect to the victim to conceal the interception.
6. **Automated Replay:** Within 4 seconds, an attacker-controlled script injects the extracted cookies into an automation session, requesting Graph API tokens with offline access scopes.

---

## 3. Indicators of Compromise (IoC)

| Indicator Type | Value | Provenance | Description |
| :--- | :--- | :--- | :--- |
| Domain | `login.microsoftonline-auth.com` | FACT | Reverse proxy frontend hostname |
| IPv4 | `185.196.8.21` | FACT | Proxy origin hosting server (AS200114) |
| Cookie Name | `ESTSAUTHPERSISTENT` | FACT | Target session authorization token |
| User-Agent | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36` | FACT | Automated exfiltration crawler user-agent |

---

## 4. MITRE ATT&CK Mapping

- **T1556.007:** Modify Authentication Process: Hybrid Identity
- **T1539:** Steal Web Session Cookie
- **T1111:** Multi-Factor Authentication Interception
- **T1078:** Valid Accounts

---

## 5. Defensive Countermeasures

1. **Continuous Access Evaluation (CAE):** Enforce real-time IP binding and token revocation when IP changes occur post-issuance.
2. **Device Bound Session Credentials (DBSC):** Implement cryptographic binding of session cookies to the local TPM (W3C DBSC specification).
3. **FIDO2 Strict Relying Party Validation:** Restrict authentication domains strictly via Enterprise MDM and WebAuthn allowed domain policies.
