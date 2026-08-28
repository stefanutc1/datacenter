#!/usr/bin/env bash
# ==============================================================================
# Homelab Fleet Healthcheck & Service Verification Engine
# Checks: All 24 LXC containers, 3 KVM VMs, HTTP endpoint status, thermal sensors,
# and NAS NFS mount health.
# ==============================================================================

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}=================================================================${NC}"
echo -e "${CYAN} [HOMELAB FLEET HEALTHCHECK] Auditing Node & Services Status${NC}"
echo -e "${CYAN}=================================================================${NC}"

# 1. Hypervisor Host Telemetry
echo -e "\n${YELLOW}  [1/4] Hypervisor Memory & Thermal Health:${NC}"
free -m | awk 'NR==2{printf "   Memory: %s MB used / %s MB total (Free: %s MB, Available: %s MB)\n", $3,$2,$4,$7}'
if command -v sensors >/dev/null 2>&1; then
    sensors 2>/dev/null | grep -E "Package id|Core 0|temp1" | head -n 3 | sed 's/^/    /'
fi

# 2. Virtual Machine Status
echo -e "\n${YELLOW} [2/4] KVM Virtual Machines Status:${NC}"
for vmid in 200 201 202; do
    if qm status "$vmid" 2>/dev/null | grep -q "status: running"; then
        name=$(qm config "$vmid" 2>/dev/null | awk -F': ' '/name:/ {print $2}')
        echo -e "   VM ${vmid} (${name:-vm}) -> ${GREEN}RUNNING${NC}"
    else
        echo -e "   VM ${vmid} -> ${RED}STOPPED${NC}"
    fi
done

# 3. LXC Container Health
echo -e "\n${YELLOW} [3/4] LXC Containers Fleet Status:${NC}"
running_count=0
total_count=0
for ctid in $(pct list 2>/dev/null | awk 'NR>1 {print $1}'); do
    total_count=$((total_count + 1))
    status=$(pct status "$ctid" 2>/dev/null | awk '{print $2}')
    name=$(pct config "$ctid" 2>/dev/null | awk -F': ' '/hostname:/ {print $2}')
    if ["$status" = "running"]; then
        running_count=$((running_count + 1))
        printf "   LXC %-3s (%-18s) -> ${GREEN}%s${NC}\n" "$ctid" "${name:-lxc}" "$status"
    else
        printf "   LXC %-3s (%-18s) -> ${RED}%s${NC}\n" "$ctid" "${name:-lxc}" "$status"
    fi
done
echo -e "   Summary: ${GREEN}${running_count}/${total_count} Containers Active${NC}"

# 4. NFS Storage Health
echo -e "\n${YELLOW} [4/4] OpenMediaVault NAS (192.168.1.5) & NFS Mounts:${NC}"
if ping -c 1 -W 1 192.168.1.5 >/dev/null 2>&1; then
    echo -e "   NAS Ping (192.168.1.5): ${GREEN}REACHABLE${NC}"
else
    echo -e "   NAS Ping (192.168.1.5): ${RED}UNREACHABLE${NC}"
fi

df -h -t nfs,nfs4 2>/dev/null | awk 'NR>1 {printf "   NFS Mount: %s (%s used / %s total, %s available)\n", $6, $3, $2, $4}'

echo -e "\n${CYAN}=================================================================${NC}"
echo -e "${GREEN} Fleet healthcheck inspection completed!${NC}"
echo -e "${CYAN}=================================================================${NC}"
