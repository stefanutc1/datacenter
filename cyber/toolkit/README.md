# Cyber — Zero-Dependency Python Security & Forensics Toolkit

`cyber` is a modular Python 3.10+ security engineering and digital forensics automation library designed for air-gapped incident response, cryptographic evidence custody, log analysis, threat intelligence export, and artifact deobfuscation.

Maintainer: **@stefanutc1** | License: **MIT** | Dependencies: **Zero (Python Standard Library Only)**

---

## 1. Design Principles

* **Zero External Dependencies**: Implemented entirely with Python standard library modules (`hashlib`, `struct`, `sqlite3`, `json`, `csv`, `tarfile`, `argparse`, `dataclasses`). It can be copied directly to minimal Linux, Windows, or macOS analysis hosts without internet connectivity.
* **Deterministic Execution**: Cryptographic hashing (SHA-256 / SHA-512) and evidence serialization follow ISO/IEC 27037:2012 guidelines.
* **Standardized Formats**: Direct serialization to OASIS STIX 2.1 JSON, SQLite forensic databases, and firewall drop scripts.

---

## 2. Module Architecture

```text
cyber/
├── analyzers/         # Specialized investigation engines (AiTM relay, telephony vishing, task scam, payload deobfuscator)
├── core/              # Common data models, evidence hashing, ISO 27037 compliance evaluator, provenance tracking
├── correlation/       # Graph correlation engine and cross-incident entity linker
├── exporters/         # STIX 2.1 JSON, SQLite database, and firewall rule serializers
├── osint/             # Passive DNS and domain enrichment utilities
├── parsers/           # Sysmon EVTX, SIP VoIP, OpenID tokens, PE binary headers, MFT records, and Volatility dumps
├── reporters/         # Structured Markdown and JSON incident report generators
├── rules/             # Rule evaluators for Sigma YAML, YARA signatures, Suricata network rules, and Osquery SQL packs
└── triage/            # Live volatile state acquisition and signed tar.gz packaging collector
```

---

## 3. CLI Subcommands Reference

### Cryptographic Hashing (`cyber hash`)
```bash
python3 -m cyber hash <file_path> [--json] [--sha512]
```
Computes deterministic SHA-256, SHA-512, and MD5 checksums alongside file metadata adhering to ISO/IEC 27037 digital custody standards.

### Manifest Verification (`cyber verify`)
```bash
python3 -m cyber verify <manifest_json>
```
Validates evidence directories against previously signed JSON manifests to detect file tampering or corruption.

### Volatile Triage Acquisition (`cyber triage`)
```bash
python3 -m cyber triage [--output <dir>]
```
Acquires live volatile state (process tree, network connections, open sockets, logged-in users, kernel modules) and packages them into a `.tar.gz` archive with an automated SHA-256 evidence manifest.

### Payload Deobfuscation (`cyber deobfuscate`)
```bash
python3 -m cyber deobfuscate <payload_string_or_file>
```
Deobfuscates multi-stage PowerShell Base64 (`-enc`), JavaScript `String.fromCharCode` sequences, and hex escapes, extracting embedded IP addresses, domains, and URLs.

### PE Binary Header Parser (`cyber pe-meta`)
```bash
python3 -m cyber pe-meta <binary_path>
```
Parses DOS/PE headers, section characteristics, machine architectures (x86/x64/ARM), and compilation timestamps without third-party dependencies (`pefile`).

### Threat Hunting Query Packs (`cyber osquery`)
```bash
python3 -m cyber osquery [--category <persistence|credentials|network>]
```
Outputs curated Osquery SQL query packs targeting `LD_PRELOAD` shared library hijacks, hidden cron reverse shells, memory-backed systemd units, and deleted on-disk executables.

### Evidence Compliance Matrix (`cyber compliance`)
```bash
python3 -m cyber compliance
```
Validates investigation files against the ISO/IEC 27037:2012 compliance matrix (Clause 6.2 Hashing, Clause 6.3 Chain of Custody, Clause 6.4 Tool Determinism).

### Firewall Rule Generator (`cyber firewall`)
```bash
python3 -m cyber firewall <ioc_json_or_stix> [--format <iptables|ufw|nftables>]
```
Compiles extracted IP and CIDR indicators into production firewall drop scripts.

---

## 4. Programmatic API Example

```python
from cyber.core.hashing import EvidenceHasher
from cyber.parsers.pe_metadata_parser import PeMetadataParser
from cyber.analyzers.deobfuscator import PayloadDeobfuscator

# Compute evidence checksums
hasher = EvidenceHasher()
evidence = hasher.register_evidence("sample.exe")
print(f"SHA-256: {evidence.sha256}")

# Extract PE binary compilation timestamp
parser = PeMetadataParser()
meta = parser.parse_file("sample.exe")
print(f"Compiled at: {meta.compile_timestamp_utc} (Architecture: {meta.machine_architecture})")

# Deobfuscate PowerShell commands
deobfuscator = PayloadDeobfuscator()
result = deobfuscator.deobfuscate("powershell.exe -enc SQBuAHYAbwBrAGUALQ...==")
print(f"Decoded: {result.decoded_payload}")
print(f"Extracted Indicators: {result.extracted_indicators}")
```

---

## 5. Testing & Validation

The toolkit maintains 100% test pass rate across 32 unit tests:

```bash
python3 -m unittest discover tests -v
```
