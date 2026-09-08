---
title: 'Run It Twice'
summary: 'The cheapest check in modelling, the one almost nobody performs, and the time it cost me a project.'
date: 2026-08-24
tags: ['methods', 'modelling', 'negative results']
draft: false
---

Here is a check that takes one command and no thought.

Run your fit again. Same code, same data, nothing changed. Compare the two answers.

If they disagree, everything you concluded about individual cases is gone.

## How I learned it

I had a physics model of the swing that solved for the joint torques behind a captured movement. It
fit about half the swings acceptably, which was a reasonable place to be. I was writing up
per-swing interpretation — *this* hitter's model says *this* about *this* swing — when I reran the
whole thing out of paranoia.

More than a third of swings changed which side of the pass/fail line they landed on.

Nothing had changed except the optimizer's random starting points. The answers were basins, not
solutions. Every per-swing sentence I had drafted was describing a coin flip.

## Why it does not get caught

Because the failure is invisible from inside a single run. A model that lands in a different basin
each time still produces a number, still produces a plausible-looking fit, still lets you build the
plot. Nothing errors. Nothing warns. You get output, and output feels like an answer.

And because rerunning feels like waste. The result is *right there*. Doing it again to get the same
thing seems like a way to spend an afternoon achieving nothing — which is precisely the outcome you
are hoping for, and the reason it is worth the afternoon.

## What survives

Not nothing. Aggregates can be stable even when individuals are not: a median across a large sample
barely moves while every member of it is flipping. So the cohort-level statement survived and the
per-case statements did not, and the useful thing was knowing which was which.

That is a smaller project than the one I thought I had. It is also a true one.

## The general version

Any analysis with a random component — random initialisation, sampling, resampling, cross-validation
splits, anything shuffled — should be run more than once before you believe its resolution. And the
number of draws is part of the method: I have also had the opposite failure, a result that looked
like a clean negative and turned out to be an artifact of running too few resampling draws. It
passed comfortably once I ran enough.

Both errors have the same root. A single run tells you what happened once. You wanted to know what
happens.
