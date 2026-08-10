---
title: 'Swing Contact 3D'
summary: 'Mapping whiffs and contact in three dimensions from public bat-tracking data — where a swing actually lives, not where the hitter thought it did.'
date: 2026-07-01
status: active
featured: true
tags: ['bat tracking', 'statcast', 'swing mechanics', 'python']
---

A whiff is usually reported as a binary. It isn't one. A swing that misses by half an inch under
the ball and a swing that misses by six inches over it are different failures with different fixes,
and a swing-and-miss rate treats them as the same event.

Public bat-tracking data now carries enough information to reconstruct roughly where the barrel was
when the ball crossed it. This project builds that reconstruction into a three-dimensional map: for
a given hitter, where in the zone does the barrel arrive on plane, where does it arrive early or
late, and where does it arrive at the wrong height entirely.

## The method it builds on

The core idea — estimating bat path and splitting a miss into its directional components rather
than collapsing it to a yes/no — comes from work published openly by
[@903124s](https://x.com/903124s). The published constants and the split framing are theirs; I've
credited them here because the project doesn't exist without that starting point.

What I added on top:

- **A swing-plane anchor.** Earlier versions measured misses against the pitch. Anchoring to the
  hitter's own swing plane instead separates "the swing was wrong" from "the swing was fine and
  aimed at the wrong pitch."
- **An asymmetric dead-band.** Missing over the ball and missing under it are not symmetric
  failures — the tolerances differ, and forcing one symmetric band around zero was costing
  accuracy. Fitting the over and under bands independently, with a multi-start calibration to keep
  the optimizer off local minima, cut model RMSE by about 21% against the prior version.
- **Swing-to-swing variance.** Averaging a hitter's swings produces a swing that no hitter has ever
  taken. Carrying the spread through instead lets the map say "this hitter is consistent and
  consistently wrong" versus "this hitter is right on average and never twice in a row" — two
  problems that look identical in a mean.

## Where it stands

Working, useful, and not finished. The model is honest about its error bars, which is the part I
care most about — a whiff map that looks confident everywhere is lying somewhere.

Built on public Statcast data. No athlete data from work appears in it.
