# 🏔️ Alpine Linux Server (VM 201)

- **Operating System**: Alpine Linux v3.21 Virt (KVM)
- **Architecture**: x86_64 paravirtualized guest with VirtIO SCSI single
- **Memory Allocation**: 256 MB RAM (128 MB ballooning, idle < 60 MB)
- **Disk**: 25 GB NVMe on `local-lvm`
- **Network**: Static IP `192.168.1.202/24`, Gateway `192.168.1.1`, DNS `192.168.1.4`
