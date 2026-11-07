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

/**
 * Molten "lava lamp" light behind the page. Drawn tiny and stretched to fill
 * the screen, which keeps it soft and practically free to animate.
 */
export default function LavaCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;

    const draw = (time: number) => {
      const t = time / 1000;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const m = Math.max(w, h);
      for (const b of BLOBS) {
        const x = w * (0.5 + b.ax * Math.sin(t * b.fx * Math.PI * 2 + b.px));
        const y = h * (0.5 + b.ay * Math.sin(t * b.fy * Math.PI * 2 + b.py));
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
      }
    };

    const resize = () => {
      w = Math.max(24, Math.round(window.innerWidth / 9));
      h = Math.max(24, Math.round(window.innerHeight / 9));
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
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="lava-canvas" />;
}
