"""Correlation engine integrating parsers, analyzers, timelines, and investigation graphs."""

from typing import List, Tuple
from cyber.core.models import Artifact, Finding, Indicator, TimelineEvent, InvestigationReport
from cyber.analyzers import ALL_ANALYZERS
from cyber.correlation.timeline import TimelineGenerator
from cyber.correlation.graph import InvestigationGraph

class CorrelationEngine:
    """Orchestrates multi-stage artifact evaluation, correlation, and report synthesis."""

    def __init__(self, analyzers=None):
        self.analyzers = analyzers or ALL_ANALYZERS

    def process_artifacts(self, artifacts: List[Artifact], report_title: str = "Forensic Investigation Report") -> InvestigationReport:
        all_findings: List[Finding] = []
        all_indicators: List[Indicator] = []

        # 1. Run all analyzers over artifacts
        for analyzer in self.analyzers:
            findings, indicators = analyzer.analyze(artifacts)
            all_findings.extend(findings)
            all_indicators.extend(indicators)

        # 2. Generate unified chronological super-timeline
        timeline: List[TimelineEvent] = TimelineGenerator.from_artifacts(artifacts)

        # 3. Synthesize master InvestigationReport
        report = InvestigationReport(
            title=report_title,
            executive_summary=(
                f"Evaluation completed across {len(artifacts)} parsed artifacts. "
                f"Identified {len(all_findings)} key technical findings and extracted {len(all_indicators)} indicators of compromise."
            ),
            findings=all_findings,
            indicators=all_indicators,
            timeline=timeline
        )

        return report
