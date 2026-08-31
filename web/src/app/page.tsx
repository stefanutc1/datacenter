"use client";

import React, { useState } from "react";
import { HomelabCanvas } from "@/components/topology/HomelabCanvas";
import { TopologyHUD } from "@/components/topology/TopologyHUD";
import { NodeInspector } from "@/components/topology/NodeInspector";
import { HeaderNav } from "@/components/editorial/HeaderNav";
import { NarrativeLayer } from "@/components/editorial/NarrativeLayer";
import { BootTerminal } from "@/components/editorial/BootTerminal";
import { WikiModal } from "@/components/editorial/WikiModal";
import { SubsystemCategory, TopologyNode } from "@/data/infrastructure";

export default function HomelabPage() {
  const [hasBooted, setHasBooted] = useState(false);
  const [showBootTerminal, setShowBootTerminal] = useState(false);
  const [activeSubsystem, setActiveSubsystem] = useState<SubsystemCategory>("system");
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isWikiOpen, setIsWikiOpen] = useState(false);

  // Trigger boot on initial mount if not already booted
  const handleBootComplete = () => {
    setHasBooted(true);
    setShowBootTerminal(false);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-obsidian text-slate-100 bg-tech-grid flex flex-col">
      {/* 1. Cinematic Boot Sequence */}
      {(!hasBooted || showBootTerminal) && (
        <BootTerminal onComplete={handleBootComplete} />
      )}

      {/* 2. Top Header Navigation */}
      <HeaderNav
        onTriggerBoot={() => setShowBootTerminal(true)}
        onOpenWiki={() => setIsWikiOpen(true)}
      />

      {/* 3. Main Viewport: Living 3D Topology Canvas + Overlays */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Full Viewport 3D Canvas */}
        <HomelabCanvas
          activeSubsystem={activeSubsystem}
          selectedNode={selectedNode}
          onSelectNode={(node) => setSelectedNode(node)}
          isAutoRotate={isAutoRotate}
          onToggleAutoRotate={() => setIsAutoRotate((prev) => !prev)}
        />

        {/* Floating Top & Bottom HUD Controls */}
        <TopologyHUD
          activeSubsystem={activeSubsystem}
          onSelectSubsystem={(sub) => {
            setActiveSubsystem(sub);
            setSelectedNode(null);
          }}
          isAutoRotate={isAutoRotate}
          onToggleAutoRotate={() => setIsAutoRotate((prev) => !prev)}
          onResetCamera={() => {
            setActiveSubsystem("system");
            setSelectedNode(null);
          }}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
        />

        {/* Left Side Editorial Narrative Panel */}
        <div className="absolute top-20 left-4 bottom-24 hidden md:flex flex-col justify-start pointer-events-none z-10">
          <NarrativeLayer
            activeSubsystem={activeSubsystem}
            onSelectNode={(node) => setSelectedNode(node)}
            onSelectSubsystem={(sub) => setActiveSubsystem(sub)}
          />
        </div>

        {/* Right Side Slide-In Node Inspector */}
        <NodeInspector
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onSelectNode={(node) => setSelectedNode(node)}
        />
      </div>

      {/* 4. Architecture & Wiki Documentation Modal */}
      <WikiModal
        isOpen={isWikiOpen}
        onClose={() => setIsWikiOpen(false)}
      />
    </main>
  );
}
