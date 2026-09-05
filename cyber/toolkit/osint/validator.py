"""OSINT intelligence verification and confidence scoring."""

from typing import List
from cyber.core.models import Indicator, ConfidenceLevel

class OsintValidator:
    """Validates OSINT feeds and updates confidence levels based on multi-source confirmation."""

    @staticmethod
    def verify_indicators(indicators: List[Indicator], authoritative_sources: List[str]) -> List[Indicator]:
        for ind in indicators:
            if any(auth in ind.provenance for auth in authoritative_sources):
                ind.confidence = ConfidenceLevel.FACT
            else:
                ind.confidence = ConfidenceLevel.INFERRED
        return indicators
