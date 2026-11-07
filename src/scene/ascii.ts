import { buildShots, screenRectFor, type Rect } from "../engine/camera";
import { TAU } from "../engine/math";
import { drawBack, drawFront, type View } from "./draw";
import { POSES } from "./rig";

const RAMP = " .:-=+*#%@";

/** A tiny stand-in for the hero page so the monitor reads as lit in the ASCII preview. */
function paintFakePage(ctx: CanvasRenderingContext2D, S: Rect) {
  ctx.fillStyle = "#120404";
  ctx.fillRect(S.x, S.y, S.w, S.h);
  const g = ctx.createRadialGradient(
    S.x + S.w / 2,
    S.y + S.h * 0.55,
    0,
    S.x + S.w / 2,
    S.y + S.h * 0.55,
    Math.max(S.w, S.h) * 0.6,
  );
  g.addColorStop(0, "#ff7a50");
  g.addColorStop(0.5, "#c0201a");
  g.addColorStop(1, "#200606");
  ctx.fillStyle = g;
  ctx.fillRect(S.x, S.y, S.w, S.h);
  ctx.fillStyle = "#1a0505";
  ctx.beginPath();
  ctx.ellipse(S.x + S.w / 2, S.y + S.h * 0.44, S.w * 0.07, S.h * 0.12, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(S.x + S.w / 2, S.y + S.h * 0.92, S.w * 0.2, S.h * 0.3, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#ffe6dc";
  ctx.fillRect(S.x + S.w * 0.12, S.y + S.h * 0.06, S.w * 0.76, S.h * 0.07);
}

/** Renders the opening shot and converts it to rows of ASCII characters. */
export function asciiScene(cols: number, rows: number, aspect: number): string[] {
  const W = 360;
  const H = Math.max(1, Math.round(W / aspect));
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const front = document.createElement("canvas");
  front.width = W;
  front.height = H;
  const fctx = front.getContext("2d");
  if (!ctx || !fctx) return [];

  const screen = screenRectFor(aspect);
  const shots = buildShots(W, H, screen);
  const view: View = { vw: W, vh: H, dpr: 1, cam: shots.wide, z: 1, zoomFilm: 0 };
  const input = {
    t: 4,
    glow: [255, 70, 40] as [number, number, number],
    screen,
    pose: POSES.browse,
    ambient: false,
    orient: shots.orient,
  };
  drawBack(ctx, view, input, paintFakePage);
  drawFront(fctx, view, input, false);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(front, 0, 0);

  const { data } = ctx.getImageData(0, 0, W, H);
  const lum = new Float32Array(cols * rows);
  let max = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = Math.min(W - 1, Math.floor(((c + 0.5) / cols) * W));
      const y = Math.min(H - 1, Math.floor(((r + 0.5) / rows) * H));
      const i = (y * W + x) * 4;
      const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      lum[r * cols + c] = l;
      if (l > max) max = l;
    }
  }

  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < cols; c++) {
      // Crush the darkest tones to blanks so the lit monitor and the
      // viewer's silhouette read clearly against the room.
      const n = lum[r * cols + c] / (max || 1);
      const v = Math.pow(Math.max(0, (n - 0.1) / 0.9), 0.8);
      line += RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))];
    }
    lines.push(line);
  }
  return lines;
}
