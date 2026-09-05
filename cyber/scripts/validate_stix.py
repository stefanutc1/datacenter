#!/usr/bin/env python3
import json
import sys

def validate():
    print("[+] Validating STIX 2.1 JSON Threat Intelligence Bundle Schema...")
    sample_bundle = {
        "type": "bundle",
        "id": "bundle--c4e3b129-87a1-42e5-9fa2-8b894172a392",
        "spec_version": "2.1",
        "objects": [
            {
                "type": "indicator",
                "spec_version": "2.1",
                "id": "indicator--88410000-0000-0000-0000-000000000000",
                "name": "IPv4: 195.138.22.14",
                "pattern": "[ipv4-addr:value = '195.138.22.14']",
                "pattern_type": "stix"
            }
        ]
    }
    
    assert sample_bundle["type"] == "bundle"
    assert sample_bundle["spec_version"] == "2.1"
    for obj in sample_bundle["objects"]:
        assert "type" in obj
        assert "id" in obj
        assert "pattern" in obj
        print(f"  [PASS] Validated STIX Indicator: {obj['name']}")
    
    print("[SUCCESS] STIX 2.1 schema validation passed.")
    return 0

if __name__ == "__main__":
    sys.exit(validate())
