"""Structured Markdown report generator for DFIR case studies."""

from cyber.core.models import InvestigationReport

class MarkdownReporter:
    """Generates formal Markdown technical reports conforming to ISO/IEC 27037 standards."""

    @staticmethod
    def generate(report: InvestigationReport) -> str:
        lines = [
            f"# {report.title}",
            "",
            f"**Report ID**: `{report.report_id}` | **Author**: `{report.author}` | **Date**: `{report.created_at[:10]}` | **Classification**: `{report.tlp.value}`",
            "",
            "---",
            "",
            "## 1. Executive Summary",
            "",
            report.executive_summary,
            "",
            "---",
            "",
            "## 2. Technical Findings",
            ""
        ]

        for idx, finding in enumerate(report.findings, 1):
            lines.extend([
                f"### Finding {idx:02d}: {finding.title}",
                f"* **Category**: `{finding.category}`",
                f"* **Severity**: `{finding.severity.value}`",
                f"* **MITRE ATT&CK**: {', '.join(f'`{t}`' for t in finding.mitre_techniques)}",
                f"* **Evidence References**: {', '.join(f'`{e}`' for e in finding.evidence_references)}",
                "",
                finding.description,
                "",
                f"> **Remediation**: {finding.remediation}",
                ""
            ])

        lines.extend([
            "---",
            "",
            "## 3. Indicators of Compromise (IoC)",
            "",
            "| Type | Value | Provenance | Confidence | Description |",
            "| :--- | :--- | :--- | :---: | :--- |"
        ])

        for ind in report.indicators:
            lines.append(f"| `{ind.type.value}` | `{ind.value}` | `{ind.provenance}` | `{ind.confidence.value}` | {ind.description} |")

        lines.extend([
            "",
            "---",
            "",
            "## 4. Chronological Incident Timeline",
            "",
            "| Timestamp (UTC) | Source | Event Type | Description | Severity |",
            "| :--- | :--- | :--- | :--- | :---: |"
        ])

        for ev in report.timeline:
            lines.append(f"| `{ev.timestamp}` | `{ev.source}` | `{ev.event_type}` | {ev.description} | `{ev.severity.value}` |")

        lines.extend([
            "",
            "---",
            "",
            "## 5. Methodology & Limitations",
            "",
            f"* **Methodology**: {report.methodology}",
            f"* **Limitations**: {report.limitations}"
        ])

        return "\n".join(lines)
