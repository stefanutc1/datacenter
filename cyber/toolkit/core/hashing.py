"""Cryptographic hashing and chain-of-custody verification for forensic evidence."""

import hashlib
import os
from typing import Dict, Tuple
from cyber.core.exceptions import InvalidInputError, EvidenceIntegrityError
from cyber.core.models import Evidence, TLPClassification

BUFFER_SIZE = 65536

def compute_hashes(file_path: str) -> Tuple[str, str, int]:
    """Compute SHA-256 and SHA-512 hashes along with byte size for a given file.
    
    Args:
        file_path: Path to target forensic evidence file.
        
    Returns:
        Tuple of (sha256_hex, sha512_hex, file_size_bytes)
    """
    if not os.path.exists(file_path):
        raise InvalidInputError(f"Evidence file not found: {file_path}")
        
    sha256_hash = hashlib.sha256()
    sha512_hash = hashlib.sha512()
    total_bytes = 0
    
    with open(file_path, "rb") as f:
        while chunk := f.read(BUFFER_SIZE):
            sha256_hash.update(chunk)
            sha512_hash.update(chunk)
            total_bytes += len(chunk)
            
    return sha256_hash.hexdigest(), sha512_hash.hexdigest(), total_bytes

def register_evidence(
    file_path: str,
    description: str = "",
    acquired_by: str = "stefanutc1",
    tlp: TLPClassification = TLPClassification.CLEAR,
    provenance: str = "Forensic Acquisition"
) -> Evidence:
    """Create an immutable Evidence record with computed cryptographic hashes."""
    sha256, sha512, size = compute_hashes(file_path)
    return Evidence(
        source_path=os.path.abspath(file_path),
        sha256=sha256,
        sha512=sha512,
        file_size_bytes=size,
        acquired_by=acquired_by,
        description=description,
        tlp=tlp,
        provenance=provenance
    )

def verify_evidence(evidence: Evidence) -> bool:
    """Verify that current on-disk evidence matches recorded cryptographic hashes."""
    if not os.path.exists(evidence.source_path):
        raise EvidenceIntegrityError(f"Evidence missing from path: {evidence.source_path}")
        
    current_sha256, current_sha512, current_size = compute_hashes(evidence.source_path)
    
    if current_sha256 != evidence.sha256:
        raise EvidenceIntegrityError(
            f"Evidence SHA-256 integrity mismatch! Expected {evidence.sha256}, got {current_sha256}"
        )
        
    if evidence.sha512 and current_sha512 != evidence.sha512:
        raise EvidenceIntegrityError(
            f"Evidence SHA-512 integrity mismatch! Expected {evidence.sha512}, got {current_sha512}"
        )
        
    return True
