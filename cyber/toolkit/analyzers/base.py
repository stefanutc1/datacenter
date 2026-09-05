"""Base analyzer interface for evaluating artifacts and deriving findings and IoCs."""

from abc import ABC, abstractmethod
from typing import List, Tuple
from cyber.core.models import Artifact, Finding, Indicator

class BaseAnalyzer(ABC):
    """Abstract interface for threat detection and forensic correlation analyzers."""
    
    analyzer_name: str = "base_analyzer"

    @abstractmethod
    def analyze(self, artifacts: List[Artifact]) -> Tuple[List[Finding], List[Indicator]]:
        """Evaluate input artifacts and produce findings and extracted indicators."""
        pass
