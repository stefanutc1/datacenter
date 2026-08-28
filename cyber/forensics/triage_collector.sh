#!/usr/bin/env bash
# ==============================================================================
# CyberLab Live Incident Response & Forensic Triage Collector
# ==============================================================================
set -euo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUT_DIR="/tmp/cyberlab_triage_${TIMESTAMP}"
mkdir -p "${OUT_DIR}"

echo "======================================================================"
echo "   CyberLab Live Forensics & Volatile Artifact Collector"
echo "======================================================================"
echo "Output Directory: ${OUT_DIR}"

# 1. System Metadata & Host Identity
echo "[+] Gathering system metadata..."
uname -a > "${OUT_DIR}/uname.txt"
hostnamectl > "${OUT_DIR}/hostnamectl.txt" 2>/dev/null || true
uptime > "${OUT_DIR}/uptime.txt"
date -u > "${OUT_DIR}/date_utc.txt"

# 2. Network & Socket Connections
echo "[+] Capturing active network sockets & routing table..."
ip addr > "${OUT_DIR}/ip_addr.txt"
ip route > "${OUT_DIR}/ip_route.txt"
ss -tulnp > "${OUT_DIR}/sockets_listening.txt" 2>/dev/null || true
ss -tunap > "${OUT_DIR}/sockets_all.txt" 2>/dev/null || true
arp -a > "${OUT_DIR}/arp_cache.txt" 2>/dev/null || true

# 3. Process Execution & Tree
echo "[+] Capturing running process tree & memory mappings..."
ps auxfww > "${OUT_DIR}/process_tree.txt"
top -b -n 1 > "${OUT_DIR}/top_snapshot.txt"

# 4. User Logins & Shell History
echo "[+] Collecting active sessions and authentication history..."
w > "${OUT_DIR}/logged_in_users.txt"
last -n 50 > "${OUT_DIR}/last_logins.txt"
lastb -n 50 > "${OUT_DIR}/failed_logins.txt" 2>/dev/null || true

# 5. Loaded Kernel Modules
echo "[+] Listing loaded kernel modules..."
lsmod > "${OUT_DIR}/lsmod.txt"

# 6. Scheduled Tasks (Cron & Systemd Timers)
echo "[+] Collecting cron jobs and systemd timers..."
crontab -l > "${OUT_DIR}/crontab_current_user.txt" 2>/dev/null || true
ls -la /etc/cron* /var/spool/cron/crontabs > "${OUT_DIR}/system_cron_files.txt" 2>/dev/null || true
systemctl list-timers --all > "${OUT_DIR}/systemd_timers.txt" 2>/dev/null || true

# 7. Compress Archive with Checksum
echo "[+] Packaging triage archive..."
TAR_FILE="/tmp/triage_${HOSTNAME}_${TIMESTAMP}.tar.gz"
tar -czf "${TAR_FILE}" -C /tmp "cyberlab_triage_${TIMESTAMP}"
sha256sum "${TAR_FILE}" > "${TAR_FILE}.sha256"

echo "======================================================================"
echo "   Triage collection complete!"
echo "  Artifact Archive : ${TAR_FILE}"
echo "  SHA-256 Checksum : $(cat ${TAR_FILE}.sha256)"
echo "======================================================================"
