# Proxmox VE Integration Guide

This directory documents deploying the CyberLab cluster to a dedicated Proxmox VE 8/9 hypervisor node using LXC containers or KVM virtual machines.

## Architecture
- Target VLAN: `VLAN 64` (Isolated Security Lab)
- Storage Pool: `local-zfs`
- Firewall: Enabled at Proxmox SDN level
