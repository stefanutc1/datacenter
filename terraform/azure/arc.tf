# ==============================================================================
# AZURE ARC (PROXMOX ON-PREMISE NODE TO DEFENDER FOR CLOUD UNIFIED MONITORING)
# ==============================================================================

# Declarative metadata representation of the on-premise Proxmox node registered via Azure Arc
resource "azurerm_resource_group_template_deployment" "arc_proxmox_host" {
  name                = "arc-proxmox-pve1-deployment"
  resource_group_name = azurerm_resource_group.rg.name
  deployment_mode     = "Incremental"

  template_content = jsonencode({
    "$schema"        = "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#"
    "contentVersion" = "1.0.0.0"
    "resources" = [
      {
        "type"       = "Microsoft.HybridCompute/machines"
        "apiVersion" = "2023-10-03-preview"
        "name"       = "pve1-proxmox-x64-node"
        "location"   = azurerm_resource_group.rg.location
        "properties" = {
          "locationData" = {
            "name" = "Homelab-Primary-Datacenter"
          }
          "clientPublicKey" = "none-managed-arc"
        }
      }
    ]
  })
}
