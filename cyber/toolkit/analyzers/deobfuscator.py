"""Automated deobfuscation engine for PowerShell and JavaScript payloads."""

import base64
import re
from typing import Dict, Any, List

class PayloadDeobfuscator:
    """Detects and deobfuscates layered encoding in script blocks and network streams."""

    @staticmethod
    def deobfuscate(text: str) -> Dict[str, Any]:
        results = {
            "original_length": len(text),
            "layers_removed": 0,
            "transformations": [],
            "extracted_urls": [],
            "extracted_ips": [],
            "extracted_commands": [],
            "clean_output": text
        }

        current = text.strip()

        # 1. PowerShell Base64 EncodedCommand
        ps_enc_match = re.search(r"(?:-encodedcommand|-enc|-e)\s+([A-Za-z0-9+/=]{16,})", current, re.IGNORECASE)
        if ps_enc_match:
            try:
                raw_b64 = ps_enc_match.group(1)
                decoded_bytes = base64.b64decode(raw_b64)
                decoded_text = decoded_bytes.decode("utf-16le", errors="ignore")
                results["layers_removed"] += 1
                results["transformations"].append("PowerShell UTF-16LE Base64 Deobfuscation")
                current = decoded_text
            except Exception:
                pass

        # 2. Generic Base64 detection
        b64_matches = re.findall(r"(?:FromBase64String\(|atob\(|'|\")([A-Za-z0-9+/=]{24,})(?:'|\")", current)
        for b64_str in b64_matches:
            try:
                decoded = base64.b64decode(b64_str).decode("utf-8", errors="ignore")
                if len(decoded) > 4 and any(c.isalnum() for c in decoded):
                    results["layers_removed"] += 1
                    results["transformations"].append(f"Base64 String Decoded: {b64_str[:12]}...")
                    current = current.replace(b64_str, decoded)
            except Exception:
                pass

        # 3. JavaScript String.fromCharCode
        char_code_match = re.search(r"String\.fromCharCode\s*\(\s*([\d\s,]+)\s*\)", current, re.IGNORECASE)
        if char_code_match:
            try:
                numbers = [int(n.strip()) for n in char_code_match.group(1).split(",") if n.strip().isdigit()]
                decoded_str = "".join(chr(n) for n in numbers)
                results["layers_removed"] += 1
                results["transformations"].append("JavaScript CharCode Sequence Decoded")
                current = current.replace(char_code_match.group(0), f'"{decoded_str}"')
            except Exception:
                pass

        # 4. Hex Encoded Strings (\x41\x42 or 0x41)
        hex_seq_match = re.search(r"(?:\\x[0-9a-fA-F]{2}){4,}", current)
        if hex_seq_match:
            try:
                hex_raw = hex_seq_match.group(0)
                decoded_hex = bytes.fromhex(hex_raw.replace("\\x", "")).decode("utf-8", errors="ignore")
                results["layers_removed"] += 1
                results["transformations"].append("Hex-Escape String Decoded")
                current = current.replace(hex_raw, decoded_hex)
            except Exception:
                pass

        # Extract indicators from clean output
        results["extracted_urls"] = list(set(re.findall(r"https?://[^\s\"'>)]+", current)))
        results["extracted_ips"] = list(set(re.findall(r"\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b", current)))
        results["extracted_commands"] = list(set(re.findall(r"(?:Invoke-Expression|IEX|DownloadString|vssadmin|certutil|cmd\.exe|powershell\.exe|sh|curl|wget)\b[^\r\n;]+", current, re.IGNORECASE)))
        results["clean_output"] = current

        return results
