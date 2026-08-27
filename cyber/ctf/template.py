#!/usr/bin/env python3
import requests
import sys

TARGET = "http://127.0.0.1:8080"

def exploit():
    print([*] Exploit running to ${TARGET}...)
    response = requests.get(f"{TARGET}/vulnerable_endpoint")
    print([+] Response done:, response.text)

if __name__ == "__main__":
    exploit()
