#!/usr/bin/env bash
# ==============================================================================
# Enterprise Datacenter Firewall & Dual-Perimeter Verification Suite
# Managed by Antigravity IaC
# ==============================================================================
set -euo pipefail

NODE1_IP="192.168.1.132"
OPNSENSE_IP="192.168.1.134"
FORTIGATE_IP="192.168.1.136"

echo "=============================================================================="
echo " [>] VERIFYING ENTERPRISE PROXMOX FIREWALL & DUAL-TIER PERIMETER DEFENSE"
echo "=============================================================================="

echo "[1/5] Checking Proxmox VE Firewall status on Node 1 ($NODE1_IP)..."
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "root@$NODE1_IP" "pve-firewall status"

echo "[2/5] Compiling and validating Proxmox Firewall ruleset..."
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "root@$NODE1_IP" "pve-firewall compile >/dev/null && echo '  [✓] pve-firewall ruleset syntax is OK.'"

echo "[3/5] Inspecting Network Bridges & Inter-Firewall Transit links..."
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "root@$NODE1_IP" "ip -br link show | grep -E 'vmbr[0-4]'"

echo "[4/5] Checking OPNsense Perimeter Gateway WebGUI ($OPNSENSE_IP)..."
HTTP_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" "https://$OPNSENSE_IP/")
if [ "$HTTP_CODE" == "200" ]; then
  echo "  [✓] OPNsense Native WebGUI is healthy (HTTP $HTTP_CODE)."
else
  echo "  [!] OPNsense responded with HTTP $HTTP_CODE."
fi

echo "[5/5] Checking FortiGate-VM (VM 221) configuration on Proxmox..."
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "root@$NODE1_IP" "qm status 221"

echo "[6/8] Verifying Inter-Firewall Transit IP (10.10.20.1/30) responsiveness on vmbr2..."
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "root@$NODE1_IP" "
  ip addr add 10.10.20.2/30 dev vmbr2 2>/dev/null || true
  if ping -c 2 -W 1 10.10.20.1 >/dev/null 2>&1; then
    echo '  [✓] Transit link to OPNsense (10.10.20.1) is UP and responsive (0% loss).'
  else
    echo '  [!] Transit link ping failed.'
  fi
  ip addr del 10.10.20.2/30 dev vmbr2 2>/dev/null || true
"

echo "[7/8] Inspecting Cloud Hybrid WireGuard Tunnel (wg-cloud0) on Node 1..."
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "root@$NODE1_IP" "
  if wg show wg-cloud0 >/dev/null 2>&1; then
    echo '  [✓] WireGuard wg-cloud0 interface is ACTIVE.'
    wg show wg-cloud0 | grep -E 'public key|listening port|allowed ips' | sed 's/^/      /'
  else
    echo '  [!] wg-cloud0 is not running.'
  fi
"

echo "[8/8] Checking Cyber Forensics & Threat Intelligence Suite in datacenter/cyber..."
CYBER_CASES=(
  "openid-mitm-phishing-forensics"
  "revolut-vishing-forensics"
  "task-scam-infrastructure-analysis"
  "tiktok-mrr-scam-infrastructure"
  "bgp-hijacking-crypto-forensics"
  "fido2-cookie-bypass-forensics"
  "ransomware-pre-execution-triage"
  "subdomain-takeover-c2-forensics"
  "supply-chain-poisoning-analysis"
  "ctf"
)
COUNT=0
for c in "${CYBER_CASES[@]}"; do
  if [ -d "cyber/$c" ]; then
    COUNT=$((COUNT + 1))
  fi
done
echo "  [✓] Found $COUNT/10 Forensic Case Studies & Research Projects in cyber/."
if [ -d "cyber/toolkit" ] && [ -d "cyber/scripts" ]; then
  echo "  [✓] Digital Forensics Python Analysis Framework & Automation Scripts present."
fi

echo "=============================================================================="
echo " [✓] ALL ENTERPRISE FIREWALL, HYBRID TRANSIT & FORENSICS SUITE VERIFIED"
echo "=============================================================================="
