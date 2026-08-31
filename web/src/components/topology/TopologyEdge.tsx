"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { TopologyNode as ITopologyNode, TopologyEdge as ITopologyEdge } from "@/data/infrastructure";

interface TopologyEdgeProps {
  edge: ITopologyEdge;
  fromNode: ITopologyNode;
  toNode: ITopologyNode;
  isHighlighted: boolean;
  isAnyHighlighted: boolean;
}

export const TopologyEdge: React.FC<TopologyEdgeProps> = ({
  edge,
  fromNode,
  toNode,
  isHighlighted,
  isAnyHighlighted,
}) => {
  const packetRef1 = useRef<THREE.Mesh>(null);
  const packetRef2 = useRef<THREE.Mesh>(null);

  const start = useMemo<[number, number, number]>(() => {
    return [fromNode.position.x / 10, fromNode.position.y / 10, fromNode.position.z / 10];
  }, [fromNode.position]);

  const end = useMemo<[number, number, number]>(() => {
    return [toNode.position.x / 10, toNode.position.y / 10, toNode.position.z / 10];
  }, [toNode.position]);

  const opacity = useMemo(() => {
    if (!isAnyHighlighted) return 0.45;
    return isHighlighted ? 0.85 : 0.12;
  }, [isHighlighted, isAnyHighlighted]);

  const lineWidth = useMemo(() => {
    if (isHighlighted) return 2.0;
    if (edge.type === "fiber" || edge.type === "ai_flow") return 1.5;
    return 1.0;
  }, [isHighlighted, edge.type]);

  const edgeColor = useMemo(() => {
    return edge.color || "#C26735";
  }, [edge.color]);

  // Animate packet positions along the edge vector
  const speed = edge.speed || 1.0;
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed * 0.4;
    const progress1 = t % 1.0;
    const progress2 = (t + 0.5) % 1.0;

    if (packetRef1.current) {
      packetRef1.current.position.set(
        start[0] + (end[0] - start[0]) * progress1,
        start[1] + (end[1] - start[1]) * progress1,
        start[2] + (end[2] - start[2]) * progress1
      );
    }

    if (packetRef2.current) {
      packetRef2.current.position.set(
        start[0] + (end[0] - start[0]) * progress2,
        start[1] + (end[1] - start[1]) * progress2,
        start[2] + (end[2] - start[2]) * progress2
      );
    }
  });

  return (
    <group>
      {/* 3D Line Connection */}
      <Line
        points={[start, end]}
        color={edgeColor}
        lineWidth={lineWidth}
        transparent
        opacity={opacity}
        dashed={edge.dashed}
        dashScale={2}
        dashSize={0.6}
        gapSize={0.4}
      />

      {/* Animated Packet Stream (Rendered if highlighted or normal view) */}
      {opacity > 0.3 && (
        <>
          <mesh ref={packetRef1}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial
              color={edgeColor}
              transparent
              opacity={opacity}
            />
          </mesh>
          <mesh ref={packetRef2}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={opacity * 0.8}
            />
          </mesh>
        </>
      )}
    </group>
  );
};
