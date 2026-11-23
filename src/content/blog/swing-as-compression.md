---
title: 'The Swing Is a Compression Problem'
summary: 'Information theory already has words for pretraining, compression and prediction. I think they describe how a hitter learns better than most of the words we use in the cage.'
date: 2026-11-23
tags: ['hitting', 'motor learning', 'information theory']
draft: true
---

There is a contest called the Hutter Prize. You get one gigabyte of Wikipedia and you try to shrink it into the smallest file you can, with the program that unpacks it counted against you. The best entries get it down to roughly a tenth of its size.

I am a hitting trainer, so I had no business reading about it. But I haven't been able to put it down, because of the idea underneath the contest: to compress something well you have to predict it well. If your program can guess the next word, it barely has to store the next word. Compression and understanding turn out to be the same job.

That sounded a lot like hitting to me.

## Hitting was measured in bits before we had bat sensors

This part isn't my idea. In 1954 Paul Fitts showed that the time it takes to move to a target depends on how far away and how small the target is, and he wrote the difficulty down in bits. Around the same time, Hick showed that reaction time climbs with the number of choices in front of you, also in bits. Motor control has been borrowing from information theory for seventy years.

Now put a hitter in that frame. A 95 mph fastball gets to the plate in about 400 milliseconds. The swing itself eats roughly 150 of those. Whatever is left has to cover seeing the pitch, deciding, and starting. There is no time to work out a swing from scratch, joint by joint, on every pitch.

So the swing has to already exist in some short form that can be pulled up and adjusted with very little information. I think building that short form is most of what we mean by "learning to hit."

## Pretraining

Language models are trained in two stages. First they are pretrained on a huge pile of general text, where the only task is predicting what comes next. Then they are fine-tuned on something specific. The pretraining is where most of the ability comes from. Fine-tuning is fast because the general structure is already there.

Motor learning has its own version of this. Braun, Wolpert and colleagues ran experiments where people practiced a family of related tasks, and found they picked up new members of that family much faster afterward. They called it structure learning. The learner extracted what the tasks had in common, and the new task only needed a few settings changed.

I think about this with kids who played three sports and then show up to hit. They often learn faster than the kid who has taken ten thousand swings off a tee. One of them was pretrained on a wide set of movement problems. The other memorized one.

It also gives me a cleaner way to explain something coaches already know. In machine learning, a model that looks great on its training data and falls apart on new data is overfit. In motor learning, Shea and Morgan showed in 1979 that blocked practice looks better during practice and worse later, and Hall and colleagues found the same thing with college hitters in 1994: the group that took random-order batting practice did better on the transfer tests. Blocked practice gives you a low training loss. The game is the test set.

A hitter crushing 60 mph front toss in the same spot twenty times in a row is overfitting. I don't mean that as an insult to front toss. It has its place early, when someone is finding a new move. But the round that looks the best is often the one that teaches the least.

## Why compression makes you fast

Here is the part I find most interesting.

Early in learning, a movement is run step by step, and every step costs attention. With practice, the steps get packed together into one unit. Psychologists call this chunking, and it goes back to Miller in 1956. Newell and Rosenbloom later argued that chunking is the reason practice curves have the shape they do: every time a pattern gets packed into a single unit, you can fetch it in one step instead of many.

Packing things this way pays off in a few places.

There are fewer decisions to make. Hick's law says more choices means more time. One packed swing is one choice.

The program is quicker to start. Henry and Rogers found in 1960 that reaction time goes up when the movement you are about to make is more complicated, as if the plan takes time to load. A shorter plan loads faster.

And it frees up attention. When the swing runs itself, the hitter's head is available for the pitcher.

This is the automaticity that every hitter is chasing, whether or not they would call it that. It is also why "just think less" is bad advice for a beginner and decent advice for a pro. The beginner has nothing packed yet.

There is a cost, though. A packed pattern is hard to edit. If I want to change one piece of a good hitter's swing, they have to unpack it, run it slowly and badly for a while, and pack it again. Anyone who has made a mechanical change in the middle of a season knows what that dip feels like. Masters described choking in similar terms back in 1992: under pressure, skilled people start consciously steering a movement that used to run on its own, and it gets worse. In my head that is a hitter unzipping the file in the middle of an at-bat.

## The catch: a bad swing compresses great

If I stopped here, the takeaway would be "be as repeatable as possible." I don't think that's right.

A hitter who rolls over the same ground ball to short every time is extremely compressible. You could describe every one of his swings with almost no information. Compressibility by itself measures sameness, and sameness is only useful if the thing being repeated works.

