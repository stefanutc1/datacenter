"""Parser for NTFS Master File Table ($MFT) and Windows Prefetch (.pf) CSV forensic dumps."""

import csv
import os
from typing import List
from cyber.core.exceptions import InvalidInputError, ParserFailureError
from cyber.core.models import Artifact, ConfidenceLevel
from cyber.parsers.base import BaseParser

class MftPrefetchParser(BaseParser):
    parser_name = "mft_prefetch_parser"
    supported_extensions = [".csv", ".txt"]

    def parse_file(self, file_path: str) -> List[Artifact]:
        if not os.path.exists(file_path):
            raise InvalidInputError(f"File not found: {file_path}")
            
        try:
            artifacts = []
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # MFTECmd CSV format check
                    if "EntryNumber" in row or "FileName" in row:
                        fn = row.get("FileName", "")
                        created = row.get("Created0x10", row.get("Created", ""))
                        fn_created = row.get("Created0x30", "")
                        
                        is_timestomped = False
                        if created and fn_created and created < fn_created:
                            is_timestomped = True

                        artifacts.append(Artifact(
                            source=file_path,
                            artifact_type="mft_record",
                            normalized_data={
                                "file_name": fn,
                                "file_path": row.get("ParentPath", "") + "/" + fn,
                                "file_size": row.get("FileSize", 0),
                                "created_si": created,
                                "created_fn": fn_created,
                                "is_timestomped": is_timestomped
                            },
                            confidence=ConfidenceLevel.FACT,
                            metadata={"parser": self.parser_name}
                        ))
                    
                    # PECmd Prefetch CSV format check
                    elif "SourceFilename" in row or "RunCount" in row:
                        artifacts.append(Artifact(
                            source=file_path,
                            artifact_type="prefetch_execution",
                            normalized_data={
                                "executable_name": row.get("ExecutableName", row.get("SourceFilename", "")),
                                "run_count": int(row.get("RunCount", 1) or 1),
                                "last_run": row.get("LastRun", ""),
                                "volume_serial": row.get("VolumeSerialNumber", "")
                            },
                            confidence=ConfidenceLevel.FACT,
                            metadata={"parser": self.parser_name}
                        ))

            return artifacts
        except Exception as e:
            raise ParserFailureError(f"Failed to parse MFT/Prefetch CSV: {e}")
