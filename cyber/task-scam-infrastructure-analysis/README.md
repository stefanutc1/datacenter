# Task Scam Platform API Exposure & TRC-20 Drainage Teardown

Maintainer: **@stefanutc1** | Classification: **TLP:CLEAR** | Standards: **ISO/IEC 27037:2012 · MITRE ATT&CK v14** | License: **MIT**

---

## 1. Purpose

This project documents the comprehensive forensic reverse engineering of an active Task Scam platform (a hybrid Pig Butchering investment fraud operation). Through traffic interception and backend API analysis, this investigation exposed hard technical proof of premeditated financial theft: an unauthenticated `/api/v1/site/config` endpoint disclosing hardcoded fiat withdrawal kill-switches (`withdrawMethodBank: false`, `withdrawMethodRevolut: false`), confirming that all fiat payout UI elements were cosmetic decoys.

---

## 2. Scope

* **In Scope**:
  * Interception and decoding of Vue.js frontend REST API calls via Burp Suite.
  * Audit of backend configuration endpoints (`/api/v1/site/config`) and authentication routes (`/api/v1/user/auth/*`).
  * SQL Injection vulnerability assessment on `invite_code` and `username` input fields.
  * Tracking of cryptocurrency deposit consolidation on the TRON blockchain (TRC-20 USDT).
* **Out of Scope**:
  * Unauthenticated remote code execution on the backend production server.
  * Seizure of threat actor multi-signature cryptocurrency wallets.

---

## 3. Architecture & Data Flow

```text
[ Victim User ]
       │
       ▼ (Registers via invite code: 888888)
[ Vue.js Frontend Application ]
       │
       ├─► Queries unauthenticated /api/v1/site/config
       │   (Discloses: withdrawMethodBank: false, defaultCountryCode: "+40")
       │
       ▼ (Lured by fabricated earnings into funding account)
[ USDT TRC-20 Deposit Requirement ]
       │
       ▼ (Victim transfers cryptocurrency)
[ Attacker Consolidation Wallet ] ──► [ Laundering via Mixers / Bridges ]
       │
       ▼ (Victim attempts fiat withdrawal)
[ Permanent Block ] ──► "Compliance tax / VIP unlock required"
```

---

## 4. Input Artifacts & Indicators (IoCs)

| Indicator Type | Value | Provenance | Description |
| :--- | :--- | :---: | :--- |
| `api-endpoint` | `/api/v1/site/config` | FACT | Unauthenticated operational configuration leak |
| `api-endpoint` | `/api/v1/user/auth/register` | FACT | Account creation endpoint requiring invite code |
| `api-endpoint` | `/api/v1/task/submit` | FACT | Simulated review submission handler |
| `invite-code` | `888888` | FACT | Operator recruitment tracking identifier |
| `country-lock` | `+40` | FACT | Geographic segmentation parameter targeting Romania |

---

## 5. Output & Detection Signatures

* **YARA Detection Signature**:
  ```text
  rule Web_TaskScam_Config_Leak {
    meta:
      description = "Matches task scam configuration patterns"
    strings:
      $s1 = "withdrawMethodBank" ascii
      $s2 = "withdrawMethodRevolut" ascii
      $s3 = "minDepositUSDT" ascii
    condition:
      all of them
  }
  ```

---

## 6. Requirements & Reproduction

```bash
# Analyze task scam evidence and generate STIX 2.1 bundle
python3 -m cyber analyze task-scam-infrastructure-analysis/case_study.md \
  --title "Task Scam Infrastructure Investigation" \
  --stix stix-task-scam.json \
  --sqlite evidence-task-scam.db

# Validate YARA signature syntax
python3 scripts/validate_yara.py
```

---

## 7. Limitations & Scope Boundaries

* **Mixer Transactions**: Subsequent on-chain cryptocurrency movements utilized nested mixer transactions and cross-chain bridges, obscuring final off-ramp exchange identities.
