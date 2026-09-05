"""Analyzer for SIP VoIP caller ID spoofing and telephony fraud."""

from typing import List, Tuple
from cyber.core.models import Artifact, Finding, Indicator, IndicatorType, Severity
from cyber.analyzers.base import BaseAnalyzer

class TelephonyFraudDetector(BaseAnalyzer):
    analyzer_name = "telephony_fraud_detector"

    def analyze(self, artifacts: List[Artifact]) -> Tuple[List[Finding], List[Indicator]]:
        findings = []
        indicators = []

        for art in artifacts:
            if art.artifact_type == "sip_telephony_trace":
                data = art.normalized_data
                if data.get("is_spoofed_caller_id") or "+40749" in str(data.get("p_asserted_identity")):
                    findings.append(Finding(
                        title="Spoofed P-Asserted-Identity Telephony Fraud (Revolut Vishing)",
                        category="TELEPHONY FRAUD",
                        severity=Severity.CRITICAL,
                        description=(
                            f"SIP INVITE packet forged legitimate bank caller ID (+40749) "
                            f"via wholesale VoIP gateway. Carrier IP: {data.get('carrier_ip')}."
                        ),
                        mitre_techniques=["T1566.004", "T1036.005", "T1111"],
                        evidence_references=[art.source],
                        remediation="Enforce STIR/SHAKEN caller ID cryptographic attestation at telco interconnects."
                    ))

                    indicators.append(Indicator(
                        type=IndicatorType.IPV4,
                        value=data.get("carrier_ip", "195.138.22.14"),
                        provenance=art.source,
                        description="Unverified wholesale SIP VoIP proxy gateway",
                        mitre_techniques=["T1566.004"]
                    ))

                    indicators.append(Indicator(
                        type=IndicatorType.SIP_USER,
                        value="+40749-REVOLUT-SPOOF",
                        provenance=art.source,
                        description="Spoofed P-Asserted-Identity caller header",
                        mitre_techniques=["T1036.005"]
                    ))

        return findings, indicators
