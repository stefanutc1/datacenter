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
        <div className="rounded-2xl px-4 py-2.5 pointer-events-auto flex items-center gap-3 border border-sand-300 dark:border-espresso-700 shadow-lg backdrop-blur-xl bg-sand-100/90 dark:bg-espresso-900/90 text-espresso-900 dark:text-sand-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-terracotta-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-terracotta-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="code-font text-xs font-semibold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-wider">
                {currentPreset.label}
              </span>
              <span className="text-sand-400 dark:text-espresso-600 text-xs">|</span>
              <span className="text-espresso-800 dark:text-sand-200 text-xs font-bold uppercase tracking-tight">
                {currentPreset.title}
              </span>
            </div>
            <p className="text-[11px] text-espresso-500 dark:text-sand-400 font-mono hidden md:block max-w-xl truncate mt-0.5">
              {currentPreset.summary}
            </p>
          </div>
        </div>

        {/* Right: Quick Camera Viewport Tools */}
        <div className="rounded-2xl px-2.5 py-1.5 pointer-events-auto flex items-center gap-1.5 border border-sand-300 dark:border-espresso-700 shadow-lg backdrop-blur-xl bg-sand-100/90 dark:bg-espresso-900/90 self-end md:self-auto">
          <button
            onClick={onToggleAutoRotate}
            title={isAutoRotate ? "Pause Orbital Rotation" : "Enable Orbital Rotation"}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              isAutoRotate
                ? "bg-terracotta-500/20 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-500/40 shadow-sm font-semibold"
                : "text-espresso-600 dark:text-sand-400 hover:bg-sand-200 dark:hover:bg-espresso-800"
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
            <span className="hidden sm:inline">{isAutoRotate ? "ORBIT" : "STATIC"}</span>
          </button>

          <div className="w-px h-4 bg-sand-300 dark:bg-espresso-700 mx-0.5" />

          <button
            onClick={onZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg text-espresso-600 dark:text-sand-400 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-sand-200 dark:hover:bg-espresso-800 transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={onZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg text-espresso-600 dark:text-sand-400 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-sand-200 dark:hover:bg-espresso-800 transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={onResetCamera}
            title="Reset Coordinate View"
            className="p-1.5 rounded-lg text-espresso-600 dark:text-sand-400 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-sand-200 dark:hover:bg-espresso-800 transition-all"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Subsystem Navigation Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-[95vw] overflow-x-auto no-scrollbar">
        <div className="rounded-2xl px-2.5 py-2 flex items-center gap-1 border border-sand-300 dark:border-espresso-700 shadow-xl backdrop-blur-xl bg-sand-100/95 dark:bg-espresso-900/95">
          {Object.values(subsystemPresets).map((preset) => {
            const isActive = activeSubsystem === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectSubsystem(preset.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "bg-terracotta-500 text-white font-bold shadow-md shadow-terracotta-900/20"
                    : "text-espresso-600 dark:text-sand-400 hover:text-espresso-900 dark:hover:text-sand-100 hover:bg-sand-200/70 dark:hover:bg-espresso-800/70"
                }`}
              >
                {preset.id === "system" && <Layers className="w-3.5 h-3.5" />}
                {preset.id === "compute" && <Server className="w-3.5 h-3.5" />}
                {preset.id === "security" && <Shield className="w-3.5 h-3.5" />}
                {preset.id === "elo" && <Zap className="w-3.5 h-3.5 text-amber-500" />}
                {preset.id === "edge" && <Radio className="w-3.5 h-3.5 text-emerald-500" />}
                <span>{preset.label.split("//")[1]?.trim() || preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
