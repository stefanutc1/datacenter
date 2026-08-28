#!/usr/bin/env bash
# ==============================================================================
# CyberLab CIS / Lynis Security & Compliance Audit Runner
# ==============================================================================
set -euo pipefail

REPORT_DIR="${1:-/tmp/cyberlab-audit}"
mkdir -p "${REPORT_DIR}"

echo "======================================================================"
echo "   CyberLab Automated Security & CIS Compliance Audit"
echo "======================================================================"

if ! command -v lynis &>/dev/null; then
    echo "Installing Lynis auditor..."
    sudo apt-get update -qq && sudo apt-get install -y -qq lynis
fi

echo "==> Running non-interactive Lynis system audit..."
sudo lynis audit system --quick --auditor "CyberLab-Auto" --report-file "${REPORT_DIR}/lynis-report.dat" --log-file "${REPORT_DIR}/lynis.log"

HARDENING_INDEX=$(grep -E "^hardening_index=" "${REPORT_DIR}/lynis-report.dat" | cut -d'=' -f2 || echo "N/A")
SUGGESTIONS_COUNT=$(grep -c "^suggestion\[\]=" "${REPORT_DIR}/lynis-report.dat" || echo "0")
WARNINGS_COUNT=$(grep -c "^warning\[\]=" "${REPORT_DIR}/lynis-report.dat" || echo "0")

echo ""
echo "======================================================================"
echo "   AUDIT RESULTS SUMMARY"
echo "======================================================================"
echo "  Hardening Index  : ${HARDENING_INDEX} / 100"
echo "  Active Warnings  : ${WARNINGS_COUNT}"
echo "  Suggestions      : ${SUGGESTIONS_COUNT}"
echo "  Full Report      : ${REPORT_DIR}/lynis-report.dat"
echo "======================================================================"
