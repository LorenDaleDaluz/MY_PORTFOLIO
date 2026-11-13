import { clamp, lerp, monotone, smoothstep } from "./math";

export type Rect = { x: number; y: number; w: number; h: number };

/**
 * A camera framing, expressed on the monitor plane: the world point
 * (x, y) sits at the centre of the viewport and monitor-plane objects are
 * drawn at `s` pixels per world unit.
 */
export type Cam = { x: number; y: number; s: number };

type Key = { t: number; cam: Cam };

/** Monitor geometry in world units (the room is ~1600 × 1000). */
const MONITOR = { cx: 860, bottom: 640, area: 600 * 375 };

/**
 * The monitor is always a landscape desktop screen (16:10 up to 16:9). On
 * viewports narrower than that, the page is centred on a wider screen
 * surface (see Experience.measureView).
 */
export function screenRectFor(aspect: number): Rect {
  const a = clamp(aspect, 1.6, 1.78);
  const w = Math.sqrt(MONITOR.area * a);
  const h = Math.sqrt(MONITOR.area / a);
  return { x: MONITOR.cx - w / 2, y: MONITOR.bottom - h, w, h };
}

/**
 * Portrait framings are driven by width (a phone is narrow): the subject
 * is `w` wide around (cx, cy), and tall enough that width always decides.
 */
const tall = (cx: number, cy: number, w: number): Rect => {
  const h = w * 2.1;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
};

/** Subject rectangles for each shot: [portrait framing, landscape framing]. */
const SUBJECTS: Record<string, [Rect, Rect]> = {
  wide: [tall(790, 650, 820), { x: 90, y: 20, w: 1420, h: 930 }],
  wideDrift: [tall(795, 630, 770), { x: 150, y: 50, w: 1330, h: 870 }],
  // Over-the-shoulder framings keep the camera centre between the viewer's
  // head and the screen, so his silhouette stays in frame on the left.
  mid: [tall(790, 570, 680), { x: 200, y: 110, w: 1140, h: 740 }],
  ots: [tall(800, 520, 560), { x: 290, y: 175, w: 940, h: 610 }],
  workA: [tall(805, 520, 540), { x: 300, y: 165, w: 920, h: 600 }],
  workB: [tall(810, 510, 510), { x: 335, y: 180, w: 870, h: 570 }],
  contactA: [tall(725, 600, 760), { x: 130, y: 120, w: 1140, h: 760 }],
  contactB: [tall(730, 590, 720), { x: 160, y: 135, w: 1090, h: 730 }],
  outroA: [tall(770, 540, 640), { x: 360, y: 140, w: 1000, h: 680 }],
  outroB: [tall(770, 640, 900), { x: 20, y: -30, w: 1560, h: 1040 }],
};

const mixRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});

const contain = (r: Rect, vw: number, vh: number): Cam => ({
  x: r.x + r.w / 2,
  y: r.y + r.h / 2,
  s: Math.min(vw / r.w, vh / r.h),
});

/**
 * The shot where the monitor's screen exactly covers the viewport and the
 * page inside it is drawn at 1:1 — the hand-off point to normal reading.
 */
export const fillCam = (screen: Rect, vw: number, vh: number): Cam => ({
  x: screen.x + screen.w / 2,
  y: screen.y + screen.h / 2,
  s: Math.max(vw / screen.w, vh / screen.h),
});

export type Shots = {
  wide: Cam;
  fill: Cam;
  orient: number;
  keys: Record<string, Key[]>;
};

export function buildShots(vw: number, vh: number, screen: Rect): Shots {
  const orient = smoothstep(0.85, 1.3, vw / vh);
  const shot = (name: string) =>
    contain(mixRect(SUBJECTS[name][0], SUBJECTS[name][1], orient), vw, vh);
  const fill = fillCam(screen, vw, vh);
  const wide = shot("wide");

  return {
    wide,
    fill,
    orient,
    keys: {
      intro: [
        { t: 0, cam: wide },
        { t: 0.16, cam: shot("wideDrift") },
        { t: 0.5, cam: shot("mid") },
        { t: 0.76, cam: shot("ots") },
        { t: 1, cam: fill },
      ],
      "cut-work": [
        { t: 0, cam: fill },
        { t: 0.4, cam: shot("workA") },
        { t: 0.6, cam: shot("workB") },
        { t: 1, cam: fill },
      ],
      "cut-contact": [
        { t: 0, cam: fill },
        { t: 0.4, cam: shot("contactA") },
        { t: 0.6, cam: shot("contactB") },
        { t: 1, cam: fill },
      ],
      outro: [
        { t: 0, cam: fill },
        { t: 0.45, cam: shot("outroA") },
        { t: 1, cam: shot("outroB") },
      ],
    },
  };
}

/** Samples a camera path; scale is interpolated in log space so zooms feel even. */
export function sampleCam(keys: Key[], u: number): Cam {
  const ts = keys.map((k) => k.t);
  return {
    x: monotone(ts, keys.map((k) => k.cam.x), u),
    y: monotone(ts, keys.map((k) => k.cam.y), u),
    s: Math.exp(monotone(ts, keys.map((k) => Math.log(k.cam.s)), u)),
  };
}
