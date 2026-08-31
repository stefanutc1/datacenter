"use client";

import React from "react";
import { Server, Shield, Cpu, Zap, Activity, HardDrive, ArrowDown, ExternalLink } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section id="overview" className="relative py-16 sm:py-24 border-b border-sand-300 dark:border-espresso-800 bg-sand-50 dark:bg-espresso-950/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200/80 dark:bg-espresso-800 border border-sand-300 dark:border-espresso-700 text-xs font-mono text-espresso-700 dark:text-sand-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All 33 Production Services Operational</span>
          <span className="text-sand-400 dark:text-espresso-600">•</span>
          <span className="text-terracotta-600 dark:text-terracotta-400 font-semibold">Dual Proxmox Hypervisors Active</span>
        </div>

        {/* Main Editorial Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-espresso-900 dark:text-sand-100 leading-[1.12]">
              Living Infrastructure, Dual-Hypervisor Virtualization &amp; Autonomous AI
            </h1>

            <p className="text-base sm:text-lg text-espresso-600 dark:text-sand-300 leading-relaxed font-sans max-w-3xl">
              An engineering homelab engineered for high reliability, local data sovereignty, and energy efficiency. 
              Spanning Intel Core i3 x86_64 and Apple Silicon M1 ARM64 virtualization clusters, multi-VLAN zero-trust routing, 
              Wazuh security monitoring, and ELO — an autonomous AI orchestration engine.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#topology"
                className="px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-sm font-medium font-sans shadow-sm transition-all flex items-center gap-2"
              >
                <span>Explore 3D Digital Twin</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#services"
                className="px-5 py-2.5 rounded-xl bg-sand-200/90 dark:bg-espresso-800 hover:bg-sand-300 dark:hover:bg-espresso-700 text-espresso-800 dark:text-sand-200 text-sm font-medium font-sans border border-sand-300 dark:border-espresso-700 transition-all"
              >
                Browse Services (33)
              </a>

              <a
                href="#hardware"
                className="px-5 py-2.5 rounded-xl text-espresso-600 dark:text-sand-400 hover:text-terracotta-600 dark:hover:text-terracotta-400 text-sm font-medium font-sans transition-all"
              >
                Hardware Specs &rarr;
              </a>
            </div>
          </div>

          {/* Quick Metrics Column */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl warm-card">
              <div className="flex items-center gap-2 text-xs font-mono text-terracotta-600 dark:text-terracotta-400">
                <Server className="w-4 h-4" />
                <span>Hypervisors</span>
              </div>
              <div className="font-editorial text-2xl sm:text-3xl font-bold text-espresso-900 dark:text-sand-100 mt-2">
                2 PVE
              </div>
              <p className="text-xs text-espresso-500 dark:text-sand-400 font-sans mt-1">
                x86_64 + ARM64 M1
              </p>
            </div>

            <div className="p-4 rounded-2xl warm-card">
              <div className="flex items-center gap-2 text-xs font-mono text-terracotta-600 dark:text-terracotta-400">
                <Activity className="w-4 h-4" />
                <span>Microservices</span>
              </div>
              <div className="font-editorial text-2xl sm:text-3xl font-bold text-espresso-900 dark:text-sand-100 mt-2">
                33 Live
              </div>
              <p className="text-xs text-espresso-500 dark:text-sand-400 font-sans mt-1">
                21 LXCs + 2 VMs + 10 Apps
              </p>
            </div>

            <div className="p-4 rounded-2xl warm-card">
              <div className="flex items-center gap-2 text-xs font-mono text-terracotta-600 dark:text-terracotta-400">
                <Shield className="w-4 h-4" />
                <span>Zero Trust</span>
              </div>
              <div className="font-editorial text-2xl sm:text-3xl font-bold text-espresso-900 dark:text-sand-100 mt-2">
                WireGuard
              </div>
              <p className="text-xs text-espresso-500 dark:text-sand-400 font-sans mt-1">
                100.64.0.0/10 Mesh
              </p>
            </div>

            <div className="p-4 rounded-2xl warm-card">
              <div className="flex items-center gap-2 text-xs font-mono text-terracotta-600 dark:text-terracotta-400">
                <Zap className="w-4 h-4" />
                <span>AI Control Plane</span>
              </div>
              <div className="font-editorial text-2xl sm:text-3xl font-bold text-espresso-900 dark:text-sand-100 mt-2">
                ELO AI
              </div>
              <p className="text-xs text-espresso-500 dark:text-sand-400 font-sans mt-1">
                Gemini 2.5 + Groq + Ollama
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
