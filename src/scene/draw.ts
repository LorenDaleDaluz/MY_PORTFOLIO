import type { Cam, Rect } from "../engine/camera";
import {
  TAU,
  clamp,
  lerp,
  mulberry32,
  rgba,
  smoothstep,
  type RGB,
} from "../engine/math";
import type { Pose, Vec } from "./rig";

/**
 * The room is painted as flat layers at different depths (2.5D). Every
 * layer is projected through the same pinhole camera, so moving the camera
 * produces real parallax: the city barely moves, the viewer's head sweeps
 * past, and the monitor's screen lines up exactly with the live page DOM.
 */

export type View = {
  vw: number;
  vh: number;
  dpr: number;
  cam: Cam;
  /** Zoom relative to the wide establishing shot (1 = wide). */
  z: number;
  /** 1 in the wide shot, 0 when the screen fills the viewport. */
  zoomFilm: number;
};

export type SceneInput = {
  t: number;
  glow: RGB;
  screen: Rect;
  pose: Pose;
  ambient: boolean;
  orient: number;
};

type Ctx = CanvasRenderingContext2D;

/** Relative depth of each layer; negative is closer to the camera than the monitor. */
export const DEPTH = {
  city: 2.4,
  wall: 0.28,
  desk: 0,
  keys: -0.06,
  man: -0.3,
  fore: -0.62,
};

function layer(ctx: Ctx, v: View, d: number): number {
  const k = 1 + d * v.z;
  if (k <= 0.04) return 0;
  const s = v.cam.s / k;
  ctx.setTransform(
    v.dpr * s,
    0,
    0,
    v.dpr * s,
    v.dpr * (v.vw / 2 - v.cam.x * s),
    v.dpr * (v.vh / 2 - v.cam.y * s),
  );
  return s;
}

function rr(
  p: Path2D | Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rad = Math.min(r, w / 2, h / 2);
  p.moveTo(x + rad, y);
  p.arcTo(x + w, y, x + w, y + h, rad);
  p.arcTo(x + w, y + h, x, y + h, rad);
  p.arcTo(x, y + h, x, y, rad);
  p.arcTo(x, y, x + w, y, rad);
  p.closePath();
}

function glowAt(
  ctx: Ctx,
  x: number,
  y: number,
  r: number,
  color: RGB,
  a0: number,
  mid = 0.4,
  aMid = a0 * 0.3,
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(color, a0));
  g.addColorStop(mid, rgba(color, aMid));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

/* ------------------------------------------------------------------ */
/* Static layout (world units)                                         */
/* ------------------------------------------------------------------ */

const WIN = { x: 30, y: 40, w: 440, h: 540 };
const SHELF = { x: 1100, y: 438, w: 400 };
const P1 = { x: 1150, y: 92, w: 176, h: 236 };
const P2 = { x: 1354, y: 140, w: 116, h: 150 };
const DESK = { x0: 110, x1: 1490, back: 668, front: 708, face: 34 };
const LAMP_X = 372;
const MUG = { x: 1186, y: 690 };
const PLANT_X = 1350;
const MOON = { x: -760, y: -380 };
const HORIZON = 560;

/** Where the viewer sits (man layer), for portrait and landscape framing. */
const MAN_P: Vec = [712, 618];
const MAN_L: Vec = [652, 606];
const MOUSE: Vec = [246, 114];

/* ------------------------------------------------------------------ */
/* The city outside the window                                         */
/* ------------------------------------------------------------------ */

type Building = { x: number; w: number; h: number };

const CITY = (() => {
  const rnd = mulberry32(20261107);
  const back: Building[] = [];
  const front: Building[] = [];
  const warm = new Path2D();
  const cool = new Path2D();
  const flickers: { x: number; y: number; ph: number }[] = [];

  let x = -4800;
  while (x < 2400) {
    const w = 90 + rnd() * 170;
    back.push({ x, w, h: 260 + Math.pow(rnd(), 1.3) * 520 });
    x += w * (0.7 + rnd() * 0.45);
  }

  x = -4800;
  while (x < 2400) {
    const w = 70 + rnd() * 150;
    const h = 120 + Math.pow(rnd(), 1.7) * 640;
    front.push({ x, w, h });
    const cols = Math.max(1, Math.floor((w - 14) / 17));
    const rows = Math.max(1, Math.floor((h - 24) / 23));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = rnd();
        if (v > 0.24) continue;
        const wx = x + 9 + c * 17;
        const wy = HORIZON - h + 14 + r * 23;
        if (v < 0.012) flickers.push({ x: wx, y: wy, ph: rnd() * 20 });
        else (v < 0.16 ? warm : cool).rect(wx, wy, 8, 11);
      }
    }
    x += w + rnd() * 26 - 6;
  }

  const stars = Array.from({ length: 170 }, () => ({
    x: -4800 + rnd() * 7200,
    y: -2600 + rnd() * 2500,
    r: 0.8 + rnd() * 1.8,
    a: 0.25 + rnd() * 0.6,
    ph: rnd() * 10,
  }));

  const visible = front.filter((b) => b.x > -1700 && b.x < -300);
  const tallest = visible.reduce((a, b) => (b.h > a.h ? b : a), visible[0]);
  const beacon = { x: tallest.x + tallest.w / 2, y: HORIZON - tallest.h - 8 };

  return { back, front, warm, cool, flickers, stars, beacon };
})();

