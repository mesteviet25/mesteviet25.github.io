# stevie thomas — personal site

Astro 5 static site, deployed to GitHub Pages by GitHub Actions on every push to `main`.

Live at **https://mesteviet25.github.io** — the root redirects to `/about/`.

Three sections — Resources, Blog, About — plus the Biomech Lab tool. Adding content means writing
one markdown file or editing one data file. Nothing else.

---

## Add a blog post

Create `src/content/blog/my-post.md`. The filename becomes the URL (`/blog/my-post/`) and the blog
index picks it up automatically.

```markdown
---
title: 'What It Is'
summary: 'One or two sentences. Shows on the index and under the headline.'
date: 2026-09-08
tags: ['hitting', 'data']
draft: false
---

Body in markdown. Headings, lists, tables, code blocks and blockquotes are all styled.
```

Set `draft: true` and it stays out of the build entirely — safe to leave half-written in the repo.

## Add a resource

Edit `src/data/resources.ts`. A resource with an `href` points somewhere else; one with a `slug`
gets a page at `/resources/<slug>/`. Every entry renders as a viewer card on `/resources/`. Add
`preview: '/images/<file>.jpg'` to show an image in the card.

## The Biomech Lab tool

The interactive tool lives at `public/resources/biomech-lab/` and is published as-is at
`/resources/biomech-lab/`. It is built in the separate `blast-bat-path` repo; copy validated
`dist/` output into that folder to update it. It uses relative asset paths, so the folder moves
without edits. `public/blast-bat-path/` is a shim that forwards the old shared URL to the new one.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # writes dist/, must exit clean before pushing
```

## Publish

```bash
git add -A && git commit -m "add post: my thing" && git push
```

Actions builds and deploys. Takes about a minute.

## What goes on this site — read before publishing

This site is public. Everything on it must be one of:

- analysis built on **public data** (Statcast, public play-by-play), or
- a **method or concept** described on its own, with no data shown.

Never publish:

- athlete names, athlete IDs, or any per-athlete data — **including anonymized charts built from
  Driveline athlete data**
- partner or client names, deal terms, or business specifics
- internal repo code, screenshots, schema, or endpoint details

When a project can't be written under those rules, it doesn't get a page.

## Structure

```
src/
  content.config.ts        blog collection schema
  content/blog/*.md        blog posts
  data/resources.ts        the resource list on /resources/
  layouts/Base.astro       head, nav, footer  (nav and footer links live here)
  components/IndexList.astro   the numbered row list used by the blog index
  pages/                   routes (resources, blog, about)
  styles/global.css        the whole design system, colors at the top
public/index.html          instant redirect from / to /about/
public/fonts/              self-hosted woff2 — no external font CDN
public/images/             About portrait + resource card previews
public/resources/biomech-lab/    the Biomech Lab tool, served as-is
public/blast-bat-path/     legacy-link shim -> /resources/biomech-lab/
```

## Account and identity

This repo lives on the **personal** GitHub account `mesteviet25`, not the Driveline account.
The remote is written as `https://mesteviet25@github.com/mesteviet25/mesteviet25.github.io.git` --
the username in the URL is load-bearing. Git Credential Manager keys stored credentials by host
*plus* username, so that form keeps this account's credential separate from the
`stephen-thomas-drivelinebaseball` entry already on this machine. Never run `gh auth setup-git`;
it installs a global helper that hijacks whichever identity it was authed as.

This repo is **public** because a GitHub user site (`<username>.github.io`) must be public for
Pages to build on a free plan. That is why the publishing rules above are not optional.

Pages is set to build from **GitHub Actions**, not from a branch. GitHub enables legacy Jekyll mode
by default on a `<user>.github.io` repo, which serves the raw Astro source instead of the build; if
the site ever starts showing markdown, that setting has reverted.

## Adding a custom domain

1. Add `public/CNAME` containing the bare domain.
2. Change `site` in `astro.config.mjs` to match.
3. Point DNS at GitHub Pages and set the domain under repo Settings → Pages.

No other file needs to change.

## Design notes

Warm ink-on-paper field-journal look. Fraunces for display, Newsreader for body, JetBrains Mono for
metadata — all self-hosted, latin subset only (~226 KB total). Light and dark both handled via
`prefers-color-scheme`; the palette is the block of custom properties at the top of `global.css`.
Deliberately **not** Driveline-branded — this is a personal site.
