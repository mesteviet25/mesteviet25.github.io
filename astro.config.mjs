import { defineConfig } from 'astro/config';

// Repo is mesteviet25.github.io, so the site lives at the domain root and needs
// no `base`. If this ever moves to a custom domain, change `site` here, add
// public/CNAME, and nothing else.
export default defineConfig({
  site: 'https://mesteviet25.github.io',
});
