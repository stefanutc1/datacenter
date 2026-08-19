#!/bin/bash
# ==============================================================================
# Proxmox VE WebGUI Subscription Nag Auto-Removal
# ==============================================================================
PVE_JS="/usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js"
if [ -f "$PVE_JS" ]; then
    if grep -q "No valid sub" "$PVE_JS"; then
        sed -Ezi.bak "s/(Ext.Msg.show\(\{\s+title: gettext\('No valid sub)/void\(\{ \/\/\1/g" "$PVE_JS"
        systemctl restart pveproxy.service >/dev/null 2>&1 || true
    fi
fi
