#!/usr/bin/env sh
set -e

export DEBIAN_FRONTEND=noninteractive
export PIP_DISABLE_PIP_VERSION_CHECK=1
export PIP_NO_CACHE_DIR=1

echo "=== Multi-Linux Distribution Compatibility & Portability Runner ==="

if [ -f /etc/os-release ]; then
    . /etc/os-release
    DISTRO_ID="$ID"
    DISTRO_NAME="$PRETTY_NAME"
else
    DISTRO_ID="unknown"
    DISTRO_NAME="Unknown Linux"
fi

echo "Detected Linux Distribution: $DISTRO_NAME (ID: $DISTRO_ID)"

case "$DISTRO_ID" in
    alpine)
        echo "Configuring Alpine Linux (musl libc)..."
        apk update
        apk add --no-cache python3 py3-pip py3-virtualenv gcc musl-dev linux-headers python3-dev git
        ;;
    debian|ubuntu)
        echo "Configuring Debian/Ubuntu (glibc / noninteractive)..."
        apt-get update -y
        apt-get install -y --no-install-recommends python3 python3-pip python3-venv python3-dev build-essential git ca-certificates
        ;;
    rocky|rhel|centos|fedora)
        echo "Configuring RedHat/Fedora/Rocky Linux (RPM ecosystem)..."
        if command -v dnf >/dev/null 2>&1; then
            dnf install -y python3 python3-pip python3-devel gcc git
        else
            yum install -y python3 python3-pip python3-devel gcc git
        fi
        ;;
    arch)
        echo "Configuring Arch Linux (pacman)..."
        pacman -Sy --noconfirm python python-pip base-devel git
        ;;
    *)
        echo "Generic Linux distribution detected..."
        ;;
esac

echo "Creating isolated distribution virtualenv (PEP 668 compliance)..."
rm -rf /tmp/elo_distro_venv
python3 -m venv /tmp/elo_distro_venv
. /tmp/elo_distro_venv/bin/activate

echo "Installing ELO framework and dependencies in $DISTRO_NAME..."
pip install --upgrade pip setuptools wheel
pip install pytest pytest-asyncio httpx pydantic psutil uvicorn fastapi pyyaml python-dotenv

pip install -e elo/packages/elo-contracts
pip install -e elo/packages/elo-security
pip install -e elo/packages/elo-ai-client
pip install -e elo/apps/elo-core

echo "Executing automated test suite on $DISTRO_NAME..."
cd elo
PYTHONPATH="apps/elo-core/src:packages/elo-contracts/src:packages/elo-security/src:packages/elo-ai-client/src" python3 -m pytest -v -o asyncio_mode=auto

echo " Distribution $DISTRO_NAME is 100% verified and compatible!"
