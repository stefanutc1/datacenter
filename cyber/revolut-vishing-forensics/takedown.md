# Takedown Report: Phishing Infrastructure

## Overview

This document tracks the status of the malicious infrastructure identified during the August 10, 2026 Revolut impersonation campaign.

## Status: REMEDIATED / CLOSED

* **Detection Date**: August 10, 2026
* **Takedown Date**: August 10, 2026
* **Current Status**: Offline / Non-responsive

## Actions Taken

1. **Verification**: Performed connectivity tests using isolated VM infrastructure (Proxmox/UTM). The phishing domain no longer resolves or returns a 404/Connection Refused.
2. **Reporting**: Infrastructure IoCs were compiled and reported to the relevant national authorities (DNSC) and the hosting providers/registrars involved.
3. **Outcome**: The malicious redirection path has been successfully severed, preventing further credential harvesting via this specific vector.

## Lessons Learned

* Rapid detection and reporting significantly decrease the "window of opportunity" for threat actors.
* Consistent monitoring of burner phone patterns allows for early warning before infrastructure is fully deployed.
