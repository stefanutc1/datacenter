# Cyberlab Network Architecture

This document defines the static IP addressing, interface topologies, and network security policies implemented across the virtual machines running inside UTM.

## Network Topology Overview

The laboratory uses an isolated internal bridge managed via UTM, ensuring that virtual nodes can communicate with the host control machine and each other without exposing services to the external physical network.

| Hostname | Role | IP Address (Static) | Assigned Ports / Services |
| :--- | :--- | :--- | :--- |
| `cyber-ctrl` | Control Station (macOS Host / UTM Bridge) | `192.168.64.2` | SSH (Mgmt) |
| `cyber-node01` | Hardened Linux Target / Server | `192.168.64.10` | Custom SSH Port |
| `cyber-node02` | Monitoring / Audit Node | `192.168.64.20` | Auditd / Log collection |

## Firewall & Security Policies

* **Default Policy:** Incoming traffic is strictly dropped (`DENY`), outgoing traffic is allowed (`ALLOW`).
* **Management Access:** SSH access is restricted exclusively to public-key authentication (Ed25519) on non-standard ports, with direct root login disabled.
