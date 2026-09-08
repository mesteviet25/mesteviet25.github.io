---
title: 'A Hitter Made of Torques'
summary: 'Building a physics model of the swing driven by joint torques rather than fitted to positions — and finding out the hard way that it would not reproduce itself.'
date: 2026-08-20
status: active
featured: true
tags: ['simulation', 'biomechanics', 'mujoco', 'negative results', 'python']
---

Motion capture tells you where a hitter's segments were. It does not tell you what they did. Two
swings can trace nearly the same path with completely different amounts of effort behind them, and
the thing a coach actually wants to change is the effort, not the path.

So: build a hitter in a physics engine, give it joints and torques, and ask what pattern of torque
produces the swing you actually measured. If the fit is good, you get to talk about causes instead
of correlations.

## What it takes to get there

The model is a torque-driven skeleton in MuJoCo, with body properties taken from the captured
subject rather than from a textbook average. The optimizer searches for the torque profile whose
resulting motion best matches the recorded kinematics, from many random starting points — because a
single start finds a local minimum and then reports it with total confidence.

Two things cost me weeks:

- **A velocity convention.** The engine returns spatial velocities as *(rotational, linear)*. I read
  the first three components as linear. Everything downstream was angular velocity wearing a label
  that said metres per second. The giveaway had been sitting in front of me for days — two points on
  the same rigid body returning identical vectors, which linear velocity never does.
- **Real body properties.** Scaling a generic body to a hitter's height is not the same as using
  their actual segment masses and lengths. The difference showed up as torque the model had to
  invent to explain motion the mass distribution should have produced for free.

## The result I did not want

After fixing both, the fit passed on roughly half the swings. Then I ran the whole thing again,
unchanged, on the same data.

More than a third of the swings changed which side of the pass/fail line they landed on.

The optimizer was finding different basins on identical input. That is not a model that can say
anything about an individual swing. It kills the per-swing interpretation entirely — which was the
entire point of building it — and leaves only the cohort-level summary standing, because a median
over many swings is stable even when each swing is not.

## Why it is still here

Because that is the finding. A model that fits and does not reproduce looks exactly like a model
that works, right up until someone reruns it. The check that caught it costs one extra run of code
you have already written, and almost nobody does it.

The next honest move is not a better optimizer. It is a better loss function — one term is doing far
too much of the work — and I would rather fix the thing that is wrong than stack muscle models on
top of a foundation that wobbles.

Described at the level of method. No athlete data appears here.
