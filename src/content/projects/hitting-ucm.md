---
title: 'The Uncontrolled Manifold, and a Negative'
summary: 'Borrowing a motor-control method built for reaching and pointing, applying it to the swing, and reporting that it did not find what it was supposed to find.'
date: 2026-05-10
status: shipped
featured: false
tags: ['motor control', 'variability', 'negative results', 'biomechanics']
---

There is an idea in motor control called the uncontrolled manifold. The short version: when you
perform a task, some combinations of your joint angles matter to the outcome and some do not. A
skilled mover is not rigid — they are sloppy in exactly the directions that do not matter, and tight
in the directions that do. Variability is not the opposite of skill. Structured variability *is* the
skill.

It is a genuinely beautiful idea, and it has held up across reaching, pointing, standing, shooting.
I wanted to know whether it holds in a swing.

## What I did

Recreated the standard analysis on swing data: decompose the swing-to-swing variability into the
component that leaves the outcome unchanged and the component that moves it, then compare the two.

## What came back

The variance structure replicated — the swing does show the general shape you would expect from this
family of analyses. But the specific result, the clean separation that says *this hitter is
stabilising this outcome variable*, did not appear.

I am reporting that as a negative rather than going hunting for a subgroup where it worked. The
obvious next move is to blame the outcome variable — pick a different thing to claim the hitter is
stabilising, and try again. That is precisely how a null gets converted into a finding by attrition,
and I would rather leave it documented and unconverted.

## Why publish a null

Because someone else is going to have this same idea. It is a natural one. They should get to start
from where I stopped, rather than spending two months rediscovering that the obvious version does
not work.

The file drawer is where the honest half of the literature goes to die.

Described at the level of method. No athlete data appears here.
