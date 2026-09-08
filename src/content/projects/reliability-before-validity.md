---
title: 'Reliability Before Validity'
summary: 'A study that asked whether a harder assessment measures something extra, and spent most of its life discovering how easy it is to fool yourself before you get to answer.'
date: 2026-09-06
status: active
featured: true
tags: ['assessment', 'measurement', 'statistics', 'methods']
---

The setup is simple enough to explain in a sentence. An assessment can present a hitter with a
straightforward version of a task or an awkward one. The awkward version costs more time and more
patience. Does it measure something the easy version does not?

That question turns out to be almost impossible to answer honestly without first answering a duller
one: *how much of what I am measuring is real at all?*

## Reliability is a ceiling, not a footnote

If a measurement only agrees with itself moderately well, then no relationship involving it can be
strong. That ceiling is not a caveat you add at the end. It is the number that decides whether the
study can succeed before you run it.

Which means every null needs its ceiling quoted next to it. "We found no relationship" and "we found
no relationship, and the best possible relationship given our measurement error was modest anyway"
are different sentences, and only the second one is informative.

## A split-half is not a test-retest

These get used interchangeably and they bound completely different claims.

- A **split-half** takes one session, cuts it in half, and correlates the halves. It tells you about
  noise *within* a sitting.
- A **test-retest** compares two separate sessions. It tells you whether the thing survives the
  hitter going home, sleeping, and coming back.

A trait claim needs the second. Reporting the first and calling it reliability inflates your ceiling
and makes a weak result look like a real one.

## Every null needs a positive control

If your method finds nothing, there are two explanations: there is nothing there, or your method
cannot find things. The only way to tell them apart is to point the same method at something you
already know is there. If it fails that too, you have not found a null — you have found a broken
pipeline.

## The check that cannot fail

The most useful thing this study produced is a list of analyses that are structurally incapable of
returning a negative result. My favourite from my own work: a permutation test where the shuffled
draws could not possibly be more extreme than the observation, because missing values had collapsed
the comparison. It reported that essentially everything survived correction. It was reporting
nothing at all.

If a check has never once come back negative, it is not a check. It is decoration.

## Where it stands

Under independent audit, and the audit has already overturned two of my own conclusions — one of
them a "failure" that was an artifact of running too few resampling draws, which passed cleanly once
I ran enough. Being wrong in a way that is discoverable is the good outcome. The study is being
redone with the design it should have had from the start.

Described at the level of method. No athlete data appears here.
