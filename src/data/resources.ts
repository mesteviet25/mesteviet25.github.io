export interface Resource {
  slug: string;
  href?: string;
  title: string;
  summary: string;
  kind: string;
  audience: string;
  tags: string[];
  preview?: string;
}

export const resources: Resource[] = [
  {
    slug: 'collision-lab',
    href: '/resources/collision-lab/',
    title: 'Collision Lab',
    summary:
      'Set the pitch (speed, VAA, HAA, spin), the swing (bat speed, attack angle, attack direction, tilt), and where the bat meets the ball. A physics model collides them and flies the result: exit velo, launch angle, spray, backspin and sidespin, and carry, compared across smash factors.',
    kind: 'Interactive physics simulation',
    audience: 'Hitters and coaches',
    tags: ['Bat-ball collision', 'Smash factor', 'Batted-ball spin'],
    preview: '/images/collision-lab-preview.jpg',
  },
  {
    slug: 'biomech-lab',
    href: '/resources/biomech-lab/',
    title: 'Biomech Lab',
    summary:
      'Explore a captured-motion swing, follow 15 synchronized bat and body signals, and learn what each measurement captures. A guided walkthrough and an open sandbox for coaches.',
    kind: 'Interactive teaching exhibit',
    audience: 'Coaches',
    tags: ['Biomechanics', 'Bat path', 'Full-signal tracking'],
    preview: '/images/biomech-lab-preview.jpg',
  },
  {
    slug: 'batted-ball-3d',
    href: '/resources/batted-ball-3d/',
    title: 'Batted Ball Space',
    summary:
      'Every MLB ball in play from 2015-2026 placed in 3D by exit velo, launch angle, and spray direction, colored by hit probability or wOBAcon. Drag the exit velo slice to see where hits live at each speed, and why pulled fly balls pay.',
    kind: 'Interactive 3D chart',
    audience: 'Hitters and analysts',
    tags: ['Statcast', 'Batted balls', 'Pull air'],
    preview: '/images/batted-ball-3d-preview.jpg',
  },
];
