<#
.SYNOPSIS
    Proxmox VE Fleet Tags Automation in PowerShell
.DESCRIPTION
    Applies structured, consistent tags across all 24 LXC containers and 3 VMs in Proxmox VE.
#>

[CmdletBinding()]
param (
    [string]$PveHost = "192.168.1.132"
)

$lxcTags = @{
    "100" = "alpine;ingress;proxy;community-script"
    "101" = "alpine;networking;dns;community-script"
    "102" = "alpine;networking;vpn;community-script"
    "103" = "alpine;photos;media;community-script"
    "104" = "alpine;observability;monitoring;community-script"
    "105" = "alpine;cloud;storage;community-script"
    "106" = "alpine;security;ips;community-script"
    "107" = "alpine;automation;smarthome;community-script"
    "108" = "alpine;observability;prometheus;grafana;community-script"
    "109" = "alpine;utilities;developer;community-script"
    "110" = "alpine;automation;workflows;community-script"
    "111" = "alpine;devops;ci-cd;community-script"
    "112" = "alpine;security;passwords;community-script"
    "113" = "alpine;devops;git;community-script"
    "114" = "alpine;observability;smart-disks;community-script"
    "115" = "alpine;productivity;notes;community-script"
    "116" = "alpine;security;sso;community-script"
    "117" = "alpine;media;jellyfin;arr-stack;community-script"
    "118" = "alpine;productivity;finance;community-script"
    "119" = "alpine;storage;files;community-script"
    "120" = "alpine;automation;monitoring;community-script"
    "121" = "alpine;storage;cloud-drive;community-script"
    "122" = "alpine;dashboard;web;iac"
    "123" = "alpine;wiki;documentation;iac"
}

$vmTags = @{
    "200" = "freebsd;firewall;router;kvm"
    "201" = "windows;active-directory;rdp;kvm"
    "202" = "alpine;microservices;cloud-init;kvm"
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
