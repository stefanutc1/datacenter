"use client";

import React from "react";
import { SubsystemCategory, topologyNodes, topologyEdges } from "@/data/infrastructure";
import { SystemStateType } from "@/hooks/useSystemState";

interface SystemStatusProps {
  systemState: SystemStateType;
  activeSubsystem: SubsystemCategory;
  selectedNodeName?: string;
  onOpenCommandPalette?: () => void;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  systemState,
  activeSubsystem,
  selectedNodeName,
  onOpenCommandPalette,
}) => {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] select-none">
      {/* State Badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-warm-card border border-warm text-warm-primary shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
          {systemState}
        </span>
      </div>

      {/* Current Scope / Node */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-warm-card border border-warm text-warm-secondary">
        <span className="text-terracotta-500 uppercase font-bold">SCOPE:</span>
        <span className="text-warm-primary font-medium uppercase">
          {selectedNodeName ? selectedNodeName : activeSubsystem}
        </span>
      </div>

      {/* Cluster Telemetry Stats */}
      <div className="hidden md:flex items-center gap-3 px-2.5 py-1 rounded-md bg-warm-card border border-warm text-warm-secondary">
        <span>
          <strong className="text-warm-primary">{topologyNodes.length}</strong> NODES
        </span>
        <span className="text-warm-secondary/40">|</span>
        <span>
          <strong className="text-warm-primary">{topologyEdges.length}</strong> EDGES
        </span>
      </div>

      {/* Quick Search Shortcut Pill */}
      {onOpenCommandPalette && (
        <button
          onClick={onOpenCommandPalette}
          className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-warm-card border border-warm hover:border-terracotta-500 text-warm-secondary hover:text-warm-primary transition-colors"
        >
          <span>COMMAND</span>
          <kbd className="px-1 py-0.5 rounded bg-warm-page text-[10px] font-bold border border-warm">
            ⌘K
          </kbd>
        </button>
      )}
    </div>
  );
};
