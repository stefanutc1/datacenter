"""Suricata and Snort network signature parser and validator."""

import re
from typing import Dict, Any, Optional

class SuricataEngine:
    """Parses and validates Suricata/Snort network rule syntax."""

    @staticmethod
    def parse_rule(rule_text: str) -> Optional[Dict[str, Any]]:
        rule_text = rule_text.strip()
        if not rule_text or rule_text.startswith("#"):
            return None
            
        match = re.match(r"^(\w+)\s+(\w+)\s+([^\s]+)\s+([^\s]+)\s+->\s+([^\s]+)\s+([^\s]+)\s*\((.*)\)$", rule_text)
        if not match:
            return None

        action, proto, src_ip, src_port, dst_ip, dst_port, opts_str = match.groups()
        
        # Parse options
        opts = {}
        for opt in opts_str.split(";"):
            opt = opt.strip()
            if ":" in opt:
                k, v = opt.split(":", 1)
                opts[k.strip()] = v.strip().strip('"')
            elif opt:
                opts[opt] = True

        return {
            "action": action,
            "protocol": proto,
            "src_ip": src_ip,
            "src_port": src_port,
            "dst_ip": dst_ip,
            "dst_port": dst_port,
            "msg": opts.get("msg", ""),
            "sid": int(opts.get("sid", 0)) if "sid" in opts else None,
            "rev": int(opts.get("rev", 1)) if "rev" in opts else None,
            "options": opts
        }
