export const TAU = Math.PI * 2;

export type RGB = [number, number, number];

export const clamp = (v: number, min = 0, max = 1) =>
  v < min ? min : v > max ? max : v;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const invLerp = (a: number, b: number, v: number) =>
  a === b ? (v >= b ? 1 : 0) : clamp((v - a) / (b - a));

export const smoothstep = (a: number, b: number, v: number) => {
  const t = invLerp(a, b, v);
  return t * t * (3 - 2 * t);
};

export const rgba = (c: RGB, a: number) =>
  `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a.toFixed(3)})`;

export const mixRgb = (a: RGB, b: RGB, t: number): RGB => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

/** Small deterministic PRNG so the painted city looks the same on every visit. */
export function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Monotone cubic (Fritsch–Carlson) interpolation through keyframes.
 * End tangents are zero, so the camera eases in and out of each move
 * without overshooting a keyframe.
 */
export function monotone(ts: number[], ys: number[], u: number): number {
  const n = ts.length;
  if (n === 1 || u <= ts[0]) return ys[0];
  if (u >= ts[n - 1]) return ys[n - 1];

  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    d.push((ys[i + 1] - ys[i]) / (ts[i + 1] - ts[i]));
  }

  const m: number[] = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] > 0) {
      const h0 = ts[i] - ts[i - 1];
      const h1 = ts[i + 1] - ts[i];
      const w1 = 2 * h1 + h0;
      const w2 = h1 + 2 * h0;
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
    }
  }

  let i = 0;
  while (i < n - 2 && u > ts[i + 1]) i++;
  const h = ts[i + 1] - ts[i];
  const t = (u - ts[i]) / h;
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * ys[i] +
    (t3 - 2 * t2 + t) * h * m[i] +
    (-2 * t3 + 3 * t2) * ys[i + 1] +
    (t3 - t2) * h * m[i + 1]
  );
}
