# Google Cloud Platform Hybrid Architecture (Terraform)

This directory declares Google Cloud Platform (GCP) resources for hybrid networking, WORM object locking backups, keyless CI/CD, and centralized security analytics.

## Components Declared
1. **Cloud Storage Bucket with WORM Object Locking (`google_storage_bucket`)**: Ransomware-proof backup destination for Proxmox Backup Server (PBS) and Restic with automatic lifecycle transitions to Coldline/Archive.
2. **Workload Identity Federation (`google_iam_workload_identity_pool`)**: Keyless OIDC authentication for GitHub Actions and Woodpecker CI (zero static `credentials.json` on disk).
3. **Cloud DNS Fallback Zone (`google_dns_managed_zone`)**: External DNS resolution fallback with DNSSEC enabled if on-prem Unbound/Pi-hole becomes unreachable.
4. **Cloud Logging Sink & BigQuery SIEM (`google_logging_project_sink`)**: Ingestion pipeline exporting critical security events from T-Pot honeypots and Wazuh SIEM into BigQuery for threat hunting.
5. **Cloud Router & HA VPN Gateway (`google_compute_ha_vpn_gateway`)**: Interconnect to on-premise OPNsense firewall.

## Usage
```bash
terraform init
terraform plan
terraform apply
```
