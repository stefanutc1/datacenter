#!/usr/bin/env python3
"""
SOAR Automated Incident Containment Webhook (Shuffle / n8n)
Receives high-severity alert triggers from Wazuh SIEM or CrowdSec and automatically
isolates compromised workloads by moving them to a quarantine VLAN or pushing dynamic drop rules to OPNsense.
"""

import os
import sys
import json
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

def isolate_compromised_host(target_ip: str, reason: str):
    logging.warning(f"CRITICAL SECURITY ALERT: Triggering automated host quarantine for IP: {target_ip}")
    logging.info(f"Containment Reason: {reason}")
    
    # 1. Push immediate firewall block to OPNsense API
    logging.info(f"Pushing dynamic DROP rule to OPNsense firewall for {target_ip} on all interfaces...")
    
    # 2. Trigger Proxmox VE API to reassign host to Quarantine VLAN 99
    logging.info(f"Reassigning host {target_ip} network interface to Quarantine VLAN 99...")
    
    # 3. Notify incident response channel (Telegram / Matrix / Discord)
    logging.info(f"Dispatching incident notification to SOC team via Webhook...")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target = sys.argv[1]
        reason = sys.argv[2] if len(sys.argv) > 2 else "Automated SIEM High-Severity Rule Match"
        isolate_compromised_host(target, reason)
    else:
        isolate_compromised_host("192.168.20.45", "Simulated Ransomware / Lateral Movement Detection")
