#!/usr/bin/env python3
import os
import sys

def validate():
    print("[+] Validating Traffic Light Protocol (TLP) tags across reports...")
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    docs = [
        "README.md",
        "openid-mitm-phishing-forensics/case_study.md",
        "revolut-vishing-forensics/case_study.md",
        "task-scam-infrastructure-analysis/case_study.md",
        "tiktok-mrr-scam-infrastructure/case_study.md"
    ]
    
    for doc in docs:
        full_path = os.path.join(repo_root, doc)
        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()
            assert "TLP:CLEAR" in content or "TLP:WHITE" in content, f"Missing TLP classification in {doc}"
            print(f"  [TLP:CLEAR] Verified in {doc}")
            
    print("[SUCCESS] All published case studies and documentation adhere to TLP classification.")
    return 0

if __name__ == "__main__":
    sys.exit(validate())
