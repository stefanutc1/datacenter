export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface ProjectedPoint {
  px: number;
  py: number;
  scale: number;
  zOrder: number;
  visible: boolean;
}

export function projectPoint3D(
  p: Point3D,
  cx: number,
  cy: number,
  angleX: number,
  angleY: number,
  zoom = 1,
  panX = 0,
  panY = 0,
  fov = 500,
  cameraDistance = 450
): ProjectedPoint {
  // Rotate around Y-axis (Yaw)
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const x1 = p.x * cosY - p.z * sinY;
  const z1 = p.z * cosY + p.x * sinY;

  // Rotate around X-axis (Pitch)
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  const y2 = p.y * cosX - z1 * sinX;
  const z2 = z1 * cosX + p.y * sinX;

  // Perspective Projection
  const dist = fov + z2 + cameraDistance;
  if (dist <= 10) {
    return { px: 0, py: 0, scale: 0, zOrder: z2, visible: false };
  }

  const scale = (fov / dist) * zoom;
  const px = cx + (x1 + panX) * scale;
  const py = cy + (y2 + panY) * scale;

  return {
    px,
    py,
    scale,
    zOrder: z2,
    visible: true,
  };
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function distance2D(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}
