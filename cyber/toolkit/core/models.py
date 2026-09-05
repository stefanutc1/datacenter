"""Common Data Models for Cyber Security Engineering & DFIR."""

from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
from typing import Dict, List, Any, Optional
import uuid

class ConfidenceLevel(str, Enum):
    FACT = "FACT"
    INFERRED = "INFERRED"
    UNVERIFIED = "UNVERIFIED"

class Severity(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFORMATIONAL = "INFORMATIONAL"

class TLPClassification(str, Enum):
    CLEAR = "TLP:CLEAR"
    WHITE = "TLP:WHITE"
    GREEN = "TLP:GREEN"
    AMBER = "TLP:AMBER"
    RED = "TLP:RED"

class IndicatorType(str, Enum):
    IPV4 = "ipv4-addr"
    IPV6 = "ipv6-addr"
    DOMAIN = "domain-name"
    URL = "url"
    SHA256 = "file:hashes.SHA-256"
    MD5 = "file:hashes.MD5"
    CRYPTO_WALLET = "crypto-wallet"
    USER_AGENT = "user-agent"
    SIP_USER = "sip-identity"
    EMAIL = "email-addr"

@dataclass
class Evidence:
    """Represents raw physical or digital forensic evidence under ISO/IEC 27037 chain of custody."""
    source_path: str
    sha256: str
    sha512: Optional[str] = None
    file_size_bytes: int = 0
    acquisition_time: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    acquired_by: str = "stefanutc1"
    description: str = ""
    tlp: TLPClassification = TLPClassification.CLEAR
    provenance: str = "Local Forensic Acquisition"

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

@dataclass
class Artifact:
    """Represents a normalized forensic or network artifact extracted from evidence."""
    artifact_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    source: str = ""
    artifact_type: str = ""
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    raw_reference: str = ""
    normalized_data: Dict[str, Any] = field(default_factory=dict)
    confidence: ConfidenceLevel = ConfidenceLevel.FACT
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

@dataclass
class Indicator:
    """Represents an Indicator of Compromise (IoC) with provenance and confidence."""
    type: IndicatorType
    value: str
    provenance: str
    description: str = ""
    first_seen: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    confidence: ConfidenceLevel = ConfidenceLevel.FACT
    mitre_techniques: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        data["type"] = self.type.value
        data["confidence"] = self.confidence.value
        return data

@dataclass
class TimelineEvent:
    """Standardized event representation for chronological forensic super-timelines."""
    timestamp: str
    source: str
    event_type: str
    description: str
    host: Optional[str] = None
    user: Optional[str] = None
    severity: Severity = Severity.INFORMATIONAL
    confidence: ConfidenceLevel = ConfidenceLevel.FACT
    artifact_id: Optional[str] = None
    details: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        data["severity"] = self.severity.value
        data["confidence"] = self.confidence.value
        return data

@dataclass
class Finding:
    """Technical forensic or threat hunting finding."""
    finding_id: str = field(default_factory=lambda: f"FND-{uuid.uuid4().hex[:8].upper()}")
    title: str = ""
    category: str = ""
    severity: Severity = Severity.HIGH
    description: str = ""
    mitre_techniques: List[str] = field(default_factory=list)
    evidence_references: List[str] = field(default_factory=list)
    remediation: str = ""

    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        data["severity"] = self.severity.value
        return data

@dataclass
class GraphNode:
    """Entity node in an investigation graph."""
    id: str
    label: str
    node_type: str
    properties: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

@dataclass
class GraphEdge:
    """Directed relationship edge in an investigation graph."""
    source_id: str
    target_id: str
    relationship: str
    weight: float = 1.0
    properties: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

@dataclass
class InvestigationReport:
    """Master structured technical investigation report."""
    report_id: str = field(default_factory=lambda: f"REP-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}")
    title: str = ""
    author: str = "stefanutc1"
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    tlp: TLPClassification = TLPClassification.CLEAR
    executive_summary: str = ""
    findings: List[Finding] = field(default_factory=list)
    indicators: List[Indicator] = field(default_factory=list)
    timeline: List[TimelineEvent] = field(default_factory=list)
    methodology: str = "ISO/IEC 27037 Forensic Acquisition & Multi-Stage Correlation"
    limitations: str = "Analysis bounded to collected PCAP streams and digital memory captures."

    def to_dict(self) -> Dict[str, Any]:
        return {
            "report_id": self.report_id,
            "title": self.title,
            "author": self.author,
            "created_at": self.created_at,
            "tlp": self.tlp.value,
            "executive_summary": self.executive_summary,
            "findings": [f.to_dict() for f in self.findings],
            "indicators": [i.to_dict() for i in self.indicators],
            "timeline": [t.to_dict() for t in self.timeline],
            "methodology": self.methodology,
            "limitations": self.limitations
        }
