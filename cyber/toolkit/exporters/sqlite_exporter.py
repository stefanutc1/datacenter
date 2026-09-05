"""Forensic SQLite database exporter for structured evidence persistence."""

import sqlite3
from typing import List
from cyber.core.models import InvestigationReport

class SqliteExporter:
    """Persists complete investigation reports into relational SQLite databases."""

    @staticmethod
    def export_report(report: InvestigationReport, db_path: str):
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()

        # Create Schema
        cur.execute("""
            CREATE TABLE IF NOT EXISTS report_meta (
                report_id TEXT PRIMARY KEY,
                title TEXT,
                author TEXT,
                created_at TEXT,
                tlp TEXT,
                executive_summary TEXT
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS findings (
                finding_id TEXT PRIMARY KEY,
                report_id TEXT,
                title TEXT,
                category TEXT,
                severity TEXT,
                description TEXT,
                remediation TEXT
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS indicators (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                report_id TEXT,
                type TEXT,
                value TEXT,
                provenance TEXT,
                description TEXT,
                confidence TEXT
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS timeline (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                report_id TEXT,
                timestamp TEXT,
                source TEXT,
                event_type TEXT,
                description TEXT,
                severity TEXT
            )
        """)

        # Insert Meta
        cur.execute(
            "INSERT OR REPLACE INTO report_meta VALUES (?, ?, ?, ?, ?, ?)",
            (report.report_id, report.title, report.author, report.created_at, report.tlp.value, report.executive_summary)
        )

        # Insert Findings
        for f in report.findings:
            cur.execute(
                "INSERT OR REPLACE INTO findings VALUES (?, ?, ?, ?, ?, ?, ?)",
                (f.finding_id, report.report_id, f.title, f.category, f.severity.value, f.description, f.remediation)
            )

        # Insert Indicators
        for ind in report.indicators:
            cur.execute(
                "INSERT INTO indicators (report_id, type, value, provenance, description, confidence) VALUES (?, ?, ?, ?, ?, ?)",
                (report.report_id, ind.type.value, ind.value, ind.provenance, ind.description, ind.confidence.value)
            )

        # Insert Timeline
        for ev in report.timeline:
            cur.execute(
                "INSERT INTO timeline (report_id, timestamp, source, event_type, description, severity) VALUES (?, ?, ?, ?, ?, ?)",
                (report.report_id, ev.timestamp, ev.source, ev.event_type, ev.description, ev.severity.value)
            )

        conn.commit()
        conn.close()
