import { clamp, smoothstep } from "./math";

export type SegmentKind = "intro" | "read" | "cut" | "outro";

/**
 * A stretch of the page's scroll range. `c0`/`c1` are the page offsets
 * shown on the monitor at the start and end of the segment.
 */
export type Segment = {
  kind: SegmentKind;
  id: string;
  start: number;
  end: number;
  c0: number;
  c1: number;
};

export type Timeline = {
  segments: Segment[];
  total: number;
  contentMax: number;
  introEnd: number;
};

export type CutSpec = { id: string; anchor: number };

type BuildOptions = {
  vh: number;
  contentHeight: number;
  cuts: CutSpec[];
  reduced: boolean;
};

/**
 * Lays the whole film out on one scroll axis:
 * intro (push into the monitor) → reading → cutaway → reading → … → outro.
 */
export function buildTimeline({
  vh,
  contentHeight,
  cuts,
  reduced,
}: BuildOptions): Timeline {
  const contentMax = Math.max(0, contentHeight - vh);
  const segments: Segment[] = [];
  let scroll = 0;
  let content = 0;

  const introLen = vh * (reduced ? 1.4 : 2.8);
  segments.push({ kind: "intro", id: "intro", start: 0, end: introLen, c0: 0, c1: 0 });
  scroll = introLen;

  const pushRead = (to: number) => {
    if (to <= content + 1) return;
    segments.push({
      kind: "read",
      id: `read-${segments.length}`,
      start: scroll,
      end: scroll + (to - content),
      c0: content,
      c1: to,
    });
    scroll += to - content;
    content = to;
  };

  if (!reduced) {
    for (const cut of [...cuts].sort((a, b) => a.anchor - b.anchor)) {
      const at = clamp(cut.anchor, content, contentMax);
      pushRead(at);
      const len = vh * 1.6;
      // The page keeps creeping along on the monitor while the camera is
      // pulled back: one third of the cut's length (see `evaluate`).
      const advance = Math.min(len / 3, contentMax - content);
      segments.push({
        kind: "cut",
        id: cut.id,
        start: scroll,
        end: scroll + len,
        c0: content,
        c1: content + advance,
      });
      scroll += len;
      content += advance;
    }
  }

  pushRead(contentMax);

  const outroLen = vh * (reduced ? 1.2 : 2.4);
  segments.push({
    kind: "outro",
    id: "outro",
    start: scroll,
    end: scroll + outroLen,
    c0: content,
    c1: content,
  });
  scroll += outroLen;

  return { segments, total: scroll, contentMax, introEnd: introLen };
}

export type Evaluation = { seg: Segment; u: number; offset: number };

export function evaluate(tl: Timeline, scroll: number): Evaluation {
  const { segments } = tl;
  let seg = segments[segments.length - 1];
  for (const s of segments) {
    if (scroll < s.end) {
      seg = s;
      break;
    }
  }
  const len = Math.max(1, seg.end - seg.start);
  const u = clamp((scroll - seg.start) / len);

  let offset: number;
  if (seg.kind === "cut") {
    // Page speed matches reading speed (1:1) at both edges of the cut and
    // eases to a stop at its middle, so there's no jolt on either side.
    const advance = seg.c1 - seg.c0;
    offset = seg.c0 + u * len - (len - advance) * smoothstep(0, 1, u);
  } else {
    offset = seg.c0 + (seg.c1 - seg.c0) * u;
  }
  return { seg, u, offset };
}

/** Inverse mapping: where to scroll so the monitor shows `offset`. */
export function scrollForContent(tl: Timeline, offset: number): number {
  const reads = tl.segments.filter((s) => s.kind === "read");
  if (reads.length === 0) return tl.introEnd;
  if (offset <= reads[0].c0) return reads[0].start;
  for (const s of reads) {
    if (offset >= s.c0 && offset <= s.c1) return s.start + (offset - s.c0);
  }
  // Inside a cut's slow zone or past the end: snap to the nearest reading edge.
  let best = reads[0].start;
  let bestDist = Infinity;
  for (const s of reads) {
    for (const [c, y] of [
      [s.c0, s.start],
      [s.c1, s.end],
    ] as const) {
      const dist = Math.abs(c - offset);
      if (dist < bestDist) {
        bestDist = dist;
        best = y;
      }
    }
  }
  return best;
}
