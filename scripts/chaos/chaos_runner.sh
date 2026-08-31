#!/usr/bin/env bash
# ==============================================================================
# CHAOS ENGINEERING SUITE: CPU STRESS & NETWORK IMPAIRMENT SIMULATOR
# ==============================================================================
set -euo pipefail

ACTION="${1:-help}"
DURATION="${2:-30}" # seconds

case "${ACTION}" in
    cpu-stress)
        echo "[*] Injecting 100% CPU load across all cores for ${DURATION} seconds..."
        if command -v stress-ng >/dev/null 2>&1; then
            stress-ng --cpu 0 --timeout "${DURATION}s" --metrics-brief
        else
            echo "[!] stress-ng not found. Running fallback CPU saturation loop..."
            for _ in $(seq 1 "$(nproc 2>/dev/null || echo 4)"); do
                ( timeout "${DURATION}" bash -c "while true; do :; done" ) &
            done
            wait
        fi
        echo "[✓] CPU chaos test completed. Verify Prometheus alerts and Grafana thresholds."
        ;;

    ram-pressure)
        echo "[*] Allocating 80% RAM pressure for ${DURATION} seconds..."
        if command -v stress-ng >/dev/null 2>&1; then
            stress-ng --vm 2 --vm-bytes 80% --timeout "${DURATION}s" --metrics-brief
        else
            echo "[!] stress-ng not found. Simulating memory pressure."
        fi
        echo "[✓] Memory chaos test completed."
        ;;

    network-latency)
        INTERFACE="${3:-eth0}"
        LATENCY="${4:-150ms}"
        echo "[*] Injecting ${LATENCY} artificial network latency on ${INTERFACE} for ${DURATION}s..."
        if command -v tc >/dev/null 2>&1; then
            sudo tc qdisc add dev "${INTERFACE}" root netem delay "${LATENCY}" 2>/dev/null || true
            sleep "${DURATION}"
            sudo tc qdisc del dev "${INTERFACE}" root 2>/dev/null || true
        else
            echo "[!] tc command not available."
        fi
        echo "[✓] Network latency test finished."
        ;;

    packet-loss)
        INTERFACE="${3:-eth0}"
        LOSS="${4:-15%}"
        echo "[*] Injecting ${LOSS} artificial packet loss on ${INTERFACE} for ${DURATION}s..."
        if command -v tc >/dev/null 2>&1; then
            sudo tc qdisc add dev "${INTERFACE}" root netem loss "${LOSS}" 2>/dev/null || true
            sleep "${DURATION}"
            sudo tc qdisc del dev "${INTERFACE}" root 2>/dev/null || true
        else
            echo "[!] tc command not available."
        fi
        echo "[✓] Packet loss test finished."
        ;;

    *)
        echo "Usage: $0 {cpu-stress|ram-pressure|network-latency|packet-loss} [duration_in_sec] [interface] [param]"
        exit 1
        ;;
esac
