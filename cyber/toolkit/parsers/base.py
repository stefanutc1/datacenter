"""Base abstract class for forensic and telemetry artifact parsers."""

from abc import ABC, abstractmethod
import os
from typing import List, Generator
from cyber.core.exceptions import InvalidInputError, ParserFailureError
from cyber.core.models import Artifact

class BaseParser(ABC):
    """Abstract parser interface for extracting normalized artifacts from evidence."""
    
    parser_name: str = "base_parser"
    supported_extensions: List[str] = []

    def can_parse(self, file_path: str) -> bool:
        """Check if file matches supported format or extension."""
        ext = os.path.splitext(file_path)[1].lower()
        return ext in self.supported_extensions or not self.supported_extensions

    @abstractmethod
    def parse_file(self, file_path: str) -> List[Artifact]:
        """Parse given file path and return a list of normalized Artifact objects."""
        pass

    def parse_stream(self, stream) -> Generator[Artifact, None, None]:
        """Stream parsed artifacts for large datasets without high memory consumption."""
        raise NotImplementedError("Streaming parse not supported by this parser.")
