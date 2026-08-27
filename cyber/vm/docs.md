# UTM Virtual Machine Management Guide

Best practices for configuring and managing virtual machines on Apple Silicon using UTM for the Cyberlab environment.

## Recommended VM Specifications

* **OS Image:** Ubuntu Server 24.04 LTS (ARM64 architecture for native performance).
* **CPU Cores:** 2 vCPU per node (prevents host throttling).
* **RAM:** 2 GB - 4 GB per node.
* **Storage:** 20 GB QCOW2 (Dynamic / Sparse allocation).

## Network Configuration in UTM

1. **Network Mode:** Set the network interface to **Shared (Slirp)** or a dedicated **Bridged** interface depending on your host network layout.
2. **Static IPs:** Configure static IP addresses via Netplan inside the guest OS to ensure Ansible playbooks always target the correct endpoints (`192.168.64.10`, etc.).
3. **SSH Access:** Inject your host public key (`~/.ssh/id_ed25519.pub`) during the initial Ubuntu cloud-init / installation phase to bypass password-based logins entirely.
