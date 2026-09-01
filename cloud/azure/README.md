# Azure Hybrid Cloud Architecture (Terraform)

This directory declares the Microsoft Azure hybrid cloud integration for the Homelab. It prioritizes identity federation, cold disaster recovery, cloud HSM secret escrow, and unified telemetry while maintaining minimal costs.

## Components Declared
1. **Azure Key Vault (`azurerm_key_vault`)**: Cloud HSM for off-site Step-CA Root CA backups and LUKS Tang/Clevis disk encryption recovery keys.
2. **Blob Storage Archive Tier (`azurerm_storage_account` & `azurerm_storage_management_policy`)**: Disaster recovery target for encrypted ZFS snapshot streams with automatic transition to Archive Tier after 30 days.
3. **Entra ID Application Registration (`azuread_application`)**: OIDC/SAML enterprise identity federation with Authentik IdP.
4. **Azure Arc Integration (`azurerm_resource_group_template_deployment`)**: Onboards the physical Proxmox hypervisor into Microsoft Defender for Cloud for unified posture assessment.
5. **Site-to-Site IPsec/WireGuard VPN Gateway (`azurerm_virtual_network_gateway`)**: Connects Azure VNet to on-premise OPNsense gateway.

## Usage
```bash
terraform init
terraform plan
terraform apply
```
