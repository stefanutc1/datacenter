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
    summary: "Full forensic case study in English covering API disclosures, kill-switch proof, and SQLi surfaces.",
    content: `# Case Study: Reverse Engineering & Vulnerability Assessment of Task Scam Infrastructure

**Author:** stefanutc1
**Date:** 17 April 2026
**Classification:** TLP:CLEAR / Financial Cyber Threat Intelligence
**Target Analyzed:** Fraudulent Task Scam / Pig Butchering platform exploiting fabricated e-commerce evaluation tasks.

---

## 1. Executive Summary

This case study documents the comprehensive forensic reverse engineering of an active Task Scam platform. Through API traffic interception and endpoint analysis, this investigation exposed hard technical proof of premeditated financial theft:
- The /api/v1/site/config endpoint contained a hardcoded withdrawal kill-switch (withdrawMethodBank: false, withdrawMethodRevolut: false).
- Strict geographic campaign locks targeting Romanian mobile numbers (+40).
- Systemic backend security vulnerabilities, including unauthenticated configuration disclosure and SQL Injection surfaces.`
  },
  {
    id: "technical-analysis-en",
    title: "Technical Analysis & SQLi Breakdown (EN)",
    category: "Technical Specs",
    summary: "API configuration exposure, blind SQL injection proof, and client-side canvas fingerprinting.",
    content: `## Technical Packet Analysis

1. Backend API Disclosure (/api/v1/site/config): Unauthenticated JSON response confirming hardcoded disabled fiat withdrawals and mandatory TRC-20 USDT deposit rails.
2. SQL Injection Surface: Raw string concatenation in the invite_code and username authentication parameters.
3. Client-Side Device Fingerprinting: Canvas rendering hash generation and CPU core inspection persisted in localStorage to detect security analysts.`
  },
  {
    id: "case-study-ro",
    title: "Studiu de Caz Criminalistic (RO)",
    category: "Raport Tehnic",
    summary: "Raport complet de analiză criminalistică în limba română privind platformele de tip Task Scam.",
    content: `# Studiu de Caz: Inginerie Inversă & Analiza Vulnerabilităților Platformelor de Tip Task Scam

**Autor:** stefanutc1
**Dată:** 17 Aprilie 2026
**Clasificare:** TLP:CLEAR / Cyber Threat Intelligence

---

## 1. Sinteză Executivă

Acest studiu de caz documentează deconstrucția tehnică a unei platforme active de fraudă financiară (Task Scam / Pig Butchering). Analiza de trafic a demonstrat existența unui kill-switch hardcodat pe retragerile bancare și vulnerabilități critice de tip SQL Injection.`
  }
];
