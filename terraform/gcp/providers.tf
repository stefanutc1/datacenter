terraform {
  required_version = ">= 1.8.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.30"
    }
  }

  # Backend state configuration (Google Cloud Storage or local)
  # backend "gcs" {
  #   bucket = "homelab-terraform-state-gcp"
  #   prefix = "terraform/state"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
