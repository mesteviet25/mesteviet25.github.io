# stevie thomas — personal site

Astro 5 static site, deployed to GitHub Pages by GitHub Actions on every push to `main`.

Live at **https://mesteviet25.github.io**

The site is a backbone: five sections, each with an obvious place to put things. Adding content
means writing a markdown file or editing one data file. Nothing else.

---

## Add a blog post

Create `src/content/blog/my-post.md`. The filename becomes the URL (`/blog/my-post/`). The home
page and the blog index pick it up automatically.

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

## Add a project

Same idea, in `src/content/projects/`. Projects take `title`, `summary`, `date`, `tags`, plus:

- `status` — `active`, `shipped`, or `shelved`
- `featured` — `true` puts it on the home page
- `link` — optional URL, e.g. a repo

## Add a link

Edit `src/data/links.ts`. Add an entry to a group and it appears on `/links/`. Empty groups are
skipped, so it is safe to leave a section stubbed until you fill it.

```ts
{ label: 'Name', href: 'https://…', note: 'Why it is worth someone’s time.' }
```

## Edit the resume

Edit `src/data/resume.ts`. The page at `/resume/` is only layout — roles, skills, education and
talks all come from that file, and any section left as an empty array is skipped rather than
rendered as an empty heading.

Drop a PDF at `public/resume.pdf` and a download link appears automatically. No PDF, no link.

## Publish

```bash
git add -A && git commit -m "add post: my thing" && git push
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
- internal repo code, screenshots, schema, or endpoint details

When a project can't be written under those rules, it doesn't get a page.

## Drafts

`~/personal-site-drafts/` (outside this repo, never committed) holds a set of written-but-unpublished
project pages and posts, plus an expanded About and two extra section pages. See the README in that
folder — it lists what needs a second read before any of it goes live.

## Structure

```
src/
  content.config.ts        collection schemas — edit to add a frontmatter field
  content/projects/*.md    project pages
  content/blog/*.md        blog posts
  data/links.ts            everything on /links/
  data/resume.ts           everything on /resume/
  layouts/Base.astro       head, nav, footer  (nav and footer links live here)
  components/IndexList.astro   the numbered row list used by the index pages
  pages/                   routes
  styles/global.css        the whole design system, colors at the top
public/fonts/              self-hosted woff2 — no external font CDN
public/resume.pdf          optional; enables the download link on /resume/
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
