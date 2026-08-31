"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  TopologyNode,
  topologyNodes,
  topologyEdges,
  SubsystemCategory,
  subsystemPresets,
} from "@/data/infrastructure";
import { projectPoint3D, lerp, distance2D } from "@/lib/math3d";

interface HomelabCanvasProps {
  activeSubsystem: SubsystemCategory;
  selectedNode: TopologyNode | null;
  onSelectNode: (node: TopologyNode | null) => void;
  isAutoRotate: boolean;
  onToggleAutoRotate: () => void;
}

export const HomelabCanvas: React.FC<HomelabCanvasProps> = ({
  activeSubsystem,
  selectedNode,
  onSelectNode,
  isAutoRotate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Camera state
  const cameraRef = useRef({
    angleX: 0.35,
    angleY: 0.55,
    zoom: 1.0,
    panX: 0,
    panY: 0,
    targetAngleX: 0.35,
    targetAngleY: 0.55,
    targetZoom: 1.0,
    targetPanX: 0,
    targetPanY: 0,
  });

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Update target camera based on subsystem or selected node
  useEffect(() => {
    if (selectedNode) {
      const preset = subsystemPresets[selectedNode.category] || subsystemPresets.system;
      cameraRef.current.targetZoom = 1.35;
      cameraRef.current.targetPanX = -selectedNode.position.x * 0.4;
      cameraRef.current.targetPanY = -selectedNode.position.y * 0.4;
      cameraRef.current.targetAngleX = 0.3;
      cameraRef.current.targetAngleY = preset.camera.angleY;
    } else {
      const preset = subsystemPresets[activeSubsystem] || subsystemPresets.system;
      cameraRef.current.targetAngleX = preset.camera.angleX;
      cameraRef.current.targetAngleY = preset.camera.angleY;
      cameraRef.current.targetZoom = preset.camera.zoom;
      cameraRef.current.targetPanX = preset.camera.panX;
      cameraRef.current.targetPanY = preset.camera.panY;
    }
  }, [activeSubsystem, selectedNode]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let packetTimer = 0;

    const render = () => {
      packetTimer += 0.015;
      const width = canvas.width;
      const height = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      const cx = width / (2 * dpr);
      const cy = height / (2 * dpr);

      // Smooth camera interpolation towards target
      const cam = cameraRef.current;
      cam.angleX = lerp(cam.angleX, cam.targetAngleX, 0.06);
      cam.angleY = lerp(cam.angleY, cam.targetAngleY, 0.06);
      cam.zoom = lerp(cam.zoom, cam.targetZoom, 0.06);
      cam.panX = lerp(cam.panX, cam.targetPanX, 0.06);
      cam.panY = lerp(cam.panY, cam.targetPanY, 0.06);

      if (isAutoRotate && !isDraggingRef.current && !selectedNode) {
        cam.targetAngleY += 0.0018;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cx * 2, cy * 2);

      // 1. Draw Coordinate Grid Floor
      const gridY = 220;
      ctx.strokeStyle = "rgba(0, 229, 255, 0.035)";
      ctx.lineWidth = 1;
      for (let gx = -350; gx <= 350; gx += 70) {
        const p1 = projectPoint3D({ x: gx, y: gridY, z: -350 }, cx, cy, cam.angleX, cam.angleY, cam.zoom, cam.panX, cam.panY);
        const p2 = projectPoint3D({ x: gx, y: gridY, z: 350 }, cx, cy, cam.angleX, cam.angleY, cam.zoom, cam.panX, cam.panY);
        if (p1.visible && p2.visible) {
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();
        }
      }
      for (let gz = -350; gz <= 350; gz += 70) {
        const p1 = projectPoint3D({ x: -350, y: gridY, z: gz }, cx, cy, cam.angleX, cam.angleY, cam.zoom, cam.panX, cam.panY);
        const p2 = projectPoint3D({ x: 350, y: gridY, z: gz }, cx, cy, cam.angleX, cam.angleY, cam.zoom, cam.panX, cam.panY);
        if (p1.visible && p2.visible) {
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();
        }
      }

      // Check current active highlighted node IDs
      const currentPreset = subsystemPresets[activeSubsystem];
      const highlightedIds = selectedNode
        ? [selectedNode.id, ...selectedNode.connections]
        : currentPreset?.highlightedNodes || [];

      // 2. Draw Network Edges & Animated Data Packets
      topologyEdges.forEach((edge, idx) => {
        const fromNode = topologyNodes.find((n) => n.id === edge.from);
        const toNode = topologyNodes.find((n) => n.id === edge.to);
        if (!fromNode || !toNode) return;

        const isEdgeHighlighted =
          activeSubsystem === 'system' ||
          (highlightedIds.includes(fromNode.id) && highlightedIds.includes(toNode.id)) ||
          (selectedNode ? fromNode.id === selectedNode.id || toNode.id === selectedNode.id : false);

        const p1 = projectPoint3D(fromNode.position, cx, cy, cam.angleX, cam.angleY, cam.zoom, cam.panX, cam.panY);
        const p2 = projectPoint3D(toNode.position, cx, cy, cam.angleX, cam.angleY, cam.zoom, cam.panX, cam.panY);

        if (!p1.visible || !p2.visible) return;

        // Draw Line
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.lineWidth = isEdgeHighlighted ? Math.max(1.5, 2.5 * p1.scale) : Math.max(0.5, 1 * p1.scale);
        ctx.strokeStyle = isEdgeHighlighted
          ? edge.color
          : "rgba(255, 255, 255, 0.08)";
        
        if (edge.dashed) {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated Traffic Packet
        if (isEdgeHighlighted) {
          const speed = edge.speed || 1.2;
          const packetProgress = (packetTimer * speed + idx * 0.22) % 1;
          const px = p1.px + (p2.px - p1.px) * packetProgress;
          const py = p1.py + (p2.py - p1.py) * packetProgress;
          const pScale = p1.scale * (1 - packetProgress) + p2.scale * packetProgress;

          ctx.beginPath();
          ctx.arc(px, py, Math.max(1.5, 3.2 * pScale), 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = edge.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 3. Project Nodes and Sort by Depth (Z-Order)
      const projected = topologyNodes
        .map((node) => {
          const proj = projectPoint3D(node.position, cx, cy, cam.angleX, cam.angleY, cam.zoom, cam.panX, cam.panY);
          const isHighlighted =
            activeSubsystem === "system" ||
            highlightedIds.includes(node.id) ||
            (selectedNode && selectedNode.id === node.id);
          const isSelected = selectedNode?.id === node.id;
          const isHovered = hoveredNodeId === node.id;
          return {
            node,
            ...proj,
            isHighlighted,
            isSelected,
            isHovered,
          };
        })
        .filter((p) => p.visible)
        .sort((a, b) => b.zOrder - a.zOrder);

      // 4. Render Nodes
      projected.forEach(({ node, px, py, scale, isHighlighted, isSelected, isHovered }) => {
        const radius = Math.max(5, (isSelected ? 16 : isHovered ? 14 : 11) * scale);
        const alpha = isHighlighted || isSelected || isHovered ? 1.0 : 0.22;

        ctx.globalAlpha = alpha;

        // Outer Glow / Ring
        if (isHighlighted || isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(px, py, radius + (isSelected ? 8 : 5), 0, Math.PI * 2);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = isSelected ? 2.5 : 1.5;
          ctx.stroke();

          // Ambient aura glow
          ctx.beginPath();
          ctx.arc(px, py, radius + 12, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = 0.08;
          ctx.fill();
          ctx.globalAlpha = alpha;
        }

        // Core Solid Node Sphere
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? "#ffffff" : node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isHighlighted ? 12 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Center dot
        ctx.beginPath();
        ctx.arc(px, py, Math.max(2, radius * 0.35), 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? node.color : "#ffffff";
        ctx.fill();

        // Node Monospace Title & IP
        if (isHighlighted || isSelected || isHovered || scale > 0.85) {
          const fontSize = Math.max(9, Math.round(11 * scale));
          ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
          ctx.textAlign = "center";
          ctx.fillStyle = isSelected ? "#00e5ff" : isHovered ? "#ffffff" : "rgba(226, 232, 240, 0.9)";
          ctx.fillText(node.name, px, py + radius + 13);

          if (node.ip && (isSelected || isHovered || scale > 0.95)) {
            const subFontSize = Math.max(8, Math.round(9 * scale));
            ctx.font = `400 ${subFontSize}px "JetBrains Mono", monospace`;
            ctx.fillStyle = "rgba(148, 163, 184, 0.75)";
            ctx.fillText(node.ip, px, py + radius + 25);
          }
        }
      });

      ctx.globalAlpha = 1.0;
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      const container = containerRef.current;
      if (!canvas || !container) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${container.clientHeight}px`;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [activeSubsystem, selectedNode, isAutoRotate, hoveredNodeId]);

  // Mouse / Touch Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const cx = canvas.width / (2 * (window.devicePixelRatio || 1));
    const cy = canvas.height / (2 * (window.devicePixelRatio || 1));
    const cam = cameraRef.current;

    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;
      cam.targetAngleY += deltaX * 0.006;
      cam.targetAngleX = Math.max(-0.8, Math.min(0.8, cam.targetAngleX + deltaY * 0.006));
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }

    // Raycast / Hit Test for Hover
    let hovered: string | null = null;
    topologyNodes.forEach((n) => {
      const p = projectPoint3D(n.position, cx, cy, cam.angleX, cam.angleY, cam.zoom, cam.panX, cam.panY);
      if (p.visible) {
        const dist = distance2D(p.px, p.py, mouseX, mouseY);
        if (dist < 22) {
          hovered = n.id;
        }
      }
    });

    setHoveredNodeId(hovered);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const wasDragging = isDraggingRef.current;
    isDraggingRef.current = false;

    // Detect Click if not dragging extensively
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const cx = canvas.width / (2 * (window.devicePixelRatio || 1));
    const cy = canvas.height / (2 * (window.devicePixelRatio || 1));
    const cam = cameraRef.current;

    let clickedNode: TopologyNode | null = null;
    topologyNodes.forEach((n) => {
      const p = projectPoint3D(n.position, cx, cy, cam.angleX, cam.angleY, cam.zoom, cam.panX, cam.panY);
      if (p.visible) {
        const dist = distance2D(p.px, p.py, mouseX, mouseY);
        if (dist < 25) {
          clickedNode = n;
        }
      }
    });

    if (clickedNode) {
      onSelectNode(clickedNode);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.001;
    cameraRef.current.targetZoom = Math.max(0.5, Math.min(2.5, cameraRef.current.targetZoom + zoomDelta));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: hoveredNodeId ? "pointer" : isDraggingRef.current ? "grabbing" : "grab" }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
