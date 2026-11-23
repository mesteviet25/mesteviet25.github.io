---
title: 'Thinking About the Swing as a Compression Problem'
summary: 'A working paper on whether the math behind data compression (entropy, cross-entropy and rate-distortion) is a useful way to describe what happens when a hitter learns.'
date: 2026-11-23
tags: ['hitting', 'motor learning', 'information theory']
draft: true
---

## Abstract

I went down a rabbit hole on data compression and came out thinking it lines up with a lot of what I've been reading in motor learning and what I've been looking at in swing-to-swing variability. This post is me trying to work through that. I walk through where information theory already shows up in motor control (Fitts's and Hick's laws), why "compression is prediction" maps onto pretraining and practice design, why chunking is a reasonable explanation for automaticity, and why the right comparison for a good swing is lossy compression (rate-distortion) instead of lossless. Then I try to connect that to the uncontrolled manifold work, which I think is the closest real mathematical overlap, and lay out what I'd want to measure. Every figure in here is a schematic drawn from the equations or from a toy model, and none of them are athlete data.

## 1. Introduction

Where this started was watching 3Blue1Brown's mini-series on compression on YouTube [1, 2]. The first video rebuilds entropy from scratch and the second one is about cross-entropy, which is basically the question of what it costs you to compress something when your model of it is wrong. The idea that stuck with me from the series is that in order to compress something really well you have to be able to predict it really well, because if you already know what's coming next you barely have to write it down.

I've been reading a lot about motor learning and ecological dynamics over the last year, and I've been spending a lot of my time looking at how much hitters vary from swing to swing, and the more I watched the more it sounded like the stuff I was already thinking about. So this is me trying to work through whether that's actually a useful way to describe how hitters learn, or whether I just think it's cool.

## 2. Movement was being measured in bits a long time ago

The first thing I found out is that this isn't a new idea at all. Shannon defined the information in an event with probability $p$ as $-\log_2 p$ bits, and the entropy of a source as the average of that [3]:

$$
H(X) = -\sum_x p(x)\,\log_2 p(x) \tag{1}
$$

Within a few years motor control people were already using it. Hick showed that reaction time goes up linearly with the information in the choice you're making [4], and Fitts showed that movement time goes up linearly with an "index of difficulty" that is also in bits [5]:

$$
RT = a + b\,\log_2(n + 1) \tag{2}
$$

$$
MT = a + b\,\log_2\!\left(\frac{2D}{W}\right) \tag{3}
$$

where $n$ is the number of equally likely options, $D$ is the distance to the target and $W$ is how wide the target is. Fitts was explicitly treating the arm like a communication channel with a limited capacity, which is where the title of his paper comes from.

<figure>
<img src="/images/blog/swing-as-compression/fig1-hick-fitts.svg" alt="Two schematic line charts. Reaction time rises linearly with bits of choice, and movement time rises linearly with index of difficulty in bits." />
<figcaption><strong>Figure 1.</strong> Schematic of Eq. 2 and Eq. 3. In both laws the time cost is a straight line once the x-axis is in bits. Slopes and intercepts are made up for illustration.</figcaption>
</figure>

When you think about hitting that way it gets pretty interesting. A 95 mph fastball gets to the plate in about 400 milliseconds, and the swing itself takes up something like 150 of those. That leaves a hitter very little time to see the pitch, decide whether to go, and get started. If time is linear in bits, there's no way a hitter is building a swing from scratch in that window, so whatever they're doing has to already be there in some really short form that they can pull up and adjust with very little information. My thought is that building that short form is a big part of what learning to hit actually is.

## 3. Compression is prediction

### 3.1 Cross-entropy as the cost of a wrong model

The second 3Blue1Brown video is about what happens when the thing you're compressing follows a distribution $p$ but your code was built for a different distribution $q$ [2]. The average number of bits you end up paying is the cross-entropy, and it splits into two pieces [6]:

