import { drawBack, drawFront, type SceneInput, type View } from "../scene/draw";
import { poseFor } from "../scene/rig";
import {
  buildShots,
  sampleCam,
  screenRectFor,
  type Cam,
  type Rect,
  type Shots,
} from "./camera";
import { clamp, mixRgb, smoothstep, type RGB } from "./math";
import {
  buildTimeline,
  evaluate,
  scrollForContent,
  type CutSpec,
  type Evaluation,
  type SegmentKind,
  type Timeline,
} from "./timeline";

export type FrameInfo = {
  /** Page offset (px) currently shown on the monitor. */
  offset: number;
  vw: number;
  vh: number;
  segId: string;
  segKind: SegmentKind;
  u: number;
  /** 0..1 — how much the "film" HUD should show (0 while reading). */
  film: number;
  /** 1 in the wide room shot, 0 when the monitor fills the viewport. */
  zoomFilm: number;
  /** 0..1 through the whole experience. */
  progress: number;
  now: number;
};

export type StageElements = {
  back: HTMLCanvasElement;
  front: HTMLCanvasElement;
  screen: HTMLElement;
  inner: HTMLElement;
  content: HTMLElement;
  spacer: HTMLElement;
};

type SectionInfo = { id: string; top: number; glow: RGB };

const DEFAULT_GLOW: RGB = [255, 64, 38];

const parseGlow = (value?: string): RGB => {
  const parts = (value ?? "").split(",").map(Number);
  return parts.length === 3 && parts.every((n) => Number.isFinite(n))
    ? [parts[0], parts[1], parts[2]]
    : DEFAULT_GLOW;
};

function filmAmount(kind: SegmentKind, u: number) {
  switch (kind) {
    case "intro":
      return 1 - smoothstep(0.86, 0.99, u);
    case "cut":
      return smoothstep(0.04, 0.2, u) * (1 - smoothstep(0.8, 0.96, u));
    case "outro":
      return smoothstep(0.04, 0.2, u);
    default:
      return 0;
  }
}

/**
 * Drives the whole page: the document only provides a scroll range, and
 * every frame we decide where the camera is, what the viewer is doing,
 * and which part of the portfolio is on his monitor.
 */
export class Experience {
  private els: StageElements | null = null;
  private backCtx: CanvasRenderingContext2D | null = null;
  private frontCtx: CanvasRenderingContext2D | null = null;
  private frameListeners = new Set<(f: FrameInfo) => void>();
  private sectionListeners = new Set<() => void>();
  private raf = 0;
  private vw = 1;
  private vh = 1;
  private dpr = 1;
  private layoutVw = 0;
  private layoutVh = 0;
  private screenRect: Rect = { x: 0, y: 0, w: 1, h: 1 };
  private shots: Shots | null = null;
  private tl: Timeline | null = null;
  private sections: SectionInfo[] = [];
  private current = 0;
  private lastNow = 0;
  private lastDraw = 0;
  private lastEmit = 0;
  private glow: RGB = [...DEFAULT_GLOW];
  private activeSection = "top";
  private reduced = false;
  private coarse = false;
  private canvasVisible = true;
  private readingStyles = false;
  private dirty = true;
  private started = false;
  private resizeObserver: ResizeObserver | null = null;
  private reducedQuery: MediaQueryList | null = null;
  private latest: FrameInfo | null = null;

  get frame() {
    return this.latest;
  }

  attach(els: StageElements) {
    this.els = els;
    this.backCtx = els.back.getContext("2d");
    this.frontCtx = els.front.getContext("2d");
    this.reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.reduced = this.reducedQuery.matches;
    this.coarse = window.matchMedia("(pointer: coarse)").matches;
    this.reducedQuery.addEventListener("change", this.onReducedChange);
    window.addEventListener("resize", this.onResize);
    els.inner.addEventListener("focusin", this.onFocusIn);
    els.inner.addEventListener("click", this.onHashClick);
    this.resizeObserver = new ResizeObserver(() => this.measureContent());
    this.resizeObserver.observe(els.content);
    this.measureView(true);
    this.measureContent();
    this.current = window.scrollY;
    this.raf = requestAnimationFrame(this.tick);
  }

