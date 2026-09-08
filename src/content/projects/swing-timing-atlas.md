---
title: 'Which Segment Re-Times?'
summary: 'When a swing changes, something in the kinematic sequence moves first. An atlas of what actually re-times — and three questions people routinely run together.'
date: 2026-06-15
status: active
featured: true
tags: ['kinematic sequencing', 'biomechanics', 'causal inference', 'python']
---

"Sequence" is one of the most used words in hitting instruction and one of the least specified. The
claim is that the pelvis leads, the torso follows, the arms follow that, and the bat arrives last.
Fine. But when a hitter's swing changes — because you cued something, or because they got stronger,
or because it was a Tuesday — which link in that chain moves, and by how much?

This project set out to build the atlas: for each segment, how much its timing actually varies, and
what moves with it.

## Three things that go wrong on the way

**Peak times are a bad clock.** The obvious approach is to time each segment by its peak angular
velocity. Those peaks turn out to be too flat and too noisy to anchor anything — the peak wanders
across a window wide enough to swallow the effect you are looking for. The timing has to come from
somewhere more stable.

**The arms absorb the variance.** Most of the swing-to-swing timing slop lands distally. The pelvis
and torso are comparatively metronomic; the arms and hands soak up the adjustment. Which is
sensible — that is exactly where you would want a late correction to live — but it means the
segments most people cue are the ones changing least.

**There are no archetypes.** I went looking for clusters: the early rotator, the late connector, the
tidy taxonomy that would make this coachable. They are not there. The variation is continuous. Any
grouping I drew was a line through a cloud, and it moved when I redrew it.

## The part I now care about more than the atlas

Somewhere in the middle of this I realised I had been running three different questions together —
and so does nearly everything I have read on the subject:

1. **Between hitters.** Hitters whose pelvis fires earlier tend to do X.
2. **Within an assessment.** On a given day, this hitter's earlier swings tend to do X.
3. **Under intervention.** If I make this hitter's pelvis fire earlier, X will happen.

These are three different numbers. They can have different magnitudes and different signs. A
between-hitter correlation is not permission to make a prediction about a change you are about to
cause, and neither is a within-session pattern. The overlap in the language hides which one is being
claimed — everybody says "earlier pelvis, more bat speed" and almost nobody says which of the three
they mean.

I built a simulation layer specifically so I could compare all three against a known ground truth.
The discipline that came out of it has outlived the atlas.

Described at the level of method. No athlete data appears here.
