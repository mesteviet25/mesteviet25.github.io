---
title: 'Reading a Pitching Machine'
summary: 'A dial is not a speed. Instrumenting an old wheel machine to find out what it is actually throwing, before touching anything that could change it.'
date: 2026-08-25
status: active
featured: false
tags: ['hardware', 'measurement', 'practice design']
---

Wheel-style pitching machines have a speed dial. The number next to the dial is not a speed. On the
older machines it is closer to a voltage: the control is a potentiometer feeding a phase-angle drive,
and what comes out the other end depends on line voltage, wheel wear, ball compression, how warm the
motor is, and how long since someone last fed it a ball.

For a coach this matters more than it sounds. If you are building a practice block around a
velocity, and the machine drifts four miles an hour over a session, you were not running the block
you designed.

## Phase one: read only

The entire first phase is tachometry. Measure actual wheel speed, log it against dial position, and
build the map between them — including how the map moves as the machine warms and as the wheels
wear. No modification, nothing in the control path, nothing that changes what the machine does. Just
find out what it is doing.

That alone answers the useful questions. How repeatable is a given setting within a session? Across
sessions? How long does the machine need to settle before the number means anything?

## Why phase two is slow

Closing the loop — having the machine hold a target speed rather than a target dial position — is
the obvious next step and I am in no hurry.

Two reasons. The first is electrical: on this design the control circuit is not isolated from the
mains. It sits at line potential. That is not a "be careful" situation, it is a "do not treat this
like a hobby servo" situation, and the correct approach is isolation designed in from the start
rather than added once something has already gone wrong.

The second is that there is live patent coverage in this space running well into the 2030s. Building
something for my own cage to understand it is one thing. Anything beyond that needs a proper look at
what is actually claimed, before rather than after.

## Status

Instrumented and logging. Content to stay there for a while.
