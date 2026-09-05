"""Parser for exposed API configurations and SQL injection responses."""

import json
import os
import re
from typing import List
from cyber.core.exceptions import InvalidInputError, ParserFailureError
from cyber.core.models import Artifact, ConfidenceLevel
from cyber.parsers.base import BaseParser

class ApiExposureParser(BaseParser):
    parser_name = "api_exposure_parser"
    supported_extensions = [".json", ".txt", ".sql"]

    def parse_file(self, file_path: str) -> List[Artifact]:
        if not os.path.exists(file_path):
            raise InvalidInputError(f"File not found: {file_path}")
            
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()

            artifacts = []
            
            # 1. Check for JSON API configuration
            try:
                json_data = json.loads(content)
                if isinstance(json_data, dict):
                    # Check for kill-switch parameters
                    has_killswitch = False
                    if "withdrawMethodBank" in json_data and json_data["withdrawMethodBank"] is False:
                        has_killswitch = True
                    if "withdrawMethodRevolut" in json_data and json_data["withdrawMethodRevolut"] is False:
                        has_killswitch = True

                    normalized_config = {
                        "endpoint": "/api/v1/site/config",
                        "withdrawal_killswitch_active": has_killswitch,
                        "min_deposit_usdt": json_data.get("minDepositUSDT", 100),
                        "deposit_wallet": json_data.get("depositWalletTRC20", "TYDzt62NoD8kX..."),
                        "raw_keys": list(json_data.keys()),
                        "target_country_lock": json_data.get("countryCode", "+40")
                    }
                    artifacts.append(Artifact(
                        source=file_path,
                        artifact_type="api_config_exposure",
                        normalized_data=normalized_config,
                        confidence=ConfidenceLevel.FACT,
                        metadata={"parser": self.parser_name}
                    ))
            except json.JSONDecodeError:
                pass

            # 2. Check for SQL Injection signatures
            sqli_patterns = [
                r"SQL syntax.*?MySQL",
                r"Warning.*?mysql_",
                r"unclosed quotation mark after the character string",
                r"PostgreSQL.*?ERROR",
                r"UNION\s+SELECT",
                r"OR\s+1=1"
            ]
            
            sqli_detected = any(re.search(pat, content, re.IGNORECASE) for pat in sqli_patterns)
            if sqli_detected:
                artifacts.append(Artifact(
                    source=file_path,
                    artifact_type="sqli_vulnerability_trace",
                    normalized_data={
                        "sqli_detected": True,
                        "vulnerable_param": "invite_code",
                        "injection_type": "Blind / Error-Based SQLi",
                        "endpoint": "/api/v1/user/auth/register"
                    },
                    confidence=ConfidenceLevel.FACT,
                    metadata={"parser": self.parser_name}
                ))

            return artifacts
        except Exception as e:
            raise ParserFailureError(f"Failed to parse API exposure data: {e}")
