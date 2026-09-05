# Datacenter Cyber Defense & Digital Forensics

Această secțiune găzduiește cele 4 investigații criminalistice digitale majore și analize avansate de infrastructură de atac cibernetic integrate în cadrul **Datacenter**:

---

## Proiecte & Investigații Criminalistice

| Proiect / Director | Categorie | Statut | Vector de Atac & Focus | Descriere Tehnică & Rezultate |
| :--- | :--- | :---: | :--- | :--- |
| [`openid-mitm-phishing-forensics/`](./openid-mitm-phishing-forensics) | Digital Forensics | **Finalizat** | Browser-in-the-Middle (BitM), OpenID 2.0 | Investighează o campanie activă de phishing care desenează o fereastră de browser simulată în interiorul paginii web (DOM injection) pentru a captura token-uri de sesiune Steam OpenID și a bloca contul folosind PIN-uri Family View. Include deobfuscare JavaScript, analize de payload și reguli de detecție Suricata. |
| [`revolut-vishing-forensics/`](./revolut-vishing-forensics) | Digital Forensics | **Finalizat** | SIP Telephony Fraud, Caller ID Spoofing | Reconstruiește o operațiune complexă de inginerie socială telefonică prin care atacatorii au falsificat numerele de suport bancar pe trunchiuri internaționale VoIP/SIP pentru a intercepta coduri de autorizare 3D Secure în timp real. Include diagrame de flux call-flow SIP, extragere metadate PCAP și IOCs. |
| [`task-scam-infrastructure-analysis/`](./task-scam-infrastructure-analysis) | Threat Intel & Forensics | **Finalizat** | C2 Architecture, Leaky APIs, Crypto Laundering | Analiză profundă asupra arhitecturii de rețea, API-urilor backend expuse neautorizat și schemelor de spălare de bani cripto (USDT pe TRC-20) din spatele platformelor frauduloase de task-farming. Include mapare OSINT, grafuri de relații și dovezi criminalistice extrase. |
| [`tiktok-mrr-scam-infrastructure/`](./tiktok-mrr-scam-infrastructure) | Threat Intel & Forensics | **Finalizat** | Monthly Recurring Revenue Fraud, Funnels | Demascarea funnel-urilor automate de inducere în eroare și a schemelor de recurență frauduloasă din rețelele sociale. Analizează tehnicile de cloaking, fingerprinting de browser și manipularea gateway-urilor de plată folosite pentru taxarea neautorizată a victimelor. |

---

## Integrare cu Arhitectura Datacenter

Rezultatele, regulile și indicatorii de compromitere (IoCs) rezultați din aceste investigații alimentează direct stiva defensivă a Datacenter-ului:
- **Suricata IDS/IPS pe OPNsense**: Reguli custom extrase din semnăturile de trafic BitM și SIP spoofing.
- **Wazuh SIEM & SOAR (CT 100)**: Decodoare și reguli de alertare pentru încercări de autentificare anormale și token hijacking.
- **T-Pot Honeypot Cluster (VM 213)**: Mediu de capcană în DMZ pentru colectarea de noi mostre de payload și maparea automată a adreselor IP atacatoare.
- **Remnux Reverse Engineering (VM 218)**: Laborator izolat de analiză binară și deobfuscare dinamică de cod malițios.

---
*Integrat în Datacenter IaC, Observability & Enterprise Security Architecture.*
