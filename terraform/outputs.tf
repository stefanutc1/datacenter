output "vm_inventory" {
  description = "Machine-readable map of all provisioned Virtual Machines"
  value = {
    opnsense               = { vmid = module.vm_opnsense_200.vm_id, name = module.vm_opnsense_200.name, node = module.vm_opnsense_200.node }
    windows_server_ad      = { vmid = module.vm_win_server_201.vm_id, name = module.vm_win_server_201.name, node = module.vm_win_server_201.node }
    rhel_enterprise        = { vmid = module.vm_rhel_202.vm_id, name = module.vm_rhel_202.name, node = module.vm_rhel_202.node }
    openstack              = { vmid = module.vm_openstack_203.vm_id, name = module.vm_openstack_203.name, node = module.vm_openstack_203.node }
    metasploitable2        = { vmid = module.vm_metasploitable2_204.vm_id, name = module.vm_metasploitable2_204.name, node = module.vm_metasploitable2_204.node }
    tpot_honeypot          = { vmid = module.vm_tpot_205.vm_id, name = module.vm_tpot_205.name, node = module.vm_tpot_205.node }
    securityonion          = { vmid = module.vm_securityonion_206.vm_id, name = module.vm_securityonion_206.name, node = module.vm_securityonion_206.node }
    remnux                 = { vmid = module.vm_remnux_207.vm_id, name = module.vm_remnux_207.name, node = module.vm_remnux_207.node }
    windows_server_licenta = { vmid = module.vm_windows_server_licenta_300.vm_id, name = module.vm_windows_server_licenta_300.name, node = module.vm_windows_server_licenta_300.node }
    metasploitable_licenta = { vmid = module.vm_metasploitable_licenta_301.vm_id, name = module.vm_metasploitable_licenta_301.name, node = module.vm_metasploitable_licenta_301.node }
    kali_licenta           = { vmid = module.vm_kali_licenta_302.vm_id, name = module.vm_kali_licenta_302.name, node = module.vm_kali_licenta_302.node }
  }
}

output "lxc_x64_summary" {
  description = "Summary of Node 1 x86_64 LXC containers (Core & GPU AI Stack)"
  value = {
    immich         = { vmid = module.lxc_immich.vm_id, ip = module.lxc_immich.ip_address, node = module.lxc_immich.node }
    nextcloud      = { vmid = module.lxc_nextcloud.vm_id, ip = module.lxc_nextcloud.ip_address, node = module.lxc_nextcloud.node }
    homeassistant  = { vmid = module.lxc_homeassistant.vm_id, ip = module.lxc_homeassistant.ip_address, node = module.lxc_homeassistant.node }
    n8n            = { vmid = module.lxc_n8n.vm_id, ip = module.lxc_n8n.ip_address, node = module.lxc_n8n.node }
    scrutiny       = { vmid = module.lxc_scrutiny.vm_id, ip = module.lxc_scrutiny.ip_address, node = module.lxc_scrutiny.node }
    media_suite    = { vmid = module.lxc_media_suite.vm_id, ip = module.lxc_media_suite.ip_address, node = module.lxc_media_suite.node }
    ollama         = { vmid = module.lxc_ollama.vm_id, ip = module.lxc_ollama.ip_address, node = module.lxc_ollama.node }
    openwebui      = { vmid = module.lxc_openwebui.vm_id, ip = module.lxc_openwebui.ip_address, node = module.lxc_openwebui.node }
    whisper        = { vmid = module.lxc_whisper.vm_id, ip = module.lxc_whisper.ip_address, node = module.lxc_whisper.node }
    flowise        = { vmid = module.lxc_flowise.vm_id, ip = module.lxc_flowise.ip_address, node = module.lxc_flowise.node }
    paperless_ai   = { vmid = module.lxc_paperless_ai.vm_id, ip = module.lxc_paperless_ai.ip_address, node = module.lxc_paperless_ai.node }
    codeserver     = { vmid = module.lxc_codeserver.vm_id, ip = module.lxc_codeserver.ip_address, node = module.lxc_codeserver.node }
    pbs            = { vmid = module.lxc_pbs.vm_id, ip = module.lxc_pbs.ip_address, node = module.lxc_pbs.node }
    pdm            = { vmid = module.lxc_pdm.vm_id, ip = module.lxc_pdm.ip_address, node = module.lxc_pdm.node }
    woodpecker_k0s = { vmid = module.lxc_woodpecker_k0s.vm_id, ip = module.lxc_woodpecker_k0s.ip_address, node = module.lxc_woodpecker_k0s.node }
  }
}