The skilled movers that researchers have studied are also not as repeatable as you would guess. Bernstein filmed blacksmiths a century ago and noticed the hammer hit the same spot every time while the arm took a slightly different route on every strike. Scholz and Schoner later turned that into a method, the uncontrolled manifold, which splits variability into the part that changes the result and the part that doesn't. Todorov and Jordan gave it a control-theory reading in 2002: a good controller only corrects the errors that matter for the task and lets the rest go. Rob Gray's virtual batting work lands in the same place for hitters, with training raising the kind of timing variability that keeps the bat on the ball.

So the Hutter Prize version of compression, where every byte has to come back exactly, is the wrong model. The better one is what engineers call rate-distortion: how few bits can you spend and still keep the error on the thing you care about under some limit? A JPEG is the everyday example. It throws away detail your eye can't see and keeps what it can.

A good swing does the same. It is precise about the things that decide contact and sloppy about the things that don't.

I see a version of this in public Statcast bat tracking. When I take out the part of a hitter's swing-to-swing variation that is explained by the pitch (height, in or out, pitch type), the scatter that is left over tracks with xwOBA at about -0.37 across 2024 through 2026. Tighter leftover scatter, better production. That leftover scatter is also a trait, with a year-to-year correlation around 0.65. But the adjustment side is a trait too. How much a hitter changes his bat tilt with pitch height is one of the most stable things I have measured in public data, close to 0.9 year over year.

So I don't think the swing gets stored as a recording. A better picture is a short code with a few dials on it. Sequence and rhythm stay fixed and the dials move with the pitch. Schmidt was describing something very close to this in 1975 with schema theory, long before anyone had a bat sensor.

## Where my own camp would push back

I lean ecological in how I coach. I think the environment does most of the teaching and that the coach's job is to build problems where the right movement is the easiest answer. People in that camp are allergic to the phrase "motor program," and the idea of a swing stored like a file in the head is exactly what they argue against.

I don't think the compression idea needs the file. Compression is a statement about how short a description can be. It says nothing about where the description is kept. A pendulum's motion is highly compressible and nobody thinks the pendulum has a hard drive. When the dynamical-systems people talk about an attractor, a stable pattern the body settles into, they are describing a movement that needs very few numbers to pin down. As far as I can tell, that is the same low-dimensional thing I have been calling a short code.

And the prediction half fits the ecological view better than the storage half ever did. A hitter who has become attuned to the right information about the pitch is, in the Hutter sense, a better predictor. He is surprised less often. I think both camps are pointing at that and using different vocabularies for it.

## What I would measure

A way of thinking about hitting isn't worth much to me unless it turns into something I can measure. Here are the measurements I think this one suggests.

The first is predictability given your own history. Fit a model to a hitter's first fifty swings and ask how many bits it takes to describe the fifty-first. If learning is compression, that number should fall as a skill settles in.

The second is the same number split in two: the part of the movement that changes where the barrel is at contact, and the part that doesn't. I would expect skill to show up as a falling cost in the first part only.

Third, how well relative timing holds up when the swing speeds up or slows down. If the rhythm is the fixed part of the code, the proportions should survive a change of tempo.

Fourth is edit cost. After a mechanical change, how far does the hitter fall and how long does it take to come back? That is a direct read on how tightly the old pattern was packed.

And the last is the value of pretraining. How many reps does a brand-new drill take to reach a standard, and does that depend on how varied the hitter's movement background is?

## What trying to measure it has taught me

I have been working on some of these for a while and most of what I have learned is how easy it is to fool yourself.

Tempo hides inside everything. Many of the fancy measures of movement "complexity" change when a swing simply takes a few milliseconds longer, even if its shape is identical. If you don't line swings up in time first, you can end up thinking you measured how complex a swing is when all you measured was how consistent its timing is. That isn't a wasted result, because timing consistency is real and worth knowing about. But it is a different claim, and it took me an embarrassingly long time to separate the two.

Differences between hitters don't tell you what will happen inside one hitter. Finding that better hitters are more repeatable does not mean making one hitter more repeatable will make him better. Those are two questions and they regularly have two answers.

One session is a soft read. Swing-to-swing spread measured from a dozen swings bounces around a lot from one day to the next, much more than the average swing does.

And your tools can invent structure. I built a small physics model of a swing to map out which combinations of timing produce solid contact, and my first maps had beautiful, intricate edges. Every bit of it turned out to be a bug in how the simulation stepped through time. Once I fixed that, the region of good solutions had plain, smooth edges, a few tens of milliseconds wide. It was a far less exciting picture, and I trust it a lot more.

## Where this leaves me

I am not claiming the brain runs a zip program. What I am claiming is smaller. Information theory hands us a shared unit for things coaches already care about and usually talk about separately: how repeatable a swing is, how well it adjusts, how automatic it feels, how hard it is to change, and how well practice carries into a game. All of those can be asked as one question about how short a description the hitter has found for a swing that still works.

I don't know yet whether the measurements above will hold up. A couple of them probably won't. But I would rather be wrong about something I can measure than keep arguing about "feel" versus "mechanics" with no way to settle it.
