---
title: 'Posters for the Cage Wall'
summary: 'One-page coaching graphics generated from code, so the thing on the wall and the thing in the framework cannot drift apart.'
date: 2026-08-31
status: active
featured: false
tags: ['design', 'coaching', 'practice design', 'python']
---

Coaching content has a versioning problem. The framework lives in a document, the poster on the cage
wall was made in a design tool eighteen months ago, and the two have quietly disagreed for a year.
Nobody notices because nobody diffs a PNG.

So these are built as code. The content is pulled from the written framework, the layout is a
template, and regenerating is one command. If the framework changes, the poster changes, and I can
see exactly what moved.

## What a good one does

A cage poster is not a document. It gets read from eight feet away by someone mid-set who has about
four seconds and is slightly out of breath.

Which means: one idea per poster. A short list of non-negotiables rather than a full explanation.
Type large enough to read across the cage. No paragraph anybody has to stop to parse. If it needs a
legend, it is a handout, not a poster.

The first one covers the non-negotiables for a bat speed day — the handful of things that have to be
true for the session to be the session, as opposed to a general hitting block that happens to be
labelled one.

## The part that generalises

The builder pattern outlasts any individual poster. Content in, template applied, PNG out at print
resolution. Adding a second poster is a content file rather than a design project, which is the only
reason a second one ever gets made.

One thing worth knowing if you do this: export transparent. Graphics that will be composited over
anything — a footer, a branded frame, a slide — need transparency or you spend the rest of your life
matching background colours by eye and getting it slightly wrong.

Coaching concepts only. Nothing athlete-specific.