function drawCity(ctx: Ctx, v: View, inp: SceneInput) {
  ctx.save();
  if (!layer(ctx, v, DEPTH.wall)) {
    ctx.restore();
    return;
  }
  ctx.beginPath();
  ctx.rect(WIN.x, WIN.y, WIN.w, WIN.h);
  ctx.clip();
  layer(ctx, v, DEPTH.city);
  const t = inp.ambient ? inp.t : 0;

  const sky = ctx.createLinearGradient(0, -2400, 0, HORIZON);
  sky.addColorStop(0, "#020309");
  sky.addColorStop(0.55, "#060a1f");
  sky.addColorStop(0.86, "#12133a");
  sky.addColorStop(1, "#2c1733");
  ctx.fillStyle = sky;
  ctx.fillRect(-6000, -4000, 10000, 4000 + HORIZON);

  for (const s of CITY.stars) {
    const a = s.a * (0.72 + 0.28 * Math.sin(t * 1.3 + s.ph));
    ctx.fillStyle = `rgba(220,228,255,${a.toFixed(3)})`;
    ctx.fillRect(s.x, s.y, s.r, s.r);
  }

  glowAt(ctx, MOON.x, MOON.y, 280, [150, 170, 255], 0.18, 0.3, 0.05);
  const moon = ctx.createRadialGradient(
    MOON.x - 12,
    MOON.y - 12,
    4,
    MOON.x,
    MOON.y,
    46,
  );
  moon.addColorStop(0, "#fbfaf4");
  moon.addColorStop(1, "#cfcdc4");
  ctx.fillStyle = moon;
  ctx.beginPath();
  ctx.arc(MOON.x, MOON.y, 44, 0, TAU);
  ctx.fill();

  const haze = ctx.createLinearGradient(0, HORIZON - 460, 0, HORIZON);
  haze.addColorStop(0, "rgba(255,90,60,0)");
  haze.addColorStop(1, "rgba(255,90,60,0.12)");
  ctx.fillStyle = haze;
  ctx.fillRect(-6000, HORIZON - 460, 10000, 460);

  ctx.fillStyle = "#0b0c1d";
  for (const b of CITY.back) ctx.fillRect(b.x, HORIZON - b.h, b.w, b.h + 2400);
  ctx.fillStyle = "#05060d";
  for (const b of CITY.front) ctx.fillRect(b.x, HORIZON - b.h, b.w, b.h + 2400);

  ctx.fillStyle = "rgba(255,196,140,0.55)";
  ctx.fill(CITY.warm);
  ctx.fillStyle = "rgba(150,190,255,0.32)";
  ctx.fill(CITY.cool);
  for (const f of CITY.flickers) {
    const on = Math.sin(t * 2.2 + f.ph) > 0.2 ? 0.75 : 0.06;
    ctx.fillStyle = `rgba(255,220,170,${on})`;
    ctx.fillRect(f.x, f.y, 8, 11);
  }

  const blink = Math.sin(t * 3.1) > 0.55 ? 1 : 0.12;
  glowAt(ctx, CITY.beacon.x, CITY.beacon.y, 46, [255, 50, 40], 0.7 * blink, 0.25);
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Back wall: window, curtain, posters, shelf                          */
/* ------------------------------------------------------------------ */

function drawWall(ctx: Ctx, v: View, inp: SceneInput) {
  if (!layer(ctx, v, DEPTH.wall)) return;
  const g = inp.glow;
  const t = inp.ambient ? inp.t : 0;

  const wall = new Path2D();
  wall.rect(-6000, -5000, 13000, 6000);
  wall.rect(WIN.x, WIN.y, WIN.w, WIN.h);
  const wg = ctx.createLinearGradient(0, -700, 0, 1000);
  wg.addColorStop(0, "#08070a");
  wg.addColorStop(0.6, "#110d10");
  wg.addColorStop(1, "#0c090a");
  ctx.fillStyle = wg;
  ctx.fill(wall, "evenodd");

  const fg = ctx.createLinearGradient(0, 1000, 0, 2200);
  fg.addColorStop(0, "#0a0708");
  fg.addColorStop(1, "#040304");
  ctx.fillStyle = fg;
  ctx.fillRect(-6000, 1000, 13000, 4000);
  ctx.fillStyle = "#0f0b0c";
  ctx.fillRect(-6000, 978, 13000, 22);

  ctx.globalCompositeOperation = "lighter";
  glowAt(ctx, 860, 450, 1300, g, 0.2, 0.35, 0.06);
  glowAt(ctx, LAMP_X, 540, 380, [255, 110, 40], 0.13, 0.4, 0.035);
  glowAt(ctx, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, 780, [90, 120, 255], 0.07, 0.4, 0.02);
  ctx.save();
  ctx.translate(WIN.x + WIN.w * 0.6, 1130);
  ctx.scale(1, 0.22);
  glowAt(ctx, 0, 0, 560, [110, 140, 255], 0.09);
  ctx.restore();
  ctx.globalCompositeOperation = "source-over";

  drawWindowFrame(ctx, t);
  drawPosters(ctx, g);
  drawShelf(ctx, g);
}

function drawWindowFrame(ctx: Ctx, t: number) {
  const f = 16;
  const frame = new Path2D();
  frame.rect(WIN.x - f, WIN.y - f, WIN.w + f * 2, WIN.h + f * 2);
  frame.rect(WIN.x, WIN.y, WIN.w, WIN.h);
  ctx.fillStyle = "#0c0909";
  ctx.fill(frame, "evenodd");
  ctx.fillRect(WIN.x + WIN.w / 2 - 5, WIN.y, 10, WIN.h);
  ctx.fillRect(WIN.x, WIN.y + WIN.h * 0.44 - 5, WIN.w, 10);

  ctx.strokeStyle = "rgba(140,165,255,0.16)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(WIN.x + 1, WIN.y + 1, WIN.w - 2, WIN.h - 2);

  const sheen = ctx.createLinearGradient(WIN.x, WIN.y, WIN.x + WIN.w, WIN.y + WIN.h);
  sheen.addColorStop(0, "rgba(255,255,255,0)");
  sheen.addColorStop(0.46, "rgba(255,255,255,0.035)");
  sheen.addColorStop(0.5, "rgba(255,255,255,0)");
  sheen.addColorStop(0.62, "rgba(255,255,255,0.02)");
  sheen.addColorStop(0.66, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);

  ctx.fillStyle = "#120d0d";
  ctx.fillRect(WIN.x - 32, WIN.y + WIN.h + f, WIN.w + 64, 14);
  ctx.fillStyle = "rgba(150,170,255,0.12)";
  ctx.fillRect(WIN.x - 32, WIN.y + WIN.h + f, WIN.w + 64, 2);

  ctx.strokeStyle = "#1a1414";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(WIN.x - 80, WIN.y - 42);
  ctx.lineTo(WIN.x + WIN.w + 80, WIN.y - 42);
  ctx.stroke();

  // A sheer curtain, breathing in the draft.
  const top = WIN.y - 42;
  const bot = WIN.y + WIN.h + 60;
  const left = WIN.x - 70;
  const curtain = new Path2D();
  curtain.moveTo(left, top);
  curtain.lineTo(left + 160, top);
  for (let i = 1; i <= 14; i++) {
    const k = i / 14;
    const y = lerp(top, bot, k);
    curtain.lineTo(left + 160 + Math.sin(t * 0.9 + i * 0.7) * 12 * k + k * 34, y);
  }
  curtain.lineTo(left - 8, bot);
  curtain.closePath();
  ctx.fillStyle = "rgba(160,175,235,0.075)";
  ctx.fill(curtain);
  ctx.strokeStyle = "rgba(190,205,255,0.05)";
  ctx.lineWidth = 3;
  for (let j = 0; j < 6; j++) {
    const x0 = left + 16 + j * 26;
    ctx.beginPath();
    ctx.moveTo(x0, top);
    ctx.bezierCurveTo(
      x0 + 6,
      top + 220,
      x0 - 6 + Math.sin(t * 0.9 + j) * 6,
      top + 440,
      x0 + 4 + j * 5,
      bot,
    );
    ctx.stroke();
  }
}

function drawPosters(ctx: Ctx, g: RGB) {
  ctx.fillStyle = "#0b0909";
  ctx.beginPath();
  rr(ctx, P1.x - 8, P1.y - 8, P1.w + 16, P1.h + 16, 3);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.rect(P1.x, P1.y, P1.w, P1.h);
  ctx.clip();
  ctx.fillStyle = "#070606";
  ctx.fillRect(P1.x, P1.y, P1.w, P1.h);
  glowAt(ctx, P1.x + P1.w * 0.64, P1.y + P1.h * 0.46, 140, [255, 60, 30], 0.85, 0.45, 0.32);
  glowAt(ctx, P1.x + P1.w * 0.24, P1.y + P1.h * 0.72, 120, [50, 80, 255], 0.7, 0.4, 0.22);
  ctx.strokeStyle = "rgba(255,255,255,0.32)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(P1.x + P1.w / 2, P1.y + P1.h * 0.52, 54, 0, TAU);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 15; c++) {
      if ((c * 7 + r * 3) % 5 === 0) continue;
      ctx.fillRect(P1.x + 18 + c * 9.5, P1.y + 18 + r * 9, 3.4, 3.4);
    }
  }
  ctx.restore();

  ctx.fillStyle = "#0b0909";
  ctx.beginPath();
  rr(ctx, P2.x - 7, P2.y - 7, P2.w + 14, P2.h + 14, 3);
  ctx.fill();
  const p2 = ctx.createLinearGradient(0, P2.y, 0, P2.y + P2.h);
  p2.addColorStop(0, "#14205a");
  p2.addColorStop(1, "#ff7b4a");
  ctx.fillStyle = p2;
  ctx.fillRect(P2.x, P2.y, P2.w, P2.h);
  ctx.fillStyle = "rgba(255,240,230,0.9)";
  ctx.beginPath();
  ctx.arc(P2.x + P2.w / 2, P2.y + P2.h * 0.58, 18, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "rgba(10,8,12,0.85)";
  ctx.fillRect(P2.x, P2.y + P2.h * 0.72, P2.w, P2.h * 0.28);

  // Screen light grazing the frames from the left.
  ctx.globalCompositeOperation = "lighter";
  const lit = ctx.createLinearGradient(P1.x - 40, 0, P2.x + P2.w, 0);
  lit.addColorStop(0, rgba(g, 0.16));
  lit.addColorStop(1, rgba(g, 0));
  ctx.fillStyle = lit;
  ctx.fillRect(P1.x - 8, P1.y - 8, P2.x + P2.w - P1.x + 16, P1.h + 16);
  ctx.globalCompositeOperation = "source-over";
}

