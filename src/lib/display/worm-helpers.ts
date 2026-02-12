export type Point = { x: number; y: number };
export type DigitAsset = { paths: string[]; width: number; height: number };

/**
 * Compute a global scale factor so the tallest digit maps to targetHeight.
 * This preserves relative heights between digits.
 */
export function computeGlobalScale(digits: Record<number, DigitAsset>, targetHeight: number) {
  const heights = Object.values(digits).map((d) => d.height || 1);
  const tallest = Math.max(...heights, 1);
  return targetHeight / tallest;
}

export function defaultAdvanceWidth() {
  return 100; // nominal horizontal slot per digit (modifiable by prop)
}

export function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export type Vec = { x: number; y: number };

export function computeNormals(points: Vec[]): Vec[] {
  const n = points.length;
  if (n === 0) return [];
  const normals: Vec[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i === n - 1 ? i : i + 1];
    const tx = p1.x - p0.x;
    const ty = p1.y - p0.y;
    // normal is (-ty, tx)
    let nx = -ty;
    let ny = tx;
    const len = Math.sqrt(nx * nx + ny * ny) || 1;
    nx /= len;
    ny /= len;
    normals[i] = { x: nx, y: ny };
  }
  return normals;
}

export function pointsToPathD(points: Vec[]) {
  if (!points || points.length === 0) return '';
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)}`;
  }
  return d;
}

export function offsetPoints(points: Vec[], normals: Vec[], offset: number): Vec[] {
  const out: Vec[] = new Array(points.length);
  for (let i = 0; i < points.length; i++) {
    out[i] = { x: points[i].x + normals[i].x * offset, y: points[i].y + normals[i].y * offset };
  }
  return out;
}
