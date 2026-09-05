"""JSON report generator for machine-readable automation pipelines."""

import json
from cyber.core.models import InvestigationReport

class JsonReporter:
    """Serializes InvestigationReport into formatted JSON string."""

    @staticmethod
    def generate(report: InvestigationReport) -> str:
        return json.dumps(report.to_dict(), indent=2)
