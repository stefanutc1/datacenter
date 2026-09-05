# Technical Analysis: AST Deobfuscation & CI/CD Hardening

## Abstract Syntax Tree (AST) Inspection

The malicious script hid its intentions using nested `String.fromCharCode` expressions and hexadecimal variable identifiers:

```javascript
// Raw payload segment
const _0x4a12 = ['\x66\x73', '\x70\x61\x74\x68', '\x68\x6f\x6d\x65\x64\x69\x72'];
const _fs = require(_0x4a12[0]);
```

Using `@babel/parser` and AST transformation rules, string array indexing and hex representations were normalized to disclose all disk reads.

## CI/CD Pipeline Hardening Guidelines

1. **Disable Lifecycle Scripts in CI:**
   ```bash
   npm ci --ignore-scripts
   ```
2. **Lockfile Hash Verification:**
   Enforce deterministic integrity hashes in `package-lock.json` and reject unresolved transitive dependencies.
3. **Egress DNS Filtering:**
   Block UDP/TCP port 53 to arbitrary public DNS resolvers from CI runners, routing DNS requests through an internal logging resolver with query rate limiting.
