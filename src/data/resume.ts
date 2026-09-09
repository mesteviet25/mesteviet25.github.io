/**
 * Resume content. Edit this file and /resume/ updates — the page is only layout.
 *
 * Anything left as an empty array is skipped entirely rather than rendered as an empty
 * heading, so it is safe to fill this in over time.
 *
 * If you drop a PDF at `public/resume.pdf`, the page picks it up automatically and shows a
 * download link. No PDF, no link.
 */

export type Role = {
  org: string;
  title: string;
  start: string; // "2023" or "Mar 2023" — free text, rendered as written
  end: string; // use "Present" for current
  location?: string;
  blurb?: string;
  points?: string[];
};

export type Entry = {
  primary: string;
  secondary?: string;
  meta?: string;
};

export const intro =
  'Hitting coach at Driveline Baseball. I coach hitters day to day and build the measurement ' +
  'and analysis tools that support it — bat tracking, motion capture, and public baseball data.';

export const roles: Role[] = [
  {
    org: 'Driveline Baseball',
    title: 'Hitting Coach',
    start: 'TODO',
    end: 'Present',
    location: 'Kent, WA',
    blurb:
      'Assessments, programming, and day-to-day cage work with a group of hitters, plus the ' +
      'internal tooling and analysis behind it.',
    points: [
      'TODO — what you own, and the scale of it',
      'TODO — a result you can state without exposing athlete data',
      'TODO — the tooling or process you built that outlived a single season',
    ],
  },
  // Add earlier roles here, newest first.
];

export const education: Entry[] = [
  // { primary: 'Degree, Field', secondary: 'Institution', meta: 'Year' },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Coaching',
    items: [
      'Hitting assessment and program design',
      'Constraint-led practice design',
      'Video analysis and athlete-facing communication',
    ],
  },
  {
    group: 'Technical',
    items: [
      'Python (pandas, numpy, scipy, scikit-learn)',
      'SQL',
      'Biomechanics: markerless motion capture, bat tracking, force plates',
      'Physics simulation (MuJoCo), video pipelines (ffmpeg)',
    ],
  },
];

export const writing: Entry[] = [
  // Talks, articles, podcasts. { primary: 'Title', secondary: 'Where', meta: 'Year' }
];
