"""
Synthesizes the 17s score + UI sound design for the Sellio promo (no samples, no licensing).
120 BPM, C major, bright and warm. Beat frames mirror src/scenes/*.

  python3 scripts/compose_soundtrack.py   →  public/audio/sellio.wav (48kHz stereo)
"""
import wave
from pathlib import Path

import numpy as np

SR = 48000
DUR = 17.0
N = int(SR * DUR)
BEAT = 0.5
rng = np.random.default_rng(7)

# Scene starts + beats in frames — mirror src/theme.tsx and the scene files
F = lambda frame: frame / 30
S = dict(hook=0, inbox=100, cta=300)
T = {k: F(v) for k, v in S.items()}
POPS = [6 + i * 5 for i in range(10)]
HOOK = dict(line1=18, line2=56, suck=(82, 100), icon=86)
INBOX = dict(new1=24, msg1=32, typing=(40, 52), ai1=(52, 80), cite=82, resolved=92, new2=104, msg2=112, ai2=124, handoff=138, human=150, toast=172)
CTA_CLICK = 116


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


# ─── industrial instruments ─────────────────────────────────────────────────
def tom(f0=95, dur=1.2):
    t = tt(dur)
    f = f0 * (0.55 + 0.45 * np.exp(-t * 18))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.5)
    skin = fft_filter(rng.standard_normal(len(t)), lo=200, hi=2500) * np.exp(-t * 30) * 0.35
    return np.tanh((body + skin) * 1.8)


def metal_hit(f0=520, dur=1.8, bright=1.0):
    t = tt(dur)
    parts = ((1, 1.0, 5), (2.32, 0.7, 7), (4.25, 0.5, 11), (6.63, 0.35 * bright, 16), (9.1, 0.2 * bright, 22))
    ring = sum(a * np.exp(-t * d) * np.sin(2 * np.pi * f0 * r * t + rng.uniform(0, 6)) for r, a, d in parts)
    clank = fft_filter(rng.standard_normal(len(t)), lo=1500) * np.exp(-t * 90) * 0.8
    return (ring * 0.6 + clank) * np.minimum(1, t / 0.0008)


def braam_at(t0, notes, dur, gain=0.05, a=0.06, r=1.6):
    for m in notes:
        for det, pan in ((-9, -0.5), (0, 0), (9, 0.5)):
            v = pad_voice(m, dur, 3.5, 2.0, det) * adsr(int(dur * SR), a, r, dur)
            place(sfx, np.tanh(v * 1.5), t0, gain, pan, verb=0.5)


def ostinato_note(m, dur=0.12, bright=1.2):
    t = tt(dur + 0.1)
    f = midi(m)
    out = sum((1 / k) * np.exp(-(k - 1) / (bright * 2)) * np.sin(2 * np.pi * f * k * t) for k in range(1, 9))
    return out * np.exp(-t * 14) * np.minimum(1, t / 0.003)




def stamp(gain=0.4, t0=0.0, pan=0.0):
    t = tt(0.5)
    thud = np.sin(2 * np.pi * np.cumsum(70 + 60 * np.exp(-t * 40)) / SR) * np.exp(-t * 14)
    slap = fft_filter(rng.standard_normal(len(t)), lo=600, hi=5000) * np.exp(-t * 60) * 0.7
    place(sfx, np.tanh((thud + slap) * 1.6), t0, gain, pan=pan, verb=0.25)


def scribble(t0, dur, gain=0.03):
    t = tt(dur)
    n = fft_filter(rng.standard_normal(len(t)), lo=2500, hi=7000)
    env = 0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 7 * t))
    place(sfx, n * env * adsr(len(t), 0.02, 0.05, dur), t0, gain, pan=0.2)


def chime(t, notes, gain=0.05, spread=0.06):
    for i, m in enumerate(notes):
        place(sfx, bell(m, 2.0), t + i * spread, gain, pan=-0.3 + i * 0.2, verb=0.6)


# ─── arrangement ────────────────────────────────────────────────────────────
CM = (36, [55, 60, 64, 67])
AM = (33, [57, 60, 64, 69])
FM = (41, [53, 57, 60, 65])
GM = (43, [55, 59, 62, 67])
PROG = [CM, AM, FM, GM]
OST = [0, 2, 1, 3, 2, 1, 3, 2]
kick_times = []
drop = F(HOOK['suck'][1])

def chime(t, notes, gain=0.05, spread=0.06):
    for i, m in enumerate(notes):
        place(sfx, bell(m, 1.8), t + i * spread, gain, pan=-0.3 + i * 0.2, verb=0.6)

def ping(t, f0, gain=0.05, pan=0.0):
    place(sfx, bell(f0, 0.5), t, gain, pan=pan, verb=0.25)

