export interface Resource {
  slug: string;
  title: string;
  summary: string;
  kind: string;
  audience: string;
  tags: string[];
}

export const resources: Resource[] = [
  {
    slug: 'blast-motion-metrics',
    title: 'Blast Motion Metrics Primer',
    summary:
      'An interactive tour of every Blast Motion metric: what it measures, exactly when in the swing it is captured, its target range, and how the metrics feed each other. Drag the bat through the zone and the metrics light up where they are measured.',
    kind: 'Interactive primer',
    audience: 'Coaches & players',
    tags: ['Blast', 'Bat path', 'Contact'],
  },
];
