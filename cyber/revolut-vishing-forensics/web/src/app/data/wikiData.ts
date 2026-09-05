export interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
}

export const articles: Article[] = [
  {
    id: "case-study-en",
    title: "Executive Case Study (EN)",
    category: "Forensic Report",
    summary: "Full forensic case study in English covering SIP caller ID spoofing and 3DS OTP relay timing.",
    content: `# Case Study: Forensic Analysis of Voice Phishing (Vishing) & Telephony Fraud Targeting Revolut Users

**Author:** stefanutc1
**Date:** 10 August 2026
**Classification:** TLP:CLEAR / Financial Cyber Threat Intelligence
**Target Analyzed:** Active telephony spoofing, SMS pretexting, and real-time reverse proxy infrastructure targeting digital banking accounts.

---

## 1. Executive Summary

This case study provides a technical teardown of an aggressive Voice Phishing (Vishing) campaign targeting digital banking users. Threat actors leveraged SIP VoIP Caller ID Spoofing to impersonate official anti-fraud representatives, manufacturing urgent security pretexts.

Victims were guided to dynamically cloned banking verification portals that harvested Primary Account Numbers (PAN), CVVs, and expiry dates. The backend infrastructure intercepted real-time SMS One-Time Passwords (OTP / 3D Secure) and coerced victims into approving in-app biometric push notifications in under 5 seconds to execute fraudulent SEPA Instant transfers.`
  },
  {
    id: "technical-analysis-en",
    title: "Technical Packet Analysis & SIP Headers (EN)",
    category: "Technical Specs",
    summary: "SIP packet signaling breakdown, P-Asserted-Identity forging, and sub-5-second 3DS OTP injection.",
    content: `## Technical Packet Analysis

1. Telephony Carrier Spoofing: Attackers routed calls through unverified international SIP wholesale carriers manipulating P-Asserted-Identity and From headers.
2. Sub-5-Second Relay Engine: Real-time injection of harvested card PAN and SMS OTP codes into genuine banking transactions within the active 3DS verification window.
3. Social Engineering Escalation: Pretexting victims into approving biometric push notifications under the false claim of cancelling unauthorized transactions.`
  },
  {
    id: "case-study-ro",
    title: "Studiu de Caz Criminalistic (RO)",
    category: "Raport Tehnic",
    summary: "Raport complet de analiză criminalistică în limba română privind atacurile de tip Vishing Revolut.",
    content: `# Studiu de Caz: Analiza Criminalistică a Atacurilor de Tip Vishing & Fraudei Telefonice Revolut

**Autor:** stefanutc1
**Dată:** 10 August 2026
**Clasificare:** TLP:CLEAR / Cyber Threat Intelligence

---

## 1. Sinteză Executivă

Acest studiu de caz documentează o investigație detaliată asupra campaniilor de Voice Phishing ce au vizat utilizatorii de servicii FinTech din România și Uniunea Europeană prin intermediul spoofing-ului de numere SIP și a portalurilor de verificare clonate.`
  }
];
