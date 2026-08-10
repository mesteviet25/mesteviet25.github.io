---
title: 'Adaptability vs. Repeatability'
summary: 'A framework for separating two things that look identical in a standard deviation — a hitter adjusting correctly, and a hitter unable to repeat.'
date: 2026-06-10
status: active
featured: true
tags: ['motor learning', 'biomechanics', 'method']
---

Take twenty swings from a hitter and measure any variable you like. You get a mean and a spread.
The spread is usually treated as a defect — tighten it up, be more consistent.

That's wrong often enough to matter, because two very different hitters produce the same spread:

- The hitter who **changes their swing to match the pitch**, correctly, every time. Their spread is
  large because the pitches were different. This is skill.
- The hitter who **cannot reproduce their own swing** from rep to rep regardless of the pitch.
  Their spread is large because they are noisy. This is a problem.

Collapsing both into one standard deviation guarantees you'll coach at least one of them backwards.

## The split

The framework separates the spread into two quantities:

**Adaptability** — how much of the swing-to-swing variation is explained by what the swing was
responding to. Regress the swing variable on the pitch it faced; the variance explained is the part
of the hitter's variability that is doing a job.

**Repeatability** — what's left. The residual spread after the intent is accounted for. This is the
part that is genuinely noise, and the part worth trying to shrink.

A hitter can be high on both (adjusts well, executes cleanly), high on adaptability and low on
repeatability (right idea, unreliable body), or low on both (same swing every time, which sounds
like a compliment until you notice the pitch changed).

## Why it changes the intervention

The four quadrants get four different plans. Low repeatability is a movement-quality and
constraint problem. Low adaptability with high repeatability is a perception and swing-decision
problem — the body works, the read doesn't. Prescribing "be more consistent" to the second hitter
makes them worse at the thing they most need to do.

This page describes the method only. The implementation runs on lab capture data at work and none
of that data — or anything derived from it — appears here.
