---
title: 'Traps in the Public Baseball Data'
summary: 'A running list of ways the free data will quietly hand you a wrong answer, collected by handing myself wrong answers.'
date: 2026-08-08
tags: ['statcast', 'data', 'methods']
draft: false
---

The public baseball data is extraordinary and it is free. It also has sharp edges that do not throw
errors — they return a plausible number that is not the number you asked for. Everything here I hit
myself.

## A year parameter that is silently ignored

Several of the newer leaderboards — the bat-tracking and swing-profile family in particular — take
a season parameter, accept it without complaint, and return the current season regardless once you
combine it with a minimum-swings filter.

You get a clean response. It has the right columns. It is not the year you requested. Any
year-over-year comparison built on it is comparing this season to itself.

The tell is that your "different seasons" agree suspiciously well. Check a single known value
against the site before trusting any multi-season pull.

## Filters that are not optional

Several metrics are only meaningful on a subset, and the subset is not applied for you:

- **Bat speed** needs a competitive-swing floor. Include checked swings and bunt attempts and you are
  averaging in swings the hitter was not really taking. The published figures apply a filter; a naive
  average of everything runs roughly a mile per hour low, which is exactly the size of effect people
  try to detect.
- **Exit velocity and launch angle** are only defined on balls in play. Rows exist for other events.
  They will average happily.
- **Zone-location logic** frequently has an inner region and a sub-region that must be combined. Use
  one and you have quietly analysed a slice.

Mixing a competitive-swing pipeline with an all-swing pipeline in the same comparison is the version
of this that has bitten me hardest, because both sides look reasonable in isolation.

## Aggregates and raw data disagree, and the aggregate usually wins

When a site-published rate and my recomputation from raw events disagree, my recomputation has been
wrong essentially every time. The published version applies qualifying filters that are documented
somewhere I did not read.

If your number is about half the official one, you have almost certainly got the denominator wrong.

## Joins need more key than you think

Matching pitch-level records across sources needs game, at-bat, and pitch number together. Any two of
the three will produce a join that mostly works, which is worse than one that obviously fails — you
will find the duplicates months later in a result you already believed.

## The meta-lesson

Every one of these produced output. None raised an error. The data was not corrupt and the code did
not crash; the answer was just to a different question.

So the check is never "did it run." It is: take one row, follow it to the source, confirm by hand
that the number means what you think. Once, at the start. It costs twenty minutes and it is the only
thing standing between you and a confident wrong answer.
