output "vm_inventory" {
  description = "Machine-readable map of all provisioned Virtual Machines"
  value = {
    opnsense          = { vmid = module.vm_opnsense_200.vm_id, name = module.vm_opnsense_200.name, node = module.vm_opnsense_200.node }
    windows_server_ad = { vmid = module.vm_win_server_201.vm_id, name = module.vm_win_server_201.name, node = module.vm_win_server_201.node }
    rhel_enterprise   = { vmid = module.vm_rhel_202.vm_id, name = module.vm_rhel_202.name, node = module.vm_rhel_202.node }
    openstack              = { vmid = module.vm_openstack_205.vm_id, name = module.vm_openstack_205.name, node = module.vm_openstack_205.node }
    metasploitable2        = { vmid = module.vm_metasploitable2_206.vm_id, name = module.vm_metasploitable2_206.name, node = module.vm_metasploitable2_206.node }
    tpot_honeypot          = { vmid = module.vm_tpot_207.vm_id, name = module.vm_tpot_207.name, node = module.vm_tpot_207.node }
    securityonion          = { vmid = module.vm_securityonion_208.vm_id, name = module.vm_securityonion_208.name, node = module.vm_securityonion_208.node }
    remnux                 = { vmid = module.vm_remnux_209.vm_id, name = module.vm_remnux_209.name, node = module.vm_remnux_209.node }
    windows_server_licenta = { vmid = module.vm_windows_server_licenta_300.vm_id, name = module.vm_windows_server_licenta_300.name, node = module.vm_windows_server_licenta_300.node }
    metasploitable_licenta = { vmid = module.vm_metasploitable_licenta_301.vm_id, name = module.vm_metasploitable_licenta_301.name, node = module.vm_metasploitable_licenta_301.node }
  }
}

output "lxc_x64_summary" {
  description = "Summary of Node 1 x86_64 LXC containers (Core & GPU AI Stack)"
  value = {
    immich         = { vmid = module.lxc_immich.vm_id, ip = module.lxc_immich.ip_address, node = module.lxc_immich.node }
    nextcloud      = { vmid = module.lxc_nextcloud.vm_id, ip = module.lxc_nextcloud.ip_address, node = module.lxc_nextcloud.node }
    homeassistant  = { vmid = module.lxc_homeassistant.vm_id, ip = module.lxc_homeassistant.ip_address, node = module.lxc_homeassistant.node }
    n8n            = { vmid = module.lxc_n8n.vm_id, ip = module.lxc_n8n.ip_address, node = module.lxc_n8n.node }
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

