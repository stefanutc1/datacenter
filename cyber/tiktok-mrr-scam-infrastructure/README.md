# Investigation Report: Master Resell Rights (MRR) & Automated LLM Digital Marketing Funnel Schemes

| Parameter | Specification |
| :--- | :--- |
| **Classification** | `TLP:CLEAR` |
| **Standards Compliance** | ISO/IEC 27037:2012 (Digital Evidence Handling), RFC 9116 |
| **Investigation Timeline** | 19 sequential investigation commits spanning 14.06.2025 to 19.04.2026 |
| **Primary Incident Date** | 2025-06-14 (Abuse Escalation Dispatched: 2026-04-18) |
| **Target Demographics** | Romania, Eastern Europe, and Balkan Regional Userbase |
| **Primary Platforms** | TikTok (Algorithmic Funnels), Stan.store (Hosting), Stripe / PayPal (Settlement) |
| **MITRE ATT&CK Mapping** | T1566.002 (Spearphishing Link), T1583.008 (Financial Intermediary Abuse) |
| **Author** | `@stefanutc1` |

---

## 1. Executive Summary

This investigation analyzes the technical mechanics, content generation pipelines, and payment processing infrastructure behind widespread "Master Resell Rights" (MRR) digital marketing operations promoted across social video platforms (predominantly TikTok).

The business model relies on deceptive social engineering and algorithmic lifestyle baiting to sell generic, unvetted e-books and video courses generated automatically via large language models (ChatGPT, Claude). The core mechanism constitutes a recursive pyramid-style financial scheme: purchasers do not acquire actionable commercial or technical skills, but rather the license to resell the exact same generic course package to subsequent downstream buyers.

Following an incident observed on June 14, 2025 where a personal acquaintance was defrauded, forensic analysis of the host infrastructure and payment gateways was conducted across 19 investigative commits between 14.06.2025 and 19.04.2026. Formal Terms of Service (ToS) and FTC compliance abuse reports were filed with the hosting provider (`Stan.store`), the merchant acquirer (`Stripe Integrity Team`), and `PayPal Dispute Resolution`.

---

## 2. Infrastructure & Delivery Chain

```
[ TikTok Algorithmic Feed ]
   |-- Synthetic AI Voiceover & Stock Lifestyle Video
   |-- High-Velocity Organic Engagement Hooks ("Get Rich Quick", "Passive Income")
   v
[ Bio Link Redirection ]
   |-- Shortlinks / Custom Subdomains
   v
[ Hosting & Funnel Provider: Stan.store ]
   |-- One-Click Checkout Lander ($47 - $497 Tiers)
   |-- Terms of Service Deceptive Practices Violation
   v
[ Payment Gateway Settlement ]
   |-- Stripe Connect / PayPal Merchant Accounts
   v
[ Digital Product Delivery ]
   |-- Generic LLM-Generated PDF / Video Archive
   |-- Master Resell Rights (MRR) Reseller Contract
   v
[ Recursive Cycle: Purchaser Re-deploys Clone Store ]
```

---

## 3. Investigation Documents

* [`case_study.md`](case_study.md): Comprehensive incident timeline, abuse reporting artifacts, and legal/technical analysis.
* [`funnel_analysis.md`](funnel_analysis.md): Algorithmic exploitation, click-through optimization, and synthetic media generation pipelines.
* [`llm_course_synthesis.md`](llm_course_synthesis.md): Textual analysis and plagiarism metrics proving automated LLM synthesis across sold materials.
* [`payment_gateway_abuse.md`](payment_gateway_abuse.md): Merchant onboarding bypasses, chargeback mitigation tricks, and payment processor ToS violations.
* [`prevention_guide.md`](prevention_guide.md): Actionable defense guide, red flag identification, chargeback procedures, and reporting pipelines.

---

## 4. Key Indicators & Funnel Artifacts

| Indicator Type | Value / Pattern | Provenance | Description |
| :--- | :--- | :--- | :--- |
| **Domain** | `stan.store/*` | FACT | Primary merchant funnel hosting recursive MRR storefronts |
| **Payment Gateway** | `Stripe Connect (acct_*)` | FACT | Sub-merchant payment routing bypassing direct compliance review |
| **Payment Gateway** | `PayPal Business API` | FACT | Secondary checkout option with immediate digital delivery waiver |
| **Document Hash** | `e7c8491a...` (SHA-256) | FACT | Common base MRR "Roadmap / Digital Blueprint" generic PDF payload |
| **Funnel Pattern** | `MRR Course Tier 1 ($47 - $497)` | FACT | Arbitrary price anchoring with 100% resale commission incentives |

---

## 5. Defensive Prevention Summary

1. **Verify Verifiable Provenance**: Legitimate educational material provides accredited instructor credentials, syllabus transparency, and verifiable business track records rather than generic "earn money by selling this course" hooks.
2. **Scrutinize MRR Licensing Clauses**: If a product's primary selling proposition is that you earn 100% profit by reselling the course itself, it is structurally a recursive pyramid scheme.
3. **Execute Immediate Chargeback Actions**: Transactions on Stan.store, Stripe, or PayPal should be disputed under "Product Significantly Not As Described" / "Deceptive Business Practices" using evidence of LLM-generated generic content and deceptive marketing.
