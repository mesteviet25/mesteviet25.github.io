/**
 * Links page content. Add an entry here and it shows up on /links/ — nothing else to edit.
 *
 * Groups render in the order they appear below. Within a group, links render in the order
 * you list them. `note` is optional; use it to say why the thing is worth someone's time,
 * which is the only reason a links page is better than a bookmark bar.
 */

export type Link = {
  label: string;
  href: string;
  note?: string;
};

export type LinkGroup = {
  title: string;
  blurb?: string;
  links: Link[];
};

export const linkGroups: LinkGroup[] = [
  {
    title: 'Me, elsewhere',
    links: [
      { label: 'X / @stevie_t12', href: 'https://x.com/stevie_t12', note: 'Where I actually post.' },
      { label: 'GitHub', href: 'https://github.com/mesteviet25', note: 'Code, when it is fit to show.' },
      // { label: 'LinkedIn', href: '' },
      // { label: 'Email', href: 'mailto:' },
    ],
  },
  {
    title: 'Worth your time',
    blurb: 'People and sources I read consistently. Not an endorsement of every take.',
    links: [
      // { label: '', href: '', note: '' },
    ],
  },
  {
    title: 'Tools and data',
    blurb: 'Public data and tools anyone can use, with the ones I lean on most first.',
    links: [
      {
        label: 'Baseball Savant',
        href: 'https://baseballsavant.mlb.com/',
        note: 'The public Statcast front end. Most of what I publish starts here.',
      },
      // { label: '', href: '', note: '' },
    ],
  },
];
