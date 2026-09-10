/**
 * Blast Motion metric primer — single source of truth for the interactive page.
 *
 * Definitions and plain-language ranges are adapted from Driveline's
 * "Blast Motion Metric Definitions" handout and coaching usage. Where the
 * handout and Driveline's current HTKC doctrine disagree, the HTKC range is
 * listed as the target and the older/simpler range is noted as such.
 */

export type MetricPhase =
  | 'load'
  | 'downswing-start'
  | 'acceleration'
  | 'mid-swing'
  | 'contact'
  | 'finish'
  | 'derived';

export interface LevelRow {
  label: string;
  value: string;
}

export interface Metric {
  id: string;
  name: string;
  unit: string;
  /** Highlighted as a key metric (handout) or a core HTKC metric. */
  key: boolean;
  phase: MetricPhase;
  /** One sentence: when, in the swing, this number is captured. */
  when: string;
  definition: string;
  why: string;
  target: string;
  inGym?: string;
  mlb?: string;
  levels?: LevelRow[];
  related: string[];
  flags: string[];
}

export const metrics: Metric[] = [
  {
    id: 'bat-speed',
    name: 'Bat Speed',
    unit: 'mph',
    key: true,
    phase: 'contact',
    when: 'Measured at contact — the speed of the sweet spot of the bat as it meets the ball.',
    definition: 'The speed of the sweet spot of the bat at contact.',
    why: 'The single strongest mechanical predictor of batted-ball production. Every 1 mph of bat speed is worth roughly 1.2 mph of exit velocity and about 4–7 feet of carry on well-struck balls. It sets a hitter\'s ceiling and floor.',
    target:
      'Stay at or above 75 mph at all times. It will fall in more challenging, game-like environments — that is exactly when to watch it.',
    inGym: 'In-gym professional average ≈ 72 mph mean; the 90th percentile is the useful ceiling.',
    mlb: 'Fast swing = 75+ mph at the sweet spot (Statcast).',
    levels: [
      { label: 'MLB', value: '~75+ mph' },
      { label: 'NPB', value: '~70–75 mph' },
      { label: 'MiLB', value: '~72–76 mph' },
      { label: 'College', value: '~68–74 mph' },
    ],
    related: ['rotational-acceleration', 'peak-hand-speed', 'time-to-contact', 'power'],
    flags: [
      'Below the level benchmark with a capped exit-velocity ceiling',
      'Drops off in game-like environments even when the cage number is fine',
      'Low rotational acceleration despite reasonable bat speed — an energy leak',
    ],
  },
  {
    id: 'attack-angle',
    name: 'Attack Angle',
    unit: '°',
    key: true,
    phase: 'contact',
    when: 'Measured at contact — the vertical angle of the bat\'s path at the moment of contact.',
    definition:
      'The angle of the bat\'s path at contact. Zero is parallel to the ground; positive is swinging up, negative is swinging down.',
    why: 'Matching the bat path to the incoming pitch plane creates a tube of overlap rather than a single point — a bigger margin for error when a hitter is slightly early or late, and cleaner energy transfer at contact.',
    target:
      'HTKC target window 4–16°. MLB average is about 7°, which matches typical pitch descent. (The older simplified guidance was 6–15°.)',
    inGym: 'College hitters land about 65% of their swings inside the 4–16° window.',
    mlb: 'Ideal attack angle band 5–20° (Statcast).',
    related: ['vertical-bat-angle', 'connection-at-impact', 'on-plane-efficiency', 'time-to-contact'],
    flags: [
      'Above ~18°: pop-ups and whiffs on anything middle or down',
      'Below 4° with a high ground-ball rate',
      'Do not diagnose the path from attack angle alone — always control for contact point',
    ],
  },
  {
    id: 'time-to-contact',
    name: 'Time to Contact',
    unit: 's',
    key: true,
    phase: 'contact',
    when: 'A whole-swing number — elapsed time between the first move and contact.',
    definition: 'Time elapsed between the first move and contact.',
    why: 'Depends on timing and the point of contact: faster when contact is deep in the zone, slower when it is out front. A long time-to-contact means the hitter commits early and is more exposed to velocity.',
    target: 'Not a pass/fail number — read it against contact point. In-gym professional average ≈ 0.147 s.',
    inGym: 'In-gym professional average ≈ 0.147 s.',
    related: ['bat-speed', 'rotational-acceleration', 'attack-angle'],
    flags: ['A long time to contact (≈0.16 s and up) alongside low bat speed — a swing that is "long" to the ball'],
  },
  {
    id: 'rotational-acceleration',
    name: 'Rotational Acceleration',
    unit: 'g',
    key: true,
    phase: 'acceleration',
    when: 'During the acceleration phase — how quickly the bat accelerates into the swing plane (defined by the vertical bat angle at contact).',
    definition: 'How quickly the bat accelerates into the swing plane — the "0 to 60" of the swing, reported in g.',
    why: 'A read on whether bat speed is built by sequencing proximal-to-distal or by pulling the bat with the hands. Higher rotational acceleration means more power and more time to make a decision at the plate.',
    target:
      'Above 13 g maintains above-average exit velocity across a wider contact window. MLB average ≈ 17 g; Driveline in-gym professional average ≈ 14 g.',
    inGym: 'In-gym professional average ≈ 13.96 g.',
    mlb: 'MLB average ≈ 17 g (per Blast Motion).',
    levels: [
      { label: 'Below average / HS', value: '< 10 g' },
      { label: 'Medium', value: '10–15 g' },
      { label: 'MLB average', value: '~17 g' },
      { label: 'Affiliate elite', value: '~22 g' },
    ],
    related: ['bat-speed', 'early-connection', 'peak-hand-speed', 'connection-at-impact'],
    flags: [
      'Below ~10 g with adequate bat speed: a hand-driven push pattern and an energy leak',
      'A long, slow build to peak bat speed rather than an explosive spike',
      'Low rotational acceleration with a longer, more flowing swing can be fine — address it only with other flags',
    ],
  },
  {
    id: 'early-connection',
    name: 'Early Connection',
    unit: '°',
    key: true,
    phase: 'downswing-start',
    when: 'At the start of the downswing — the relationship between body tilt and vertical bat angle as the hands first move forward.',
    definition: 'The angle between the body/spine tilt and the vertical bat angle at the start of the downswing.',
    why: 'Sets up connection at impact. Connection near 90° early in the swing helps the hitter get on-plane and adjust to all pitch locations. Unlike connection at impact, both high and low are problems — with different fixes.',
    target:
      'HTKC optimal range 85–95°. Above 100° is flagged high; below 80° is flagged low. Driveline affiliate professional average ≈ 90.7°.',
    inGym: 'Driveline affiliate professional average ≈ 90.7°.',
    levels: [{ label: 'College average', value: '~98–99°' }],
    related: ['connection-at-impact', 'on-plane-efficiency', 'attack-angle'],
    flags: [
      'High (>100°): barrel too steep at launch, posture breakdown, high-pitch and opposite-field weakness',
      'Low (<80°): elongated path, early barrel release, pull-side power loss',
    ],
  },
  {
    id: 'connection-at-impact',
    name: 'Connection at Impact',
    unit: '°',
    key: true,
    phase: 'contact',
    when: 'At contact — the relationship between body tilt and vertical bat angle at impact.',
    definition: 'The angle between the spine and the bat at the moment of contact. At 90° the bat is perpendicular to the spine.',
    why: 'Force transfer from the rotating torso into the bat is maximized at 90°. Deviations mean the hands are compensating — holding the barrel up or pushing it down — which degrades both exit velocity and consistency.',
    target: 'HTKC optimal 88–92°; 83–88° acceptable; below 80° begins to flag. (Older simplified guidance: 85–95°.)',
    inGym: 'College average ≈ 82–83°.',
    related: ['early-connection', 'on-plane-efficiency', 'attack-angle', 'bat-speed'],
    flags: [
      'Below 80°: barrel dumping beneath the spine axis — early release, push pattern, or posture loss',
      'Above 92°: barrel above the spine axis (less common)',
    ],
  },
  {
    id: 'peak-hand-speed',
    name: 'Peak Hand Speed',
    unit: 'mph',
    key: true,
    phase: 'mid-swing',
    when: 'During the swing — the maximum speed of the handle, measured six inches from the knob.',
    definition: 'The maximum speed of the handle of the bat during the swing, measured six inches from the knob.',
    why: 'Correlates strongly with bat speed and power, and drives the efficiency ratio (bat speed ÷ peak hand speed). A higher ratio means the torso is doing more of the work and the hands less — a sequencing proxy.',
    target: 'No fixed pass/fail — read it against bat speed. In-gym professional average ≈ 20 mph.',
    inGym: 'In-gym professional average ≈ 20 mph (bat speed ÷ peak hand speed ≈ 3.25).',
    related: ['bat-speed', 'rotational-acceleration', 'power'],
    flags: ['Low peak hand speed relative to level even when efficiency reads fine'],
  },
  {
    id: 'on-plane-efficiency',
    name: 'On Plane Efficiency',
    unit: '%',
    key: false,
    phase: 'mid-swing',
    when: 'Across the swing — the share of the swing path traveled on the same plane as the incoming pitch, set by the vertical bat angle at contact.',
    definition: 'The percentage of the swing during which the bat is on the swing plane.',
    why: 'A higher number means the barrel spends more of the swing in a zone where contact is possible — more room for error forward and backward in the contact zone. It is the downstream integration of early connection and connection at impact.',
    target: 'Not a key metric on its own. Fix attack angle and connection first — on-plane efficiency usually follows.',
    inGym: 'In-gym professional average ≈ 68%; college average ≈ 68–70%.',
    related: ['attack-angle', 'early-connection', 'connection-at-impact', 'plane-score'],
    flags: ['Low on-plane efficiency with attack angle and connection already in range — a bat-path or barrel-manipulation issue'],
  },
  {
    id: 'vertical-bat-angle',
    name: 'Vertical Bat Angle',
    unit: '°',
    key: false,
    phase: 'contact',
    when: 'At contact — the angle of the barrel relative to the ground.',
    definition: 'The angle of the barrel relative to the ground at contact.',
    why: 'Subjective to pitch location: a pitch at the top of the zone needs a flatter (closer to horizontal) bat angle, and a pitch at the bottom needs a steeper one. It defines the swing plane that on-plane efficiency and rotational acceleration are measured against.',
    target: 'Roughly 20–40° depending on pitch height.',
    related: ['attack-angle', 'on-plane-efficiency', 'rotational-acceleration'],
    flags: ['A flat bat angle at launch creates inefficiency; a barrel steepening through the zone can support a tip-and-drag pattern'],
  },
  {
    id: 'power',
    name: 'Power',
    unit: '',
    key: false,
    phase: 'contact',
    when: 'Derived from contact — bat mass, bat speed at contact, and average acceleration during the downswing.',
    definition: 'Power generated by the swing, computed from the mass of the bat, the bat speed at contact, and the average acceleration during the downswing.',
    why: 'A derived output rather than a movement to chase. If bat speed is in a good place, it is not worth paying attention to.',
    target: 'No independent target — track bat speed.',
    related: ['bat-speed', 'rotational-acceleration', 'peak-hand-speed'],
    flags: [],
  },
  {
    id: 'plane-score',
    name: 'Plane Score',
    unit: '',
    key: false,
    phase: 'derived',
    when: 'Derived from on-plane efficiency.',
    definition: 'Scores on-plane efficiency for each swing on the 20–80 scouting scale, relative to others at your level.',
    why: 'A level-scaled presentation of on-plane efficiency.',
    target: '20–80 scale; higher is better.',
    related: ['on-plane-efficiency'],
    flags: ['Not a key metric'],
  },
  {
    id: 'rotation-score',
    name: 'Rotation Score',
    unit: '',
    key: false,
    phase: 'derived',
    when: 'Derived from rotational acceleration.',
    definition: 'Scores rotational acceleration for each swing on the 20–80 scouting scale, relative to others at your level.',
    why: 'A level-scaled presentation of rotational acceleration.',
    target: '20–80 scale; higher is better.',
    related: ['rotational-acceleration'],
    flags: ['Not a key metric'],
  },
  {
    id: 'connection-score',
    name: 'Connection Score',
    unit: '',
    key: false,
    phase: 'derived',
    when: 'Derived from early connection and connection at impact.',
    definition: 'Scores early connection and connection at impact on the 20–80 scouting scale, relative to others at your level.',
    why: 'A level-scaled presentation of both connection metrics.',
    target: '20–80 scale; higher is better.',
    related: ['early-connection', 'connection-at-impact'],
    flags: ['Not a key metric'],
  },
];

