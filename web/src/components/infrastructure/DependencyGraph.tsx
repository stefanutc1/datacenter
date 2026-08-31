"use client";

import React from "react";
import { TopologyNode, topologyNodes } from "@/data/infrastructure";
import { ArrowRight, Shield, Activity, Zap, Server } from "lucide-react";

interface DependencyGraphProps {
  node: TopologyNode;
  onSelectNode: (node: TopologyNode) => void;
}

export const DependencyGraph: React.FC<DependencyGraphProps> = ({
  node,
  onSelectNode,
}) => {
  const nodeMap = React.useMemo(() => {
    const map = new Map<string, TopologyNode>();
    topologyNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

  const connectedNodes = React.useMemo(() => {
    return (node.connections || [])
      .map((id) => nodeMap.get(id))
      .filter((n): n is TopologyNode => Boolean(n));
  }, [node.connections, nodeMap]);

  return (
    <div className="space-y-6 text-sm">
      {/* WHY DOES THIS EXIST? (Killer Idea 108) */}
      <div className="p-4 rounded-xl bg-warm-page border border-warm space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-widest text-terracotta-500 font-bold flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" />
          ARCHITECTURAL PURPOSE
        </div>
        <p className="text-xs text-warm-primary leading-relaxed">
          {node.why || node.description}
        </p>
      </div>

      {/* Direct Network Adjacency Links */}
      <div className="space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-warm-secondary flex items-center justify-between">
          <span>Adjacent Mesh Links ({connectedNodes.length})</span>
          <span className="text-[10px] text-terracotta-500 font-mono">CLICK TO NAVIGATE</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {connectedNodes.map((target) => (
            <button
              key={target.id}
              onClick={() => onSelectNode(target)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-warm-card border border-warm hover:border-terracotta-400 text-left transition-all duration-150 group"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: target.color }}
                />
                <div>
                  <div className="text-xs font-mono font-bold text-warm-primary group-hover:text-terracotta-500">
                    {target.hostname || target.name}
                  </div>
                  <div className="text-[11px] text-warm-secondary truncate max-w-[200px]">
                    {target.sublabel || target.domain}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-warm-secondary group-hover:text-terracotta-500 transition-transform group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Dependency Cascade Breakdown */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-3 rounded-lg bg-warm-card border border-warm space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-warm-secondary flex items-center gap-1.5">
            <Server className="w-3 h-3 text-terracotta-500" />
            HOST NODE
          </div>
          <div className="text-xs font-mono font-medium text-warm-primary">
            {node.hardware?.node || "Bare-Metal Core"}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-warm-card border border-warm space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-warm-secondary flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-500" />
            SECURITY ZONE
          </div>
          <div className="text-xs font-mono font-medium text-warm-primary">
            {node.tier === 0
              ? "Perimeter DMZ"
              : node.tier === 4
              ? "VLAN 20 (Apps)"
              : node.tier === 7
              ? "VLAN 50 (IoT)"
              : "Internal Mesh"}
          </div>
        </div>
      </div>
    </div>
  );
};
