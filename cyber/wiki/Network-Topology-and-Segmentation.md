# Network Topology & Segmentation

## Zero-Trust VLAN Boundaries

CyberLab isolates testbeds, target nodes, and security telemetry into dedicated microsegments:

| Zone | Subnet CIDR | Nodes | Purpose | Ingress Rules |
| :--- | :--- | :--- | :--- | :--- |
| **Control Plane** | `192.168.64.0/28` | `cyber-ctrl` (`.2`) | Ansible & Terraform controller | SSH :22, Gitea :3001, Woodpecker :8000 |
| **VLAN 10** | `192.168.64.0/28` | `cyber-node01` (`.10`) | Production hardened target | SSH :2222 from Controller ONLY. |
| **VLAN 20** | `192.168.64.16/28` | `cyber-node02` (`.20`) | DMZ & Honey Services | HTTP :80, HTTPS :443, SSH :2222 (isolated) |
| **VLAN 30** | `192.168.64.32/28` | `cyber-soc01` (`.30`) | SIEM, Loki, Suricata, AI | Wazuh :1514/:55000, Grafana :3000, Loki :3100 |

---

## Traffic Mirroring & NIDS Inspection

`cyber-node02` mirrors all ingress/egress interface traffic to the Suricata container interface in VLAN 30 for continuous anomaly detection and protocol analysis.
