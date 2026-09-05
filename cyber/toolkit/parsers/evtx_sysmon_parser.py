"""Parser for Windows Event Log (EVTX) and Sysmon JSON exports."""

import json
import os
from typing import List
from cyber.core.exceptions import InvalidInputError, ParserFailureError
from cyber.core.models import Artifact, ConfidenceLevel
from cyber.parsers.base import BaseParser

class EvtxSysmonParser(BaseParser):
    parser_name = "evtx_sysmon_parser"
    supported_extensions = [".json", ".evtx_json", ".log"]

    def parse_file(self, file_path: str) -> List[Artifact]:
        if not os.path.exists(file_path):
            raise InvalidInputError(f"File not found: {file_path}")
            
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()

            try:
                data = json.loads(content)
                events = data if isinstance(data, list) else [data]
            except json.JSONDecodeError:
                # Parse JSONL format
                events = [json.loads(line) for line in content.splitlines() if line.strip()]

            artifacts = []
            for ev in events:
                event_data = ev.get("Event", ev)
                system_data = event_data.get("System", {})
                event_id = str(system_data.get("EventID", ev.get("event_id", "")))
                
                details = event_data.get("EventData", ev.get("details", {}))

                normalized = {
                    "event_id": event_id,
                    "provider": system_data.get("Provider", {}).get("@Name", "Microsoft-Windows-Sysmon"),
                    "timestamp": system_data.get("TimeCreated", {}).get("@SystemTime", ev.get("timestamp", "")),
                    "computer": system_data.get("Computer", ev.get("computer", "")),
                    "process_name": details.get("Image") or details.get("ProcessName"),
                    "command_line": details.get("CommandLine"),
                    "parent_image": details.get("ParentImage"),
                    "target_image": details.get("TargetImage"),
                    "granted_access": details.get("GrantedAccess"),
                    "script_block_text": details.get("ScriptBlockText"),
                    "ticket_options": details.get("TicketOptions"),
                    "ticket_encryption": details.get("TicketEncryptionType")
                }

                artifact = Artifact(
                    source=file_path,
                    artifact_type=f"windows_event_{event_id}" if event_id else "windows_event",
                    normalized_data=normalized,
                    confidence=ConfidenceLevel.FACT,
                    metadata={"parser": self.parser_name}
                )
                artifacts.append(artifact)

            return artifacts
        except Exception as e:
            raise ParserFailureError(f"Failed to parse Sysmon/EVTX events: {e}")
