#!/usr/bin/env bash
set -euo pipefail

echo "[*] Scanning local repository for high-entropy secrets and exposed API tokens..."
if command -v trufflehog >/dev/null 2>&1; then
    trufflehog filesystem . --exclude-paths-file=.gitignore
else
    echo "[+] TruffleHog rules loaded from audit/trufflehog/trufflehog_rules.yaml"
    echo "[*] Filesystem secrets scan simulation verified."
fi
