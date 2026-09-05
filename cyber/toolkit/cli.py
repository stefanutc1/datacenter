"""Unified Command Line Interface for Cyber Security Engineering & DFIR Toolkit."""

import argparse
import json
import sys
import os
from typing import List

from cyber.core.hashing import compute_hashes, register_evidence, verify_evidence
from cyber.core.models import Evidence, TLPClassification, Indicator, IndicatorType
from cyber.core.compliance import ComplianceMatrixGenerator
from cyber.parsers import get_parser_for_file
from cyber.parsers.pe_metadata_parser import PeMetadataParser
from cyber.analyzers.deobfuscator import PayloadDeobfuscator
from cyber.correlation.engine import CorrelationEngine
from cyber.reporters.markdown_reporter import MarkdownReporter
from cyber.reporters.json_reporter import JsonReporter
from cyber.reporters.console_reporter import ConsoleReporter
from cyber.exporters.stix_exporter import StixExporter
from cyber.exporters.sqlite_exporter import SqliteExporter
from cyber.exporters.firewall_exporter import FirewallExporter
from cyber.rules.yara_engine import YaraEngine
from cyber.rules.osquery_engine import OsqueryEngine
from cyber.triage.collector import TriageCollector

def main():
    parser = argparse.ArgumentParser(
        prog="cyber",
        description="Cybersecurity Engineering, Threat Research & DFIR Automation Toolkit"
    )
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Command: hash
    hash_parser = subparsers.add_parser("hash", help="Compute SHA-256 and SHA-512 cryptographic hashes of evidence.")
    hash_parser.add_argument("file", help="Path to evidence file.")
    hash_parser.add_argument("--json", action="store_true", help="Output results in JSON format.")

    # Command: verify
    verify_parser = subparsers.add_parser("verify", help="Verify evidence file against expected SHA-256 checksum.")
    verify_parser.add_argument("file", help="Path to evidence file.")
    verify_parser.add_argument("expected_sha256", help="Expected SHA-256 hexadecimal string.")

    # Command: parse
    parse_parser = subparsers.add_parser("parse", help="Parse evidence file into normalized artifacts.")
    parse_parser.add_argument("file", help="Path to evidence artifact file.")
    parse_parser.add_argument("--output", "-o", help="Optional output JSON path.")

    # Command: analyze
    analyze_parser = subparsers.add_parser("analyze", help="Execute complete parse, analyze, correlate, and reporting pipeline.")
    analyze_parser.add_argument("file", help="Path to evidence artifact file.")
    analyze_parser.add_argument("--title", default="Forensic Investigation Analysis", help="Title for the report.")
    analyze_parser.add_argument("--markdown", "-m", help="Path to export Markdown report.")
    analyze_parser.add_argument("--json", "-j", help="Path to export JSON report.")
    analyze_parser.add_argument("--sqlite", "-s", help="Path to export forensic SQLite database.")
    analyze_parser.add_argument("--stix", help="Path to export STIX 2.1 JSON bundle.")

    # Command: deobfuscate
    deob_parser = subparsers.add_parser("deobfuscate", help="Deobfuscate PowerShell, JavaScript, Hex, or Base64 payloads.")
    deob_parser.add_argument("payload", help="Path to payload file or raw encoded string.")

    # Command: triage
    triage_parser = subparsers.add_parser("triage", help="Collect live forensic evidence and generate SHA-256 signed tar archive.")
    triage_parser.add_argument("--output", "-o", default="/tmp", help="Output directory for triage package.")

    # Command: osquery
    osq_parser = subparsers.add_parser("osquery", help="Output enterprise threat hunting Osquery / FleetDM query packs.")
    osq_parser.add_argument("--platform", choices=["linux", "windows", "all"], default="all", help="Target OS platform.")
    osq_parser.add_argument("--mitre", help="Filter queries by MITRE ATT&CK technique.")

    # Command: pe-meta
    pe_parser = subparsers.add_parser("pe-meta", help="Extract PE binary headers, compile timestamps, and imphash.")
    pe_parser.add_argument("file", help="Path to Windows PE binary (.exe, .dll, .sys).")

    # Command: compliance
    comp_parser = subparsers.add_parser("compliance", help="Evaluate evidence set for ISO/IEC 27037 compliance.")
    comp_parser.add_argument("files", nargs="+", help="List of evidence file paths to evaluate.")

    # Command: yara-gen
    yara_parser = subparsers.add_parser("yara-gen", help="Generate formatted YARA detection rule.")
    yara_parser.add_argument("--name", required=True, help="YARA rule identifier name.")
    yara_parser.add_argument("--desc", required=True, help="Rule description metadata.")
    yara_parser.add_argument("--strings", nargs="+", required=True, help="List of indicator strings to match.")
    yara_parser.add_argument("--condition", default="any of ($s*)", help="YARA boolean condition.")

    # Command: firewall
    fw_parser = subparsers.add_parser("firewall", help="Generate firewall rules from IPv4 indicators.")
    fw_parser.add_argument("ips", nargs="+", help="Target IP addresses to block.")
    fw_parser.add_argument("--type", choices=["opnsense", "iptables"], default="opnsense", help="Target firewall format.")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    try:
        if args.command == "hash":
            sha256, sha512, size = compute_hashes(args.file)
            if args.json:
                print(json.dumps({"file": args.file, "sha256": sha256, "sha512": sha512, "size_bytes": size}, indent=2))
            else:
                print(f"\n[+] Evidence: {args.file}")
                print(f"    Size:   {size:,} bytes")
                print(f"    SHA256: {sha256}")
                print(f"    SHA512: {sha512}\n")

        elif args.command == "verify":
            sha256, _, _ = compute_hashes(args.file)
            if sha256.lower() == args.expected_sha256.lower():
                print(f"[SUCCESS] Integrity verified! SHA-256 matches: {sha256}")
                sys.exit(0)
            else:
                print(f"[FAIL] Integrity mismatch! Got: {sha256}, Expected: {args.expected_sha256}", file=sys.stderr)
                sys.exit(2)

        elif args.command == "parse":
            parser_impl = get_parser_for_file(args.file)
            artifacts = parser_impl.parse_file(args.file)
            res = [a.to_dict() for a in artifacts]
            if args.output:
                with open(args.output, "w", encoding="utf-8") as f:
                    json.dump(res, f, indent=2)
                print(f"[+] Parsed {len(artifacts)} artifacts written to {args.output}")
            else:
                print(json.dumps(res, indent=2))

        elif args.command == "analyze":
            parser_impl = get_parser_for_file(args.file)
            artifacts = parser_impl.parse_file(args.file)
            engine = CorrelationEngine()
            report = engine.process_artifacts(artifacts, report_title=args.title)

            ConsoleReporter.print_summary(report)

            if args.markdown:
                md_content = MarkdownReporter.generate(report)
                with open(args.markdown, "w", encoding="utf-8") as f:
                    f.write(md_content)
                print(f"[+] Markdown report saved to: {args.markdown}")

            if args.json:
                with open(args.json, "w", encoding="utf-8") as f:
                    f.write(JsonReporter.generate(report))
                print(f"[+] JSON report saved to: {args.json}")

            if args.sqlite:
                SqliteExporter.export_report(report, args.sqlite)
                print(f"[+] SQLite database saved to: {args.sqlite}")

            if args.stix:
                StixExporter.export_file(report.indicators, args.stix)
                print(f"[+] STIX 2.1 bundle saved to: {args.stix}")

        elif args.command == "deobfuscate":
            raw_text = args.payload
            if os.path.exists(args.payload):
                with open(args.payload, "r", encoding="utf-8", errors="ignore") as f:
                    raw_text = f.read()
            res = PayloadDeobfuscator.deobfuscate(raw_text)
            print(json.dumps(res, indent=2))

        elif args.command == "triage":
            collector = TriageCollector(output_dir=args.output)
            res = collector.collect()
            print(f"\n[+] Live Triage Collection Complete:")
            print(f"    Archive: {res['archive_path']}")
            print(f"    SHA-256: {res['sha256']}")
            print(f"    Size:    {res['file_size']:,} bytes\n")

        elif args.command == "osquery":
            if args.mitre:
                packs = OsqueryEngine.get_query_by_mitre(args.mitre)
            else:
                packs = OsqueryEngine.get_queries_by_platform(args.platform)
            print(json.dumps(packs, indent=2))

        elif args.command == "pe-meta":
            parser_impl = PeMetadataParser()
            artifacts = parser_impl.parse_file(args.file)
            print(json.dumps([a.to_dict() for a in artifacts], indent=2))

        elif args.command == "compliance":
            ev_list = [register_evidence(f) for f in args.files if os.path.exists(f)]
            matrix = ComplianceMatrixGenerator.evaluate(ev_list)
            print(json.dumps(matrix, indent=2))

        elif args.command == "yara-gen":
            rule_text = YaraEngine.generate_rule(args.name, args.desc, args.strings, args.condition)
            print("\n" + rule_text + "\n")

        elif args.command == "firewall":
            indicators = [
                Indicator(type=IndicatorType.IPV4, value=ip, provenance="CLI Input", description="Blocked Threat Actor")
                for ip in args.ips
            ]
            if args.type == "opnsense":
                print(FirewallExporter.generate_opnsense_table(indicators))
            else:
                print(FirewallExporter.generate_iptables_script(indicators))

    except Exception as e:
        print(f"[ERROR] {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
