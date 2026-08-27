#!/bin/bash

NODES=("192.168.64.10" "192.168.64.20")
SSH_USER="ubuntu"

echo "=== VM Status Check ==="

for node in "${NODES[@]}"; do
    echo -n "[*] Pinging node $node... "
    if ping -c 1 -W 2 "$node" &> /dev/null; then
        echo "ONLINE"

        if nc -z -w 2 "$node" 22 2> /dev/null; then
            echo "    -> SSH service is UP."
        else
            echo "    -> WARNING: SSH port is closed or filtered."
        fi
    else
        echo "OFFLINE (Unreachable)"
    fi
done

echo "-----------------------------------"
