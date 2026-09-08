# stevie thomas — personal site

Astro 5 static site, deployed to GitHub Pages by GitHub Actions on every push to `main`.

Live at **https://mesteviet25.github.io**

---

## Add a project

Create `src/content/projects/my-thing.md`. The filename becomes the URL
(`/projects/my-thing/`). Nothing else needs editing — the home page and the project index pick it
up automatically.

```markdown
---
title: 'What It Is'
summary: 'One or two sentences. Shows on the index and under the headline.'
date: 2026-08-10
status: active # active | shipped | shelved
featured: true # true puts it on the home page
tags: ['bat tracking', 'python']
link: https://github.com/you/repo # optional
---

Body in markdown. Headings, lists, tables, code blocks all styled.
```

## Add a note

Same idea, in `src/content/notes/`. Notes take `title`, `summary`, `date`, `tags`, and `draft`.
Set `draft: true` and it stays out of the build entirely — safe to leave half-written in the repo.

## Publish

```bash
git add -A && git commit -m "add project: my thing" && git push
```

Actions builds and deploys. Takes about a minute.

---

## Run it locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # writes dist/, must exit clean before pushing
```

## What goes on this site — read before publishing

This site is public. Everything on it must be one of:

- analysis built on **public data** (Statcast, public play-by-play), or
- a **method or concept** described on its own, with no data shown.

Never publish:

- athlete names, TRAQ IDs, or any per-athlete data — **including anonymized charts built from
  Driveline athlete data**
- partner or client names, deal terms, or business specifics
- internal repo code, screenshots, schema, or endpoint details (TRAQ, Caesar, Hurricane, mlb_db)

When a project can't be written under those rules, it doesn't get a page.

## Structure

```
src/
  content.config.ts        collection schemas — edit to add a frontmatter field
  content/projects/*.md    project pages
  content/notes/*.md       notes
  layouts/Base.astro       head, nav, footer  (footer links live here)
  components/IndexList.astro   the numbered row list used by all three index pages
  pages/                   routes
  styles/global.css        the whole design system, colors at the top
public/fonts/              self-hosted woff2 — no external font CDN
```

## Account and identity

This repo lives on the **personal** GitHub account `mesteviet25`, not the Driveline account.
The remote is written as `https://mesteviet25@github.com/mesteviet25/mesteviet25.github.io.git` --
the username in the URL is load-bearing. Git Credential Manager keys stored credentials by host
*plus* username, so that form keeps this account's credential separate from the
`stephen-thomas-drivelinebaseball` entry already on this machine. Never run `gh auth setup-git`;
it installs a global helper that hijacks whichever identity it was authed as.

This repo is **public** because a GitHub user site (`<username>.github.io`) must be public for
Pages to build on a free plan. That is why the publishing rules below are not optional.

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
