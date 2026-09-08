---
title: 'Cutting Film That Argues'
summary: 'Video tools for coaching: four swings synced on contact, metrics burned into the frame, and an honest accounting of where the edit can lie.'
date: 2026-08-15
status: active
featured: false
tags: ['video', 'ffmpeg', 'coaching', 'communication']
---

A clip on its own is a vibe. Two clips side by side is an argument, and an argument can be rigged
without anyone intending to rig it.

This is a set of tools for building comparison video that holds up: multiple swings in one frame,
synchronised on the moment that matters, with the numbers on screen so the viewer can check the
claim instead of taking my word for it.

## Sync on contact, not on the start

The instinct is to line clips up at the start of the move. Do that and by the time the bat arrives
the swings have drifted apart, and any difference you point at is partly a timing artifact you
introduced.

Contact is the anchor. Everything before it is the approach to a shared event, and differences you
see are real differences rather than accumulated offset. For before-and-after on the same hitter,
there is a second useful anchor: the onset of the move you are actually trying to change. Sync
there and the rest of the frame stops arguing with you.

## Put the numbers in the frame

Every panel carries its own metrics — bat speed, attack angle, the vertical and horizontal
components. Not because viewers will read every digit, but because a claim with its evidence
attached is a different kind of claim. If the two swings I called "the same except for the path"
differ by six miles an hour, that is in the frame, and someone will catch it. Good.

## Things I learned the annoying way

- **A drive-letter path inside a text filter breaks the filtergraph parser.** On Windows the colon
  in `C:\` is read as an argument separator. Copy the font file next to the script and reference it
  relatively. This costs an hour exactly once.
- **The container frame rate is not the capture rate.** High-speed footage frequently arrives in a
  30fps container. Anything that reasons in frames rather than time will be silently wrong.
- **Cameras get repositioned mid-session.** A crop that framed the first ten swings can be pointing
  at a wall by the fortieth. Verify the crop across the whole clip, not on the first frame.
- **Vertical video loses the bottom of the frame twice** — once to the player interface, once to the
  feed crop. Anything below roughly the three-quarter line is not reliably visible. Design for the
  middle.

Built for MLB broadcast and public bat-tracking footage. Athlete work stays in the cage.
