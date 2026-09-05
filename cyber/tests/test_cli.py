"""Unit tests for CLI execution via subprocess."""

import os
import subprocess
import sys
import unittest

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "fixtures")

class TestCli(unittest.TestCase):
    def test_cli_hash(self):
        target = os.path.join(FIXTURES_DIR, "sample_api_config.json")
        res = subprocess.run([sys.executable, "-m", "cyber", "hash", target], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0)
        self.assertIn("SHA256:", res.stdout)

    def test_cli_analyze_e2e(self):
        target = os.path.join(FIXTURES_DIR, "sample_bitm_payload.json")
        res = subprocess.run([sys.executable, "-m", "cyber", "analyze", target, "--title", "Automated CLI Test"], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0)
        self.assertIn("Browser-in-the-Middle", res.stdout)

    def test_cli_firewall(self):
        res = subprocess.run([sys.executable, "-m", "cyber", "firewall", "195.138.22.14", "185.220.101.44"], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0)
        self.assertIn("195.138.22.14/32", res.stdout)

if __name__ == "__main__":
    unittest.main()
