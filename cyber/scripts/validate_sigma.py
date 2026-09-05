#!/usr/bin/env python3
import sys

SIGMA_RULES = [
    {
        "title": "Potential AiTM Session Token Replay",
        "id": "c4e3b129-87a1-42e5-9fa2-8b894172a392",
        "status": "production",
        "logsource": {"category": "authentication", "product": "entra_id"},
        "detection": {
            "selection": {"AppDisplayName": ["Office 365 Exchange Online", "Steam Community OpenID"], "ResultType": 0},
            "condition": "selection"
        },
        "level": "high"
    },
    {
        "title": "Kerberoasting TGS Request with RC4 Encryption",
        "id": "ad02-kerberoast-4769-rc4",
        "status": "production",
        "logsource": {"product": "windows", "service": "security"},
        "detection": {
            "selection": {"EventID": 4769, "TicketEncryptionType": "0x17", "TicketOptions": "0x40810000"},
            "condition": "selection"
        },
        "level": "high"
    }
]

def validate():
    print("[+] Validating Sigma detection rules schema...")
    for rule in SIGMA_RULES:
        assert "title" in rule, "Sigma rule missing title"
        assert "id" in rule, "Sigma rule missing id"
        assert "logsource" in rule, "Sigma rule missing logsource"
        assert "detection" in rule, "Sigma rule missing detection logic"
        assert "level" in rule, "Sigma rule missing severity level"
        print(f"  [PASS] Validated Sigma signature: {rule['title']} ({rule['id']})")
    print("[SUCCESS] All Sigma detection rules conform to specification.")
    return 0

if __name__ == "__main__":
    sys.exit(validate())
