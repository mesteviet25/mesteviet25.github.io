/**
 * Swing-plane geometry for the Blast primer.
 *
 * The swing plane is Blast's own mental model: an ellipse around the body,
 * defined by the vertical bat angle at contact. The barrel rides the outer
 * ellipse; the hands ride a concentric inner ellipse, so the bat reads as a
 * rod sweeping around the body rather than a windmill overhead.
 *
 * All values are in the explorer's SVG viewBox space (1600 x 900).
 */

const D2R = Math.PI / 180;

export const VIEW_W = 1600;
export const VIEW_H = 900;

export const CX = 760;
export const CY = 360;
export const A = 368; // ellipse semi-axis (toward pitcher)
export const B = 160; // ellipse semi-axis (depth, foreshortened)
export const TILT = 15; // degrees the plane is tipped

export const PHI_LOAD = 138;
export const PHI_FINISH = 388;

interface Pt {
  x: number;
  y: number;
}

function rot(x: number, y: number, deg: number): Pt {
  const c = Math.cos(deg * D2R);
  const s = Math.sin(deg * D2R);
  return { x: x * c - y * s, y: x * s + y * c };
}

/** A point on the swing plane, at phase phi (deg) and radial scale (1 = barrel). */
export function planePoint(phi: number, scale = 1): Pt {
  const t = phi * D2R;
  const p = rot(A * scale * Math.cos(t), B * scale * Math.sin(t), TILT);
  return { x: CX + p.x, y: CY - p.y };
}

export const barrelPoint = (phi: number): Pt => planePoint(phi, 1);
export const handsPoint = (phi: number): Pt => planePoint(phi, 0.3);

/** A point along the bat, t = 0 at the hands, 1 at the barrel tip. */
export function pointAlongBat(phi: number, t: number): Pt {
  const h = handsPoint(phi);
  const b = barrelPoint(phi);
  return { x: h.x + (b.x - h.x) * t, y: h.y + (b.y - h.y) * t };
}

/** Tapered bat, returned as an SVG polygon points string. */
export function batPolygon(phi: number): string {
  const h = handsPoint(phi);
  const b = barrelPoint(phi);
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

/** Polyline path along the plane's barrel arc between two phases. */
export function planePath(phi0: number, phi1: number, step = 3): string {
  const dir = phi1 >= phi0 ? 1 : -1;
  const pts: string[] = [];
  for (let p = phi0; dir > 0 ? p <= phi1 : p >= phi1; p += dir * step) {
    const q = barrelPoint(p);
    pts.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`);
  }
  const q = barrelPoint(phi1);
  pts.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`);
  return 'M' + pts.join(' L');
}

export interface Stop {
  key: string;
  label: string;
  phi: number;
  metricIds: string[];
  /** Arc window [a, b] (a < b) to highlight for this metric. */
  segment?: [number, number];
  blurb: string;
}

export const STOPS: Stop[] = [
  {
    key: 'load',
    label: 'Load',
    phi: 146,
    metricIds: [],
    blurb: 'Coil back into the rear hip. No Blast metric fires yet — load and stance are mostly style.',
  },
  {
    key: 'early-connection',
    label: 'Downswing start',
    phi: 212,
    metricIds: ['early-connection'],
    blurb: 'Early Connection is captured the moment the bat transitions from load into rotation.',
  },
  {
    key: 'rotational-acceleration',
    label: 'Acceleration',
    phi: 240,
    metricIds: ['rotational-acceleration'],
    segment: [202, 268],
    blurb: 'Rotational Acceleration covers the bat transitioning from load into rotation, until roughly the back elbow slots.',
  },
  {
    key: 'peak-hand-speed',
    label: 'Through the zone',
    phi: 286,
    metricIds: ['peak-hand-speed'],
    blurb: 'Peak Hand Speed is the fastest the handle moves — measured six inches off the knob.',
  },
  {
    key: 'on-plane-efficiency',
    label: 'On plane',
    phi: 302,
    metricIds: ['on-plane-efficiency'],
    segment: [274, 332],
    blurb: 'On-Plane Efficiency is the share of the swing the barrel spends on the plane set by the vertical bat angle at contact.',
  },
  {
    key: 'contact',
    label: 'Contact',
    phi: 318,
    metricIds: ['bat-speed', 'attack-angle', 'vertical-bat-angle', 'connection-at-impact'],
    blurb: 'At contact, Blast captures bat speed, attack angle, vertical bat angle, and connection at impact.',
  },
  {
    key: 'finish',
    label: 'Finish',
    phi: 378,
    metricIds: [],
    blurb: 'Follow-through and deceleration.',
  },
];

export type AnchorKind = 'hands' | 'knob' | 'sweet' | 'barrel' | 'segMid';

export interface CalloutSpec {
  anchor: AnchorKind;
  dx: number;
  dy: number;
}

/** Where each metric's callout box sits, relative to its anchor point. */
export const CALLOUT_LAYOUT: Record<string, CalloutSpec> = {
  'early-connection': { anchor: 'knob', dx: -352, dy: -170 },
  'rotational-acceleration': { anchor: 'segMid', dx: -78, dy: -214 },
  'peak-hand-speed': { anchor: 'knob', dx: -352, dy: 118 },
  'on-plane-efficiency': { anchor: 'segMid', dx: 36, dy: 196 },
  'bat-speed': { anchor: 'sweet', dx: 236, dy: -206 },
  'attack-angle': { anchor: 'sweet', dx: 316, dy: -78 },
  'vertical-bat-angle': { anchor: 'sweet', dx: 316, dy: 66 },
  'connection-at-impact': { anchor: 'hands', dx: -36, dy: 232 },
};

export const CALLOUT_W = 208;
export const CALLOUT_H = 52;

export function anchorPoint(kind: AnchorKind, phi: number, segment?: [number, number]): Pt {
  switch (kind) {
    case 'hands':
      return handsPoint(phi);
    case 'knob':
      return pointAlongBat(phi, 0.17);
    case 'sweet':
      return pointAlongBat(phi, 0.74);
    case 'barrel':
      return barrelPoint(phi);
    case 'segMid': {
      const mid = segment ? (segment[0] + segment[1]) / 2 : phi;
      return barrelPoint(mid);
    }
  }
}

// ---- fixed scene furniture ----

export const contactPoint = barrelPoint(318);
export const zone = {
  x: contactPoint.x - 108,
  y: contactPoint.y - 128,
  w: 194,
  h: 250,
  rot: -7,
};
export const body = { x: CX, y: CY };
