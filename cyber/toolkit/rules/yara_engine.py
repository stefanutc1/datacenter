"""YARA rule evaluation and signature generator."""

import re
from typing import List, Dict, Any
from cyber.core.exceptions import AnalysisFailureError

class YaraEngine:
    """Manages compilation, testing, and generation of YARA detection rules."""

    @staticmethod
    def generate_rule(rule_name: str, description: str, strings: List[str], condition: str = "any of ($s*)") -> str:
        """Generate formatted YARA rule syntax."""
        sanitized_name = re.sub(r"[^a-zA-Z0-9_]", "_", rule_name)
        lines = [
            f"rule {sanitized_name} {{",
            "    meta:",
            f'        description = "{description}"',
            '        author = "stefanutc1"',
            '        reference = "https://stefanutc1.github.io/cyber/"',
            "    strings:"
        ]
        for idx, s in enumerate(strings):
            escaped = s.replace('"', '\\"')
            lines.append(f'        $s{idx+1} = "{escaped}" ascii wide')
        lines.append("    condition:")
        lines.append(f"        {condition}")
        lines.append("}")
        return "\n".join(lines)

    @staticmethod
    def match_strings(rule_syntax: str, content: str) -> bool:
        """Lightweight regex-based fallback matching for environments without C-compiled yara."""
        str_patterns = re.findall(r'\$s\d+\s*=\s*"([^"]+)"', rule_syntax)
        if not str_patterns:
            return False
        return any(pat.lower() in content.lower() for pat in str_patterns)
