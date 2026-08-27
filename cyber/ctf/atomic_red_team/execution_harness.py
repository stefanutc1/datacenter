#!/usr/bin/env python3
"""Atomic Red Team execution harness for MITRE ATT&CK validation."""
from __future__ import annotations
import subprocess
import yaml
from pathlib import Path

def execute_technique(yaml_path: str) -> dict:
    with open(yaml_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    technique_id = data.get("attack_technique", "UNKNOWN")
    display_name = data.get("display_name", "Unnamed Test")
    results = []

    for test in data.get("atomic_tests", []):
        cmd = test.get("executor", {}).get("command", "")
        cleanup = test.get("executor", {}).get("cleanup_command", "")
        test_name = test.get("name", "Test")

        print(f"[*] Running atomic test: {technique_id} - {test_name}")
        proc = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        results.append({
            "test": test_name,
            "status": "SUCCESS" if proc.returncode == 0 else "FAILURE",
            "exit_code": proc.returncode
        })

        if cleanup:
            subprocess.run(cleanup, shell=True, capture_output=True)

    return {"technique": technique_id, "name": display_name, "results": results}

if __name__ == "__main__":
    test_file = Path(__file__).parent / "techniques" / "t1059_004_unix_shell.yaml"
    if test_file.exists():
        print(execute_technique(str(test_file)))
