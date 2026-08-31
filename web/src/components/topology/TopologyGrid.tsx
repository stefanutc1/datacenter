"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/theme/ThemeProvider";

interface TopologyGridProps {
  size?: number;
  divisions?: number;
  positionY?: number;
}

export const TopologyGrid: React.FC<TopologyGridProps> = ({
  size = 60,
  divisions = 30,
  positionY = -22,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gridColor = useMemo(() => {
    return isDark ? new THREE.Color("#2C2420") : new THREE.Color("#E4DCD3");
  }, [isDark]);

  const centerLineColor = useMemo(() => {
    return isDark ? new THREE.Color("#433731") : new THREE.Color("#D1C5B8");
  }, [isDark]);

  return (
    <group position={[0, positionY, 0]}>
      <gridHelper
        args={[size, divisions, centerLineColor, gridColor]}
        position={[0, 0, 0]}
      />
    </group>
  );
};
