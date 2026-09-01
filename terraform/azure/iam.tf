# ==============================================================================
# ENTRA ID (AZURE AD) APPLICATION REGISTRATIONS FOR AUTHENTIK SSO FEDERATION
# ==============================================================================

# Entra ID SAML/OIDC App Registration for Authentik IdP
resource "azuread_application" "authentik_sso" {
  display_name     = "Homelab-Authentik-Enterprise-SSO"
  sign_in_audience = "AzureADMyOrg"

  web {
    redirect_uris = [
      "https://auth.homelab.internal/source/oauth/callback/azure-ad/",
      "https://auth.homelab.internal/application/saml/azure-ad/acs/"
    ]
    implicit_grant {
      id_token_issuance_enabled     = true
      access_token_issuance_enabled = false
    }
  }

  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000" # Microsoft Graph

    resource_access {
      id   = "e1fe6dd8-ba31-4d61-89e7-88639da4683d" # User.Read
      type = "Scope"
    }
    resource_access {
      id   = "df02124f-b303-408e-a419-611422473a3b" # User.Read.All (Admin)
      type = "Role"
    }
  }
}

resource "azuread_service_principal" "authentik_sp" {
  client_id                    = azuread_application.authentik_sso.client_id
  app_role_assignment_required = false
}

# Azure Arc Onboarding Service Principal
resource "azuread_application" "arc_onboarding" {
  display_name = "Homelab-Azure-Arc-Onboarding"
}

resource "azuread_service_principal" "arc_onboarding_sp" {
  client_id = azuread_application.arc_onboarding.client_id
}

resource "azurerm_role_assignment" "arc_machine_onboarding" {
  scope                = azurerm_resource_group.rg.id
  role_definition_name = "Azure Connected Machine Onboarding"
  principal_id         = azuread_service_principal.arc_onboarding_sp.object_id
}
