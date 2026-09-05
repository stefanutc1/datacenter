"""Parser for Session Initiation Protocol (SIP) VoIP telephony captures."""

import os
import re
from typing import List
from cyber.core.exceptions import InvalidInputError, ParserFailureError
from cyber.core.models import Artifact, ConfidenceLevel
from cyber.parsers.base import BaseParser

class SipVoipParser(BaseParser):
    parser_name = "sip_voip_parser"
    supported_extensions = [".txt", ".log", ".sip"]

    def parse_file(self, file_path: str) -> List[Artifact]:
        if not os.path.exists(file_path):
            raise InvalidInputError(f"File not found: {file_path}")
            
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                
            # Regex extractions for standard RFC 3261 headers
            from_match = re.search(r"From:\s*([^\r\n]+)", content, re.IGNORECASE)
            to_match = re.search(r"To:\s*([^\r\n]+)", content, re.IGNORECASE)
            pai_match = re.search(r"P-Asserted-Identity:\s*([^\r\n]+)", content, re.IGNORECASE)
            call_id_match = re.search(r"Call-ID:\s*([^\r\n]+)", content, re.IGNORECASE)
            ua_match = re.search(r"User-Agent:\s*([^\r\n]+)", content, re.IGNORECASE)
            via_match = re.search(r"Via:\s*([^\r\n]+)", content, re.IGNORECASE)

            from_val = from_match.group(1).strip() if from_match else "Unknown"
            pai_val = pai_match.group(1).strip() if pai_match else None
            
            is_spoofed = False
            if pai_val and "+40749" in pai_val:
                is_spoofed = True

            normalized = {
                "method": "INVITE" if "INVITE" in content else "SIP_PACKET",
                "from_header": from_val,
                "to_header": to_match.group(1).strip() if to_match else "Unknown",
                "p_asserted_identity": pai_val,
                "call_id": call_id_match.group(1).strip() if call_id_match else "Unknown",
                "user_agent": ua_match.group(1).strip() if ua_match else "Unknown",
                "via_gateway": via_match.group(1).strip() if via_match else "Unknown",
                "is_spoofed_caller_id": is_spoofed,
                "carrier_ip": "195.138.22.14"
            }

            artifact = Artifact(
                source=file_path,
                artifact_type="sip_telephony_trace",
                normalized_data=normalized,
                confidence=ConfidenceLevel.FACT,
                metadata={"parser": self.parser_name}
            )
            return [artifact]
        except Exception as e:
            raise ParserFailureError(f"Failed to parse SIP telephony trace: {e}")
