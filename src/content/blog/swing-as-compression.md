---
title: 'Thinking About the Swing as a Compression Problem'
summary: 'I went down a rabbit hole on data compression and came out the other side thinking it might be one of the better ways to describe what happens when a hitter learns.'
date: 2026-11-23
tags: ['hitting', 'motor learning', 'information theory']
draft: true
---

I went down a rabbit hole recently reading about something called the Hutter Prize. It's a contest where you take a gigabyte of Wikipedia and try to squeeze it into the smallest file you possibly can, and the best guys have gotten it down to around a tenth of the original size. That has nothing to do with hitting, obviously, but the reason the contest exists is what got me. The idea is that in order to compress something really well you have to be able to predict it really well, because if you already know what's coming next you barely have to write it down.

I've been reading a lot about motor learning and ecological dynamics over the last year, and I've been spending a lot of my time looking at how much hitters vary from swing to swing, and the more I read about compression the more it sounded like the stuff I was already thinking about. So this is me trying to work through whether that's actually a useful way to describe how hitters learn, or whether I just think it's cool.

## People were measuring movement in bits a long time ago

The first thing I found out is that this isn't a new idea at all. Fitts's law, which is from the 1950s, says the time it takes you to move to a target depends on how far away it is and how small it is, and the difficulty is literally measured in bits. Hick's law is from around the same time and says your reaction time goes up the more options you're choosing between. So motor control people have been borrowing from information theory for like seventy years, and I just hadn't connected it to what we do in the cages.

When you think about hitting that way it gets pretty interesting. A 95 mph fastball gets to the plate in about 400 milliseconds, and the swing itself takes up something like 150 of those. That leaves a hitter very little time to see the pitch, decide whether to go, and get started. There's no way a hitter is building a swing from scratch in that window, so whatever they're doing has to already be there in some really short form that they can pull up and adjust with very little information. My thought is that building that short form is a big part of what learning to hit actually is.

## Pretraining

The way AI language models get trained is in two steps. First they get trained on a giant pile of general text where the only job is predicting the next word, and then they get fine-tuned on whatever specific thing you want them to do. Most of what the model can do comes from the first step, and the second step goes fast because the general structure is already built.

I think there's a version of this in hitters. There's research on what's called structure learning, where people practice a bunch of related tasks and then pick up a new task from that same family way faster than someone starting cold, because they already learned what all those tasks have in common. That's pretty much what I see with the kids who played three sports growing up versus the kid who has taken a million swings off a tee. The multi-sport kid has been pretrained on a ton of different movement problems, and the tee kid has basically memorized one of them.

It also gives me a better way to explain blocked versus random practice, which is something we talk about a lot. In machine learning, if a model looks great on the data it trained on and then falls apart on anything new, it's overfit. The contextual interference research says the same thing about practice: blocked rounds look better while you're doing them and worse when you test later, and there was a study in the 90s with college hitters where the random BP group did better on the transfer tests. So a guy who is crushing the same 60 mph front toss in the same spot twenty times in a row is kind of overfitting. That's not me saying front toss is bad, because it's useful when someone is trying to feel a new move for the first time, but the round that looks the best is a lot of the time not the one that's doing the most for you.

## Why I think this is where automaticity comes from

This is the part I'm most interested in. Early on when you're learning a movement, you're running it one piece at a time and every piece takes attention. As you practice, those pieces get packed together into one thing, which is what the research calls chunking. Once the swing is one chunk instead of ten pieces, a few things get easier at the same time. You have fewer decisions to make, which matters because more decisions means a slower reaction. The plan is also quicker to get going, since there's older research showing reaction time goes up when the movement you're about to make is more complicated. And your attention is freed up to actually compete against the pitcher instead of thinking about your hands.

I think that's what hitters mean when they say a swing feels automatic, and it's also why "just stop thinking" works okay for a pro and is terrible advice for a beginner, because the beginner doesn't have anything packed together yet.

The downside is that once something is packed together it's really hard to change. If I want to change one piece of a good hitter's swing, they pretty much have to unpack the whole thing, do it slowly and badly for a while, and then pack it back up, and anyone who has tried to make a swing change in the middle of a season knows exactly how bad that stretch feels. Choking under pressure gets described in a similar way in the research, where a skilled person starts consciously controlling something that used to run by itself and it gets worse. The way I picture it is a hitter unzipping the file in the middle of an at-bat.

## The problem with all of this

If I stopped there, the takeaway would be that hitters should just be as repeatable as possible, and I don't think that's right. A guy who rolls over the same ground ball to shortstop every single swing is extremely repeatable. You could describe all of his swings with almost no information, so he's very compressible, and he's also not very good.

