# ==============================================================================
# Enterprise CyberLab — Terraform Local State & Topology Provisioner
# ==============================================================================

resource "local_file" "ansible_dynamic_inventory" {
  content = templatefile("${path.module}/inventory.tpl", {
    nodes = var.nodes
  })
  filename = "${path.module}/../inventory/hosts.dynamic.yml"
}

resource "local_file" "network_topology_doc" {
  content = <<EOT
# Generated Network Topology — CyberLab
Subnet: ${var.lab_network_cidr}

%{ for name, conf in var.nodes ~}
* ${name} -> ${conf.ip} (${conf.role}) [${conf.cores} vCPU, ${conf.ram_mb} MB RAM]
%{ endfor ~}
EOT
  filename = "${path.module}/../docs/topology.generated.txt"
}
