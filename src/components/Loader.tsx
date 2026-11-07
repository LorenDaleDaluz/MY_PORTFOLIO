import { useEffect, useRef } from "react";
import { profile } from "../data/portfolio";
import { asciiScene } from "../scene/ascii";

/** Downloads and fully decodes an image so its first on-screen zoom doesn't stall. */
const preload = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.src = src;
    img.decode().then(resolve, resolve);
  });

/**
 * Kumo-style boot screen: the opening shot, drawn in ASCII as the
 * page's fonts and portrait load.
 */
type LoaderProps = {
  /** The fade-out starts: the film can begin underneath. */
  onReady: () => void;
  /** The fade-out finished: safe to unmount. */
  onFinished: () => void;
};

export default function Loader({ onReady, onFinished }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const asciiRef = useRef<HTMLPreElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const pre = asciiRef.current;
    const pct = pctRef.current;
    if (!root || !pre || !pct) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const aspect = vw / vh;
    const cols = vw < 640 ? 60 : 118;
    const rows = Math.max(14, Math.round((cols * 0.6) / (aspect * 1.12)));
    const lines = asciiScene(cols, rows, aspect);
    const fontSize = Math.min((vw * 0.88) / (cols * 0.6), (vh * 0.6) / (rows * 1.12));
    pre.style.fontSize = `${fontSize.toFixed(2)}px`;

    const thresholds = new Float32Array(cols * rows);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        thresholds[r * cols + c] = (r / rows) * 0.25 + Math.random() * 0.6;
      }
    }

    const tasks = [
      document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve(),
      preload("/myImage.png"),
    ];
    let loaded = 0;
    tasks.forEach((task) => task.then(() => (loaded += 1)));

    const minTime = reduced ? 500 : 1700;
    // Timed from the first frame: rAF timestamps can predate a performance.now()
    // taken here after the (synchronous) ASCII render above.
    let start = -1;
    let shown = 0;
    let raf = 0;
    let exitTimer = 0;

    const render = (p: number) => {
      let out = "";
      for (let r = 0; r < rows; r++) {
        const line = lines[r] ?? "";
        for (let c = 0; c < cols; c++) {
          out += p >= thresholds[r * cols + c] ? (line[c] ?? " ") : " ";
        }
        out += "\n";
      }
      pre.textContent = out;
      pct.textContent = `${String(Math.round(p * 100)).padStart(3, "0")}%`;
    };

    const tick = (now: number) => {
      if (start < 0) start = now;
      const elapsed = now - start;
      const timeFrac = Math.min(1, elapsed / minTime);
      const allLoaded = loaded === tasks.length;
      const target =
        elapsed > 8000 ? 1 : allLoaded ? timeFrac : Math.min(timeFrac, 0.86);
      // Only ever counts up.
      shown = Math.max(shown, shown + (target - shown) * (reduced ? 1 : 0.14));
      if (target - shown < 0.004) shown = Math.max(shown, target);
      render(shown);
      if (shown >= 1) {
        root.classList.add("is-done");
        onReady();
        exitTimer = window.setTimeout(onFinished, reduced ? 200 : 800);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(exitTimer);
    };
  }, [onReady, onFinished]);

  return (
    <div
      ref={rootRef}
      className="loader"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="loader-top">
        <span className="hud-mark" aria-hidden="true">
          LD
        </span>
        <span>{profile.name}</span>
        <span className="ml-auto hidden sm:inline">Interactive portfolio</span>
      </div>
      <pre ref={asciiRef} className="loader-ascii" aria-hidden="true" />
      <div className="loader-bottom">
        <span>Setting up the room</span>
        <span ref={pctRef} className="loader-pct">
          000%
        </span>
      </div>
    </div>
  );
}
