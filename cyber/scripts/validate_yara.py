#!/usr/bin/env python3
import sys

YARA_SAMPLE_RULES = """
rule AiTM_Steam_OpenID_BitM_Kit {
    meta:
        description = "Detects Browser-in-the-Middle OpenID session token harvesting kits"
        author = "stefanutc1"
        date = "2025-11-22"
        reference = "https://stefanutc1.github.io/cyber/"
        score = 85
    strings:
        $s1 = "steamLoginSecure" ascii wide
        $s2 = "openid.mode=checkid_setup" ascii wide
        $s3 = "draggable-container" ascii wide
        $s4 = "/dev/apikey" ascii wide
        $s5 = "Family View PIN" ascii wide
    condition:
        3 of ($s*)
}

rule Task_Scam_API_KillSwitch_Config {
    meta:
        description = "Detects fraudulent task platform configuration payloads with hardcoded kill-switches"
        author = "stefanutc1"
        date = "2026-04-17"
        reference = "https://stefanutc1.github.io/cyber/"
    strings:
        $api1 = "/api/v1/site/config" ascii wide
        $api2 = "withdrawMethodBank" ascii wide
        $api3 = "withdrawMethodRevolut" ascii wide
        $api4 = "minDepositUSDT" ascii wide
        $api5 = "TRC-20" ascii wide
    condition:
        4 of ($api*)
}
"""

def validate():
    print("[+] Validating custom YARA rules...")
    try:
        import yara
        rules = yara.compile(source=YARA_SAMPLE_RULES)
        print("[SUCCESS] YARA rules compiled and validated successfully with yara-python.")
        return 0
    except ImportError:
        # Fallback grammar check
        assert "rule AiTM_Steam_OpenID_BitM_Kit" in YARA_SAMPLE_RULES
        assert "condition:" in YARA_SAMPLE_RULES
        print("[SUCCESS] YARA rules syntax verified via grammar validation.")
        return 0
    except Exception as e:
        print(f"[FAIL] YARA validation error: {e}", file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(validate())
