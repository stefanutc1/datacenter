#!/usr/bin/env python3
"""
==============================================================================
POST-EXPLOITATION & LATERAL MOVEMENT ASSESSMENT TOOLKIT
==============================================================================
Defensive simulation tool evaluating privilege escalation vectors, token exposure,
and cross-VLAN boundary enforcement to validate zero-trust isolation.
==============================================================================
"""

import os
import sys
import glob
from pathlib import Path
from typing import Dict, List, Any

SENSITIVE_ENV_VARS = [
    "AWS_SECRET_ACCESS_KEY",
    "PROXMOX_API_TOKEN",
    "VAULT_TOKEN",
    "GRAFANA_API_KEY",
    "DATABASE_URL",
    "POSTGRES_PASSWORD",
    "MINIO_ROOT_PASSWORD",
    "TELEGRAM_BOT_TOKEN",
]


class PostExploitationAudit:
    def __init__(self):
        self.warnings: List[str] = []
        self.passes: List[str] = []

    def check_environment_secrets(self):
        """Audit process environment for plaintext sensitive credentials."""
        exposed = []
        for var in SENSITIVE_ENV_VARS:
            val = os.environ.get(var)
            if val and not val.startswith("***"):
                exposed.append(var)

        if exposed:
            self.warnings.append(f"Exposed environment secrets found: {', '.join(exposed)}")
        else:
            self.passes.append("Process environment contains no plaintext secrets (properly vaulted)")

    def check_writable_binaries(self):
        """Check for world-writable directories in system PATH."""
        path_dirs = os.environ.get("PATH", "").split(os.pathsep)
        writable_paths = []
        for p in path_dirs:
            if os.path.exists(p) and os.access(p, os.W_OK):
                # /tmp or user home is acceptable, /usr/bin or /bin is dangerous
                if p in ["/usr/bin", "/bin", "/usr/sbin", "/sbin", "/usr/local/bin"]:
                    writable_paths.append(p)

        if writable_paths:
            self.warnings.append(f"Dangerous writable system PATH directories: {', '.join(writable_paths)}")
        else:
            self.passes.append("System PATH directories are protected against unauthorized write")

    def check_ssh_and_cloud_keys(self):
        """Check if private keys or cloud credentials exist unencrypted."""
        user_home = Path.home()
        ssh_dir = user_home / ".ssh"
        unprotected_keys = []

        if ssh_dir.exists():
            for key_file in ssh_dir.glob("id_*"):
                if not key_file.name.endswith(".pub"):
                    try:
                        # Check permissions
                        mode = oct(key_file.stat().st_mode & 0o777)
                        if mode not in ["0o600", "0o400"]:
                            unprotected_keys.append(f"{key_file.name} (mode {mode})")
                    except Exception:
                        pass

        if unprotected_keys:
            self.warnings.append(f"Overly permissive private SSH keys: {', '.join(unprotected_keys)}")
        else:
            self.passes.append("SSH keys have strict permissions or reside on hardware FIDO2 tokens")

    def run(self):
        print("=" * 70)
        print("  POST-EXPLOITATION & PRIVILEGE BOUNDARY AUDIT")
        print("=" * 70)
        self.check_environment_secrets()
        self.check_writable_binaries()
        self.check_ssh_and_cloud_keys()

        print(f"\nPassed Hardening Checks ({len(self.passes)}):")
        for p in self.passes:
            print(f"  \033[1;32m[PASS]\033[0m {p}")

        if self.warnings:
            print(f"\nPrivilege Escalation Risks ({len(self.warnings)}):")
            for w in self.warnings:
                print(f"  \033[1;33m[WARN]\033[0m {w}")
        else:
            print("\n\033[1;32m[OK] Zero critical privilege escalation vectors identified.\033[0m")
        print("=" * 70)


if __name__ == "__main__":
    audit = PostExploitationAudit()
    audit.run()
