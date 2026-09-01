# OPNsense Enterprise Firewall & Security Core (VM 200 · 192.168.1.134)

Complete infrastructure definitions, automation recipes, and daemon configurations running natively on the **OPNsense Hardened FreeBSD Enterprise Firewall (VM 200 on Proxmox VE x86_64)**.

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                    OPNsense Enterprise Core Firewall (192.168.1.134)                       │
├───────────────────────────────┬───────────────────────────────┬────────────────────────────┤
│ 1. Threat Intel & Perimeter   │ 2. Observability & Telemetry  │ 3. GitOps & DR             │
│ • Suricata NIDS/IPS (ET Open) │ • Telegraf Prometheus Exporter│ • os-git-backup (Auto GPG) │
│ • CrowdSec LAPI Bouncer       │ • Monit Self-Healing Watchdog │ • config.xml Versioning    │
│ • GeoIP Kernel Drops (pf)     │ • NetFlow / IPFIX Telemetry   │ • Instant Recovery (<60s)  │
├───────────────────────────────┼───────────────────────────────┼────────────────────────────┤
│ 4. Privacy & Core Network     │ 5. Kubernetes & Dynamic Mesh  │ 6. Zero-Trust Access       │
│ • Unbound DoT (Quad9 / CF)    │ • FRRouting BGP (MetalLB)     │ • Tailscale Subnet Router  │
│ • DNSSEC Hardware-Enforced    │ • Kea DHCP Dynamic DNS Sync   │ • WireGuard Kernel Mesh    │
└───────────────────────────────┴───────────────────────────────┴────────────────────────────┘
```

## Hosted Enterprise Modules Breakdown

| Directory | Module / Service | Description | Port / Protocol |
| :--- | :--- | :--- | :--- |
| [`suricata/`](./suricata/) | **Suricata NIDS/IPS** | Deep packet inspection on WAN/VLAN streams with ET rulesets | Promiscuous / `eve.json` |
| [`crowdsec/`](./crowdsec/) | **CrowdSec LAPI Bouncer** | Collaborative threat intelligence dropping malicious IPs in `pf` | LAPI `:8080 TCP` |
| [`geoip/`](./geoip/) | **GeoIP Kernel Blocking** | Automatic drop of high-risk geopolitical threat origins | `pf` Table Aliases |
| [`dot/`](./dot/) | **DNS-over-TLS (DoT)** | Strict encrypted DNS queries via Quad9 & Cloudflare | `:853 TCP / TLS` |
| [`telegraf/`](./telegraf/) | **Telegraf Exporter** | Kernel metrics, pf state tables, interface throughput -> Prometheus | `:9273 TCP` |
| [`monit/`](./monit/) | **Monit Auto-Healing** | Daemon watchdog restarting crashed services and triggering ntfy alerts| 30s Polling Cycle |
| [`git-backup/`](./git-backup/) | **GitOps Config Backup** | Encrypted GPG automatic commit of `config.xml` to Gitea/GitHub | Git SSH Hook |
| [`frr-bgp/`](./frr-bgp/) | **FRRouting BGP Daemon** | Dynamic BGP route exchange with Kubernetes MetalLB LoadBalancers | `:179 TCP / BGP` |
| [`tailscale/`](./tailscale/) | **Tailscale Subnet Router**| WireGuard zero-trust mesh routing across all 5 homelab VLANs | WireGuard Mesh |
| [`dhcp-dyndns/`](./dhcp-dyndns/) | **DHCP Unbound DynDNS** | Dynamic auto-registration of DHCP leases in internal DNS | `:53 UDP/TCP` |
| [`wireguard/`](./wireguard/) | **WireGuard Kernel Module**| Line-rate encrypted site-to-site link with Apple M1 ARM64 node | `:51820 UDP` |
| [`netflow/`](./netflow/) | **NetFlow / IPFIX Exporter**| Real-time flow analytics forwarded to Wazuh SIEM collector | `:2055 UDP` |
