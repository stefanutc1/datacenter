output "lxc_inventory" {
  description = "Machine-readable map of all provisioned LXC containers"
  value = {
    nginx         = { vmid = module.lxc_nginx.vm_id, ip = module.lxc_nginx.ip_address, node = module.lxc_nginx.node },
    pihole        = { vmid = module.lxc_pihole.vm_id, ip = module.lxc_pihole.ip_address, node = module.lxc_pihole.node },
    tailscale     = { vmid = module.lxc_tailscale.vm_id, ip = module.lxc_tailscale.ip_address, node = module.lxc_tailscale.node },
    immich        = { vmid = module.lxc_immich.vm_id, ip = module.lxc_immich.ip_address, node = module.lxc_immich.node },
    nextcloud     = { vmid = module.lxc_nextcloud.vm_id, ip = module.lxc_nextcloud.ip_address, node = module.lxc_nextcloud.node },
    crowdsec      = { vmid = module.lxc_crowdsec.vm_id, ip = module.lxc_crowdsec.ip_address, node = module.lxc_crowdsec.node },
    homeassistant = { vmid = module.lxc_homeassistant.vm_id, ip = module.lxc_homeassistant.ip_address, node = module.lxc_homeassistant.node },
    n8n           = { vmid = module.lxc_n8n.vm_id, ip = module.lxc_n8n.ip_address, node = module.lxc_n8n.node },
    ollama_gpu    = { vmid = module.lxc_ollama_gpu.vm_id, ip = module.lxc_ollama_gpu.ip_address, node = module.lxc_ollama_gpu.node },
    gitea         = { vmid = module.lxc_gitea.vm_id, ip = module.lxc_gitea.ip_address, node = module.lxc_gitea.node },
    woodpecker    = { vmid = module.lxc_woodpecker.vm_id, ip = module.lxc_woodpecker.ip_address, node = module.lxc_woodpecker.node },
    tempo         = { vmid = module.lxc_tempo.vm_id, ip = module.lxc_tempo.ip_address, node = module.lxc_tempo.node }
  }
}

output "vm_inventory" {
  description = "Machine-readable map of all provisioned Virtual Machines"
  value = {
    opnsense          = { vmid = module.vm_opnsense.vm_id, name = module.vm_opnsense.name, node = module.vm_opnsense.node },
    windows_server_ad = { vmid = module.vm_windows_server_2025.vm_id, name = module.vm_windows_server_2025.name, node = module.vm_windows_server_2025.node },
    talos_k8s         = { vmid = module.vm_talos_kubernetes.vm_id, name = module.vm_talos_kubernetes.name, node = module.vm_talos_kubernetes.node },
    tpot_honeynet     = { vmid = module.vm_tpot_honeypot.vm_id, name = module.vm_tpot_honeypot.name, node = module.vm_tpot_honeypot.node },
    capev2_sandbox    = { vmid = module.vm_capev2_sandbox.vm_id, name = module.vm_capev2_sandbox.name, node = module.vm_capev2_sandbox.node }
  }
}
