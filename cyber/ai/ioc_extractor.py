#!/usr/bin/env python3
"""
CyberLab Indicator of Compromise (IOC) Extractor
Extracts IPv4/IPv6 addresses, SHA256/MD5 hashes, and domains from unstructured logs.
"""

import re
import sys
import json
import argparse

IP_REGEX = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
SHA256_REGEX = r'\b[A-Fa-f0-9]{64}\b'
MD5_REGEX = r'\b[A-Fa-f0-9]{32}\b'
DOMAIN_REGEX = r'\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b'

def extract_iocs(text):
    ips = set(re.findall(IP_REGEX, text))
    sha256 = set(re.findall(SHA256_REGEX, text))
    md5 = set(re.findall(MD5_REGEX, text))
    domains = set(re.findall(DOMAIN_REGEX, text))

    # Filter out common false positives
    filtered_ips = [ip for ip in ips if not ip.startswith(("127.", "0.", "255."))]
    filtered_domains = [d for d in domains if not d.endswith((".local", ".internal", ".arpa"))]

    return {
        "ip_addresses": sorted(filtered_ips),
        "domains": sorted(filtered_domains),
        "sha256_hashes": sorted(list(sha256)),
        "md5_hashes": sorted(list(md5))
    }

def main():
    parser = argparse.ArgumentParser(description="CyberLab IOC Extractor")
    parser.add_argument("file", help="Log or text file to extract IOCs from")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    args = parser.parse_args()

    try:
        with open(args.file, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {e}", file=sys.stderr)
        sys.exit(1)

    iocs = extract_iocs(content)

    if args.json:
        print(json.dumps(iocs, indent=2))
    else:
        print(f"=== Extracted IOCs from {args.file} ===")
        print(f"IP Addresses ({len(iocs['ip_addresses'])}): {', '.join(iocs['ip_addresses']) or 'None'}")
        print(f"Domains ({len(iocs['domains'])}): {', '.join(iocs['domains']) or 'None'}")
        print(f"SHA-256 Hashes ({len(iocs['sha256_hashes'])}): {', '.join(iocs['sha256_hashes']) or 'None'}")
        print(f"MD5 Hashes ({len(iocs['md5_hashes'])}): {', '.join(iocs['md5_hashes']) or 'None'}")

if __name__ == "__main__":
    main()
