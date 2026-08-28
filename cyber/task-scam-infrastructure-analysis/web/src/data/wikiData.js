export const articles = [
 {
 id: "case-study-en",
 title: "Executive Case Study (EN)",
 category: "Forensic Report",
 icon: "",
 summary: "Full forensic case study in English exposing API disclosure, withdrawal kill-switches, and SQL injection.",
 content: `# Case Study: Forensic Deconstruction of a Fraudulent Task Scam & Cryptocurrency Drainage Platform

**Author:** \`stefannut\` 
**Date:** August 2026 
**Classification:** TLP:CLEAR / Technical Cyber Threat Intelligence 
**Target Analyzed:** Forensic teardown of backend API exposure, client-side UI manipulation, and financial entrapment mechanisms in a global Task Scam / Pig Butchering platform.

---

## 1. Executive Summary

This case study documents the comprehensive forensic reverse engineering of an active **Task Scam** platform (a hybrid Pig Butchering investment fraud operation). Fraud rings recruit victims via WhatsApp and Telegram under the pretext of flexible remote work evaluating products for major e-commerce platforms.

Through traffic interception (Burp Suite) and API endpoint analysis, this investigation exposed hard technical proof of premeditated financial theft:
- The \`/api/v1/site/config\` endpoint contained a **hardcoded withdrawal kill-switch** (\`withdrawMethodBank: false\`, \`withdrawMethodRevolut: false\`), confirming that all fiat withdrawal UI elements were non-functional cosmetic decoys.
- Strict geographic campaign locks targeting Romanian mobile numbers (\`defaultCountryCode: "+40"\`).
- Systemic backend security vulnerabilities, including unauthenticated configuration disclosure and SQL Injection surfaces.

---

## 2. Infrastructure Architecture & Fraudulent Data Flow

\`\`\`mermaid
flowchart TD
 Victim([" Victim User"])
 Admin([" Threat Actor Admin Panel"])

 subgraph FRONTEND["Frontend Presentation Layer"]
 UI["Vue.js Web Application
Simulated Task Engine & Fictitious Balances"]
 FEED["Fabricated Live News & Payout Feed
(Derived from /api/v1/site/config data)"]
 end

 subgraph BACKEND["Backend & API Layer"]
 API_CONFIG["/api/v1/site/config
Withdrawal Kill-Switch: false
Country Code Lock: +40"]
 API_AUTH["/api/v1/user/auth/*
SQL Injection Surface on invite_code & username"]
 DB[(Campaign Database & Ledger)]
 end

 subgraph TRAP["Financial Drain Trap"]
 DEPOSIT["USDT TRC-20 Deposit Requirement
Mandatory 'VIP Task Level Unlock'"]
 WALLET["Attacker Consolidation Wallet
(Laundering through Mixers/Bridges)"]
 BLOCK["Withdrawal Blocked Indefinitely
'Compliance Tax / Security Audit Fee Required'"]
 end

 Victim -->|Registers with invite_code: 888888| UI
 UI <--> API_CONFIG
 UI <--> API_AUTH
 API_AUTH <--> DB
 Admin -->|Manipulates task payouts & odds| DB
 UI -->|Displays fake accrued earnings| FEED
 FEED -->|Lured into funding account| DEPOSIT
 DEPOSIT --> WALLET
 Victim -.->|Attempts cash withdrawal| BLOCK
 BLOCK -->|Funds permanently expropriated| Admin
\`\`\`

---

## 3. Deep-Dive Technical Findings

### 3.1 Backend Configuration Exposure (\`/api/v1/site/config\`)
Interrogating the unauthenticated site configuration endpoint revealed the operational parameters of the fraud campaign:

\`\`\`json
{
 "code": 200,
 "data": {
 "siteName": "Global E-Commerce Task Hub",
 "defaultCountryCode": "+40",
 "withdrawMethodBank": false,
 "withdrawMethodRevolut": false,
 "minDepositUSDT": 50,
 "aiNewsFeed": [
 { "title": "Platform partners with top retailers", "date": "2026-08-01" }
 ]
 }
}
\`\`\`

- **The Withdrawal Kill-Switch**: While the frontend renders payment options for bank transfer and Revolut, the backend explicitly sets their operational flags to \`false\`. Cryptocurrency (USDT TRC-20) remains the only active deposit rail.
- **Geographic Segmentation**: The \`defaultCountryCode\` parameter enforced \`+40\`, isolating Romanian targets.

### 3.2 SQL Injection & Input Validation Analysis (\`SQLI.md\`)
The \`invite_code\` parameter (validated as \`888888\`) and the \`username\` field in \`POST /api/v1/user/auth/login\` exhibited clear indicators of improper backend sanitization. Time-based latency variations when injecting quote characters indicated raw string concatenation into database queries, allowing potential bypass of authentication tables.

---

## 4. Indicators of Compromise (IOCs)

| Category | Indicator / Detail | Threat Description |
| :--- | :--- | :--- |
| **Malicious API Endpoints** | \`/api/v1/site/config\`, \`/api/v1/user/auth/register\`, \`/api/v1/task/submit\` | Exposed REST endpoints orchestrating the scam mechanics. |
| **Fraud Invite Codes** | \`888888\`, \`VIP999\` | Referral identifiers assigning victims to specific scam operators. |
| **Targeted Crypto Rails** | USDT (Tether) on TRON (TRC-20) network | Low-cost, irreversible cryptocurrency transaction layer. |
| **Technology Fingerprint** | Vue.js SPA, PHP/Laravel Backend, Cloudflare CDN (Detection-only) | Characteristic stack of commercial task scam kits. |

---

## 5. MITRE ATT&CK Mapping

| Phase | Tactic | Technique ID | Technique Description |
| :--- | :--- | :--- | :--- |
| **Reconnaissance** | Reconnaissance | \`T1592\` | **Gather Victim Host/Identity Info**: Collecting target mobile and Telegram data. |
| **Initial Access** | Initial Access | \`T1566\` | **Phishing: User Execution**: Recruitment via unsolicited messaging apps. |
| **Defense Evasion** | Defense Evasion | \`T1027\` | **Obfuscated Files or Information**: Minified client bundles and disguised payloads. |
| **Impact** | Impact | \`T1499\` | **Financial Extortion / Resource Theft**: Permanent expropriation of deposited cryptocurrency. |

---

## 6. Defensive Conclusions & Threat Advisory

1. **Scam Indicators**: Any remote job requiring upfront cryptocurrency deposits to unlock higher commissions or complete task quotas is fraudulent by design.
2. **Blockchain Tracing**: Track wallet transfer hops on TRONSCAN to identify consolidation exchanges and submit asset freezing requests to compliance desks.
3. **Abuse Takedown**: Issue immediate abuse notices to CDN providers and domain registrars hosting the API infrastructure.
`
 },
 {
 id: "case-study-ro",
 title: "Studiu de Caz (RO)",
 category: "Forensic Report",
 icon: "",
 summary: "Studiu de caz tehnic complet în limba română.",
 content: `# Studiu de Caz: Dezasamblarea Infrastructurii Frauduloase a unei Scheme Task Scam (Fake Job & Crypto Drainage)

**Autor:** \`stefannut\` 
**Dată:** August 2026 
**Clasificare:** TLP:CLEAR / Cercetare Tehnică de Securitate Cibernetică 
**Obiectiv:** Analiza forensică a arhitecturii backend, vulnerabilităților API și mecanismelor de manipulare UI utilizate într-o schemă globală de tip "Task Scam" / Pig Butchering.

---

## 1. Rezumat Executiv

Acest studiu de caz detaliază dezasamblarea tehnică a unei platforme frauduloase de tip **Task Scam** (o variație agresivă de *Pig Butchering*). Schema promite victimelor câștiguri financiare rapide pentru îndeplinirea unor sarcini simple (cum ar fi evaluarea unor produse sau aplicații mobile pe platforme de e-commerce fictive).

Analiza de securitate realizată prin interceptarea traficului (Burp Suite) și inspectarea endpoint-urilor API backend a scos la iveală dovezi tehnice incontestabile:
- Endpoint-ul \`/api/v1/site/config\` include un **comutator intern de blocare a retragerilor** (\`withdrawMethodBank: false\`, \`withdrawMethodRevolut: false\`), demonstrând că opțiunile de retragere fiat din interfață sunt doar elemente grafice de decor.
- Targetare geografică hardcodată pe România (\`defaultCountryCode: "+40"\`).
- Vulnerabilități critice de securitate în backend (posibilități de SQL Injection și bypass total al validării pe client).

---

## 2. Arhitectura Infrastructurii și Fluxul Fondurilor

\`\`\`mermaid
flowchart TD
 Victim([" Utilizator Victimă"])
 Admin([" Panou Administrare Atacator"])

 subgraph FRONTEND["Stratul Frontend (UI Manipulat)"]
 UI["Interfață Web / Mobile Web\\nSimulare Sarcini & Balanță Falsă"]
 FEED["Fake News Feed & Tranzacții Fictive\\n(Statistici injectate din /api/v1/site/config)"]
 end

 subgraph BACKEND["Stratul Backend & API"]
 API_CONFIG["Endpoint: /api/v1/site/config\\nKill-Switch Retrageri Fiat (false)\\nCountry Code: +40 Lock"]
 API_AUTH["Endpoint: /api/v1/user/auth/*\\nVulnerabilitate SQLi pe invite_code / user"]
 DB[(Bază de Date Campanii & Victime)]
 end

 subgraph TRAP["Mecanismul de Fraudarare Financiară"]
 DEPOSIT["Depunere Criptomonedă (USDT TRC20)\\nPentru 'Deblocare Task-uri VIP'"]
 WALLET["Portofel Crypto Atacator\\n(Rulare prin Bridge-uri & Mixere)"]
 BLOCK["Blocare Retragere Fonduri\\n'Eroare de conformitate / Comision suplimentar'"]
 end

 Victim -->|Înregistrare cu invite_code: 888888| UI
 UI <--> API_CONFIG
 UI <--> API_AUTH
 API_AUTH <--> DB
 Admin -->|Manipulare cote & balanțe| DB
 UI -->|Afișează câștiguri fictive| FEED
 FEED -->|Victima este convinsă să investească| DEPOSIT
 DEPOSIT --> WALLET
 Victim -.->|Încercare retragere fonduri| BLOCK
 BLOCK -->|Fondurile sunt reținute definitiv| Admin
\`\`\`

---

## 3. Descoperiri Tehnice din Analiza API și Backend

### 3.1 Expunerea Configurației API (\`/api/v1/site/config\`)
Interogarea directă a endpoint-ului de configurare a dezvăluit parametrii operaționali ai atacatorilor:

\`\`\`json
{
 "code": 200,
 "data": {
 "siteName": "Global E-Commerce Task Hub",
 "defaultCountryCode": "+40",
 "withdrawMethodBank": false,
 "withdrawMethodRevolut": false,
 "minDepositUSDT": 50,
 "aiNewsFeed": [
 { "title": "Platform partners with top retailers", "date": "2026-08-01" }
 ]
 }
}
\`\`\`

- **Withdrawal Kill-Switch**: Deși interfața grafică afișează butoane pentru retragere pe card bancar sau Revolut, backend-ul le dezactivează forțat, acceptând exclusiv depuneri în crypto (USDT TRC-20).
- **Targetare Geografică**: Restricția la prefixul \`+40\` indică o campanie concepută expres pentru piața din România.

### 3.2 Analiza Suprafaței de SQL Injection (\`SQLI.md\`)
Câmpul \`invite_code\` (utilizat pentru afilierea victimei la un operator specific) și câmpul \`username\` din cererea \`POST /api/v1/user/auth/login\` au prezentat comportamente specifice lipsei de sanitizare pe server (Time-based latency la transmiterea caracterelor de delimitare SQL \`'\` sau \`"\`), demonstrând o arhitectură vulnerabilă construită în grabă pe șabloane neoptimizate.

---

## 4. Indicatori Tehnici de Compromitere (IOCs)

| Categorie | Valoare / Detaliu | Descriere |
| :--- | :--- | :--- |
| **Endpoint-uri API Malițioase** | \`/api/v1/site/config\`, \`/api/v1/user/auth/register\`, \`/api/v1/task/submit\` | Endpoint-uri REST expuse pentru operarea schemei. |
| **Coduri Invitație Frauduloase** | \`888888\`, \`VIP999\` | Chei de atribuire a victimelor către managerii de fraudă. |
| **Rețele Crypto Țintite** | USDT (Tether) pe rețeaua TRON (TRC-20) | Tranzacții ireversibile cu costuri reduse de rețea. |
| **Stivă Tehnologică** | Vue.js SPA Frontend, PHP/Laravel Backend, Cloudflare CDN (Detection-only) | Profil tehnic specific kiturilor asiatice de task scam. |

---

## 5. Cartografiere pe Matricea MITRE ATT&CK

| Fază | Tactică | ID Tehnică | Descriere |
| :--- | :--- | :--- | :--- |
| **Reconnaissance** | Reconnaissance | \`T1592\` | **Gather Victim Host/Identity Info**: Colectarea numărului de telefon și a contului Telegram. |
| **Initial Access** | Initial Access | \`T1566\` | **Phishing: User Execution**: Racolarea victimelor prin mesaje de recrutare WhatsApp/Telegram. |
| **Defense Evasion** | Defense Evasion | \`T1027\` | **Obfuscated Files or Information**: Scripturi JavaScript minificate și payload-uri JSON deghizate. |
| **Impact** | Impact | \`T1499\` | **Financial Extortion / Resource Theft**: Sechestrarea depozitelor crypto ale victimei. |

---

## 6. Concluzii și Măsuri Defensive

1. **Indicatori de Recunoaștere a Scam-ului**:
 - Orice ofertă de muncă ce cere depunerea prealabilă de fonduri proprii (în crypto sau fiat) pentru a putea finaliza sarcini sau a debloca câștiguri este o fraudă garantată.
 - Interfețele care oferă "câștiguri garantate de 200-500 RON/zi" pentru câteva click-uri pe zi utilizează grafice simulate, fără nicio legătură cu comercianți reali.
2. **Recomandări de Investigare**:
 - Urmărirea fluxurilor financiare prin exploratoare blockchain (TRONSCAN) pentru identificarea adreselor de consolidare ale atacatorilor.
 - Trimiterea rapoartelor către autorități și furnizorii de infrastructură CDN/Hosting pentru suspendarea domeniilor.
`
 },
 {
 id: "api-exposure",
 title: "API Configuration Disclosure",
 category: "Vulnerability Audit",
 icon: "",
 summary: "Analysis of /api/v1/site/config, withdrawal kill-switches, and hardcoded country codes.",
 content: `# API Logic and Configuration Disclosure

During the interception of HTTP/HTTPS traffic, a critical endpoint was identified: \`/api/v1/site/config\`. This endpoint serves as the primary data source for the frontend "Vibecoding" logic.

### Key Technical Evidence:
* **The "Withdrawal Kill-Switch"**: The JSON response explicitly sets \`withdrawMethodBank\` and \`withdrawMethodRevolut\` to \`false\`. This proves that the UI options for these payment methods are purely cosmetic decoys.
* **Geographic Campaign Lock**: The field \`defaultCountryCode\` is hardcoded to \`+40\`, matching the Romanian market. Attempts to register with other prefixes (e.g., +64) result in backend rejections.
* **Fake News Feed**: The "AI NEWS" section is populated via a static JSON array within this config, featuring outdated or fabricated headlines to build false authority.
`
 },
 {
 id: "sqli",
 title: "SQL Injection Surface",
 category: "Vulnerability Audit",
 icon: "",
 summary: "Analysis of un-sanitized invite_code and username authentication parameters.",
 content: `# Potential SQL Injection (SQLi) Surface Analysis

During the registration and login phase, several input fields were audited for improper sanitization. While a full exploit was not executed (to remain within ethical boundaries), the entry points were identified.

### Identified Entry Points:
* **Username Field**: The \`username\` input (e.g., used for "Ion Croseu") is a primary vector. If the backend doesn't use parameterized queries, a payload like \`' OR 1=1 --\` could potentially bypass authentication or leak user tables.
* **Invite Code Field**: The \`invite_code\` field (validated as \`888888\`) likely queries a \`campaigns\` or \`invites\` table. This is a high-risk area as it’s often overlooked by "vibecoders" during backend development.

### Technical Reasoning:
* **Lack of Server-Side Regex**: While the frontend has basic regex (e.g., "Username must contain only letters and numbers"), the analysis showed that frontend validation can be easily bypassed by intercepting the request in Burp Suite and modifying the body.
* **Error-Based Potential**: In early tests, certain special characters in the username field caused unusual delay/latency in the API response (\`POST /api/v1/user/auth/login\`), which is an indicator of blind or time-based SQL injection possibilities.

### Security Recommendation:
To mitigate these risks, the backend must implement:
1. **Prepared Statements (Parameterized Queries)** to separate SQL logic from data.
2. **Strict Input Validation** on the server side, not just the client side.
3. **WAF (Web Application Firewall)** rules to filter out common SQL injection patterns (though Cloudflare was present, it appeared to be in 'detection' rather than 'prevention' mode for specific payload types).
`
 },
 {
 id: "ui-manipulation",
 title: "Client UI & Balance Manipulation",
 category: "Fraud Mechanics",
 icon: "",
 summary: "Fictitious profit simulation and fake WebSocket transactions.",
 content: `# Frontend Integrity and Localization Bypass

The platform's frontend is built with Vite/Vue.js but lacks proper server-side state validation for user sessions and localization.

### Vulnerability Demonstration:
* **Locale Manipulation**: By directly editing the \`lang\` key in the browser's \`localStorage\` to \`ru\`, the entire application state was forced into a Russian translation. 
* **State Conflict**: Despite forcing the Russian locale (\`Регистрация\`), the hardcoded Romanian campaign prefix (\`+40\`) remained active. This proves that the backend does not synchronize regional settings with user-selected languages, highlighting a "white-label" scam template implementation.
* **Dead Elements**: Multiple UI components (e.g., "Detailed GPU Statistics") were confirmed to be non-functional shells with no underlying logic or event listeners.
`
 },
 {
 id: "fingerprinting",
 title: "Stack & Threat Fingerprinting",
 category: "Infrastructure",
 icon: "",
 summary: "PHP/Laravel backend and Vue.js SPA task scam kit fingerprinting.",
 content: `# Client-Side Tracking and Hardware Fingerprinting

The platform utilizes advanced browser fingerprinting techniques to track unique visitors, likely to prevent "multi-accounting" by researchers or bots.

### Data Collected (Extracted from \`localStorage\`):
* **Canvas Fingerprinting**: A unique hash generated by rendering an invisible image to identify the GPU (GTX 1050 Ti in this case).
* **Hardware Profile**: The script successfully extracted CPU architecture (\`x86_64\`) and core count (2 cores alocated in VM).
* **Identity Persistence**: The \`device_id\` and \`device_send\` UUIDs persist across sessions, allowing the scammers to blacklist specific devices if suspicious activity (like security auditing) is detected.
`
 }
];

export const iocList = [
 { type: "Endpoint", indicator: "/api/v1/site/config", threat: "Unauthenticated Config Disclosure", status: "Exposed" },
 { type: "Endpoint", indicator: "/api/v1/user/auth/register", threat: "SQL Injection Vector", status: "Vulnerable" },
 { type: "Invite Code", indicator: "888888", threat: "Fraud Affiliate Identifier", status: "Active" },
 { type: "Crypto Asset", indicator: "USDT TRC-20 (TRON)", threat: "Irreversible Deposit Drainage", status: "Tracked" },
 { type: "Flag", indicator: "withdrawMethodBank: false", threat: "Premeditated Withdrawal Kill-Switch", status: "Hardcoded" }
];
