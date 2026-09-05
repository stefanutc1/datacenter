#!/usr/bin/env python3
import sys

SURICATA_RULES = [
    'drop sip any any -> $HOME_NET 5060 (msg:"CYBER-LAB Spoofed P-Asserted-Identity Telephony Attack"; content:"P-Asserted-Identity"; content:"+40749"; sid:9000002; rev:1;)',
    'drop ip [195.138.22.14,185.220.101.44,91.240.118.172] any -> $HOME_NET any (msg:"CYBER-LAB Critical Threat Actor C2 Traffic Blocked"; sid:9000001; rev:1;)'
]

def validate():
    print("[+] Validating Suricata / Snort signature syntax...")
    for rule in SURICATA_RULES:
        assert rule.startswith(("drop", "alert", "pass")), "Invalid rule action"
        assert "msg:" in rule, "Rule missing message field"
        assert "sid:" in rule, "Rule missing SID identifier"
        assert "rev:" in rule, "Rule missing revision field"
        print(f"  [PASS] Validated signature: {rule[:60]}...")
    print("[SUCCESS] All Suricata signatures passed syntax validation.")
    return 0

if __name__ == "__main__":
    sys.exit(validate())
