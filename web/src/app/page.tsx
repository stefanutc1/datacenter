"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { SystemHeader } from "@/components/ui/SystemHeader";
import { InfrastructureSidebar } from "@/components/infrastructure/InfrastructureSidebar";
import { SubsystemDock } from "@/components/ui/SubsystemDock";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { EnterpriseInspector } from "@/components/infrastructure/EnterpriseInspector";
import { HardwareAtlas } from "@/components/sections/HardwareAtlas";
import { ServiceDirectory } from "@/components/sections/ServiceDirectory";
import { InfrastructureNarrative } from "@/components/sections/InfrastructureNarrative";
import { ArchitectureBlueprint } from "@/components/sections/ArchitectureBlueprint";
import {
  SubsystemCategory,
  TopologyNode,
  subsystemPresets,
} from "@/data/infrastructure";
import { useSystemState } from "@/hooks/useSystemState";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { ArrowDown } from "lucide-react";

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"3d" | "blueprint">("3d");
  const [topologyPerspective, setTopologyPerspective] = useState<
    "logical" | "physical"
  >("logical");

  const { state: systemState, setExploring, setInspecting, setOnline } =
    useSystemState("ONLINE");

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

  const currentPreset =
    subsystemPresets[activeSubsystem] || subsystemPresets.system;

  return (
    <div className="min-h-screen flex flex-col bg-warm-page text-warm-primary font-sans antialiased selection:bg-terracotta-500/20">
      {/* Command Palette (⌘K or /) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectNode={handleSelectNode}
        onSelectSubsystem={handleSelectSubsystem}
        onResetView={handleResetView}
      />

      {/* Enterprise Top Header */}
      <SystemHeader
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        topologyPerspective={topologyPerspective}
        onToggleTopologyPerspective={setTopologyPerspective}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* PRIMARY VIEWPORT: SPATIAL INFRASTRUCTURE CONTROL MAP */}
      <section
        id="topology"
        className="relative w-full h-[calc(100vh-3.5rem)] min-h-[640px] max-h-[960px] bg-warm-page border-b border-warm overflow-hidden flex"
        aria-label="Enterprise Infrastructure Map"
      >
        {/* Left-Hand Infrastructure & Service Index Sidebar */}
        <InfrastructureSidebar
          activeSubsystem={activeSubsystem}
          selectedNode={selectedNode}
          onSelectSubsystem={handleSelectSubsystem}
          onSelectNode={handleSelectNode}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Center Canvas: 3D Topology OR Architecture Blueprint */}
        <div className="flex-1 h-full relative overflow-hidden flex flex-col">
          {viewMode === "3d" ? (
            <>
              <TopologyScene
                activeSubsystem={activeSubsystem}
                selectedNode={selectedNode}
                onSelectNode={handleSelectNode}
                isAutoRotate={isAutoRotate}
                onToggleAutoRotate={() => setIsAutoRotate((prev) => !prev)}
                perspective={topologyPerspective}
              />

              {/* Subsystem Identifier Watermark */}
              <div className="absolute top-5 left-5 z-10 pointer-events-none select-none space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-warm-card/90 backdrop-blur-md border border-warm text-[10px] font-mono text-terracotta-500 font-bold uppercase tracking-widest shadow-sm">
                  <span>{currentPreset.label}</span>
                  <span className="text-warm-secondary/40">·</span>
                  <span className="text-warm-secondary">
                    {topologyPerspective.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-warm-primary leading-tight drop-shadow-sm">
                  {currentPreset.title}
                </h1>
              </div>

              {/* Bottom Subsystem Navigator Dock */}
              <div className="absolute bottom-5 inset-x-0 z-20 flex items-center justify-center px-4 pointer-events-auto">
                <SubsystemDock
                  activeSubsystem={activeSubsystem}
                  onSelectSubsystem={handleSelectSubsystem}
                  isAutoRotate={isAutoRotate}
                  onToggleAutoRotate={() => setIsAutoRotate((prev) => !prev)}
                  onResetView={handleResetView}
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full overflow-y-auto">
              <ArchitectureBlueprint />
            </div>
          )}

          {/* Slide-in Enterprise Inspector */}
          {selectedNode && (
            <EnterpriseInspector
              node={selectedNode}
              onClose={() => handleSelectNode(null)}
              onSelectNode={handleSelectNode}
            />
          )}
        </div>
      </section>

      {/* BELOW-FOLD ENTERPRISE CATALOGS & DEEP ARCHITECTURE */}
      <main className="flex-1 w-full bg-warm-grid">
        {/* Complete 34 Microservices Catalog */}
        <ServiceDirectory onFocusNode={handleSelectNode} />

        {/* Heterogeneous Compute Hardware Fleet */}
        <HardwareAtlas onFocusNode={handleSelectNode} />

        {/* 6 Subsystem Engineering Pillars */}
        <InfrastructureNarrative />
      </main>

      {/* Enterprise Technical Footer */}
      <footer className="w-full py-10 px-4 sm:px-6 lg:px-8 border-t border-warm bg-warm-page font-mono text-xs text-warm-secondary">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-terracotta-500" />
            <span className="font-serif font-bold text-warm-primary text-sm">
              HOMELAB DIGITAL TWIN
            </span>
            <span className="text-warm-secondary/50">|</span>
            <span>PROXMOX VE · WIREGUARD · WAZUH XDR · K3S · ELO</span>
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
