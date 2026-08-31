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
      <div className="rounded-3xl p-5 border border-sand-300 dark:border-espresso-700 shadow-xl backdrop-blur-xl bg-sand-50/90 dark:bg-espresso-900/90 text-espresso-900 dark:text-sand-100">
        <div className="flex items-center justify-between border-b border-sand-200 dark:border-espresso-800 pb-3 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="code-font text-xs font-bold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest">
              {currentPreset.code}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewTab("narrative")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                viewTab === "narrative"
                  ? "bg-terracotta-500 text-white font-bold shadow-sm"
                  : "text-espresso-600 dark:text-sand-400 hover:bg-sand-200 dark:hover:bg-espresso-800"
              }`}
            >
              NARRATIVE
            </button>
            <button
              onClick={() => setViewTab("hardware")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                viewTab === "hardware"
                  ? "bg-terracotta-500 text-white font-bold shadow-sm"
                  : "text-espresso-600 dark:text-sand-400 hover:bg-sand-200 dark:hover:bg-espresso-800"
              }`}
            >
              HOSTS
            </button>
          </div>
        </div>

        {viewTab === "narrative" && (
          <div className="space-y-4">
            <div>
              <h2 className="font-editorial text-xl font-bold text-espresso-900 dark:text-sand-100 tracking-tight leading-snug">
                {currentPreset.title}
              </h2>
              <p className="text-xs text-espresso-600 dark:text-sand-300 mt-1.5 leading-relaxed font-sans">
                {currentPreset.summary}
              </p>
            </div>

            {/* Nodes in this subsystem */}
            <div className="space-y-1.5 pt-2 border-t border-sand-200 dark:border-espresso-800">
              <div className="text-[11px] font-mono text-espresso-500 dark:text-sand-400 uppercase font-semibold">
                Subsystem Entities ({relevantNodes.length})
              </div>
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                {relevantNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => onSelectNode(node)}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-sand-200/40 hover:bg-sand-200/80 dark:bg-espresso-800/40 dark:hover:bg-espresso-800 border border-sand-300/50 dark:border-espresso-700/50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: node.color }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-espresso-900 dark:text-sand-100 group-hover:text-terracotta-600 dark:group-hover:text-terracotta-400 truncate">
                          {node.name}
                        </div>
                        <div className="text-[10px] font-mono text-espresso-500 dark:text-sand-400 truncate">
                          {node.hardware ? `${node.hardware.ram} • ${node.hardware.storage}` : node.sublabel}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-espresso-400 dark:text-sand-500 group-hover:text-terracotta-500 flex-shrink-0" />
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
                className="p-3 rounded-xl bg-sand-200/40 dark:bg-espresso-800/40 border border-sand-300/50 dark:border-espresso-700/50 space-y-1.5 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="code-font text-xs font-bold text-espresso-900 dark:text-sand-100">
                    {host.displayName}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full shadow-sm"
                    style={{ backgroundColor: host.badgeColor }}
                  />
                </div>
                <div className="code-font text-[11px] text-terracotta-600 dark:text-terracotta-400 font-medium">
                  {host.specs.cpu || host.specs.machine}
                </div>
                <div className="code-font text-[10px] text-espresso-500 dark:text-sand-400 flex gap-2">
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
