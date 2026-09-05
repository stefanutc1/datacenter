"""Analyzer for Active Directory Kerberos and credential attacks."""

from typing import List, Tuple
from cyber.core.models import Artifact, Finding, Indicator, IndicatorType, Severity
from cyber.analyzers.base import BaseAnalyzer

class ActiveDirectoryAnalyzer(BaseAnalyzer):
    analyzer_name = "active_directory_analyzer"

    def analyze(self, artifacts: List[Artifact]) -> Tuple[List[Finding], List[Indicator]]:
        findings = []
        indicators = []

        for art in artifacts:
            data = art.normalized_data
            event_id = str(data.get("event_id", ""))

            # Event ID 4769 + RC4 (Kerberoasting)
            if event_id == "4769" and data.get("ticket_encryption") == "0x17":
                findings.append(Finding(
                    title="Kerberoasting Attack Detected (Event ID 4769 with RC4)",
                    category="ACTIVE DIRECTORY DEFENSE",
                    severity=Severity.HIGH,
                    description="Kerberos TGS request issued with legacy RC4 (0x17) encryption against service account.",
                    mitre_techniques=["T1558.003"],
                    evidence_references=[art.source],
                    remediation="Enforce AES128/AES256 on SPN accounts and migrate to gMSA."
                ))

            # Sysmon Event ID 10 on LSASS
            if event_id == "10" and "lsass.exe" in str(data.get("target_image", "")).lower():
                findings.append(Finding(
                    title="Suspicious LSASS Process Handle Acquired (Credential Dumping)",
                    category="ENDPOINT TELEMETRY",
                    severity=Severity.CRITICAL,
                    description=f"Process {data.get('process_name')} opened read handle against lsass.exe (GrantedAccess: {data.get('granted_access')}).",
                    mitre_techniques=["T1003.001"],
                    evidence_references=[art.source],
                    remediation="Enable RunAsPPL on lsass.exe and isolate source endpoint."
                ))

        return findings, indicators
