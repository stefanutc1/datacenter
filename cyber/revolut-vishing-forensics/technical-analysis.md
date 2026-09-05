# Technical Analysis: Revolut Vishing Infrastructure

## 1. Attack Lifecycle

The attack methodology relies on a multi-stage social engineering pipeline designed to strip away the victim's critical assessment capabilities before requesting sensitive data.

### Stage 1: Telephony Reconnaissance (Vishing)

* **Caller ID Spoofing:** Attackers utilize VoIP gateways or SIM-farmed burner numbers (observed range: `0749-XXX-XXX`) to originate calls.
* **Pretexting:** The caller adopts an authoritative persona, utilizing terms like "Departamentul Antifraudă" (Anti-Fraud Department) or "Departamentul de Securitate" to establish immediate trust.
* **Psychological Trigger:** The introduction of a "pending fee" or "negative account balance" acts as the primary panic-inducing event.

### Stage 2: Redirection & Credential Harvesting

* **Link Delivery:** Victims are coerced into following an external URL provided via SMS or during the call.
* **Malicious Infrastructure:**
  * **TLD Selection:** Utilization of cheap/free Top-Level Domains (`.tk`, `.ml`, `.gq`) to bypass automated brand-protection filters.
  * **Obfuscation:** Frequent use of URL shorteners (bit.ly, t.co, etc.) to hide the actual landing page destination until the final request.
* **Interception Mechanism:** The landing page mimics the Revolut login or card-payment interface, utilizing CSS/HTML cloning to capture:
  * Card PAN (Primary Account Number)
  * Expiry Date
  * CVV/CVC
  * 3D Secure / OTP codes (requested in real-time if the transaction requires it)

## 2. Traffic Analysis

* **Protocol:** HTTPS (frequently with DV SSL certificates provided by free authorities like Let's Encrypt to gain the 'padlock' trust indicator).
* **Network Behavior:** Redirections often involve a series of 302 redirects, likely used to segment the victim traffic and filter out bots or security researchers.

## 3. Indicator of Compromise (IoC) Summary

| Type | Value Description |
| :--- | :--- |
| **Phone Prefix** | `0749` (Romanian mobile range) |
| **TLDs** | `.tk`, `.ml`, `.gq`, `.xyz` |
| **Methods** | Social Engineering, SMS-to-Phishing, Web-Cloning |
