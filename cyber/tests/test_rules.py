"""Unit tests for Detection Rules (YARA, Sigma, Suricata)."""

import unittest
from cyber.rules import YaraEngine, SigmaEngine, SuricataEngine

class TestRules(unittest.TestCase):
    def test_yara_rule_generation(self):
        rule = YaraEngine.generate_rule(
            rule_name="Test_Malware_Drop",
            description="Detects test dropper",
            strings=["steamLoginSecure", "evil_c2_domain.com"]
        )
        self.assertIn("rule Test_Malware_Drop", rule)
        self.assertIn('$s1 = "steamLoginSecure"', rule)
        self.assertTrue(YaraEngine.match_strings(rule, "Captured session steamLoginSecure on host"))

    def test_sigma_evaluation(self):
        rule = {
            "title": "Test Kerberoast",
            "detection": {
                "selection": {"EventID": 4769, "TicketEncryptionType": "0x17"}
            }
        }
        event_match = {"EventID": 4769, "TicketEncryptionType": "0x17"}
        event_nomatch = {"EventID": 4769, "TicketEncryptionType": "0x12"}
        self.assertTrue(SigmaEngine.evaluate_event(rule, event_match))
        self.assertFalse(SigmaEngine.evaluate_event(rule, event_nomatch))

    def test_suricata_rule_parsing(self):
        rule_str = 'drop sip any any -> $HOME_NET 5060 (msg:"Spoofed Telephony"; content:"+40749"; sid:9000002; rev:1;)'
        parsed = SuricataEngine.parse_rule(rule_str)
        self.assertIsNotNone(parsed)
        self.assertEqual(parsed["action"], "drop")
        self.assertEqual(parsed["protocol"], "sip")
        self.assertEqual(parsed["sid"], 9000002)

if __name__ == "__main__":
    unittest.main()
