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
    summary: "Full forensic case study in English covering BitM attack mechanics, Family View hijack, and MITRE mapping.",
    content: `# Case Study: Forensic Analysis of an Adversary-in-the-Middle (AiTM) Attack on Steam OpenID Authentication

**Author:** stefanutc1
**Date:** 22 November 2025
**Classification:** TLP:CLEAR / Technical Cyber Threat Intelligence
**Target Analyzed:** Active phishing and account takeover campaign leveraging Browser-in-the-Middle (BitM) fake popups and real-time OpenID session relay.

---

## 1. Executive Summary

This case study documents an in-depth forensic investigation into an advanced Adversary-in-the-Middle (AiTM) phishing campaign targeting the competitive gaming ecosystem. Threat actors engineered deceptive tournament voting portals that lured victims into authenticating via a fraudulent Steam OpenID login mechanism.

The malicious infrastructure weaponized a high-fidelity Browser-in-the-Middle (BitM) popup interface to intercept OpenID 2.0 authentication handshakes in real time. Upon capturing valid Steam Guard TOTP codes and session cookies (steamLoginSecure, sessionid), the adversary automatically enabled a Family View PIN lockout to prevent owner recovery while provisioning Steam Web API keys to intercept and reroute digital inventory trade offers.`
  },
  {
    id: "technical-analysis-en",
    title: "Technical Analysis & Packet Breakdown (EN)",
    category: "Technical Specs",
    summary: "In-depth packet teardown, DOM window emulation, and exfiltration relay mechanics.",
    content: `## Technical Packet Analysis

1. DOM Window Emulation: The phishing landing page does not perform window.open() to a distinct tab; instead, it renders a draggable <div> equipped with simulated window controls and an address bar displaying https://steamcommunity.com/openid/login.
2. Real-Time Credential Relay: As the victim submits credentials, the client issues a background JSON POST to the AiTM backend C2.
3. Post-Authentication Weaponization:
   - Sets Family View PIN (4-digit code) via automated POST request.
   - Invokes /dev/apikey to register a rogue Steam Web API Key.
   - Subscribes to user trade events, automatically canceling outgoing legitimate trades and replacing them with attacker trades.`
  },
  {
    id: "case-study-ro",
    title: "Studiu de Caz Criminalistic (RO)",
    category: "Raport Tehnic",
    summary: "Raport complet de analiză criminalistică în limba română privind atacul AiTM Steam OpenID.",
    content: `# Studiu de Caz: Analiza Criminalistică a unui Atac AiTM pe Autentificarea Steam OpenID

**Autor:** stefanutc1
**Dată:** 22 Noiembrie 2025
**Clasificare:** TLP:CLEAR / Cyber Threat Intelligence

---

## 1. Sinteză Executivă

Acest studiu de caz documentează o investigație criminalistică aprofundată asupra unei campanii avansate de phishing AiTM. Actorii de amenințare au proiectat portaluri de vot false ce au exploatat mecanismul de autentificare Steam OpenID 2.0 prin intermediul unei ferestre simulate Browser-in-the-Middle (BitM).`
  }
];
