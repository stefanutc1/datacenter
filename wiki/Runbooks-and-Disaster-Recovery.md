# 🚨 Runbooks & Disaster Recovery

## 1. Cold Start Procedure (Power Outage Recovery)

In the event of a total lab power outage, bring services online in this strict order:

1. **Physical Power & UPS**: Verify battery capacity $> 50\%$.
2. **Network Switches & APs**: Ensure PoE switches and VLAN trunks are online.
3. **Core Hypervisor**: Boot Proxmox VE host (`pve`).
4. **Core Firewall**: Start OPNsense VM (VLAN 10/20/30 gateway).
5. **DNS & Networking**: Start Pi-hole container and verify local name resolution (`ping pihole.homelab.local`).
6. **Ingress & Auth**: Bring up Nginx Proxy Manager and Authelia (`docker compose up -d`).
7. **Storage & Databases**: Mount ZFS/NFS pools and start PostgreSQL / Redis containers.
8. **Applications & Monitoring**: Execute `make siem-up` and start container stacks.

---

## 2. Automated Backups & Restoration

- **Database Dumps**: Daily PostgreSQL / SQLite dumps automated via `cron` to local backup storage.
- **Proxmox VM Snapshots**: Weekly Proxmox Backup Server (PBS) incremental backups.
- **ZFS Snapshots**: Daily local snapshots of `/rpool/data` with 30-day retention.
