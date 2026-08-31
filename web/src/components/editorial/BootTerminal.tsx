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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-sand-300 dark:border-espresso-700 shadow-2xl bg-sand-50 dark:bg-espresso-950 text-espresso-900 dark:text-sand-100 relative overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-sand-200 dark:border-espresso-800">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="code-font text-xs text-espresso-600 dark:text-sand-400 font-semibold ml-2">
              system_init.sh // homelab_core
            </span>
          </div>
          <button
            onClick={onComplete}
            className="text-xs code-font text-terracotta-600 dark:text-terracotta-400 hover:underline transition-colors flex items-center gap-1"
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
                <span className="text-terracotta-500 select-none">&gt;</span>
                <span className={isOk ? "text-espresso-900 dark:text-sand-100 font-semibold" : "text-espresso-600 dark:text-sand-400"}>
                  {log}
                </span>
              </div>
            );
          })}
          {!isFinished && (
            <div className="flex items-center gap-1.5 text-terracotta-500 animate-pulse mt-2">
              <span>_</span>
            </div>
          )}
        </div>

        {/* Progress status */}
        <div className="mt-6 pt-4 border-t border-sand-200 dark:border-espresso-800 flex items-center justify-between text-xs font-mono text-espresso-500 dark:text-sand-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-terracotta-500 animate-ping" />
            <span className="text-terracotta-600 dark:text-terracotta-400 font-semibold">INITIALIZING CLUSTER</span>
          </div>
          <span>STEFANUT HOMELAB DIGITAL TWIN</span>
        </div>
      </div>
    </div>
  );
};
