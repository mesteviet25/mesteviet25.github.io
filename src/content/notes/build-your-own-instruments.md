---
title: 'Build Your Own Instruments'
summary: 'Why a coach with a Python install beats a coach with a dashboard, and the specific thing you learn by building the tool that you cannot learn by using one.'
date: 2026-06-28
tags: ['tooling', 'coaching', 'python']
draft: false
---

Every measurement product ships with a dashboard. The dashboard shows you what its authors thought
was worth showing. That is not a criticism — they had to pick — but the pick was made without you,
your hitters, or your question in the room.

The gap between "what this system captured" and "what this dashboard displays" is enormous, and it
is where most of the interesting questions live.

## What building teaches that using does not

**Where the numbers come from.** You cannot use a metric well until you know what it does at its
edges. Building the calculation forces you to meet the edge cases — the frame that is null, the
sampling rate that is not what the header claims, the value that is field-absolute when you assumed
it was batter-relative. Every one of those is a silent wrong answer if someone else handled it and
you never looked.

**Which numbers are load-bearing.** Compute twenty things and most turn out to be the same thing
wearing different units. You do not discover that from a dashboard, because a dashboard shows you
six tiles and implies each is independent information.

**What the system cannot see.** Every capture pipeline throws things away early. Finding out what
was discarded — and that the question you now want to ask needed it — is a lesson you only get by
going upstream of the summary.

## The objection

"You are a coach, not an engineer." True, and the tools I build are not products. They are ugly,
they have no error handling worth the name, and they fall over if you look at them wrong. That is
fine. They have one user who knows every assumption in them, which is a much stronger safety
guarantee than polish.

The failure mode of the alternative is worse. A coach who cannot interrogate a number either trusts
it completely or ignores it completely, and both of those are ways of not thinking.

## The honest cost

It is slow, and most of it is not analysis. It is figuring out a file format, or that a timestamp is
in a different timezone than the one next to it, or that a "frame rate" field lies. Plumbing.

The payoff is that when the number finally arrives you know exactly what it is, and you know the
three ways it could be wrong. That is worth more to a coaching decision than a prettier chart of a
number you cannot vouch for.
