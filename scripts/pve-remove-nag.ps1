<#
.SYNOPSIS
    Proxmox VE WebGUI Subscription Nag Remover in PowerShell
.DESCRIPTION
    Patches proxmoxlib.js and restarts pveproxy to remove the subscription warning.
#>

[CmdletBinding()]
param (
    [string]$PveHost = "192.168.1.132"
)

$patchCmd = @'
PVE_JS="/usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js"
if [ -f "$PVE_JS" ]; then
    if grep -q "No valid sub" "$PVE_JS"; then
        sed -Ezi.bak "s/(Ext.Msg.show\(\{\s+title: gettext\('No valid sub)/void\(\{ \/\/\1/g" "$PVE_JS"
        systemctl restart pveproxy.service >/dev/null 2>&1 || true
        echo "✅ Nag patched and pveproxy restarted."
    else
        echo "ℹ️ Nag already patched."
    fi
fi
'@

if (Get-Command pvesh -ErrorAction SilentlyContinue) {
    bash -c "$patchCmd"
} else {
    ssh -o BatchMode=yes root@$PveHost "$patchCmd"
}
