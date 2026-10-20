"""
Synthesizes the calm 45s score + UI sound design for Haixing's light edit (no samples, no licensing).
120 BPM, C major, soft and airy like the reference films. Beat frames mirror src/light/*.

  python3 scripts/compose_light.py   →  public/audio/haixing-light.wav (48kHz stereo)
"""
import wave
from pathlib import Path

import numpy as np

SR = 48000
DUR = 45.0
N = int(SR * DUR)
BEAT = 0.5
rng = np.random.default_rng(7)

# Scene starts + beats in frames — mirror src/light/timeline.ts and the scene files
F = lambda frame: frame / 30
S = dict(question=0, logo=150, families=300, materials=480, processes=660, quality=810, steps=960, scale=1110, end=1230)
T = {k: F(v) for k, v in S.items()}
SWAP_AT = [50, 78, 106]
FILL_AT = [22 + i * 7 for i in range(15)]
MATERIAL_AT = [30, 60, 90, 120]
PROCESS_AT = [20, 46, 72, 98, 124]
BADGE_AT = [34, 52, 70]
STEP2_AT = 82
INDUSTRY_AT = [58 + i * 5 for i in range(8)]


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
FMAJ7 = (41, [53, 57, 60, 64])
G6 = (43, [55, 59, 62, 64])
EM7 = (40, [52, 55, 59, 62])
AM7 = (45, [57, 60, 64, 67])
PROG = [FMAJ7, G6, EM7, AM7]
arp = [0, 2, 1, 3, 2, 1, 3, 2]
kick_times = []
GROOVE = (T['families'], T['end'] + 2.0)

# Harmony bed over the whole film, piano-like arpeggio from the logo on
for bar, t0 in enumerate(np.arange(0, DUR - 1.5, 2.0)):
    root, notes = PROG[bar % 4]
    pad(notes, t0, 2.3, b0=0.8, b1=1.2, gain=0.03, a=0.4, r=0.6)
    if t0 >= T['logo'] - 0.1:
        step = 0.25 if t0 < T['families'] else 0.125
        for s, st in enumerate(np.arange(t0, t0 + 2.0, step)):
            place(music, pluck(notes[arp[s % 8]] + 12, bright=0.5), st, 0.045 if step == 0.125 else 0.05, pan=0.5 * np.sin(s * 0.8), verb=0.6)
    if GROOVE[0] <= t0 < GROOVE[1]:
        for s, st in enumerate(np.arange(t0, t0 + 2.0, 0.5)):
            place(music, fft_filter(bass_note(root - 12, 0.45), hi=450), st, 0.13)
place(music, pad_voice(36, DUR, 0.8, 0.8) * adsr(int(DUR * SR), 2.0, 2.0, DUR), 0, 0.02, verb=0.2)

# Soft groove from the product grid until the end card
for bt in np.arange(*GROOVE, 0.5):
    kick_times.append(bt)
    place(drums, fft_filter(kick(0.2), hi=2000), bt, 0.26)
    place(drums, hat(), bt + 0.25, 0.03, pan=0.3)
    if round((bt - GROOVE[0]) / 0.5) % 2 == 1:
        place(drums, snap(), bt, 0.1, pan=-0.1, verb=0.5)

def chime(t, notes, gain=0.045, spread=0.06):
    for i, m in enumerate(notes):
        place(sfx, bell(m, 2.0), t + i * spread, gain, pan=-0.3 + i * 0.2, verb=0.7)

def pop(t, f=1600, gain=0.05, pan=0.0):
    place(sfx, tick(f), t, gain, pan=pan, verb=0.3)

# Scene breaths
for k in ('logo', 'families', 'materials', 'processes', 'quality', 'steps', 'scale', 'end'):
    place(sfx, whoosh(0.6), T[k] - 0.35, 0.03, pan=-0.2, verb=0.5)

# Question → logo
for i, f in enumerate(SWAP_AT):
    pop(F(f), 1200 + i * 250, 0.06)
place(sfx, riser(1.2, 300, 1800), T['logo'] - 1.2, 0.03, verb=0.6)
chime(F(S['logo'] + 4), [72, 76, 79, 84], 0.05)
for st in np.arange(F(S['logo'] + 96), F(S['logo'] + 132), 1 / 10):
    pop(st, 2200, 0.025)

# Grid fills, material swaps, process chips
for i, f in enumerate(FILL_AT):
    place(sfx, bell([84, 86, 88, 91, 93][i % 5] + (12 if i >= 10 else 0), 0.6), F(S['families'] + f), 0.028, pan=-0.5 + (i % 5) * 0.25, verb=0.4)
for f in MATERIAL_AT:
    place(sfx, ui_click(), F(S['materials'] + f), 0.2, pan=0.2)
    place(sfx, whoosh(0.3), F(S['materials'] + f), 0.025)
for f in PROCESS_AT:
    place(sfx, ui_click(), F(S['processes'] + f), 0.18, pan=0.1)

# Quality badges + pass-rate count
for i, f in enumerate(BADGE_AT):
    chime(F(S['quality'] + f), [79 + i * 2, 84 + i * 2], 0.04, 0.05)
for st in np.arange(F(S['quality'] + 92), F(S['quality'] + 124), 1 / 12):
    pop(st, 2400, 0.02)

# Steps: typing, blueprint → part, batch
for i in range(4):
    for st in np.arange(F(S['steps'] + 30 + i * 10), F(S['steps'] + 38 + i * 10), 1 / 15):
        pop(st, rng.uniform(2000, 2800), 0.022, 0.3)
place(sfx, whoosh(0.5), F(S['steps'] + STEP2_AT) - 0.2, 0.05)
chime(F(S['steps'] + STEP2_AT + 18), [76, 79, 84], 0.05)
for i in range(10):
    pop(F(S['steps'] + STEP2_AT + 44 + i), 1500 + i * 80, 0.03, -0.5 + i * 0.1)

# Scale: industries
for i, f in enumerate(INDUSTRY_AT):
    place(sfx, bell([79, 81, 84, 86, 88, 91, 93, 96][i], 0.8), F(S['scale'] + f), 0.03, pan=-0.5 + i * 0.14, verb=0.4)

# End card
chime(F(S['end'] + 6), [72, 79, 84, 88], 0.055, 0.08)
place(sfx, whoosh(0.35), F(S['end'] + 42), 0.04, pan=0.3)
pad([48, 60, 64, 67, 71, 76], T['end'], 4.0, b0=1.0, b1=1.6, gain=0.03, a=0.3, r=1.8)

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
fo = int(1.2 * SR)
fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
mix *= fade * 0.67  # ≈ -14 LUFS (social-platform loudness target)

out = Path(__file__).resolve().parent.parent / 'public' / 'audio' / 'haixing-light.wav'
pcm = (np.clip(mix.T, -1, 1) * 32767).astype('<i2')
with wave.open(str(out), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f'wrote {out}  rms={20*np.log10(np.sqrt(np.mean(mix**2))):.1f} dBFS')
