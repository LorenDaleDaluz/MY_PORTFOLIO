import { useEffect, useRef } from "react";
import { links, profile } from "../data/portfolio";
import { useExperience, useFrame, useReady } from "../engine/context";
import { clamp, smoothstep } from "../engine/math";
import { reveal } from "../engine/scramble";

type Caption = { seg: string; from: number; to: number; lines: string[] };

/**
 * Narration over the film. A caption decodes in (timed) while the scroll
 * position is inside its window, and un-writes itself when it leaves, so
 * it's never left half-scrambled when you stop scrolling.
 */
const CAPTIONS: Caption[] = [
  { seg: "intro", from: -1, to: 0.27, lines: ["SOMEONE JUST OPENED", "MY PORTFOLIO."] },
  { seg: "intro", from: 0.3, to: 0.55, lines: ["LATE NIGHT. ONE TAB.", "NO DISTRACTIONS."] },
  { seg: "intro", from: 0.58, to: 0.83, lines: ["LET'S LOOK OVER", "THE SHOULDER."] },
  { seg: "cut-work", from: 0.16, to: 0.82, lines: ["THE WORK GETS", "A CLOSER LOOK."] },
  { seg: "cut-contact", from: 0.16, to: 0.82, lines: ["STILL SCROLLING.", "STILL HERE."] },
  { seg: "outro", from: 0.16, to: 0.56, lines: ["SEEN ENOUGH?"] },
  { seg: "outro", from: 0.6, to: 9, lines: ["YOUR TURN."] },
];

const SCENES: Record<string, string> = {
  intro: "SC 01 — The room",
  "cut-work": "SC 02 — Closer look",
  "cut-contact": "SC 03 — Still here",
  outro: "SC 04 — Your turn",
};

const TICKER = [
  "Now viewing — Loren Dale Daluz",
  "Portfolio, seen over a shoulder",
  "Cabanatuan City, PH",
];

const pad = (n: number, size: number) => String(n).padStart(size, "0");

/** Kumo-style film slate drawn over the scene: logo, timecode, captions, ticker. */
export default function Hud() {
  const experience = useExperience();
  const ready = useReady();
  const rootRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const captionState = useRef(CAPTIONS.map(() => ({ p: 0, shown: -1, at: 0 })));
  const lastNow = useRef(0);
  const sceneRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const lastScene = useRef("");
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const tick = () => {
      const el = clockRef.current;
      if (!el) return;
      const d = new Date();
      el.textContent = `${pad(d.getHours(), 2)}:${pad(d.getMinutes(), 2)}:${pad(d.getSeconds(), 2)}`;
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useFrame((f) => {
    const root = rootRef.current;
    if (!root) return;
    const dt = lastNow.current ? clamp(f.now - lastNow.current, 0, 100) : 16;
    lastNow.current = f.now;
    const film = f.film;
    root.style.opacity = film.toFixed(3);
    root.style.visibility = film < 0.01 ? "hidden" : "visible";
    if (film < 0.01) return;

    CAPTIONS.forEach((caption, i) => {
      const el = captionRefs.current[i];
      const state = captionState.current[i];
      if (!el) return;
      const inWindow =
        ready &&
        caption.seg === f.segId &&
        (caption.from < 0 || f.u >= caption.from) &&
        f.u < caption.to;
      // Decode in over ~0.9s, un-write a little faster (instant with reduced motion).
      if (reducedMotion.current) state.p = inWindow ? 1 : 0;
      else
        state.p = inWindow
          ? Math.min(1, state.p + dt / 900)
          : Math.max(0, state.p - dt / 380);
      const settled = state.p === 0 || state.p === 1;
      if (state.p === state.shown && settled) return;
      if (!settled && f.now - state.at < 50) return;
      state.shown = state.p;
      state.at = f.now;
      el.style.visibility = state.p <= 0 ? "hidden" : "visible";
      if (state.p <= 0) return;
      const spans = el.children;
      caption.lines.forEach((line, j) => {
        const span = spans[j];
        if (span) span.textContent = reveal(line, state.p);
      });
    });

    const scene = SCENES[f.segId] ?? SCENES.intro;
    if (scene !== lastScene.current && sceneRef.current) {
      sceneRef.current.textContent = scene;
      lastScene.current = scene;
    }
    if (frameRef.current) {
      frameRef.current.textContent = pad(Math.round(f.progress * 2399) + 1, 4);
    }
    if (skipRef.current) {
      const on = f.segKind === "intro" && f.u < 0.9;
      skipRef.current.style.visibility = on ? "visible" : "hidden";
    }
    if (ctaRef.current) {
      ctaRef.current.classList.toggle("is-on", f.segKind === "outro" && f.u > 0.62);
    }
    if (hintRef.current) {
      const hint = f.segKind === "intro" ? 1 - smoothstep(0.02, 0.08, f.u) : 0;
      hintRef.current.style.opacity = hint.toFixed(3);
    }
  });

  return (
    <div ref={rootRef} className="hud">
      <div className="hud-top">
        <div className="hud-brand">
          <span className="hud-mark" aria-hidden="true">
            LD
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </div>
        <div className="hud-slate" aria-hidden="true">
          <span ref={clockRef} className="hud-clock">
            00:00:00
          </span>
          <span>Live view</span>
          <span ref={sceneRef}>{SCENES.intro}</span>
        </div>
        <div className="hud-actions">
          <button
            ref={skipRef}
            type="button"
            className="hud-link"
            onClick={() => experience.jumpTo("top")}
          >
            Skip intro
          </button>
          <button
            type="button"
            className="hud-link"
            onClick={() => experience.jumpTo("contact")}
          >
            Let&apos;s talk <span className="hud-dot" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="hud-captions" aria-hidden="true">
        {CAPTIONS.map((caption, i) => (
          <p
            key={`${caption.seg}-${i}`}
            ref={(el) => {
              captionRefs.current[i] = el;
            }}
            className="hud-caption"
          >
            {caption.lines.map((line) => (
              <span key={line} className="block">
                {" "}
              </span>
            ))}
          </p>
        ))}
      </div>

      <div ref={ctaRef} className="hud-cta">
        <a className="btn-light" href={links.email} target="_blank" rel="noreferrer">
          Email me
        </a>
        <a className="hud-ghost" href={links.phone}>
          Call
        </a>
        <a className="hud-ghost" href={links.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <button
          type="button"
          className="hud-ghost"
          onClick={() => experience.jumpTo("start")}
        >
          Watch again ↺
        </button>
      </div>

      <div ref={hintRef} className="hud-hint" aria-hidden="true">
        <span>Scroll</span>
        <span className="hud-hint-line" />
      </div>

      <div className="hud-bottom" aria-hidden="true">
        <div className="hud-ticker">
          <div className="hud-ticker-track">
            {[0, 1].map((copy) => (
              <span key={copy} className="hud-ticker-copy">
                {TICKER.map((item) => (
                  <span key={item}>
                    {item}
                    <i>✦</i>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <span className="hud-frame">
          Frame <span ref={frameRef}>0001</span> / 2400
        </span>
      </div>
    </div>
  );
}
