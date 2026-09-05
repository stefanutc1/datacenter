"""Automated live triage collector generating forensically-sound evidence packages."""

import hashlib
import json
import os
import platform
import subprocess
import sys
import tarfile
import tempfile
from datetime import datetime, timezone
from typing import Dict, Any, List

class TriageCollector:
    """Collects volatile system state and critical logs, packaging with a SHA-256 manifest."""

    def __init__(self, output_dir: str = "/tmp"):
        self.output_dir = output_dir
        self.timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%SZ")
        self.hostname = platform.node()

    def collect(self) -> Dict[str, Any]:
        temp_dir = tempfile.mkdtemp(prefix=f"cyber_triage_{self.hostname}_")
        manifest_entries = []

        try:
            # 1. System Metadata
            meta_file = os.path.join(temp_dir, "system_info.json")
            sys_info = {
                "hostname": self.hostname,
                "os": platform.system(),
                "release": platform.release(),
                "version": platform.version(),
                "machine": platform.machine(),
                "collection_time_utc": datetime.now(timezone.utc).isoformat(),
                "collector": "cyber-triage-v2.0"
            }
            with open(meta_file, "w", encoding="utf-8") as f:
                json.dump(sys_info, f, indent=2)
            manifest_entries.append(self._hash_entry(meta_file, "system_info.json"))

            # 2. Process Listing (Simulated/Real CLI)
            proc_file = os.path.join(temp_dir, "process_list.txt")
            with open(proc_file, "w", encoding="utf-8") as f:
                try:
                    cmd = ["ps", "aux"] if platform.system() != "Windows" else ["tasklist", "/v"]
                    out = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True, timeout=5)
                    f.write(out)
                except Exception as e:
                    f.write(f"Process collection error: {e}\n")
            manifest_entries.append(self._hash_entry(proc_file, "process_list.txt"))

            # 3. Network Sockets & Listeners
            net_file = os.path.join(temp_dir, "network_connections.txt")
            with open(net_file, "w", encoding="utf-8") as f:
                try:
                    cmd = ["netstat", "-tuln"] if platform.system() != "Windows" else ["netstat", "-ano"]
                    out = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True, timeout=5)
                    f.write(out)
                except Exception as e:
                    f.write(f"Network sockets collection error: {e}\n")
            manifest_entries.append(self._hash_entry(net_file, "network_connections.txt"))

            # 4. Write Manifest
            manifest_file = os.path.join(temp_dir, "manifest.json")
            manifest_data = {
                "collection_id": f"TRG-{self.hostname}-{self.timestamp}",
                "standard": "ISO/IEC 27037:2012 Digital Evidence Acquisition",
                "collected_at": datetime.now(timezone.utc).isoformat(),
                "entries": manifest_entries
            }
            with open(manifest_file, "w", encoding="utf-8") as f:
                json.dump(manifest_data, f, indent=2)

            # 5. Archive to .tar.gz
            tar_name = f"triage_{self.hostname}_{self.timestamp}.tar.gz"
            tar_path = os.path.join(self.output_dir, tar_name)
            with tarfile.open(tar_path, "w:gz") as tar:
                tar.add(temp_dir, arcname=f"triage_{self.hostname}_{self.timestamp}")

            # Compute Tar SHA-256
            tar_sha256 = self._compute_sha256(tar_path)

            return {
                "archive_path": tar_path,
                "sha256": tar_sha256,
                "file_size": os.path.getsize(tar_path),
                "artifacts_count": len(manifest_entries),
                "manifest": manifest_data
            }
        finally:
            # Clean temporary uncompressed folder
            for root, dirs, files in os.walk(temp_dir, topdown=False):
                for name in files:
                    os.remove(os.path.join(root, name))
                for name in dirs:
                    os.rmdir(os.path.join(root, name))
            os.rmdir(temp_dir)

    def _hash_entry(self, full_path: str, rel_name: str) -> Dict[str, Any]:
        sha = self._compute_sha256(full_path)
        return {
            "file": rel_name,
            "sha256": sha,
            "size_bytes": os.path.getsize(full_path)
        }

    @staticmethod
    def _compute_sha256(file_path: str) -> str:
        h = hashlib.sha256()
        with open(file_path, "rb") as f:
            while chunk := f.read(65536):
                h.update(chunk)
        return h.hexdigest()
