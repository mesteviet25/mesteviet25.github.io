---
title: 'A Single Is Not a Walk'
summary: 'Run-value math on public play-by-play: the gap between a single and a walk is almost nothing with the bases empty and enormous with runners on. Lineup slot turns out to be a dead end.'
date: 2026-05-20
status: shipped
featured: true
tags: ['run values', 'play-by-play', 'lineup construction']
---

On-base percentage counts a single and a walk the same. Everyone knows that's a simplification.
Almost nobody knows how big the simplification is, because the answer depends entirely on who's
standing on the bases.

Working from public play-by-play data, the run-value difference between a single and a walk is
roughly **0.004 runs with the bases empty** — genuinely nothing, OBP is right — and roughly
**0.473 runs with a runner in scoring position.** Same two outcomes, a hundredfold difference in
what they're worth, decided by context the hitter didn't choose.

## The obvious next question, and why it's the wrong one

If contact is worth that much more with traffic on, put the contact hitters where the traffic is.
That's the intuition behind a hundred years of lineup arguments.

It doesn't survive the math. Moving a hitter up or down the order changes two things at once: the
traffic they come up with, and the double plays they're exposed to. Across a full season those two
effects land close enough to even that the net gain from re-sorting the order is small enough to
disappear into noise. **Batting slot is a dead end.**

The lever that actually moves is **who bats around them** — the on-base skill of the hitters
immediately in front, which changes the base state distribution a hitter faces far more than moving
them one or two spots ever does. That reframes the question from "where does this guy hit" to "who
is he hitting behind," which is a roster question, not a lineup-card question.

## The coaching version

For a hitter, the useful translation is narrower and more actionable: the value of your approach
changes with the base state, and it changes a lot. A two-strike approach that trades power for
contact is nearly free with the bases empty and expensive to skip with a runner on second. That's
not a philosophy, it's arithmetic.

Public data throughout.
