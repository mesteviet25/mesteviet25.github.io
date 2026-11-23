"""Figures for the blog post src/content/blog/swing-as-compression.md.

Every figure is a schematic drawn from equations or a seeded toy model.
No athlete data and no measured data of any kind is read here.

    python scripts/blog_figures/swing_as_compression.py
"""
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

OUT = Path(__file__).resolve().parents[2] / "public" / "images" / "blog" / "swing-as-compression"
OUT.mkdir(parents=True, exist_ok=True)

SURFACE, INK, MUTED, RULE = "#171b2b", "#eaeefb", "#8d96ad", "#2f3650"
BLUE, PINK = "#6d8dff", "#ff5fa2"

plt.rcParams.update({
    "figure.facecolor": SURFACE, "axes.facecolor": SURFACE, "savefig.facecolor": SURFACE,
    "text.color": INK, "axes.labelcolor": MUTED, "axes.edgecolor": RULE,
    "xtick.color": MUTED, "ytick.color": MUTED, "axes.titlecolor": INK,
    "axes.spines.top": False, "axes.spines.right": False,
    "axes.grid": True, "axes.axisbelow": True, "grid.color": RULE, "grid.linewidth": 0.6,
    "font.size": 11.5, "axes.titlesize": 12, "axes.titleweight": "bold", "axes.titlelocation": "left",
    "lines.linewidth": 2, "svg.fonttype": "none", "font.family": "DejaVu Sans",
})

rng = np.random.default_rng(12)


def save(fig, name):
    fig.savefig(OUT / name, format="svg", bbox_inches="tight", pad_inches=0.25)
    plt.close(fig)


# Figure 1: Hick and Fitts, time is linear in bits -------------------------------------
fig, (a, b) = plt.subplots(1, 2, figsize=(8.4, 3.5))
n = np.array([1, 2, 3, 4, 6, 8, 10])
bits = np.log2(n + 1)
a.plot(bits, 180 + 150 * bits, color=BLUE)
a.scatter(bits, 180 + 150 * bits, color=BLUE, s=36, zorder=3, edgecolor=SURFACE, linewidth=1.5)
for ni, bi, off in zip(n[[0, 2, 6]], bits[[0, 2, 6]], [(10, -4), (10, -10), (-76, -2)]):
    a.annotate(f"{ni} choice" + ("s" if ni > 1 else ""), (bi, 180 + 150 * bi), xytext=off,
               textcoords="offset points", color=MUTED, fontsize=10)
a.set(title="(a) Hick: choosing", xlabel="information, log2(n + 1)  [bits]", ylabel="reaction time [ms]")

ident = np.linspace(1, 7, 7)
b.plot(ident, 60 + 105 * ident, color=PINK)
b.scatter(ident, 60 + 105 * ident, color=PINK, s=36, zorder=3, edgecolor=SURFACE, linewidth=1.5)
b.annotate("near, big target", (ident[0], 60 + 105 * ident[0]), xytext=(8, -4), textcoords="offset points",
           color=MUTED, fontsize=10)
b.annotate("far, small target", (ident[-1], 60 + 105 * ident[-1]), xytext=(-98, -2),
           textcoords="offset points", color=MUTED, fontsize=10)
b.set(title="(b) Fitts: moving", xlabel="index of difficulty, log2(2D / W)  [bits]", ylabel="movement time [ms]")
save(fig, "fig1-hick-fitts.svg")


# Figure 2: learning as falling cross-entropy --------------------------------------------
fig, ax = plt.subplots(figsize=(8.4, 3.6))
trials = np.arange(1, 2001)
floor = 3.0
cost = floor + 6.0 * trials ** -0.45
ax.plot(trials, cost, color=PINK)
ax.axhline(floor, color=BLUE, linestyle=(0, (5, 4)), linewidth=1.6)
ax.set_xscale("log")
ax.annotate("cross-entropy H(p, q)\nbits it costs with the hitter's current model", (6, floor + 6 * 6 ** -0.45),
            xytext=(14, 18), textcoords="offset points", color=INK, fontsize=10.5)
ax.annotate("entropy H(p): the floor, set by the task", (1.1, floor), xytext=(0, -15),
            textcoords="offset points", color=INK, fontsize=10.5)
x0 = 3
ax.annotate("", (x0, floor), (x0, floor + 6 * x0 ** -0.45),
            arrowprops=dict(arrowstyle="<->", color=MUTED, linewidth=1.2))
ax.annotate("KL divergence\n(what is left to learn)", (x0, floor + 0.62), xytext=(8, -10),
            textcoords="offset points", color=MUTED, fontsize=10)
ax.set(xlabel="practice trials (log scale)", ylabel="bits per swing", ylim=(2.2, 9.4),
       title="Learning as a falling description cost")
save(fig, "fig2-cross-entropy.svg")


# Toy two-joint swing used by figures 3 and 4 --------------------------------------------
t = np.linspace(0, 1, 101)
K = 40
along = rng.normal(0, 6.0, K)       # deviation that trades one joint against the other
across = rng.normal(0, 4.0, K)      # deviation that moves the task variable
g = 0.45 + 0.55 * t                 # the trade-off grows through the swing
h = 1.0 - 0.86 * t ** 2             # task error is squeezed out toward contact
base1 = 20 + 70 / (1 + np.exp(-9 * (t - 0.55)))
base2 = -10 + 55 / (1 + np.exp(-11 * (t - 0.68)))
th1 = base1 + np.outer(along, g) + 0.5 * np.outer(across, h)
th2 = base2 - np.outer(along, g) + 0.5 * np.outer(across, h)
task = th1 + th2

