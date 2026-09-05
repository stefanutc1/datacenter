# BGP Prefix Hijacking & Authoritative DNS Cache Poisoning

Maintainer: **@stefanutc1** | Classification: **TLP:CLEAR** | Standards: **ISO/IEC 27037:2012 · MITRE ATT&CK v14** | License: **MIT**

---

## 1. Purpose

This project reconstructs an unauthorized BGP announcement where a rogue Autonomous System (AS200114) advertised a specific `/24` prefix covering the authoritative DNS resolvers of a decentralized cryptocurrency exchange. The fake resolver served poisoned DNS records, routing users to a clone portal executing token drainage smart contracts.

---

## 2. Scope

* **In Scope**:
  * Correlation of MRT routing update tables from RIPE RIS and RouteViews collectors.
  * AS_PATH prepending and propagation timing analysis.
  * Smart contract transaction tracing on the Ethereum blockchain.
  * RPKI Route Origin Validation (ROV) and ROA configuration guidelines.
* **Out of Scope**:
  * Direct physical takeover of Tier-1 telecom backbone routers.

---

## 3. Architecture & Hijack Dynamics

```text
[ Rogue AS200114 (198.51.100.0/24) ]
       │ (Announces more specific prefix over legitimate /20)
       ▼
[ Tier-1 Transit Telecom ISP ] ── (Lacks RPKI Validation -> Propagates Route)
       │
       ▼ (Longest Prefix Match directs DNS lookups)
[ Attacker Poisoned DNS Resolver ]
       │ (Returns poisoned IP: 195.138.22.99)
       ▼
[ Victim Trader ] ──► [ Phishing Web App ] ──► [ Malicious Token Drainer Contract ]
```

---

## 4. Input Artifacts & Indicators (IoCs)

| Indicator Type | Value | Provenance | Description |
| :--- | :--- | :---: | :--- |
| `bgp-prefix` | `198.51.100.0/24` | FACT | Unauthorized specific BGP prefix announcement |
| `autonomous-system` | `AS200114` | FACT | Threat actor origin Autonomous System |
| `ipv4-addr` | `195.138.22.99` | FACT | Poisoned web server destination |
| `smart-contract` | `0x742d35Cc6634C0532925a3b844Bc454e4438f44e` | FACT | Malicious token drainage contract |

---

## 5. Defensive Countermeasures

1. **RPKI Route Origin Authorization (ROA)**: Create signed ROAs in regional registries (RIPE, ARIN) with strict `maxLength` constraints.
2. **BGP Route Monitoring**: Implement real-time BGPStream / BGPmon alerting for unexpected origin ASN transitions.
