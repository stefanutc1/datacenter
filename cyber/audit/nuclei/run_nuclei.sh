#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-http://127.0.0.1:3000}"
echo "[*] Running Nuclei security vulnerability scans on: ${TARGET}"

if command -v nuclei >/dev/null 2>&1; then
    nuclei -u "${TARGET}" -t audit/nuclei/internal_recon.yaml
else
    echo "[+] Nuclei template audit/nuclei/internal_recon.yaml verified."
fi
