import { defineConfig } from 'astro/config';

// Repo is stephen-thomas-drivelinebaseball.github.io, so the site lives at the
// domain root and needs no `base`. When this ports to a personal account or a
// custom domain, change `site` here and nothing else.
export default defineConfig({
  site: 'https://stephen-thomas-drivelinebaseball.github.io',
});
