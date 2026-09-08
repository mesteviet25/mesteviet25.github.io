---
title: 'Replicating Someone Else First'
summary: 'Taking a published set of complexity measures built for pitching, rebuilding them from the paper, and running them on hitting before believing any of it.'
date: 2026-08-05
status: shipped
featured: false
tags: ['replication', 'biomechanics', 'methods', 'python']
---

There is a family of measures that treat a movement as a nonlinear system and ask how complex,
regular, or predictable the signal is. They have a real track record in gait and in pitching. The
temptation is to point them at hitting, get numbers, and start interpreting.

I made myself do the boring version first: rebuild the published analysis from the paper, on the
population it was published for, and check that my implementation reproduces the reported result
before pointing it anywhere new.

## Why bother

Because these measures are full of knobs. Embedding dimension, tolerance, delay, how you window the
signal, what you do at the edges. Every one of those choices moves the answer, and papers vary in
how much they tell you. An implementation that is "the same method" in outline can be a different
method in practice, and you will not know unless you have a target to hit.

Mine reproduced the headline figure closely enough to trust. That took a while, and it was the most
valuable part of the project — every hour spent there was an hour I did not later spend defending a
number that came out of a bug.

## Then the actual question

With the implementation validated, applying it to hitting is cheap. The results are aggregates —
feature-level summaries across a large number of swings, not per-athlete readouts — and they are
written up as an internal report rather than a claim about anybody.

The one methodological point worth carrying out of it: a complexity measure computed on a signal
you have already smoothed is measuring your smoothing. Several of these metrics are exquisitely
sensitive to preprocessing that feels like housekeeping. Decide the filter before you look at the
output, and write down why.

Replication target was public. Everything else is described at the level of method.
