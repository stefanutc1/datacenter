output "vm_inventory" {
  description = "Machine-readable map of all provisioned Virtual Machines"
  value = {
    opnsense          = { vmid = module.vm_opnsense_200.vm_id, name = module.vm_opnsense_200.name, node = module.vm_opnsense_200.node }
    windows_server_ad = { vmid = module.vm_win_server_201.vm_id, name = module.vm_win_server_201.name, node = module.vm_win_server_201.node }
    rhel_enterprise   = { vmid = module.vm_rhel_202.vm_id, name = module.vm_rhel_202.name, node = module.vm_rhel_202.node }
    freebsd_storage   = { vmid = module.vm_freebsd_203.vm_id, name = module.vm_freebsd_203.name, node = module.vm_freebsd_203.node }
    openbsd_bastion   = { vmid = module.vm_openbsd_204.vm_id, name = module.vm_openbsd_204.name, node = module.vm_openbsd_204.node }
    talos_k8s         = { vmid = module.vm_talos_205.vm_id, name = module.vm_talos_205.name, node = module.vm_talos_205.node }
    macos_monterey    = { vmid = module.vm_macos_monterey_206.vm_id, name = module.vm_macos_monterey_206.name, node = module.vm_macos_monterey_206.node }
    openindiana       = { vmid = module.vm_openindiana_207.vm_id, name = module.vm_openindiana_207.name, node = module.vm_openindiana_207.node }
    netbsd            = { vmid = module.vm_netbsd_208.vm_id, name = module.vm_netbsd_208.name, node = module.vm_netbsd_208.node }
    nixos             = { vmid = module.vm_nixos_209.vm_id, name = module.vm_nixos_209.name, node = module.vm_nixos_209.node }
    dragonflybsd      = { vmid = module.vm_dragonflybsd_210.vm_id, name = module.vm_dragonflybsd_210.name, node = module.vm_dragonflybsd_210.node }
  }
}

output "lxc_x64_summary" {
  description = "Summary of Node 1 x86_64 LXC containers (Core & GPU AI Stack)"
  value = {
    nginx         = { vmid = module.lxc_nginx.vm_id, ip = module.lxc_nginx.ip_address, node = module.lxc_nginx.node }
    pihole        = { vmid = module.lxc_pihole.vm_id, ip = module.lxc_pihole.ip_address, node = module.lxc_pihole.node }
    tailscale     = { vmid = module.lxc_tailscale.vm_id, ip = module.lxc_tailscale.ip_address, node = module.lxc_tailscale.node }
    immich        = { vmid = module.lxc_immich.vm_id, ip = module.lxc_immich.ip_address, node = module.lxc_immich.node }
    nextcloud     = { vmid = module.lxc_nextcloud.vm_id, ip = module.lxc_nextcloud.ip_address, node = module.lxc_nextcloud.node }
    crowdsec      = { vmid = module.lxc_crowdsec.vm_id, ip = module.lxc_crowdsec.ip_address, node = module.lxc_crowdsec.node }
    homeassistant = { vmid = module.lxc_homeassistant.vm_id, ip = module.lxc_homeassistant.ip_address, node = module.lxc_homeassistant.node }
    n8n           = { vmid = module.lxc_n8n.vm_id, ip = module.lxc_n8n.ip_address, node = module.lxc_n8n.node }
    ollama        = { vmid = module.lxc_ollama.vm_id, ip = module.lxc_ollama.ip_address, node = module.lxc_ollama.node }
    openwebui     = { vmid = module.lxc_openwebui.vm_id, ip = module.lxc_openwebui.ip_address, node = module.lxc_openwebui.node }
    whisper       = { vmid = module.lxc_whisper.vm_id, ip = module.lxc_whisper.ip_address, node = module.lxc_whisper.node }
    flowise       = { vmid = module.lxc_flowise.vm_id, ip = module.lxc_flowise.ip_address, node = module.lxc_flowise.node }
    paperless_ai  = { vmid = module.lxc_paperless_ai.vm_id, ip = module.lxc_paperless_ai.ip_address, node = module.lxc_paperless_ai.node }
    codeserver    = { vmid = module.lxc_codeserver.vm_id, ip = module.lxc_codeserver.ip_address, node = module.lxc_codeserver.node }
    pbs           = { vmid = module.lxc_pbs.vm_id, ip = module.lxc_pbs.ip_address, node = module.lxc_pbs.node }
    pdm           = { vmid = module.lxc_pdm.vm_id, ip = module.lxc_pdm.ip_address, node = module.lxc_pdm.node }
  }
}

output "lxc_arm64_summary" {
  description = "Summary of Node 3 ARM64 LXC containers"
  value = {
    monitoring    = { vmid = module.lxc_arm_monitoring.vm_id, ip = module.lxc_arm_monitoring.ip_address, node = module.lxc_arm_monitoring.node }
    gitea         = { vmid = module.lxc_arm_gitea.vm_id, ip = module.lxc_arm_gitea.ip_address, node = module.lxc_arm_gitea.node }
    woodpecker    = { vmid = module.lxc_arm_woodpecker_ci.vm_id, ip = module.lxc_arm_woodpecker_ci.ip_address, node = module.lxc_arm_woodpecker_ci.node }
    vaultwarden   = { vmid = module.lxc_arm_vaultwarden.vm_id, ip = module.lxc_arm_vaultwarden.ip_address, node = module.lxc_arm_vaultwarden.node }
    authelia      = { vmid = module.lxc_arm_authelia.vm_id, ip = module.lxc_arm_authelia.ip_address, node = module.lxc_arm_authelia.node }
    stepca        = { vmid = module.lxc_arm_stepca.vm_id, ip = module.lxc_arm_stepca.ip_address, node = module.lxc_arm_stepca.node }
    renovate      = { vmid = module.lxc_arm_renovate_gitops.vm_id, ip = module.lxc_arm_renovate_gitops.ip_address, node = module.lxc_arm_renovate_gitops.node }
    vscode_server = { vmid = module.lxc_arm_vscode_server.vm_id, ip = module.lxc_arm_vscode_server.ip_address, node = module.lxc_arm_vscode_server.node }
  }
}
