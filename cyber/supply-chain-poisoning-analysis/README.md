# Software Supply Chain Poisoning & Malicious Post-Install Hooks

Maintainer: **@stefanutc1** | Classification: **TLP:CLEAR** | Standards: **ISO/IEC 27037:2012 · MITRE ATT&CK v14** | License: **MIT**

---

## 1. Purpose

This project documents a technical teardown of dependency confusion and typosquatted packages published to npm and PyPI. The malicious packages weaponize `package.json` `postinstall` lifecycle hooks to enumerate local environment variables, harvest developer secrets (`~/.aws/credentials`, `~/.ssh/id_rsa`), and exfiltrate data over chunked DNS queries (UDP 53) to bypass outbound HTTPS proxy inspection on CI/CD build servers.

---

## 2. Scope

* **In Scope**:
  * Abstract Syntax Tree (AST) deobfuscation of nested JavaScript payloads (`@babel/parser`).
  * Sandbox packet capture of chunked DNS tunneling exfiltration (UDP 53).
  * Authorship of YARA and Semgrep static analysis rules detecting suspicious lifecycle hooks.
* **Out of Scope**:
  * Compromise of public registry package publishing infrastructure.

---

## 3. Architecture & Exfiltration Flow

```text
[ Developer / CI/CD Runner: npm install cross-env-validator ]
       │
       ▼ (Executes postinstall hook: node ./lib/telemetry.js)
[ Local Secrets Enumeration ]
       │ (Scans ~/.aws/credentials, ~/.ssh/id_rsa, process.env)
       ▼
[ Chunked DNS Tunneling Engine ]
       │ (Encodes secrets into 30-byte chunks: {chunk}.{index}.c2-exfil-dns.org)
       ▼
[ Standard Outbound DNS Query (UDP 53) ] ──► [ Attacker Authoritative Nameserver ]
                                                   │
                                                   ▼
                                      [ Reassembles Credential Bundle ]
```

---

## 4. Input Artifacts & Indicators (IoCs)

| Indicator Type | Value | Provenance | Description |
| :--- | :--- | :---: | :--- |
| `package-name` | `cross-env-validator@1.4.2` | FACT | Malicious typosquatted npm package |
| `domain-name` | `c2-exfil-dns.org` | FACT | Authoritative DNS server for data exfiltration |
| `file-hash-sha256`| `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` | FACT | Payload script hash (`telemetry.js`) |
| `ipv4-addr` | `194.26.29.114` | FACT | Threat actor registry publishing IP |

---

## 5. Output & Detection Signatures

* **YARA Detection Signature**:
  ```text
  rule NPM_Malicious_Postinstall_Hook {
    meta:
      description = "Flags npm packages executing network operations in postinstall"
    strings:
      $hook = /"postinstall"\s*:\s*"node\s+[^"]+"/
      $net1 = "dgram" ascii
      $net2 = "dns" ascii
    condition:
      $hook and ($net1 or $net2)
  }
  ```

---

## 6. Defensive Countermeasures

1. **Disable Lifecycle Scripts in CI**: Run `npm ci --ignore-scripts`.
2. **Lockfile Hash Verification**: Enforce deterministic integrity hashes in `package-lock.json`.
3. **Egress DNS Filtering**: Block arbitrary outbound UDP/TCP 53 requests from build workers.
