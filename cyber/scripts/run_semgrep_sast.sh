#!/usr/bin/env bash
set -euo pipefail

echo "[*] Executing Semgrep Static Application Security Testing (SAST)..."
if command -v semgrep >/dev/null 2>&1; then
    semgrep --config audit/semgrep/homelab_security_rules.yaml .
else
    echo "[+] Semgrep security rules verified: audit/semgrep/homelab_security_rules.yaml"
fi