  detach() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    this.reducedQuery?.removeEventListener("change", this.onReducedChange);
    this.els?.inner.removeEventListener("focusin", this.onFocusIn);
    this.els?.inner.removeEventListener("click", this.onHashClick);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.els = null;
  }

  /** Called when the loader is done: unlock scrolling and start the film. */
  start() {
    this.started = true;
    document.documentElement.classList.remove("is-locked");
    this.dirty = true;
  }

  subscribe(cb: (f: FrameInfo) => void) {
    this.frameListeners.add(cb);
    if (this.latest) cb(this.latest);
    return () => {
      this.frameListeners.delete(cb);
    };
  }

  subscribeSection = (cb: () => void) => {
    this.sectionListeners.add(cb);
    return () => {
      this.sectionListeners.delete(cb);
    };
  };

  getActiveSection = () => this.activeSection;

  /** "start" rewinds to the first frame, "top" lands on the hero. */
  jumpTo(id: string) {
    const tl = this.tl;
    if (!tl) return;
    let y: number;
    if (id === "start") y = 0;
    else if (id === "top") y = tl.introEnd;
    else {
      const section = this.sections.find((s) => s.id === id);
      if (!section) return;
      y = scrollForContent(tl, Math.min(section.top, tl.contentMax));
    }
    window.scrollTo({ top: y, behavior: "instant" });
  }

  private onHashClick = (event: MouseEvent) => {
    const link = (event.target as HTMLElement | null)?.closest?.("a[href^='#']");
    if (!link) return;
    const id = link.getAttribute("href")?.slice(1);
    if (!id || !this.sections.some((s) => s.id === id)) return;
    event.preventDefault();
    this.jumpTo(id);
  };

  private onResize = () => {
    this.measureView();
    this.measureContent();
  };

  private onReducedChange = () => {
    this.reduced = !!this.reducedQuery?.matches;
    this.measureContent();
  };

  /** Keyboard users: bring whatever gets focus onto the monitor and into view. */
  private onFocusIn = (event: FocusEvent) => {
    const tl = this.tl;
    const els = this.els;
    const target = event.target as HTMLElement | null;
    if (!tl || !els || !target) return;
    if (!els.content.contains(target)) {
      if (window.scrollY < tl.introEnd) this.jumpTo("top");
      return;
    }
    let top = 0;
    let node: HTMLElement | null = target;
    while (node && node !== els.content) {
      top += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    const ev = evaluate(tl, window.scrollY);
    const bottom = top + target.offsetHeight;
    if (
      ev.seg.kind !== "read" ||
      top < ev.offset + 40 ||
      bottom > ev.offset + this.vh - 110
    ) {
      const desired = clamp(top - this.vh * 0.35, 0, tl.contentMax);
      window.scrollTo({ top: scrollForContent(tl, desired), behavior: "instant" });
    }
  };

  private measureView(force = false) {
    const els = this.els;
    if (!els) return;
    const vw = document.documentElement.clientWidth || window.innerWidth;
    const vh = window.innerHeight;
    this.vw = vw;
    this.vh = vh;
    this.dpr = Math.min(window.devicePixelRatio || 1, this.coarse ? 1.75 : 2);
    for (const canvas of [els.back, els.front]) {
      const w = Math.round(vw * this.dpr);
      const h = Math.round(vh * this.dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    // Mobile browsers resize the viewport as the URL bar slides; only
    // relayout the page for real size changes.
    if (force || vw !== this.layoutVw || Math.abs(vh - this.layoutVh) > 140) {
      this.layoutVw = vw;
      this.layoutVh = vh;
      document.documentElement.style.setProperty("--screen-h", `${vh}px`);
    }
    els.inner.style.width = `${vw}px`;
    els.inner.style.height = `${vh}px`;
    this.screenRect = screenRectFor(vw / vh);
    this.shots = buildShots(vw, vh, this.screenRect);
    this.readingStyles = false;
    this.dirty = true;
  }

  private measureContent() {
    const els = this.els;
    if (!els) return;
    const content = els.content;
    const vh = this.layoutVh || this.vh;

    const sections: SectionInfo[] = [];
    content.querySelectorAll<HTMLElement>("[data-section]").forEach((el) => {
      sections.push({
        id: el.dataset.section ?? "",
        top: el.offsetTop,
        glow: parseGlow(el.dataset.glow),
      });
    });
    const cuts: CutSpec[] = [];
    content.querySelectorAll<HTMLElement>("[data-cut]").forEach((el) => {
      cuts.push({ id: `cut-${el.dataset.cut}`, anchor: el.offsetTop - vh * 0.92 });
    });

    const previous = this.tl ? evaluate(this.tl, this.current) : null;
    const tl = buildTimeline({
      vh,
      contentHeight: content.offsetHeight,
      cuts,
      reduced: this.reduced,
    });
    this.sections = sections;
    this.tl = tl;
    els.spacer.style.height = `${Math.ceil(tl.total + this.vh)}px`;

    // Keep the same moment of the film on screen after a relayout.
    if (previous && this.started) {
      let y = this.current;
      if (previous.seg.kind === "read") y = scrollForContent(tl, previous.offset);
      else {
        const same = tl.segments.find((s) => s.id === previous.seg.id);
        if (same) y = same.start + previous.u * (same.end - same.start);
      }
      if (Math.abs(y - window.scrollY) > 1) window.scrollTo(0, y);
      this.current = y;
    }
    this.dirty = true;
  }

  private sectionAt(y: number) {
    let found = this.sections[0];
    for (const s of this.sections) if (s.top <= y) found = s;
    return found;
  }

  private tick = (now: number) => {
    this.raf = requestAnimationFrame(this.tick);
    const els = this.els;
    const tl = this.tl;
    const shots = this.shots;
    if (!els || !tl || !shots) return;

    const dt = this.lastNow ? Math.min(64, now - this.lastNow) : 16.7;
    this.lastNow = now;
    const target = clamp(window.scrollY, 0, tl.total);
    const base = this.reduced ? 1 : this.coarse ? 0.22 : 0.1;
    const k = 1 - Math.pow(1 - base, dt / 16.667);
    let cur = this.current + (target - this.current) * k;
    if (Math.abs(target - cur) < 0.08) cur = target;
    const moved = cur !== this.current;
    this.current = cur;

    const ev = evaluate(tl, cur);
    const reading = ev.seg.kind === "read";
    const cam: Cam = reading
      ? shots.fill
      : sampleCam(shots.keys[ev.seg.id] ?? shots.keys.intro, ev.u);

    const wanted = this.sectionAt(ev.offset + this.vh * 0.5)?.glow ?? DEFAULT_GLOW;
    this.glow = mixRgb(this.glow, wanted, 1 - Math.pow(0.94, dt / 16.667));

    const zoomFilm = clamp(
      Math.log(shots.fill.s / cam.s) / Math.log(shots.fill.s / shots.wide.s),
    );
    const covers = this.applyScreen(cam, ev.offset, reading);

    if (!covers) {
      if (!this.canvasVisible) {
        els.back.style.visibility = "visible";
        els.front.style.visibility = "visible";
        this.canvasVisible = true;
      }
      const ambientDue = !this.reduced && now - this.lastDraw > 33;
      if (moved || this.dirty || ambientDue) {
        this.draw(cam, ev, zoomFilm, now);
        this.lastDraw = now;
      }
    } else if (this.canvasVisible) {
      els.back.style.visibility = "hidden";
      els.front.style.visibility = "hidden";
      this.frontCtx?.clearRect(0, 0, els.front.width, els.front.height);
      this.canvasVisible = false;
    }

    const frame: FrameInfo = {
      offset: ev.offset,
      vw: this.vw,
      vh: this.vh,
      segId: ev.seg.id,
      segKind: ev.seg.kind,
      u: ev.u,
      film: filmAmount(ev.seg.kind, ev.u),
      zoomFilm,
      progress: tl.total ? cur / tl.total : 0,
      now,
    };
    this.latest = frame;
    if (moved || this.dirty || (!covers && now - this.lastEmit > 33)) {
      this.lastEmit = now;
      this.frameListeners.forEach((cb) => cb(frame));
    }

    const active = this.sectionAt(ev.offset + this.vh * 0.35)?.id ?? "top";
    if (active !== this.activeSection) {
      this.activeSection = active;
      this.sectionListeners.forEach((cb) => cb());
    }
    this.dirty = false;
  };

  /** Places the live page inside the monitor. Returns true when it fills the viewport. */
  private applyScreen(cam: Cam, offset: number, reading: boolean) {
    const els = this.els;
    if (!els) return true;
    const { vw, vh } = this;
    const S = this.screenRect;
    const x0 = vw / 2 + (S.x - cam.x) * cam.s;
    const y0 = vh / 2 + (S.y - cam.y) * cam.s;
    const w = S.w * cam.s;
    const h = S.h * cam.s;
    const k = Math.min(w / vw, h / vh);
    const covers =
      reading ||
      (Math.abs(k - 1) < 1e-3 &&
        x0 <= 0.5 &&
        y0 <= 0.5 &&
        x0 + w >= vw - 0.5 &&
        y0 + h >= vh - 0.5);

    // Fallback for browsers without `overflow: clip`: undo any focus-scroll.
    if (els.inner.scrollTop || els.inner.scrollLeft) {
      els.inner.scrollTop = 0;
      els.inner.scrollLeft = 0;
    }
    if (els.screen.scrollTop || els.screen.scrollLeft) {
      els.screen.scrollTop = 0;
      els.screen.scrollLeft = 0;
    }

    const screen = els.screen.style;
    const inner = els.inner.style;
    if (covers) {
      if (!this.readingStyles) {
        screen.width = `${vw}px`;
        screen.height = `${vh}px`;
        screen.transform = "translate3d(0px, 0px, 0px)";
        screen.borderRadius = "0px";
        inner.transform = "none";
        inner.pointerEvents = "auto";
        this.readingStyles = true;
      }
    } else {
      this.readingStyles = false;
      screen.width = `${w}px`;
      screen.height = `${h}px`;
      screen.transform = `translate3d(${x0}px, ${y0}px, 0px)`;
      screen.borderRadius = `${Math.max(0, 6 * cam.s).toFixed(2)}px`;
      inner.transform = `translate(${(w - vw * k) / 2}px, ${(h - vh * k) / 2}px) scale(${k})`;
      inner.pointerEvents = "none";
    }
    const y = Math.round(offset * this.dpr) / this.dpr;
    els.content.style.transform = `translate3d(0px, ${-y}px, 0px)`;
    return covers;
  }

  private draw(cam: Cam, ev: Evaluation, zoomFilm: number, now: number) {
    const back = this.backCtx;
    const front = this.frontCtx;
    const shots = this.shots;
    if (!back || !front || !shots) return;
    const view: View = {
      vw: this.vw,
      vh: this.vh,
      dpr: this.dpr,
      cam,
      z: cam.s / shots.wide.s,
      zoomFilm,
    };
    const input: SceneInput = {
      t: now / 1000,
      glow: this.glow,
      screen: this.screenRect,
      pose: poseFor(ev.seg.id, ev.u),
      ambient: !this.reduced,
      orient: shots.orient,
    };
    drawBack(back, view, input);
    drawFront(front, view, input);
  }
}