The other issue is that the best movers aren't actually as repeatable as you'd think. There's a famous old study where Bernstein filmed blacksmiths and found that the hammer hit the same spot every time but the arm took a slightly different path to get there on every swing. A lot of the variability research since then, including the uncontrolled manifold stuff and Rob Gray's work on hitters, comes down to the same idea, which is that skilled people are really consistent in the things that affect the result and they let everything else move around.

So the Hutter Prize kind of compression, where you have to get every single byte back perfectly, is the wrong comparison. The better one is how a JPEG works, where you throw out the detail nobody can see and keep the detail that matters, and you end up with a way smaller file that still looks right. I think a good swing does that. It's precise about the things that decide whether you make good contact and pretty loose about the things that don't.

I've seen some of this in the public Statcast bat tracking data. If you take out the part of a hitter's swing-to-swing variation that's explained by the pitch (how high it is, in or away, what type of pitch), the leftover scatter is related to xwOBA at about -0.37 from 2024 through 2026, meaning the tighter guys tend to produce more. That leftover scatter also holds up year to year at around 0.65, so it looks like a real trait. What I found interesting is that how much a hitter adjusts is a trait too. How much a guy changes his bat tilt based on pitch height is one of the most stable things I've looked at in public data, close to 0.9 year over year.

So my current way of thinking about it is that the swing isn't stored like a recording that gets played back. It's more like a short code with a few dials on it, where the sequence and the rhythm stay about the same and the dials move with the pitch.

## Where the ecological people would disagree with me

I lean pretty heavily toward the ecological side in how I coach. I think the environment does most of the teaching, and that a big part of my job is setting up games and constraints where the movement I want is the best solution to the problem. People on that side really don't like the idea of a "motor program," which is the swing being saved in your head like a file, and I mostly agree with them on that.

I don't think the compression idea actually needs the file though. Compression is only about how short a description of something can be, and it doesn't say anything about where that description lives. When the dynamical systems people talk about an attractor, which is a stable pattern the body settles into, they're describing a movement that doesn't take much information to describe, and to me that's the same thing I've been calling a short code. The prediction part fits too. A hitter who is tuned in to the right information from the pitcher is going to get surprised less often, which is what a good compressor is doing.

## What I'd want to measure

None of this is worth much unless it turns into something I can measure, so here's the stuff I'd want to look at:

- How predictable a hitter's next swing is from his own previous swings. If learning really is compression, that should get more predictable as a skill settles in.
- That same thing, but split into the parts of the movement that change where the barrel ends up at contact and the parts that don't. I'd expect the good hitters to only tighten up the first part.
- Whether the rhythm of the swing stays the same when the whole swing speeds up or slows down.
- How far a hitter drops off after a mechanical change and how long it takes to get back, which would tell you how tightly packed the old swing was.
- How many reps it takes someone to figure out a brand new drill, and whether that depends on how much variety they've had in their training.

## Things I've already gotten wrong

I've been working on a few of these already, and mostly what I've learned is how easy it is to fool yourself.

The biggest one is that timing gets into everything. A lot of the fancier ways of measuring how "complex" a movement is will change just because a swing took a few milliseconds longer, even if the shape of the swing is exactly the same. So if you don't line the swings up in time first, you can think you're measuring how complex someone's swing is when really you're measuring how consistent their timing is. Timing consistency is still a real thing and worth knowing about, but it's a different claim, and it took me way too long to figure out I was mixing the two up.

Another one is that comparing hitters to each other doesn't tell you what happens inside one hitter. Even if better hitters are more repeatable, that doesn't mean making one guy more repeatable is going to make him better, and I've had those two questions give me different answers more than once.

One session also isn't a lot to go on. How spread out a guy's swings are bounces around a ton from one day to the next, way more than his average swing does.

And the last one is that your tools can make things up. I built a small physics model of a swing to try to map out which combinations of timing lead to solid contact, and the first maps I got had these really intricate, cool looking edges that I got pretty excited about. It turned out all of it was coming from a bug in how the simulation was stepping through time. When I fixed that, the area of good solutions was just a plain smooth region a few tens of milliseconds wide, which is a lot less exciting but I trust it a lot more.

## Where my head is at

I'm not saying the brain is running a zip program. What I like about this is that it gives me one way to talk about a bunch of things that we usually talk about separately, like how repeatable a swing is, how well it adjusts, how automatic it feels, how hard it is to change, and how well practice carries over to games. All of those are kind of the same question, which is how short of a description a hitter has found for a swing that still works.

I don't know yet if the stuff I want to measure is going to hold up, and some of it probably won't. I'd still rather have something I can test and be wrong about than keep going back and forth on feel versus mechanics.
