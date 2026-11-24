---
title: 'Thinking About the Swing as a Compression Problem'
summary: 'A working paper arguing that data compression describes both the information processing and ecological views of how a hitter learns, and that the two make the same prediction about swing variability.'
date: 2026-11-23
tags: ['hitting', 'motor learning', 'information theory']
image: '/images/blog/swing-as-compression/header.jpg'
ogImage: '/images/blog/swing-as-compression/header-og.jpg'
draft: false
---

<figure>
<img src="/images/blog/swing-as-compression/header.jpg" alt="A man in a baseball cap, shirt and tie gesturing in front of a wall covered in papers connected by red string." />
</figure>

## 1. Introduction

Figure 1 shows 14 swings from one hitter in one session, following how far his shoulders have turned over the last 300 ms before contact. Panel (a) lines the swings up at contact, which is the usual way to compare swings, and the lines spread apart as contact gets closer. Panel (b) lines the same swings up by where the bat is, and most of that spread goes away. So a large part of the variation in his shoulder turn is in when he turns and not in how he turns. Panel (c) shows the same result for every hitter in the lab, and it shows that the lead arm is different. The spread in the arm is larger, it grows into contact, and lining the swings up by the bat does not remove it.

<figure>
<img src="/images/blog/swing-as-compression/fig3-funnel.svg?v=2" alt="Three panels over the last 300 milliseconds before contact. First, shoulder rotation for 14 swings from one hitter, each lined up at its own contact. The lines start together, turn about 100 degrees, and spread to a band about 16 degrees wide at contact. Second, the same swings lined up by bat position, where the band is clearly narrower. Third, swing-to-swing standard deviation for all hitters. Shoulder turn starts at 3.2 degrees and rises to 5.5 when lined up at contact, and to 4.3 when lined up by bat position. The lead arm joints rise from about 7 degrees to about 8.7 under both alignments, and to 9.9 at contact." />
<figcaption><strong>Figure 1.</strong> Variability at each point in time, drawn the way it usually is [<a href="#ref-1">1</a>], in real time before contact. (a) How far the shoulders have turned, seen from above, for 14 swings from one de-identified hitter in one session, each lined up at its own contact. The session was picked because its spread is close to the median 14-swing session. (b) The same swings, each slid in time (not stretched) so the bat passes the same position at the same instant. This is the alignment of the blue line in Figure 5, and it stops 20 ms before contact. (c) Swing-to-swing SD within a session, pooled over 2,089 sessions from 1,138 hitters (35,135 swings). Solid lines are the shoulder turn, from 2,032 of those sessions. Dashed lines are the lead arm joints (shoulder, elbow and wrist, averaged). Pink is lined up at contact and blue is lined up by bat position.</figcaption>
</figure>

That picture is hard to explain if learning to hit means learning to repeat one movement. The timing changes from swing to swing and the arm takes a different path on each one, yet Section 5 shows that the joints of nearly every hitter in the lab vary together in a way that protects the direction of the bat. So the question for this post is what a hitter learns, given that it is not one movement that he repeats.

