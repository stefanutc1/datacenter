# OPNsense Native Security Services Suite (VM 200 · 192.168.1.134)

This directory contains configuration definitions and automation recipes for native services running directly on the **OPNsense Core Firewall (VM 200 on Proxmox VE x86_64)**.

```
┌────────────────────────────────────────────────────────────────────────┐
│               OPNsense Enterprise Firewall (VM 200)                    │
│                        192.168.1.134:8443                              │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Suricata NIDS/IPS │ CrowdSec Bouncer  │ WireGuard Kernel Module        │
│ • ET Open Ruleset │ • LAPI & Remediat.│ • Curve25519 Key Rotation      │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ Unbound DNS & DoT │ NetFlow / IPFIX   │ Kea DHCP Server                │
│ • DNSSEC Sinkhole │ • Wazuh SIEM Sink │ • Deterministic Static Leases  │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

## Hosted Services Breakdown

1. **Suricata IDS/IPS** (`suricata/`): High-throughput deep packet inspection on WAN and inter-VLAN interfaces.
2. **CrowdSec Bouncer & LAPI** (`crowdsec/`): Real-time collaborative threat intelligence and packet filter blocking.
3. **WireGuard Kernel Module** (`wireguard/`): Kernel-mode encrypted Site-to-Site and Roadwarrior VPN.
4. **Unbound DNS Resolver** (`unbound/`): Recursive DNS with split-horizon overrides for `.homelab.local`.
5. **NetFlow / Syslog Exporter** (`netflow/`): Real-time traffic metadata exported to Wazuh SIEM and Grafana.
