"""Cú Nghiên sound kit, all synthesised (no samples): sonic logo, owl hoot, SFX and the brand music bed.
Every function returns a float32 stereo array (2, n) at 48 kHz, peak around 1.0 unless noted.
Usage: python sound.py <out_dir>   writes a .wav of each sound to listen to."""
import sys, wave
from pathlib import Path
import numpy as np

SR = 48000
RNG = np.random.default_rng(2026)


def t_(dur):
    return np.arange(int(dur * SR)) / SR


def st(x, pan=0.0):
    """Mono -> stereo with constant-power pan in [-1, 1]."""
    a = (pan + 1) * np.pi / 4
    return np.vstack([x * np.cos(a), x * np.sin(a)]) * np.sqrt(2)


def norm(x, peak=1.0):
    return x / (np.abs(x).max() + 1e-9) * peak


def env(n, attack, tau):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / tau)


def bandpass(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(x.size, 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, x.size)


def sweep(f0, f1, dur, kind="exp"):
    t = t_(dur)
    f = f0 * (f1 / f0) ** (t / dur) if kind == "exp" else f0 + (f1 - f0) * t / dur
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


# ------------------------------------------------------------ brand tones
def marimba(freq, dur=0.6, vel=1.0):
    t = t_(dur)
    a = np.minimum(1, t / 0.003)
    x = (np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.25)
         + 0.35 * np.sin(2 * np.pi * freq * 3.93 * t) * np.exp(-t / 0.042)
         + 0.10 * np.sin(2 * np.pi * freq * 9.2 * t) * np.exp(-t / 0.02))
    return vel * a * x


def bell(freq, dur=1.0, vel=1.0):
    t = t_(dur)
    x = sum(amp * np.sin(2 * np.pi * freq * r * t) * np.exp(-t / tau)
            for r, amp, tau in ((1, 1, .6), (2.76, .4, .3), (5.40, .15, .12)))
    return vel * np.minimum(1, t / 0.002) * x


