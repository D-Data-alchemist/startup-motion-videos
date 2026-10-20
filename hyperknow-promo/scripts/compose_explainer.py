"""
Synthesizes the ~68s explainer score + SFX (light, warm major key; no samples, no licensing).
120 BPM → 1 beat = 0.5s = 15 frames @30fps, so every hit lands exactly on a video frame.

  python3 scripts/compose_explainer.py   →  public/audio/explainer.wav (48kHz stereo)
"""
import wave
from pathlib import Path

import numpy as np

SR = 48000
DUR = 68.0
N = int(SR * DUR)
BEAT = 0.5
rng = np.random.default_rng(7)

# Scene starts + beats in frames — mirror src/explainer/Explainer.tsx and the scene files
F = lambda frame: frame / 30
S = dict(opener=0, problem=150, intro=240, craft=385, learn=595, ml=950, practice=1160, explore=1455, manifesto=1705, cta=1855)
T = {k: F(v) for k, v in S.items()}


# ─── buses (stereo) ─────────────────────────────────────────────────────────
music = np.zeros((2, N))   # ducked by the kick (sidechain pump)
drums = np.zeros((2, N))
sfx = np.zeros((2, N))
send = np.zeros((2, N))    # reverb send


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def place(bus, sig, t, gain=1.0, pan=0.0, verb=0.0):
    """Mix a mono signal into a bus at time t (s) with equal-power pan."""
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    bus[0, i : i + len(sig)] += sig * l
    bus[1, i : i + len(sig)] += sig * r
    if verb:
        send[0, i : i + len(sig)] += sig * l * verb
        send[1, i : i + len(sig)] += sig * r * verb


def fft_filter(x, lo=None, hi=None, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    H = np.ones_like(f)
    if hi:
        H /= np.sqrt(1 + (f / hi) ** (2 * order))
    if lo:
        H /= np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * order))
    return np.fft.irfft(X * H, n=len(x))


def tt(dur):
    return np.arange(int(dur * SR)) / SR


def adsr(n, a, r, total):
    t = np.arange(n) / SR
    env = np.minimum(1, t / max(a, 1e-4))
    env *= np.clip((total - t) / max(r, 1e-4), 0, 1)
    return env


# ─── instruments ────────────────────────────────────────────────────────────
def pad_voice(m, dur, b0, b1, detune=0.0):
    """Additive saw with time-varying brightness (acts like a filter sweep)."""
    t = tt(dur)
    b = np.linspace(b0, b1, len(t))
    f = midi(m) * 2 ** (detune / 1200)
    out = np.zeros_like(t)
    for k in range(1, 13):
        if f * k > 12000:
            break
        out += (1 / k) * np.exp(-(k - 1) / b) * np.sin(2 * np.pi * f * k * t + rng.uniform(0, 6.28))
    return out


def pad(notes, t0, dur, b0=1.5, b1=3.0, gain=0.05, a=0.6, r=0.9):
    for m in notes:
        for det, pan in ((-7, -0.6), (7, 0.6)):
            v = pad_voice(m, dur, b0, b1, det) * adsr(int(dur * SR), a, r, dur)
            place(music, v, t0, gain, pan, verb=0.5)


def pluck(m, dur=0.35, bright=1.0):
    t = tt(dur)
    f = midi(m)
    out = sum((1 / k ** 1.5) * np.exp(-t * (5 + k * 4 / bright)) * np.sin(2 * np.pi * f * k * t) for k in range(1, 5))
    return out * np.minimum(1, t / 0.002)


def bass_note(m, dur):
    t = tt(dur)
    f = midi(m)
    body = sum((1 / k) * np.exp(-(k - 1) / 1.4) * np.sin(2 * np.pi * f * k * t) for k in range(1, 6))
    sub = np.sin(2 * np.pi * f / 2 * t) * 0.6
    env = (0.35 + 0.65 * np.exp(-t * 9)) * adsr(len(t), 0.004, 0.05, dur)
    return (body + sub) * env


def kick(tone=1.0):
    t = tt(0.5)
    f = 44 + 120 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 6.5)
    click = fft_filter(rng.standard_normal(len(t)), lo=2000) * np.exp(-t * 400) * 0.25 * tone
    return np.tanh((body + click) * 1.6)


