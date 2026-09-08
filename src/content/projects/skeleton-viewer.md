---
title: 'Skeleton Viewer'
summary: 'An offline 3D playback tool that will take a skeleton from any source, put it on one millisecond clock, and let you scrub it.'
date: 2026-08-28
status: active
featured: false
tags: ['tooling', 'visualization', 'motion capture', 'python']
---

Every motion capture system ships a viewer. Each one reads its own format, runs on its own machine,
and will not show you two captures side by side unless they came from the same vendor on the same
day. Meanwhile the actual question is almost always comparative: this swing against that one, this
session against six weeks ago.

So I built the boring tool. It takes 3D point data from whatever produced it — a markerless system,
a wide CSV, a parquet file, a C3D — and plays it back as a skeleton on a shared millisecond clock.

## The two decisions that made it work

**Infer the skeleton, do not configure it.** Asking the user to declare which points connect to
which is how these tools die: every new source needs a new config file, and the config drifts from
reality. Instead the viewer watches the point cloud and finds pairs whose distance stays fixed
across the whole capture. Rigid pairs are bones. Nearly all of a skeleton falls out of that one
rule, and a new data source needs no setup at all.

**One clock, in milliseconds.** Frame indices are a trap. Different sources sample at different
rates, one of them will lie about its rate in the file header, and a viewer that thinks in frames
will silently show you two swings drifting apart. Everything converts to milliseconds on load and
the timeline is the only shared coordinate.

## What it is not

Not a product, not a web app, not analysis. It draws dots and lines and lets you scrub. The value is
entirely in not caring where the dots came from.

Runs offline. No data ships with it.
