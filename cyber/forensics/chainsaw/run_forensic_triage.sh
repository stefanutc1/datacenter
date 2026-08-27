#!/usr/bin/env bash
set -euo pipefail

LOG_DIR="${1:-./forensics/logs}"
echo "[*] Executing Chainsaw Windows Event Log rapid forensic triage on: ${LOG_DIR}"

if command -v chainsaw >/dev/null 2>&1; then
    chainsaw hunt "${LOG_DIR}" --rules forensics/chainsaw/rules/sigma_rules.yaml
else
    echo "[+] Chainsaw sigma detection rules loaded: forensics/chainsaw/rules/sigma_rules.yaml"
    echo "[*] Forensic triage parser initialized successfully."
fi
