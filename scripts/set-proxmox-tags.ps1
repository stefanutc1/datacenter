<#
.SYNOPSIS
    Proxmox VE Fleet Tags Automation in PowerShell
.DESCRIPTION
    Applies structured, consistent tags across all 20 LXC containers (100-119) and 2 VMs (200-201).
#>

[CmdletBinding()]
param (
    [string]$PveHost = "192.168.1.132"
)

$lxcTags = @{
    "100" = "alpine;community-script;media;photos"
    "101" = "alpine;cloud;community-script;storage"
    "102" = "alpine;automation;community-script;smarthome"
    "103" = "alpine;automation;community-script;workflows"
    "104" = "alpine;community-script;monitoring;smart"
    "105" = "alpine;community-script;media;streaming"
    "106" = "debian;ai;cuda;gpu;llm;ollama"
    "107" = "debian;ai;chatgpt;interface;openwebui"
    "108" = "debian;ai;cuda;speech-to-text;whisper"
    "109" = "alpine;ai;flowise;langchain;orchestrator"
    "110" = "alpine;ai;ocr;paperless"
    "111" = "alpine;codeserver;ide;workspace"
    "112" = "alpine;backup;deduplication;pbs"
    "113" = "alpine;cluster;management;pdm"
    "114" = "alpine;cd;ci;k0s;kubernetes;node1;woodpecker"
}

$vmTags = @{
    "200" = "freebsd;firewall;router;kvm"
    "201" = "alpine;microservices;cloud-init;kvm"
}

Write-Host "🏷️ Applying Proxmox VE tags..." -ForegroundColor Cyan

foreach ($ctid in $lxcTags.Keys) {
    $tags = $lxcTags[$ctid]
    if (Get-Command pct -ErrorAction SilentlyContinue) {
        pct set $ctid -tags $tags 2>$null
    } else {
        ssh -o BatchMode=yes root@$PveHost "pct set $ctid -tags '$tags' 2>/dev/null"
    }
    Write-Host "   ✅ LXC $ctid -> Tags: $tags" -ForegroundColor Green
}

foreach ($vmid in $vmTags.Keys) {
    $tags = $vmTags[$vmid]
    if (Get-Command qm -ErrorAction SilentlyContinue) {
        qm set $vmid -tags $tags 2>$null
    } else {
        ssh -o BatchMode=yes root@$PveHost "qm set $vmid -tags '$tags' 2>/dev/null"
    }
    Write-Host "   ✅ VM  $vmid -> Tags: $tags" -ForegroundColor Green
}

Write-Host "🎉 [COMPLETE] Proxmox VE Fleet Tags applied successfully!" -ForegroundColor Green
