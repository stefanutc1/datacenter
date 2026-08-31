"use client";

import React from "react";
import { hardwareNodes, HardwareNode } from "@/data/hardware";
import { topologyNodes, TopologyNode } from "@/data/infrastructure";
import { Server, Cpu, HardDrive, Zap, Shield, ArrowUpRight, CheckCircle } from "lucide-react";

interface HardwareAtlasProps {
  onFocusNode: (node: TopologyNode) => void;
}

export const HardwareAtlas: React.FC<HardwareAtlasProps> = ({ onFocusNode }) => {
  const handleFocusHardware = (hw: HardwareNode) => {
    const targetNode = topologyNodes.find((n) => n.id === hw.topologyNodeId);
    if (targetNode) {
      onFocusNode(targetNode);
      // Smooth scroll back to topology viewport
      document.getElementById("topology")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hardware"
      className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans"
    >
      {/* Header */}
      <div className="space-y-3 mb-14 text-left">
        <div className="text-xs font-mono font-bold tracking-widest text-terracotta-500 uppercase">
          HETEROGENEOUS COMPUTE FLEET
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-warm-primary leading-tight">
          Physical Hardware Fleet & Hypervisor Specs
        </h2>
        <p className="text-base text-warm-secondary max-w-3xl leading-relaxed">
          Four distinct compute nodes orchestrated into a single fault-tolerant cluster. Designed to maximize power efficiency, silence, and resource density.
        </p>
      </div>

      {/* 4 Hardware Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {hardwareNodes.map((node) => (
          <div
            key={node.id}
            className="p-7 rounded-3xl bg-warm-card border border-warm shadow-md flex flex-col justify-between space-y-6 hover:border-terracotta-400 transition-all duration-200"
          >
            <div className="space-y-5">
              {/* Card Title & Role */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: node.badgeColor }}
                    />
                    <span className="text-xs font-mono font-bold tracking-wider text-warm-secondary uppercase">
                      {node.displayName}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-warm-primary">
                    {node.role}
                  </h3>
                </div>

                <button
                  onClick={() => handleFocusHardware(node)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-warm-page border border-warm hover:border-terracotta-500 text-xs font-mono font-bold text-terracotta-500 hover:text-terracotta-600 transition-all shadow-sm group"
                  title="Focus in 3D Topology"
                >
                  <span>3D VIEW</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>

              {/* OS & Virt Badges */}
              <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-md bg-warm-page border border-warm text-warm-primary font-medium">
                  OS: {node.os}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-warm-page border border-warm text-warm-secondary">
                  VIRT: {node.virtualization}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-warm-page border border-warm text-warm-secondary">
                  MESH: {node.mesh}
                </span>
              </div>

              {/* Specs Table */}
              <div className="p-4 rounded-2xl bg-warm-page/70 border border-warm space-y-2 font-mono text-xs">
                {Object.entries(node.specs).map(([key, value]) => (
                  <div key={key} className="flex items-start justify-between gap-4">
                    <span className="text-warm-secondary uppercase text-[11px]">
                      {key}
                    </span>
                    <span className="text-warm-primary font-bold text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Capacity Bottlenecks & Design Notes */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-terracotta-500 font-bold">
                  Capacity Notes & Host Constraints
                </div>
                <ul className="space-y-1.5">
                  {node.capacityNotes.map((note, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-warm-secondary flex items-start gap-2"
                    >
                      <span className="text-terracotta-500 font-mono mt-0.5">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Workloads List */}
            <div className="pt-4 border-t border-warm space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-warm-secondary">
                Active Cluster Workloads
              </div>
              <div className="flex flex-wrap gap-1.5">
                {node.workloads.map((w, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-sans bg-warm-page border border-warm text-warm-primary"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
