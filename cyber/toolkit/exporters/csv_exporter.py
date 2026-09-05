"""CSV exporter for indicators and forensic super-timelines."""

import csv
from typing import List
from cyber.core.models import Indicator, TimelineEvent, Finding

class CsvExporter:
    """Exports structured data objects to standard CSV files."""

    @staticmethod
    def export_indicators(indicators: List[Indicator], output_path: str):
        with open(output_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["Type", "Value", "Provenance", "Description", "Confidence", "First Seen"])
            for ind in indicators:
                writer.writerow([
                    ind.type.value,
                    ind.value,
                    ind.provenance,
                    ind.description,
                    ind.confidence.value,
                    ind.first_seen
                ])

    @staticmethod
    def export_timeline(timeline: List[TimelineEvent], output_path: str):
        with open(output_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["Timestamp", "Source", "Event Type", "Description", "Host", "User", "Severity"])
            for ev in timeline:
                writer.writerow([
                    ev.timestamp,
                    ev.source,
                    ev.event_type,
                    ev.description,
                    ev.host or "",
                    ev.user or "",
                    ev.severity.value
                ])
