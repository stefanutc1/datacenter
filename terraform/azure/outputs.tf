output "resource_group_name" {
  description = "Azure Resource Group name"
  value       = azurerm_resource_group.rg.name
}

output "key_vault_uri" {
  description = "Azure Key Vault URI for Step-CA HSM & Tang/Clevis LUKS backups"
  value       = azurerm_key_vault.vault.vault_uri
}

output "blob_storage_dr_container" {
  description = "Archive Tier storage container for encrypted ZFS snapshots"
  value       = "${azurerm_storage_account.dr_storage.primary_blob_endpoint}${azurerm_storage_container.zfs_snapshots_dr.name}"
}

output "entra_authentik_client_id" {
  description = "Entra ID Client ID for Authentik SSO Federation"
  value       = azuread_application.authentik_sso.client_id
}

output "vpn_gateway_public_ip" {
  description = "Azure VPN Gateway public IP for OPNsense Site-to-Site tunnel"
  value       = azurerm_public_ip.vpn_gw_ip.ip_address
}
