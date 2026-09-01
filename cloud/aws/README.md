# AWS Hybrid Architecture (Terraform)

This directory declares Amazon Web Services (AWS) hybrid infrastructure for S3 Glacier Deep Archive cold storage, keyless GitHub Actions / Woodpecker OIDC IAM roles, and Site-to-Site VPN to OPNsense.

## Components Declared
1. **S3 Bucket with Object Lock & Glacier Deep Archive (`aws_s3_bucket`)**: Immutable cold storage with compliance retention.
2. **IAM OIDC Provider for GitHub Actions / Woodpecker (`aws_iam_openid_connect_provider`)**: Keyless assume-role for automated CI/CD.
3. **Site-to-Site VPN Connection (`aws_vpn_connection`)**: Encrypted IPsec tunnel to OPNsense firewall.

## Usage
```bash
terraform init
terraform plan
terraform apply
```
