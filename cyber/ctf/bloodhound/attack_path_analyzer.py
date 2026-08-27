#!/usr/bin/env python3
"""BloodHound Active Directory attack path query generator."""
from pathlib import Path

def get_query(name: str = "shortest_path_to_da.cypher") -> str:
    query_file = Path(__file__).parent / "queries" / name
    if query_file.exists():
        return query_file.read_text(encoding="utf-8").strip()
    return ""

if __name__ == "__main__":
    q = get_query()
    print("[*] Loaded BloodHound Cypher Query:")
    print(q)
