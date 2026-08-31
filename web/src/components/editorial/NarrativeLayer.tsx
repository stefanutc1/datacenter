"use client";

import React, { useState } from "react";
import {
  SubsystemCategory,
  subsystemPresets,
  topologyNodes,
  TopologyNode,
} from "@/data/infrastructure";
import { hardwareNodes } from "@/data/hardware";
import { ChevronRight } from "lucide-react";

interface NarrativeLayerProps {
  activeSubsystem: SubsystemCategory;
  onSelectNode: (node: TopologyNode) => void;
  onSelectSubsystem: (subsystem: SubsystemCategory) => void;
}

export const NarrativeLayer: React.FC<NarrativeLayerProps> = ({
  activeSubsystem,
  onSelectNode,
}) => {
  const [viewTab, setViewTab] = useState<"narrative" | "hardware">("narrative");
  const currentPreset = subsystemPresets[activeSubsystem] || subsystemPresets.system;

  const relevantNodes = topologyNodes.filter(
    (n) =>
      activeSubsystem === "system" ||
      currentPreset.highlightedNodes.includes(n.id) ||
      n.category === activeSubsystem
  );

  return (
    <div className="w-full max-w-sm lg:max-w-md pointer-events-auto flex flex-col gap-3.5 z-10">
      {/* Editorial Subsystem Card */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-2xl backdrop-blur-xl bg-obsidian/85">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="code-font text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
              {currentPreset.code}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewTab("narrative")}
              className={`px-2 py-1 rounded-md text-[11px] font-mono transition-all ${
                viewTab === "narrative"
                  ? "bg-cyan-500/20 text-cyan-300 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              NARRATIVE
            </button>
            <button
              onClick={() => setViewTab("hardware")}
              className={`px-2 py-1 rounded-md text-[11px] font-mono transition-all ${
                viewTab === "hardware"
                  ? "bg-cyan-500/20 text-cyan-300 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              HOSTS
            </button>
          </div>
        </div>

        {viewTab === "narrative" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight leading-snug">
                {currentPreset.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {currentPreset.summary}
              </p>
            </div>

            {/* Nodes in this subsystem */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                Subsystem Entities ({relevantNodes.length})
              </div>
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                {relevantNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => onSelectNode(node)}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-cyan-500/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: node.color }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                          {node.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 truncate">
                          {node.hardware ? `${node.hardware.ram} • ${node.hardware.storage}` : node.sublabel}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewTab === "hardware" && (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {hardwareNodes.map((host) => (
              <div
                key={host.id}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="code-font text-xs font-bold text-white">
                    {host.displayName}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: host.badgeColor }}
                  />
                </div>
                <div className="code-font text-[11px] text-cyan-300">
                  {host.specs.cpu || host.specs.machine}
                </div>
                <div className="code-font text-[10px] text-slate-400 flex gap-2">
                  <span>RAM: {host.specs.ram}</span>
                  <span>•</span>
                  <span>DISK: {host.specs.storage}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
