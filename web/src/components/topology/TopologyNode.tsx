"use client";

import React, { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, Text } from "@react-three/drei";
import { TopologyNode as ITopologyNode, SubsystemCategory } from "@/data/infrastructure";
import { useTheme } from "@/components/theme/ThemeProvider";

interface TopologyNodeProps {
  node: ITopologyNode;
  isSelected: boolean;
  isHighlighted: boolean;
  isAnyHighlighted: boolean;
  onSelect: (node: ITopologyNode) => void;
  onHover?: (node: ITopologyNode | null) => void;
}

export const TopologyNode: React.FC<TopologyNodeProps> = ({
  node,
  isSelected,
  isHighlighted,
  isAnyHighlighted,
  onSelect,
  onHover,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Coordinates converted to 3D scene space (scaled down by 10)
  const position: [number, number, number] = useMemo(() => {
    return [node.position.x / 10, node.position.y / 10, node.position.z / 10];
  }, [node.position]);

  // Opacity calculation based on highlight state
  const opacity = useMemo(() => {
    if (isSelected) return 1.0;
    if (hovered) return 1.0;
    if (!isAnyHighlighted) return 0.9;
    return isHighlighted ? 1.0 : 0.2;
  }, [isSelected, hovered, isHighlighted, isAnyHighlighted]);

  const baseColor = useMemo(() => new THREE.Color(node.color || "#C26735"), [node.color]);

  // Visual personality scale
  const nodeScale = useMemo(() => {
    if (node.tier <= 1) return 1.35; // Hypervisors and Core Gateways
    if (node.tier === 6) return 1.25; // ELO AI
    if (node.tier === 2) return 1.15; // VMs
    return 1.0; // LXCs, Edge
  }, [node.tier]);

  // Continuous animation: hover floating & orbital ring rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      if (hovered || isSelected) {
        meshRef.current.scale.lerp(
          new THREE.Vector3(nodeScale * 1.25, nodeScale * 1.25, nodeScale * 1.25),
          0.1
        );
      } else {
        meshRef.current.scale.lerp(
          new THREE.Vector3(nodeScale, nodeScale, nodeScale),
          0.1
        );
      }
    }

    if (ringRef.current && (node.personality === "orbital" || isSelected)) {
      ringRef.current.rotation.z += delta * 1.5;
      ringRef.current.rotation.x += delta * 0.8;
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover?.(node);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover?.(null);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Selection Outer Glow / Pulse Ring */}
      {isSelected && (
        <mesh>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial
            color="#D97757"
            transparent
            opacity={0.35}
            wireframe
          />
        </mesh>
      )}

      {/* Orbital Ring for AI / Selected Nodes */}
      {(node.personality === "orbital" || isSelected) && (
        <mesh ref={ringRef}>
          <ringGeometry args={[0.9, 1.05, 32]} />
          <meshBasicMaterial
            color={node.color}
            transparent
            opacity={opacity * 0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Primary Core Geometry based on Personality */}
      {node.personality === "geometry" ? (
        <mesh>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial
            color={baseColor}
            roughness={0.2}
            metalness={0.6}
            transparent
            opacity={opacity}
          />
        </mesh>
      ) : node.personality === "perimeter" ? (
        <mesh>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color={baseColor}
            roughness={0.3}
            metalness={0.7}
            transparent
            opacity={opacity}
          />
        </mesh>
      ) : (
        <mesh>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial
            color={baseColor}
            roughness={0.25}
            metalness={0.5}
            transparent
            opacity={opacity}
          />
        </mesh>
      )}

      {/* Inner Pip Indicator */}
      <mesh>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshBasicMaterial
          color={isDark ? "#FFFFFF" : "#151210"}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* 3D Monospace Hostname & Label Billboard */}
      {(opacity > 0.3 || hovered || isSelected) && (
        <group position={[0, -0.9, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.32}
            color={isDark ? "#FAF7F2" : "#231F1D"}
            font="/fonts/JetBrainsMono-Bold.ttf"
            anchorX="center"
            anchorY="middle"
            fillOpacity={opacity}
          >
            {node.hostname || node.name}
          </Text>
          {(hovered || isSelected) && (
            <Text
              position={[0, -0.38, 0]}
              fontSize={0.22}
              color={isDark ? "#D97757" : "#C26735"}
              anchorX="center"
              anchorY="middle"
              fillOpacity={1.0}
            >
              {node.sublabel || node.domain || node.ip}
            </Text>
          )}
        </group>
      )}
    </group>
  );
};
