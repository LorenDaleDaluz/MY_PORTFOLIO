const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*+=?/<>";

const glyph = (rand: () => number) => GLYPHS[(rand() * GLYPHS.length) | 0];

const isBlank = (ch: string) => ch === " " || ch === "\n";

/**
 * Decode effect: every character starts as a random glyph and resolves
 * left-to-right as `p` goes from 0 to 1.
 */
export function scramble(
  text: string,
  p: number,
  rand: () => number = Math.random,
): string {
  if (p >= 1) return text;
  const n = text.length;
  let out = "";
  for (let i = 0; i < n; i++) {
    const ch = text[i];
    if (isBlank(ch)) {
      out += ch;
      continue;
    }
    const settle = (i / Math.max(1, n - 1)) * 0.62 + 0.38;
    out += p >= settle ? ch : glyph(rand);
  }
  return out;
}

/**
 * Scroll-scrubbed reveal: characters are hidden, then flicker as glyphs,
 * then settle. `r` can move backwards, so the text un-writes itself too.
 */
export function reveal(
  text: string,
  r: number,
  rand: () => number = Math.random,
): string {
  if (r >= 1) return text;
  const n = text.length;
  let out = "";
  for (let i = 0; i < n; i++) {
    const ch = text[i];
    if (isBlank(ch)) {
      out += ch;
      continue;
    }
    const start = (i / Math.max(1, n - 1)) * 0.7;
    if (r < start) out += " ";
    else if (r < start + 0.3) out += glyph(rand);
    else out += ch;
  }
  return out;
}
