/**
 * Swing geometry for the Blast primer.
 *
 * The bat path is a hand-tuned swing arc (Catmull-Rom through control points)
 * shaped like a real swing: high behind the head, a steep downswing, a shallow
 * concave-up through-zone slice, extension, and a follow-through wrap. The
 * hands ride a second, shallower curve near the body, so the bat naturally
 * lays back in the downswing and releases through contact.
 *
 * A faint ellipse (Blast's "swing plane around the body") is kept as a guide.
 *
 * Everything is positioned in the explorer's SVG viewBox space (1600 x 900).
 */

const D2R = Math.PI / 180;

export const VIEW_W = 1600;
export const VIEW_H = 900;

export const body = { x: 760, y: 360 };

interface Pt {
  x: number;
  y: number;
}

function rot(x: number, y: number, deg: number): Pt {
  const c = Math.cos(deg * D2R);
  const s = Math.sin(deg * D2R);
  return { x: x * c - y * s, y: x * s + y * c };
}

// ---- swing arc control points (barrel / sweet spot) -----------------------

const BARREL_CTRL: Pt[] = [
  { x: 452, y: 150 }, // load — high behind the head
  { x: 535, y: 225 }, // downswing start — barrel still above the hands (positive VBA)
  { x: 645, y: 320 }, // acceleration — still above the hands
  { x: 765, y: 415 }, // late downswing — beginning to flatten
  { x: 885, y: 468 }, // through the zone
  { x: 1015, y: 462 }, // contact
  { x: 1140, y: 395 }, // extension
  { x: 1192, y: 285 }, // follow-through
  { x: 1155, y: 175 }, // finish
];

const HANDS_CTRL: Pt[] = [
  { x: 690, y: 300 },
  { x: 696, y: 322 },
  { x: 706, y: 344 },
  { x: 720, y: 362 },
  { x: 740, y: 376 },
  { x: 766, y: 384 },
  { x: 796, y: 384 },
  { x: 824, y: 374 },
  { x: 846, y: 356 },
];

