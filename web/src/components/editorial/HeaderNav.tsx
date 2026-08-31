"use client";

import React from "react";
import { Terminal, Github, ShieldCheck, Sun, Moon, Layers, Server, Box, Cpu } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface HeaderNavProps {
  onTriggerBoot: () => void;
  onOpenWiki: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onTriggerBoot, onOpenWiki }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sand-300 dark:border-espresso-700/60 bg-sand-100/90 dark:bg-espresso-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-6">
          <a href="#overview" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-terracotta-500 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-editorial text-lg font-bold text-espresso-900 dark:text-sand-100 tracking-tight">
                Stefanut Homelab
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono text-terracotta-600 dark:text-terracotta-400 bg-terracotta-100 dark:bg-terracotta-900/40 px-2 py-0.5 rounded-full border border-terracotta-200 dark:border-terracotta-800">
                v3.2 Next.js
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-mono">
            <a
              href="#overview"
              className="px-3 py-1.5 rounded-md text-espresso-600 dark:text-sand-300 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-sand-200/60 dark:hover:bg-espresso-800/60 transition-colors"
            >
              Overview
            </a>
            <a
              href="#topology"
              className="px-3 py-1.5 rounded-md text-espresso-600 dark:text-sand-300 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-sand-200/60 dark:hover:bg-espresso-800/60 transition-colors"
            >
              3D Digital Twin
            </a>
            <a
              href="#hardware"
              className="px-3 py-1.5 rounded-md text-espresso-600 dark:text-sand-300 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-sand-200/60 dark:hover:bg-espresso-800/60 transition-colors"
            >
              Hardware Fleet
            </a>
            <a
              href="#services"
              className="px-3 py-1.5 rounded-md text-espresso-600 dark:text-sand-300 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-sand-200/60 dark:hover:bg-espresso-800/60 transition-colors"
            >
              Services (33)
            </a>
            <a
              href="#architecture"
              className="px-3 py-1.5 rounded-md text-espresso-600 dark:text-sand-300 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-sand-200/60 dark:hover:bg-espresso-800/60 transition-colors"
            >
              Architecture
            </a>
          </nav>
        </div>

        {/* Right: Theme Toggle & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Light / Dark Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-espresso-600 dark:text-sand-300 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-sand-200/60 dark:hover:bg-espresso-800/60 border border-sand-300 dark:border-espresso-700/60 transition-all"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-ember" />
            ) : (
              <Moon className="w-4 h-4 text-espresso-700" />
            )}
          </button>

          <button
            onClick={onOpenWiki}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-espresso-700 dark:text-sand-200 bg-sand-200/70 dark:bg-espresso-800 border border-sand-300 dark:border-espresso-700 hover:border-terracotta-500/50 transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-terracotta-500" />
            <span className="hidden sm:inline">Docs & Runbooks</span>
          </button>

          <button
            onClick={onTriggerBoot}
            className="p-2 rounded-lg text-xs font-mono text-espresso-600 dark:text-sand-400 hover:text-espresso-900 dark:hover:text-sand-100 hover:bg-sand-200/50 dark:hover:bg-espresso-800/50 transition-all"
            title="Re-run Boot Sequence"
          >
            <Terminal className="w-4 h-4" />
          </button>

          <a
            href="https://github.com/stefanutc1/homelab"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-espresso-600 dark:text-sand-300 hover:text-espresso-900 dark:hover:text-sand-100 hover:bg-sand-200/60 dark:hover:bg-espresso-800/60 transition-all"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
