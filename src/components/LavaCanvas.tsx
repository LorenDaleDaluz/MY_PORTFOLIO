import { useEffect, useRef } from "react";

type Blob = {
  color: string;
  r: number;
  ax: number;
  ay: number;
  fx: number;
  fy: number;
  px: number;
  py: number;
  stretch: number;
  rot: number;
};

const BLOBS: Blob[] = [
  { color: "255,61,31", r: 0.42, ax: 0.34, ay: 0.24, fx: 0.071, fy: 0.053, px: 0, py: 1.2, stretch: 1.7, rot: -0.6 },
  { color: "255,122,53", r: 0.32, ax: 0.3, ay: 0.3, fx: 0.049, fy: 0.067, px: 2.1, py: 0.4, stretch: 1.4, rot: 0.5 },
  { color: "51,88,255", r: 0.4, ax: 0.36, ay: 0.26, fx: 0.058, fy: 0.044, px: 4, py: 2.8, stretch: 1.6, rot: 0.9 },
  { color: "255,181,154", r: 0.24, ax: 0.3, ay: 0.3, fx: 0.083, fy: 0.061, px: 1.3, py: 3.6, stretch: 1.3, rot: -0.2 },
  { color: "160,16,42", r: 0.38, ax: 0.26, ay: 0.32, fx: 0.039, fy: 0.073, px: 5.2, py: 0.9, stretch: 1.9, rot: 0.2 },
];

/** Extra light for the parts of a wide monitor surface outside the page. */
const SIDE_BLOBS: (Blob & { side: -1 | 1 })[] = [
  { side: -1, color: "51,88,255", r: 0.55, ax: 0.18, ay: 0.3, fx: 0.043, fy: 0.057, px: 0.7, py: 2.2, stretch: 1.2, rot: 0.4 },
  { side: -1, color: "160,16,42", r: 0.6, ax: 0.2, ay: 0.25, fx: 0.031, fy: 0.049, px: 3.1, py: 0.2, stretch: 1.5, rot: -0.3 },
  { side: 1, color: "255,61,31", r: 0.55, ax: 0.18, ay: 0.3, fx: 0.047, fy: 0.039, px: 1.9, py: 4.1, stretch: 1.3, rot: -0.5 },
  { side: 1, color: "255,181,154", r: 0.4, ax: 0.2, ay: 0.28, fx: 0.061, fy: 0.052, px: 5.6, py: 1.4, stretch: 1.2, rot: 0.6 },
];

/**
 * Molten "lava lamp" light behind the page. Drawn tiny and stretched to fill
 * the monitor's surface, which keeps it soft and practically free to animate.
 * Blobs are placed relative to the page area (the viewport), so the page
 * looks the same whether the surface is exactly the viewport or wider.
 */
export default function LavaCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SCALE = 9;
    let w = 0; // canvas (whole surface)
    let h = 0;
    let pw = 0; // page area, in canvas pixels
    let ph = 0;
    let left = 0; // page area's left edge on the surface
    let raf = 0;
    let last = 0;

    const blob = (b: Blob, cx: number, cy: number, t: number, m: number) => {
      const x = cx + pw * b.ax * Math.sin(t * b.fx * Math.PI * 2 + b.px);
      const y = cy + ph * b.ay * Math.sin(t * b.fy * Math.PI * 2 + b.py);
      const r = m * b.r;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(b.rot + Math.sin(t * 0.05 + b.px) * 0.4);
      ctx.scale(b.stretch, 1);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0, `rgba(${b.color},0.5)`);
      g.addColorStop(0.5, `rgba(${b.color},0.2)`);
      g.addColorStop(1, `rgba(${b.color},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(-r, -r, r * 2, r * 2);
      ctx.restore();
    };

    const draw = (time: number) => {
      const t = time / 1000;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const m = Math.max(pw, ph);
      for (const b of BLOBS) blob(b, left + pw / 2, ph / 2, t, m);
      if (left > 1) {
        for (const b of SIDE_BLOBS) {
          const cx = b.side < 0 ? left / 2 : w - left / 2;
          blob(b, cx, h / 2, t, Math.max(left, h * 0.6));
        }
      }
    };

    const resize = () => {
      const surfaceW = canvas.clientWidth || window.innerWidth;
      const surfaceH = canvas.clientHeight || window.innerHeight;
      const pageW = Math.min(surfaceW, document.documentElement.clientWidth || window.innerWidth);
      w = Math.max(24, Math.round(surfaceW / SCALE));
      h = Math.max(24, Math.round(surfaceH / SCALE));
      pw = Math.max(1, pageW / SCALE);
      ph = h;
      left = (w - pw) / 2;
      canvas.width = w;
      canvas.height = h;
      draw(performance.now());
    };

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (time - last < 50) return;
      last = time;
      draw(time);
    };

    resize();
    if (!reduced) raf = requestAnimationFrame(loop);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="lava-canvas" />;
}
