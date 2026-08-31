"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { SubsystemPreset, TopologyNode } from "@/data/infrastructure";

interface TopologyCameraProps {
  currentPreset?: SubsystemPreset;
  selectedNode: TopologyNode | null;
  autoRotate?: boolean;
}

export const TopologyCamera: React.FC<TopologyCameraProps> = ({
  currentPreset,
  selectedNode,
  autoRotate = false,
}) => {
  const controlsRef = useRef<OrbitControlsType>(null);
  const { camera } = useThree();

  // Desired target vectors for camera and controls
  const targetCamPos = useRef(new THREE.Vector3(0, 14, 38));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (selectedNode) {
      // Focus directly on the selected node with closer zoom
      const nodeX = selectedNode.position.x / 10;
      const nodeY = selectedNode.position.y / 10;
      const nodeZ = selectedNode.position.z / 10;

      targetLookAt.current.set(nodeX, nodeY, nodeZ);
      targetCamPos.current.set(nodeX, nodeY + 5, nodeZ + 14);
    } else if (currentPreset?.camera.position && currentPreset?.camera.target) {
      // Focus on the subsystem preset coordinates
      const [px, py, pz] = currentPreset.camera.position;
      const [tx, ty, tz] = currentPreset.camera.target;

      targetCamPos.current.set(px, py, pz);
      targetLookAt.current.set(tx, ty, tz);
    } else {
      // Default global overview
      targetCamPos.current.set(0, 14, 38);
      targetLookAt.current.set(0, 0, 0);
    }
  }, [currentPreset, selectedNode]);

  // Smooth cinematic interpolation
  useFrame(() => {
    if (controlsRef.current) {
      camera.position.lerp(targetCamPos.current, 0.05);
      controlsRef.current.target.lerp(targetLookAt.current, 0.05);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.65}
      zoomSpeed={0.8}
      panSpeed={0.6}
      minDistance={6}
      maxDistance={70}
      autoRotate={autoRotate}
      autoRotateSpeed={0.4}
      maxPolarAngle={Math.PI / 2 + 0.15}
    />
  );
};
