#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Service:     Custom SaaS
# Description: Custom application -- Docker-only deployment
# Note:        This is a custom application without a community-scripts.org
#              LXC installer. Deployment is via Docker Compose only.
# ---------------------------------------------------------------------------
# Usage:
#   Deploy with Docker Compose:
#     docker compose up -d
#
#   Run this script for guidance:
#     bash install.sh
# ---------------------------------------------------------------------------

set -euo pipefail

APP_NAME="Custom SaaS"

echo "========================================"
echo " ${APP_NAME} -- Docker Deployment"
echo "========================================"
echo ""
echo "This is a custom application that does not have a community-scripts.org"
echo "Proxmox VE LXC installer. Deployment is supported via Docker Compose only."
echo ""
echo "To deploy, run the following command from this directory:"
echo ""
echo "  docker compose up -d"
echo ""
echo "To stop the service:"
echo ""
echo "  docker compose down"
echo ""
echo "To view logs:"
echo ""
echo "  docker compose logs -f"
echo ""
echo "To update to the latest image:"
echo ""
echo "  docker compose pull"
echo "  docker compose up -d"
echo ""
echo "If you need to run this inside a Proxmox LXC container, you can:"
echo "  1. Create a Debian/Ubuntu LXC container"
echo "  2. Install Docker inside the container"
echo "  3. Copy the docker-compose.yml to the container"
echo "  4. Run: docker compose up -d"
echo ""