def clap():
    t = tt(0.35)
    n = fft_filter(rng.standard_normal(len(t)), lo=900, hi=4000)
    env = np.exp(-t * 18)
    for d in (0.0, 0.011, 0.022):
        env += 0.6 * np.exp(-np.maximum(t - d, 0) * 220) * (t >= d)
    return n * env * 0.5


def snap():
    t = tt(0.2)
    return fft_filter(rng.standard_normal(len(t)), lo=1800, hi=6000) * np.exp(-t * 45)


def hat(open_=False):
    t = tt(0.25 if open_ else 0.07)
    return fft_filter(rng.standard_normal(len(t)), lo=7500) * np.exp(-t * (16 if open_ else 70))


def riser(dur, f0=180, f1=2400):
    t = tt(dur)
    f = f0 * (f1 / f0) ** (t / dur)
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = sum(np.sin(ph * k) / k for k in (1, 2, 3)) * 0.4
    noise = fft_filter(rng.standard_normal(len(t)), lo=1500)
    return (tone + noise * 0.18) * (t / dur) ** 2.6


def reverse_cymbal(dur):
    t = tt(dur)
    n = fft_filter(rng.standard_normal(len(t)), lo=3500)
    return n * np.exp((t - dur) * 5)


def whoosh(dur):
    t = tt(dur)
    n = fft_filter(rng.standard_normal(len(t)), lo=400, hi=5000)
    return n * np.sin(np.pi * t / dur) ** 2


def impact(size=1.0):
    t = tt(2.5)
    f = 30 + 70 * np.exp(-t * 8)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.8)
    crack = fft_filter(rng.standard_normal(len(t)), hi=3000) * np.exp(-t * 14) * 0.5
    return np.tanh((boom + crack) * 1.5) * size


def ui_click():
    t = tt(0.05)
    return (np.sin(2 * np.pi * 3400 * t) * np.exp(-t * 350) * 0.6
            + np.sin(2 * np.pi * 1100 * t) * np.exp(-t * 180)
            + fft_filter(rng.standard_normal(len(t)), lo=4000) * np.exp(-t * 600) * 0.3)


def bell(m, dur=1.6):
    t = tt(dur)
    f = midi(m)
    parts = ((1, 1.0, 3), (2.0, 0.4, 5), (2.76, 0.3, 7), (5.4, 0.12, 12))
    return sum(a * np.exp(-t * d) * np.sin(2 * np.pi * f * r * t) for r, a, d in parts) * np.minimum(1, t / 0.002)


def tick(f):
    t = tt(0.03)
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 220)


# ─── arrangement ────────────────────────────────────────────────────────────
CMAJ9 = [60, 64, 67, 71, 74]
AM9 = [57, 60, 64, 67, 71]
FMAJ9 = [53, 57, 60, 64, 67]
G6 = [55, 59, 62, 64, 67]
PROG = [(CMAJ9, 36), (AM9, 33), (FMAJ9, 29), (G6, 31)]
arp = [0, 2, 4, 1, 3, 2, 4, 3]
kick_times = []
GROOVE_END = T['manifesto'] - 0.3            # drums drop out for the manifesto
CTA_GROOVE = (T['cta'] + 1.0, T['cta'] + 4.2)

# Harmony bed: one chord per 2s bar for the whole piece
for bar, t0 in enumerate(np.arange(0, T['cta'] + 4.2, 2.0)):
    notes, root = PROG[bar % 4]
    quiet = t0 < T['intro'] or T['manifesto'] - 0.5 <= t0 < T['cta']
    pad(notes, t0, 2.3, b0=0.9 if quiet else 1.1, b1=1.4 if quiet else 1.7, gain=0.03, a=0.3, r=0.5)
    # bass + arp follow the groove sections
    in_groove = T['intro'] <= t0 < GROOVE_END or CTA_GROOVE[0] - 1 <= t0 < CTA_GROOVE[1]
    if in_groove:
        for s, st in enumerate(np.arange(t0, t0 + 2.0, 0.25)):
            place(music, fft_filter(bass_note(root + (12 if s % 4 == 2 else 0), 0.24), hi=500), st, 0.13)
    arp_gain = 0.03 if t0 < T['problem'] else (0.045 if in_groove else 0.035)
    step = 0.25 if (t0 < T['intro'] or not in_groove) else 0.125
    if t0 >= 1.0:
        for s, st in enumerate(np.arange(t0, t0 + 2.0, step)):
            place(music, pluck(notes[arp[s % 8]] + 12, bright=0.45), st, arp_gain, pan=0.5 * np.sin(s * 0.9), verb=0.6)
