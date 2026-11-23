---
title: 'Thinking About the Swing as a Compression Problem'
summary: 'A working paper arguing that data compression is a way to reconcile the information processing and ecological views of how a hitter learns.'
date: 2026-11-23
tags: ['hitting', 'motor learning', 'information theory']
draft: true
---

<figure>
<img src="/images/blog/swing-as-compression/header.jpg" alt="A man in a baseball cap, shirt and tie gesturing in front of a wall covered in papers connected by red string." />
</figure>

## Abstract

[3Blue1Brown's series on compression](https://www.3blue1brown.com/lessons/entropy/) got me thinking about a lot of what I've been reading in motor learning and seeing in swing-to-swing variability. The argument of this post is that compression reconciles the information processing and ecological views of motor learning. To get there I cover where information theory already shows up in motor control, how cross-entropy maps onto practice design, why chunking explains automaticity, why a good swing is closer to lossy compression than lossless, and how that connects to the uncontrolled manifold. Every figure is a schematic drawn from the equations or a toy model, and none of them are athlete data.

## 1. Introduction

This started with 3Blue1Brown's mini-series on compression [1, 2]. The idea that stuck with me is that compressing something well requires predicting it well, because if you know what's coming next you barely have to write it down.

I've recently been exploring motor learning and ecological dynamics, along with how much hitters vary from swing to swing, and the series sounded like what I was already thinking about. This is me working through whether it's a useful way to describe how hitters learn.

Where I ended up is that it does more than describe learning. Sections 2 through 4 come from the information processing side of motor learning, Section 5 covers the variability work that the ecological side leans on, and Section 6 argues that compression makes them the same story.

## 2. Movement was being measured in bits a long time ago

This isn't a new idea. Shannon defined the information in an event with probability $p$ as $-\log_2 p$ bits, and entropy as the average of that [3]:

$$
H(X) = -\sum_x p(x)\,\log_2 p(x) \tag{1}
$$

Hick showed that reaction time rises linearly with the information in a choice [4], and Fitts showed that movement time rises linearly with an index of difficulty that is also in bits [5]:

$$
RT = a + b\,\log_2(n + 1) \tag{2}
$$

$$
MT = a + b\,\log_2\!\left(\frac{2D}{W}\right) \tag{3}
$$

where $n$ is the number of equally likely options, $D$ is the distance to the target and $W$ is its width. Notice in Figure 1 how both laws become straight lines once the x-axis is in bits.

<figure>
<img src="/images/blog/swing-as-compression/fig1-hick-fitts.svg" alt="Two schematic line charts. Reaction time rises linearly with bits of choice, and movement time rises linearly with index of difficulty in bits." />
<figcaption><strong>Figure 1.</strong> Schematic of Eq. 2 and Eq. 3. Slopes and intercepts are made up for illustration.</figcaption>
</figure>

A 95 mph fastball reaches the plate in about 400 ms, and the swing takes roughly 150 of them. That affords a hitter very little time to see the pitch, decide and start. If time is linear in bits, the swing can't be built from scratch in that window, so it has to already exist in a short form that can be adjusted with very little information. I think building that short form is a big part of learning to hit.

## 3. Compression is prediction

### 3.1 Cross-entropy as the cost of a wrong model

Suppose what you're compressing follows a distribution $p$ but your code was built for $q$ [2]. The bits you pay on average are the cross-entropy [6]:

$$
H(p, q) = -\sum_x p(x)\,\log_2 q(x) = H(p) + D_{KL}(p\,\|\,q) \tag{4}
$$

$H(p)$ is the floor. The KL term is the penalty for a wrong model, and it is the loss that language models are trained on.

A hitter looks the same to me. Some of the uncertainty never goes away (the pitch is unknown and the body is noisy), and practice shrinks the penalty that sits on top of it (Figure 2).

<figure>
<img src="/images/blog/swing-as-compression/fig2-cross-entropy.svg" alt="Schematic curve of bits per swing falling with practice toward a dashed floor line. The gap between the curve and the floor is labeled KL divergence." />
<figcaption><strong>Figure 2.</strong> Learning drawn as Eq. 4. The dashed line is the entropy of the task, the curve is the cost under the hitter's current model, and the gap is what is left to learn. The curve is a power function chosen for illustration (see Eq. 5).</figcaption>
</figure>

### 3.2 Blocked practice is overfitting

A model with a low loss on its training data that falls apart on new data is overfit. Shea and Morgan showed the motor version of that, where blocked practice looked better during practice and worse on retention and transfer [7]. Hall and colleagues found the same with college hitters, with random-order batting practice beating blocked on the transfer tests [8].

A hitter crushing the same 60 mph front toss twenty times in a row has driven the penalty in Eq. 4 to zero for a $p$ he won't see in a game. Front toss is still useful for feeling a new move, but the round that looks the best is often not the one doing the most for you. The challenge point framework makes a similar argument, that learning depends on how much usable information practice provides, which depends on the skill of the learner [9].

### 3.3 Bad data and a bad value function

There are two ways to end up with a bad model, and they map onto two coaching problems.

The first is bad data. A model trained only on easy examples gets good at easy examples, like a hitter who only trains in easy environments. He minimizes $D_{KL}(p_{practice}\,\|\,q)$ while the game charges him $D_{KL}(p_{game}\,\|\,q)$, and the further apart those distributions are, the less carries over.

The second is a bad value function. A model can train on great data and still come out wrong if the reward points at the wrong target. Tell a hitter that backside ground balls are good and he will get very efficient at producing them. As Section 5 shows, the error measure decides where the precision goes, so a wrong measure protects the wrong outcome.

Compression makes both of these matter more. Whatever was in the data and whatever was rewarded gets packed into the short form, which is the hard part to change later. That's why I care so much about how we design the games we play in training and what we reward in them.

## 4. Chunking and automaticity

Early in learning, a movement runs one piece at a time and every piece takes attention. With practice the pieces get packed into one unit, which Miller called chunking [10]. Newell and Rosenbloom argued that chunking is why practice curves follow a power law [11]:

$$
T_N = T_1\,N^{-\alpha} \tag{5}
$$

where $T_N$ is the time to do the task on trial $N$. The common patterns get packed first, so gains come fast early and slow later.

One chunk means fewer decisions, which by Eq. 2 means a faster reaction. It also gets going faster, since Henry and Rogers found reaction time rises with the complexity of the movement you're about to make [12]. And it frees up attention to compete against the pitcher.

The downside is that a packed movement is hard to change. To change one piece, a hitter has to unpack the swing, run it slowly and badly for a while, and pack it back up. In training this shows up as a recalibration period after an adjustment, where output drops before it comes back. I think that drop is the cost of re-compressing the movement, and it doesn't mean the adjustment was wrong. Masters described choking in a similar way, where a skilled performer starts consciously controlling something that used to run by itself and it gets worse [13].

## 5. Why lossless compression is the wrong model

### 5.1 The problem

If I stopped there, the takeaway would be to be as repeatable as possible, and I don't think that's right. A hitter who rolls over the same ground ball to shortstop every swing is extremely compressible, and he's also not very good.

The best movers aren't that repeatable either. Bernstein filmed blacksmiths whose hammer hit the same spot every time while the arm took a different path on every strike [14]. A zip file, where every byte has to come back, is the wrong comparison. A JPEG, which throws out the detail nobody can see, is the better one.

### 5.2 Rate-distortion

The math for the JPEG is rate-distortion theory [15]. You pick an error measure $d$ and ask for the fewest bits that keep the average error under a tolerance $D$:

$$
R(D) = \min_{p(\hat{x}\,|\,x)\,:\;\mathbb{E}[d(x,\hat{x})]\,\le\,D} I(X;\hat{X}) \tag{6}
$$

For one Gaussian variable with variance $\sigma^2$ and squared error, that works out to [6]:

$$
R(D) = \max\!\left(0,\ \tfrac{1}{2}\log_2\frac{\sigma^2}{D}\right) \tag{7}
$$

Two things here matter for hitting. Halving the allowed error (in SD terms) costs one more bit, so precision gets expensive fast. And with a weighted error, $d = \sum_i w_i (x_i - \hat{x}_i)^2$, any dimension with $w_i = 0$ gets zero bits, so all of the bits go to the dimensions the outcome depends on (Figure 3).

Bat speed is a good example. A fast swing affords a hitter room for error, since a mishit ball can still leave the park, while a slow swing requires a more efficient collision. More bat speed loosens $D$, and a looser $D$ is cheaper to hit.

<figure>
<img src="/images/blog/swing-as-compression/fig5-rate-distortion.svg" alt="Left: the rate-distortion curve for a Gaussian, falling from several bits at tight tolerance to zero at loose tolerance. Right: a bar chart of bits spent per movement dimension, with bits on bat direction and contact depth and zero bits on elbow path, hand path and head sway." />
<figcaption><strong>Figure 3.</strong> (a) Eq. 7. (b) The same equation across five made-up movement dimensions with a task-weighted error. Dimension names and weights are illustrative, not measured.</figcaption>
</figure>

### 5.3 The overlap with the uncontrolled manifold

This is where I think the overlap is mathematical and not only an analogy. The uncontrolled manifold (UCM) method starts with a task variable $r$, say bat direction at contact, that depends on the joint angles $\theta$ through $r = f(\theta)$ [16]. Joint combinations in the null space of the Jacobian $J = \partial f / \partial \theta$ don't move $r$, and that null space is the uncontrolled manifold. You split each swing's deviation from the mean into the part in the manifold and the part orthogonal to it, then compare the variance per degree of freedom [17]:

$$
V_{UCM} = \frac{\sum_k \lVert \theta_{\parallel,k} \rVert^2}{(n-d)\,N}, \qquad
V_{ORT} = \frac{\sum_k \lVert \theta_{\perp,k} \rVert^2}{d\,N} \tag{8}
$$

$$
\Delta V = \frac{V_{UCM} - V_{ORT}}{V_{TOT}} \tag{9}
$$

with $n$ joint degrees of freedom, a $d$-dimensional task variable and $N$ swings. A positive $\Delta V$ means the variability is being steered into directions that don't hurt you. Notice how both clouds in Figure 4 have the same total variance, and only the one on the left keeps the bat where it needs to be.

I read Eq. 8 and Eq. 6 as the same thing from two sides. $V_{ORT}$ is the distortion. $V_{UCM}$ is variance in the $w_i = 0$ dimensions, where rate-distortion says to spend no bits. Todorov and Jordan reached the same place from optimal control with the minimum intervention principle, where the controller only corrects deviations that interfere with the task [18]. I haven't seen these written down as one statement, so this is my interpretation and not a theorem.

<figure>
<img src="/images/blog/swing-as-compression/fig4-ucm.svg" alt="Two scatter plots of joint 1 deviation against joint 2 deviation. On the left the cloud is stretched along a dashed diagonal line labeled uncontrolled manifold. On the right the cloud is round with the same total variance." />
<figcaption><strong>Figure 4.</strong> Toy two-joint example of Eq. 8 and Eq. 9. In (a) almost all of the variance lies along the manifold where bat direction is unchanged. In (b) the same variance is spread evenly and produces far more error at the bat. Simulated points, not athlete data.</figcaption>
</figure>

Bloebaum's pitching work is what got me looking at this. One preprint found that elite pitchers aren't more or less complex in how they move on average, and that what separates them is how reproducible that complexity is from throw to throw [19]. The other is a time-resolved UCM analysis whose title is the finding, that skilled pitching is not less joint variability but better-structured joint variability [20]. Gray found in a virtual batting study that training increased the kind of variability that keeps the bat on the ball [21]. Figure 5 is a toy version. Notice how the joints stay variable all the way to contact while bat direction funnels down.

<figure>
<img src="/images/blog/swing-as-compression/fig3-funnel.svg" alt="Three panels over normalized time from load to contact. Forty simulated joint angle traces that stay spread out, forty bat direction traces that converge toward contact, and the between-swing standard deviation of each, with the bat direction curve dropping while the joint curve stays high." />
<figcaption><strong>Figure 5.</strong> A toy two-joint swing, drawn the way time-resolved variability is usually shown [20]. (a) One joint across 40 simulated swings. (b) Bat direction, the sum of the two joints, for the same swings. (c) Between-swing SD of each over normalized time. Simulated from a seeded toy model, not athlete data.</figcaption>
</figure>

### 5.4 What the public data looks like

Public Statcast bat tracking shows some of this. Take out the part of a hitter's swing-to-swing variation that's explained by the pitch (height, in or away, pitch type), and the leftover scatter correlates with xwOBA at about -0.37 from 2024 through 2026, so the tighter hitters tend to produce more. It also holds year to year at about 0.65. How much a hitter adjusts is a trait too. The change in swing path tilt with pitch height is one of the most stable things I've looked at in public data, close to 0.9 year over year. The extreme cases show it as well. On home runs hit well outside the zone, the postural adjustments get very large when the path isn't "optimal" for the pitch location.

So I don't think of the swing as a recording that gets played back. It's closer to a short code with a few dials on it, where the sequence and rhythm stay about the same and the dials move with the pitch. Schmidt's schema theory said nearly this in 1975, with a generalized motor program holding the invariant features and a few parameters set on each attempt [22].

This also accounts somewhat for the very talented hitters who are quick to make adjustments. If an adjustment is something their dials already cover, it only takes a few bits and there's almost no recalibration period. A hitter whose code doesn't have that dial has to unpack the swing and re-compress it, as in Section 4.

## 6. Conclusion: reconciling the two theories

I lean ecological in how I coach. The environment does most of the teaching, and a lot of my job is building games and constraints where the movement I want is the best solution to the problem. That side rejects the "motor program," the swing saved in your head like a file, and I mostly agree. Araujo and Davids argue that what gets "acquired" is a better fit between the athlete and the environment and not a stored thing [23].

The two views usually get treated as a disagreement, and I think compression reconciles them. It only concerns how short a description can be and says nothing about where the description lives, so it doesn't need a file in the head.

The dynamical systems version of a skill is an attractor, a stable pattern the body settles into. In the Haken-Kelso-Bunz model, the coordination between two limbs behaves like a ball rolling downhill on a landscape $V$, and the stable patterns are the bottoms of the wells [24]:

$$
\dot{x} = -\frac{dV}{dx} + \text{noise} \tag{10}
$$

Training a model works the same way, with the cross-entropy in Eq. 4 defining a landscape over the parameters and training stepping downhill on it. So the hill climbing idea holds for both theories. In one the body's coordination moves on the landscape and in the other the model does. In both, learning finds the low points and practice reshapes the landscape so they end up in better places.

An attractor also does something specific to information. For Eq. 10 with noise of strength $T$, the long-run distribution of states is

$$
p(x) \propto e^{-V(x)/T} \tag{11}
$$

Near the bottom of a well with stiffness $k$ this is a Gaussian with variance $T/k$, so its entropy is $\tfrac{1}{2}\log_2(2\pi e\,T/k)$ bits. A steeper well takes fewer bits to describe (Figure 6), which makes an attractor state a version of information minimization, i.e. compression. Haken made a version of this argument himself, that a system with a huge number of degrees of freedom ends up described by a few order parameters [25]. Friston's free energy principle is the most formal attempt I know of to say that self-organizing systems settle into attractors by minimizing surprise [26], and surprise is the same $-\log_2 p$ from Section 2.

<figure>
<img src="/images/blog/swing-as-compression/fig6-attractor.svg" alt="Left: two potential wells, one shallow and one deep. Right: the distribution of states each one produces, wide for the shallow well and narrow for the deep well, with the deep well labeled as 1.5 bits cheaper to describe." />
<figcaption><strong>Figure 6.</strong> Eq. 10 and Eq. 11 for a shallow well and one eight times stiffer. The stiffer well produces a narrower distribution, which takes 1.5 fewer bits to describe. Drawn from the equations, not athlete data.</figcaption>
</figure>

I haven't seen this worked out for hitting, and both sides would have issues with parts of it. But a hitter tuned in to the right information gets surprised less often, which is a smaller KL term in Eq. 4, and the ecological side calls that attunement.

So I don't think coaches have to pick a side. To me both theories describe a hitter finding a shorter description of a swing that still works, and the practice environment decides which description that ends up being.

## References

1. Sanderson G. Reinventing Entropy. 3Blue1Brown; 2026. https://www.3blue1brown.com/lessons/entropy/
2. Sanderson G. But what is Cross-Entropy? 3Blue1Brown; 2026. https://www.3blue1brown.com/lessons/cross-entropy/
3. Shannon CE. A mathematical theory of communication. Bell System Technical Journal. 1948;27:379-423, 623-656.
4. Hick WE. On the rate of gain of information. Quarterly Journal of Experimental Psychology. 1952;4(1):11-26.
5. Fitts PM. The information capacity of the human motor system in controlling the amplitude of movement. Journal of Experimental Psychology. 1954;47(6):381-391.
6. Cover TM, Thomas JA. Elements of Information Theory. 2nd ed. Wiley; 2006.
7. Shea JB, Morgan RL. Contextual interference effects on the acquisition, retention, and transfer of a motor skill. Journal of Experimental Psychology: Human Learning and Memory. 1979;5(2):179-187.
8. Hall KG, Domingues DA, Cavazos R. Contextual interference effects with skilled baseball players. Perceptual and Motor Skills. 1994;78(3):835-841.
9. Guadagnoli MA, Lee TD. Challenge point: a framework for conceptualizing the effects of various practice conditions in motor learning. Journal of Motor Behavior. 2004;36(2):212-224.
10. Miller GA. The magical number seven, plus or minus two: some limits on our capacity for processing information. Psychological Review. 1956;63(2):81-97.
11. Newell A, Rosenbloom PS. Mechanisms of skill acquisition and the law of practice. In: Anderson JR, ed. Cognitive Skills and Their Acquisition. Erlbaum; 1981:1-55.
12. Henry FM, Rogers DE. Increased response latency for complicated movements and a "memory drum" theory of neuromotor reaction. Research Quarterly. 1960;31(3):448-458.
13. Masters RSW. Knowledge, knerves and know-how: the role of explicit versus implicit knowledge in the breakdown of a complex motor skill under pressure. British Journal of Psychology. 1992;83(3):343-358.
14. Bernstein NA. The Co-ordination and Regulation of Movements. Pergamon Press; 1967.
15. Shannon CE. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record. 1959;7(4):142-163.
16. Scholz JP, Schoner G. The uncontrolled manifold concept: identifying control variables for a functional task. Experimental Brain Research. 1999;126(3):289-306.
17. Latash ML, Scholz JP, Schoner G. Motor control strategies revealed in the structure of motor variability. Exercise and Sport Sciences Reviews. 2002;30(1):26-31.
18. Todorov E, Jordan MI. Optimal feedback control as a theory of motor coordination. Nature Neuroscience. 2002;5(11):1226-1235.
19. Bloebaum A. Reproducibility of nonlinear movement complexity, not complexity itself, distinguishes elite throwing. SportRxiv preprint. doi:10.51224/SportRxiv.919
20. Bloebaum A. Skilled pitching is not less joint variability but better-structured joint variability: a time-resolved uncontrolled-manifold analysis of the baseball pitching delivery. SportRxiv preprint. doi:10.51224/SportRxiv.1010
21. Gray R. Changes in movement coordination associated with skill acquisition in baseball batting: freezing/freeing degrees of freedom and functional variability. Frontiers in Psychology. 2020;11:1295.
22. Schmidt RA. A schema theory of discrete motor skill learning. Psychological Review. 1975;82(4):225-260.
23. Araujo D, Davids K. What exactly is acquired during skill acquisition? Journal of Consciousness Studies. 2011;18(3-4):7-23.
24. Haken H, Kelso JAS, Bunz H. A theoretical model of phase transitions in human hand movements. Biological Cybernetics. 1985;51(5):347-356.
25. Haken H. Information and Self-Organization: A Macroscopic Approach to Complex Systems. Springer; 1988.
26. Friston K. The free-energy principle: a unified brain theory? Nature Reviews Neuroscience. 2010;11(2):127-138.
