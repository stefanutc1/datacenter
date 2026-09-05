"""OASIS STIX 2.1 JSON bundle exporter."""

import json
from datetime import datetime, timezone
from typing import List, Dict, Any
from cyber.core.models import Indicator, IndicatorType

class StixExporter:
    """Generates standardized STIX 2.1 JSON bundles from Indicator objects."""

    @staticmethod
    def to_bundle(indicators: List[Indicator], bundle_id: str = None) -> Dict[str, Any]:
        now_iso = datetime.now(timezone.utc).isoformat()
        objects = []

        for idx, ind in enumerate(indicators):
            pattern_val = f"['{ind.value}']"
            if ind.type == IndicatorType.IPV4:
                pattern = f"[ipv4-addr:value = '{ind.value}']"
            elif ind.type == IndicatorType.DOMAIN:
                pattern = f"[domain-name:value = '{ind.value}']"
            elif ind.type == IndicatorType.URL:
                pattern = f"[url:value = '{ind.value}']"
            elif ind.type in (IndicatorType.SHA256, IndicatorType.MD5):
                pattern = f"[file:hashes.'SHA-256' = '{ind.value}']"
            else:
                pattern = f"[custom-object:value = '{ind.value}']"

            obj = {
                "type": "indicator",
                "spec_version": "2.1",
                "id": f"indicator--00000000-0000-0000-0000-{idx+1:012d}",
                "created": now_iso,
                "modified": now_iso,
                "name": f"{ind.type.value}: {ind.value}",
                "description": ind.description,
                "indicator_types": ["malicious-activity"],
                "pattern": pattern,
                "pattern_type": "stix",
                "valid_from": ind.first_seen,
                "confidence": 85 if ind.confidence.value == "FACT" else 50
            }
            objects.append(obj)

        return {
            "type": "bundle",
            "id": bundle_id or "bundle--c4e3b129-87a1-42e5-9fa2-8b894172a392",
            "spec_version": "2.1",
            "objects": objects
        }

    @classmethod
    def export_file(cls, indicators: List[Indicator], output_path: str):
        bundle = cls.to_bundle(indicators)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(bundle, f, indent=2)
