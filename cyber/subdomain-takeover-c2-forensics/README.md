# Subdomain Takeover & Phantom C2 Infrastructure Forensics

Maintainer: **@stefanutc1** | Classification: **TLP:CLEAR** | Standards: **ISO/IEC 27037:2012 · MITRE ATT&CK v14** | License: **MIT**

---

## 1. Purpose

This project investigates the exploitation of dangling DNS CNAME records pointing to decommissioned enterprise cloud resources (AWS S3 buckets, Azure App Services). Threat actors claim the abandoned cloud namespace under their own tenant, operating persistent Command and Control (C2) communication channels under the victim organization's verified apex domain to bypass perimeter egress firewalls and secure web gateways.

---

## 2. Scope

* **In Scope**:
  * Automated DNS zone file inspection and dangling CNAME identification.
  * Reproduction of cloud resource claiming on Azure App Services and AWS S3.
  * ACME HTTP-01 automated TLS certificate issuance via Let's Encrypt.
  * Detection engineering rules for Zeek network monitoring and Suricata.
* **Out of Scope**:
  * Unauthorized penetration testing against third-party non-consenting cloud tenants.

---

## 3. Architecture & Attack Lifecycle

```text
[ Authoritative DNS Server ]
       │ (Dangling CNAME: metrics.enterprise.internal -> corp-telemetry-legacy.azurewebsites.net)
       ▼
[ Threat Actor Claims Azure App Service: corp-telemetry-legacy ]
       │
[ Compromised Host (Beacon Agent) ]
       │
       ▼ (Performs DNS lookup for metrics.enterprise.internal)
[ Corporate Egress NextGen Firewall ]
       │ (Whitelists *.enterprise.internal based on verified domain reputation)
       ▼
[ Attacker Azure Tenant (20.119.45.18) ] ──► [ Stealthy C2 Channel Established ]
```

---

## 4. Input Artifacts & Indicators (IoCs)

| Indicator Type | Value | Provenance | Description |
| :--- | :--- | :---: | :--- |
| `domain-name` | `metrics.enterprise.internal` | FACT | Hijacked corporate subdomain |
| `cname-target` | `corp-telemetry-legacy.azurewebsites.net` | FACT | Orphaned cloud endpoint |
| `ipv4-addr` | `20.119.45.18` | FACT | Attacker Azure C2 hosting instance |
| `tls-serial` | `04:a9:8f:22:11:cc:99` | FACT | Let's Encrypt certificate obtained via HTTP-01 |

---

## 5. Output & Detection Signatures

* **Suricata Network Signature**:
  ```text
  alert dns $HOME_NET any -> any 53 (msg:"CYBER-LAB DNS Query to Known Orphaned Cloud Hostname"; dns.query; content:"corp-telemetry-legacy.azurewebsites.net"; sid:1000004; rev:1;)
  ```

---

## 6. Requirements & Reproduction

```bash
# Verify DNS CNAME resolution and inspect dangling responses
dig metrics.enterprise.internal CNAME +short

# Validate Suricata network signatures
python3 scripts/validate_suricata.py
```

---

## 7. Limitations & Remediation

* **Custom Domain Verification ID**: Configuring Azure Custom Domain Verification tokens (`asuid.<subdomain>`) prevents third parties from claiming unverified DNS names.
* **Automated DNS Drift Audits**: Periodic Route 53 / Cloudflare zone audits eliminate orphaned records before decommissioned services are released.
