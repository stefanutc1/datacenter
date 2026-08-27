#!/bin/bash

set -e

echo "[*] Initializing Cyberlab control environment..."

if ! command -v brew &> /dev/null; then
    echo "[!] Homebrew not found. Please install Homebrew first."
    exit 1
fi

echo "[*] Installing dependencies (Ansible, ansible-lint, yamllint)..."
brew install ansible ansible-lint yamllint

echo "[*] Installing required Ansible collections..."
ansible-galaxy collection install community.general

echo "[*] Bootstrap complete! You are ready to manage your UTM lab nodes."