def hoot(f0, f1, dur):
    """One owl 'hú': gliding sine with vibrato and a little breath."""
    t = t_(dur)
    f = f0 + (f1 - f0) * (t / dur) + 12 * np.sin(2 * np.pi * 6 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.15 * np.sin(2 * ph)
    breath = bandpass(RNG.standard_normal(t.size), 1000, 2000) * 0.12
    e = np.minimum(1, t / 0.025) * np.minimum(1, (dur - t) / 0.06)
    return (x + breath) * e


def owl_hoot():
    """The recurring 'hú-hú' cue."""
    out = np.zeros(int(0.5 * SR))
    for start, (a, b, d) in ((0.0, (620, 520, 0.16)), (0.22, (520, 440, 0.22))):
        h = hoot(a, b, d); s = int(start * SR); out[s:s + h.size] += h
    return st(norm(out, 0.9))


def sparkle(dur=0.3, grains=6):
    out = np.zeros((2, int(dur * SR) + 2000))
    for _ in range(grains):
        f = RNG.uniform(3000, 6000); s = int(RNG.uniform(0, dur) * SR)
        g = np.sin(2 * np.pi * f * t_(0.02)) * np.hanning(int(0.02 * SR))
        out[:, s:s + g.size] += st(g * 0.25, RNG.uniform(-.4, .4))
    return out


def place(dst, start, x, gain=1.0):
    s = int(start * SR)
    e = min(dst.shape[1], s + x.shape[1])
    if e > s:
        dst[:, s:e] += x[:, :e - s] * gain


def logo(short=False):
    """Sonic logo: three rising notes (the logo bars) + bell (orange dot) + sparkle (+ hú-hú)."""
    out = np.zeros((2, int((0.7 if short else 1.4) * SR)))
    for t0, f, v, pan in ((0, 523.25, .7, -.3), (.12, 698.46, .8, 0), (.24, 880.0, .9, .3)):
        place(out, t0, st(marimba(f, .7, v), pan))
    place(out, .40, st(bell(1046.5, .9, .8)))
    place(out, .40, sparkle())
    if not short:
        place(out, .55, owl_hoot(), .8)
        pad = np.sin(2 * np.pi * 174.61 * t_(.6)) * np.hanning(int(.6 * SR)) * .25
        place(out, 0, st(pad))
    return norm(out, 1.0)


# ------------------------------------------------------------ SFX
def pop():
    x = sweep(1200, 400, .06) * env(int(.06 * SR), .002, .025)
    click = bandpass(RNG.standard_normal(int(.003 * SR)), 2000, 12000) * .4
    x[:click.size] += click
    return st(norm(x))


def whoosh(dur=0.35):
    n = int(dur * SR)
    noise = RNG.standard_normal(n)
    out = np.zeros(n)
    # sweep a band through the noise in short overlapping windows
    hop = 1024
    for i in range(0, n - hop, hop // 2):
        p = i / n
        c = 400 + 2600 * np.sin(np.pi * min(1, p / 0.6) / 2) if p < .6 else 3000 - 2200 * (p - .6) / .4
        seg = bandpass(noise[i:i + hop] * np.hanning(hop), c / 1.4, c * 1.4)
        out[i:i + hop] += seg
    e = np.sin(np.pi * np.clip(np.arange(n) / n / 1.2, 0, 1)) ** 2
    x = norm(out * e)
    pan = np.linspace(-.7, .7, n)
    a = (pan + 1) * np.pi / 4
    return np.vstack([x * np.cos(a), x * np.sin(a)]) * np.sqrt(2) * .7


def click():
    x = np.zeros(int(.03 * SR))
    b = bandpass(RNG.standard_normal(int(.0015 * SR)), 3000, 14000)
    x[:b.size] += b
    x += np.sin(2 * np.pi * 2200 * t_(.03)) * np.exp(-t_(.03) / .004) * .6
    return st(norm(x))


def ding():
    out = st(norm(bell(880, 1.0, .8) + bell(1046.5, 1.0, .7)))
    place(out, 0, sparkle(), .6)
    return out


def bonk():
    x = sweep(180, 110, .12, "lin") * env(int(.12 * SR), .002, .05)
    tick = np.sin(2 * np.pi * 1600 * t_(.003)) * .6
    x[:tick.size] += tick
    return st(norm(x))


def typing(dur=1.0):
    out = np.zeros(int(dur * SR) + 2000)
    t = 0.0
    while t < dur:
        s = int(t * SR)
        k = bandpass(RNG.standard_normal(int(.004 * SR)), 2000, 5000) * 10 ** (RNG.uniform(-3, 3) / 20)
        out[s:s + k.size] += k
        th = np.sin(2 * np.pi * 120 * t_(.008)) * np.exp(-t_(.008) / .003) * .3
        out[s:s + th.size] += th
        t += RNG.uniform(.07, .14)
    return st(norm(out))


def riser(dur=1.2):
    n = int(dur * SR)
    noise = RNG.standard_normal(n)
    out = np.zeros(n)
    hop = 2048
    for i in range(0, n - hop, hop // 2):
        lo = 300 + 5000 * (i / n) ** 2
        out[i:i + hop] += bandpass(noise[i:i + hop] * np.hanning(hop), lo, 14000)
    x = norm(out) * .6 + sweep(200, 800, dur) * .3
    return st(x * np.linspace(0, 1, n) ** 2)


def stamp():
    """'ĐẠT' rubber stamp: thud + slap."""
    x = sweep(140, 60, .15) * env(int(.15 * SR), .001, .05)
    slap = bandpass(RNG.standard_normal(int(.04 * SR)), 800, 6000) * env(int(.04 * SR), .001, .01)
    x[:slap.size] += slap * .8
    return st(norm(x))


def scratch():
    """Short 'record scratch' for the comic stop."""
    n = int(.35 * SR)
    noise = RNG.standard_normal(n)
    out = np.zeros(n)
    hop = 512
    for i in range(0, n - hop, hop // 2):
        c = 1500 + 1200 * np.sin(2 * np.pi * 9 * i / SR)
        out[i:i + hop] += bandpass(noise[i:i + hop] * np.hanning(hop), c / 1.6, c * 1.6)
    return st(norm(out) * env(n, .005, .15))


def dun():
    """'Dun dun dun' dramatic hit: low brass-ish chord stab."""
    t = t_(.55)
    x = sum(np.sign(np.sin(2 * np.pi * f * t)) * .25 + np.sin(2 * np.pi * f * t) for f in (87.31, 103.83, 130.81))
    x = bandpass(x, 40, 2500) * env(t.size, .005, .18)
    return st(norm(x))


SFX = {"pop": pop, "whoosh": whoosh, "click": click, "ding": ding, "bonk": bonk, "typing": typing, "riser": riser,
       "stamp": stamp, "scratch": scratch, "dun": dun, "hoot": owl_hoot, "logo": logo, "logo-short": lambda: logo(True)}
# peak level of each SFX relative to the voice peak, dB
LEVEL = {"pop": -8, "whoosh": -14, "click": -12, "ding": -9, "bonk": -8, "typing": -18, "riser": -16, "stamp": -9,
         "scratch": -10, "dun": -6, "hoot": -7, "logo": -4, "logo-short": -12}


# ------------------------------------------------------------ music bed
BPM = 100
BEAT = 60 / BPM


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def music(seconds, stops=()):
    """Brand bed: F major, Fmaj7–Dm7–Bbmaj7–C7sus4, marimba arpeggio (logo timbre), sub bass, kick/clap/shaker, swung 16ths.
    stops = [(t_stop, t_resume)]: tape-stop the bed at t_stop, silent until t_resume."""
    n = int((seconds + 1) * SR)
    mix = np.zeros((2, n))
    chords = [[53, 57, 60, 64], [50, 53, 57, 60], [46, 50, 53, 57], [48, 53, 55, 58]]
    roots = [29, 26, 34, 36]
    bar = 4 * BEAT
    swing = lambda k: (k // 2) * BEAT / 2 + (k % 2) * BEAT / 2 * 0.58 * 2 / 2 + (k % 2) * BEAT / 4 * 0.16
    pattern = [0, 1, 2, 3, 2, 1, 0, 2]
    for b in range(int(seconds / bar) + 2):
        c, r = chords[b % 4], roots[b % 4]
        t0 = b * bar
        for k in range(8):  # 8th-note arpeggio, slight swing
            tt = t0 + k * BEAT / 2 + (BEAT / 2 * 0.08 if k % 2 else 0)
            note = c[pattern[k]] + 12
            place(mix, tt, st(marimba(midi(note), .5, .28 if k % 2 else .36), -.25 if k % 2 else .25))
        for k in range(4):
            tb = t0 + k * BEAT
            if k in (0, 2):
                kick = sweep(110, 45, .3) * env(int(.3 * SR), .002, .09)
                place(mix, tb, st(kick * .9))
            if k == 3:
                place(mix, tb + BEAT * 0.75, st(sweep(110, 45, .2) * env(int(.2 * SR), .002, .05) * .4))
            if k in (1, 3):
                clap = np.zeros(int(.09 * SR))
                for j in range(3):
                    burst = bandpass(RNG.standard_normal(int(.06 * SR)), 900, 3000) * env(int(.06 * SR), .001, .02)
                    s = int(j * .008 * SR); clap[s:s + burst.size] += burst
                place(mix, tb, st(norm(clap) * .35))
            # sub bass bouncing an octave on 8ths
            for j, oct_ in ((0, 0), (1, 12)):
                bt = tb + j * BEAT / 2
                bass = np.sin(2 * np.pi * midi(r + 12 + oct_) * t_(BEAT / 2)) * env(int(BEAT / 2 * SR), .005, .18)
                place(mix, bt, st(bass * .45))
            for j in range(4):  # 16th shaker
                sh = bandpass(RNG.standard_normal(int(.03 * SR)), 6000, 16000) * env(int(.03 * SR), .002, .012)
                place(mix, tb + j * BEAT / 4 + (BEAT / 4 * .16 if j % 2 else 0), st(sh * (.10 if j % 2 else .07), .3))
        # a soft chord pad so the harmony is audible under speech gaps
        pad = sum(np.sin(2 * np.pi * midi(x) * t_(bar)) for x in c) * np.hanning(int(bar * SR)) * .05
        place(mix, t0, st(pad))
    mix = mix[:, :int(seconds * SR)]
    for t_stop, t_res in stops:  # tape stop: slow the playhead to zero over 0.4 s, then silence
        s, r = int(t_stop * SR), int(t_res * SR)
        L = int(.4 * SR)
        if s + L < mix.shape[1]:
            rate = np.linspace(1, 0, L)
            idx = s + np.cumsum(rate).astype(int)
            mix[:, s:s + L] = mix[:, np.minimum(idx, mix.shape[1] - 1)] * np.linspace(1, .3, L)
        mix[:, s + L:r] = 0
        ramp = min(int(.03 * SR), mix.shape[1] - r)
        if ramp > 0:
            mix[:, r:r + ramp] *= np.linspace(0, 1, ramp)
    fade = int(1.0 * SR)
    mix[:, -fade:] *= np.linspace(1, 0, fade)
    return norm(mix, .9)


def save(x, path):
    x = np.clip(x, -1, 1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x.T * 32767).astype("<i2").tobytes())


def load(path):
    with wave.open(str(path)) as w:
        ch, sr = w.getnchannels(), w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float32) / 32768
    x = x.reshape(-1, ch).T
    return x if ch == 2 else np.vstack([x[0], x[0]])


if __name__ == "__main__":
    out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
    for name, fn in SFX.items():
        save(fn() * .9, out / f"{name}.wav")
    save(music(20, stops=[(6, 7)]), out / "music.wav")
    print("ok", out)
