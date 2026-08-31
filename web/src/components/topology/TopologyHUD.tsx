"use client";

import React from "react";
import {
  SubsystemCategory,
  subsystemPresets,
} from "@/data/infrastructure";
import {
  Compass,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Shield,
  Zap,
  Radio,
  Server,
  Layers,
} from "lucide-react";

interface TopologyHUDProps {
  activeSubsystem: SubsystemCategory;
  onSelectSubsystem: (subsystem: SubsystemCategory) => void;
  isAutoRotate: boolean;
  onToggleAutoRotate: () => void;
  onResetCamera: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const TopologyHUD: React.FC<TopologyHUDProps> = ({
  activeSubsystem,
  onSelectSubsystem,
  isAutoRotate,
  onToggleAutoRotate,
  onResetCamera,
  onZoomIn,
  onZoomOut,
}) => {
  const currentPreset = subsystemPresets[activeSubsystem] || subsystemPresets.system;

  return (
    <>
      {/* Top Header Telemetry & Subsystem Preset Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pointer-events-none">
        {/* Left: Active Subsystem Identification & Live Metrics */}
        <div className="glass-panel rounded-xl px-4 py-2.5 pointer-events-auto flex items-center gap-3 border border-white/10 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="code-font text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                {currentPreset.label}
              </span>
              <span className="text-slate-500 text-xs">|</span>
              <span className="text-slate-300 text-xs font-bold uppercase tracking-tight">
                {currentPreset.title}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden md:block max-w-xl truncate mt-0.5">
              {currentPreset.summary}
            </p>
          </div>
        </div>

        {/* Right: Quick Camera Viewport Tools */}
        <div className="glass-panel rounded-xl px-2.5 py-1.5 pointer-events-auto flex items-center gap-1.5 border border-white/10 shadow-2xl backdrop-blur-md self-end md:self-auto">
          <button
            onClick={onToggleAutoRotate}
            title={isAutoRotate ? "Pause Orbital Rotation" : "Enable Orbital Rotation"}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              isAutoRotate
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
            <span className="hidden sm:inline">{isAutoRotate ? "ORBIT" : "STATIC"}</span>
          </button>

          <div className="w-px h-4 bg-slate-700/60 mx-0.5" />

          <button
            onClick={onZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={onZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={onResetCamera}
            title="Reset Coordinate View"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-all"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Subsystem Navigation Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-[95vw] overflow-x-auto no-scrollbar">
        <div className="glass-panel rounded-2xl px-2.5 py-2 flex items-center gap-1 border border-white/10 shadow-2xl backdrop-blur-xl bg-obsidian/85">
          {Object.values(subsystemPresets).map((preset) => {
            const isActive = activeSubsystem === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectSubsystem(preset.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/50 font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                {preset.id === "system" && <Layers className="w-3.5 h-3.5" />}
                {preset.id === "compute" && <Server className="w-3.5 h-3.5" />}
                {preset.id === "security" && <Shield className="w-3.5 h-3.5" />}
                {preset.id === "elo" && <Zap className="w-3.5 h-3.5 text-purple-400" />}
                {preset.id === "edge" && <Radio className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{preset.label.split("//")[1]?.trim() || preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
