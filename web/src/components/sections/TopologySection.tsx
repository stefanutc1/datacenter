"use client";

import React, { useState } from "react";
import { HomelabCanvas } from "@/components/topology/HomelabCanvas";
import { TopologyHUD } from "@/components/topology/TopologyHUD";
import { NodeInspector } from "@/components/topology/NodeInspector";
import { NarrativeLayer } from "@/components/editorial/NarrativeLayer";
import { SubsystemCategory, TopologyNode } from "@/data/infrastructure";
import { Compass, Maximize2, Layers } from "lucide-react";

export const TopologySection: React.FC = () => {
  const [activeSubsystem, setActiveSubsystem] = useState<SubsystemCategory>("system");
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  return (
    <section id="topology" className="relative py-16 sm:py-24 border-b border-sand-300 dark:border-espresso-800 bg-sand-100 dark:bg-espresso-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-terracotta-600 dark:text-terracotta-400 font-semibold">
            <Layers className="w-4 h-4" />
            <span>Interactive Spatial Architecture</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-espresso-900 dark:text-sand-100 tracking-tight">
            3D Homelab Digital Twin &amp; Traffic Mesh
          </h2>
          <p className="text-sm sm:text-base text-espresso-600 dark:text-sand-300 leading-relaxed font-sans">
            A live, 3D coordinate projection of the entire multi-tier cluster. Drag to orbit the scene, 
            click any node to inspect hardware allocation metrics and container configurations, or switch 
            subsystems below to isolate specific network planes.
          </p>
        </div>

        {/* 3D Canvas Viewport Frame */}
        <div className="relative w-full h-[620px] lg:h-[720px] rounded-3xl overflow-hidden border border-sand-300 dark:border-espresso-700/80 shadow-2xl bg-sand-50 dark:bg-espresso-900 bg-warm-grid">
          {/* Main 3D Canvas */}
          <HomelabCanvas
            activeSubsystem={activeSubsystem}
            selectedNode={selectedNode}
            onSelectNode={(node) => setSelectedNode(node)}
            isAutoRotate={isAutoRotate}
            onToggleAutoRotate={() => setIsAutoRotate((prev) => !prev)}
          />

          {/* Floating Controls HUD */}
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

          {/* Left Narrative Panel */}
          <div className="absolute top-20 left-4 bottom-24 hidden lg:flex flex-col justify-start pointer-events-none z-10">
            <NarrativeLayer
              activeSubsystem={activeSubsystem}
              onSelectNode={(node) => setSelectedNode(node)}
              onSelectSubsystem={(sub) => setActiveSubsystem(sub)}
            />
          </div>

          {/* Node Inspector Drawer */}
          <NodeInspector
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onSelectNode={(node) => setSelectedNode(node)}
          />
        </div>
      </div>
    </section>
  );
};