place(music, pad_voice(48, DUR, 0.9, 0.9) * adsr(int(DUR * SR), 2.0, 2.5, DUR), 0.0, 0.025, verb=0.2)

# Problem: muffled heartbeat building into "Meet Hyperknow"
for i, bt in enumerate(np.arange(5.0, T['intro'], BEAT)):
    place(drums, fft_filter(kick(0), hi=150), bt, 0.12 + i * 0.03)
place(sfx, riser(1.6, 200, 1600), T['intro'] - 1.6, 0.04, verb=0.6)

# Groove: soft kick from the intro, full kit from Step 1
for bt in np.arange(8.0, GROOVE_END, BEAT):
    full = bt >= 12.5
    kick_times.append(bt)
    place(drums, fft_filter(kick(0.3), hi=2500), bt, 0.36 if full else 0.24)
    if full:
        place(drums, hat(), bt + 0.25, 0.045, pan=0.3)
        if round(bt / BEAT) % 2 == 1:
            place(drums, snap(), bt, 0.15, pan=-0.1, verb=0.5)
for bt in np.arange(*CTA_GROOVE, BEAT):
    kick_times.append(bt)
    place(drums, fft_filter(kick(0.3), hi=2500), bt, 0.3)
    place(drums, hat(), bt + 0.25, 0.035, pan=0.3)
    if round(bt / BEAT) % 2 == 1:
        place(drums, snap(), bt, 0.12, verb=0.5)
for st in np.arange(12.5, GROOVE_END, 0.125):
    place(drums, hat(), st, 0.013, pan=-0.4)

# Soft swells on every scene change
for k in ('problem', 'craft', 'learn', 'ml', 'practice', 'explore', 'manifesto'):
    place(sfx, whoosh(0.6), T[k] - 0.3, 0.035, pan=-0.2, verb=0.4)

def chime(t, notes, gain=0.05, spread=0.06):
    for i, m in enumerate(notes):
        place(sfx, bell(m, 2.0), t + i * spread, gain, pan=-0.3 + i * 0.2, verb=0.7)

# Meet Hyperknow
place(sfx, fft_filter(impact(0.5), hi=400), T['intro'], 0.4, verb=0.3)
chime(T['intro'] + 0.1, [72, 76, 79, 83], 0.045)

# Step 1 · Craft (beats from src/scenes/ActionScene.tsx)
place(sfx, ui_click(), F(S['craft'] + 34), 0.25, pan=0.2)
place(sfx, ui_click(), F(S['craft'] + 58), 0.4, pan=0.35, verb=0.15)
penta = [84, 86, 88, 91, 93, 96]
for st in np.arange(F(S['craft'] + 62), F(S['craft'] + 142), 1 / 12):
    place(sfx, tick(midi(penta[rng.integers(0, 6)]) * 2), st, 0.03, pan=rng.uniform(-0.7, 0.7), verb=0.3)
chime(F(S['craft'] + 148), [84, 88, 91, 95])

# Step 2 · Learn (src/explainer/LearnScene.tsx)
place(sfx, tick(1400), F(S['learn'] + 85), 0.08, verb=0.3)
for st in np.arange(F(S['learn'] + 118), F(S['learn'] + 200), 1 / 10):
    place(sfx, tick(midi(penta[rng.integers(0, 6)]) * 2), st, 0.02, pan=rng.uniform(-0.5, 0.5), verb=0.3)
place(sfx, ui_click(), F(S['learn'] + 240), 0.25, pan=0.4)
for st in np.arange(F(S['learn'] + 244), F(S['learn'] + 280), 1 / 15):  # soft typing
    place(sfx, tick(rng.uniform(1800, 2600)), st, 0.025, pan=0.4)
