import { useEffect, useRef } from "react";
import { useReady } from "../engine/context";
import { scramble } from "../engine/scramble";

type DotScrambleProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
};

/**
 * Dot-matrix text that decodes from random glyphs the first time it scrolls
 * into view, and replays when hovered. Screen readers get the real text
 * from the parent heading; this span is decorative.
 */
export function DotScramble({
  text,
  className = "",
  delay = 0,
  duration = 1100,
}: DotScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const ready = useReady();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }
    el.textContent = scramble(text, 0);
    if (!ready) return;

    let raf = 0;
    let timer = 0;
    let playing = false;
    const play = (length: number) => {
      if (playing) return;
      playing = true;
      const start = performance.now();
      let last = 0;
      const step = (now: number) => {
        const p = (now - start) / length;
        if (now - last > 45 || p >= 1) {
          el.textContent = scramble(text, p);
          last = now;
        }
        if (p < 1) raf = requestAnimationFrame(step);
        else playing = false;
      };
      raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          timer = window.setTimeout(() => play(duration), delay);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    const replay = () => play(600);
    el.addEventListener("pointerenter", replay);

    return () => {
      observer.disconnect();
      el.removeEventListener("pointerenter", replay);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [text, ready, delay, duration]);

  return (
    <span ref={ref} className={className} aria-hidden="true">
      {text}
    </span>
  );
}

type Line = { text: string; dim?: boolean };

type DotHeadingProps = {
  lines: Line[];
  as?: "h1" | "h2";
  className?: string;
};

/** Creative-director style two-tone heading: dim lines, then bright lines. */
export function DotHeading({ lines, as = "h2", className = "" }: DotHeadingProps) {
  const Tag = as;
  return (
    <Tag
      className={`font-display uppercase leading-[0.96] tracking-[0.01em] ${className}`}
    >
      <span className="sr-only">{lines.map((line) => line.text).join(" ")}</span>
      {lines.map((line, i) => (
        <DotScramble
          key={`${line.text}-${i}`}
          text={line.text}
          delay={i * 140}
          className={`block ${line.dim ? "font-medium text-ink/30" : "font-black text-ink"}`}
        />
      ))}
    </Tag>
  );
}
