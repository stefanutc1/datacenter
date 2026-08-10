export const articles = [
  {
    id: "case-study-en",
    title: "Executive Case Study (EN)",
    category: "Forensic Report",
    icon: "📄",
    summary: "Full forensic case study in English covering SIP VoIP spoofing, real-time OTP relays, and MITRE mapping.",
    content: `# 🛡️ Case Study: Advanced Voice Phishing (Vishing) & Real-Time Credential Relay Targeting FinTech Users (Revolut)

**Author:** \`stefannut\`  
**Date:** August 2026  
**Classification:** TLP:CLEAR / Technical Cyber Threat Intelligence  
**Target Analyzed:** Active social engineering, SIP telephony spoofing, and real-time reverse proxy infrastructure targeting Revolut banking accounts.

---

## 1. Executive Summary

This case study provides a technical teardown of an aggressive **Voice Phishing (Vishing)** and SMS-spoofing campaign targeting digital banking users across Romania and the European Union. Threat actors leveraged **SIP VoIP Caller ID Spoofing** to impersonate official anti-fraud representatives, manufacturing urgent security pretexts (e.g., unauthorized transactions or negative balance penalties) to force immediate user compliance.

Victims were guided to dynamically cloned banking verification portals that harvested Primary Account Numbers (PAN), CVVs, and expiry dates. The backend infrastructure intercepted real-time SMS One-Time Passwords (OTP / 3D Secure) and coerced victims into approving in-app biometric push notifications to execute fraudulent SEPA Instant transfers.

---

## 2. Attack Lifecycle & Infrastructure Diagram

\`\`\`mermaid
flowchart TD
    Attacker(["👤 Threat Actor / Fraud Ring"])

    subgraph TELEPHONY["Stage 1: Telephony & Social Engineering"]
        VOIP["SIP VoIP Trunk Gateway
Caller ID Spoofing (0749-XXX-XXX)"]
        PRETEXT["Urgent Security Pretext:
'Unauthorized Transaction / Negative Balance'"]
    end

    subgraph DELIVERY["Stage 2: Smishing & Evasion Funnel"]
        SMS["Spoofed SMS Delivery
URL Shortener (bit.ly / t.co)"]
        CLONE["FinTech Cloned Landing Portal
(Let's Encrypt SSL · TLD: .tk / .xyz)"]
    end

    subgraph INTERCEPTION["Stage 3: Real-Time Proxy & Harvesting"]
        PORTAL["Fake Revolut Card Portal
Harvests PAN, CVV, Expiry"]
        RELAY["Real-Time C2 Relay Engine
Immediate API Injection into Bank"]
    end

    subgraph FRAUD["Stage 4: 3DS Bypass & Fund Exfiltration"]
        OTP["Victim submits 3DS / SMS OTP code"]
        APP_AUTH["Victim approves In-App Biometric Push"]
        CASHOUT["Unauthorized Cashout Completed
(SEPA Instant / Crypto Rail)"]
    end

    Attacker --> VOIP
    VOIP -->|Voice Call via Spoofed CLI| PRETEXT
    PRETEXT -->|Directs Victim to SMS Link| SMS
    SMS --> CLONE
    CLONE --> PORTAL
    PORTAL -->|Live Card Data| RELAY
    RELAY -->|Triggers Real Bank Transaction| OTP
    OTP --> APP_AUTH
    APP_AUTH --> CASHOUT
    CASHOUT -->|Laundered Capital| Attacker
\`\`\`

---

## 3. Technical Breakdown of Telephony & Web Proxy Vectors

### 3.1 SIP Telephony Exploitation
- **Caller ID Manipulation**: The threat actors routed voice calls through foreign unauthenticated SIP trunking providers, injecting arbitrary Romanian mobile prefixes (\`0749-XXX-XXX\`) into the SIP \`P-Asserted-Identity\` and \`From\` headers.
- **Psychological Coercion**: Callers adopted an authoritative tone, citing internal fraud reference numbers and simulating background call center ambient noise to discourage independent verification.

### 3.2 Dynamic Phishing Proxy Architecture
1. The victim received an SMS containing a shortened URL that performed multi-hop HTTP 302 redirects.
2. The landing server analyzed the client's \`User-Agent\` string, serving the phishing payload exclusively to mobile WebKit/Chrome clients while serving HTTP 404 responses to desktop security scanners.
3. The page dynamically captured payment credentials and streamed them via WebSockets to the attacker's operator dashboard.
4. When the authentic banking system triggered a 3D Secure verification challenge, the phishing portal mirrored the prompt in \$<3\$ seconds, capturing the victim's OTP input.

---

## 4. Indicators of Compromise (IOCs)

| Category | Indicator / Detail | Threat Context |
| :--- | :--- | :--- |
| **Vishing CLI Prefix** | \`0749-XXX-XXX\` (Romanian national mobile range) | Spoofed phone numbers used for inbound social engineering. |
| **Phishing Domains** | \`revolut-security-verification[.]xyz\`, \`secure-revolut-app[.]top\` | Phishing hosts delivering cloned interfaces. |
| **Web Server Tech** | Nginx Reverse Proxy + Let's Encrypt DV SSL | Disposable VPS infrastructure with automated SSL provisioning. |
| **Traffic Filtering** | HTTP 302 redirection chains, mobile User-Agent gating | Evasion mechanisms targeting automated security sandbox crawlers. |

---

## 5. MITRE ATT&CK Mapping

| Phase | Tactic | Technique ID | Technique Description |
| :--- | :--- | :--- | :--- |
| **Reconnaissance** | Reconnaissance | \`T1598\` | **Phishing for Information**: Harvesting target mobile phone numbers. |
| **Resource Development** | Resource Dev | \`T1583.001\` | **Acquire Infrastructure: Domains**: Registering low-cost typosquatting TLDs. |
| **Initial Access** | Initial Access | \`T1566.004\` | **Phishing: Voice (Vishing)**: Authoritative phone call with spoofed Caller ID. |
| **Credential Access** | Credential Access | \`T1556\` | **Modify Authentication Process**: Real-time interception of 3DS OTP tokens. |
| **Impact** | Impact | \`T1499\` | **Financial Fraud / Account Takeover**: Unauthorized fund exfiltration. |

---

## 6. Incident Response & Defensive Guidelines

1. **Bank Verification Policy**: Legitimate financial institutions will never instruct clients over the phone to disclose their CVV, transfer funds to "safety accounts", or read back SMS authorization codes.
2. **In-App Verification**: Users must verify all fraud inquiries exclusively through the authenticated in-app chat channel.
3. **Telephony Hardening**: Telecommunications carriers must enforce STIR/SHAKEN protocol standards to invalidate unauthenticated international SIP Caller ID spoofing.
`
  },
  {
    id: "case-study-ro",
    title: "Studiu de Caz (RO)",
    category: "Forensic Report",
    icon: "🇷🇴",
    summary: "Studiu de caz tehnic complet în limba română.",
    content: `# 🛡️ Studiu de Caz: Inginerie Socială & Voice Phishing (Vishing) Avansat Țintit Asupra Utilizatorilor FinTech (Revolut)

**Autor:** \`stefannut\`  
**Dată:** August 2026  
**Clasificare:** TLP:CLEAR / Cercetare Tehnică de Securitate Cibernetică  
**Vector Analizat:** Campanie activă de inginerie socială, Voice Phishing (Vishing), Caller ID Spoofing și clonare dinamică a portalului bancar Revolut.

---

## 1. Rezumat Executiv

Acest studiu de caz prezintă investigația tehnică de detaliu a unei campanii active de **Voice Phishing (Vishing)** desfășurate împotriva clienților băncii digitale Revolut din România și Uniunea Europeană. Atacatorii au combinat apeluri vocale de înaltă presiune (utilizând tehnici de **Caller ID Spoofing** pentru a afișa numere oficiale de suport) cu mesaje SMS spoofate ce direcționau victimele către portaluri web malițioase de recoltare în timp real.

Campania a urmărit furtul datelor complete ale cardului bancar (PAN, CVV, Dată Expirare), interceptarea codurilor de autorizare One-Time Password (OTP / 3DS) și forțarea aprobărilor biometrice Push Notification din aplicația mobilă pentru efectuarea unor transferuri SEPA frauduloase neautorizate.

---

## 2. Diagrama de Flux a Atacului (Attack Lifecycle)

\`\`\`mermaid
flowchart TD
    Attacker(["👤 Atacator / Grup Infracțional"])

    subgraph TELEPHONY["Faza 1: Inginerie Socială & Telephonie"]
        VOIP["Gateway SIP VoIP\\nCaller ID Spoofing (ex: 0749-XXX-XXX)"]
        PRETEXT["Pretext Urgență:\\n'Tranzacție suspectă / Sold negativ'"]
    end

    subgraph DELIVERY["Faza 2: Transmitere Vector Phishing"]
        SMS["SMS Spoofat cu Link Malițios\\nShortener URL (bit.ly / t.co)"]
        CLONE["Domeniu Phishing Clasă FinTech\\n(Let's Encrypt SSL · TLD: .tk / .xyz)"]
    end

    subgraph INTERCEPTION["Faza 3: Recoltare & Proxy în Timp Real"]
        PORTAL["Portal Web Clonat Revolut\\nCaptură PAN, CVV, Expirare"]
        RELAY["Releu Automatizat C2\\nTransmitere în Timp Real către Atacator"]
    end

    subgraph FRAUD["Faza 4: Autorizare & Exfiltrare Fonduri"]
        OTP["Victima introduce codul 3DS / OTP"]
        APP_AUTH["Victima aprobă notificarea Push în Aplicație"]
        CASHOUT["Tranzacție Neautorizată Finalizată\\n(SEPA Instant / Crypto Gateway)"]
    end

    Attacker --> VOIP
    VOIP -->|Apel Voce sub pretext Antifraudă| PRETEXT
    PRETEXT -->|Instrucțiuni trimise prin SMS| SMS
    SMS --> CLONE
    CLONE --> PORTAL
    PORTAL -->|Date card capturate| RELAY
    RELAY -->|Inițiere tranzacție frauduloasă| OTP
    OTP --> APP_AUTH
    APP_AUTH --> CASHOUT
    CASHOUT -->|Fonduri exfiltrate| Attacker
\`\`\`

---

## 3. Analiza Tehnică a Componentelor de Atac

### 3.1 Tehnici de Spoofing Telefonic (Vishing)
- **Originea Apelului**: Atacatorii utilizează servicii de telefonie VoIP bazate pe protocol SIP (Session Initiation Protocol) cu opțiunea \`P-Asserted-Identity\` manipulată pentru a injecta numere din plaja națională românească (\`0749-XXX-XXX\`).
- **Abuzul de Autoritate**: Operatorul fals se prezintă drept membru al "Departamentului Antifraudă și Securitate Cibernetică", folosind termeni bancari legitimi pentru a instaura o stare de panică urgentă ("A fost detectată o retragere neautorizată de 4.800 RON de la un terminal din afara țării").

### 3.2 Segmentul Web și Interceptarea în Timp Real
1. Victima primește un SMS ce conține un link scurtat.
2. Link-ul redirecționează succesiv (HTTP 302) pentru a eluda crawler-ele automate ale companiilor de securitate.
3. Portalul de aterizare clonează pixel cu pixel interfața de autorizare a plăților Revolut, având certificat SSL valid eliberat prin Let's Encrypt.
4. Câmpurile introduse sunt transmise printr-un WebSocket sau endpoint REST direct către consola atacatorului, care introduce datele pe platforma bancară legitimă în mai puțin de 5 secunde.
5. Când banca solicită aprobarea 3D Secure / OTP, portalul fals solicită imediat introducerea codului primit pe SMS sau aprobarea notificării din aplicație.

---

## 4. Indicatori Tehnici de Compromitere (IOCs)

| Categorie | Valoare / Detaliu | Impact |
| :--- | :--- | :--- |
| **Plajă Numere Vishing** | \`0749-XXX-XXX\` (Prefix național mobil) | Numere utilizate pentru apelurile de inginerie socială. |
| **Domenii Phishing** | \`revolut-security-verification[.]xyz\`, \`secure-revolut-app[.]top\` | Portaluri clonate pentru recoltarea datelor bancare. |
| **Tehnologii Web** | Nginx Reverse Proxy, Let's Encrypt DV SSL | Găzduire pe VPS-uri nereglementate. |
| **Mecanisme Bypass** | Lanțuri HTTP 302, filtrare pe bază de User-Agent mobil | Blocarea accesului crawler-elor desktop de securitate. |

---

## 5. Cartografiere pe Matricea MITRE ATT&CK

| Fază | Tactică | ID Tehnică | Descriere |
| :--- | :--- | :--- | :--- |
| **Reconnaissance** | Reconnaissance | \`T1598\` | **Phishing for Information**: Adunarea de numere de telefon țintite. |
| **Resource Development** | Resource Dev | \`T1583.001\` | **Acquire Infrastructure: Domains**: Înregistrarea de domenii typosquatting. |
| **Initial Access** | Initial Access | \`T1566.004\` | **Phishing: Voice / Vishing**: Apel telefonic autoritar cu număr spoofat. |
| **Credential Access** | Credential Access| \`T1556\` | **Modify Authentication Process**: Recoltarea codurilor OTP și token-urilor 3DS. |
| **Impact** | Impact | \`T1499\` | **Financial Fraud / Account Takeover**: Exfiltrarea fondurilor bancare. |

---

## 6. Procedura de Takedown și Recomandări Defensive

1. **Răspunsul Echipei de Securitate**:
   - Raportarea infrastructurii malițioase către registratorii de domenii (Namecheap / Cloudflare / Netcraft).
   - Transmiterea logurilor și dovezilor tehnice către CERT-RO / Directoratul Național de Securitate Cibernetică (DNSC).
2. **Recomandări pentru Utilizatori**:
   - Nicio instituție bancară legitimă nu va apela niciodată un client pentru a-i cere codurile SMS de autorizare sau datele de pe spatele cardului (CVV).
   - Dacă primiți un astfel de apel, închideți imediat și contactați banca exclusiv prin chat-ul securizat din interiorul aplicației oficiale.
`
  },
  {
    id: "tech-analysis",
    title: "Telephony & Traffic Analysis",
    category: "Technical Deep Dive",
    icon: "🔬",
    summary: "SIP trunk header manipulation, HTTP 302 evasion funnels, and User-Agent gating.",
    content: `# Technical Analysis: Revolut Vishing Infrastructure

## 1. Attack Lifecycle

The attack methodology relies on a multi-stage social engineering pipeline designed to strip away the victim's critical assessment capabilities before requesting sensitive data.

### Stage 1: Telephony Reconnaissance (Vishing)

* **Caller ID Spoofing:** Attackers utilize VoIP gateways or SIM-farmed burner numbers (observed range: \`0749-XXX-XXX\`) to originate calls.
* **Pretexting:** The caller adopts an authoritative persona, utilizing terms like "Departamentul Antifraudă" (Anti-Fraud Department) or "Departamentul de Securitate" to establish immediate trust.
* **Psychological Trigger:** The introduction of a "pending fee" or "negative account balance" acts as the primary panic-inducing event.

### Stage 2: Redirection & Credential Harvesting

* **Link Delivery:** Victims are coerced into following an external URL provided via SMS or during the call.
* **Malicious Infrastructure:**
  * **TLD Selection:** Utilization of cheap/free Top-Level Domains (\`.tk\`, \`.ml\`, \`.gq\`) to bypass automated brand-protection filters.
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
| **Phone Prefix** | \`0749\` (Romanian mobile range) |
| **TLDs** | \`.tk\`, \`.ml\`, \`.gq\`, \`.xyz\` |
| **Methods** | Social Engineering, SMS-to-Phishing, Web-Cloning |
`
  },
  {
    id: "revolut-report",
    title: "Revolut Security Submission",
    category: "Threat Intelligence",
    icon: "🏦",
    summary: "Incident telemetry and forensic evidence submitted to Revolut Financial Crime team.",
    content: `# Revolut Specifics Report

## 1. Exploitation of the Banking Trust Model

Threat actors capitalize on the high level of trust users place in digital banking applications like Revolut. They target the gap between the *expectations* of a user (receiving help for a 'problem') and the *reality* of security protocols.

## 2. Revolut Native Defense Analysis

The investigation highlights key mechanisms that, when properly utilized, neutralize these threats:

### The "In-App Call Status" Feature

* **Mechanism:** Revolut triggers a banner within the app when an official support agent initiates contact.
* **Why it works:** It establishes a cryptographic/authorized trust link between the server and the app.
* **Gap:** Many users are unaware that the absence of this banner during a call *is* the primary indicator of fraud.

## 3. Proposed Security Hardening

To further reduce successful phishing, the following UI/UX security controls are proposed:

### Persistent Security Banner (UX Control)

* **Implementation:** A non-intrusive, yet persistent header alert in the main dashboard:
  * *“Revolut never calls you to ask for PINs, card details, or fee payments via external links.”*
* **Impact:** This serves as a "first line of defense" that primes the user's mindset against vishing before they receive a fraudulent call.

### Proactive Fraud Alerts

* **Mechanism:** Triggering a mobile push notification when a high volume of reporting activity is detected from specific geographic regions (e.g., Romania) or when specific burner-range patterns emerge.
`
  },
  {
    id: "takedown",
    title: "Takedown Records & DNS",
    category: "Operations",
    icon: "🚨",
    summary: "Registrar abuse reports and hosting provider takedown telemetry.",
    content: `# Takedown Report: Phishing Infrastructure

## Overview

This document tracks the status of the malicious infrastructure identified during the August 10, 2026 Revolut impersonation campaign.

## Status: REMEDIATED / CLOSED

* **Detection Date**: August 10, 2026
* **Takedown Date**: August 10, 2026
* **Current Status**: Offline / Non-responsive

## Actions Taken

1. **Verification**: Performed connectivity tests using isolated VM infrastructure (Proxmox/UTM). The phishing domain no longer resolves or returns a 404/Connection Refused.
2. **Reporting**: Infrastructure IoCs were compiled and reported to the relevant national authorities (DNSC) and the hosting providers/registrars involved.
3. **Outcome**: The malicious redirection path has been successfully severed, preventing further credential harvesting via this specific vector.

## Lessons Learned

* Rapid detection and reporting significantly decrease the "window of opportunity" for threat actors.
* Consistent monitoring of burner phone patterns allows for early warning before infrastructure is fully deployed.
`
  }
];

export const iocList = [
  { type: "CLI Prefix", indicator: "0749-XXX-XXX", threat: "Spoofed Romanian National Mobile", status: "Flagged" },
  { type: "Domain", indicator: "revolut-security-verification[.]xyz", threat: "Cloned Payment Gateway", status: "Takedown Completed" },
  { type: "Domain", indicator: "secure-revolut-app[.]top", threat: "Mobile Smishing Target", status: "Takedown Completed" },
  { type: "Protocol", indicator: "SIP P-Asserted-Identity Injection", threat: "VoIP Gateway Abuse", status: "Mitigated" },
  { type: "Vector", indicator: "Real-Time 3DS OTP Harvesting", threat: "2FA Interception Proxy", status: "Blocked" }
];
