"use client";

import React from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { SubsystemCategory, topologyNodes } from "@/data/infrastructure";
import { services } from "@/data/services";
import {
  Sun,
  Moon,
  Search,
  Layers,
  Server,
  Globe,
  Github,
  Cpu,
} from "lucide-react";

interface SystemHeaderProps {
  viewMode: "3d" | "blueprint";
  onToggleViewMode: (mode: "3d" | "blueprint") => void;
  topologyPerspective: "logical" | "physical";
  onToggleTopologyPerspective: (perspective: "logical" | "physical") => void;
  onOpenCommandPalette: () => void;
}

export const SystemHeader: React.FC<SystemHeaderProps> = ({
  viewMode,
  onToggleViewMode,
  topologyPerspective,
  onToggleTopologyPerspective,
  onOpenCommandPalette,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-warm-page/90 backdrop-blur-xl border-b border-warm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Branding & Core Counts */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="flex items-center gap-2.5 font-serif font-bold text-base text-warm-primary hover:text-terracotta-500 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500" />
            <span>HOMELAB</span>
            <span className="font-mono text-xs font-normal text-warm-secondary hidden sm:inline">
              // INFRASTRUCTURE DIGITAL TWIN
            </span>
          </a>

          {/* Real Metrics Badges */}
          <div className="hidden lg:flex items-center gap-2 border-l border-warm pl-4 font-mono text-[11px] text-warm-secondary">
            <span className="px-2 py-0.5 rounded bg-warm-card border border-warm">
              <strong className="text-warm-primary">{topologyNodes.length}</strong> NODES
            </span>
            <span className="px-2 py-0.5 rounded bg-warm-card border border-warm">
              <strong className="text-warm-primary">{services.length}</strong> SERVICES
            </span>
            <span className="px-2 py-0.5 rounded bg-warm-card border border-warm">
              <strong className="text-warm-primary">2</strong> HYPERVISORS
            </span>
          </div>
        </div>

        {/* Center/Right: View Modes & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logical vs Physical Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-warm-card border border-warm font-mono text-[11px]">
            <button
              onClick={() => onToggleTopologyPerspective("logical")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                topologyPerspective === "logical"
                  ? "bg-terracotta-500 text-sand-50 font-bold"
                  : "text-warm-secondary hover:text-warm-primary"
              }`}
            >
              LOGICAL
            </button>
            <button
              onClick={() => onToggleTopologyPerspective("physical")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                topologyPerspective === "physical"
                  ? "bg-terracotta-500 text-sand-50 font-bold"
                  : "text-warm-secondary hover:text-warm-primary"
              }`}
            >
              PHYSICAL
            </button>
          </div>

          {/* 3D vs Blueprint Toggle */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-warm-card border border-warm font-mono text-[11px]">
            <button
              onClick={() => onToggleViewMode("3d")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === "3d"
                  ? "bg-terracotta-500 text-sand-50 font-bold"
                  : "text-warm-secondary hover:text-warm-primary"
              }`}
            >
              3D TOPOLOGY
            </button>
            <button
              onClick={() => onToggleViewMode("blueprint")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === "blueprint"
                  ? "bg-terracotta-500 text-sand-50 font-bold"
                  : "text-warm-secondary hover:text-warm-primary"
              }`}
            >
              BLUEPRINT
            </button>
          </div>

          {/* Quick Search Shortcut */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-warm-card border border-warm hover:border-terracotta-500 text-warm-secondary hover:text-warm-primary font-mono text-xs shadow-sm transition-all"
            title="Search nodes and services (⌘K or /)"
          >
            <Search className="w-3.5 h-3.5 text-terracotta-500" />
            <span className="hidden md:inline">SEARCH</span>
            <kbd className="hidden md:inline px-1 py-0.2 rounded bg-warm-page text-[10px] border border-warm">
              ⌘K
            </kbd>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-warm-card border border-warm hover:border-terracotta-500 text-warm-secondary hover:text-warm-primary transition-colors shadow-sm"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-espresso-700" />
            )}
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/stefanutc1/homelab"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-warm-card border border-warm hover:border-terracotta-500 text-warm-secondary hover:text-warm-primary transition-colors shadow-sm"
            title="GitHub Repository"
            aria-label="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
