<#
.SYNOPSIS
    Cyberlab control environment initialization script for Windows (Chocolatey & Hyper-V).
.DESCRIPTION
    Checks for Chocolatey, installs Ansible, ansible-lint, and yamllint, 
    downloads required Ansible collections, and prepares the environment for Hyper-V lab management.
#>

$ErrorActionPreference = "Stop"

Write-Host "[*] Initializing Cyberlab control environment (Windows / Hyper-V)..." -ForegroundColor Cyan

if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Chocolatey not found. Please install Chocolatey first (run PowerShell as Administrator)." -ForegroundColor Yellow
    exit 1
}

Write-Host "[*] Installing dependencies (Ansible, ansible-lint, yamllint) via Chocolatey..." -ForegroundColor Cyan
choco install ansible yamllint -y

Write-Host "[*] Installing required Ansible collections..." -ForegroundColor Cyan
ansible-galaxy collection install community.general
ansible-galaxy collection install microsoft.hyperv 

Write-Host "[*] Bootstrap complete! You are ready to manage your Hyper-V lab nodes on Windows." -ForegroundColor Green
