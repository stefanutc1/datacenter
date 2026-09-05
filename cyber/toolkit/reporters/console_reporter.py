"""Clean terminal console output formatter for DFIR analysts."""

from cyber.core.models import InvestigationReport

class ConsoleReporter:
    """Prints understated, clean CLI analysis summaries."""

    @staticmethod
    def print_summary(report: InvestigationReport):
        print("\n" + "=" * 70)
        print(f"  {report.title.upper()}")
        print(f"  Report ID: {report.report_id} | TLP: {report.tlp.value}")
        print("=" * 70)
        print(f"\n[+] Summary: {report.executive_summary}\n")

        print("[-] Findings Overview:")
        for f in report.findings:
            print(f"  * [{f.severity.value}] {f.title} ({f.category})")

        print(f"\n[-] Extracted Indicators: {len(report.indicators)}")
        for ind in report.indicators[:5]:
            print(f"  * {ind.type.value}: {ind.value} [{ind.confidence.value}]")
        if len(report.indicators) > 5:
            print(f"  ... and {len(report.indicators) - 5} more indicators.")

        print(f"\n[-] Timeline Events: {len(report.timeline)} recorded events.")
        print("=" * 70 + "\n")
