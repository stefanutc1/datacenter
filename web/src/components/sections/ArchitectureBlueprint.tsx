"use client";

import React, { useState } from "react";
import { Server, Shield, Network, Zap, HardDrive, ArrowRight, Layers } from "lucide-react";

export const ArchitectureBlueprint: React.FC = () => {
  const [activeBlueprintTab, setActiveBlueprintTab] = useState<"vlan" | "memory" | "elo" | "storage">("vlan");

  const vlanMatrix = [
    {
      id: "VLAN 10",
      name: "Management & Hypervisors",
      subnet: "192.168.1.0/24",
      gateway: "192.168.1.1",
      nodes: "Proxmox VE 1 (x86_64), OMV NAS, Managed Switches",
      firewallPolicy: "Isolated from IoT & Guest subnets",
    },
    {
      id: "VLAN 20",
      name: "Core Microservices & Applications",
      subnet: "192.168.1.0/24 & 192.168.64.0/24",
      gateway: "192.168.1.132 (OPNsense)",
      nodes: "NPM Ingress, Vaultwarden, Immich, Nextcloud, Home Assistant, Gitea",
      firewallPolicy: "Strict forward authentication via Authelia (CT 108)",
    },
    {
      id: "VLAN 30",
      name: "Security, Threat Hunting & Sandboxes",
      subnet: "192.168.30.0/24",
      gateway: "192.168.1.132:8443",
      nodes: "Wazuh XDR SIEM (1514), Suricata NIDS, Kali Offensive VM",
      firewallPolicy: "Promiscuous SPAN mirror port, no outbound WAN access for sandboxes",
    },
    {
      id: "VLAN 50",
      name: "IoT & Physical Edge Devices",
      subnet: "192.168.50.0/24",
      gateway: "192.168.1.132",
      nodes: "ESP32 mmWave Radar, ESP32 Irrigation Relays, Zigbee Gateway",
      firewallPolicy: "MQTT communication strictly restricted to Home Assistant (CT 106)",
    },
  ];

  const memoryBudgets = [
    {
      node: "Node 1 — Proxmox Primary (x86_64 Core)",
      totalRam: "8,192 MB DDR4",
      allocatedRam: "7,808 MB",
      usagePercent: 95,
      breakdown: [
        { name: "Windows Server 2025 (VM 201)", ram: "4,096 MB" },
        { name: "OPNsense Firewall (VM 200)", ram: "1,024 MB" },
        { name: "Immich Photos AI (CT 103)", ram: "896 MB" },
        { name: "Jellyfin Media Suite (CT 109)", ram: "896 MB" },
        { name: "Home Assistant Core (CT 106)", ram: "384 MB" },
        { name: "n8n Automation (CT 107)", ram: "384 MB" },
        { name: "Nginx Proxy Manager (CT 100)", ram: "112 MB" },
        { name: "Other Core LXCs (CT 101, 104, 105, 108)", ram: "416 MB" },
      ],
    },
    {
      node: "Node 3 — Proxmox Secondary (Apple M1 ARM64)",
      totalRam: "4,096 MB Dedicated (8GB Unified)",
      allocatedRam: "2,080 MB",
      usagePercent: 51,
      breakdown: [
        { name: "Monitoring: Grafana / Prom / Loki (CT 107)", ram: "448 MB" },
        { name: "Woodpecker CI Engine (CT 110)", ram: "192 MB" },
        { name: "Gitea Git Forge (CT 109)", ram: "160 MB" },
        { name: "Actual Budget (CT 101)", ram: "160 MB" },
        { name: "Trilium Notes (CT 102)", ram: "160 MB" },
        { name: "ChangeDetection Monitor (CT 103)", ram: "160 MB" },
        { name: "Other Utility LXCs (CT 100, 104, 105, 106, 108)", ram: "496 MB" },
      ],
    },
  ];

  const eloCascade = [
    {
      tier: "Tier 1",
      provider: "Google Gemini (Gemini 2.5 Flash)",
      latency: "200-400 ms",
      role: "Primary multimodal reasoning, tool selection, and cluster diagnosis.",
    },
    {
      tier: "Tier 2",
      provider: "Groq LPU (Llama 3.3 70B)",
      latency: "80-150 ms",
      role: "Ultra-low-latency classification and fast automated decision trees.",
    },
    {
      tier: "Tier 3",
      provider: "OpenRouter Free Pool",
      latency: "400-800 ms",
      role: "Secondary multi-model routing failover if rate limits occur.",
    },
    {
      tier: "Tier 4",
      provider: "Local Ollama (Apple Metal GPU)",
      latency: "50-120 ms",
      role: "Air-gapped offline fallback execution without public WAN access.",
    },
  ];

  return (
    <section
      id="blueprint"
      className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans"
    >
      {/* Header */}
      <div className="space-y-3 mb-10 text-left">
        <div className="text-xs font-mono font-bold tracking-widest text-terracotta-500 uppercase">
          ENGINEERING SCHEMATICS & MATRIX
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-warm-primary leading-tight">
          Cluster Architecture Blueprint
        </h2>
        <p className="text-base text-warm-secondary max-w-3xl leading-relaxed">
          Technical specifications for VLAN isolation, hypervisor RAM allocation budgets, storage routing, and AI fallback cascades.
        </p>
      </div>

      {/* Blueprint Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-warm-card border border-warm shadow-sm mb-8 overflow-x-auto no-scrollbar font-mono text-xs">
        {[
          { id: "vlan", label: "VLAN SEGMENTATION MATRIX" },
          { id: "memory", label: "MEMORY ALLOCATION BUDGETS" },
          { id: "elo", label: "AI CASCADE ROUTING" },
          { id: "storage", label: "3-2-1 STORAGE & ZFS POOLS" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveBlueprintTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeBlueprintTab === tab.id
                ? "bg-terracotta-500 text-sand-50 font-bold shadow-sm"
                : "text-warm-secondary hover:text-warm-primary hover:bg-warm-page"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. VLAN SEGMENTATION MATRIX */}
      {activeBlueprintTab === "vlan" && (
        <div className="rounded-2xl bg-warm-card border border-warm shadow-md overflow-hidden font-mono text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-warm bg-warm-page/70 text-warm-secondary text-[11px] uppercase tracking-wider">
                  <th className="p-4">VLAN ID</th>
                  <th className="p-4">Network Segment</th>
                  <th className="p-4">Subnet CIDR</th>
                  <th className="p-4">Gateway Router</th>
                  <th className="p-4">Attached Workloads</th>
                  <th className="p-4">Security Policy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm">
                {vlanMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-warm-page/40 transition-colors">
                    <td className="p-4 font-bold text-terracotta-500 whitespace-nowrap">
                      {row.id}
                    </td>
                    <td className="p-4 font-medium text-warm-primary">{row.name}</td>
                    <td className="p-4 text-warm-secondary whitespace-nowrap">
                      {row.subnet}
                    </td>
                    <td className="p-4 text-warm-secondary whitespace-nowrap">
                      {row.gateway}
                    </td>
                    <td className="p-4 text-warm-primary">{row.nodes}</td>
                    <td className="p-4 text-warm-secondary">{row.firewallPolicy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. MEMORY ALLOCATION BUDGETS */}
      {activeBlueprintTab === "memory" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
          {memoryBudgets.map((b, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-warm-card border border-warm shadow-md space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-base text-warm-primary font-sans">
                    {b.node}
                  </h3>
                  <div className="text-[11px] text-warm-secondary mt-0.5">
                    Physical Ceiling: {b.totalRam}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-terracotta-500">
                    {b.allocatedRam}
                  </span>
                  <div className="text-[10px] text-warm-secondary">
                    {b.usagePercent}% Allocated
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-warm-page border border-warm overflow-hidden">
                <div
                  className="h-full bg-terracotta-500 rounded-full"
                  style={{ width: `${b.usagePercent}%` }}
                />
              </div>

              {/* Breakdown List */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] uppercase tracking-wider text-warm-secondary">
                  Workload Allocations
                </div>
                <div className="divide-y divide-warm/60">
                  {b.breakdown.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="py-2 flex items-center justify-between text-[11px]"
                    >
                      <span className="text-warm-primary truncate">{item.name}</span>
                      <span className="text-warm-secondary font-bold flex-shrink-0">
                        {item.ram}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. AI CASCADE ROUTING */}
      {activeBlueprintTab === "elo" && (
        <div className="p-6 rounded-2xl bg-warm-card border border-warm shadow-md space-y-6 font-mono text-xs">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-warm-primary font-sans">
              ELO Autonomous AI Fallback Cascade Architecture
            </h3>
            <p className="text-warm-secondary text-xs font-sans">
              When an infrastructure task is dispatched, ELO attempts inference through a sequential fallback pipeline to ensure zero downtime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {eloCascade.map((c, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-warm-page border border-warm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-terracotta-500">{c.tier}</span>
                    <span className="text-[10px] text-warm-secondary">{c.latency}</span>
                  </div>
                  <div className="font-bold text-warm-primary text-xs">{c.provider}</div>
                  <p className="text-[11px] text-warm-secondary font-sans leading-relaxed">
                    {c.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. 3-2-1 STORAGE POOLS */}
      {activeBlueprintTab === "storage" && (
        <div className="p-6 rounded-2xl bg-warm-card border border-warm shadow-md space-y-5 font-mono text-xs">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-warm-primary font-sans">
              Storage Topology & 3-2-1 Backup Strategy
            </h3>
            <p className="text-warm-secondary text-xs font-sans">
              Data protection across flash NVMe, SATA mechanical storage, and offsite object storage replication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-xl bg-warm-page border border-warm space-y-2">
              <div className="text-[11px] font-bold text-terracotta-500">
                PRIMARY TIER (FLASH NVME / SSD)
              </div>
              <p className="text-[11px] text-warm-secondary font-sans">
                512GB SSD on Proxmox Node 1 + Apple NVMe on Node 3 hosting live VM disks, LXC rootfs, and database WAL logs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-warm-page border border-warm space-y-2">
              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                SECONDARY NAS TIER (OMV ZFS POOL)
              </div>
              <p className="text-[11px] text-warm-secondary font-sans">
                500GB mechanical SATA pool on OpenMediaVault 7 (Node 2) receiving daily Proxmox snapshots and media libraries over NFS/SMB.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-warm-page border border-warm space-y-2">
              <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                OFFSITE REPLICATION (RCLONE)
              </div>
              <p className="text-[11px] text-warm-secondary font-sans">
                Encrypted rclone synchronization to secondary offsite object storage with automated health validation checks.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
