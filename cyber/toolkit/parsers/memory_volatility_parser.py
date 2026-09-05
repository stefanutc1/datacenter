"""Parser for Volatility 3 RAM analysis output files (malfind, pslist, netscan)."""

import os
import re
from typing import List
from cyber.core.exceptions import InvalidInputError, ParserFailureError
from cyber.core.models import Artifact, ConfidenceLevel
from cyber.parsers.base import BaseParser

class MemoryVolatilityParser(BaseParser):
    parser_name = "memory_volatility_parser"
    supported_extensions = [".txt", ".log", ".vol"]

    def parse_file(self, file_path: str) -> List[Artifact]:
        if not os.path.exists(file_path):
            raise InvalidInputError(f"File not found: {file_path}")
            
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()

            artifacts = []

            # 1. Check for malfind detections (PAGE_EXECUTE_READWRITE)
            if "malfind" in content.lower() or "PAGE_EXECUTE_READWRITE" in content:
                injected_procs = re.findall(r"(\d+)\s+([a-zA-Z0-9_\-\.]+)\s+(0x[0-9a-fA-F]+)\s+PAGE_EXECUTE_READWRITE", content)
                for pid, proc_name, start_addr in injected_procs:
                    artifacts.append(Artifact(
                        source=file_path,
                        artifact_type="volatility_injected_memory",
                        normalized_data={
                            "pid": int(pid),
                            "process_name": proc_name,
                            "start_address": start_addr,
                            "protection": "PAGE_EXECUTE_READWRITE",
                            "verdict": "Injected Shellcode / Hollowed Memory Region"
                        },
                        confidence=ConfidenceLevel.FACT,
                        metadata={"parser": self.parser_name}
                    ))

            # 2. Check for pslist processes
            proc_lines = re.findall(r"(\d+)\s+(\d+)\s+([a-zA-Z0-9_\-\.]+)\s+(0x[0-9a-fA-F]+)", content)
            for pid, ppid, img_name, offset in proc_lines:
                artifacts.append(Artifact(
                    source=file_path,
                    artifact_type="volatility_process",
                    normalized_data={
                        "pid": int(pid),
                        "ppid": int(ppid),
                        "image_filename": img_name,
                        "offset": offset
                    },
                    confidence=ConfidenceLevel.FACT,
                    metadata={"parser": self.parser_name}
                ))

            return artifacts
        except Exception as e:
            raise ParserFailureError(f"Failed to parse Volatility 3 output: {e}")
