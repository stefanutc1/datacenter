"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Shield, Check, ArrowRight } from "lucide-react";

interface BootSequenceProps {
  onComplete: () => void;
}

interface BootLine {
  text: string;
  delayMs: number;
  status?: string;
  color?: string;
}

const BOOT_SCRIPT: BootLine[] = [
  { text: "BIOS DATE 08/31/2026 15:46:00 VER: PVE-CORE-9.2", delayMs: 80 },
  { text: "CPU 0: INTEL CORE i3-10100F @ 4.30GHz (4C/8T) ... OK", delayMs: 140 },
  { text: "CPU 1: APPLE M1 (8-CORE AARCH64) ATTACHED VIA UTM ... OK", delayMs: 200 },
  { text: "MEMORY: 8192 MB DDR4 + 8192 MB UNIFIED MEMORY ... OK", delayMs: 260 },
  { text: "MOUNTING ZFS STORAGE APPLIANCE (OMV-02 @ 192.168.1.135) ... OK", delayMs: 340 },
  { text: "INITIALIZING HOMELAB NETWORK ................................. OK", delayMs: 440, status: "OK", color: "#10b981" },
  { text: "FIREWALL & NAT ROUTER (OPNSENSE VM-200) ....................... OK", delayMs: 540, status: "OK", color: "#10b981" },
  { text: "COMPUTE & DUAL HYPERVISORS (PROXMOX x86 + ARM64) .............. OK", delayMs: 640, status: "OK", color: "#10b981" },
  { text: "KUBERNETES CLUSTER (K3S AGENT @ K8S-04) ...................... OK", delayMs: 740, status: "OK", color: "#10b981" },
  { text: "ZERO-TRUST PERIMETER (WAZUH XDR + SURICATA IPS) ............... OK", delayMs: 840, status: "OK", color: "#10b981" },
  { text: "OBSERVABILITY ENGINE (PROMETHEUS / GRAFANA / LOKI) ........... OK", delayMs: 940, status: "OK", color: "#10b981" },
  { text: "CONTAINERIZED MICROSERVICES (31 RUNNING SERVICES) ............ OK", delayMs: 1040, status: "OK", color: "#10b981" },
  { text: "ELO AUTONOMOUS AI CONTROL PLANE (GEMINI / GROQ / OLLAMA) ...... OK", delayMs: 1160, status: "OK", color: "#c084fc" },
  { text: "EDGE SENSORS & RELAYS (ESP32 MMWAVE + SOLENOIDS) .............. OK", delayMs: 1280, status: "OK", color: "#10b981" },
  { text: "ALL INFRASTRUCTURE SUBSYSTEMS NOMINAL. SYSTEM ONLINE.", delayMs: 1400, status: "ONLINE", color: "#D97757" },
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [displayedLines, setDisplayedLines] = useState<BootLine[]>([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    BOOT_SCRIPT.forEach((line) => {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, line]);
      }, line.delayMs);
      timers.push(timer);
    });

    const completionTimer = setTimeout(() => {
      setIsDone(true);
    }, 1700);
    timers.push(completionTimer);

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleFinish = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("homelab-booted", "true");
    }
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/95 backdrop-blur-xl font-mono text-xs select-none">
      <div className="w-full max-w-2xl bg-espresso-900 border border-espresso-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-espresso-950 border-b border-espresso-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sand-300 font-bold">
            <Terminal className="w-4 h-4 text-terracotta-500" />
            <span>HOMELAB // CLUSTER BOOT SEQUENCE</span>
          </div>

          <button
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-espresso-800 hover:bg-espresso-700 text-sand-300 hover:text-white border border-espresso-700 transition-colors"
          >
            <span>SKIP BOOT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stdout Console Lines */}
        <div className="p-6 space-y-1.5 min-h-[320px] max-h-[440px] overflow-y-auto font-mono text-[11px] leading-relaxed text-sand-200">
          {displayedLines.map((line, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4">
              <span style={{ color: line.color || "#C9BFB5" }}>
                {">"} {line.text}
              </span>
              {line.status && (
                <span
                  className="font-bold px-1.5 py-0.2 rounded bg-espresso-950 border border-espresso-800"
                  style={{ color: line.color || "#10b981" }}
                >
                  [{line.status}]
                </span>
              )}
            </div>
          ))}

          {!isDone && (
            <div className="inline-block w-2 h-4 bg-terracotta-500 animate-pulse ml-1" />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-espresso-950 border-t border-espresso-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sand-400 text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>INITIALIZING 3D DIGITAL TWIN MESH GRAPH...</span>
          </div>

          {isDone && (
            <button
              onClick={handleFinish}
              className="px-4 py-1.5 rounded-lg bg-terracotta-500 hover:bg-terracotta-400 text-sand-50 font-bold transition-all shadow-md shadow-terracotta-500/20"
            >
              ENTER DIGITAL TWIN →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