My answer started with [3Blue1Brown's series on compression](https://www.3blue1brown.com/lessons/entropy/) \[[2](#ref-2), [3](#ref-3)\]. The idea that stuck with me is that compression and prediction are intrinsically related. If you already know what is coming next, the information required to describe that event is lower. The argument of this post is that a hitter learns a compressed form of the mapping from the pitch he sees to the swing he makes. A good compressed form keeps what the outcome depends on and lets the rest vary.

There are two main views of how people learn movements. The information processing view treats the athlete like a computer that perceives, decides and then executes a stored plan. The ecological view says that movement comes from the interaction between the athlete and the environment, with no stored plan needed. I attempt to argue that compression describes both, and that the two make the same prediction about variability.

The information processing view starts from the fact that the nervous system is slow compared with a swing. A signal takes time to travel from the eye to the brain and from the brain to the muscles, so feedback about a movement arrives after much of the movement is over. The proposed solution is an internal model, a learned prediction of what a motor command will do. It lets the brain act on the predicted result of a command without waiting for the real one. The cerebellum is the structure most associated with internal models \[[4](#ref-4)\]. A second set of structures, the basal ganglia, is associated with packing sequences of actions that are practiced together into single units \[[5](#ref-5)\]. That is the chunking covered in Section 4.

The ecological view starts from the fact that the brain does not control each muscle separately. Muscles are activated in groups called synergies. A small number of synergies, combined in different amounts, can produce a wide range of movements, which was first shown in recordings from frogs \[[6](#ref-6)\]. The body therefore has far fewer things to control than it has muscles and joints. The stable patterns it settles into are the attractors covered in Section 6.

Both sets of mechanisms reduce the amount of information the brain has to handle. Prediction removes the wait for feedback, chunking turns a sequence into one unit, and synergies turn many muscles into a few groups. Neuroscience has described the nervous system this way for a long time. Barlow proposed in 1961 that the job of sensory neurons is to remove redundancy from their inputs, which amounts to saying that the nervous system compresses \[[7](#ref-7)\].

## 2. Movement was being measured in bits a long time ago

A bit is the amount of information in one choice between two equally likely options. Shannon generalized that. An event with probability $p$ carries $-\log_2 p$ bits, so a rare event carries more information than a common one. Entropy is the average information over all the events that can happen \[[8](#ref-8)\]:

$$
H(X) = -\sum_x p(x)\,\log_2 p(x) \tag{1}
$$

Two of the oldest results in motor control are written in these units. Hick showed that the time it takes to react rises linearly with the information in the choice being made \[[9](#ref-9)\]. Fitts showed that the time it takes to move to a target rises linearly with an index of difficulty, which is also measured in bits \[[10](#ref-10)\]:

$$
RT = a + b\,\log_2(n + 1) \tag{2}
$$

$$
MT = a + b\,\log_2\!\left(\frac{2D}{W}\right) \tag{3}
$$

Here $RT$ is reaction time, $MT$ is movement time, $n$ is the number of equally likely options, $D$ is the distance to the target, $W$ is the width of the target, and $a$ and $b$ are constants fit to the person. Both laws are straight lines once the x-axis is in bits (Figure 2). In both, more information takes more time.

<figure>
<img src="/images/blog/swing-as-compression/fig1-hick-fitts.svg" alt="Two schematic line charts. Reaction time rises linearly with bits of choice, and movement time rises linearly with index of difficulty in bits." />
<figcaption><strong>Figure 2.</strong> Schematic of Eq. 2 and Eq. 3. The slopes and intercepts are made up for illustration.</figcaption>
</figure>

This matters for hitting because the hitter has almost no time. He has to read the pitch while the pitcher is trying to keep him from figuring out what is coming.

Practice changes the numbers. Mowbray and Rhoades found that with enough practice, reaction time stopped rising between two and four choices \[[11](#ref-11)\]. The slope $b$ in Eq. 2 is therefore not a fixed property of the person.

That leaves two questions. How much of the movement can practice organize in advance, and what still has to change as the hitter reads the pitch? I start with what practice teaches the hitter to expect.

## 3. Compression is prediction

### 3.1 Cross-entropy as the cost of a wrong model

A compression code gives short codewords to things that it expects and long codewords to things that it does not expect. That only works if the expectations are right. Suppose the thing being compressed actually follows a distribution $p$, but the code was built expecting a different distribution $q$ \[[3](#ref-3)\]. The average number of bits paid is the cross-entropy \[[12](#ref-12)\]:

$$
H(p, q) = -\sum_x p(x)\,\log_2 q(x) = H(p) + D_{KL}(p\,\|\,q) \tag{4}
$$

The right side has two parts. $H(p)$ is the entropy of the real distribution, from Eq. 1. It is the floor, the cost that even a perfect code pays. $D_{KL}(p\,\|\,q)$ is the Kullback-Leibler divergence. It measures how far $q$ is from $p$, and it is zero only when the two match. It describes the extra cost of having the wrong expectations.

Language models are trained on this quantity. A language model reads text and assigns a probability to each possible next word. Its training score is the average of $-\log_2$ of the probability it gave to the word that actually came next, which is the cross-entropy in Eq. 4, with $p$ as real text and $q$ as the model's predictions. Training cannot change $H(p)$, so lowering the score means lowering $D_{KL}$, which means predicting better.

For a hitter, take the event to predict as how the pitch will actually move: where the ball will be when it reaches the plate, given what he sees at release and early in its flight. The release point, arm slot and spin set up an expectation of how much the ball will rise or sink and run or cut. A pitch that moves the way he expected is cheap. A pitch that moves differently, such as a sinker out of a slot that usually produces ride, or seam-shifted wake movement that the spin alone would not predict, is the surprise, and it shows up as a swing in the wrong place. Practice against a pitch shape can improve how well his expectations match how that pitch really moves (Figure 3).

<figure>
<img src="/images/blog/swing-as-compression/fig2-cross-entropy.svg" alt="Schematic curve of bits per swing falling with practice toward a dashed floor line. The gap between the curve and the floor is labeled KL divergence." />
<figcaption><strong>Figure 3.</strong> Learning drawn as Eq. 4. The dashed line is the entropy of the task, the curve is the cost under the hitter's current model, and the gap is what is left to learn. The curve is a power function chosen for illustration (see Eq. 5).</figcaption>
</figure>

### 3.2 Blocked practice as overfitting

In blocked practice, the learner repeats one task many times before moving to the next. In random practice, the tasks are mixed. Learning is then measured in two ways: a retention test, which repeats the practiced tasks after a delay, and a transfer test, which uses a new version of the task. Shea and Morgan found that the blocked group performed better during practice and worse on both tests \[[13](#ref-13)\]. Hall and colleagues ran the same comparison with college hitters and found that random-order batting practice beat blocked practice on the transfer tests \[[14](#ref-14)\].

Machine learning has a name for that gap between practice and transfer. A model is overfit when it has a low cost on the data it trained on and a high cost on new data, because it learned the training data and not the real distribution. Performance during practice is the cost on the training data, and retention and transfer are the cost on new data, so blocked practice looks like overfitting. The challenge point framework makes the related argument that learning depends on how much usable information a task offers a particular learner \[[15](#ref-15)\]. In practice, once a hitter can make a new move in a blocked round like front toss, I change what he has to read and what earns him a point.

### 3.3 Bad data and a bad value function

There are two ways to end up with a bad model.

The first is the mix of pitches. A hitter can learn the rhythm of a drill so well that he starts on time and does not read the ball, so for that round to carry over to a game it has to include some of the cues and uncertainty he will face there.

The second is a bad value function, meaning the thing the learner is rewarded for. A model can train on good data and still be wrong if the reward points at the wrong target. A hitter who is told that backside ground balls are good will get efficient at producing them. Section 5 will show why this matters so much: the measure of error decides where the precision goes, so a wrong measure protects the wrong outcome.

Practice gives the hitter chances to repeat whatever solves the game I built. When those pieces start to run together, it becomes expensive to change only one of them, and Section 4 explains why.

## 4. Chunking and automaticity

Section 2 left open how much of a swing practice can organize in advance. Chunking is one possible answer.

Early in learning, a movement runs one piece at a time and every piece takes attention. With practice, pieces that always occur together get packed into one unit. Miller called this chunking \[[16](#ref-16)\]. Newell and Rosenbloom argued that chunking is why practice curves follow a power law \[[17](#ref-17)\]:

$$
T_N = T_1\,N^{-\alpha} \tag{5}
$$

where $T_N$ is the time to do the task on trial $N$, $T_1$ is the time on the first trial, and $\alpha$ sets how fast the time falls. The most common patterns get packed first because they come up most often, so the gains are fast early and slow later.

Chunking is compression. A chunk replaces a long description (every piece, in order) with a short one (the name of the unit). If a hitter can start a familiar sequence as one unit, it takes less attention, which leaves more for the pitcher. Henry and Rogers found that reaction time rises with the complexity of the movement about to be made \[[18](#ref-18)\], so my inference is that a practiced chunk is also faster to start, although their experiment did not test that.

The cost appears when a hitter is asked to change one piece of a familiar swing. For a while he has to slow down and attend to a movement that used to run by itself, and output sometimes drops before it comes back. I think part of that drop is the cost of packing the sequence back together.

Masters described choking in a similar way. A skilled performer under pressure starts consciously controlling something that used to run by itself, which amounts to unpacking the chunk, and performance gets worse \[[19](#ref-19)\].

## 5. Why lossless compression is the wrong model

### 5.1 The problem

Chunking can explain how a hitter repeats a sequence, but it does not say which part is worth repeating. A hitter who rolls over the same ground ball to shortstop every swing is extremely repeatable, and he is also not very good.

The best movers are not that repeatable either. Bernstein filmed blacksmiths whose hammer hit the same spot every time while the arm took a different path on every strike \[[20](#ref-20)\]. The outcome repeated and the movement did not.

Compression has two kinds, and they separate these cases. Lossless compression, like a zip file, has to give back every byte. Lossy compression, like a JPEG, is allowed to throw away detail that does not matter to the viewer. The blacksmith is the JPEG.

### 5.2 Rate-distortion

The theory of lossy compression is rate-distortion theory \[[21](#ref-21)\]. It asks one question. If the reproduction $\hat{x}$ is allowed to differ from the original $x$ by some amount, what is the smallest number of bits needed? You choose a measure of error $d(x, \hat{x})$ and a tolerance $D$ for the average error, and the answer is the rate $R(D)$:

$$
R(D) = \min_{p(\hat{x}\,|\,x)\,:\;\mathbb{E}[d(x,\hat{x})]\,\le\,D} I(X;\hat{X}) \tag{6}
$$

$I(X;\hat{X})$ is the mutual information, the number of bits the reproduction carries about the original. Eq. 6 says to find the reproduction that carries the fewest bits while keeping the average error at or below $D$.

For the simplest case, one Gaussian variable with variance $\sigma^2$ and squared error, Eq. 6 has a closed form \[[12](#ref-12)\]:

$$
R(D) = \max\!\left(0,\ \tfrac{1}{2}\log_2\frac{\sigma^2}{D}\right) \tag{7}
$$

Two consequences matter for hitting.

The first is that precision is expensive. $D$ is an average squared error, so its square root is the typical size of the error, the standard deviation (SD). Cutting that typical error in half divides $D$ by four, and Eq. 7 then goes up by exactly one bit. Every halving of the error costs another bit.

The second is that bits only go where the error measure looks. Suppose there are several movement dimensions and the error is weighted, $d = \sum_i w_i (x_i - \hat{x}_i)^2$, where $w_i$ is how much the outcome depends on dimension $i$. A dimension with $w_i = 0$ can be reproduced with any error at no cost, so it gets zero bits. All of the bits go to the dimensions the outcome depends on. This is the formal version of the point in Section 3.3. The weights are the value function, and they decide where the precision goes.

Bat speed is an example of the tolerance $D$. A fast swing gives a hitter room for error, since a mishit ball can still leave the park. A slow swing needs a more efficient collision to get the same result. More bat speed loosens $D$, and by Eq. 7 a looser $D$ costs fewer bits.

Figure 4(b) uses the form of Eq. 7 on lab motion capture. It measures how repeatable each part of the swing is, in bits. For each part of the swing, $\sigma^2$ is the spread across all swings from all hitters, and $D$ is the spread of one hitter's swings within a session. The result is the number of bits that a hitter's own swing pins down, out of everything hitters do. Another way to read it is how well one swing identifies the hitter. At the start of the load, a hitter holds every part to between 1.6 and 1.9 bits. By contact that is down to about 1 bit for the body and 0.5 for the direction of the bat. So the load is the part of the swing that repeats, and contact is the part that varies.

Where the bat points at contact depends on where the pitch is, so part of the variation at contact is the hitter adjusting to the pitch. Section 5.3 uses a method that can say whether that variation is organized.

<figure>
<img src="/images/blog/swing-as-compression/fig5-rate-distortion.svg?v=2" alt="Left: the rate-distortion curve for a Gaussian, falling from several bits at tight tolerance to zero at loose tolerance. Right: bits held at load and at contact for legs, trunk and pelvis, arms and bat direction. Every group is between 1.6 and 1.9 bits at load and lower at contact, with bat direction lowest at 0.5 bits." />
<figcaption><strong>Figure 4.</strong> (a) Eq. 7. (b) How repeatable each part of the swing is, in bits, using the form of Eq. 7 on lab motion capture. The allowed error is one hitter's swing-to-swing variance within a session, and the total is that plus the variance between hitters. 1,321 hitters, one session each, 16,192 swings off straight machine pitches. Each value is an average over the joint angles in the group. Pitch location is not measured, so the allowed error includes adjustment to the pitch. These are cohort averages, and no individual hitter is shown.</figcaption>
</figure>

### 5.3 The overlap with the uncontrolled manifold

The spread in Figure 1 shows how much the shoulders and the lead arm vary at each instant, but it does not show what the other joints do on the same swing when one of them changes. The uncontrolled manifold analysis answers that for the direction of the bat.

The uncontrolled manifold (UCM) method starts with a task variable $r$, the thing the movement has to get right. Here it is the direction of the bat. The task variable depends on the joint angles $\theta$ through some function $r = f(\theta)$ \[[22](#ref-22)\]. There are more joints than the task needs, so many different joint combinations produce the same bat direction. The Jacobian $J = \partial f / \partial \theta$ describes how a small change in each joint moves $r$. Some combinations of joint changes cancel out and do not move $r$ at all. Those combinations are the null space of $J$, which gives a local approximation to the uncontrolled manifold.

For each swing, take its difference from the hitter's average swing and split it into two parts: the part along the manifold, which leaves the bat alone, and the part orthogonal to it, which moves the bat. Then compare the variance of each part, per degree of freedom \[[23](#ref-23)\]:

$$
V_{UCM} = \frac{\sum_k \lVert \theta_{\parallel,k} \rVert^2}{(n-d)\,N}, \qquad
V_{ORT} = \frac{\sum_k \lVert \theta_{\perp,k} \rVert^2}{d\,N} \tag{8}
$$

$$
\Delta V = \frac{V_{UCM} - V_{ORT}}{V_{TOT}} \tag{9}
$$

Here $n$ is the number of joint degrees of freedom, $d$ is the number of dimensions of the task variable, $N$ is the number of swings, $\theta_{\parallel,k}$ and $\theta_{\perp,k}$ are the two parts of swing $k$, and $V_{TOT}$ is the total variance per degree of freedom. If variability were spread evenly, $V_{UCM}$ and $V_{ORT}$ would be equal and $\Delta V$ would be zero. A positive $\Delta V$ means more of the variability sits in the directions that do not move the bat.

Figure 5 shows the result from 2,096 lab sessions. At contact, the joints vary about 9.2 degrees per degree of freedom along the manifold and 6.4 across it, and the index is positive in 99 percent of sessions. The average index is also positive at every point in the last 300 ms before contact.

I then shuffled each joint's values across swings within a session, so that every joint kept its own spread but an elbow angle from one swing was now paired with a trunk angle from another. The index dropped to about zero. The structure therefore comes from how the joints vary together, and that explains Figure 1: the arm joints can spread apart while the joints still move in combinations that partly cancel at the bat. Shuffling breaks those combinations.

<figure>
<img src="/images/blog/swing-as-compression/fig4-ucm.svg?v=2" alt="The synergy index over the last 300 milliseconds before contact. With swings lined up at contact it is near 0.7 until about 120 ms before contact, dips to 0.40 at 50 ms and recovers to 0.56 at contact. With the same swings lined up by bat position it stays between 0.64 and 0.79. With joints shuffled across swings it stays near zero." />
<figcaption><strong>Figure 5.</strong> Eq. 8 for bat direction, using forward kinematics on 12 trunk, lead arm and grip degrees of freedom. 2,096 sessions from 1,140 hitters, 35,227 swings, with each hitter only compared with his own swings within a session. Each line is the average synergy index with its 95% interval. The index is Eq. 9 with the sum of the two variances in the denominator, which keeps it between -1 and 1. Pink has every swing lined up at its own contact. Blue has the same swings slid in time so the bat passes the same position at the same instant, and it stops 20 ms before contact because a slid swing runs out of data there. Swings that needed a slide of more than 20 ms were left out of both (563 swings). The dashed line is the index after shuffling each joint across swings. These are averages, and no individual hitter or session is shown.</figcaption>
</figure>

The pink line in Figure 5 dips about 50 ms before contact, and the dip comes from how the swings are lined up. The pink line lines every swing up at contact. Just before contact the bat is turning at its fastest, so a swing that is a few milliseconds ahead of or behind the others has its bat in a different place at the same instant. That difference lies along the swing's own path, which is the direction that moves the bat, so it gets counted as variance across the manifold. The blue line uses the same swings, with each one slid in time (not stretched) so that the bat passes the same position at the same instant. The typical slide is about 5 ms. Lining the swings up this way removes about 80 percent of the dip. As a check, giving each swing the slide that belongs to a different swing makes the dip deeper. So most of the dip is variation in when the bat arrives. At a given bat position, the joints are as organized late in the swing as they are early.

I also tested whether the index goes up with exit velocity from one hitter to the next. With swings lined up at contact it does not (rank correlation of about 0). With swings lined up by bat position there is a small positive relationship (rank correlation of about 0.07), and it holds when I control for the number of swings in the session and for the lab. It is small. Nearly every hitter shows the structure, so the data does not support calling it a marker of skill.

Two things can widen the bundle of swings in Figure 1. Different pitch locations call for different bat paths, and near contact a few milliseconds of timing difference can put the bat several degrees farther around its arc. Figure 1(c) tests the second one. For the shoulder turn, lining the swings up by bat position removes about half of the growth (the SD is 3.2 degrees at the start, and at 20 ms before contact it is 5.5 lined up at contact and 4.3 lined up by bat position). For the lead arm joints it removes almost none (8.6 degrees against 8.7). So timing widens the trunk and does not widen the arm, which agrees with Figure 6, where the trunk re-times about three times as much as the lead arm.

This is the connection I see to rate-distortion. If the error I care about is a change in bat direction, small joint changes along the manifold have no penalty, to first order, while across the manifold two deviations of the same size can turn the bat by different amounts. Eq. 8 measures joint variance in those directions, so to get the squared error in bat direction I would also have to account for how strongly each deviation turns the bat. So Figure 5 shows how the joints share variation.

Todorov and Jordan reached a related idea from optimal control. Their minimum intervention principle says the best controller only corrects deviations that interfere with the task and leaves the rest alone \[[24](#ref-24)\]. Rate-distortion theory has been used on human behavior before. Sims applied it to perception \[[25](#ref-25)\]. Lai and Gershman applied it to the choice of actions and called the result policy compression \[[26](#ref-26)\]. Tishby and Polani \[[27](#ref-27)\] and Todorov \[[28](#ref-28)\] wrote the cost of control in units of information.

Bloebaum's pitching research is what got me looking at this. One preprint found that elite pitchers are not more or less complex in how they move on average, and that what separates them is how reproducible that complexity is from throw to throw \[[29](#ref-29)\]. The other is a UCM analysis done at each point in time through the delivery. Its title is the finding, that skilled pitching is not less joint variability but better-structured joint variability \[[1](#ref-1)\]. Gray found in a virtual batting study that training increased the kind of variability that keeps the bat on the ball \[[30](#ref-30)\].

### 5.4 What the public data looks like

Public [Statcast bat tracking](https://baseballsavant.mlb.com/leaderboard/bat-tracking) records the location and type of the pitch with each swing, so it can separate a hitter's adjustment to the pitch from the scatter around it.

Start with a hitter's swing-to-swing variation and remove the part that is explained by the pitch (its height, whether it is in or away, and the pitch type). What is left is scatter that these pitch terms do not account for, so it is an upper limit on the noise. I did this for hitter-seasons from 2024 through 2026 with at least 150 full contact swings, meaning a bat speed of 60 mph or more, which leaves out bunts and check swings. I averaged the leftover scatter over four measurements (bat speed, attack angle, attack direction and swing path tilt). That leftover scatter is a stable trait of the hitter, correlating at about 0.7 from one year to the next. It is only weakly related to production. With bat speed held fixed, hitters with less leftover scatter hit the ball slightly harder (r about -0.15 with exit velocity) and their xwOBA on contact, a measure of expected production, is about the same (r about -0.06). This compares one hitter with another and a hitter can be in it up to three times. It does not show what happens when one hitter tightens his swing. An earlier version of this post gave a correlation of -0.37 between scatter and xwOBA. That number included bunts and check swings, which are scattered and unproductive at the same time, and it does not hold once they are removed.

The part that was removed, the adjustment, is a trait too. The amount a hitter changes his swing path tilt with pitch height correlates close to 0.9 year over year, which is one of the most stable things I have looked at in public data. The extreme cases show the same thing. On home runs hit well outside the zone, the hitter's posture changes by a large amount to get the bat path to the pitch.

I talk about a hitter having “a swing,” even though I can put 14 of his swings on a plot and see 14 different movements. When I say I know his swing, part of what I mean is that I have a pretty good idea what he’ll do with a pitch he hasn’t seen yet. That includes how I expect him to change when the pitch is down or away. If my description only fits the one he takes on a belt-high fastball, I probably know less about his swing than I think.

So the variation has two parts. The adjustment to the pitch is stable from season to season. The scatter around it is stable too, and it has little to do with how much a hitter produces. The adjustment is what goes with results. Hitters whose swings carry more of the pitch miss less often (r = -0.32 between hitters, and -0.20 for the same hitter from one season to another). That is why I do not think of the swing as a recording that gets played back. It is closer to a short code with a few dials on it. The sequence and rhythm stay about the same, and the dials move with the pitch. Schmidt's schema theory said nearly this in 1975. It proposed a generalized motor program that holds the features that do not change, with a few parameters set on each attempt \[[31](#ref-31)\].

The lab data supports the claim about rhythm (Figure 6). Each swing can be stretched in time to line up with the hitter's average swing. The variance that the stretching removes is timing, and what is left is shape. Within a round, timing is about 10 percent of the swing-to-swing variance in the joints and shape is the other 90 percent. It differs by segment. The trunk and the rear arm re-time about three times as much as the lead arm (14 percent against 5). Torso rotation re-times the most of any single joint angle at 27 percent, with pelvis rotation next at 17.

<figure>
<img src="/images/blog/swing-as-compression/fig7-timing.svg" alt="Three horizontal bars showing the share of swing-to-swing joint variance that is timing versus shape. Trunk and pelvis is 14 percent timing, rear arm is 14 percent timing, and lead arm is 5 percent timing." />
<figcaption><strong>Figure 6.</strong> The share of swing-to-swing joint variance that is timing, by body segment. Each swing is stretched in time to line up with the same hitter's average swing for that round. The variance that removes is timing, and what is left is shape. 19,141 swings from 878 hitters off straight machine pitches, in rounds of 8 or more swings, with each hitter only compared with his own swings.</figcaption>
</figure>

## 6. Conclusion: the two views predict the same thing

The two views from Section 1 are usually treated as a disagreement. I think they make the same prediction about variability, and the lab data matches it. A hitter holds the swing tighter in the directions that move the bat and lets it vary in the directions that do not. The information processing view calls that a lossy code. The ecological view calls it an attractor, and the rest of this section shows why those are two descriptions of one pattern.

I think the environment does most of the teaching, and a lot of my job is building games and constraints where the movement I want is the best solution to the problem. Araujo and Davids argue that what gets acquired in skill acquisition is a better fit between the athlete and the environment, and not a stored thing \[[32](#ref-32)\]. Compression fits with that, because it is a statement about how short a description of the swings can be, and it says nothing about where the description is kept.

In the ecological view, a skill is an attractor, a stable pattern that the body settles into and returns to when disturbed. The standard example is the Haken-Kelso-Bunz model of coordination between two limbs. It describes the state of the coordination $x$ as a ball on a landscape $V(x)$. The ball rolls downhill, and random disturbances knock it around \[[33](#ref-33)\]:

$$
\dot{x} = -\frac{dV}{dx} + \text{noise} \tag{10}
$$

$\dot{x}$ is how fast the state changes. The first term on the right pushes the state downhill, toward the bottom of a well. The bottoms of the wells are the attractors.

The link to bits comes from asking where the ball in Eq. 10 spends its time. The downhill term pulls it toward the bottom of the well, and the noise keeps knocking it away. Over a long time the two balance. If the noise has strength $T$, the fraction of time the ball spends at each state $x$ is

$$
p(x) \propto e^{-V(x)/T} \tag{11}
$$

Eq. 11 is the long-run result of Eq. 10. It says the state is most likely to be found where $V$ is lowest, and the likelihood falls off as the landscape rises. More noise (a larger $T$) spreads the state out, and a steeper landscape holds it in.

Near the bottom of a well the landscape is approximately a parabola, $V(x) \approx \tfrac{1}{2}kx^2$, where $k$ is the stiffness of the well. Putting that into Eq. 11 gives a Gaussian with variance $T/k$, and the differential entropy of a Gaussian with that variance is $\tfrac{1}{2}\log_2(2\pi e\,T/k)$ bits. With the same noise, a stiffer well concentrates the states in a narrower range (Figure 7).

<figure>
<img src="/images/blog/swing-as-compression/fig6-attractor.svg?v=2" alt="Left: two potential wells, one shallow and one deep. Right: the distribution of states each one produces, wide for the shallow well and narrow for the deep well, with the deep well labeled as 1.5 bits cheaper to describe." />
<figcaption><strong>Figure 7.</strong> Eq. 10 and Eq. 11 for a shallow well and one eight times stiffer, in one dimension. The stiffer well produces a narrower distribution, which takes 1.5 fewer bits to describe. Drawn from the equations, not athlete data.</figcaption>
</figure>

A swing has many directions to vary in, and the well does not have to be equally stiff in all of them. A well that is stiff across the manifold and shallow along it holds the state where the bat depends on it and leaves it free where the bat does not. That is the pattern in Figure 5. At contact the joints vary about 9.2 degrees along the manifold against 6.4 across it, the index is positive in 99 percent of sessions, and it goes to zero when the joints are shuffled. Section 5.2 reached the same pattern from the other side, where a code spends its bits only on the dimensions that the error measure looks at. So the two views arrive at one prediction, and it is the one the hitters show.

Neither field would be surprised by this. Haken showed that a system with a huge number of degrees of freedom ends up described by a few quantities, which he called order parameters \[[34](#ref-34)\]. Friston's free energy principle is the most formal attempt I know of to say that self-organizing systems settle into attractors by minimizing surprise \[[35](#ref-35)\], and surprise is his word for the same $-\log_2 p$ that Section 2 started with.

The ecological view uses the word information in Gibson's sense, which is structure in the light reaching the eye that specifies what the environment allows the animal to do \[[36](#ref-36)\]. Shannon's information is a count of bits and carries no meaning. One question I would like to test is whether the KL term in Eq. 4 gets smaller as a hitter learns to pick up the cues that tell him how a pitch will move.

So my answer to the question from Section 1 is that a hitter does not learn one movement. He learns a compressed form of the mapping from the pitch to the swing, which keeps what the bat depends on and lets the rest vary. So I do not think coaches have to pick a side. Both theories describe a hitter who has found a shorter description of a swing that still works, and the practice environment decides which description he ends up with.

## 7. What mixed-pitch lab data would add

Every lab figure in this post comes from swings off straight machine pitches, with no record of where each pitch was. That is enough to show that the variation in a swing is organized. It is not enough to show what the variation is for. Motion capture against a mix of pitch types and locations, with the pitch tracked on every swing, would allow three things.

The first is to separate adjustment from noise in the body. Section 5.4 does this for the bat with public data. With the pitch known, the same split can be made for every joint, and Figure 4(b) can be redone to show how many bits a hitter spends on the pitch and how many are left over. Until then, the variation at contact in the lab is adjustment and noise added together.

The second is to give the uncontrolled manifold analysis the right task. Here the task was the direction of the bat. With the pitch known, the task can be the distance from the barrel to the ball, which is the thing the swing has to get right. The same data would show how much of the variation in when the bat arrives, the dip in Figure 5, is the hitter adjusting to the pitch. It would also remove the need to line swings up by bat position, which takes out some variation in bat direction by construction.

The third is to test the well in Section 6. A pitch that moves differently from what the hitter expected is a disturbance. How the joints respond to it shows how stiff the coordination is in each direction, and whether an adjustment the hitter already makes with the pitch costs less than one he rarely uses.

One thing would still be missing, which is the rate in Eq. 6. Nothing here measures the bits that the hitter's control uses, and mixed-pitch data would not change that. It would show where the precision goes, and that is the part of the argument that most needs a direct test.

## References

<ol>
<li id="ref-1">Bloebaum A. <a href="https://sportrxiv.org/index.php/server/preprint/view/1010">Skilled pitching is not less joint variability but better-structured joint variability: a time-resolved uncontrolled-manifold analysis of the baseball pitching delivery.</a> SportRxiv preprint.</li>
<li id="ref-2">Sanderson G. <a href="https://www.3blue1brown.com/lessons/entropy/">Reinventing Entropy.</a> 3Blue1Brown; 2026.</li>
<li id="ref-3">Sanderson G. <a href="https://www.3blue1brown.com/lessons/cross-entropy/">But what is Cross-Entropy?</a> 3Blue1Brown; 2026.</li>
<li id="ref-4">Wolpert DM, Miall RC, Kawato M. <a href="https://doi.org/10.1016/S1364-6613(98)01221-2">Internal models in the cerebellum.</a> Trends in Cognitive Sciences. 1998;2(9):338-347.</li>
<li id="ref-5">Graybiel AM. <a href="https://doi.org/10.1006/nlme.1998.3843">The basal ganglia and chunking of action repertoires.</a> Neurobiology of Learning and Memory. 1998;70(1-2):119-136.</li>
<li id="ref-6">d'Avella A, Saltiel P, Bizzi E. <a href="https://doi.org/10.1038/nn1010">Combinations of muscle synergies in the construction of a natural motor behavior.</a> Nature Neuroscience. 2003;6(3):300-308.</li>
<li id="ref-7">Barlow HB. <a href="https://doi.org/10.7551/mitpress/9780262518420.003.0013">Possible principles underlying the transformations of sensory messages.</a> In: Rosenblith WA, ed. Sensory Communication. MIT Press; 1961:217-234.</li>
<li id="ref-8">Shannon CE. <a href="https://doi.org/10.1002/j.1538-7305.1948.tb01338.x">A mathematical theory of communication.</a> Bell System Technical Journal. 1948;27:379-423, 623-656.</li>
<li id="ref-9">Hick WE. <a href="https://doi.org/10.1080/17470215208416600">On the rate of gain of information.</a> Quarterly Journal of Experimental Psychology. 1952;4(1):11-26.</li>
<li id="ref-10">Fitts PM. <a href="https://doi.org/10.1037/h0055392">The information capacity of the human motor system in controlling the amplitude of movement.</a> Journal of Experimental Psychology. 1954;47(6):381-391.</li>
<li id="ref-11">Mowbray GH, Rhoades MV. <a href="https://doi.org/10.1080/17470215908416282">On the reduction of choice reaction times with practice.</a> Quarterly Journal of Experimental Psychology. 1959;11(1):16-23.</li>
<li id="ref-12">Cover TM, Thomas JA. <a href="https://doi.org/10.1002/047174882X">Elements of Information Theory.</a> 2nd ed. Wiley; 2006.</li>
<li id="ref-13">Shea JB, Morgan RL. <a href="https://doi.org/10.1037/0278-7393.5.2.179">Contextual interference effects on the acquisition, retention, and transfer of a motor skill.</a> Journal of Experimental Psychology: Human Learning and Memory. 1979;5(2):179-187.</li>
<li id="ref-14">Hall KG, Domingues DA, Cavazos R. <a href="https://pubmed.ncbi.nlm.nih.gov/8084699/">Contextual interference effects with skilled baseball players.</a> Perceptual and Motor Skills. 1994;78(3):835-841.</li>
<li id="ref-15">Guadagnoli MA, Lee TD. <a href="https://doi.org/10.3200/JMBR.36.2.212-224">Challenge point: a framework for conceptualizing the effects of various practice conditions in motor learning.</a> Journal of Motor Behavior. 2004;36(2):212-224.</li>
<li id="ref-16">Miller GA. <a href="https://doi.org/10.1037/h0043158">The magical number seven, plus or minus two: some limits on our capacity for processing information.</a> Psychological Review. 1956;63(2):81-97.</li>
<li id="ref-17">Newell A, Rosenbloom PS. <a href="https://kilthub.cmu.edu/articles/journal_contribution/Mechanisms_of_skill_acquisition_and_the_law_of_practice/6607196">Mechanisms of skill acquisition and the law of practice.</a> In: Anderson JR, ed. Cognitive Skills and Their Acquisition. Erlbaum; 1981:1-55.</li>
<li id="ref-18">Henry FM, Rogers DE. <a href="https://scilit.com/publications/6e8eb0ca5312186d5320f2d3bd7e9fca">Increased response latency for complicated movements and a "memory drum" theory of neuromotor reaction.</a> Research Quarterly. 1960;31(3):448-458.</li>
<li id="ref-19">Masters RSW. <a href="https://doi.org/10.1111/j.2044-8295.1992.tb02446.x">Knowledge, knerves and know-how: the role of explicit versus implicit knowledge in the breakdown of a complex motor skill under pressure.</a> British Journal of Psychology. 1992;83(3):343-358.</li>
<li id="ref-20">Bernstein NA. <a href="https://libcat.library.tamu.edu/Record/in00000267953">The Co-ordination and Regulation of Movements.</a> Pergamon Press; 1967.</li>
<li id="ref-21">Shannon CE. <a href="https://typeset.io/papers/coding-theorems-for-a-discrete-source-with-a-fidelity-1ztekkdwsr">Coding theorems for a discrete source with a fidelity criterion.</a> IRE National Convention Record. 1959;7(4):142-163.</li>
<li id="ref-22">Scholz JP, Schoner G. <a href="https://doi.org/10.1007/s002210050738">The uncontrolled manifold concept: identifying control variables for a functional task.</a> Experimental Brain Research. 1999;126(3):289-306.</li>
<li id="ref-23">Latash ML, Scholz JP, Schoner G. <a href="https://pure.psu.edu/en/publications/motor-control-strategies-revealed-in-the-structure-of-motor-varia/">Motor control strategies revealed in the structure of motor variability.</a> Exercise and Sport Sciences Reviews. 2002;30(1):26-31.</li>
<li id="ref-24">Todorov E, Jordan MI. <a href="https://doi.org/10.1038/nn963">Optimal feedback control as a theory of motor coordination.</a> Nature Neuroscience. 2002;5(11):1226-1235.</li>
<li id="ref-25">Sims CR. <a href="https://doi.org/10.1016/j.cognition.2016.03.020">Rate-distortion theory and human perception.</a> Cognition. 2016;152:181-198.</li>
<li id="ref-26">Lai L, Gershman SJ. <a href="https://doi.org/10.1016/bs.plm.2021.02.004">Policy compression: an information bottleneck in action selection.</a> Psychology of Learning and Motivation. 2021;74:195-232.</li>
<li id="ref-27">Tishby N, Polani D. <a href="https://doi.org/10.1007/978-1-4419-1452-1_19">Information theory of decisions and actions.</a> In: Cutsuridis V, Hussain A, Taylor JG, eds. Perception-Action Cycle. Springer; 2011:601-636.</li>
<li id="ref-28">Todorov E. <a href="https://doi.org/10.1073/pnas.0710743106">Efficient computation of optimal actions.</a> Proceedings of the National Academy of Sciences. 2009;106(28):11478-11483.</li>
<li id="ref-29">Bloebaum A. <a href="https://sportrxiv.org/index.php/server/preprint/view/919">Reproducibility of nonlinear movement complexity, not complexity itself, distinguishes elite throwing.</a> SportRxiv preprint.</li>
<li id="ref-30">Gray R. <a href="https://www.frontiersin.org/articles/10.3389/fpsyg.2020.01295/full">Changes in movement coordination associated with skill acquisition in baseball batting: freezing/freeing degrees of freedom and functional variability.</a> Frontiers in Psychology. 2020;11:1295.</li>
<li id="ref-31">Schmidt RA. <a href="https://doi.org/10.1037/h0076770">A schema theory of discrete motor skill learning.</a> Psychological Review. 1975;82(4):225-260.</li>
<li id="ref-32">Araujo D, Davids K. <a href="https://shura.shu.ac.uk/7300">What exactly is acquired during skill acquisition?</a> Journal of Consciousness Studies. 2011;18(3-4):7-23.</li>
<li id="ref-33">Haken H, Kelso JAS, Bunz H. <a href="https://doi.org/10.1007/BF00336922">A theoretical model of phase transitions in human hand movements.</a> Biological Cybernetics. 1985;51(5):347-356.</li>
<li id="ref-34">Haken H. <a href="https://doi.org/10.1007/978-3-662-07893-8">Information and Self-Organization: A Macroscopic Approach to Complex Systems.</a> Springer; 1988.</li>
<li id="ref-35">Friston K. <a href="https://doi.org/10.1038/nrn2787">The free-energy principle: a unified brain theory?</a> Nature Reviews Neuroscience. 2010;11(2):127-138.</li>
<li id="ref-36">Gibson JJ. <a href="https://doi.org/10.4324/9781315740218">The Ecological Approach to Visual Perception.</a> Houghton Mifflin; 1979.</li>
</ol>
