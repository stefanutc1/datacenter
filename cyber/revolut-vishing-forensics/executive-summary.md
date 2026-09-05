# Executive Summary

* **Incident Type**: Vishing & Phishing Campaign (Revolut Impersonation)

* **Target Region**: Romania

* **Date of Activity**: 10 August 2026

* **Vector**: Social engineering via burner telephone numbers (at August 10,2026 with `0749...` range) combined with alternative TLD phishing links or URL shorteners.

---

# Technical Analysis

## 1. Attack Vector & Methodology

* **Initial Contact (Vishing)**: Attackers utilize automated or manual calls from disposable mobile numbers, impersonating Revolut fraud or support staff.

* **Social Engineering Ploy**: Victims are informed of a fictitious pending fee, negative balance, or security discrepancy requiring immediate attention.

* **Payload Delivery**: Targets are directed to fraudulent domains (typically utilizing alternative TLDs such as `.tk`, `.ml`, `.gq`, or obfuscated via URL shorteners) designed to mimic the official banking interface.

* **Objective**: Credential harvesting, authorization token theft, and full account compromise.

## 2. Indicators of Compromise (IoCs)

* **Communication Channels**: Burner phone numbers originating from Romanian mobile allocations (specifically observed within the `0749` prefix range).
* **Infrastructure**: Unverified external domains and redirection links bypassing official in-app communication channels.

---

# Incident Report: Revolut Vishing Campaign

## 1. Overview

This document compiles the forensic breakdown of the active vishing campaign targeting financial application users in Romania.

## 2. Chronology & Mitigation

* **Detection**: Identified via attempted targets reporting unexpected outbound contact claiming urgent fee liquidations.
* **Mitigation / Defense**:
* Immediate termination of fraudulent calls.
* Verification through official in-app security mechanisms (utilizing native application status banners).
* Reporting infrastructure IoCs to relevant national cybersecurity authorities (DNSC) and financial fraud response units.
