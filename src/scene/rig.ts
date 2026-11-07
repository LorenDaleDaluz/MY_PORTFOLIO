import { lerp, smoothstep } from "../engine/math";

export type Vec = [number, number];

/**
 * The viewer, seen from behind. Coordinates are local to the base of the
 * neck (y grows downward). Each pose is a set of joint positions; the
 * renderer draws limbs between them.
 */
export type Pose = {
  head: Vec;
  tilt: number;
  headScale: number;
  shL: Vec;
  shR: Vec;
  elL: Vec;
  elR: Vec;
  haL: Vec;
  haR: Vec;
  /** 0: arms are drawn behind the torso. 1: in front of the head. */
  front: number;
  /** 0..1 how much of the coffee mug is in his left hand. */
  mug: number;
  /** 0..1 shoulders raised, leaning toward the screen. */
  hunch: number;
};

const browse: Pose = {
  head: [0, -92],
  tilt: -0.03,
  headScale: 1,
  shL: [-150, 34],
  shR: [150, 34],
  elL: [-200, 176],
  elR: [204, 178],
  haL: [-160, 100],
  haR: [238, 104],
  front: 0,
  mug: 0,
  hunch: 0,
};

const lean: Pose = {
  ...browse,
  head: [6, -78],
  tilt: 0.06,
  headScale: 0.94,
  shL: [-146, 26],
  shR: [146, 26],
  elL: [-190, 160],
  elR: [196, 162],
  haL: [-140, 92],
  haR: [236, 100],
  hunch: 1,
};

const sip: Pose = {
  ...browse,
  head: [2, -92],
  tilt: -0.09,
  elL: [-216, 96],
  haL: [-92, -62],
  mug: 1,
};

/** Hands up and out — a midpoint so the arms can pass behind the head cleanly. */
const raise: Pose = {
  ...browse,
  head: [0, -98],
  tilt: -0.04,
  headScale: 1.03,
  shL: [-154, 28],
  shR: [154, 28],
  elL: [-238, -30],
  elR: [238, -30],
  haL: [-180, -86],
  haR: [180, -86],
};

const impressed: Pose = {
  ...raise,
  head: [0, -100],
  headScale: 1.05,
  elL: [-216, -126],
  elR: [216, -126],
  // Fingers laced behind the head.
  haL: [-13, -118],
  haR: [13, -118],
  front: 1,
};

export const POSES = { browse, lean, sip, raise, impressed };

const mixVec = (a: Vec, b: Vec, t: number): Vec => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
];

export function mixPose(a: Pose, b: Pose, t: number): Pose {
  return {
    head: mixVec(a.head, b.head, t),
    tilt: lerp(a.tilt, b.tilt, t),
    headScale: lerp(a.headScale, b.headScale, t),
    shL: mixVec(a.shL, b.shL, t),
    shR: mixVec(a.shR, b.shR, t),
    elL: mixVec(a.elL, b.elL, t),
    elR: mixVec(a.elR, b.elR, t),
    haL: mixVec(a.haL, b.haL, t),
    haR: mixVec(a.haR, b.haR, t),
    front: t < 0.5 ? a.front : b.front,
    mug: lerp(a.mug, b.mug, t),
    hunch: lerp(a.hunch, b.hunch, t),
  };
}

/** What the viewer is doing at a given point of the film. */
export function poseFor(segmentId: string, u: number): Pose {
  switch (segmentId) {
    case "cut-work":
      return mixPose(browse, lean, smoothstep(0.16, 0.44, u));
    case "cut-contact":
      return u < 0.55
        ? mixPose(lean, sip, smoothstep(0.1, 0.4, u))
        : mixPose(sip, browse, smoothstep(0.62, 0.9, u));
    case "outro": {
      const t = smoothstep(0.3, 0.66, u);
      return t < 0.5
        ? mixPose(browse, raise, t * 2)
        : mixPose(raise, impressed, (t - 0.5) * 2);
    }
    default:
      return browse;
  }
}
