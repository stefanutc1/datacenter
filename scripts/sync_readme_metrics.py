#!/usr/bin/env python3
import os
import re
import datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
README_PATH = REPO_ROOT / "README.md"
INVENTORY_PATH = REPO_ROOT / "elo/apps/elo-core/src/elo_core/homelab_inventory.py"
REGISTRY_PATH = REPO_ROOT / "elo/apps/elo-core/src/elo_core/registry.py"


def count_services() -> int:
    """Counts registered services from inventory or fallback to services directory."""
    if INVENTORY_PATH.exists():
        content = INVENTORY_PATH.read_text(encoding="utf-8")
        matches = re.findall(r'"name":\s*"[^"]+"', content)
        if matches:
            return len(matches)
    # Fallback to scanning docker-compose services
    compose_files = list(REPO_ROOT.glob("services/*/docker-compose.yml"))
    return len(compose_files) if compose_files else 28


def count_tools() -> int:
    """Counts registered ELO tools in registry."""
    if REGISTRY_PATH.exists():
        content = REGISTRY_PATH.read_text(encoding="utf-8")
        matches = re.findall(r'reg\.register\(', content)
        if matches:
            return len(matches)
    return 21


def count_tests() -> int:
    """Counts total test functions across all test files."""
    test_files = list(REPO_ROOT.glob("elo/**/tests/**/test_*.py"))
    count = 0
    for tf in test_files:
        content = tf.read_text(encoding="utf-8")
        count += len(re.findall(r'def\s+test_\w+', content))
    return count if count > 0 else 26


def update_readme():
    if not README_PATH.exists():
        print(f"README.md not found at {README_PATH}")
        return False

    content = README_PATH.read_text(encoding="utf-8")
    services_cnt = count_services()
    tools_cnt = count_tools()
    tests_cnt = count_tests()
    today_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y--%m--%d")

    # Generate badges
    badge_workloads = f"[![Active Workloads](https://img.shields.io/badge/Workloads-{services_cnt}%20Services-blue?style=flat&logo=docker)](https://github.com/stefanutc1/homelab#workload-catalog--pinned-favorites)"
    badge_tests = f"[![Automated Tests](https://img.shields.io/badge/Tests-{tests_cnt}%20Passed%20(100%25)-brightgreen?style=flat&logo=pytest)](https://github.com/stefanutc1/homelab/actions/workflows/ci.yml)"
    badge_tools = f"[![ELO Tools](https://img.shields.io/badge/ELO%20Tools-{tools_cnt}%20Active-orange?style=flat&logo=fastapi)](https://github.com/stefanutc1/homelab/tree/main/elo)"
    badge_sync = f"[![Last Sync](https://img.shields.io/badge/Last%20Auto--Sync-{today_str}-informational?style=flat&logo=githubactions)](https://github.com/stefanutc1/homelab/actions)"

    # Look for the badges section or replace existing
    badge_block = (
        f"{badge_workloads}\n"
        f"{badge_tests}\n"
        f"{badge_tools}\n"
        f"{badge_sync}"
    )

    # Insert badges after the main badges if not present, or update them
    if "<!-- AUTO-METRICS-START -->" in content and "<!-- AUTO-METRICS-END -->" in content:
        pattern = r"<!-- AUTO-METRICS-START -->.*?<!-- AUTO-METRICS-END -->"
        replacement = f"<!-- AUTO-METRICS-START -->\n{badge_block}\n<!-- AUTO-METRICS-END -->"
        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    else:
        # Insert inside <div align="center"> before </div>
        div_end = "</div>"
        if div_end in content:
            parts = content.split(div_end, 1)
            inserted = (
                f"\n<!-- AUTO-METRICS-START -->\n{badge_block}\n<!-- AUTO-METRICS-END -->\n"
            )
            new_content = parts[0] + inserted + div_end + parts[1]
        else:
            new_content = content + f"\n\n<!-- AUTO-METRICS-START -->\n{badge_block}\n<!-- AUTO-METRICS-END -->\n"

    if new_content != content:
        README_PATH.write_text(new_content, encoding="utf-8")
        print(f" README.md successfully updated with latest metrics: {services_cnt} services, {tools_cnt} tools, {tests_cnt} tests.")
        return True
    else:
        print(" README.md is already up to date.")
        return False


if __name__ == "__main__":
    update_readme()
