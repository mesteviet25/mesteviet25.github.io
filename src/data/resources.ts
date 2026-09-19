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
];
