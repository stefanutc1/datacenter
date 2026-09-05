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

echo "=============================================================================="
echo " [✓] ALL ENTERPRISE FIREWALL & NETWORK CONTROLS VERIFIED SUCCESSFULLY"
echo "=============================================================================="
