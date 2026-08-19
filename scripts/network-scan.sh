#!/usr/bin/env bash
# ==============================================================================
# Fast Subnet & MAC Address Discovery Scanner
# Probes 192.168.1.0/24 and displays live homelab hostnames and IP assignments.
# ==============================================================================

set -euo pipefail

SUBNET="${1:-192.168.1}"

echo "🔎 [NETWORK SCAN] Scanning active hosts on ${SUBNET}.0/24..."
printf "%-18s %-20s %-20s\n" "IP ADDRESS" "STATUS" "HOSTNAME"
echo "--------------------------------------------------------"

for i in {1..254}; do
    ip="${SUBNET}.${i}"
    (
        if ping -c 1 -W 1 "$ip" >/dev/null 2>&1; then
            host=$(nslookup "$ip" 192.168.1.4 2>/dev/null | awk -F'= ' '/name =/ {print $2}' || echo "N/A")
            printf "%-18s %-20s %-20s\n" "$ip" "ONLINE" "${host:-N/A}"
        fi
    ) &
done
wait
echo "--------------------------------------------------------"
echo "🎉 Network scan finished!"
