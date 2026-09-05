"""Unit tests for STIX 2.1, SQLite, and CSV exporters."""

import json
import os
import sqlite3
import tempfile
import unittest
from cyber.core.models import Indicator, IndicatorType, InvestigationReport, Finding, Severity
from cyber.exporters import StixExporter, SqliteExporter, CsvExporter

class TestExporters(unittest.TestCase):
    def test_stix_export(self):
        indicators = [
            Indicator(type=IndicatorType.IPV4, value="195.138.22.14", provenance="SIP Trace", description="VoIP Gateway"),
            Indicator(type=IndicatorType.DOMAIN, value="fake-bank-auth.com", provenance="DNS Log", description="Phishing C2")
        ]
        bundle = StixExporter.to_bundle(indicators)
        self.assertEqual(bundle["type"], "bundle")
        self.assertEqual(bundle["spec_version"], "2.1")
        self.assertEqual(len(bundle["objects"]), 2)

    def test_sqlite_export(self):
        with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as f:
            db_path = f.name
        try:
            rep = InvestigationReport(
                title="SQLite Test",
                findings=[Finding(title="F1", category="TEST", severity=Severity.HIGH)],
                indicators=[Indicator(type=IndicatorType.IPV4, value="10.0.0.1", provenance="Test")]
            )
            SqliteExporter.export_report(rep, db_path)
            
            conn = sqlite3.connect(db_path)
            cur = conn.cursor()
            cur.execute("SELECT title FROM report_meta")
            row = cur.fetchone()
            self.assertEqual(row[0], "SQLite Test")
            conn.close()
        finally:
            if os.path.exists(db_path):
                os.unlink(db_path)

if __name__ == "__main__":
    unittest.main()
