#!/usr/bin/env bash
# ==============================================================================
# CyberLab Fast Local Security & Permissions Auditor
# ==============================================================================
set -euo pipefail

echo "======================================================================"
echo "  🔍 CyberLab Deep Host Security & Hygiene Inspector"
echo "======================================================================"

echo "==> [1/6] Checking for SUID / SGID Binaries..."
find / -perm -4000 -type f 2>/dev/null | grep -v "/proc" || echo "None found."

echo ""
echo "==> [2/6] Inspecting Listening Network Ports & Sockets..."
ss -tulnp 2>/dev/null || netstat -tulnp 2>/dev/null || echo "Unable to query socket states."

echo ""
echo "==> [3/6] Checking for World-Writable Files in /etc and /var..."
find /etc /var -xdev -type f -perm -0002 2>/dev/null || echo "Clean: No world-writable files in /etc or /var."

echo ""
echo "==> [4/6] Verifying Unowned Files (Files without valid UID/GID)..."
find / -nouser -o -nogroup 2>/dev/null | head -n 20 || echo "Clean: No orphan files found."

echo ""
echo "==> [5/6] Checking SSH Daemon Configuration..."
if [ -f /etc/ssh/sshd_config ]; then
    echo "Port: $(grep -E '^Port ' /etc/ssh/sshd_config || echo '22 (default)')"
    echo "PermitRootLogin: $(grep -E '^PermitRootLogin ' /etc/ssh/sshd_config || echo 'default')"
    echo "PasswordAuthentication: $(grep -E '^PasswordAuthentication ' /etc/ssh/sshd_config || echo 'default')"
fi

echo ""
echo "==> [6/6] Checking UFW Firewall Status..."
sudo ufw status verbose || echo "UFW not active or requires root privileges."

echo ""
echo "Host security inspection finished."