function catmullRom(ctrl: Pt[], samplesPerSeg = 28): Pt[] {
  const p: Pt[] = [ctrl[0], ...ctrl, ctrl[ctrl.length - 1]];
  const out: Pt[] = [];
  for (let i = 0; i < p.length - 3; i++) {
    const p0 = p[i];
    const p1 = p[i + 1];
    const p2 = p[i + 2];
    const p3 = p[i + 3];
    for (let j = 0; j < samplesPerSeg; j++) {
      const t = j / samplesPerSeg;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push({
        x:
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y:
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  out.push(p[p.length - 2]);
  return out;
}

const BARREL_SAMPLES = catmullRom(BARREL_CTRL);
const HANDS_SAMPLES = catmullRom(HANDS_CTRL);

function sampleAt(samples: Pt[], u: number): Pt {
  const t = Math.max(0, Math.min(1, u));
  const x = t * (samples.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = samples[i];
  const b = samples[Math.min(samples.length - 1, i + 1)];
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
}

/** Barrel (sweet-spot) position at normalized swing progress u in [0, 1]. */
export function barrelAt(u: number): Pt {
  return sampleAt(BARREL_SAMPLES, u);
}

/** Hands position at normalized swing progress u in [0, 1]. */
export function handsAt(u: number): Pt {
  return sampleAt(HANDS_SAMPLES, u);
}

/** A point along the bat, t = 0 at the hands, 1 at the barrel tip. */
export function pointAlongBat(u: number, t: number): Pt {
  const h = handsAt(u);
  const b = barrelAt(u);
  return { x: h.x + (b.x - h.x) * t, y: h.y + (b.y - h.y) * t };
}

/** Tapered bat, returned as an SVG polygon points string. */
export function batPolygon(u: number): string {
  const h = handsAt(u);
  const b = barrelAt(u);
  const dx = b.x - h.x;
  const dy = b.y - h.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  const wH = 4.5;
  const wB = 11;
  const pts: [number, number][] = [
    [h.x + px * wH, h.y + py * wH],
    [b.x + px * wB, b.y + py * wB],
    [b.x - px * wB, b.y - py * wB],
    [h.x - px * wH, h.y - py * wH],
  ];
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

/** Polyline along the barrel arc between two progress values. */
export function barrelSlice(u0: number, u1: number, steps = 28): string {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const u = u0 + ((u1 - u0) * i) / steps;
    const q = barrelAt(u);
    pts.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`);
  }
  return 'M' + pts.join(' L');
}

/** Polyline offset from the barrel arc toward the hands (for the TtC bracket). */
export function offsetSlice(u0: number, u1: number, off: number, steps = 28): string {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const u = u0 + ((u1 - u0) * i) / steps;
    const b = barrelAt(u);
    const h = handsAt(u);
    pts.push(`${(b.x + (h.x - b.x) * off).toFixed(1)},${(b.y + (h.y - b.y) * off).toFixed(1)}`);
  }
  return 'M' + pts.join(' L');
}

/** Nearest progress value for a point, for drag mapping. */
const DRAG_SAMPLES: { x: number; y: number; u: number }[] = (() => {
  const out: { x: number; y: number; u: number }[] = [];
  for (let i = 0; i <= 360; i++) {
    const u = i / 360;
    const p = barrelAt(u);
    out.push({ x: p.x, y: p.y, u });
  }
  return out;
})();

export function nearestU(p: Pt): number {
  let best = 0;
  let bd = Infinity;
  for (const s of DRAG_SAMPLES) {
    const d = (s.x - p.x) ** 2 + (s.y - p.y) ** 2;
    if (d < bd) {
      bd = d;
      best = s.u;
    }
  }
  return best;
}

// ---- faint swing-plane guide (Blast's ellipse around the body) ------------

const GUIDE = { cx: 830, cy: 340, a: 372, b: 196, tilt: 16 };

function guidePoint(phi: number): Pt {
  const t = phi * D2R;
  const p = rot(GUIDE.a * Math.cos(t), GUIDE.b * Math.sin(t), GUIDE.tilt);
  return { x: GUIDE.cx + p.x, y: GUIDE.cy - p.y };
}

export function guidePath(step = 4): string {
  const pts: string[] = [];
  for (let phi = 0; phi <= 360; phi += step) {
    const q = guidePoint(phi);
    pts.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`);
  }
  return 'M' + pts.join(' L') + ' Z';
}

// ---- checkpoints ----------------------------------------------------------

export interface Stop {
  key: string;
  label: string;
  u: number;
  metricIds: string[];
  /** Progress window [a, b] (a < b) to highlight for this metric. */
  segment?: [number, number];
  blurb: string;
}

export const STOPS: Stop[] = [
  {
    key: 'load',
    label: 'Load',
    u: 0,
    metricIds: [],
    blurb: 'Coil back into the rear hip. No Blast metric fires yet — load and stance are mostly style.',
  },
  {
    key: 'early-connection',
    label: 'Downswing start',
    u: 0.12,
    metricIds: ['early-connection'],
    blurb: 'Early Connection is captured the moment the bat transitions from load into rotation.',
  },
  {
    key: 'rotational-acceleration',
    label: 'Acceleration',
    u: 0.26,
    metricIds: ['rotational-acceleration'],
    segment: [0.09, 0.36],
    blurb: 'Rotational Acceleration covers the bat transitioning from load into rotation, until roughly the back elbow slots.',
  },
  {
    key: 'peak-hand-speed',
    label: 'Through the zone',
    u: 0.46,
    metricIds: ['peak-hand-speed'],
    blurb: 'Peak Hand Speed is the fastest the handle moves — measured six inches off the knob.',
  },
  {
    key: 'on-plane-efficiency',
    label: 'On plane',
    u: 0.58,
    metricIds: ['on-plane-efficiency'],
    segment: [0.46, 0.8],
    blurb: 'On-Plane Efficiency is the share of the swing the barrel spends on the plane set by the vertical bat angle at contact.',
  },
  {
    key: 'contact',
    label: 'Contact',
    u: 0.64,
    metricIds: ['bat-speed', 'attack-angle', 'vertical-bat-angle', 'connection-at-impact'],
    blurb: 'At contact, Blast captures bat speed, attack angle, vertical bat angle, and connection at impact.',
  },
  {
    key: 'finish',
    label: 'Finish',
    u: 1,
    metricIds: [],
    blurb: 'Follow-through and deceleration.',
  },
];

export const CONTACT_U = 0.64;

export type AnchorKind = 'hands' | 'knob' | 'sweet' | 'barrel' | 'segMid';

export interface CalloutSpec {
  anchor: AnchorKind;
  dx: number;
  dy: number;
}

/** Where each metric's callout box sits, relative to its anchor point. */
export const CALLOUT_LAYOUT: Record<string, CalloutSpec> = {
  'early-connection': { anchor: 'knob', dx: -300, dy: -150 },
  'rotational-acceleration': { anchor: 'segMid', dx: -96, dy: -196 },
  'peak-hand-speed': { anchor: 'knob', dx: -330, dy: 120 },
  'on-plane-efficiency': { anchor: 'segMid', dx: 96, dy: 176 },
  'bat-speed': { anchor: 'sweet', dx: 236, dy: -196 },
  'attack-angle': { anchor: 'sweet', dx: 320, dy: -66 },
  'vertical-bat-angle': { anchor: 'sweet', dx: 320, dy: 74 },
  'connection-at-impact': { anchor: 'hands', dx: 30, dy: 226 },
};

export const CALLOUT_W = 208;
export const CALLOUT_H = 52;

export function anchorPoint(kind: AnchorKind, u: number, segment?: [number, number]): Pt {
  switch (kind) {
    case 'hands':
      return handsAt(u);
    case 'knob':
      return pointAlongBat(u, 0.17);
    case 'sweet':
      return pointAlongBat(u, 0.74);
    case 'barrel':
      return barrelAt(u);
    case 'segMid': {
      const mid = segment ? (segment[0] + segment[1]) / 2 : u;
      return barrelAt(mid);
    }
  }
}

// ---- fixed scene furniture ------------------------------------------------

export const contactPoint = barrelAt(CONTACT_U);
export const zone = {
  x: contactPoint.x - 106,
  y: contactPoint.y - 122,
  w: 192,
  h: 228,
  rot: -7,
};