export interface Phase {
  id: MetricPhase;
  label: string;
  short: string;
  note: string;
  metricIds: string[];
}

export const phases: Phase[] = [
  {
    id: 'load',
    label: 'Load',
    short: 'Load',
    note: 'Coil back, get the center of mass over the rear leg. Mostly style — no Blast metric fires here.',
    metricIds: [],
  },
  {
    id: 'downswing-start',
    label: 'Downswing start',
    short: 'Start',
    note: 'The hands first move forward. This is where early connection is captured.',
    metricIds: ['early-connection'],
  },
  {
    id: 'acceleration',
    label: 'Acceleration',
    short: 'Accel',
    note: 'The bat is driven into the swing plane. This is where rotational acceleration is captured.',
    metricIds: ['rotational-acceleration'],
  },
  {
    id: 'mid-swing',
    label: 'Through the zone',
    short: 'Zone',
    note: 'The handle peaks and the barrel spends time on the pitch plane.',
    metricIds: ['peak-hand-speed', 'on-plane-efficiency'],
  },
  {
    id: 'contact',
    label: 'Contact',
    short: 'Contact',
    note: 'The bat meets the ball. The most metrics are captured in this instant.',
    metricIds: [
      'bat-speed',
      'attack-angle',
      'vertical-bat-angle',
      'connection-at-impact',
      'time-to-contact',
      'power',
    ],
  },
  {
    id: 'finish',
    label: 'Finish',
    short: 'Finish',
    note: 'Follow-through. Style, and a read on how the body decelerated.',
    metricIds: [],
  },
];

export function metricById(id: string): Metric | undefined {
  return metrics.find((m) => m.id === id);
}

export const sourceNote =
  'Definitions and coaching ranges adapted from Driveline\'s "Blast Motion Metric Definitions" handout and the Hacking the Kinetic Chain (HTKC) reference. Where sources differ, the current HTKC range is shown as the target and the older range is noted. Blast measures the bat, not the ball: attack angle is a bat metric, launch angle is a ball-flight metric — never substitute one for the other.';
