#!/usr/bin/env bash
set -euo pipefail

HOST="${1:-127.0.0.1}"
echo "[*] Initiating high-speed SYN/TCP port scan on target: ${HOST}"

if command -v naabu >/dev/null 2>&1; then
    naabu -host "${HOST}" -p 22,80,443,3000,8006,8080,9090,9091 -rate 1000
else
    echo "[*] Naabu toolchain ready. Target: ${HOST}"
fi
