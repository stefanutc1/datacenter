#!/usr/bin/env bash
# ==============================================================================
# FortiGate-VM (VM 221) Automated Disk Importer & Bootstrap Helper
# Managed by Antigravity IaC
# ==============================================================================
set -eo pipefail

NODE_IP="${PROXMOX_NODE_IP:-192.168.1.132}"
VMID=221
IMAGE_INPUT="${1:-}"

echo "================================================================================"
echo "    FORTIGATE-VM (VM $VMID) DISK ATTACHMENT & BOOTSTRAP WIZARD"
echo "================================================================================"

if [ -z "$IMAGE_INPUT" ]; then
    echo "Usage:"
    echo "  ./scripts/deploy-fortigate-image.sh <local_or_remote_qcow2_or_zip_path_or_url>"
    echo ""
    echo "Examples:"
    echo "  ./scripts/deploy-fortigate-image.sh /path/to/fortios.qcow2"
    echo "  ./scripts/deploy-fortigate-image.sh https://example.com/FGT_VM64_KVM-v7.4.zip"
    echo ""
    echo "Current VM $VMID Configuration on Node 1 ($NODE_IP):"
    ssh -o StrictHostKeyChecking=no root@"$NODE_IP" "qm config $VMID | grep -E 'name|memory|cores|net|scsi|boot'"
    exit 0
fi

echo "[*] Target Node: $NODE_IP"
echo "[*] Source Image: $IMAGE_INPUT"

if [[ "$IMAGE_INPUT" =~ ^https?:// ]]; then
    echo "[*] Downloading remote image directly on Proxmox Node 1..."
    ssh -o StrictHostKeyChecking=no root@"$NODE_IP" "
        set -e
        mkdir -p /tmp/forti_import
        cd /tmp/forti_import
        curl -L -o forti_image.bin '$IMAGE_INPUT'
        if file forti_image.bin | grep -qi 'zip'; then
            unzip -o forti_image.bin
            QCOW_FILE=\$(ls *.qcow2 | head -n 1)
        else
            QCOW_FILE=forti_image.bin
        fi
        echo '[*] Importing disk to local-lvm...'
        qm importdisk $VMID \"\$QCOW_FILE\" local-lvm
        qm set $VMID --scsihw virtio-scsi-single --scsi0 local-lvm:vm-$VMID-disk-0,discard=on,ssd=1 --boot order=scsi0
        qm start $VMID
        echo '[✓] VM $VMID started successfully!'
        qm status $VMID
    "
else
    echo "[*] Uploading local image to Proxmox Node 1..."
    scp -o StrictHostKeyChecking=no "$IMAGE_INPUT" root@"$NODE_IP":/tmp/fortios_upload.img
    ssh -o StrictHostKeyChecking=no root@"$NODE_IP" "
        set -e
        mkdir -p /tmp/forti_import
        cd /tmp/forti_import
        if file /tmp/fortios_upload.img | grep -qi 'zip'; then
            unzip -o /tmp/fortios_upload.img
            QCOW_FILE=\$(ls *.qcow2 | head -n 1)
        else
            QCOW_FILE=/tmp/fortios_upload.img
        fi
        echo '[*] Importing disk to local-lvm...'
        qm importdisk $VMID \"\$QCOW_FILE\" local-lvm
        qm set $VMID --scsihw virtio-scsi-single --scsi0 local-lvm:vm-$VMID-disk-0,discard=on,ssd=1 --boot order=scsi0
        qm start $VMID
        echo '[✓] VM $VMID started successfully!'
        qm status $VMID
    "
fi

echo "================================================================================"
echo "[✓] FortiGate-VM (VM $VMID) is configured and running on Node 1!"
echo "    - Transit IP: 10.10.20.2/30 (vmbr2, peer with OPNsense 10.10.20.1/30)"
echo "    - WebGUI / Mgmt: http://192.168.1.136 (vmbr0, port1 default DHCP/static)"
echo "    - Serial Console: ssh root@$NODE_IP 'qm terminal $VMID'"
echo "================================================================================"
