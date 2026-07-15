<#
.SYNOPSIS
    Bootstrap script for Homelab environment on Windows / PowerShell.
.DESCRIPTION
    Initializes local directories, checks configurations, and prepares the workspace.
#>

$ErrorActionPreference = "Stop"

function Write-Success { param($msg) Write-Host "[✓] $msg" -ForegroundColor Green }
function Write-Warning { param($msg) Write-Host "[!] $msg" -ForegroundColor Yellow }
function Write-ErrorMsg { param($msg) Write-Host "[X] $msg" -ForegroundColor Red }

Write-Warning "[*] Initializing Homelab workspace bootstrap..."

$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ParentDir = Split-Path -Parent $RepoRoot

$RequiredDirs = @("ansible", "services", "terraform", "scripts")
foreach ($dir in $RequiredDirs) {
    $target = Join-Path $ParentDir $dir
    if (Test-Path $target) {
        Write-Success "Found directory: $dir"
    } else {
        Write-Warning "[!] Missing directory structure: $dir"
    }
}

Write-Success "[✔] Bootstrap validation completed successfully."
```

---


```powershell
<#
.SYNOPSIS
    Docker management script for Frigate NVR.
.DESCRIPTION
    Automates container startup and checks requirements for Frigate.
#>

$ErrorActionPreference = "Stop"

Write-Host "[*] Managing Frigate NVR container lifecycle..." -ForegroundColor Cyan

if (-not (Get-Service docker -ErrorAction SilentlyContinue)) {
    Write-Host "[X] Docker service is not running or not installed." -ForegroundColor Red
    exit 1
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

Write-Host "[*] Starting Frigate via Docker Compose..." -ForegroundColor Yellow
docker compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Frigate container started successfully." -ForegroundColor Green
} else {
    Write-Host "[X] Failed to start Frigate container." -ForegroundColor Red
    exit 1
}
```[cite: 1]
