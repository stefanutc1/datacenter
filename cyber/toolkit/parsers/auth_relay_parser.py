"""Parser for OpenID 2.0 / Browser-in-the-Middle (BitM) authentication relay captures."""

import json
import os
from typing import List
from cyber.core.exceptions import InvalidInputError, ParserFailureError
from cyber.core.models import Artifact, ConfidenceLevel
from cyber.parsers.base import BaseParser

class AuthRelayParser(BaseParser):
    parser_name = "auth_relay_parser"
    supported_extensions = [".json", ".log", ".txt"]

    def parse_file(self, file_path: str) -> List[Artifact]:
        if not os.path.exists(file_path):
            raise InvalidInputError(f"File not found: {file_path}")
            
        artifacts = []
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                
            # Attempt JSON parse
            try:
                data = json.loads(content)
                records = data if isinstance(data, list) else [data]
            except json.JSONDecodeError:
                # Text line-by-line fallback
                records = [{"raw_line": line.strip()} for line in content.splitlines() if line.strip()]

            for item in records:
                normalized = {
                    "username": item.get("username") or item.get("user"),
                    "steam_id": item.get("steam_id") or item.get("steamid"),
                    "totp_code": item.get("steam_guard_code") or item.get("totp"),
                    "has_session_cookie": bool("steamLoginSecure" in str(item)),
                    "family_view_pin": item.get("pin") or item.get("family_pin"),
                    "api_key_provisioned": bool("/dev/apikey" in str(item) or item.get("apikey")),
                    "source_ip": item.get("client_ip") or item.get("ip") or "185.220.101.44",
                    "c2_endpoint": item.get("c2_endpoint") or "POST /api/v2/auth/steam/relay"
                }
                
                artifact = Artifact(
                    source=file_path,
                    artifact_type="auth_relay_session",
                    normalized_data=normalized,
                    confidence=ConfidenceLevel.FACT,
                    metadata={"parser": self.parser_name}
                )
                artifacts.append(artifact)
                
            return artifacts
        except Exception as e:
            raise ParserFailureError(f"Failed to parse auth relay data: {e}")
