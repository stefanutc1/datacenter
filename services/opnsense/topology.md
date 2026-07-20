# Homelab Architecture & Topology

This document outlines the architectural design, networking topology, security layers, and deployment workflows for this homelab repository.

---

## 1. High-Level Network & Infrastructure Topology

The architecture separates core hypervisors, isolated compute nodes, edge security, and IoT devices across dedicated local networks and VLAN boundaries managed by OPNsense.

```mermaid
graph TD
    %% Styling Classes
    classDef internet fill:#1f2937,stroke:#4b5563,stroke-width:2px,color:#fff;
    classDef router fill:#1e40af,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef node fill:#6b21a8,stroke:#9333ea,stroke-width:2px,color:#fff;
    classDef lxc fill:#065f46,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef iot fill:#b45309,stroke:#f59e0b,stroke-width:2px,color:#fff;

    %% Core Components
    Internet((Internet / Tailscale VPN)):::internet
    OPNsense[OPNsense Router / Firewall<br/>Suricata IPS/IDS]:::router
    Switch[Managed Switch<br/>VLAN Tagging]:::router

    subgraph Proxmox VE Node (Main Hardware)
        PVE[Proxmox Hypervisor Core]:::node
        
        subgraph LXC Containers / Docker Stack
            NPM[Nginx Proxy Manager<br/>TLS Termination]:::lxc
            Monitoring[Prometheus + Grafana + Uptime Kuma]:::lxc
            Services[Nextcloud, Gitea, Immich, Home Assistant]:::lxc
            Security[CrowdSec + Pi-hole DNS]:::lxc
        end
    end

    subgraph Attic Node (Secondary Hardware)
        K3S[Kubernetes k3s Cluster<br/>Alpine Linux]:::node
        GHRunner[GitHub Actions Self-Hosted Runner]:::lxc
    end

    subgraph IoT Zone (VLAN 30 - Isolated)
        ESP32[ESP32 Irrigation & Sensors]:::iot
    end

    subgraph Storage Node (OMV)
        OMV[OpenMediaVault NAS<br/>Backups & Central Storage]:::node
    end

    %% Traffic and Management Connections
    Internet -->|Tailscale / WAN| OPNsense
    OPNsense --> Switch
    Switch -->|VLAN 10: Management| PVE
    Switch -->|VLAN 20: Homelab Services| NPM
    Switch -->|VLAN 30: IoT Isolated| ESP32
    Switch -->|VLAN 20: Storage Sync| OMV

    NPM --> Services
    NPM --> Monitoring
    Security -.->|Log Scraping & DNS Filtering| NPM
    ESP32 -.->|MQTT Telemetry| Services
    
    %% CI/CD Pipeline Link
    GHRunner -.->|Build & Deploy Tasks| K3S
