output "laboratory_subnet" {
  value = var.lab_network_cidr
}

output "node_ip_addresses" {
  value = { for k, v in var.nodes : k => v.ip }
}
