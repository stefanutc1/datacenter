"""Unit tests for Domain Detection Analyzers."""

import os
import unittest
from cyber.parsers import AuthRelayParser, SipVoipParser, ApiExposureParser, EvtxSysmonParser
from cyber.analyzers import AitmDetector, TelephonyFraudDetector, TaskScamAnalyzer, ActiveDirectoryAnalyzer

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "fixtures")

class TestAnalyzers(unittest.TestCase):
    def test_aitm_analyzer(self):
        artifacts = AuthRelayParser().parse_file(os.path.join(FIXTURES_DIR, "sample_bitm_payload.json"))
        findings, indicators = AitmDetector().analyze(artifacts)
        self.assertTrue(len(findings) >= 1)
        self.assertTrue(any(f.severity.value == "CRITICAL" for f in findings))
        self.assertTrue(any(i.type.value == "ipv4-addr" for i in indicators))

    def test_telephony_analyzer(self):
        artifacts = SipVoipParser().parse_file(os.path.join(FIXTURES_DIR, "sample_sip_invite.txt"))
        findings, indicators = TelephonyFraudDetector().analyze(artifacts)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0].category, "TELEPHONY FRAUD")
        self.assertTrue(any(i.value == "195.138.22.14" for i in indicators))

    def test_task_scam_analyzer(self):
        artifacts = ApiExposureParser().parse_file(os.path.join(FIXTURES_DIR, "sample_api_config.json"))
        findings, indicators = TaskScamAnalyzer().analyze(artifacts)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0].category, "API REVERSE ENGINEERING")
        self.assertTrue(any(i.type.value == "crypto-wallet" for i in indicators))

    def test_ad_analyzer(self):
        artifacts = EvtxSysmonParser().parse_file(os.path.join(FIXTURES_DIR, "sample_sysmon_events.json"))
        findings, indicators = ActiveDirectoryAnalyzer().analyze(artifacts)
        self.assertEqual(len(findings), 2)
        titles = [f.title for f in findings]
        self.assertTrue(any("Kerberoasting" in t for t in titles))
        self.assertTrue(any("LSASS" in t for t in titles))

if __name__ == "__main__":
    unittest.main()
