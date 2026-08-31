"use client";

import React from "react";
import { subsystemPresets, SubsystemCategory } from "@/data/infrastructure";
import { RotateCw, RotateCcw, Compass } from "lucide-react";

interface SubsystemDockProps {
  activeSubsystem: SubsystemCategory;
  onSelectSubsystem: (subsystem: SubsystemCategory) => void;
  isAutoRotate: boolean;
  onToggleAutoRotate: () => void;
  onResetView: () => void;
}

const PRESET_KEYS: SubsystemCategory[] = [
  "system",
  "compute",
  "network",
  "security",
  "orchestration",
  "automation",
  "observability",
  "services",
  "elo",
  "edge",
  "projects",
];

const SHORTCUT_LABELS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "P"];

export const SubsystemDock: React.FC<SubsystemDockProps> = ({
  activeSubsystem,
  onSelectSubsystem,
  isAutoRotate,
  onToggleAutoRotate,
  onResetView,
}) => {
  return (
    <nav
      className="flex items-center gap-2 p-1.5 rounded-2xl bg-warm-card/90 backdrop-blur-xl border border-warm shadow-xl max-w-full overflow-x-auto no-scrollbar font-mono text-xs select-none"
      aria-label="Subsystem Navigator"
    >
      {/* Subsystem Preset Pills */}
      <div className="flex items-center gap-1">
        {PRESET_KEYS.map((key, index) => {
          const preset = subsystemPresets[key];
          const isActive = activeSubsystem === key;

          return (
            <button
              key={key}
              onClick={() => onSelectSubsystem(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? "bg-terracotta-500 text-sand-50 font-bold shadow-md shadow-terracotta-500/20"
                  : "text-warm-secondary hover:text-warm-primary hover:bg-warm-page/80"
              }`}
              title={`${preset.title}: ${preset.summary}`}
            >
              <span
                className={`text-[9px] px-1 py-0.2 rounded border ${
                  isActive
                    ? "border-sand-50/40 text-sand-50"
                    : "border-warm text-warm-secondary"
                }`}
              >
                {SHORTCUT_LABELS[index]}
              </span>
              <span className="text-[11px] uppercase tracking-wide">
                {preset.label.split("//")[1]?.trim() || preset.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="h-5 w-px bg-warm mx-1 flex-shrink-0" />

      {/* Camera Action Buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onToggleAutoRotate}
          className={`p-2 rounded-xl border transition-colors ${
            isAutoRotate
              ? "bg-terracotta-500/15 border-terracotta-500 text-terracotta-500"
              : "border-transparent text-warm-secondary hover:text-warm-primary hover:bg-warm-page/80"
          }`}
          title="Toggle Slow Orbital Rotation"
          aria-label="Toggle Auto Rotate"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? "animate-spin" : ""}`} />
        </button>

        <button
          onClick={onResetView}
          className="p-2 rounded-xl border border-transparent text-warm-secondary hover:text-warm-primary hover:bg-warm-page/80 transition-colors"
          title="Reset Camera to Global Overview (ESC)"
          aria-label="Reset View"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
};
