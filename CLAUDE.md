# personal-site

Astro 5 static site (Resources, Blog, About) on GitHub Pages at https://mesteviet25.github.io,
built and deployed by `.github/workflows/deploy.yml` on every push to `main`. Content is a
markdown drop: one file in `src/content/blog/` or one entry in `src/data/resources.ts`.
`README.md` has the front-matter shape, the resource fields and the full structure.

## Commands

| Task | Command |
|---|---|
| install | `npm install` |
| dev server | `npm run dev` (http://localhost:4321) |
| build (must exit clean before any push) | `npm run build` |
| publish | commit, then `git push` (Actions deploys in about a minute) |

## Non-negotiables

- **This repo is public and must stay public** (a free-plan `<user>.github.io` site has to be).
  A push to `main` is a publish. Never make it private, never move Pages off GitHub Actions.
- **Public-safe content only.** Allowed: analysis of public data (Statcast, public play-by-play),
  or a method described with no data shown. Never: athlete names, IDs or per-athlete data
  (including anonymized charts built from private athlete data), partner or client names, business
  specifics, internal code, screenshots, schema or endpoints. If a project cannot meet that, it
  gets no page.
- `drafts/` is gitignored on purpose; publishing from it takes a deliberate `git add -f` the owner
  has asked for. `drafts/README.md` explains two schema traps there.
- Personal account `mesteviet25`, not the work one: keep the username in the remote URL and never
  run `gh auth setup-git`. Not Driveline-branded; the palette lives at the top of `src/styles/global.css`.

## Precedence

The code wins over `README.md`; `README.md` wins over this file. When they conflict, say so.

<important if="updating public/resources/biomech-lab/">
That folder is a build product of the separate `blast-bat-path` repo. Do not edit it here; run
`node scripts/deploy_to_site.mjs` in `../../biomech-lab/blast-bat-path/`, then commit the copy here.
</important>

<important if="working on the Collision Lab (drafts/collision-lab/)">
Unpublished since 2026-10-25 (owner: not ready to be public). Lives in gitignored `drafts/`.
Hand-written, no build step; it loads three.js from `../batted-ball-3d/vendor/`, so publishing
means moving it back to `public/resources/collision-lab/`, its preview to `public/images/`, and
restoring its `src/data/resources.ts` entry (in git at f8eda90) -- only when the owner asks.
Re-stamp the cache busters on publish: `physics.js?v=` in `app.js`, `app.js?v=` in
`index.html`, first 10 chars of each file's md5, physics first.
</important>

<important if="the live site starts serving raw markdown">
Pages has reverted to legacy Jekyll mode; set the Pages source back to GitHub Actions.
</important>
