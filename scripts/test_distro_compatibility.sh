#!/usr/bin/env sh
set -e

echo "=== Linux Distribution Compatibility Detector & Runner ==="

if [ -f /etc/os-release ]; then
    . /etc/os-release
    DISTRO_ID="$ID"
    DISTRO_NAME="$PRETTY_NAME"
else
    DISTRO_ID="unknown"
    DISTRO_NAME="Unknown Linux"
fi

echo "Detected Operating System: $DISTRO_NAME (ID: $DISTRO_ID)"

case "$DISTRO_ID" in
    alpine)
        echo "Configuring Alpine Linux (musl libc)..."
        apk update
        apk add --no-cache python3 py3-pip py3-pytest gcc musl-dev linux-headers python3-dev
        ;;
    debian|ubuntu)
        echo "Configuring Debian/Ubuntu (glibc)..."
        apt-get update -y
        apt-get install -y python3 python3-pip python3-venv python3-dev build-essential git
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
        pacman -Syu --noconfirm python python-pip python-pytest base-devel git
        ;;
    *)
        echo "Generic Linux distribution detected. Using standard Python environment..."
        ;;
esac

echo "Installing ELO packages and dependencies in $DISTRO_NAME..."
python3 -m pip install --break-system-packages --upgrade pip || pip install --upgrade pip
pip install --break-system-packages pytest pytest-asyncio httpx pydantic psutil uvicorn fastapi pyyaml python-dotenv || \
pip install pytest pytest-asyncio httpx pydantic psutil uvicorn fastapi pyyaml python-dotenv

pip install --break-system-packages -e elo/packages/elo-contracts || pip install -e elo/packages/elo-contracts
pip install --break-system-packages -e elo/packages/elo-security || pip install -e elo/packages/elo-security
pip install --break-system-packages -e elo/packages/elo-ai-client || pip install -e elo/packages/elo-ai-client
pip install --break-system-packages -e elo/apps/elo-core || pip install -e elo/apps/elo-core

echo "Running full test suite on $DISTRO_NAME..."
cd elo
PYTHONPATH=. python3 -m pytest -v -o asyncio_mode=auto

echo "✅ Distribution $DISTRO_NAME is 100% verified and compatible!"
