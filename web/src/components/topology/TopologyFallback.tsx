"use client";

import React, { useMemo } from "react";
import { TopologyNode, TopologyEdge, SubsystemPreset, SubsystemCategory } from "@/data/infrastructure";
import { Server, Shield, Cpu, Boxes, Activity, Zap, HardDrive, Layers, Globe, Radio, Folder } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface TopologyFallbackProps {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  selectedNode: TopologyNode | null;
  activeSubsystem: SubsystemCategory;
  onSelectNode: (node: TopologyNode) => void;
}

const getCategoryIcon = (category: SubsystemCategory) => {
  switch (category) {
    case "network": return Globe;
    case "security": return Shield;
    case "compute": return Server;
    case "orchestration": return Boxes;
    case "automation": return Layers;
    case "observability": return Activity;
    case "services": return Folder;
    case "elo": return Zap;
    case "edge": return Radio;
    case "projects": return HardDrive;
    default: return Server;
  }
};

export const TopologyFallback: React.FC<TopologyFallbackProps> = ({
  nodes,
  edges,
  selectedNode,
  activeSubsystem,
  onSelectNode,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Group nodes by tier
  const tiers = useMemo(() => {
    const map = new Map<number, TopologyNode[]>();
    nodes.forEach((n) => {
      const list = map.get(n.tier) || [];
      list.push(n);
      map.set(n.tier, list);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [nodes]);

  const tierTitles: Record<number, string> = {
    0: "Tier 0 // Perimeter & Ingress Gateways",
    1: "Tier 1 // Bare-Metal & Virtual Hypervisors",
    2: "Tier 2 // Virtual Machines (KVM)",
    3: "Tier 3 // Core Production LXC Microservices",
    4: "Tier 4 // ARM64 Utility & Observability LXC",
    5: "Tier 5 // Threat Detection & SIEM Engine",
    6: "Tier 6 // ELO Autonomous AI Operating Layer",
    7: "Tier 7 // Physical World Edge Microcontrollers",
    8: "Tier 8 // Architecture Testing Environments",
  };

  return (
    <div className="w-full h-full overflow-y-auto p-6 md:p-8 space-y-8 bg-warm-page text-warm-primary font-sans">
      <div className="flex items-center justify-between border-b border-warm pb-4">
        <div>
          <div className="text-xs uppercase tracking-widest font-mono text-terracotta-500 mb-1">
            2D SYSTEM ARCHITECTURE FALLBACK
          </div>
          <h2 className="text-2xl font-serif font-bold text-warm-primary">
            Homelab Infrastructure Hierarchy
          </h2>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-full bg-warm-card border border-warm text-warm-secondary">
          {nodes.length} Nodes · {edges.length} Active Edges
        </div>
      </div>

      <div className="space-y-6">
        {tiers.map(([tierNum, tierNodes]) => (
          <div key={tierNum} className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-warm-secondary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-terracotta-500/70" />
              {tierTitles[tierNum] || `Tier ${tierNum}`}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {tierNodes.map((n) => {
                const IconComponent = getCategoryIcon(n.category);
                const isSelected = selectedNode?.id === n.id;
                const isMatch = activeSubsystem === "system" || n.category === activeSubsystem;

                return (
                  <button
                    key={n.id}
                    onClick={() => onSelectNode(n)}
                    className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? "bg-terracotta-500/15 border-terracotta-500 shadow-md shadow-terracotta-500/10 ring-1 ring-terracotta-500"
                        : isMatch
                        ? "bg-warm-card border-warm hover:border-terracotta-400 hover:shadow-sm"
                        : "bg-warm-card/40 border-warm/40 opacity-40 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${n.color}20`, color: n.color }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-warm-page/80 border border-warm text-warm-secondary">
                        {n.hostname || `T${n.tier}`}
                      </span>
                    </div>

                    <div className="font-medium text-sm text-warm-primary truncate">
                      {n.name}
                    </div>
                    <div className="text-xs text-warm-secondary truncate mt-0.5">
                      {n.sublabel || n.domain || n.ip}
                    </div>

                    {n.hardware && (
                      <div className="mt-3 pt-2 border-t border-warm/60 flex items-center justify-between text-[11px] font-mono text-warm-secondary">
                        <span>{n.hardware.ram}</span>
                        <span>{n.hardware.storage}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
