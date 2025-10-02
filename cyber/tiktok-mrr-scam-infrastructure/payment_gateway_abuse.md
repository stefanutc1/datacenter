# Payment Gateway Infrastructure & Merchant Underwriting Exploitation

| Component | Exploitation Mechanism |
| :--- | :--- |
| **Platform Gateway** | Stripe Connect Custom Accounts via Stan.store |
| **Alternative Processors** | PayPal Merchant Services, Whop, Direct Crypto Invoicing |
| **Underwriting Bypass** | Parent platform merchant umbrella shielding sub-merchants from standard MCC 8299 / MCC 5968 audit |
| **Chargeback Evasion** | Immediate fulfillment claim + buried no-refund statutory waivers |

---

## 1. Stripe Connect Sub-Merchant Routing

Stan.store operates as a software platform using **Stripe Connect**. 

When an individual operator launches a storefront:
1. They complete an automated Express/Custom onboarding workflow.
2. The sub-merchant does not undergo rigorous individual compliance underwriting for high-risk digital products (typically required for multi-level marketing or business opportunity offers under Visa/Mastercard rules).
3. Payments are processed under the aggregated reputation of the host platform, delaying automated fraud scoring triggers until aggregate dispute ratios exceed network thresholds (0.9% dispute-to-transaction ratio).

---

## 2. Consumer Deception via Terms of Service Waivers

Storefronts frequently embed illegal waiver clauses:

> *"Due to the immediate digital nature of this product, all sales are final. By completing this purchase, you expressly waive any right of withdrawal or refund provided under local consumer protection laws."*

Under EU Directive 2011/83/EU (Consumer Rights Directive) and national transpositions (e.g., OUG 34/2014 in Romania), digital content waivers are only legally valid if the seller provides genuine, lawful goods and transparent pre-contractual information. In cases of deceptive marketing and fraudulent misrepresentation (selling a pyramid scheme as an educational course), statutory withdrawal waivers are null and void.
