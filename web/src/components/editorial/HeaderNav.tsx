"use client";

import React from "react";
import { Terminal, Github, Activity, ShieldCheck, Zap, Layers } from "lucide-react";

interface HeaderNavProps {
  onTriggerBoot: () => void;
  onOpenWiki: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onTriggerBoot, onOpenWiki }) => {
  return (
    <header className="w-full border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between bg-obsidian/80 backdrop-blur-xl z-20 relative select-none">
      {/* Brand & Editorial Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-950/50">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>HOMELAB</span>
              <span className="text-slate-500 font-mono">//</span>
              <span className="code-font font-medium text-cyan-400 text-xs">DIGITAL_TWIN</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              x86_64 Core + ARM64 Hypervisors • Autonomous AI Layer
            </p>
          </div>
        </div>

        {/* Live Cluster Health Pulse */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">HEALTHY</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 text-[11px]">33 Workloads Online</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 text-[11px]">WireGuard Mesh Active</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onTriggerBoot}
          title="Re-run Kernel & Probing Initialization"
          className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-cyan-300 hover:bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center gap-1.5"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">BOOT_LOG</span>
        </button>

        <button
          onClick={onOpenWiki}
          title="Open Architecture & Wiki Documentation"
          className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-purple-300 hover:bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all flex items-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">WIKI_DOCS</span>
        </button>

        <a
          href="https://github.com/stefanutc1/homelab"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-mono text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5"
        >
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline">GITHUB</span>
        </a>
      </div>
    </header>
  );
};
