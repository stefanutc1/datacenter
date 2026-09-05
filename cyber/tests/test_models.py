"""Unit tests for Common Data Models."""

import unittest
from cyber.core.models import (
    Evidence, Artifact, Indicator, IndicatorType,
    TimelineEvent, Finding, ConfidenceLevel, Severity, TLPClassification, InvestigationReport
)

class TestModels(unittest.TestCase):
    def test_evidence_model(self):
        ev = Evidence(
            source_path="/tmp/evidence.pcap",
            sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            file_size_bytes=1024,
            tlp=TLPClassification.CLEAR
        )
        data = ev.to_dict()
        self.assertEqual(data["sha256"], "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
        self.assertEqual(data["tlp"], "TLP:CLEAR")

    def test_indicator_model(self):
        ind = Indicator(
            type=IndicatorType.IPV4,
            value="195.138.22.14",
            provenance="PCAP Capture",
            confidence=ConfidenceLevel.FACT,
            mitre_techniques=["T1566.004"]
        )
        data = ind.to_dict()
        self.assertEqual(data["type"], "ipv4-addr")
        self.assertEqual(data["confidence"], "FACT")
        self.assertEqual(data["value"], "195.138.22.14")

    def test_investigation_report_model(self):
        rep = InvestigationReport(
            title="Test Investigation",
            findings=[Finding(title="Test Finding", category="AUTH", severity=Severity.HIGH)],
            indicators=[Indicator(type=IndicatorType.DOMAIN, value="malicious.com", provenance="DNS Log")]
        )
        data = rep.to_dict()
        self.assertEqual(data["title"], "Test Investigation")
        self.assertEqual(len(data["findings"]), 1)
        self.assertEqual(len(data["indicators"]), 1)

if __name__ == "__main__":
    unittest.main()
