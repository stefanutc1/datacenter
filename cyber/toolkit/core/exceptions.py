"""Core exception hierarchy for Cyber Security Engineering & DFIR Toolkit."""

class CyberToolkitError(Exception):
    """Base exception for all cyber toolkit operations."""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message)
        self.message = message
        self.details = details or {}

class InvalidInputError(CyberToolkitError):
    """Raised when an input file, path, or argument fails validation."""
    pass

class UnsupportedFormatError(CyberToolkitError):
    """Raised when data format is unrecognized or unsupported by the selected parser."""
    pass

class CorruptedDataError(CyberToolkitError):
    """Raised when input artifact data is truncated or corrupt."""
    pass

class ParserFailureError(CyberToolkitError):
    """Raised when a parser encounters unrecoverable structural syntax errors."""
    pass

class AnalysisFailureError(CyberToolkitError):
    """Raised when an analytical correlation engine or detection rule evaluation fails."""
    pass

class EvidenceIntegrityError(CyberToolkitError):
    """Raised when cryptographic checksum verification fails against recorded chain of custody."""
    pass

class ProvenanceError(CyberToolkitError):
    """Raised when threat intelligence or forensic artifact provenance is missing or invalid."""
    pass
