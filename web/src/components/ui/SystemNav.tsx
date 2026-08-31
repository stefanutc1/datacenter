"use client";

import React from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { SystemStatus } from "@/components/infrastructure/SystemStatus";
import { SubsystemCategory } from "@/data/infrastructure";
import { SystemStateType } from "@/hooks/useSystemState";
import { Sun, Moon, Terminal, RefreshCw, Github } from "lucide-react";

interface SystemNavProps {
  systemState: SystemStateType;
  activeSubsystem: SubsystemCategory;
  selectedNodeName?: string;
  onOpenCommandPalette: () => void;
  onTriggerBoot: () => void;
}

export const SystemNav: React.FC<SystemNavProps> = ({
  systemState,
  activeSubsystem,
  selectedNodeName,
  onOpenCommandPalette,
  onTriggerBoot,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-warm-page/85 backdrop-blur-xl border-b border-warm font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Branding & Digital Twin Identifier */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="flex items-center gap-2.5 font-serif font-bold text-base text-warm-primary hover:text-terracotta-500 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500" />
            <span>HOMELAB</span>
            <span className="font-mono text-xs font-normal text-warm-secondary hidden sm:inline">
              // DIGITAL TWIN
            </span>
          </a>

          {/* Ambient State & Telemetry Indicator */}
          <div className="hidden lg:block border-l border-warm pl-4">
            <SystemStatus
              systemState={systemState}
              activeSubsystem={activeSubsystem}
              selectedNodeName={selectedNodeName}
              onOpenCommandPalette={onOpenCommandPalette}
            />
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Anchor Links */}
          <nav className="hidden md:flex items-center gap-4 font-mono text-xs text-warm-secondary mr-2">
            <a
              href="#topology"
              className="hover:text-warm-primary transition-colors"
            >
              TOPOLOGY
            </a>
            <a
              href="#hardware"
              className="hover:text-warm-primary transition-colors"
            >
              FLEET
            </a>
            <a
              href="#services"
              className="hover:text-warm-primary transition-colors"
            >
              SERVICES
            </a>
            <a
              href="#narrative"
              className="hover:text-warm-primary transition-colors"
            >
              BLUEPRINT
            </a>
          </nav>

          {/* Command Palette Button */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-warm-card border border-warm hover:border-terracotta-500 text-warm-secondary hover:text-warm-primary font-mono text-xs shadow-sm transition-all"
            title="Open Command Palette (⌘K or /)"
          >
            <Terminal className="w-3.5 h-3.5 text-terracotta-500" />
            <span className="hidden sm:inline">SEARCH</span>
            <kbd className="hidden sm:inline px-1 py-0.2 rounded bg-warm-page text-[10px] border border-warm">
              ⌘K
            </kbd>
          </button>

          {/* Simulated Reboot Trigger */}
          <button
            onClick={onTriggerBoot}
            className="p-2 rounded-xl bg-warm-card border border-warm hover:border-terracotta-500 text-warm-secondary hover:text-warm-primary transition-colors shadow-sm"
            title="Trigger Linux/Proxmox Boot Sequence"
            aria-label="Reboot Cluster Terminal"
          >
            <RefreshCw className="w-4 h-4" />
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

          {/* GitHub Source Link */}
          <a
            href="https://github.com/stefanutc1/homelab"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-warm-card border border-warm hover:border-terracotta-500 text-warm-secondary hover:text-warm-primary transition-colors shadow-sm"
            title="View GitHub Repository"
            aria-label="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
