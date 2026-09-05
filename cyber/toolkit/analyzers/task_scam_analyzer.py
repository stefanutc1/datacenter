"""Analyzer for task scam platforms, API configuration exposure, and SQL injection flaws."""

from typing import List, Tuple
from cyber.core.models import Artifact, Finding, Indicator, IndicatorType, Severity
from cyber.analyzers.base import BaseAnalyzer

class TaskScamAnalyzer(BaseAnalyzer):
    analyzer_name = "task_scam_analyzer"

    def analyze(self, artifacts: List[Artifact]) -> Tuple[List[Finding], List[Indicator]]:
        findings = []
        indicators = []

        for art in artifacts:
            data = art.normalized_data
            if art.artifact_type == "api_config_exposure" and data.get("withdrawal_killswitch_active"):
                findings.append(Finding(
                    title="Hardcoded Fiat Withdrawal Kill-Switch in API Configuration",
                    category="API REVERSE ENGINEERING",
                    severity=Severity.HIGH,
                    description=(
                        f"Target /api/v1/site/config endpoint hardcodes bank and card withdrawals to false, "
                        f"locking victim funds while requiring USDT deposit to: {data.get('deposit_wallet')}."
                    ),
                    mitre_techniques=["T1499", "T1059.007"],
                    evidence_references=[art.source],
                    remediation="De-provision hosting instance and blacklist associated TRC-20 deposit wallets."
                ))

                if data.get("deposit_wallet"):
                    indicators.append(Indicator(
                        type=IndicatorType.CRYPTO_WALLET,
                        value=data["deposit_wallet"],
                        provenance=art.source,
                        description="TRC-20 USDT Scam Consolidation Wallet",
                        mitre_techniques=["T1499"]
                    ))

            if art.artifact_type == "sqli_vulnerability_trace":
                findings.append(Finding(
                    title="Unauthenticated SQL Injection Vulnerability on User Registration",
                    category="VULNERABILITY ASSESSMENT",
                    severity=Severity.HIGH,
                    description=f"Blind SQLi flaw detected on endpoint {data.get('endpoint')} on parameter '{data.get('vulnerable_param')}'.",
                    mitre_techniques=["T1190"],
                    evidence_references=[art.source],
                    remediation="Apply parameterized SQL prepared statements on all user registration fields."
                ))

        return findings, indicators