$$
H(p, q) = -\sum_x p(x)\,\log_2 q(x) = H(p) + D_{KL}(p\,\|\,q) \tag{4}
$$

$H(p)$ is the floor, and you can't do better than that no matter how good your model is. The second term, the KL divergence, is the penalty for your model being wrong. This is also literally the loss function that language models are trained on, so "training" is the process of pushing $q$ toward $p$ until the penalty is gone.

I think this is a pretty good description of a hitter. The task has some amount of uncertainty in it that never goes away (you don't know what pitch is coming, and your own body is noisy). On top of that there's a penalty for how wrong your own internal model is, and practice is supposed to shrink that penalty.

<figure>
<img src="/images/blog/swing-as-compression/fig2-cross-entropy.svg" alt="Schematic curve of bits per swing falling with practice toward a dashed floor line. The gap between the curve and the floor is labeled KL divergence." />
<figcaption><strong>Figure 2.</strong> Learning drawn as Eq. 4. The dashed line is the entropy of the task, the curve is the cost under the hitter's current model, and the gap between them is what is left to learn. The curve is a power function chosen for illustration (see Eq. 5).</figcaption>
</figure>

### 3.2 Pretraining

The way language models get trained is in two steps. First they get pretrained on a giant pile of general text where the only job is predicting the next word, and then they get fine-tuned on whatever specific thing you want them to do. Most of what the model can do comes from the first step, and the second step goes fast because the general structure is already built.

I think there's a version of this in hitters. Braun and colleagues had people practice a bunch of related motor tasks and found they picked up a new task from that same family way faster than people starting cold, because they had already learned what all those tasks have in common [7]. They called it structural learning. That's pretty much what I see with the kids who played three sports growing up versus the kid who has taken a million swings off a tee. The multi-sport kid has been pretrained on a ton of different movement problems, and the tee kid has basically memorized one of them.

### 3.3 Blocked practice is overfitting

It also gives me a better way to explain blocked versus random practice, which is something we talk about a lot. In machine learning, if a model has a really low loss on the data it trained on and then falls apart on anything new, it's overfit. Shea and Morgan showed the motor version of that in 1979: blocked practice looked better during practice and worse on the retention and transfer tests [8]. Hall and colleagues then ran it with college baseball players and found the group that got extra batting practice in a random order did better on the transfer tests than the blocked group [9].

So a guy who is crushing the same 60 mph front toss in the same spot twenty times in a row is kind of overfitting. In terms of Eq. 4, he has driven the penalty to zero for a $p$ that isn't the one he'll see in a game. That's not me saying front toss is bad, because it's useful when someone is trying to feel a new move for the first time, but the round that looks the best is a lot of the time not the one that's doing the most for you. Guadagnoli and Lee's challenge point framework makes a similar argument, that learning depends on how much usable information the practice gives you, and that amount depends on the skill of the learner [10].

## 4. Chunking and why I think this is where automaticity comes from

This is the part I'm most interested in. Early on when you're learning a movement, you're running it one piece at a time and every piece takes attention. As you practice, those pieces get packed together into one thing, which is what Miller called chunking [11]. Newell and Rosenbloom argued that chunking is actually the reason practice curves follow a power law [12]:

$$
T_N = T_1\,N^{-\alpha} \tag{5}
$$

where $T_N$ is the time to do the task on trial $N$. Every time a pattern gets packed into a single unit you can pull it up in one step instead of several, and the common patterns get packed first, which gives you fast gains early and slow gains later.

Once the swing is one chunk instead of ten pieces, a few things get easier at the same time. You have fewer decisions to make, which by Eq. 2 means a faster reaction. The plan is also quicker to get going: Henry and Rogers found reaction time goes up when the movement you're about to make is more complicated, as if a longer program takes longer to load [13]. And your attention is freed up to actually compete against the pitcher instead of thinking about your hands.

I think that's what hitters mean when they say a swing feels automatic, and it's also why "just stop thinking" works okay for a pro and is terrible advice for a beginner, because the beginner doesn't have anything packed together yet.

The downside is that once something is packed together it's really hard to change. If I want to change one piece of a good hitter's swing, they pretty much have to unpack the whole thing, do it slowly and badly for a while, and then pack it back up, and anyone who has tried to make a swing change in the middle of a season knows exactly how bad that stretch feels. Masters described choking under pressure in a similar way, where a skilled person starts consciously controlling something that used to run by itself and it gets worse [14]. The way I picture it is a hitter unzipping the file in the middle of an at-bat.

## 5. Why lossless compression is the wrong model

### 5.1 The problem

If I stopped there, the takeaway would be that hitters should just be as repeatable as possible, and I don't think that's right. A guy who rolls over the same ground ball to shortstop every single swing is extremely repeatable. You could describe all of his swings with almost no information, so he's very compressible, and he's also not very good.

The other issue is that the best movers aren't actually as repeatable as you'd think. Bernstein filmed blacksmiths and found that the hammer hit the same spot every time but the arm took a slightly different path to get there on every strike [15]. So a zip file, where you have to get every single byte back perfectly, is the wrong comparison. The better one is a JPEG, where you throw out the detail nobody can see and keep the detail that matters.

### 5.2 Rate-distortion

The math for the JPEG version is Shannon's rate-distortion theory [16]. Instead of asking for a perfect copy, you pick a measure of error $d$ that you care about and ask what the fewest bits are that keep the average error under some tolerance $D$:

$$
R(D) = \min_{p(\hat{x}\,|\,x)\,:\;\mathbb{E}[d(x,\hat{x})]\,\le\,D} I(X;\hat{X}) \tag{6}
$$

For a single Gaussian variable with variance $\sigma^2$ and squared error, that works out to [6]:

$$
R(D) = \max\!\left(0,\ \tfrac{1}{2}\log_2\frac{\sigma^2}{D}\right) \tag{7}
$$

Two things fall out of Eq. 7 that I think matter for hitting. The first is that every time you cut the allowed error in half (in SD terms) it costs you one more bit, so precision gets expensive fast. The second is what happens when you have a lot of dimensions and the error measure only cares about some of them. If the error is weighted, $d = \sum_i w_i (x_i - \hat{x}_i)^2$, then any dimension with $w_i = 0$ gets exactly zero bits, because being wrong there costs nothing. All of the bits go to the dimensions the outcome actually depends on.

<figure>
<img src="/images/blog/swing-as-compression/fig5-rate-distortion.svg" alt="Left: the rate-distortion curve for a Gaussian, falling from several bits at tight tolerance to zero at loose tolerance. Right: a bar chart of bits spent per movement dimension, with bits on bat direction and contact depth and zero bits on elbow path, hand path and head sway." />
<figcaption><strong>Figure 3.</strong> (a) Eq. 7. (b) The same equation applied across five made-up movement dimensions with a task-weighted error. Dimensions the outcome doesn't depend on get zero bits and are free to vary. The dimension names and weights are illustrative, not measured.</figcaption>
</figure>

### 5.3 The overlap with the uncontrolled manifold

This is where I think there is a real mathematical overlap and not only an analogy. The uncontrolled manifold (UCM) method from Scholz and Schoner starts with a task variable $r$ (say, bat direction at contact) that depends on a bunch of joint angles $\theta$ through $r = f(\theta)$ [17]. The Jacobian $J = \partial f / \partial \theta$ tells you which combinations of joint changes move $r$. Combinations in the null space of $J$ don't move it at all, and that null space is the uncontrolled manifold. You then split each swing's deviation from the mean into the part that lies in the manifold and the part that's orthogonal to it, and compare the variance per degree of freedom in each [18]:

$$
V_{UCM} = \frac{\sum_k \lVert \theta_{\parallel,k} \rVert^2}{(n-d)\,N}, \qquad
V_{ORT} = \frac{\sum_k \lVert \theta_{\perp,k} \rVert^2}{d\,N} \tag{8}
$$

$$
\Delta V = \frac{V_{UCM} - V_{ORT}}{V_{TOT}} \tag{9}
$$

with $n$ joint degrees of freedom, a $d$-dimensional task variable and $N$ swings. A positive $\Delta V$ means the variability is being steered into the directions that don't hurt you.

The way I read it, Eq. 8 and Eq. 6 are describing the same thing from two sides. $V_{ORT}$ is the distortion, the error in the thing you care about. $V_{UCM}$ is variance sitting in the $w_i = 0$ dimensions, where rate-distortion says you shouldn't spend any bits. Todorov and Jordan got to the same place from optimal control with what they called the minimum intervention principle, where the controller only corrects deviations that interfere with the task [19]. I haven't seen someone write those down as the same statement, so that's my interpretation and not a theorem, but all three are saying a good controller is precise where it matters and loose where it doesn't.

<figure>
<img src="/images/blog/swing-as-compression/fig4-ucm.svg" alt="Two scatter plots of joint 1 deviation against joint 2 deviation. On the left the cloud is stretched along a dashed diagonal line labeled uncontrolled manifold. On the right the cloud is round with the same total variance." />
<figcaption><strong>Figure 4.</strong> Toy two-joint example of Eq. 8 and Eq. 9. Both clouds have the same total variance. In (a) almost all of it lies along the manifold where bat direction is unchanged. In (b) it is spread evenly, so the same amount of joint variability produces a lot more error at the bat. Simulated points, not athlete data.</figcaption>
</figure>

The pitching work from Bloebaum is what got me looking at this in the first place. One preprint found that elite pitchers aren't more or less complex in how they move on average, and what separates them is how reproducible that complexity is from throw to throw [20]. The other is a time-resolved UCM analysis of the delivery, and the title is the finding: skilled pitching is not less joint variability but better-structured joint variability [21]. Gray found something related in a virtual batting study, where training increased the kind of variability that keeps the bat on the ball [22].

<figure>
<img src="/images/blog/swing-as-compression/fig3-funnel.svg" alt="Three panels over normalized time from load to contact. Forty simulated joint angle traces that stay spread out, forty bat direction traces that converge toward contact, and the between-swing standard deviation of each, with the bat direction curve dropping while the joint curve stays high." />
<figcaption><strong>Figure 5.</strong> A toy two-joint swing, drawn the way time-resolved variability is usually shown [21]. (a) One joint across 40 simulated swings. (b) Bat direction, the sum of the two joints, for the same swings. (c) Between-swing SD of each over normalized time. The joints stay variable all the way to contact while the task variable funnels down. Simulated from a seeded toy model, not athlete data.</figcaption>
</figure>

### 5.4 What the public data looks like

I've seen some of this in the public Statcast bat tracking data. If you take out the part of a hitter's swing-to-swing variation that's explained by the pitch (how high it is, in or away, what type of pitch), the leftover scatter is related to xwOBA at about -0.37 from 2024 through 2026, meaning the tighter guys tend to produce more. That leftover scatter also holds up year to year at around 0.65, so it looks like a real trait. What I found interesting is that how much a hitter adjusts is a trait too. How much a guy changes his bat tilt based on pitch height is one of the most stable things I've looked at in public data, close to 0.9 year over year.

So my current way of thinking about it is that the swing isn't stored like a recording that gets played back. It's more like a short code with a few dials on it, where the sequence and the rhythm stay about the same and the dials move with the pitch. Schmidt's schema theory said something very close to this in 1975, with a generalized motor program that holds the invariant features and a small set of parameters that get set on each attempt [23].

## 6. Where the ecological people would disagree with me

I lean pretty heavily toward the ecological side in how I coach. I think the environment does most of the teaching, and that a big part of my job is setting up games and constraints where the movement I want is the best solution to the problem. People on that side really don't like the idea of a "motor program," which is the swing being saved in your head like a file, and I mostly agree with them on that. Araujo and Davids have a whole paper asking what exactly is "acquired" in skill acquisition, and their answer is a better fit between the athlete and the environment, not a stored thing [24].

I don't think the compression idea actually needs the file though. Compression is only about how short a description of something can be, and it doesn't say anything about where that description lives. When the dynamical systems people talk about an attractor, which is a stable pattern the body settles into [25], they're describing a movement that doesn't take much information to describe, and to me that's the same thing I've been calling a short code. The prediction part fits too. A hitter who is tuned in to the right information from the pitcher is going to get surprised less often, which in Eq. 4 is a smaller KL term.

## 7. What I'd want to measure

None of this is worth much unless it turns into something I can measure. The cleanest version comes from the minimum description length idea [26]: fit a model to a hitter's first $N-1$ swings and ask how many bits it takes to describe swing $N$.

$$
L_N = -\log_2 q\!\left(x_N \mid x_1, \dots, x_{N-1}\right) \tag{10}
$$

If the prediction errors are roughly Gaussian with SD $\sigma$, the entropy is $\tfrac{1}{2}\log_2(2\pi e\,\sigma^2)$ bits per dimension, so cutting the leftover SD in half saves exactly one bit. That gives the stuff I'd want to look at a common unit:

- $L_N$ over time for one hitter. If learning really is compression, it should fall as a skill settles in.
- The same thing split by Eq. 8 into the part of the movement that changes where the barrel ends up at contact and the part that doesn't. I'd expect the good hitters to only tighten up the first part.
- Whether the rhythm of the swing stays the same when the whole swing speeds up or slows down, which is what you'd expect if relative timing is the fixed part of the code [23].
- How far a hitter drops off after a mechanical change and how long it takes to get back, which would tell you how tightly packed the old swing was.
- How many reps it takes someone to figure out a brand new drill, and whether that depends on how much variety they've had in their training [7].

## 8. Limitations, or things I've already gotten wrong

I've been working on a few of these already, and mostly what I've learned is how easy it is to fool yourself.

The biggest one is that timing gets into everything. A lot of the fancier ways of measuring how "complex" a movement is will change just because a swing took a few milliseconds longer, even if the shape of the swing is exactly the same. So if you don't line the swings up in time first, you can think you're measuring how complex someone's swing is when really you're measuring how consistent their timing is. Timing consistency is still a real thing and worth knowing about, but it's a different claim, and it took me way too long to figure out I was mixing the two up.

Another one is that comparing hitters to each other doesn't tell you what happens inside one hitter. Even if better hitters are more repeatable, that doesn't mean making one guy more repeatable is going to make him better, and I've had those two questions give me different answers more than once.

One session also isn't a lot to go on. How spread out a guy's swings are bounces around a ton from one day to the next, way more than his average swing does.

The UCM result depends completely on what you pick for the task variable in Eq. 8, and hitting is harder than pitching here, because what you're trying to achieve changes with every pitch.

And the last one is that your tools can make things up. I built a small physics model of a swing to try to map out which combinations of timing lead to solid contact, and the first maps I got had these really intricate, cool looking edges that I got pretty excited about. It turned out all of it was coming from a bug in how the simulation was stepping through time. When I fixed that, the area of good solutions was just a plain smooth region a few tens of milliseconds wide, which is a lot less exciting but I trust it a lot more.

## 9. Where my head is at

I'm not saying the brain is running a zip program. What I like about this is that it gives me one way to talk about a bunch of things that we usually talk about separately, like how repeatable a swing is, how well it adjusts, how automatic it feels, how hard it is to change, and how well practice carries over to games. All of those are kind of the same question, which is how short of a description a hitter has found for a swing that still works.

I don't know yet if the stuff I want to measure is going to hold up, and some of it probably won't. I'd still rather have something I can test and be wrong about than keep going back and forth on feel versus mechanics.

## References

1. Sanderson G. Reinventing Entropy. 3Blue1Brown; 2026. https://www.3blue1brown.com/lessons/entropy/
2. Sanderson G. But what is Cross-Entropy? 3Blue1Brown; 2026. https://www.3blue1brown.com/lessons/cross-entropy/
3. Shannon CE. A mathematical theory of communication. Bell System Technical Journal. 1948;27:379-423, 623-656.
4. Hick WE. On the rate of gain of information. Quarterly Journal of Experimental Psychology. 1952;4(1):11-26.
5. Fitts PM. The information capacity of the human motor system in controlling the amplitude of movement. Journal of Experimental Psychology. 1954;47(6):381-391.
6. Cover TM, Thomas JA. Elements of Information Theory. 2nd ed. Wiley; 2006.
7. Braun DA, Aertsen A, Wolpert DM, Mehring C. Motor task variation induces structural learning. Current Biology. 2009;19(4):352-357.
8. Shea JB, Morgan RL. Contextual interference effects on the acquisition, retention, and transfer of a motor skill. Journal of Experimental Psychology: Human Learning and Memory. 1979;5(2):179-187.
9. Hall KG, Domingues DA, Cavazos R. Contextual interference effects with skilled baseball players. Perceptual and Motor Skills. 1994;78(3):835-841.
10. Guadagnoli MA, Lee TD. Challenge point: a framework for conceptualizing the effects of various practice conditions in motor learning. Journal of Motor Behavior. 2004;36(2):212-224.
11. Miller GA. The magical number seven, plus or minus two: some limits on our capacity for processing information. Psychological Review. 1956;63(2):81-97.
12. Newell A, Rosenbloom PS. Mechanisms of skill acquisition and the law of practice. In: Anderson JR, ed. Cognitive Skills and Their Acquisition. Erlbaum; 1981:1-55.
13. Henry FM, Rogers DE. Increased response latency for complicated movements and a "memory drum" theory of neuromotor reaction. Research Quarterly. 1960;31(3):448-458.
14. Masters RSW. Knowledge, knerves and know-how: the role of explicit versus implicit knowledge in the breakdown of a complex motor skill under pressure. British Journal of Psychology. 1992;83(3):343-358.
15. Bernstein NA. The Co-ordination and Regulation of Movements. Pergamon Press; 1967.
16. Shannon CE. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record. 1959;7(4):142-163.
17. Scholz JP, Schoner G. The uncontrolled manifold concept: identifying control variables for a functional task. Experimental Brain Research. 1999;126(3):289-306.
18. Latash ML, Scholz JP, Schoner G. Motor control strategies revealed in the structure of motor variability. Exercise and Sport Sciences Reviews. 2002;30(1):26-31.
19. Todorov E, Jordan MI. Optimal feedback control as a theory of motor coordination. Nature Neuroscience. 2002;5(11):1226-1235.
20. Bloebaum A. Reproducibility of nonlinear movement complexity, not complexity itself, distinguishes elite throwing. SportRxiv preprint. doi:10.51224/SportRxiv.919
21. Bloebaum A. Skilled pitching is not less joint variability but better-structured joint variability: a time-resolved uncontrolled-manifold analysis of the baseball pitching delivery. SportRxiv preprint. doi:10.51224/SportRxiv.1010
22. Gray R. Changes in movement coordination associated with skill acquisition in baseball batting: freezing/freeing degrees of freedom and functional variability. Frontiers in Psychology. 2020;11:1295.
23. Schmidt RA. A schema theory of discrete motor skill learning. Psychological Review. 1975;82(4):225-260.
24. Araujo D, Davids K. What exactly is acquired during skill acquisition? Journal of Consciousness Studies. 2011;18(3-4):7-23.
25. Haken H, Kelso JAS, Bunz H. A theoretical model of phase transitions in human hand movements. Biological Cybernetics. 1985;51(5):347-356.
26. Rissanen J. Modeling by shortest data description. Automatica. 1978;14(5):465-471.
