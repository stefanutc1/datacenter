# macOS Monterey OpenCore EFI (VM 206)

This directory contains the production-tested, sanitized **OpenCore EFI** configuration for running **macOS Monterey 12.7** as a high-performance KVM virtual machine (VM 206) on **Proxmox VE 9.2** (Node 1 - Intel Core i3-10100F).

---

## Architecture & Specifications

| Component | Specification |
| :--- | :--- |
| **Target OS** | macOS Monterey 12.7.x |
| **Bootloader** | OpenCore 1.x (UEFI x86_64) |
| **Target SMBIOS** | `iMacPro1,1` |
| **Hypervisor Host** | Proxmox VE 9.2 (Linux 7.0 pve kernel) |
| **VM ID** | VM 206 (`macos`) |
| **Virtual Cores** | 4 Cores (`Penryn` CPU model with `+invtsc` and hypervisor flags) |
| **RAM Allocation** | 7,168 MB (7 GB) with VirtIO dynamic memory ballooning (2,048 MB min) |
| **Display & Remote** | Native VNC screen sharing (:5900) & Apple Remote Desktop |
| **Primary Workloads** | Xcode CI/CD build runner, native macOS `.NET 10` compilation, and Apple ecosystem testing |

---

## Directory Structure

```
mac/
├── EFI/
│   ├── BOOT/
│   │   └── BOOTx64.efi              # OpenCore bootstrap binary
│   └── OC/
│       ├── config.plist             # Sanitized OpenCore configuration
│       ├── OpenCore.efi             # Core OpenCore boot engine
│       ├── ACPI/                    # Custom ACPI tables (AML)
│       │   ├── SSDT-EC.aml          # Embedded Controller injection
│       │   ├── SSDT-PLUG.aml        # Native CPU power management
│       │   ├── SSDT-RMNE.aml        # NullEthernet en0 built-in interface
│       │   ├── SSDT-SBUS.aml        # System Management Bus fix
│       │   ├── SSDT-USBX.aml        # USB power properties injection
│       │   └── SSDT-Disable_Network_SF0_.aml # SF0 network disable patch
│       ├── Drivers/                 # UEFI drivers
│       │   ├── HfsPlus.efi          # Apple HFS+ file system driver
│       │   ├── OpenRuntime.efi      # NVRAM & memory runtime management
│       │   └── ResetNvramEntry.efi  # NVRAM reset boot entry
│       ├── Kexts/                   # Kernel extensions
│       │   ├── Lilu.kext            # Kernel patching framework
│       │   ├── VirtualSMC.kext      # AppleSMC emulator
│       │   ├── SMCProcessor.kext    # CPU temperature monitoring
│       │   ├── SMCSuperIO.kext      # SuperIO chip monitoring
│       │   ├── WhateverGreen.kext   # Graphics & framebuffer support
│       │   ├── RestrictEvents.kext  # Process blocker & patch manager
│       │   ├── AMFIPass.kext        # Apple Mobile File Integrity bypass
│       │   ├── NullEthernet.kext    # Emulated built-in ethernet
│       │   ├── RealtekRTL8100.kext  # Fast Ethernet driver
│       │   ├── RealtekRTL8111.kext  # Gigabit Ethernet driver
│       │   ├── USBToolBox.kext      # Custom USB map framework
│       │   ├── UTBDefault.kext      # Default USB port mapping
│       │   └── XHCI-unsupported.kext# Intel XHCI controller support
│       └── Resources/               # Audio chime, icons & fonts
└── README.md                        # Documentation & setup guide
```

---

## Security & Sanitization Notice

> **Important**: All unique hardware identifiers and confidential keys have been stripped or replaced with standard dummy placeholders in `mac/EFI/OC/config.plist`:
> * **`SystemSerialNumber`**: Set to empty (`""`).
> * **`MLB`** (Board Serial): Set to empty (`""`).
> * **`SystemUUID`**: Set to empty (`""`).
> * **`ROM`**: Set to standard sample dummy value (`ESIzRFVm` = `11:22:33:44:55:66`).

### Generating Your Unique SMBIOS Identifiers

Before booting this EFI on your own system or VM:

1. Download and run [GenSMBIOS](https://github.com/corpnewt/GenSMBIOS).
2. Choose option **1** to select your `mac/EFI/OC/config.plist`.
3. Choose option **3** and enter the model: `iMacPro1,1`.
4. GenSMBIOS will automatically inject a newly generated `SystemSerialNumber`, `MLB`, and `SystemUUID`.
5. For `ROM`, supply your physical/virtual network interface MAC address in 6-byte hexadecimal format.

---

## Proxmox VE Integration (`206.conf`)

For reference, the Proxmox KVM virtual machine configuration resides at:
`services/x64/macos-monterey/206.conf`

```ini
args: -device isa-applesmc,osk="..." -smbios type=2 -cpu Penryn,kvm=on,vendor=GenuineIntel,+invtsc,+hypervisor
balloon: 2048
boot: order=ide2;virtio0
cores: 4
cpu: Penryn
ide2: local:iso/OpenCore.iso,media=cdrom,size=150M
memory: 7168
name: macos
net0: virtio=XX:XX:XX:XX:XX:XX,bridge=vmbr0,firewall=1
ostype: other
sockets: 1
vga: vmware
virtio0: local-lvm:vm-206-disk-0,cache=unsafe,discard=on,size=64G
```
