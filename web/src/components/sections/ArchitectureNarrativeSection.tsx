"use client";

import React from "react";
import { Shield, Zap, Server, HardDrive, Radio, Activity, Lock, Cpu, ArrowRight } from "lucide-react";

export const ArchitectureNarrativeSection: React.FC = () => {
  const pillars = [
    {
      id: "compute",
      icon: Server,
      title: "01 // Dual Hypervisor Compute Core",
      subtitle: "Heterogeneous x86_64 and ARM64 Virtualization",
      description:
        "The cluster divides workloads between Proxmox VE 9.2 on an Intel Core i3 (4C/8T with GTX 1050 Ti) and a secondary virtualized ARM64 Proxmox node running inside macOS UTM on an Apple M1. This provides multi-architecture build targets, seamless failover testing, and high energy efficiency.",
      tags: ["Proxmox VE 9.2", "Apple Silicon M1", "KVM Virtualization", "LXC Containers"],
    },
    {
      id: "network",
      icon: Lock,
      title: "02 // Zero-Trust Network & Segmented VLANs",
      subtitle: "Full Perimeter Isolation & Encrypted Overlay Mesh",
      description:
        "OPNsense governs traffic across isolated VLANs (VLAN 10 Management, VLAN 20 Trusted LAN, VLAN 30 Isolated IoT, VLAN 50 Public DMZ). Inter-node connectivity and remote administration are enforced via a WireGuard-backed Tailscale 100.64.0.0/10 mesh with automated Pi-hole DNS sinkholing.",
      tags: ["OPNsense", "WireGuard", "Tailscale", "Pi-hole DNS", "Nginx Proxy Manager"],
    },
    {
      id: "ai",
      icon: Zap,
      title: "03 // Autonomous AI Layer — ELO",
      subtitle: "Multi-Tier LLM Cascade & Local Neural Acceleration",
      description:
        "Sitting elevated above the infrastructure, ELO is a custom Python/FastAPI autonomous daemon that orchestrates intelligence across Google Gemini 2.5 Flash, Groq LPUs, and local Ollama models accelerated via Apple Silicon Metal Performance Shaders (MPS), with long-term memory indexed in pgvector.",
      tags: ["ELO Daemon", "Gemini 2.5", "Groq LPU", "Ollama MPS", "pgvector Memory"],
    },
    {
      id: "security",
      icon: Shield,
      title: "04 // Security Operations & SIEM",
      subtitle: "Continuous Threat Hunting & Distributed Defense",
      description:
        "Every endpoint forwards telemetry to Wazuh SIEM for automated rule matching and log anomaly detection. Suricata analyzes raw packet streams for intrusion signatures, while CrowdSec crowd-sources IP reputation data to drop malicious scans at the edge.",
      tags: ["Wazuh Manager", "Suricata NIDS", "CrowdSec LAPI", "CIS Benchmarks"],
    },
    {
      id: "storage",
      icon: HardDrive,
      title: "05 // Storage Fabric & Snapshot Retention",
      subtitle: "Decoupled NAS Appliances & Incremental Snapshots",
      description:
        "Storage is centralized on Node 2 (OMV appliance with SATA pool) providing network shares (SMB/NFS) for media and backups. Proxmox instances execute scheduled ZFS snapshot exports and offsite synchronization, ensuring minimal RTO/RPO.",
      tags: ["OpenMediaVault", "ZFS Pools", "SMB/NFS Shares", "PBS Snapshots"],
    },
    {
      id: "edge",
      icon: Radio,
      title: "06 // Physical Edge & Environmental Telemetry",
      subtitle: "Microcontroller Automation & Zigbee Mesh",
      description:
        "ESP32 microcontrollers interface with physical solenoid valves for automated smart irrigation and 24GHz mmWave radar for micro-motion presence detection, feeding state updates into Home Assistant via MQTT and Zigbee networks.",
      tags: ["ESP32 Microcontrollers", "Home Assistant", "Zigbee2MQTT", "mmWave Radar"],
    },
  ];

  return (
    <section id="architecture" className="py-16 sm:py-24 border-b border-sand-300 dark:border-espresso-800 bg-sand-50 dark:bg-espresso-950/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-terracotta-600 dark:text-terracotta-400 font-semibold">
            <Shield className="w-4 h-4" />
            <span>Design Philosophy &amp; Systems Architecture</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-espresso-900 dark:text-sand-100 tracking-tight">
            Engineering Principles &amp; Architecture Pillars
          </h2>
          <p className="text-sm sm:text-base text-espresso-600 dark:text-sand-300 leading-relaxed font-sans">
            A comprehensive breakdown of the core infrastructure disciplines that guarantee privacy, fault tolerance, and automated operations.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="rounded-3xl p-6 sm:p-7 warm-card flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3.5">
                  <div className="w-10 h-10 rounded-xl bg-terracotta-100 dark:bg-terracotta-900/40 border border-terracotta-200 dark:border-terracotta-800 flex items-center justify-center text-terracotta-600 dark:text-terracotta-400">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <span className="code-font text-xs font-semibold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-wider">
                      {pillar.title}
                    </span>
                    <h3 className="font-editorial text-xl font-bold text-espresso-900 dark:text-sand-100 mt-1">
                      {pillar.subtitle}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-espresso-600 dark:text-sand-300 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-sand-200 dark:border-espresso-800">
                  {pillar.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-sand-200/80 dark:bg-espresso-800 text-espresso-700 dark:text-sand-300 border border-sand-300 dark:border-espresso-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
