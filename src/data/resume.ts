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
  end?: string; // use "Present" for current; leave off for a single-date entry
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
  'Hitting Trainer at Driveline Baseball in Tampa, Florida. I coach hitters across youth, ' +
  'high school, college, and professional levels, and I build the measurement and analysis ' +
  'behind it — bat tracking, motion capture, and public baseball data.';

export const roles: Role[] = [
  {
    org: 'Driveline Baseball',
    title: 'Hitting Trainer',
    start: 'Jun 2026',
    end: 'Present',
    location: 'Tampa, FL',
    blurb:
      'Data-driven hitting instruction for youth, high school, college, and professional ' +
      'athletes, plus the research and tooling behind it.',
    points: [
      'Run athlete assessments and build individualized development plans using Launchpad, HitTrax, and Blast Motion.',
      'Coach one-on-one and group sessions across swing design and group training.',
      'Research inter-swing variability and bat-path modeling with Python, R, and SQL.',
    ],
  },
  {
    org: 'Wild Bill Sports',
    title: 'Youth Baseball Coach',
    start: 'Fall 2024',
    end: 'Summer 2025',
    blurb: 'Coached a 13u team while enrolled full-time at Catholic University.',
    points: [
      'Led biweekly practices and coached weekend tournaments for a 13u team, balancing a full course load.',
      'Managed pre-game organization, communication, and logistics.',
    ],
  },
  {
    org: 'Ascent Athlete',
    title: 'Hitting Intern',
    start: 'Winter 2023',
    location: 'Glen Mills, PA',
    blurb: 'Hands-on, data-driven work with hitters at every level.',
    points: [
      'Trained professional, college, high school, and youth hitters in a hands-on, data-driven environment.',
      'Built a more streamlined process for entering athlete KPI data into the facility database.',
      'Maintained pitching machines, L-screens, and cages to keep open hours running.',
    ],
  },
];

export const education: Entry[] = [
  {
    primary: 'B.S. Biomedical Engineering',
    secondary: 'The Catholic University of America',
    meta: 'May 2025 · GPA 3.8, Dean’s List (5 semesters)',
  },
  {
    primary: 'Leadership and Public Management Certificate',
    secondary: 'University of Connecticut',
    meta: 'May 2026',
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Coaching',
    items: [
      'Hitting assessment and program design',
      'Constraint-led practice design',
      'One-on-one and group instruction',
      'Video analysis and athlete-facing communication',
    ],
  },
  {
    group: 'Technical',
    items: [
      'Python (pandas, numpy, scipy, scikit-learn)',
      'R',
      'SQL',
      'MATLAB',
      'Biomechanics instrumentation (bat tracking, motion capture, force plates)',
      'Pitching machine repair',
    ],
  },
];

export const certifications: Entry[] = [
  { primary: 'Foundations of Hitting', secondary: 'Driveline' },
  { primary: 'Youth Coaching', secondary: 'Driveline' },
  { primary: 'AI Fluency', secondary: 'Anthropic' },
];

export const athletics: Role[] = [
  {
    org: 'University of Connecticut',
    title: 'Varsity Baseball Athlete',
    start: 'Fall 2025',
    end: 'Spring 2026',
  },
  {
    org: 'The Catholic University of America',
    title: 'Varsity Baseball Athlete',
    start: 'Fall 2022',
    end: 'Spring 2025',
    points: [
      'All-Landmark Conference Second Team (2024, 2025)',
      'ABCA/D3Baseball.com Third Team All-Region (2025)',
      'Landmark Conference Academic Honor Roll (2023, 2024, 2025)',
      'Started every contest in 2024 despite multiple injuries.',
    ],
  },
  {
    org: 'Tau Beta Pi Engineering Honors Society',
    title: 'Active Member',
    start: 'Fall 2023',
    end: 'Present',
  },
];

export const writing: Entry[] = [
  // Talks, articles, podcasts. { primary: 'Title', secondary: 'Where', meta: 'Year' }
];
