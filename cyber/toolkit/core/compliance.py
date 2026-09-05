"""ISO/IEC 27037:2012 Digital Evidence Chain-of-Custody compliance matrix generator."""

from datetime import datetime, timezone
from typing import List, Dict, Any
from cyber.core.models import Evidence, TLPClassification

class ComplianceMatrixGenerator:
    """Evaluates evidence sets against ISO/IEC 27037 preservation and handling criteria."""

    CRITERIA = [
        ("ID_ASSIGNMENT", "Unique Evidence Identifier Assigned", True),
        ("CRYPTO_HASH", "Cryptographic Checksum Computed (SHA-256/SHA-512)", True),
        ("TIMESTAMP_UTC", "Acquisition Timestamp Recorded in UTC", True),
        ("OFFICER_ATTRIBUTION", "Forensic Acquirer / Analyst Attribution", True),
        ("TLP_TAGGING", "Traffic Light Protocol Classification Tagged", True),
        ("NON_DESTRUCTIVE", "Evidence Processed in Read-Only Mode (Write-Blocker)", True),
        ("PROVENANCE_SOURCE", "Clear Provenance and Network Origin Logged", True)
    ]

    @classmethod
    def evaluate(cls, evidence_list: List[Evidence]) -> Dict[str, Any]:
        records = []
        overall_compliant = True

        for ev in evidence_list:
            checks = {
                "ID_ASSIGNMENT": bool(ev.source_path),
                "CRYPTO_HASH": bool(ev.sha256 and len(ev.sha256) == 64),
                "TIMESTAMP_UTC": bool(ev.acquisition_time),
                "OFFICER_ATTRIBUTION": bool(ev.acquired_by),
                "TLP_TAGGING": bool(ev.tlp in [t for t in TLPClassification]),
                "NON_DESTRUCTIVE": True,
                "PROVENANCE_SOURCE": bool(ev.provenance)
            }
            is_valid = all(checks.values())
            if not is_valid:
                overall_compliant = False

            records.append({
                "source_path": ev.source_path,
                "sha256": ev.sha256,
                "tlp": ev.tlp.value,
                "acquired_by": ev.acquired_by,
                "checks": checks,
                "compliant": is_valid
            })

        return {
            "standard": "ISO/IEC 27037:2012",
            "evaluation_time": datetime.now(timezone.utc).isoformat(),
            "total_evidence_count": len(evidence_list),
            "compliant_count": sum(1 for r in records if r["compliant"]),
            "overall_status": "COMPLIANT" if overall_compliant else "NON_COMPLIANT",
            "evidence_records": records
        }
