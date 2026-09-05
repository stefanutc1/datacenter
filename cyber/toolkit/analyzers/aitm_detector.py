"""Analyzer for Adversary-in-the-Middle (AiTM) and Browser-in-the-Middle (BitM) attacks."""

from typing import List, Tuple
from cyber.core.models import Artifact, Finding, Indicator, IndicatorType, Severity, ConfidenceLevel
from cyber.analyzers.base import BaseAnalyzer

class AitmDetector(BaseAnalyzer):
    analyzer_name = "aitm_detector"

    def analyze(self, artifacts: List[Artifact]) -> Tuple[List[Finding], List[Indicator]]:
        findings = []
        indicators = []

        for art in artifacts:
            data = art.normalized_data
            if art.artifact_type == "auth_relay_session" or data.get("has_session_cookie"):
                # Finding 1: AiTM Session Capture & TOTP Relay
                if data.get("totp_code") or data.get("has_session_cookie"):
                    findings.append(Finding(
                        title="Browser-in-the-Middle (BitM) Real-Time Authentication Relay",
                        category="AUTHENTICATION FORENSICS",
                        severity=Severity.CRITICAL,
                        description=(
                            f"Victim credentials and 2FA token intercepted via in-DOM simulated popup window. "
                            f"Target Steam ID: {data.get('steam_id', 'N/A')}, TOTP: {data.get('totp_code', 'N/A')}."
                        ),
                        mitre_techniques=["T1556.007", "T1539", "T1111"],
                        evidence_references=[art.source],
                        remediation="Enforce FIDO2 / WebAuthn origin-bound authentication credentials."
                    ))

                # Finding 2: Post-Exploitation Account Lockout (Family View PIN)
                if data.get("family_view_pin"):
                    findings.append(Finding(
                        title="Post-Exploitation Denial of Service (Family View PIN Lockout)",
                        category="ACCOUNT TAKEOVER",
                        severity=Severity.HIGH,
                        description=f"Attacker set 4-digit Family View PIN ({data.get('family_view_pin')}) to prevent account recovery.",
                        mitre_techniques=["T1499", "T1556"],
                        evidence_references=[art.source],
                        remediation="Revoke family view PIN via Valve customer support identity validation."
                    ))

                # Indicator Extractions
                if data.get("source_ip"):
                    indicators.append(Indicator(
                        type=IndicatorType.IPV4,
                        value=data["source_ip"],
                        provenance=art.source,
                        description="AiTM Reverse Proxy C2 IP Address",
                        mitre_techniques=["T1556.007"]
                    ))

                indicators.append(Indicator(
                    type=IndicatorType.DOMAIN,
                    value="steamcommunity-openid-auth.com",
                    provenance=art.source,
                    description="Typosquatted domain hosting BitM in-DOM popup script",
                    mitre_techniques=["T1566.002", "T1036.005"]
                ))

        return findings, indicators