place(sfx, ui_click(), F(S['learn'] + 288), 0.4, pan=-0.2, verb=0.15)
chime(F(S['learn'] + 290), [79, 84, 88, 91], 0.055)

# Step 2b · Machine Learning (src/explainer/MLScene.tsx): plinks as the ball steps downhill
for i, f in enumerate((95, 110, 125, 140, 155, 170)):
    place(sfx, bell(91 - [0, 2, 4, 7, 9, 12][i], 1.2), F(S['ml'] + f), 0.04, pan=-0.4 + i * 0.15, verb=0.5)
chime(F(S['ml'] + 175), [79, 84, 88, 91], 0.05)

# Step 3 · Practice (src/explainer/PracticeScene.tsx)
for f in (40, 140):
    place(sfx, whoosh(0.35), F(S['practice'] + f), 0.05, pan=0.2)
for f in (95, 195):
    place(sfx, ui_click(), F(S['practice'] + f), 0.38, pan=0.15)
    place(sfx, whoosh(0.4), F(S['practice'] + f + 2), 0.04, pan=0.6)
chime(F(S['practice'] + 232), [84, 88, 91, 96], 0.05)

# Step 4 · Explore (src/explainer/ExploreScene.tsx)
place(sfx, ui_click(), F(S['explore'] + 170), 0.4, pan=0.2, verb=0.15)
chime(F(S['explore'] + 172), [79, 83, 86, 91], 0.05)

# Manifesto → CTA
place(sfx, riser(1.4, 300, 2000), T['cta'] - 1.4, 0.045, verb=0.6)
place(sfx, reverse_cymbal(0.9), T['cta'] - 0.9, 0.035)
place(sfx, fft_filter(impact(0.6), hi=350), T['cta'], 0.45, verb=0.4)
pad([48] + CMAJ9 + [79], T['cta'], 6.0, b0=1.2, b1=2.0, gain=0.032, a=0.08, r=2.2)
chime(T['cta'] + 0.15, [79, 83, 84, 88, 91, 95], 0.045, 0.09)
place(sfx, ui_click(), F(S['cta'] + 116), 0.4, pan=0.1, verb=0.2)
chime(F(S['cta'] + 118), [72, 79, 88], 0.055)

# ─── mix ────────────────────────────────────────────────────────────────────
t = np.arange(N) / SR
duck = np.ones(N)
for kt in kick_times:
    m = t >= kt
    duck[m] -= 0.25 * np.exp(-(t[m] - kt) / 0.12)
duck = np.clip(duck, 0.3, 1)

# reverb: decorrelated exponential-noise IR, FFT convolution
ir_t = tt(2.6)
mix = music * duck + drums + sfx
for ch in range(2):
    ir = fft_filter(rng.standard_normal(len(ir_t)), hi=5500) * np.exp(-ir_t * 2.6)
    ir[: int(0.02 * SR)] = 0  # pre-delay
    n_fft = 1 << int(np.ceil(np.log2(N + len(ir))))
    wet = np.fft.irfft(np.fft.rfft(send[ch], n_fft) * np.fft.rfft(ir, n_fft), n_fft)[:N]
    mix[ch] += wet / np.max(np.abs(ir)) * 0.016

mix = np.array([fft_filter(c, lo=30, hi=9000, order=1) for c in mix])  # clean sub rumble
mix /= np.max(np.abs(mix))
mix = np.tanh(mix * 1.4) / np.tanh(1.4)  # glue / soft limit
fade = np.ones(N)
fade[: int(0.01 * SR)] = np.linspace(0, 1, int(0.01 * SR))
fo = int(1.5 * SR)
fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
mix *= fade * 0.75  # ≈ -14 LUFS (social-platform loudness target)

out = Path(__file__).resolve().parent.parent / 'public' / 'audio' / 'explainer.wav'
pcm = (np.clip(mix.T, -1, 1) * 32767).astype('<i2')
with wave.open(str(out), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f'wrote {out}  rms={20*np.log10(np.sqrt(np.mean(mix**2))):.1f} dBFS')
