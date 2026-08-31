"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Shield, Cpu, Zap, CheckCircle2, ArrowRight } from "lucide-react";

interface BootTerminalProps {
  onComplete: () => void;
}

const bootLogs = [
  { text: "INITIALIZING KERNEL & PHYSICAL HARDWARE PROBES...", delay: 150 },
  { text: "NODE 1 (x86_64 Core · 192.168.1.132 · 8GB RAM · 512GB SSD) ............ [ONLINE]", delay: 350 },
  { text: "NODE 2 (OMV ZFS NAS · 192.168.1.135 · 2GB RAM · 500GB HDD) ............ [ONLINE]", delay: 550 },
  { text: "NODE 3 (ARM64 Apple M1 · 192.168.64.14 · 4GB Dedicated RAM) ........... [ONLINE]", delay: 750 },
  { text: "NODE 4 (k8s-node-04 · 192.168.1.18 · Athlon II X2) ................... [ONLINE]", delay: 950 },
  { text: "ESTABLISHING ZERO-TRUST NETWORK (VLAN 10/20/30/50 + WIREGUARD MESH) .. [SECURE]", delay: 1150 },
  { text: "ENGAGING ELO AI LAYER (GEMINI 2.5 + GROQ LPU + LOCAL OLLAMA MPS) ...... [ACTIVE]", delay: 1400 },
  { text: "PROBING 33 PRODUCTION MICROSERVICES & KVM VMS ........................ [ALL 33 UP]", delay: 1650 },
  { text: "DIGITAL TWIN TOPOLOGY READY.", delay: 1850 },
];

export const BootTerminal: React.FC<BootTerminalProps> = ({ onComplete }) => {
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    bootLogs.forEach((log, index) => {
      const t = setTimeout(() => {
        setDisplayedLogs((prev) => [...prev, log.text]);
        if (index === bootLogs.length - 1) {
          setIsFinished(true);
          const finishTimeout = setTimeout(() => {
            onComplete();
          }, 600);
          timeouts.push(finishTimeout);
        }
      }, log.delay);
      timeouts.push(t);
    });

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-obsidian flex items-center justify-center p-4 selection:bg-cyan-500/30">
      <div className="w-full max-w-2xl glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl backdrop-blur-3xl bg-black/90 scanline relative overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="code-font text-xs text-slate-400 font-semibold ml-2">
              system_init.sh // homelab_core
            </span>
          </div>
          <button
            onClick={onComplete}
            className="text-xs code-font text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <span>SKIP_BOOT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Terminal Logs Output */}
        <div className="space-y-2 font-mono text-xs sm:text-sm min-h-[220px]">
          {displayedLogs.map((log, idx) => {
            const isOk = log.includes("[ONLINE]") || log.includes("[SECURE]") || log.includes("[ACTIVE]") || log.includes("[ALL 33 UP]") || log.includes("READY");
            return (
              <div key={idx} className="flex items-start gap-2 leading-relaxed animate-in fade-in duration-200">
                <span className="text-cyan-500 select-none">&gt;</span>
                <span className={isOk ? "text-slate-200" : "text-slate-400"}>
                  {log}
                </span>
              </div>
            );
          })}
          {!isFinished && (
            <div className="flex items-center gap-1.5 text-cyan-400 animate-pulse mt-2">
              <span>_</span>
            </div>
          )}
        </div>

        {/* Progress status */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-cyan-400 font-semibold">BOOTING DIGITAL TWIN</span>
          </div>
          <span>AUTONOMOUS INFRASTRUCTURE LAYER</span>
        </div>
      </div>
    </div>
  );
};
