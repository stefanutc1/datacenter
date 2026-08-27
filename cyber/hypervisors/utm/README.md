# UTM Hypervisor Guide (macOS Apple Silicon)

This guide documents the creation and network bridging of isolated laboratory guests using UTM on Apple Silicon.

## Architecture
- **Host**: macOS 14+ / Tahoe (ARM64)
- **Engine**: QEMU 7.x+ via UTM Hypervisor framework
- **Bridge Network**: Isolated Shared Network (`192.168.64.0/24`)

## Provisioning Workflow
1. Download Ubuntu Server 24.04 ARM64 ISO.
2. Create new VM in UTM:
   - Architecture: `ARM64 (aarch64)`
   - System: `QEMU 7.0+ ARM Virtual Machine (virt-7.0)`
   - Memory: 2048 MB RAM
   - CPU: 2 Cores
   - Drive: 20 GB NVMe / VirtIO
   - Network: Shared Network (DHCP / Static reservation)
3. Run bootstrap script:
   ```bash
   ./scripts/bootstrap.sh
   ```
