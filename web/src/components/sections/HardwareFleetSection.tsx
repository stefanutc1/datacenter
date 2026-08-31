"use client";

import React from "react";
import { hardwareNodes } from "@/data/hardware";
import { Server, Cpu, HardDrive, Zap, Shield, CheckCircle2, AlertTriangle } from "lucide-react";

export const HardwareFleetSection: React.FC = () => {
  return (
    <section id="hardware" className="py-16 sm:py-24 border-b border-sand-300 dark:border-espresso-800 bg-sand-50 dark:bg-espresso-950/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-terracotta-600 dark:text-terracotta-400 font-semibold">
            <Server className="w-4 h-4" />
            <span>Physical &amp; Virtual Compute Nodes</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-espresso-900 dark:text-sand-100 tracking-tight">
            Heterogeneous Hardware Fleet
          </h2>
          <p className="text-sm sm:text-base text-espresso-600 dark:text-sand-300 leading-relaxed font-sans">
            A distributed multi-architecture topology spanning x86_64, ARM64 Apple Silicon, dedicated ZFS storage appliances, 
            and container workers designed for low power consumption and high uptime.
          </p>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hardwareNodes.map((node) => (
            <div
              key={node.id}
              className="rounded-3xl p-6 sm:p-7 warm-card flex flex-col justify-between space-y-6"
            >
              {/* Node Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="code-font text-xs font-semibold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-wider">
                      {node.role}
                    </span>
                    <h3 className="font-editorial text-2xl font-bold text-espresso-900 dark:text-sand-100 mt-0.5">
                      {node.displayName}
                    </h3>
                  </div>

                  <span
                    className="w-3 h-3 rounded-full mt-2 flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: node.badgeColor }}
                    title={`Status: Online (${node.name})`}
                  />
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-mono text-espresso-600 dark:text-sand-400">
                  <span className="px-2 py-0.5 rounded-md bg-sand-200/80 dark:bg-espresso-800 border border-sand-300 dark:border-espresso-700">
                    {node.os}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-sand-200/80 dark:bg-espresso-800 border border-sand-300 dark:border-espresso-700">
                    {node.virtualization}
                  </span>
                </div>
              </div>

              {/* Specs Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-sand-200 dark:border-espresso-800 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-espresso-500 dark:text-sand-400 font-mono">
                    <Cpu className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>Processor</span>
                  </div>
                  <div className="font-semibold text-espresso-900 dark:text-sand-100 truncate" title={node.specs.cpu || node.specs.machine}>
                    {node.specs.cpu || node.specs.machine}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-espresso-500 dark:text-sand-400 font-mono">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Memory</span>
                  </div>
                  <div className="font-semibold text-espresso-900 dark:text-sand-100">
                    {node.specs.ram}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-espresso-500 dark:text-sand-400 font-mono">
                    <HardDrive className="w-3.5 h-3.5 text-purple-500" />
                    <span>Storage</span>
                  </div>
                  <div className="font-semibold text-espresso-900 dark:text-sand-100">
                    {node.specs.storage}
                  </div>
                </div>
              </div>

              {/* Workloads & Capacity */}
              <div className="space-y-3 pt-4 border-t border-sand-200 dark:border-espresso-800">
                <div className="text-xs font-mono uppercase tracking-wider text-espresso-500 dark:text-sand-400 font-semibold">
                  Active Workloads
                </div>
                <ul className="space-y-1.5">
                  {node.workloads.map((w, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-espresso-700 dark:text-sand-300 font-sans"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-terracotta-500 mt-0.5 flex-shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
