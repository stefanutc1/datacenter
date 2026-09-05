# Datacenter Cyber Defense & Digital Forensics Suite

Această secțiune găzduiește investigațiile criminalistice digitale, studiile de caz pe atacuri reale și suita software de analiză Threat Intelligence integrată în Datacenter.

## 1. Investigații Criminalistice & Studii de Caz (Case Studies)

| Proiect / Director | Categorie | Statut | Focus Primar | Scop Tehnic |
| :--- | :--- | :---: | :--- | :--- |
| [`openid-mitm-phishing-forensics/`](./openid-mitm-phishing-forensics) | Digital Forensics | **Finalizat** | BitM, OpenID 2.0 | Investighează campanii BitM cu ferestre simulate de browser pentru furt de token-uri de sesiune Steam OpenID și lock cont cu PIN Family View. |
| [`revolut-vishing-forensics/`](./revolut-vishing-forensics) | Digital Forensics | **Finalizat** | SIP, Caller ID Spoofing | Reconstrucție operațiune vishing prin falsificare numere asistență pe trunchiuri internaționale SIP și interceptare 3DS în timp real. |
| [`task-scam-infrastructure-analysis/`](./task-scam-infrastructure-analysis) | Threat Intel & Forensics | **Finalizat** | Task-Scam, API Leakage | Analiză detaliată a topologiei C2, API-urilor expuse și fluxurilor de spălare de fonduri crypto din spatele rețelelor de task-farming. |
| [`tiktok-mrr-scam-infrastructure/`](./tiktok-mrr-scam-infrastructure) | Threat Intel & Forensics | **Finalizat** | MRR Fraud, Funnels | Demascarea funnel-urilor automate de inducere în eroare și a schemelor de recurență frauduloasă din social media. |
| [`bgp-hijacking-crypto-forensics/`](./bgp-hijacking-crypto-forensics) | Network Forensics | **Finalizat** | BGP Route Hijack, RPKI | Investigare detaliată a deturnării de prefixe BGP AS-Path pentru interceptare și golire portofele de criptomonede. |
| [`fido2-cookie-bypass-forensics/`](./fido2-cookie-bypass-forensics) | Identity & Auth | **Finalizat** | FIDO2 / WebAuthn, Infostealer | Analiză criminalistică a tehnicilor de ocolire a autentificării fără parolă (FIDO2) prin exfiltrare directă de cookie-uri de sesiune. |
| [`ransomware-pre-execution-triage/`](./ransomware-pre-execution-triage) | Endpoint DFIR | **Finalizat** | Ransomware Triage, Memory DFIR | Metodologie și proceduri rapide de triage pre-execuție pe endpoint-uri compromise de tulpini moderne de ransomware. |
| [`subdomain-takeover-c2-forensics/`](./subdomain-takeover-c2-forensics) | Cloud Security | **Finalizat** | Dangling DNS, C2 Infrastructure | Reconstrucție incident de preluare a subdomeniilor orfane pe Cloud / CDN pentru găzduirea infrastructurii de comandă și control. |
| [`supply-chain-poisoning-analysis/`](./supply-chain-poisoning-analysis) | Software Security | **Finalizat** | Dependency Confusion, Typosquatting | Analiză a vectorilor de otrăvire a lanțului de aprovizionare software (npm/PyPI) și tehnici de injectare payload malițios. |
| [`ctf/`](./ctf) | Security Training | **Activ** | CTF Writeups & Templates | Colecție de soluții, șabloane de documentare și metodologii aplicate în competiții Capture The Flag. |

---

## 2. Suită de Instrumente & Analizoare Automatizate (`toolkit/`)

Suita de analiză automată oferă componente CLI și biblioteci Python modulare pentru investigatori:

- **`analyzers/`**: Detecție BitM (`aitm_detector.py`), fraudă telefonie SIP (`telephony_fraud_detector.py`), analiză infrastructură task scam (`task_scam_analyzer.py`), deobfuscator cod malițios (`deobfuscator.py`), audit AD (`active_directory_analyzer.py`).
- **`core/`**: Verificare integritate dovezi criptografice (SHA-256, hashing), provenance, modele de date unificate (`models.py`) și conformitate TLP / CoC.
- **`parsers/`**: Parsare EVTX Sysmon, artefacte MFT / Prefetch, fișiere PE / metadata binară, PCAP SIP/VoIP, dump-uri de memorie Volatility.
- **`rules/`**: Motoare de evaluare YARA, Sigma, Suricata IDS/IPS și interogare Osquery.
- **`correlation/`**: Motor de corelare grafică și generare cronologică a lanțului de atac (attack timeline & graph).
- **`exporters/`**: Export rapoarte în formate STIX 2.1, SQLite, CSV și liste de blocare firewall (OPNsense / Proxmox).
- **`scripts/`**: Validatoare automate pentru reguli Sigma (`validate_sigma.py`), STIX (`validate_stix.py`), Suricata (`validate_suricata.py`) și YARA (`validate_yara.py`).
- **`tests/`**: Teste unitare și suite de fixtures pentru validare continuă (CI/CD).

---
*Integrat în Datacenter IaC, Observability & Enterprise Security Architecture.*
