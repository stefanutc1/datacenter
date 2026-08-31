"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { SystemNav } from "@/components/ui/SystemNav";
import { SubsystemDock } from "@/components/ui/SubsystemDock";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { NodeInspector } from "@/components/infrastructure/NodeInspector";
import { BootSequence } from "@/components/boot/BootSequence";
import { HardwareAtlas } from "@/components/sections/HardwareAtlas";
import { ServiceDirectory } from "@/components/sections/ServiceDirectory";
import { InfrastructureNarrative } from "@/components/sections/InfrastructureNarrative";
import {
  SubsystemCategory,
  TopologyNode,
  subsystemPresets,
} from "@/data/infrastructure";
import { useSystemState } from "@/hooks/useSystemState";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Compass, Sparkles, Terminal, Activity, ArrowDown } from "lucide-react";

// Dynamically import TopologyScene with SSR disabled for Three.js WebGL
const TopologyScene = dynamic(
  () =>
    import("@/components/topology/TopologyScene").then(
      (mod) => mod.TopologyScene
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-warm-page text-warm-secondary font-mono text-xs gap-3">
        <div className="w-6 h-6 border-2 border-terracotta-500 border-t-transparent rounded-full animate-spin" />
        <span>INITIALIZING SPATIAL SCENE GRAPH...</span>
      </div>
    ),
  }
);

export default function HomelabPage() {
  const [activeSubsystem, setActiveSubsystem] =
    useState<SubsystemCategory>("system");
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [showBootSequence, setShowBootSequence] = useState(false);

  const { state: systemState, setExploring, setInspecting, setOnline } =
    useSystemState("ONLINE");

  // Check if initial boot sequence should play (once per session)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasBooted = sessionStorage.getItem("homelab-booted");
      if (!hasBooted) {
        setShowBootSequence(true);
      }
    }
  }, []);

  const handleSelectSubsystem = (subsystem: SubsystemCategory) => {
    setActiveSubsystem(subsystem);
    setSelectedNode(null);
    setExploring();
  };

  const handleSelectNode = (node: TopologyNode | null) => {
    setSelectedNode(node);
    if (node) {
      setInspecting();
    } else {
      setOnline();
    }
  };

  const handleResetView = () => {
    setActiveSubsystem("system");
    setSelectedNode(null);
    setOnline();
  };

  const handleCloseOverlays = () => {
    if (selectedNode) {
      setSelectedNode(null);
      setOnline();
    } else if (isCommandPaletteOpen) {
      setIsCommandPaletteOpen(false);
    } else if (activeSubsystem !== "system") {
      setActiveSubsystem("system");
      setOnline();
    }
  };

  // Bind global keyboard shortcuts
  useKeyboardShortcuts({
    onSelectSubsystem: handleSelectSubsystem,
    onResetView: handleResetView,
    onOpenCommandPalette: () => setIsCommandPaletteOpen(true),
    onCloseOverlays: handleCloseOverlays,
    onToggleAutoRotate: () => setIsAutoRotate((prev) => !prev),
  });

  const currentPreset = subsystemPresets[activeSubsystem] || subsystemPresets.system;

  return (
    <div className="min-h-screen flex flex-col bg-warm-page text-warm-primary font-sans antialiased selection:bg-terracotta-500/20">
      {/* Cinematic Boot Terminal Modal */}
      {showBootSequence && (
        <BootSequence onComplete={() => setShowBootSequence(false)} />
      )}

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectNode={handleSelectNode}
        onSelectSubsystem={handleSelectSubsystem}
        onResetView={handleResetView}
      />

      {/* System Navigation Header */}
      <SystemNav
        systemState={systemState}
        activeSubsystem={activeSubsystem}
        selectedNodeName={selectedNode?.hostname || selectedNode?.name}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onTriggerBoot={() => setShowBootSequence(true)}
      />

      {/* 3D HOMELAB TOPOLOGY VIEWPORT (THE CENTRAL NERVOUS SYSTEM) */}
      <section
        id="topology"
        className="relative w-full h-[82vh] min-h-[640px] max-h-[920px] bg-warm-page border-b border-warm overflow-hidden flex flex-col"
        aria-label="3D Infrastructure Topology Digital Twin"
      >
        {/* 3D Scene Canvas */}
        <div className="w-full h-full relative">
          <TopologyScene
            activeSubsystem={activeSubsystem}
            selectedNode={selectedNode}
            onSelectNode={handleSelectNode}
            isAutoRotate={isAutoRotate}
            onToggleAutoRotate={() => setIsAutoRotate((prev) => !prev)}
          />

          {/* Top-Left Preset Title & Narrative Overlay */}
          <div className="absolute top-6 left-6 z-10 max-w-md pointer-events-none select-none space-y-1.5 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-warm-card/85 backdrop-blur-md border border-warm text-[10px] font-mono text-terracotta-500 font-bold uppercase tracking-widest shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 animate-ping" />
              {currentPreset.label}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-warm-primary leading-tight drop-shadow-sm">
              {currentPreset.title}
            </h1>
            <p className="text-xs text-warm-secondary leading-relaxed drop-shadow-sm font-sans hidden sm:block">
              {currentPreset.summary}
            </p>
          </div>

          {/* Bottom Subsystem Navigator Dock */}
          <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center px-4 pointer-events-auto">
            <SubsystemDock
              activeSubsystem={activeSubsystem}
              onSelectSubsystem={handleSelectSubsystem}
              isAutoRotate={isAutoRotate}
              onToggleAutoRotate={() => setIsAutoRotate((prev) => !prev)}
              onResetView={handleResetView}
            />
          </div>

          {/* Slide-over Node Inspector Drawer */}
          {selectedNode && (
            <NodeInspector
              node={selectedNode}
              onClose={() => handleSelectNode(null)}
              onSelectNode={handleSelectNode}
            />
          )}
        </div>
      </section>

      {/* BELOW-FOLD EDITORIAL & INFRASTRUCTURE CATALOGS */}
      <main className="flex-1 w-full bg-warm-grid">
        {/* Physical Compute Fleet */}
        <HardwareAtlas onFocusNode={handleSelectNode} />

        {/* 34 Services Matrix */}
        <ServiceDirectory onFocusNode={handleSelectNode} />

        {/* Architectural Blueprint & 6 Pillars */}
        <InfrastructureNarrative />
      </main>

      {/* Editorial Footer */}
      <footer className="w-full py-12 px-4 sm:px-6 lg:px-8 border-t border-warm bg-warm-page font-mono text-xs text-warm-secondary">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500" />
            <span className="font-serif font-bold text-warm-primary text-sm">
              HOMELAB DIGITAL TWIN
            </span>
            <span className="text-warm-secondary/50">|</span>
            <span>PROXMOX VE · K3S · ELO AI · OPNSENSE</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#topology"
              className="hover:text-warm-primary transition-colors flex items-center gap-1"
            >
              <span>BACK TO TOPOLOGY</span>
              <ArrowDown className="w-3.5 h-3.5 rotate-180" />
            </a>
            <a
              href="https://github.com/stefanutc1/homelab"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-warm-primary transition-colors underline"
            >
              GITHUB REPOSITORY
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
