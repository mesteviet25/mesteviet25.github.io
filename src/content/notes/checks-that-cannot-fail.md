---
title: 'Checks That Cannot Fail'
summary: 'If a test has never once come back negative, it is not testing anything. A small collection of validations that were decoration.'
date: 2026-09-02
tags: ['methods', 'statistics']
draft: false
---

A validation step that always passes is not protecting you. It is reassuring you, which is worse
than nothing, because you spend the confidence somewhere.

I keep a running list of ones I have shipped or nearly shipped.

## The permutation test with no room to move

The intended logic: shuffle the labels many times, see how often the shuffled data looks as extreme
as the real data, and if the answer is almost never, you have something.

What happened: missing values collapsed the comparison such that a shuffled draw could not be more
extreme than the observation. Not *unlikely* to be — structurally could not. So the count of
draws-more-extreme was zero every time, and the reported significance was as strong as the
arithmetic could express. It announced that essentially every feature survived multiple-comparison
correction.

It was measuring nothing. It looked like the best result I had ever produced.

## The reliability figure that was the wrong reliability

Reporting a within-session split-half and treating it as evidence a measurement is stable across
sessions. The number is real, it is just answering a question nobody asked, and it is always higher
than the one you needed. It raises the ceiling on every downstream claim by measuring the easy thing.

## The positive control nobody ran

If your method finds nothing, you have two candidate explanations: nothing is there, or your method
cannot find things. A null without a positive control does not distinguish them. And the positive
control is usually easy — point the pipeline at a relationship you already know exists and confirm
it comes back.

I have skipped this more than once because the null "made sense." A null that makes sense is exactly
when you should be most suspicious, because it will not prompt you to look.

## The test suite that asserts the code ran

Assertions that a function returns a dataframe, that the row count is positive, that no exception was
raised. All true of thoroughly broken code. If a test would pass on output that is silently wrong,
it is a smoke test, and calling it validation is how the wrong number gets to production.

## The heuristic

Ask of any check: **what would make this fail?**

If you cannot immediately describe a concrete input that trips it, it is not a check. Then go
further — construct that input and confirm it actually does. Deliberately break the thing and watch
the alarm go off. An alarm nobody has ever heard is a decoration you have agreed to trust.
