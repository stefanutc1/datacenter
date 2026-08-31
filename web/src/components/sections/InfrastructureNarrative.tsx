"use client";

import React from "react";
import { Server, Shield, Zap, Activity, Boxes, Radio, Layers } from "lucide-react";

export const InfrastructureNarrative: React.FC = () => {
  const pillars = [
    {
      code: "01 // VIRTUALIZATION",
      title: "Dual-Hypervisor Heterogeneous Architecture",
      icon: Server,
      accent: "#00e5ff",
      description:
        "The cluster marries a bare-metal Intel Core i3-10100F host (Proxmox VE 9.2) with a secondary Apple Silicon M1 hypervisor running Proxmox VE ARM64 virtualized inside UTM. This provides multi-architecture container execution (x86_64 and aarch64) with high energy efficiency.",
      stats: [
        { label: "Bare-Metal Core", value: "Intel i3-10100F (8GB DDR4)" },
        { label: "ARM64 Utility", value: "Apple M1 8-Core (4GB PVE)" },
        { label: "Storage NAS", value: "OMV 7 (500GB ZFS Pool)" },
      ],
    },
    {
      code: "02 // PERIMETER",
      title: "Zero-Trust Multi-VLAN Perimeter & Mesh",
      icon: Shield,
      accent: "#f97316",
      description:
        "A virtualized OPNsense router (VM 200) enforces strict isolation across dedicated VLAN segments: Management (VLAN 10), Applications (VLAN 20), Security/Cyber (VLAN 30), and IoT (VLAN 50). Ingress is secured via Cloudflare Zero Trust and point-to-point WireGuard mesh.",
      stats: [
        { label: "Core Gateway", value: "OPNsense 24.7 (VM 200)" },
        { label: "DNS Sinkhole", value: "Pi-hole Local Cache" },
        { label: "Overlay Mesh", value: "Tailscale 100.64.0.0/10" },
      ],
    },
    {
      code: "03 // AI LAYER",
      title: "ELO Autonomous AI Operating Layer",
      icon: Zap,
      accent: "#c084fc",
      description:
        "ELO operates as an autonomous background control plane combining FastAPI, pgvector semantic memory, and a cost-optimized 4-tier LLM fallback cascade (Gemini 2.5 Flash → Groq LPU → OpenRouter → Local Ollama on Apple Metal GPU) for self-healing infrastructure operations.",
      stats: [
        { label: "Primary Model", value: "Google Gemini 2.5 Flash" },
        { label: "Fast Classification", value: "Groq LPU (Llama 3.3 70B)" },
        { label: "Air-Gapped Local", value: "Ollama (Apple Metal GPU)" },
      ],
    },
    {
      code: "04 // OBSERVABILITY",
      title: "Unified Observability & Threat Intelligence",
      icon: Activity,
      accent: "#10b981",
      description:
        "Live host telemetry, disk health, and network traffic are continuously monitored via Prometheus TSDB, Grafana dashboards, Grafana Loki log aggregation, and Scrutiny SMART drive telemetry. Wazuh XDR and Suricata IPS provide continuous MITRE ATT&CK correlation.",
      stats: [
        { label: "Telemetry Engine", value: "Prometheus + Grafana" },
        { label: "Log Aggregation", value: "Grafana Loki + Promtail" },
        { label: "XDR SIEM", value: "Wazuh 4.8 + Suricata IPS" },
      ],
    },
    {
      code: "05 // ORCHESTRATION",
      title: "Kubernetes & Declarative GitOps Delivery",
      icon: Boxes,
      accent: "#3b82f6",
      description:
        "Container workloads are orchestrated across K3s lightweight Kubernetes agents and Docker Compose LXCs. Configuration drift is prevented via automated Ansible playbooks, Terraform Proxmox providers, and self-hosted Gitea + Woodpecker CI pipelines.",
      stats: [
        { label: "K8s Runtime", value: "k3s (containerd CRI)" },
        { label: "Git Forge", value: "Gitea (ARM64 CT 109)" },
        { label: "CI/CD Engine", value: "Woodpecker CI (CT 110)" },
      ],
    },
    {
      code: "06 // PHYSICAL EDGE",
      title: "Physical World Edge Microcontrollers",
      icon: Radio,
      accent: "#ea580c",
      description:
        "ESP32 microcontrollers deployed in physical rooms feed continuous telemetry back to Home Assistant and ELO over MQTT. Includes LD2410 millimeter-wave presence radars, DS18B20 temperature probes, and multi-zone garden solenoid irrigation relays.",
      stats: [
        { label: "Room Sensing", value: "ESP32 mmWave Radar" },
        { label: "Garden Actuation", value: "ESP32 Solenoid Relays" },
        { label: "Sensor Mesh", value: "Zigbee 3.0 Coordinator" },
      ],
    },
  ];

  return (
    <section
      id="narrative"
      className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans"
    >
      {/* Header */}
      <div className="space-y-3 mb-14 text-left">
        <div className="text-xs font-mono font-bold tracking-widest text-terracotta-500 uppercase">
          SYSTEM ARCHITECTURE OVERVIEW
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-warm-primary leading-tight">
          System Architecture & Subsystems
        </h2>
        <p className="text-base text-warm-secondary max-w-3xl leading-relaxed">
          Technical documentation and architecture breakdown for the self-hosted cluster, storage, networking, and microservices.
        </p>
      </div>

      {/* 6 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-warm-card border border-warm shadow-sm hover:border-terracotta-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold tracking-wider text-warm-secondary">
                    {pillar.code}
                  </span>
                  <div
                    className="p-2.5 rounded-xl border border-warm/60 group-hover:scale-110 transition-transform duration-200"
                    style={{ backgroundColor: `${pillar.accent}15`, color: pillar.accent }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-warm-primary group-hover:text-terracotta-500 transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs text-warm-secondary leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Stats Table */}
              <div className="pt-4 border-t border-warm space-y-2 font-mono text-[11px]">
                {pillar.stats.map((stat, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between">
                    <span className="text-warm-secondary">{stat.label}</span>
                    <span className="text-warm-primary font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
