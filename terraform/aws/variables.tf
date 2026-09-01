variable "aws_region" {
  type        = string
  description = "AWS region for hybrid deployments"
  default     = "eu-central-1" # Frankfurt
}

variable "s3_backup_bucket_name" {
  type        = string
  description = "Globally unique name for AWS S3 cold backup bucket"
  default     = "homelab-aws-glacier-backups-2026"
}

variable "github_repository" {
  type        = string
  description = "GitHub repository name for OIDC role trust"
  default     = "stefanutc1/homelab"
}

variable "tags" {
  type        = map(string)
  description = "Default resource tags"
  default = {
    Environment = "Hybrid-Cloud"
    Project     = "Homelab-Enterprise"
    ManagedBy   = "Terraform"
  }
}
