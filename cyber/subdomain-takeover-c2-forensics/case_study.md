# Case Study: Subdomain Takeover on Orphaned Cloud Namespaces for Stealthy C2

**Author:** @stefanutc1
**Date:** 03 March 2026
**Classification:** TLP:CLEAR / Technical Cyber Threat Intelligence
**Target Analyzed:** Dangling DNS record on `metrics.enterprise.internal` resolving to unclaimed Azure App Service namespace.

---

## 1. Executive Summary

This investigation analyzed a targeted C2 deployment that leveraged an orphaned DNS CNAME pointer (`metrics.enterprise.internal -> corp-telemetry-legacy.azurewebsites.net`). Because the Azure App Service was decommissioned months prior without removing the DNS record from Route 53, threat actors registered a new Azure tenant under the identical application name.

By doing so, the adversary obtained full control over HTTP/HTTPS traffic routed to `metrics.enterprise.internal`, bypassing corporate perimeter egress firewalls that whitelist `*.enterprise.internal` traffic.

---

## 2. Technical Evidence

1. **DNS Query Inspection:**
   ```bash
   dig metrics.enterprise.internal CNAME +short
   # Output: corp-telemetry-legacy.azurewebsites.net.
   ```
2. **HTTP Response Status Pre-Takeover:**
   `404 Web Site not found` (Standard Azure App Service unclaimed tenant error).
3. **HTTP Response Post-Takeover:**
   `200 OK` serving custom HTTPS API endpoints receiving beacon telemetry.

---

## 3. Indicators of Compromise

| Indicator Type | Value | Provenance | Description |
| :--- | :--- | :--- | :--- |
| Domain | `metrics.enterprise.internal` | FACT | Hijacked corporate subdomain |
| CNAME Target | `corp-telemetry-legacy.azurewebsites.net` | FACT | Orphaned cloud endpoint |
| IPv4 | `20.119.45.18` | FACT | Attacker Azure instance IP |
| TLS Serial | `04:a9:8f:22:11:cc:99` | FACT | Let's Encrypt certificate obtained via HTTP-01 |

---

## 4. MITRE ATT&CK Mapping

- **T1584.004:** Compromise Infrastructure: Server
- **T1583.001:** Acquire Infrastructure: Domains
- **T1071.001:** Application Layer Protocol: Web Protocols
