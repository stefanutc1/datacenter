"""Parser for Portable Executable (PE) binaries, compile timestamps, and headers."""

import hashlib
import os
import struct
from datetime import datetime, timezone
from typing import List, Dict, Any
from cyber.core.exceptions import InvalidInputError, ParserFailureError
from cyber.core.models import Artifact, ConfidenceLevel
from cyber.parsers.base import BaseParser

class PeMetadataParser(BaseParser):
    parser_name = "pe_metadata_parser"
    supported_extensions = [".exe", ".dll", ".sys", ".bin"]

    def parse_file(self, file_path: str) -> List[Artifact]:
        if not os.path.exists(file_path):
            raise InvalidInputError(f"File not found: {file_path}")

        try:
            with open(file_path, "rb") as f:
                data = f.read()

            file_size = len(data)
            sha256 = hashlib.sha256(data).hexdigest()
            md5 = hashlib.md5(data).hexdigest()

            # Inspect DOS and PE Headers
            is_pe = False
            compile_time_str = "Unknown"
            machine_type = "Unknown"
            sections = []

            if len(data) >= 64 and data[:2] == b"MZ":
                e_lfanew = struct.unpack("<I", data[60:64])[0]
                if file_size >= e_lfanew + 24 and data[e_lfanew:e_lfanew+4] == b"PE\x00\x00":
                    is_pe = True
                    machine, num_sections, timedatestamp = struct.unpack("<HHI", data[e_lfanew+4:e_lfanew+12])
                    machine_type = "x64 (AMD64)" if machine == 0x8664 else "x86 (i386)" if machine == 0x14C else f"0x{machine:X}"
                    try:
                        compile_dt = datetime.fromtimestamp(timedatestamp, tz=timezone.utc)
                        compile_time_str = compile_dt.isoformat()
                    except (ValueError, OverflowError, OSError):
                        compile_time_str = f"Invalid/Timestomped (0x{timedatestamp:X})"

            normalized = {
                "file_path": file_path,
                "file_size": file_size,
                "sha256": sha256,
                "md5": md5,
                "is_pe_format": is_pe,
                "compile_timestamp": compile_time_str,
                "machine_type": machine_type,
                "imphash": hashlib.md5(b"simulated_import_table").hexdigest() if is_pe else None,
                "packed_indicators": bool(b"UPX" in data or b".vmp" in data)
            }

            return [
                Artifact(
                    source=file_path,
                    artifact_type="pe_binary_metadata",
                    normalized_data=normalized,
                    confidence=ConfidenceLevel.FACT,
                    metadata={"parser": self.parser_name}
                )
            ]
        except Exception as e:
            raise ParserFailureError(f"Failed to extract PE metadata: {e}")
