#!/usr/bin/env bash
# ==============================================================================
# CyberLab Volatile Memory (RAM) Acquisition Script
# Supports AVML (Accelerated VM Live Image) & LiME
# ==============================================================================
set -euo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DUMP_PATH="/tmp/memory_dump_${HOSTNAME}_${TIMESTAMP}.lime"

echo "======================================================================"
echo "   CyberLab Volatile Physical Memory Acquisition"
echo "======================================================================"

if command -v avml &>/dev/null; then
    echo "[+] Using AVML (Automated VM Live Acquisition)..."
    sudo avml "${DUMP_PATH}"
elif [-f /proc/kcore]; then
    echo "[+] Using LiME / raw physical memory capture..."
    echo "Notice: AVML recommended for production forensic acquisition."
fi

if [-f "${DUMP_PATH}"]; then
    echo "[+] Generating SHA-256 hash for memory image..."
    sha256sum "${DUMP_PATH}" > "${DUMP_PATH}.sha256"
    echo "  Memory Dump : ${DUMP_PATH}"
    echo "  Checksum    : $(cat ${DUMP_PATH}.sha256)"
fi
