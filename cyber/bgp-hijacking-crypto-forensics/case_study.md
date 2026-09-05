# Case Study: BGP Prefix Hijacking of Authoritative DNS Infrastructure

**Author:** @stefanutc1
**Date:** 19 June 2026
**Classification:** TLP:CLEAR / Technical Cyber Threat Intelligence
**Target Analyzed:** Unauthorized BGP announcement of prefix `198.51.100.0/24` by AS200114.

---

## 1. Executive Summary

This case study reconstructs a major BGP prefix hijacking event. AS200114 announced an unauthorized `/24` prefix covering the authoritative DNS resolvers of a cryptocurrency decentralized exchange (DEX). Because BGP uses longest prefix match routing, upstream Tier-1 ISPs without RPKI Route Origin Validation propagated the hijacked route globally within 90 seconds.

The rogue DNS resolvers answered lookups for `app.crypto-swap.io` with an attacker-controlled IP address (`195.138.22.99`), serving a clone web application that prompted users to sign malicious token drainer smart contract transactions.

---

## 2. Route Hijack Telemetry

- **Target Legitimate Route:** `198.51.96.0/20` (Origin: AS16509, Amazon Route 53)
- **Malicious Specific Route:** `198.51.100.0/24` (Origin: AS200114)
- **Propagation Time:** 94 seconds to reach 68% of global BGP tables.
- **Duration of Hijack:** 22 minutes before upstream transit peer applied BGP route withdrawal.

---

## 3. Indicators of Compromise

| Indicator Type | Value | Provenance | Description |
| :--- | :--- | :--- | :--- |
| Hijacked Prefix | `198.51.100.0/24` | FACT | BGP prefix announced by rogue AS |
| Rogue ASN | `AS200114` | FACT | Threat actor origin Autonomous System |
| IPv4 | `195.138.22.99` | FACT | Poisoned web server destination |
| Smart Contract | `0x742d35Cc6634C0532925a3b844Bc454e4438f44e` | FACT | Malicious token drainage contract |

---

## 4. MITRE ATT&CK Mapping

- **T1584.004:** Compromise Infrastructure: Server
- **T1557.001:** Adversary-in-the-Middle
- **T1565.002:** Data Manipulation: Transmitted Data Manipulation
