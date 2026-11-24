"""Figures for the blog post src/content/blog/swing-as-compression.md.

Figures 1, 2 and 6 are schematics drawn from equations. No athlete data and no measured data of
any kind is read here. Figures 3, 4 and 5 come from elsewhere (see the note below).

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


# fig3-funnel.svg, fig4-ucm.svg and fig5-rate-distortion.svg are not drawn here. They are cohort
# averages from lab motion capture, built by a generator that is not part of this repository.
# Running this script leaves them untouched.

# Figure 6: attractor depth and the bits needed to describe the state ----------------------
fig, (a, b) = plt.subplots(1, 2, figsize=(8.8, 3.6))
x = np.linspace(-3, 3, 500)
temp = 1.0
for k, col, style, name in [(1.0, BLUE, "-", "shallow well"), (8.0, PINK, (0, (5, 3)), "deep well")]:
    a.plot(x, 0.5 * k * x ** 2, color=col, linestyle=style)
    sd = np.sqrt(temp / k)
    b.plot(x, np.exp(-0.5 * (x / sd) ** 2) / (sd * np.sqrt(2 * np.pi)), color=col, linestyle=style)
a.set(title="(a) landscape V(x)", xlabel="coordination state x", ylabel="V(x)", ylim=(0, 6))
a.annotate("shallow well", (1.7, 0.5 * 1.7 ** 2), xytext=(10, -16), textcoords="offset points", color=INK, fontsize=10.5)
a.annotate("deep well", (-1.1, 0.5 * 8 * 1.1 ** 2), xytext=(-70, 0), textcoords="offset points", color=INK, fontsize=10.5)
b.set(title="(b) where the system ends up", xlabel="coordination state x", ylabel="probability density")
b.annotate("shallow well", (1.3, 0.17), xytext=(6, 8), textcoords="offset points", color=INK, fontsize=10.5)
b.annotate("deep well:\n1.5 bits cheaper\nto describe", (0.3, 0.8), xytext=(14, -4), textcoords="offset points",
           color=INK, fontsize=10.5)
fig.tight_layout(w_pad=2.5)
save(fig, "fig6-attractor.svg")

print("wrote fig1-hick-fitts.svg, fig2-cross-entropy.svg, fig6-attractor.svg")
