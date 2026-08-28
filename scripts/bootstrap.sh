#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "  Homelab Infrastructure Bootstrap Script "
echo "=========================================="

for tool in terraform ansible pre-commit git; do
    if ! command -v "$tool" &> /dev/null; then
        echo "[!] Error:Required tool '$tool' is not installed." >&2
        exit 1
    fi
done

echo "[+] All required tools are present."
echo "[+] Installing pre-commit hooks..."
pre-commit install

echo "[+] Running initial formatting and checks..."
make fmt

echo "[] Bootstrap completed successfully!"