output "lxc_consolidated_summary" {
  description = "Summary of Node 1 x86_64 Consolidated On-Demand LXC Microservices (CT 116-174, onboot: false)"
  value = {
    actualbudget    = { vmid = module.lxc_actualbudget.vm_id, ip = module.lxc_actualbudget.ip_address, node = module.lxc_actualbudget.node }
    changedetection = { vmid = module.lxc_changedetection.vm_id, ip = module.lxc_changedetection.ip_address, node = module.lxc_changedetection.node }
    vaultwarden     = { vmid = module.lxc_vaultwarden.vm_id, ip = module.lxc_vaultwarden.ip_address, node = module.lxc_vaultwarden.node }
    authelia        = { vmid = module.lxc_authelia.vm_id, ip = module.lxc_authelia.ip_address, node = module.lxc_authelia.node }
    gatus           = { vmid = module.lxc_gatus.vm_id, ip = module.lxc_gatus.ip_address, node = module.lxc_gatus.node }
    linkding        = { vmid = module.lxc_linkding.vm_id, ip = module.lxc_linkding.ip_address, node = module.lxc_linkding.node }
    beszel          = { vmid = module.lxc_beszel.vm_id, ip = module.lxc_beszel.ip_address, node = module.lxc_beszel.node }
    homepage        = { vmid = module.lxc_homepage.vm_id, ip = module.lxc_homepage.ip_address, node = module.lxc_homepage.node }
    memos           = { vmid = module.lxc_memos.vm_id, ip = module.lxc_memos.ip_address, node = module.lxc_memos.node }
    syncthing       = { vmid = module.lxc_syncthing.vm_id, ip = module.lxc_syncthing.ip_address, node = module.lxc_syncthing.node }
    vikunja         = { vmid = module.lxc_vikunja.vm_id, ip = module.lxc_vikunja.ip_address, node = module.lxc_vikunja.node }
    yourspotify     = { vmid = module.lxc_yourspotify.vm_id, ip = module.lxc_yourspotify.ip_address, node = module.lxc_yourspotify.node }
    opengist        = { vmid = module.lxc_opengist.vm_id, ip = module.lxc_opengist.ip_address, node = module.lxc_opengist.node }
    whoogle         = { vmid = module.lxc_whoogle.vm_id, ip = module.lxc_whoogle.ip_address, node = module.lxc_whoogle.node }
    pingvin_share   = { vmid = module.lxc_pingvin_share.vm_id, ip = module.lxc_pingvin_share.ip_address, node = module.lxc_pingvin_share.node }
    excalidraw      = { vmid = module.lxc_excalidraw.vm_id, ip = module.lxc_excalidraw.ip_address, node = module.lxc_excalidraw.node }
    transmission    = { vmid = module.lxc_transmission.vm_id, ip = module.lxc_transmission.ip_address, node = module.lxc_transmission.node }
    stirling_pdf    = { vmid = module.lxc_stirling_pdf.vm_id, ip = module.lxc_stirling_pdf.ip_address, node = module.lxc_stirling_pdf.node }
    tubearchivist   = { vmid = module.lxc_tubearchivist.vm_id, ip = module.lxc_tubearchivist.ip_address, node = module.lxc_tubearchivist.node }
    cyberchef       = { vmid = module.lxc_cyberchef.vm_id, ip = module.lxc_cyberchef.ip_address, node = module.lxc_cyberchef.node }
    romm            = { vmid = module.lxc_romm.vm_id, ip = module.lxc_romm.ip_address, node = module.lxc_romm.node }
    paperless_ngx   = { vmid = module.lxc_paperless_ngx.vm_id, ip = module.lxc_paperless_ngx.ip_address, node = module.lxc_paperless_ngx.node }
    meilisearch     = { vmid = module.lxc_meilisearch.vm_id, ip = module.lxc_meilisearch.ip_address, node = module.lxc_meilisearch.node }
    searxng         = { vmid = module.lxc_searxng.vm_id, ip = module.lxc_searxng.ip_address, node = module.lxc_searxng.node }
    rustdesk        = { vmid = module.lxc_rustdesk.vm_id, ip = module.lxc_rustdesk.ip_address, node = module.lxc_rustdesk.node }
    wg_easy         = { vmid = module.lxc_wg_easy.vm_id, ip = module.lxc_wg_easy.ip_address, node = module.lxc_wg_easy.node }
    dozzle          = { vmid = module.lxc_dozzle.vm_id, ip = module.lxc_dozzle.ip_address, node = module.lxc_dozzle.node }
    hedgedoc        = { vmid = module.lxc_hedgedoc.vm_id, ip = module.lxc_hedgedoc.ip_address, node = module.lxc_hedgedoc.node }
    gotify          = { vmid = module.lxc_gotify.vm_id, ip = module.lxc_gotify.ip_address, node = module.lxc_gotify.node }
    grocy           = { vmid = module.lxc_grocy.vm_id, ip = module.lxc_grocy.ip_address, node = module.lxc_grocy.node }
  }
}

output "licenta_lab_summary" {
  description = "Summary of Bachelor Thesis (Lucrare de Licență) CyberLab Targets (VLAN 30 & vmbr1)"
  value = {
    windows_server_licenta = { vmid = module.vm_windows_server_licenta_300.vm_id, name = module.vm_windows_server_licenta_300.name, node = module.vm_windows_server_licenta_300.node }
    metasploitable_licenta = { vmid = module.vm_metasploitable_licenta_301.vm_id, name = module.vm_metasploitable_licenta_301.name, node = module.vm_metasploitable_licenta_301.node }
    kali_linux_licenta     = { vmid = module.vm_kali_licenta_302.vm_id, name = module.vm_kali_licenta_302.name, node = module.vm_kali_licenta_302.node }
    juice_shop_licenta     = { vmid = module.lxc_juiceshop_licenta_303.vm_id, hostname = module.lxc_juiceshop_licenta_303.hostname, ip = module.lxc_juiceshop_licenta_303.ip_address, node = module.lxc_juiceshop_licenta_303.node }
  }
}


