terraform {
  required_version = ">= 1.8.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
  }

  # Backend state configuration (Amazon S3 or local)
  # backend "s3" {
  #   bucket = "homelab-terraform-state-aws"
  #   key    = "aws.homelab.tfstate"
  #   region = "eu-central-1"
  # }
}

provider "aws" {
  region = var.aws_region
}