# Figure 3: ensembles and time-resolved between-trial SD -----------------------------------
fig, axes = plt.subplots(1, 3, figsize=(10.2, 3.5))
for ax, y, col, title in [
    (axes[0], th1, BLUE, "(a) one joint, 40 swings"),
    (axes[1], task, PINK, "(b) bat direction, same swings"),
]:
    ax.plot(100 * t, y.T, color=col, alpha=0.22, linewidth=0.9)
    ax.plot(100 * t, y.mean(0), color=INK, linewidth=1.8)
    ax.set(title=title, xlabel="normalized time, load to contact [%]", ylabel="angle [deg]")
ax = axes[2]
ax.plot(100 * t, th1.std(0, ddof=1), color=BLUE)
ax.plot(100 * t, task.std(0, ddof=1), color=PINK, linestyle=(0, (5, 3)))
ax.annotate("joint", (62, th1.std(0, ddof=1)[62]), xytext=(0, 8), textcoords="offset points", color=INK, fontsize=10.5)
ax.annotate("bat direction", (60, task.std(0, ddof=1)[60]), xytext=(-78, -16), textcoords="offset points",
            color=INK, fontsize=10.5)
ax.set(title="(c) between-swing SD", xlabel="normalized time, load to contact [%]", ylabel="SD [deg]", ylim=(0, None))
fig.tight_layout(w_pad=2.0)
save(fig, "fig3-funnel.svg")

# Figure 4: uncontrolled manifold at contact ---------------------------------------------
fig, axes = plt.subplots(1, 2, figsize=(8.4, 4.1), sharex=True, sharey=True)
N = 250
al = rng.normal(0, 6.0, N)
ac = rng.normal(0, 1.1, N)
structured = np.column_stack([al + 0.5 * ac, -al + 0.5 * ac])
total_var = structured.var(0, ddof=1).sum()
flat = rng.normal(0, np.sqrt(total_var / 2), (N, 2))
lim = 16
for ax, pts, col, title in [
    (axes[0], structured, PINK, "(a) structured: synergy index > 0"),
    (axes[1], flat, BLUE, "(b) same total variance, unstructured"),
]:
    ax.plot([-lim, lim], [lim, -lim], color=MUTED, linewidth=1.2, linestyle=(0, (5, 4)))
    ax.scatter(pts[:, 0], pts[:, 1], s=14, color=col, alpha=0.75, edgecolor=SURFACE, linewidth=0.4)
    ax.set(title=title, xlabel="joint 1 deviation [deg]", xlim=(-lim, lim), ylim=(-lim, lim), aspect="equal")
axes[0].set_ylabel("joint 2 deviation [deg]")
axes[0].text(-15, -14.6, "dashed line: uncontrolled manifold\n(bat direction unchanged)", color=INK, fontsize=10)
axes[0].annotate("", (5.5, 5.5), (0, 0), arrowprops=dict(arrowstyle="->", color=INK, linewidth=1.4))
axes[0].annotate("direction that\nmoves the bat", (5.5, 5.5), xytext=(4, 2), textcoords="offset points",
                 color=INK, fontsize=10)
fig.tight_layout(w_pad=2.0)
save(fig, "fig4-ucm.svg")


# Figure 5: rate-distortion and reverse water-filling ------------------------------------
fig, (a, b) = plt.subplots(1, 2, figsize=(8.8, 3.6))
d = np.linspace(0.01, 1.2, 400)
a.plot(d, np.maximum(0, 0.5 * np.log2(1 / d)), color=PINK)
a.annotate("tight tolerance:\nexpensive", (0.03, 2.53), xytext=(14, -6), textcoords="offset points", color=INK,
           fontsize=10.5)
a.annotate("loose tolerance:\nfree", (1.0, 0), xytext=(-22, 26), textcoords="offset points", color=INK, fontsize=10.5)
a.set(title="(a) R(D) for one Gaussian dimension", xlabel="allowed error D / variance", ylabel="rate [bits]",
      ylim=(-0.08, 3.4))

labels = ["bat direction", "contact depth", "elbow path", "hand path", "head sway"]
var = np.array([1.0, 0.8, 1.3, 0.9, 0.5])
weight = np.array([1.0, 0.7, 0.0, 0.0, 0.0])        # task weight: zero means outcome does not care
dist = np.where(weight > 0, 0.06 / np.maximum(weight, 1e-9), var)
dist = np.minimum(dist, var)
bits_alloc = 0.5 * np.log2(var / dist)
ypos = np.arange(len(labels))[::-1]
b.barh(ypos, bits_alloc, color=[PINK if w > 0 else BLUE for w in weight], height=0.55)
for y, v, w in zip(ypos, bits_alloc, weight):
    b.text(v + 0.06, y, f"{v:.1f} bits" if w > 0 else "0 bits (free to vary)", va="center", color=INK, fontsize=10.5)
b.set_yticks(ypos, labels)
b.tick_params(axis="y", colors=INK)
b.grid(axis="y", visible=False)
b.set(title="(b) where the bits go", xlabel="rate spent [bits]", xlim=(0, 3.4))
fig.tight_layout(w_pad=2.5)
save(fig, "fig5-rate-distortion.svg")

print("wrote", sorted(p.name for p in OUT.glob("*.svg")))
