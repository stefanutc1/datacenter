# ==============================================================================
# AZURE HYBRID CLOUD ORCHESTRATION — RESOURCE GROUP
# ==============================================================================

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}
