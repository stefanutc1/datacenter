"""Unit tests for Correlation Engine, Timeline, and Graph Generation."""

import os
import unittest
from cyber.parsers import AuthRelayParser, SipVoipParser
from cyber.correlation import CorrelationEngine, TimelineGenerator, InvestigationGraph

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "fixtures")

class TestCorrelation(unittest.TestCase):
    def test_correlation_engine_e2e(self):
        p1 = AuthRelayParser().parse_file(os.path.join(FIXTURES_DIR, "sample_bitm_payload.json"))
        p2 = SipVoipParser().parse_file(os.path.join(FIXTURES_DIR, "sample_sip_invite.txt"))
        all_artifacts = p1 + p2

        engine = CorrelationEngine()
        report = engine.process_artifacts(all_artifacts, report_title="Multi-Vector Test Investigation")

        self.assertEqual(report.title, "Multi-Vector Test Investigation")
        self.assertTrue(len(report.findings) >= 2)
        self.assertTrue(len(report.indicators) >= 2)
        self.assertTrue(len(report.timeline) >= 2)

    def test_investigation_graph(self):
        graph = InvestigationGraph()
        p1 = AuthRelayParser().parse_file(os.path.join(FIXTURES_DIR, "sample_bitm_payload.json"))
        engine = CorrelationEngine()
        report = engine.process_artifacts(p1)

        graph.build_from_indicators(report.indicators)
        data = graph.to_dict()
        self.assertTrue(len(data["nodes"]) >= 2)
        self.assertTrue(len(data["edges"]) >= 1)

if __name__ == "__main__":
    unittest.main()
