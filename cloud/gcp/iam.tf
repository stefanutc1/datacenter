# ==============================================================================
# WORKLOAD IDENTITY FEDERATION (KEYLESS OIDC CI/CD FOR GITHUB ACTIONS & WOODPECKER)
# ==============================================================================

resource "google_iam_workload_identity_pool" "ci_pool" {
  workload_identity_pool_id = "homelab-ci-pool"
  display_name              = "Homelab CI/CD Workload Identity Pool"
  description               = "Identity pool for GitHub Actions and Woodpecker CI runners"
}

resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.ci_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-actions-provider"
  display_name                       = "GitHub Actions OIDC Provider"
  description                        = "OIDC identity provider for GitHub Actions"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
  }

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

# Service Account with Least-Privilege IAM Bindings for Terraform CI/CD
resource "google_service_account" "terraform_ci_sa" {
  account_id   = "homelab-terraform-ci"
  display_name = "Homelab Terraform CI Service Account"
}

resource "google_service_account_iam_member" "workload_identity_binding" {
  service_account_id = google_service_account.terraform_ci_sa.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.ci_pool.name}/attribute.repository/${var.github_repository}"
}

resource "google_project_iam_member" "storage_admin_binding" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.terraform_ci_sa.email}"
}

resource "google_project_iam_member" "dns_admin_binding" {
  project = var.project_id
  role    = "roles/dns.admin"
  member  = "serviceAccount:${google_service_account.terraform_ci_sa.email}"
}
