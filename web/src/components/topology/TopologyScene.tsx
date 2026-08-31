"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  topologyNodes,
  topologyEdges,
  subsystemPresets,
  TopologyNode as ITopologyNode,
  SubsystemCategory,
} from "@/data/infrastructure";
import { TopologyNode } from "./TopologyNode";
import { TopologyEdge } from "./TopologyEdge";
import { TopologyGrid } from "./TopologyGrid";
import { TopologyCamera } from "./TopologyCamera";
import { TopologyFallback } from "./TopologyFallback";
import { useTheme } from "@/components/theme/ThemeProvider";

interface TopologySceneProps {
  activeSubsystem: SubsystemCategory;
  selectedNode: ITopologyNode | null;
  onSelectNode: (node: ITopologyNode | null) => void;
  isAutoRotate?: boolean;
  onToggleAutoRotate?: () => void;
}

export const TopologyScene: React.FC<TopologySceneProps> = ({
  activeSubsystem,
  selectedNode,
  onSelectNode,
  isAutoRotate = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  // Check WebGL availability on mount
  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }, []);

  const currentPreset = useMemo(() => {
    return subsystemPresets[activeSubsystem] || subsystemPresets.system;
  }, [activeSubsystem]);

  const highlightedNodeIds = useMemo(() => {
    return new Set(currentPreset.highlightedNodes || []);
  }, [currentPreset]);

  // Create node lookup map for quick edge rendering
  const nodeMap = useMemo(() => {
    const map = new Map<string, ITopologyNode>();
    topologyNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-warm-page text-warm-secondary font-mono text-xs">
        INITIALIZING SPATIAL SCENE GRAPH...
      </div>
    );
  }

  if (!webglSupported) {
    return (
      <TopologyFallback
        nodes={topologyNodes}
        edges={topologyEdges}
        selectedNode={selectedNode}
        activeSubsystem={activeSubsystem}
        onSelectNode={onSelectNode}
      />
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-warm-page select-none">
      <Canvas
        camera={{ position: [0, 14, 38], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onPointerMissed={() => onSelectNode(null)}
      >
        <color attach="background" args={[isDark ? "#151210" : "#FAF7F2"]} />
        <fog attach="fog" args={[isDark ? "#151210" : "#FAF7F2", 25, 75]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={isDark ? 0.9 : 1.3} />
        <directionalLight
          position={[15, 25, 20]}
          intensity={isDark ? 1.1 : 1.6}
          color="#FAF7F2"
        />
        <pointLight
          position={[-15, -10, -10]}
          intensity={isDark ? 0.5 : 0.7}
          color="#D97757"
        />

        <Suspense fallback={null}>
          {/* Ground Coordinate Plane Grid */}
          <TopologyGrid positionY={-22} size={65} divisions={32} />

          {/* 3D Network Edges */}
          <group>
            {topologyEdges.map((edge, idx) => {
              const fromNode = nodeMap.get(edge.from);
              const toNode = nodeMap.get(edge.to);
              if (!fromNode || !toNode) return null;

              const isEdgeHighlighted =
                highlightedNodeIds.has(edge.from) &&
                highlightedNodeIds.has(edge.to);

              return (
                <TopologyEdge
                  key={`edge-${edge.from}-${edge.to}-${idx}`}
                  edge={edge}
                  fromNode={fromNode}
                  toNode={toNode}
                  isHighlighted={isEdgeHighlighted}
                  isAnyHighlighted={activeSubsystem !== "system"}
                />
              );
            })}
          </group>

          {/* 3D Topology Nodes */}
          <group>
            {topologyNodes.map((node) => {
              const isNodeHighlighted = highlightedNodeIds.has(node.id);
              const isSelected = selectedNode?.id === node.id;

              return (
                <TopologyNode
                  key={node.id}
                  node={node}
                  isSelected={isSelected}
                  isHighlighted={isNodeHighlighted}
                  isAnyHighlighted={activeSubsystem !== "system"}
                  onSelect={onSelectNode}
                />
              );
            })}
          </group>

          {/* Camera Controller */}
          <TopologyCamera
            currentPreset={currentPreset}
            selectedNode={selectedNode}
            autoRotate={isAutoRotate}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
