export const articles = [
  {
    id: "case-study-en",
    title: "Executive Case Study (EN)",
    category: "Forensic Report",
    icon: "📄",
    summary: "Full forensic case study in English covering BitM attack mechanics, Family View hijack, and MITRE mapping.",
    content: `# 🛡️ Case Study: Forensic Analysis of an Adversary-in-the-Middle (AiTM) Attack on Steam OpenID Authentication

**Author:** \`stefannut\`  
**Date:** August 2026  
**Classification:** TLP:CLEAR / Technical Cyber Threat Intelligence  
**Target Analyzed:** Active phishing and account takeover campaign leveraging Browser-in-the-Middle (BitM) fake popups and real-time OpenID session relay.

---

## 1. Executive Summary

This case study documents an in-depth forensic investigation into an advanced **Adversary-in-the-Middle (AiTM)** phishing campaign targeting the competitive gaming ecosystem (CS2, Dota 2). Threat actors engineered deceptive tournament voting portals that lured victims into authenticating via a fraudulent Steam OpenID login mechanism.

The malicious infrastructure weaponized a high-fidelity **Browser-in-the-Middle (BitM)** popup interface to intercept OpenID 2.0 authentication handshakes in real time. Upon capturing valid Steam Guard TOTP codes and session cookies (\`steamLoginSecure\`, \`sessionid\`), the adversary automatically enabled a **Family View PIN lockout** to prevent the victim from altering account settings, while provisioning Steam Web API keys to intercept and reroute digital inventory trade offers.

---

## 2. Attack Lifecycle & Technical Architecture

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Victim as Victim User
    participant FakeSite as Phishing Landing Page (Fake Tournament)
    participant AttackerProxy as AiTM Reverse Proxy C2
    participant SteamAuth as Valve Steam OpenID (steamcommunity.com)
    actor AttackerBot as Automated Trade Hijack Bot

    Victim->>FakeSite: 1. Clicks tournament link & selects "Vote via Steam"
    FakeSite->>Victim: 2. Renders fake popup window with simulated SSL address bar
    Victim->>FakeSite: 3. Inputs Steam username, password & Steam Guard TOTP
    FakeSite->>AttackerProxy: 4. Transmits credentials via JSON POST in real-time
    AttackerProxy->>SteamAuth: 5. Executes legitimate OpenID login handshake
    SteamAuth-->>AttackerProxy: 6. Issues authenticated session cookies (steamLoginSecure)
    AttackerProxy->>AttackerBot: 7. Transfers session context to trading bot
    AttackerBot->>SteamAuth: 8. Configures Family View PIN (locks victim settings)
    AttackerBot->>SteamAuth: 9. Generates Web API Key & intercepts trade offers
    AttackerProxy-->>FakeSite: 10. Displays error message ("Vote recorded / Server busy")
\`\`\`

### 2.1 Browser-in-the-Middle (BitM) Mechanics
Unlike traditional phishing campaigns that redirect victims to an external typo-squatted URL, the attacker utilized a simulated in-page window (\`<div>\` container) equipped with draggable title bars, an address bar mimicking \`https://steamcommunity.com/openid/login\`, and an interactive SSL padlock icon.

### 2.2 Session Relay & Cookie Extraction
1. Frontend JavaScript (\`main.bundle.js\`) intercepted the login form submit event.
2. Credentials and mobile authenticator codes were dispatched via \`fetch()\` to \`/api/v2/auth/steam_callback\`.
3. The C2 reverse proxy immediately initiated an automated session with Valve's authentication servers, acquiring the \`steamLoginSecure\` authentication token.

---

## 3. Post-Exploitation & Account Takeover Chain

1. **Family View Lockout**: The attacker automatically assigned a 4-digit PIN to Steam Family View, restricting the victim from accessing profile security settings, changing their email address, or revoking active sessions.
2. **API Key Generation**: A Steam Web API Key was provisioned, granting the adversary read access to incoming and outgoing trade proposals.
3. **Trade Offer Hijacking**: When the victim initiated legitimate trade offers with friends or third-party marketplaces, the attacker's bot instantly canceled the original offer and created an identical offer to an impostor account.

---

## 4. Technical Indicators of Compromise (IOCs)

| Category | Indicator / Value | Description |
| :--- | :--- | :--- |
| **Phishing Domains** | \`cs2-tournament-bracket[.]top\`, \`vote-league-cup[.]com\` | Ingress landing portals hosting the BitM kit. |
| **Hosting ASN** | \`AS202425\` (Offshore Disposable VPS) | Infrastructure ignoring abuse and DMCA notices. |
| **SSL Certificates** | Let's Encrypt R3 (issued \$<24\$h prior to campaign launch) | Domain-validated certificates providing HTTPS padlock. |
| **Targeted Cookies** | \`steamLoginSecure\`, \`sessionid\`, \`steamMachineAuth*\` | Core authentication and transaction tokens. |
| **API Endpoints** | \`/api/v2/auth/steam_callback\`, \`/api/v2/stream/event\` | C2 backend endpoints for harvesting telemetry. |

---

## 5. MITRE ATT&CK Matrix Mapping

| Phase | Tactic | Technique ID | Technique Name & Operational Notes |
| :--- | :--- | :--- | :--- |
| **Initial Access** | Initial Access | \`T1566.002\` | **Phishing: Spearphishing Link** (Discord tournament lures). |
| **Execution** | Execution | \`T1204.001\` | **User Execution: Malicious Link** (victim opens fake voting portal). |
| **Credential Access** | Credential Access | \`T1557.001\` | **AiTM: Browser-in-the-Middle Relay** (harvesting OpenID cookies). |
| **Persistence** | Persistence | \`T1098\` | **Account Manipulation** (enabling Family View PIN lockout & API key). |
| **Exfiltration** | Exfiltration | \`T1048\` | **Exfiltration Over C2 Channel** (exfiltrating session cookies to bot). |
| **Impact** | Impact | \`T1496\` | **Resource Hijacking / Inventory Theft** (unauthorized asset transfer). |

---

## 6. Defensive Countermeasures & Incident Response

1. **User Verification**: Authentic Steam OpenID sign-in prompts will immediately recognize an active browser session on \`steamcommunity.com\` and require only a single click ("Sign In"), never asking for a password or TOTP re-entry.
2. **API Key Auditing**: Inspect \`https://steamcommunity.com/dev/apikey\` regularly for unauthorized API registrations.
3. **Enterprise Defense**: Deploy DNS sinkholing for newly registered domains (NRDs) matching gaming and tournament keywords.
`
  },
  {
    id: "case-study-ro",
    title: "Studiu de Caz (RO)",
    category: "Forensic Report",
    icon: "🇷🇴",
    summary: "Studiu de caz tehnic complet în limba română.",
    content: `# 🛡️ Studiu de Caz: Analiza Forensică a unui Atac Adversary-in-the-Middle (AiTM) pe Mecanismul OpenID Steam

**Autor:** \`stefannut\`  
**Dată:** August 2026  
**Clasificare:** TLP:CLEAR / Cercetare Tehnică de Securitate Cibernetică  
**Țintă Analizată:** Campanie activă de phishing și deturnare a conturilor Steam prin ferestre pop-up false (Browser-in-the-Middle) și releu OpenID proxy.

---

## 1. Rezumat Executiv

Acest studiu de caz documentează investigația forensică a unei campanii sofisticate de tip **Adversary-in-the-Middle (AiTM)** care a vizat comunitatea de gaming competitiv (CS2, Dota 2). Atacatorii au utilizat platforme web clonate, pretinzând că sunt portaluri de votare pentru turnee esports sau recompense cosmetice, pentru a induce victimele în eroare și a le fura credențialele Steam, codurile Steam Guard (TOTP/Mobile Authenticator) și cookie-urile de sesiune (\`steamLoginSecure\`).

Analiza a relevat utilizarea unui kit modular de phishing capabil să intercepteze în timp real handshake-ul OpenID 2.0, să comute contul victimei în modul **Family View** (pentru a împiedica schimbarea parolei sau revocarea accesului) și să transfere automat inventarul prin intermediul API-urilor Steam Trade.

---

## 2. Arhitectura și Mecanismul Tehnic al Atacului

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Victim as Utilizator Victimă
    participant FakeSite as Portal Phishing (Fake Tournament)
    participant AttackerProxy as AiTM Reverse Proxy
    participant SteamAuth as Valve Steam OpenID (steamcommunity.com)
    actor AttackerBot as Bot Automatizat Atacator

    Victim->>FakeSite: 1. Accesează link-ul malițios (Pretext turneu CS2)
    FakeSite->>Victim: 2. Afișează fereastră falsă de login (Browser-in-the-Middle)
    Victim->>FakeSite: 3. Introduce User, Parolă și Steam Guard TOTP
    FakeSite->>AttackerProxy: 4. Trimite credențialele în timp real (JSON POST)
    AttackerProxy->>SteamAuth: 5. Autentificare legitimă în numele victimei
    SteamAuth-->>AttackerProxy: 6. Emite cookie-uri de sesiune (steamLoginSecure, sessionid)
    AttackerProxy->>AttackerBot: 7. Transferă token-ul de sesiune către bot
    AttackerBot->>SteamAuth: 8. Activează Family View PIN (blochează setările victimei)
    AttackerBot->>SteamAuth: 9. Creează API Key nou și generează oferte de Trade
    AttackerProxy-->>FakeSite: 10. Afișează eroare fictivă ("Vote registered / Server error")
\`\`\`

### 2.1 Tehnica Browser-in-the-Middle (BitM)
Spre deosebire de atacurile clasice de phishing care redirecționează utilizatorul către un domeniu suspect vizibil în bara de adrese, atacatorii au utilizat un container \`<div>\` simulat în interiorul paginii web, reproducând cu exactitate bara de titlu, pictograma SSL și interfața ferestrei native de autentificare \`steamcommunity.com/openid/login\`.

### 2.2 Releul de Sesiune și Interceptarea Cookie-urilor
1. Scriptul malițios din frontend (\`main.bundle.js\`) interceptează evenimentul de submit.
2. Credențialele și codul TOTP sunt trimise printr-un apel \`fetch()\` către endpoint-ul backend al atacatorului.
3. Backend-ul inițiază o sesiune \`curl\` către Valve, finalizând autentificarea cu succes și capturând cookie-ul \`steamLoginSecure\`.

---

## 3. Ciclul Post-Exploatare și Blocarea Contului

După obținerea sesiunii valide, infrastructura atacatorilor execută un script automatizat în trei pași:

1. **Activarea Family View**: Atacatorii configurează un cod PIN Family View de 4 cifre pe contul victimei, restricționând accesul la inventar, schimbarea adresei de e-mail sau generarea de tichete de suport de pe browserul victimei.
2. **Generarea API Key**: Este emis un Steam Web API Key asociat contului, permițând atacatorului să monitorizeze toate schimburile (Trade Offers) viitoare.
3. **Deturnarea Tranzacțiilor (Trade Scam / API Hijack)**: Orice tranzacție inițiată de utilizator este anulată instantaneu de bot și re-creată identic către un cont clonă al atacatorului.

---

## 4. Indicatori Tehnici de Compromitere (IOCs)

| Categorie | Indicator / Valoare | Descriere |
| :--- | :--- | :--- |
| **Domenii Phishing** | \`cs2-tournament-bracket[.]top\`, \`vote-league-cup[.]com\` | Domenii utilizate pentru găzduirea paginilor de destinație. |
| **ASN Găzduire** | \`AS202425\` (Offshore VPS Provider) | Găzduire cu protecție DMCA ignorată. |
| **Certificate SSL** | Let's Encrypt R3 (emise cu <24h înainte de lansarea atacului) | Validare DV automată pentru obținerea simbolului securizat. |
| **Cookie-uri Țintite** | \`steamLoginSecure\`, \`sessionid\`, \`steamMachineAuth*\` | Token-uri critice de autentificare și autorizare tranzacții. |
| **Endpoint-uri API** | \`/api/v2/auth/steam_callback\`, \`/api/v2/stream/event\` | Endpoint-uri pe serverul proxy pentru recoltarea datelor. |

---

## 5. Cartografiere pe Matricea MITRE ATT&CK

| Fază | Tactică | ID Tehnică | Nume Tehnică & Observații |
| :--- | :--- | :--- | :--- |
| **Acces Inițial** | Initial Access | \`T1566.002\` | **Phishing: Spearphishing Link** (mesaje directe pe Discord/Steam). |
| **Execuție** | Execution | \`T1204.001\` | **User Execution: Malicious Link** (victima accesează pagina clonată). |
| **Recoltare Credențiale**| Credential Access | \`T1557.001\` | **AiTM: LLMNR/NBT-NS / Browser Proxy** (interceptare token-uri OpenID). |
| **Persistență** | Persistence | \`T1098\` | **Account Manipulation** (activare Family View PIN & Web API Key). |
| **Exfiltrare** | Exfiltration | \`T1048\` | **Exfiltration Over Alternative Protocol** (trimitere credențiale la C2). |
| **Impact** | Impact | \`T1496\` | **Resource Hijacking** (furtul digital al activelor de inventar). |

---

## 6. Măsuri de Mitigare și Detecție

1. **Pentru Utilizatori**:
   - Nu introduceți niciodată datele de logare Steam pe ferestre pop-up apărute pe site-uri terțe. Dacă sunteți deja autentificat pe \`steamcommunity.com\`, butonul legitim de OpenID necesită doar un singur click ("Sign In"), fără a cere din nou parola sau codul TOTP.
   - Verificați periodic dacă aveți chei API necunoscute pe \`https://steamcommunity.com/dev/apikey\`.
2. **Pentru Echipe Defensive / SOC**:
   - Blocarea la nivel de DNS/Web Proxy a domeniilor nou înregistrate (NRD < 30 zile) ce conțin keyword-uri precum \`steam\`, \`cs2\`, \`tournament\`, \`valve\`.
   - Monitorizarea conexiunilor HTTPS inițiate către ASN-uri cu reputație scăzută.
`
  },
  {
    id: "tech-analysis",
    title: "Technical Analysis & Obfuscation",
    category: "Technical Deep Dive",
    icon: "🔬",
    summary: "Frontend JS payload analysis, OpenID callback interceptor, and reverse proxy mechanics.",
    content: `# Technical Analysis

## Environment

- Isolated host OS, air-gapped from personal accounts and data
- Windows 10 virtual machine (Oracle VirtualBox)
- NAT-only networking (no bridged access to the host network)
- Two temporary Steam accounts registered via disposable email (Tempmail)
- VM deleted after analysis was complete

## Attack Flow

1. Victim reaches a fake "vote for skin" landing page
2. A fraudulent Steam login button is presented
3. An OpenID MITM redirect captures the entered credentials
4. The attacker attempts to lock the account via Family View
5. With Family View locked, inventory hijack becomes possible

## Frontend Findings

- Built on a CSReserve-style phishing kit template
- Minified JavaScript bundles, consistent with an off-the-shelf kit rather than custom development
- Hardcoded API endpoints rather than dynamically configured ones
- No legitimate Steam assets — all branding was reproduced/cloned
- OpenID request parameters that don't match a legitimate Steam authentication flow

## Backend Findings (Inferred)

- A lightweight credential forwarder, not a full application backend
- Hosted on a disposable VPS
- No real application logic beyond capturing and relaying credentials
- Minimal or no real session handling

## Mitigation

- Only log into Steam via \`steamcommunity.com\` — never via a link from an external page or "reward" offer
- Enable Steam Guard (two-factor authentication) on your account
- Be cautious of unsolicited Family Sharing invites, especially from unfamiliar accounts
- Report suspected phishing domains to the platform immediately rather than investigating them yourself

## Related Analysis

The infrastructure pattern here — a cloned login flow with a disposable backend, used for high-volume low-cost credential theft — shows up in different forms elsewhere. See [\`Task-Scam-Infrastructure-Analysis\`](https://github.com/moanast/Task-Scam-Infrastructure-Analysis) for an analysis of a fraudulent investment platform using a similarly templated, geographically-targeted approach.
`
  },
  {
    id: "steam-report",
    title: "Valve Disclosure Report",
    category: "Threat Intelligence",
    icon: "📬",
    summary: "Incident submission report and security recommendations sent to Valve Security.",
    content: `# Steam Ticket

Hello, I would like to report a phishing website that is impersonating Steam in order to steal user accounts through an OpenID MITM attack and Family View abuse.

I reproduced the attack in a controlled sandbox environment (isolated VM, temporary accounts) and confirmed the following:

The website uses a cloned Steam login page.

The form submits credentials through a fake OpenID endpoint.

The attacker attempts to force Family View / Family Sharing takeover to bypass restrictions.

The entire site is based on a stolen template from csreserve.shop.

The domain is hosted on OVH / VPS infrastructure with no real backend logic besides credential forwarding.

Data collected:

Domain: cs2-final.net

Hosting IP: 172.67.175.191

OpenID phishing endpoint: [newxyu, b4bcd]

Method: MITM OpenID, credential harvesting, attempted family takeover

Proof of concept: fully reproduced in an isolated virtual machine. https://www.youtube.com/watch?v=qsYza5weW3E

No real server-side logic apart from credential forwarding

This website is actively attempting to steal Steam accounts.
Please take appropriate action.

Thank you.

## Contact With Steam Support – Outcome

On November 22, 2025, I submitted a full security report to Steam Support, including all technical details regarding the OpenID MITM phishing kit, the domain infrastructure, the credential-capture flow, and the abuse of Steam’s Family View mechanic.

Steam Support replied acknowledging the report and confirmed that they will investigate internally. They also stated that no further updates will be provided publicly, which is standard policy for security-related incidents.

This marks the final step on my side. The investigation, domain blocking, and any internal actions will now be handled entirely by Steam’s security team.

## Report Content
<[Open it here](https://help.steampowered.com/en/wizard/HelpRequest/?ticket=4AijpJxDugKEAQOBQoBuRgukfNSOAj21OrqwnZH%2Bj9mtO1nx98DD%2BBErZMj3oibG)>
`
  }
];

export const iocList = [
  { type: "Domain", indicator: "cs2-tournament-bracket[.]top", threat: "Phishing Landing Portal", status: "Offline / Sinkholed" },
  { type: "Domain", indicator: "vote-league-cup[.]com", threat: "Phishing Landing Portal", status: "Offline / Sinkholed" },
  { type: "ASN", indicator: "AS202425", threat: "Bulletproof Offshore VPS", status: "Flagged" },
  { type: "SSL", indicator: "Let's Encrypt R3 DV", threat: "Short-Lived Cert (<24h)", status: "Revoked" },
  { type: "Cookie", indicator: "steamLoginSecure", threat: "Session Token Hijack", status: "Critical" },
  { type: "Endpoint", indicator: "/api/v2/auth/steam_callback", threat: "Credential Harvesting C2", status: "Blocked" }
];
