# Cyberlab Architecture Diagram

```mermaid
graph TD
    subgraph Host["Host Machine (macOS / Apple Silicon)"]
        A[Control Station / Terminal] -->|Ansible Playbooks via SSH| B(UTM Hypervisor)
    end

    subgraph Network["UTM Isolated Virtual Network (192.168.64.0/24)"]
        B --> C[cyber-node01: Hardened Linux Target]
        B --> D[cyber-node02: Monitoring & Audit Node]

        C -.->|Audit / Logs / FIM| D
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#bfb,stroke:#333,stroke-width:2px
