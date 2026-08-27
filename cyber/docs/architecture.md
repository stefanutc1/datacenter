# CyberLab Enterprise Architecture & Network Segmentation

## Network Zoning & Subnets

The CyberLab topology implements strict zero-trust isolation between management controller, hardened target nodes, DMZ services, and SOC analysis platforms.

| Zone / VLAN | CIDR Block | Function | Firewall Policy |
| :--- | :--- | :--- | :--- |
| **MGMT (VLAN 1)** | `192.168.64.0/28` | Ansible & Terraform Controller (`cyber-ctrl`) | Outbound SSH only to targets. Inbound blocked. |
| **LAB-PROD (VLAN 10)** | `192.168.64.16/28` | Primary Hardened Target Nodes (`cyber-node01`) | SSH Port 2222 from MGMT only. |
| **DMZ (VLAN 20)** | `192.168.64.32/28` | Exposed Service Lab Nodes (`cyber-node02`) | Web 80/443 open; lateral movement blocked. |
| **SOC / SIEM (VLAN 30)** | `192.168.64.48/28` | Wazuh, Loki, Grafana, Suricata (`cyber-soc01`) | Ingest ports open (3100, 1514). |

## Data Flow Diagram

```mermaid
flowchart TD
    CTRL["Control Station (cyber-ctrl)<br/>192.168.64.2"]

    subgraph LAB_TARGETS["Hardened Lab Segment"]
        NODE1["cyber-node01 (192.168.64.10)<br/>Auditd FIM / UFW / Fail2ban"]
        NODE2["cyber-node02 (192.168.64.20)<br/>DMZ Web Target"]
    end

    subgraph SOC_STACK["SOC & SIEM Ingestion Layer"]
        LOKI["Loki Log Store<br/>Port 3100"]
        GRAF["Grafana Dashboards<br/>Port 3000"]
        WAZUH["Wazuh SIEM Manager<br/>Port 1514"]
        SURICATA["Suricata NIDS<br/>eve.json"]
    end

    CTRL -->|Ansible SSH| NODE1 & NODE2
    NODE1 -->|Promtail Log Push| LOKI
    NODE2 -->|Promtail Log Push| LOKI
    LOKI --> GRAF
    NODE1 -.->|Wazuh Agent| WAZUH
    NODE2 -.->|Traffic Mirror| SURICATA
```
