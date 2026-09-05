"""Data provenance and confidence tracking for DFIR findings and intelligence."""

from typing import Dict, Any
from cyber.core.models import ConfidenceLevel, Indicator, Finding

class ProvenanceTracker:
    """Tracks origin, collection method, and verification status of indicators and findings."""
    
    @staticmethod
    def tag_indicator(
        indicator: Indicator,
        source_reference: str,
        confidence: ConfidenceLevel = ConfidenceLevel.FACT,
        extracted_by: str = "automated_parser"
    ) -> Indicator:
        indicator.provenance = source_reference
        indicator.confidence = confidence
        indicator.metadata["extracted_by"] = extracted_by
        return indicator

    @staticmethod
    def tag_finding(
        finding: Finding,
        confidence: ConfidenceLevel = ConfidenceLevel.FACT,
        evidence_chain: list = None
    ) -> Finding:
        if evidence_chain:
            finding.evidence_references.extend(evidence_chain)
        return finding
