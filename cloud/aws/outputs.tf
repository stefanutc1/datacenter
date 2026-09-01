output "s3_cold_backup_bucket" {
  description = "AWS S3 Glacier Deep Archive backup bucket name"
  value       = aws_s3_bucket.cold_backups.bucket
}

output "github_oidc_role_arn" {
  description = "AWS IAM Role ARN for GitHub Actions / Woodpecker OIDC keyless authentication"
  value       = aws_iam_role.github_actions_tf.arn
}

output "vpn_connection_id" {
  description = "AWS Site-to-Site VPN Connection ID to on-premise OPNsense"
  value       = aws_vpn_connection.main.id
}
