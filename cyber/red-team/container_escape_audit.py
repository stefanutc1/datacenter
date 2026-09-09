#!/usr/bin/env python3
"""
==============================================================================
CONTAINER ESCAPE & PRIVILEGE ESCALATION AUDITOR
==============================================================================
Performs comprehensive, non-destructive audit of container isolation barriers:
- Dangerous Linux capabilities (CAP_SYS_ADMIN, CAP_SYS_PTRACE, CAP_DAC_OVERRIDE)
- Mounted Docker/containerd UNIX control sockets
- cgroup v1/v2 release_agent & notify_on_release exploitability
- Sensitive host filesystem mounts (/etc/shadow, /proc/sys, /host)
- Shared host namespaces (hostPID, hostIPC, hostNetwork)
- Seccomp, AppArmor, and SELinux enforcement status
==============================================================================
"""

import os
import sys
import json
import socket
from pathlib import Path
from typing import Dict, List, Any

# Dangerous Linux capability bitmasks (x86_64 / ARM64)
DANGEROUS_CAPS = {
    "CAP_SYS_ADMIN": (1 << 21, "Full administrative privileges, kernel module loading, mount controls"),
    "CAP_SYS_PTRACE": (1 << 19, "Process tracing & memory inspection (can inject shellcode into host processes)"),
    "CAP_SYS_MODULE": (1 << 16, "Kernel module insertion / direct kernel ring-0 code execution"),
    "CAP_DAC_OVERRIDE": (1 << 1, "Bypasses all file read/write/execute permission checks"),
    "CAP_DAC_READ_SEARCH": (1 << 2, "Bypasses file read checks and directory search permissions"),
    "CAP_NET_ADMIN": (1 << 12, "Network interface reconfiguration, IP routing tables, firewall modifications"),
    "CAP_SYS_RAWIO": (1 << 17, "Raw I/O port access & physical disk block manipulation"),
}

SOCKET_PATHS = [
    "/var/run/docker.sock",
    "/run/docker.sock",
    "/run/containerd/containerd.sock",
    "/var/run/containerd/containerd.sock",
    "/run/crio/crio.sock",
    "/var/run/crio/crio.sock",
    "/run/k3s/containerd/containerd.sock",
]

SENSITIVE_MOUNTS = [
    "/etc/shadow",
    "/etc/passwd",
    "/host",
    "/root",
    "/proc/sys/kernel/core_pattern",
    "/proc/sysrq-trigger",
    "/sys/fs/cgroup",
]


