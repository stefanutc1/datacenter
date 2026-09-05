"""Unit tests for Forensic Artifact Parsers."""

import os
import unittest
from cyber.parsers import (
    AuthRelayParser, SipVoipParser, ApiExposureParser,
    EvtxSysmonParser, MemoryVolatilityParser, MftPrefetchParser
)

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "fixtures")

class TestParsers(unittest.TestCase):
    def test_auth_relay_parser(self):
        p = AuthRelayParser()
        path = os.path.join(FIXTURES_DIR, "sample_bitm_payload.json")
        artifacts = p.parse_file(path)
        self.assertEqual(len(artifacts), 1)
        self.assertEqual(artifacts[0].normalized_data["username"], "victim_engineer")
        self.assertEqual(artifacts[0].normalized_data["totp_code"], "RH92K")
        self.assertTrue(artifacts[0].normalized_data["has_session_cookie"])

    def test_sip_voip_parser(self):
        p = SipVoipParser()
        path = os.path.join(FIXTURES_DIR, "sample_sip_invite.txt")
        artifacts = p.parse_file(path)
        self.assertEqual(len(artifacts), 1)
        self.assertTrue(artifacts[0].normalized_data["is_spoofed_caller_id"])
        self.assertEqual(artifacts[0].normalized_data["carrier_ip"], "195.138.22.14")

    def test_api_exposure_parser(self):
        p = ApiExposureParser()
        path = os.path.join(FIXTURES_DIR, "sample_api_config.json")
        artifacts = p.parse_file(path)
        self.assertEqual(len(artifacts), 1)
        self.assertTrue(artifacts[0].normalized_data["withdrawal_killswitch_active"])
        self.assertEqual(artifacts[0].normalized_data["deposit_wallet"], "TYDzt62NoD8kX88VAbLpU294KsM92P81aB")

    def test_evtx_sysmon_parser(self):
        p = EvtxSysmonParser()
        path = os.path.join(FIXTURES_DIR, "sample_sysmon_events.json")
        artifacts = p.parse_file(path)
        self.assertEqual(len(artifacts), 2)
        event_ids = [a.normalized_data["event_id"] for a in artifacts]
        self.assertIn("4769", event_ids)
        self.assertIn("10", event_ids)

    def test_volatility_parser(self):
        p = MemoryVolatilityParser()
        path = os.path.join(FIXTURES_DIR, "sample_volatility.txt")
        artifacts = p.parse_file(path)
        self.assertTrue(len(artifacts) >= 1)
        has_injected = any(a.artifact_type == "volatility_injected_memory" for a in artifacts)
        self.assertTrue(has_injected)

    def test_mft_parser(self):
        p = MftPrefetchParser()
        path = os.path.join(FIXTURES_DIR, "sample_mft_records.csv")
        artifacts = p.parse_file(path)
        self.assertEqual(len(artifacts), 1)
        self.assertTrue(artifacts[0].normalized_data["is_timestomped"])

if __name__ == "__main__":
    unittest.main()