function drawShelf(ctx: Ctx, g: RGB) {
  const { x, y, w } = SHELF;
  const books: [number, number, number, string, number][] = [
    [x + 22, 26, 112, "#2b1a1c", 0],
    [x + 50, 20, 94, "#1b2236", 0],
    [x + 72, 30, 120, "#3a2618", 0],
    [x + 104, 22, 86, "#24201f", 0],
    [x + 130, 18, 104, "#40191b", 0.14],
  ];
  for (const [bx, bw, bh, color, tilt] of books) {
    ctx.save();
    ctx.translate(bx + bw / 2, y);
    ctx.rotate(tilt);
    ctx.fillStyle = color;
    ctx.fillRect(-bw / 2, -bh, bw, bh);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(-bw / 2 + 3, -bh + 12, bw - 6, 3);
    ctx.restore();
  }

  // A small trophy — two-time dance champion.
  const tx = x + 248;
  const cup = new Path2D();
  cup.moveTo(tx - 22, y - 78);
  cup.lineTo(tx + 22, y - 78);
  cup.quadraticCurveTo(tx + 20, y - 44, tx + 4, y - 38);
  cup.lineTo(tx + 4, y - 20);
  cup.lineTo(tx + 14, y - 12);
  cup.lineTo(tx + 14, y);
  cup.lineTo(tx - 14, y);
  cup.lineTo(tx - 14, y - 12);
  cup.lineTo(tx - 4, y - 20);
  cup.lineTo(tx - 4, y - 38);
  cup.quadraticCurveTo(tx - 20, y - 44, tx - 22, y - 78);
  cup.closePath();
  const gold = ctx.createLinearGradient(tx - 22, 0, tx + 22, 0);
  gold.addColorStop(0, "#d8ac5a");
  gold.addColorStop(0.45, "#6e5023");
  gold.addColorStop(1, "#2b1f0f");
  ctx.fillStyle = gold;
  ctx.fill(cup);
  ctx.strokeStyle = "#6e5023";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(tx - 24, y - 64, 9, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();

  // Tiny cactus.
  const cx = x + 336;
  ctx.fillStyle = "#1a1012";
  ctx.beginPath();
  ctx.moveTo(cx - 16, y - 30);
  ctx.lineTo(cx + 16, y - 30);
  ctx.lineTo(cx + 12, y);
  ctx.lineTo(cx - 12, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#0f1a14";
  ctx.beginPath();
  rr(ctx, cx - 8, y - 74, 16, 46, 8);
  ctx.fill();
  ctx.beginPath();
  rr(ctx, cx + 4, y - 60, 12, 20, 6);
  ctx.fill();

  ctx.fillStyle = "#17110f";
  ctx.fillRect(x, y, w, 12);
  ctx.fillStyle = rgba(g, 0.14);
  ctx.fillRect(x, y, w, 1.5);
}

/* ------------------------------------------------------------------ */
/* Desk, monitor, lamp, mug, plant                                     */
/* ------------------------------------------------------------------ */

const LAMP = (() => {
  const x = LAMP_X;
  const glass = new Path2D();
  glass.moveTo(x - 25, 630);
  glass.quadraticCurveTo(x - 31, 560, x - 14, 472);
  glass.lineTo(x + 14, 472);
  glass.quadraticCurveTo(x + 31, 560, x + 25, 630);
  glass.closePath();
  const base = new Path2D();
  base.moveTo(x - 40, 690);
  base.lineTo(x + 40, 690);
  base.lineTo(x + 23, 630);
  base.lineTo(x - 23, 630);
  base.closePath();
  const cap = new Path2D();
  cap.moveTo(x - 14, 473);
  cap.lineTo(x + 14, 473);
  cap.lineTo(x + 8, 448);
  cap.lineTo(x - 8, 448);
  cap.closePath();
  return { glass, base, cap };
})();

const LAVA_BLOBS: [number, number, number][] = [
  [0.13, 0, 15],
  [0.09, 2.1, 11],
  [0.07, 4.2, 17],
  [0.11, 5.3, 9],
];

function drawLavaLamp(ctx: Ctx, t: number) {
  const x = LAMP_X;
  ctx.globalCompositeOperation = "lighter";
  glowAt(ctx, x, 560, 180, [255, 100, 30], 0.32, 0.35, 0.08);
  ctx.globalCompositeOperation = "source-over";

  const liquid = ctx.createLinearGradient(0, 472, 0, 630);
  liquid.addColorStop(0, "#5e0b08");
  liquid.addColorStop(1, "#c4260f");
  ctx.fillStyle = liquid;
  ctx.fill(LAMP.glass);

  ctx.save();
  ctx.clip(LAMP.glass);
  for (const [speed, phase, r] of LAVA_BLOBS) {
    const k = (Math.sin(t * speed * 2 + phase) + 1) / 2;
    const y = 612 - k * 128;
    const bx = x + Math.sin(t * 0.5 + phase) * 5;
    const stretch = 1 + Math.cos(t * speed * 2 + phase) * 0.25;
    const blob = ctx.createRadialGradient(bx - r * 0.3, y - r * 0.3, 1, bx, y, r * 1.2);
    blob.addColorStop(0, "#ffd890");
    blob.addColorStop(0.5, "#ff9a3a");
    blob.addColorStop(1, "#ff5a1f");
    ctx.fillStyle = blob;
    ctx.beginPath();
    ctx.ellipse(bx, y, r * 0.9, r * stretch, 0, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = "#ff8a35";
  ctx.beginPath();
  ctx.ellipse(x, 632, 27, 10, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "rgba(255,220,200,0.24)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 17, 615);
  ctx.quadraticCurveTo(x - 21, 560, x - 9, 480);
  ctx.stroke();

  const metal = ctx.createLinearGradient(x - 40, 0, x + 40, 0);
  metal.addColorStop(0, "#0d0b0b");
  metal.addColorStop(0.35, "#3a2620");
  metal.addColorStop(1, "#0d0b0b");
  ctx.fillStyle = metal;
  ctx.fill(LAMP.base);
  ctx.fill(LAMP.cap);
  ctx.fillStyle = "rgba(255,140,60,0.5)";
  ctx.fillRect(x - 23, 629, 46, 2);
}

function steam(
  ctx: Ctx,
  x: number,
  y: number,
  t: number,
  scale: number,
  alpha = 1,
) {
  ctx.lineCap = "round";
  for (let i = 0; i < 3; i++) {
    const ph = t * 0.9 + i * 2.1;
    const a = (0.05 + 0.04 * Math.sin(ph * 1.3)) * alpha;
    ctx.strokeStyle = `rgba(255,236,226,${a.toFixed(3)})`;
    ctx.lineWidth = 3.5 * scale;
    ctx.beginPath();
    const x0 = x + (i - 1) * 7 * scale;
    ctx.moveTo(x0, y);
    for (let k = 1; k <= 6; k++) {
      ctx.lineTo(
        x0 + Math.sin(ph + k * 0.8) * 5 * scale * (k / 6 + 0.3),
        y - k * 14 * scale,
      );
    }
    ctx.stroke();
  }
}

function mugPath(x: number, y: number) {
  const body = new Path2D();
  body.moveTo(x - 22, y - 46);
  body.lineTo(x + 22, y - 46);
  body.lineTo(x + 21, y - 6);
  body.quadraticCurveTo(x + 20, y, x + 13, y);
  body.lineTo(x - 13, y);
  body.quadraticCurveTo(x - 20, y, x - 21, y - 6);
  body.closePath();
  return body;
}

function drawDeskMug(ctx: Ctx, g: RGB, t: number, ambient: boolean, alpha: number) {
  const { x, y } = MUG;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#1a1517";
  ctx.beginPath();
  ctx.ellipse(x + 25, y - 26, 10, 13, 0, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  const body = mugPath(x, y);
  ctx.save();
  ctx.translate(-2.4, -1);
  ctx.fillStyle = rgba(g, 0.7);
  ctx.fill(body);
  ctx.restore();
  ctx.fillStyle = "#1a1517";
  ctx.fill(body);
  ctx.fillStyle = "#0b090a";
  ctx.beginPath();
  ctx.ellipse(x, y - 46, 22, 5, 0, 0, TAU);
  ctx.fill();
  if (ambient) steam(ctx, x, y - 54, t, 1);
  ctx.restore();
}

const LEAVES: [number, number, number, number][] = [
  [-14, 150, -22, 22],
  [-4, 196, -6, 26],
  [8, 172, 14, 24],
  [18, 128, 30, 20],
  [-22, 110, -40, 18],
];

function drawPlant(ctx: Ctx, g: RGB) {
  const x = PLANT_X;
  const by = 636;
  for (const [ox, h, lean, w] of LEAVES) {
    const bx = x + ox;
    const leaf = new Path2D();
    leaf.moveTo(bx - w / 2, by);
    leaf.quadraticCurveTo(bx - w * 0.6 + lean * 0.4, by - h * 0.55, bx + lean, by - h);
    leaf.quadraticCurveTo(bx + w * 0.6 + lean * 0.4, by - h * 0.55, bx + w / 2, by);
    leaf.closePath();
    ctx.save();
    ctx.translate(-2.2, -1.2);
    ctx.fillStyle = rgba(g, 0.5);
    ctx.fill(leaf);
    ctx.restore();
    ctx.fillStyle = "#0b110d";
    ctx.fill(leaf);
  }
  ctx.fillStyle = "#161013";
  ctx.beginPath();
  ctx.moveTo(x - 30, 632);
  ctx.lineTo(x + 30, 632);
  ctx.lineTo(x + 23, 690);
  ctx.lineTo(x - 23, 690);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = rgba(g, 0.22);
  ctx.fillRect(x - 30, 632, 60, 1.5);
}

export type ScreenPainter = (ctx: Ctx, screen: Rect) => void;

function drawDesk(ctx: Ctx, v: View, inp: SceneInput, paintScreen?: ScreenPainter) {
  if (!layer(ctx, v, DEPTH.desk)) return;
  const g = inp.glow;
  const S = inp.screen;
  const t = inp.ambient ? inp.t : 12;
  const scx = S.x + S.w / 2;

  ctx.globalCompositeOperation = "lighter";
  glowAt(ctx, scx, S.y + S.h / 2, Math.max(S.w, S.h) * 1.05, g, 0.26, 0.45, 0.07);
  ctx.globalCompositeOperation = "source-over";

  const top = new Path2D();
  top.moveTo(DESK.x0 + 30, DESK.back);
  top.lineTo(DESK.x1 - 30, DESK.back);
  top.lineTo(DESK.x1, DESK.front);
  top.lineTo(DESK.x0, DESK.front);
  top.closePath();
  const dg = ctx.createLinearGradient(0, DESK.back, 0, DESK.front);
  dg.addColorStop(0, "#1d1513");
  dg.addColorStop(1, "#130e0c");
  ctx.fillStyle = dg;
  ctx.fill(top);

  ctx.save();
  ctx.clip(top);
  ctx.globalCompositeOperation = "lighter";
  ctx.translate(scx, DESK.back + 8);
  ctx.scale(1, 0.1);
  glowAt(ctx, 0, 0, S.w * 0.95, g, 0.5, 0.4, 0.15);
  ctx.restore();

  ctx.fillStyle = "#0a0706";
  ctx.fillRect(DESK.x0, DESK.front, DESK.x1 - DESK.x0, DESK.face);
  ctx.fillStyle = rgba(g, 0.12);
  ctx.fillRect(DESK.x0, DESK.front, DESK.x1 - DESK.x0, 1.5);
  ctx.fillStyle = "#070505";
  ctx.fillRect(DESK.x0 + 24, DESK.front + DESK.face, 26, 320);
  ctx.fillRect(DESK.x1 - 50, DESK.front + DESK.face, 26, 320);

  // Monitor stand and bezel.
  ctx.fillStyle = "#0d0d0f";
  ctx.fillRect(scx - 14, S.y + S.h, 28, DESK.back + 4 - (S.y + S.h));
  ctx.beginPath();
  ctx.ellipse(scx, DESK.back + 5, 76, 7, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = rgba(g, 0.2);
  ctx.fillRect(scx - 14, S.y + S.h, 2, DESK.back - (S.y + S.h));

  ctx.fillStyle = "#08080a";
  ctx.beginPath();
  rr(ctx, S.x - 11, S.y - 11, S.w + 22, S.h + 22, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  if (paintScreen) paintScreen(ctx, S);
  else {
    ctx.fillStyle = "#050505";
    ctx.fillRect(S.x - 1, S.y - 1, S.w + 2, S.h + 2);
  }

  drawLavaLamp(ctx, t);
  if (inp.pose.mug < 0.99) drawDeskMug(ctx, g, t, inp.ambient, 1 - inp.pose.mug);
  drawPlant(ctx, g);
}

function drawKeyboard(ctx: Ctx, v: View, inp: SceneInput) {
  if (!layer(ctx, v, DEPTH.keys)) return;
  const g = inp.glow;
  ctx.globalCompositeOperation = "lighter";
  ctx.save();
  ctx.translate(850, 694);
  ctx.scale(1, 0.08);
  glowAt(ctx, 0, 0, 230, g, 0.35);
  ctx.restore();
  ctx.globalCompositeOperation = "source-over";
  const kb = new Path2D();
  kb.moveTo(700, 680);
  kb.lineTo(1000, 680);
  kb.lineTo(1014, 694);
  kb.lineTo(686, 694);
  kb.closePath();
  ctx.fillStyle = "#0e0d10";
  ctx.fill(kb);
  ctx.fillStyle = rgba(g, 0.4);
  ctx.fillRect(700, 680, 300, 1);
  ctx.fillStyle = rgba(g, 0.14);
  for (let i = 0; i < 24; i++) ctx.fillRect(708 + i * 12, 685, 7, 2);
}

/** Everything behind the live page: city, wall, desk, monitor. */
export function drawBack(ctx: Ctx, v: View, inp: SceneInput, paintScreen?: ScreenPainter) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.filter = "none";
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#030304";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawCity(ctx, v, inp);
  drawWall(ctx, v, inp);
  drawDesk(ctx, v, inp, paintScreen);
  drawKeyboard(ctx, v, inp);
}

/* ------------------------------------------------------------------ */
/* The viewer                                                          */
/* ------------------------------------------------------------------ */

const BODY = "#0b0a0d";
const SKIN = "#120b09";
const HAIR = "#070608";

type Light = { g: RGB; rim: number; glowPx: number };

const HEAD = (() => {
  const p = new Path2D();
  const rx = 54;
  const ry = 64;
  const n = 84;
  for (let i = 0; i <= n; i++) {
    const a = Math.PI + (i / n) * TAU;
    let x = Math.cos(a) * rx;
    let y = Math.sin(a) * ry;
    if (y < 8) {
      // Curls along the backlit top of the head.
      const bump = 1.03 + 0.045 * Math.abs(Math.sin(a * 7.5));
      x *= bump;
      y *= bump;
    } else {
      x *= 0.92 - 0.14 * clamp(y / ry);
    }
    if (i === 0) p.moveTo(x, y);
    else p.lineTo(x, y);
  }
  p.closePath();
  return p;
})();

const NECK = (() => {
  const p = new Path2D();
  p.moveTo(-25, -54);
  p.lineTo(25, -54);
  p.lineTo(29, 8);
  p.lineTo(-29, 8);
  p.closePath();
  return p;
})();

const CHAIR = (() => {
  const p = new Path2D();
  p.moveTo(-112, 198);
  p.bezierCurveTo(-112, 152, -60, 140, 0, 140);
  p.bezierCurveTo(60, 140, 112, 152, 112, 198);
  p.lineTo(108, 470);
  p.quadraticCurveTo(106, 502, 76, 502);
  p.lineTo(-76, 502);
  p.quadraticCurveTo(-106, 502, -108, 470);
  p.closePath();
  return p;
})();

function rimFill(
  ctx: Ctx,
  p: Path2D,
  L: Light,
  body: string,
  red = 0.9,
  blue = 0.32,
  glow = true,
) {
  const r = L.rim;
  ctx.save();
  ctx.translate(-r * 0.9, -r * 0.7);
  ctx.fillStyle = `rgba(120,148,255,${blue})`;
  ctx.fill(p);
  ctx.restore();
  ctx.save();
  ctx.translate(r, -r * 1.2);
  ctx.fillStyle = rgba(L.g, red);
  if (glow) {
    ctx.shadowColor = rgba(L.g, 0.6);
    ctx.shadowBlur = L.glowPx;
  }
  ctx.fill(p);
  ctx.restore();
  ctx.fillStyle = body;
  ctx.fill(p);
}

function rimStroke(
  ctx: Ctx,
  p: Path2D,
  width: number,
  L: Light,
  body: string,
  red = 0.85,
  blue = 0.3,
) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = width;
  const r = L.rim;
  ctx.save();
  ctx.translate(-r * 0.9, -r * 0.7);
  ctx.strokeStyle = `rgba(120,148,255,${blue})`;
  ctx.stroke(p);
  ctx.restore();
  ctx.save();
  ctx.translate(r, -r * 1.2);
  ctx.strokeStyle = rgba(L.g, red);
  ctx.stroke(p);
  ctx.restore();
  ctx.strokeStyle = body;
  ctx.stroke(p);
}

function torsoPath(P: Pose, br: number) {
  const [lx, ly0] = P.shL;
  const [rx, ry0] = P.shR;
  const ly = ly0 + br - P.hunch * 4;
  const ry = ry0 + br - P.hunch * 4;
  const p = new Path2D();
  p.moveTo(-30, -10);
  p.bezierCurveTo(-62, -2 + br, lx + 48, ly - 18, lx, ly);
  p.bezierCurveTo(lx - 24, ly + 6, lx - 34, ly + 46, lx - 28, ly + 96);
  p.lineTo(lx + 22, 470);
  p.lineTo(rx - 22, 470);
  p.lineTo(rx + 28, ry + 96);
  p.bezierCurveTo(rx + 34, ry + 46, rx + 24, ry + 6, rx, ry);
  p.bezierCurveTo(rx - 48, ry - 18, 62, -2 + br, 30, -10);
  p.closePath();
  return p;
}

function hoodPath(br: number) {
  const p = new Path2D();
  p.moveTo(-72, -4 + br);
  p.bezierCurveTo(-58, 42 + br, 58, 42 + br, 72, -4 + br);
  p.bezierCurveTo(46, 16 + br, -46, 16 + br, -72, -4 + br);
  p.closePath();
  return p;
}

function drawArm(ctx: Ctx, L: Light, sh: Vec, el: Vec, ha: Vec, side: -1 | 1) {
  const upper = new Path2D();
  upper.moveTo(sh[0] - side * 22, sh[1] + 26);
  upper.lineTo(el[0], el[1]);
  rimStroke(ctx, upper, 60, L, BODY, 0.6, 0.26);
  const fore = new Path2D();
  fore.moveTo(el[0], el[1]);
  fore.lineTo(ha[0], ha[1]);
  rimStroke(ctx, fore, 46, L, BODY, 0.6, 0.26);
  const hand = new Path2D();
  hand.ellipse(ha[0], ha[1], 21, 17, 0, 0, TAU);
  rimFill(ctx, hand, L, SKIN, 0.75, 0.25, false);
}

function drawArms(ctx: Ctx, L: Light, P: Pose, t: number, ambient: boolean) {
  drawArm(ctx, L, P.shR, P.elR, P.haR, 1);
  drawArm(ctx, L, P.shL, P.elL, P.haL, -1);
  if (P.mug > 0.01) {
    const [hx, hy] = P.haL;
    const x = hx + 10;
    const y = hy + 18;
    ctx.save();
    ctx.globalAlpha *= P.mug;
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#17131a";
    ctx.beginPath();
    ctx.ellipse(x - 25, y - 26, 10, 13, 0, Math.PI / 2, Math.PI * 1.5);
    ctx.stroke();
    rimFill(ctx, mugPath(x, y), L, "#17131a", 0.8, 0.3, false);
    if (ambient) steam(ctx, x, y - 54, t, 1.1, P.mug);
    ctx.restore();
  }
}

function drawHead(ctx: Ctx, L: Light, P: Pose, t: number) {
  ctx.save();
  ctx.translate(P.head[0] + Math.sin(t * 0.37) * 1.5, P.head[1]);
  ctx.rotate(P.tilt + Math.sin(t * 0.21) * 0.02);
  ctx.scale(P.headScale, P.headScale);

  // Backlit ears glow red where the screen light passes through them.
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * 50, 12);
    ctx.rotate(side * 0.2);
    const ear = new Path2D();
    ear.ellipse(0, 0, 10, 18, 0, 0, TAU);
    const eg = ctx.createRadialGradient(side * 3, -2, 1, 0, 0, 18);
    eg.addColorStop(0, rgba([255, 120, 80], 0.95));
    eg.addColorStop(0.6, rgba(L.g, 0.6));
    eg.addColorStop(1, "rgba(30,8,6,0.95)");
    ctx.fillStyle = eg;
    ctx.fill(ear);
    ctx.restore();
  }

  rimFill(ctx, HEAD, L, HAIR, 0.95, 0.35);

  // A few backlit strands.
  ctx.strokeStyle = rgba(L.g, 0.16);
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const a = -2.5 + i * 0.32;
    ctx.beginPath();
    ctx.arc(0, 4, 44 - i * 3, a, a + 0.5);
    ctx.stroke();
  }
  ctx.restore();
}

function drawMan(ctx: Ctx, inp: SceneInput, pxScale: number, dpr: number) {
  const P = inp.pose;
  const t = inp.ambient ? inp.t : 0;
  // Rim width stays close to a constant ~2.5px on screen at any distance.
  const L: Light = {
    g: inp.glow,
    rim: 0.3 + 2.3 / Math.max(0.35, pxScale),
    glowPx: 20 * dpr,
  };
  const anchor: Vec = [
    lerp(MAN_P[0], MAN_L[0], inp.orient),
    lerp(MAN_P[1], MAN_L[1], inp.orient),
  ];
  const br = Math.sin(t * 1.35) * 1.6;

  ctx.save();
  ctx.translate(anchor[0], anchor[1]);

  // The screen's light blooming around his silhouette.
  glowAt(ctx, P.head[0], P.head[1] - 6, 250, inp.glow, 0.12, 0.45, 0.04);

  ctx.fillStyle = "#0f0f12";
  ctx.beginPath();
  ctx.ellipse(MOUSE[0], MOUSE[1], 22, 11, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = rgba(inp.glow, 0.85);
  ctx.beginPath();
  ctx.ellipse(MOUSE[0], MOUSE[1] - 8, 6, 2, 0, 0, TAU);
  ctx.fill();

  if (P.front < 0.5) drawArms(ctx, L, P, t, inp.ambient);
  rimFill(ctx, NECK, L, SKIN, 0.6, 0.22, false);
  rimFill(ctx, torsoPath(P, br), L, BODY, 0.62, 0.28);
  rimFill(ctx, hoodPath(br), L, "#0e0d11", 0.45, 0.2, false);
  drawHead(ctx, L, P, t);
  if (P.front >= 0.5) drawArms(ctx, L, P, t, inp.ambient);

  rimFill(ctx, CHAIR, L, "#0c0c0f", 0.5, 0.2, false);
  ctx.save();
  ctx.clip(CHAIR);
  ctx.strokeStyle = "rgba(255,255,255,0.028)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(-130 + i * 14, 130);
    ctx.lineTo(-170 + i * 14, 520);
    ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
}

function drawForeground(ctx: Ctx, g: RGB) {
  const leaves: [number, number, number, number, number][] = [
    [530, 720, -0.95, 270, 74],
    [574, 736, -0.5, 300, 82],
    [494, 742, -1.3, 220, 62],
    [618, 744, -0.18, 210, 60],
  ];
  for (const [x, y, ang, len, w] of leaves) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    const leaf = new Path2D();
    leaf.moveTo(0, 0);
    leaf.quadraticCurveTo(w, -len * 0.5, 0, -len);
    leaf.quadraticCurveTo(-w, -len * 0.5, 0, 0);
    ctx.fillStyle = "#060807";
    ctx.fill(leaf);
    ctx.strokeStyle = rgba(g, 0.28);
    ctx.lineWidth = 3;
    ctx.stroke(leaf);
    ctx.restore();
  }
}

let manBuffer: HTMLCanvasElement | null = null;

/** Everything in front of the live page: glare, the viewer, foreground, vignette. */
export function drawFront(ctx: Ctx, v: View, inp: SceneInput, vignette = true) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.filter = "none";
  ctx.shadowBlur = 0;
  ctx.clearRect(0, 0, W, H);

  // Glass glare and falloff across the monitor while we're in the room.
  if (v.zoomFilm > 0.01 && layer(ctx, v, DEPTH.desk)) {
    const S = inp.screen;
    const a = v.zoomFilm;
    ctx.save();
    ctx.beginPath();
    ctx.rect(S.x, S.y, S.w, S.h);
    ctx.clip();
    const glare = ctx.createLinearGradient(S.x, S.y, S.x + S.w * 0.7, S.y + S.h);
    glare.addColorStop(0, `rgba(255,255,255,${(0.08 * a).toFixed(3)})`);
    glare.addColorStop(0.34, `rgba(255,255,255,${(0.015 * a).toFixed(3)})`);
    glare.addColorStop(0.35, "rgba(255,255,255,0)");
    ctx.fillStyle = glare;
    ctx.fillRect(S.x, S.y, S.w, S.h);
    const cx = S.x + S.w / 2;
    const cy = S.y + S.h / 2;
    const inner = ctx.createRadialGradient(cx, cy, Math.min(S.w, S.h) * 0.35, cx, cy, Math.max(S.w, S.h) * 0.78);
    inner.addColorStop(0, "rgba(0,0,0,0)");
    inner.addColorStop(1, `rgba(0,0,0,${(0.38 * a).toFixed(3)})`);
    ctx.fillStyle = inner;
    ctx.fillRect(S.x, S.y, S.w, S.h);
    ctx.restore();
  }

  // The viewer. Close to the lens he goes soft and fades, like a real dolly past a shoulder.
  const k = 1 + DEPTH.man * v.z;
  if (k > 0.06) {
    const near = 1 / k;
    const alpha = smoothstep(0.06, 0.2, k);
    const blur = clamp((near - 2.3) * 2.4, 0, 18);
    if (blur < 0.6) {
      const s = layer(ctx, v, DEPTH.man);
      ctx.globalAlpha = alpha;
      drawMan(ctx, inp, s * v.dpr, v.dpr);
    } else {
      // Render him at half resolution, then blur once while compositing.
      if (!manBuffer) manBuffer = document.createElement("canvas");
      const bw = Math.max(1, Math.round(W / 2));
      const bh = Math.max(1, Math.round(H / 2));
      if (manBuffer.width !== bw || manBuffer.height !== bh) {
        manBuffer.width = bw;
        manBuffer.height = bh;
      }
      const b = manBuffer.getContext("2d");
      if (b) {
        b.setTransform(1, 0, 0, 1, 0, 0);
        b.clearRect(0, 0, bw, bh);
        b.globalAlpha = 1;
        b.filter = "none";
        const half: View = { ...v, dpr: v.dpr / 2 };
        const s = layer(b, half, DEPTH.man);
        drawMan(b, inp, s * half.dpr, half.dpr);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = alpha;
        ctx.filter = `blur(${(blur * v.dpr * 0.5).toFixed(1)}px)`;
        ctx.drawImage(manBuffer, 0, 0, W, H);
        ctx.filter = "none";
      }
    }
    ctx.globalAlpha = 1;
  }

  // An out-of-focus plant right in front of the lens (only in the widest shots).
  const kf = 1 + DEPTH.fore * v.z;
  if (kf > 0.14) {
    layer(ctx, v, DEPTH.fore);
    ctx.save();
    ctx.globalAlpha = smoothstep(0.14, 0.32, kf);
    ctx.filter = `blur(${(10 * v.dpr).toFixed(1)}px)`;
    drawForeground(ctx, inp.glow);
    ctx.restore();
    ctx.filter = "none";
  }

  if (vignette && v.zoomFilm > 0.01) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.32, W / 2, H / 2, Math.hypot(W, H) * 0.62);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, `rgba(0,0,0,${(0.72 * v.zoomFilm).toFixed(3)})`);
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
  }
}
