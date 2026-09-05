"""Osquery and FleetDM threat hunting query packs for persistence and lateral movement."""

from typing import List, Dict, Any

OSQUERY_PACKS: List[Dict[str, Any]] = [
    {
        "id": "osq-linux-ld-preload",
        "name": "Linux LD_PRELOAD Shared Library Hijack",
        "platform": "linux",
        "category": "PERSISTENCE",
        "mitre": "T1574.006",
        "query": "SELECT * FROM process_open_files WHERE path LIKE '%/ld.so.preload' UNION SELECT * FROM file WHERE path = '/etc/ld.so.preload';",
        "description": "Detects rootkit injection and shared library hijacking via /etc/ld.so.preload."
    },
    {
        "id": "osq-linux-cron-persistence",
        "name": "Suspicious Scheduled Cron Jobs",
        "platform": "linux",
        "category": "PERSISTENCE",
        "mitre": "T1053.003",
        "query": "SELECT command, path, hour, minute FROM crontab WHERE command LIKE '%curl%' OR command LIKE '%wget%' OR command LIKE '%base64%' OR command LIKE '%/dev/tcp/%';",
        "description": "Identifies hidden cron schedules establishing outbound reverse shells."
    },
    {
        "id": "osq-linux-systemd-backdoor",
        "name": "Malicious Systemd Unit Services",
        "platform": "linux",
        "category": "PERSISTENCE",
        "mitre": "T1543.002",
        "query": "SELECT id, description, fragment_path, unit_file_state FROM systemd_units WHERE fragment_path LIKE '/tmp/%' OR fragment_path LIKE '/dev/shm/%' OR description LIKE '%miner%';",
        "description": "Finds persistence services originating from temporary memory-backed directories."
    },
    {
        "id": "osq-windows-scheduled-task-temp",
        "name": "Windows Scheduled Tasks Running from Temp",
        "platform": "windows",
        "category": "PERSISTENCE",
        "mitre": "T1053.005",
        "query": "SELECT name, action, path, enabled FROM scheduled_tasks WHERE action LIKE '%AppData%' OR action LIKE '%Temp%' OR action LIKE '%powershell -enc%';",
        "description": "Detects stealth scheduled tasks triggering payload executions in user-writable paths."
    },
    {
        "id": "osq-process-deleted-binary",
        "name": "Running Process with Deleted Binary On-Disk",
        "platform": "all",
        "category": "DEFENSE EVASION",
        "mitre": "T1070.004",
        "query": "SELECT p.pid, p.name, p.path, p.cmdline FROM processes p WHERE p.on_disk = 0;",
        "description": "Detects in-memory malware that self-deletes from the disk to hinder forensic triage."
    }
]

class OsqueryEngine:
    """Provides validated Osquery query definitions for enterprise threat hunting."""

    @staticmethod
    def get_all_packs() -> List[Dict[str, Any]]:
        return OSQUERY_PACKS

    @staticmethod
    def get_queries_by_platform(platform: str) -> List[Dict[str, Any]]:
        return [q for q in OSQUERY_PACKS if q["platform"] in (platform.lower(), "all")]

    @staticmethod
    def get_query_by_mitre(technique: str) -> List[Dict[str, Any]]:
        return [q for q in OSQUERY_PACKS if technique.upper() in q["mitre"].upper()]