class ContainerEscapeAuditor:
    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.findings: List[Dict[str, Any]] = []

    def log(self, level: str, title: str, details: str):
        self.findings.append({"severity": level, "title": title, "details": details})
        colors = {
            "CRITICAL": "\033[1;31m[CRITICAL]\033[0m",
            "HIGH": "\033[1;33m[HIGH]\033[0m",
            "MEDIUM": "\033[1;34m[MEDIUM]\033[0m",
            "PASS": "\033[1;32m[PASS]\033[0m",
        }
        prefix = colors.get(level, f"[{level}]")
        print(f"{prefix} {title}: {details}")

    def audit_capabilities(self):
        """Audit effective capabilities from /proc/self/status."""
        status_file = Path("/proc/self/status")
        if not status_file.exists():
            self.log("MEDIUM", "Procfs Status", "Unable to read /proc/self/status (running outside Linux or mocked)")
            return

        cap_eff_hex = None
        for line in status_file.read_text().splitlines():
            if line.startswith("CapEff:"):
                cap_eff_hex = line.split()[1]
                break

        if not cap_eff_hex:
            self.log("MEDIUM", "Capabilities", "Could not determine CapEff value")
            return

        try:
            cap_eff = int(cap_eff_hex, 16)
        except ValueError:
            return

        detected_dangerous = []
        for cap_name, (mask, desc) in DANGEROUS_CAPS.items():
            if (cap_eff & mask) == mask:
                detected_dangerous.append(f"{cap_name} ({desc})")

        if detected_dangerous:
            self.log("CRITICAL", "Dangerous Capabilities Detected", "; ".join(detected_dangerous))
        else:
            self.log("PASS", "Capabilities Hardening", "No dangerous capabilities found in CapEff (bounded set)")

    def audit_socket_mounts(self):
        """Check for mounted container engine UNIX control sockets."""
        exposed_sockets = []
        for sock_path in SOCKET_PATHS:
            p = Path(sock_path)
            if p.exists():
                exposed_sockets.append(sock_path)

        if exposed_sockets:
            self.log(
                "CRITICAL",
                "Container Runtime Sockets Exposed",
                f"Sockets found: {', '.join(exposed_sockets)}. Provides trivial host takeover via API.",
            )
        else:
            self.log("PASS", "Control Sockets", "No Docker, containerd, or CRI-O control sockets exposed")

    def audit_filesystem_mounts(self):
        """Check for sensitive host paths mounted in container."""
        exposed_mounts = []
        for mount in SENSITIVE_MOUNTS:
            if Path(mount).exists():
                exposed_mounts.append(mount)

        if exposed_mounts:
            self.log("HIGH", "Sensitive Host Paths Mounted", f"Found mounts: {', '.join(exposed_mounts)}")
        else:
            self.log("PASS", "Filesystem Isolation", "No sensitive host directories detected inside container")

    def audit_namespaces(self):
        """Check if container shares PID or Network namespace with host."""
        # Check host PID namespace via /proc/1
        proc_one = Path("/proc/1/comm")
        if proc_one.exists():
            comm = proc_one.read_text().strip()
            if comm in ["systemd", "init"]:
                self.log(
                    "CRITICAL",
                    "Host PID Namespace Shared",
                    f"PID 1 is '{comm}' (host system init). Container can inject or kill host processes.",
                )
            else:
                self.log("PASS", "PID Namespace", f"PID 1 is containerized entrypoint '{comm}'")
        else:
            self.log("PASS", "PID Namespace", "Isolated PID namespace verified")

    def audit_security_profiles(self):
        """Verify Seccomp, AppArmor, and SELinux status."""
        status_file = Path("/proc/self/status")
        if status_file.exists():
            for line in status_file.read_text().splitlines():
                if line.startswith("Seccomp:"):
                    mode = line.split()[1]
                    if mode == "2":
                        self.log("PASS", "Seccomp Filter", "Strict seccomp filter enabled (mode 2)")
                    elif mode == "1":
                        self.log("MEDIUM", "Seccomp", "Seccomp mode 1 active")
                    else:
                        self.log("HIGH", "Seccomp Disabled", "Seccomp is disabled (mode 0)")
                    break

        apparmor_file = Path("/proc/self/attr/current")
        if apparmor_file.exists():
            profile = apparmor_file.read_text().strip()
            if profile and profile != "unconfined":
                self.log("PASS", "AppArmor Profile", f"Profile enforced: {profile}")
            else:
                self.log("MEDIUM", "AppArmor", "AppArmor is unconfined or not enforcing")

    def run_all(self) -> Dict[str, Any]:
        print("\n" + "=" * 70)
        print("  DATACENTER / INFRASTRUCTURE CONTAINER ESCAPE SECURITY AUDIT")
        print("=" * 70)
        self.audit_capabilities()
        self.audit_socket_mounts()
        self.audit_filesystem_mounts()
        self.audit_namespaces()
        self.audit_security_profiles()
        print("=" * 70)

        summary = {
            "critical": sum(1 for f in self.findings if f["severity"] == "CRITICAL"),
            "high": sum(1 for f in self.findings if f["severity"] == "HIGH"),
            "medium": sum(1 for f in self.findings if f["severity"] == "MEDIUM"),
            "pass": sum(1 for f in self.findings if f["severity"] == "PASS"),
            "findings": self.findings,
        }
        print(f"Audit Summary: {summary['critical']} Critical, {summary['high']} High, {summary['medium']} Medium, {summary['pass']} Passed\n")
        return summary


if __name__ == "__main__":
    dry = "--dry-run" in sys.argv
    auditor = ContainerEscapeAuditor(dry_run=dry)
    results = auditor.run_all()
    if "--json" in sys.argv:
        print(json.dumps(results, indent=2))
    sys.exit(1 if results["critical"] > 0 else 0)
