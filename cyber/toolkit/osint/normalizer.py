"""OSINT threat feed normalizer."""

import re
from typing import List
from cyber.core.models import Indicator, IndicatorType, ConfidenceLevel

class OsintNormalizer:
    """Normalizes raw unstructured feeds into standardized typed Indicators."""

    IPV4_REGEX = re.compile(r"\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b")
    DOMAIN_REGEX = re.compile(r"\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b")
    SHA256_REGEX = re.compile(r"\b[a-fA-F0-9]{64}\b")

    @classmethod
    def extract_from_text(cls, text: str, source_feed: str = "OSINT Feed") -> List[Indicator]:
        indicators = []

        # IPs
        for ip in cls.IPV4_REGEX.findall(text):
            indicators.append(Indicator(
                type=IndicatorType.IPV4,
                value=ip,
                provenance=source_feed,
                confidence=ConfidenceLevel.UNVERIFIED,
                description="Extracted via OSINT feed parser"
            ))

        # Hashes
        for sha in cls.SHA256_REGEX.findall(text):
            indicators.append(Indicator(
                type=IndicatorType.SHA256,
                value=sha.lower(),
                provenance=source_feed,
                confidence=ConfidenceLevel.UNVERIFIED,
                description="Extracted SHA-256 hash"
            ))

        return indicators