for bar, t0 in enumerate(np.arange(0, DUR - 1.5, 2.0)):
    root, notes = PROG[bar % 4]
    pad(notes, t0, 2.2, b0=1.0, b1=1.8, gain=0.026, a=0.1, r=0.4)
    if t0 >= drop - 0.5:
        for s, st in enumerate(np.arange(t0, t0 + 2.0, 0.25)):
            place(music, fft_filter(bass_note(root - 12 + (12 if s % 2 else 0), 0.24), hi=600), st, 0.13)
        for s, st in enumerate(np.arange(t0, t0 + 2.0, 0.125)):
            place(music, pluck(notes[OST[s % 8]] + 12, bright=0.7), st, 0.045, pan=0.45 * np.sin(s), verb=0.4)

# Hook: notification pings stack up and get anxious, then everything is swallowed into the icon
for i, f in enumerate(POPS):
    ping(F(f), [84, 88, 91, 86, 89, 93, 84, 90, 87, 92][i], 0.05 + i * 0.004, pan=-0.6 + (i % 5) * 0.3)
for bt in np.arange(0, drop, 0.25):
    place(sfx, tick(2600), bt, 0.02 + 0.03 * bt / drop, pan=0.3)
place(sfx, riser(0.9, 400, 3000), F(HOOK['suck'][0]) - 0.3, 0.07, verb=0.4)
place(sfx, whoosh(0.6), F(HOOK['suck'][0]), 0.08)
place(sfx, impact(0.5), drop, 0.4, verb=0.4)
chime(F(HOOK['icon']), [72, 76, 79], 0.05)

# Groove from the icon drop
for bt in np.arange(drop, DUR - 2.0, 0.5):
    beat = round((bt - drop) / 0.5)
    kick_times.append(bt)
    place(drums, kick(0.4), bt, 0.45)
    place(drums, hat(), bt + 0.25, 0.06, pan=0.3)
    if beat % 2 == 1:
        place(drums, snap(), bt, 0.14, verb=0.4)

# Inbox: arrivals, typing, AI answer, resolved, handoff
I = lambda f: F(S['inbox'] + f)
for f, n in ((INBOX['new1'], 86), (INBOX['new2'], 89)):
    ping(I(f), n, 0.06, 0.4)
for f in (INBOX['msg1'], INBOX['msg2']):
    place(sfx, whoosh(0.2), I(f), 0.03, pan=-0.3)
for st in np.arange(I(INBOX['typing'][0]), I(INBOX['typing'][1]), 1 / 6):
    place(sfx, tick(1900), st, 0.025)
for st in np.arange(I(INBOX['ai1'][0]), I(INBOX['ai1'][1]), 1 / 14):
    place(sfx, tick(rng.uniform(2200, 3000)), st, 0.018, pan=0.3)
chime(I(INBOX['resolved']), [76, 79, 84], 0.055)
place(sfx, whoosh(0.3), I(INBOX['handoff']), 0.04, pan=0.4)
ping(I(INBOX['handoff']), 81, 0.05)
ping(I(INBOX['human']), 84, 0.05, -0.2)
chime(I(INBOX['toast']), [72, 76, 79, 84], 0.045)

# CTA
place(sfx, riser(0.9, 300, 2500), T['cta'] - 0.9, 0.05, verb=0.5)
place(sfx, impact(0.5), T['cta'], 0.35, verb=0.4)
pad([48, 60, 64, 67, 72, 76], T['cta'], 5.0, b0=1.2, b1=2.0, gain=0.03, a=0.1, r=2.0)
chime(T['cta'] + 0.1, [72, 76, 79, 84], 0.05, 0.08)
place(sfx, metal_hit(700, 0.8, 0.5), F(S['cta'] + 46), 0.05)
place(sfx, ui_click(), F(S['cta'] + CTA_CLICK), 0.4, pan=0.1)
chime(F(S['cta'] + CTA_CLICK) + 0.03, [79, 84, 88], 0.05)

# ─── mix ────────────────────────────────────────────────────────────────────
t = np.arange(N) / SR
duck = np.ones(N)
for kt in kick_times:
    m = t >= kt
    duck[m] -= 0.4 * np.exp(-(t[m] - kt) / 0.1)
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

mix = np.array([fft_filter(c, lo=28) for c in mix])  # clean sub rumble
mix /= np.max(np.abs(mix))
mix = np.tanh(mix * 1.4) / np.tanh(1.4)  # glue / soft limit
fade = np.ones(N)
fade[: int(0.01 * SR)] = np.linspace(0, 1, int(0.01 * SR))
fo = int(1.6 * SR)
fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
mix *= fade * 0.64  # ≈ -14 LUFS (social-platform loudness target)

out = Path(__file__).resolve().parent.parent / 'public' / 'audio' / 'sellio.wav'
pcm = (np.clip(mix.T, -1, 1) * 32767).astype('<i2')
with wave.open(str(out), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f'wrote {out}  rms={20*np.log10(np.sqrt(np.mean(mix**2))):.1f} dBFS')
