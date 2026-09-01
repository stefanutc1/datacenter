variable "project_id" {
  type        = string
  description = "Google Cloud Platform Project ID"
  default     = "homelab-enterprise-hybrid"
}

variable "region" {
  type        = string
  description = "GCP primary region"
  default     = "europe-west3" # Frankfurt
}

variable "backup_bucket_name" {
  type        = string
  description = "Globally unique name for WORM PBS backup bucket"
  default     = "homelab-pbs-worm-backups-2026"
}

variable "domain_name" {
  type        = string
  description = "Public domain zone for external DNS sync"
  default     = "homelab.stefannut.ro."
}

variable "github_repository" {
  type        = string
  description = "GitHub repository for Workload Identity Federation"
  default     = "stefanutc1/homelab"
}

variable "tags" {
  type        = map(string)
  description = "Resource labels"
  default = {
    environment = "hybrid-cloud"
    project     = "homelab-enterprise"
    managed_by  = "terraform"
  }
}
