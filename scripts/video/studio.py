"""Góc Nghiên Cứu Reels studio (v3, "Cú trực đêm"): script JSON -> real screen captures -> per-line owl voice ->
rigged owl that lip-syncs to the voice + speech-bubble captions + stickers + SFX + brand music -> 1080x1920 mp4 + cover.

Usage:
  python scripts/video/studio.py scripts/video/reels/reel-1-pls-sem.json            # capture, voice, render
  python scripts/video/studio.py <reel.json> capture|voice|render [--debug]        # one stage (--debug draws layout boxes)
  python scripts/video/studio.py <reel.json> frames 0.5 3 10                       # stills at those seconds, for checking
Build files go to $STUDIO_DIR/build/<id>/ (default C:/Users/Admin/.antigravity/video-studio); the mp4 and cover are
copied to docs/launch/reels/. Guide: docs/launch/reels/STUDIO.md.
"""
import asyncio, json, math, os, random, re, shutil, subprocess, sys, time, unicodedata, wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import scene  # noqa: E402
import sound  # noqa: E402
from mascot import Owl, OwlState  # noqa: E402

REPO = HERE.parents[1]
STUDIO = Path(os.environ.get("STUDIO_DIR", r"C:\Users\Admin\.antigravity\video-studio"))
sys.path.insert(0, str(STUDIO / "pylib"))  # edge-tts lives here, outside the site repo
FONTS = STUDIO / "assets" / "fonts"
PARTS = REPO / "docs" / "launch" / "brand" / "mascot" / "parts"
OUT = REPO / "docs" / "launch" / "reels"
try:
    import imageio_ffmpeg
    FF = imageio_ffmpeg.get_ffmpeg_exe()
except ImportError:
    FF = shutil.which("ffmpeg") or "ffmpeg"

W, H, FPS = 1080, 1920, 30
SR = 48000
GREEN, GREEN_DARK, MINT, ORANGE, INK, CREAM, RED = "#0b6b53", "#08513f", "#e1f1ea", "#f4a85e", "#14211c", "#fdf0e3", "#d64545"
TARGET_MB = 9.2
STOPWATCH = 1.8  # the real run time is shown fast-forwarded over this many seconds, labelled "tua nhanh"
DEBUG = "--debug" in sys.argv

# Layout (px). App UI covers ~250 top, ~120 right rail and the bottom ~35%: faces and text stay in x 60–960, y 270–1260.
CHIP = (110, 282, 960, 372)           # topic chip / keyword sticker slot
CARD = (60, 392, 1020, 1000)          # screen card
INNER = (110, 420, 970, 960)          # where the camera puts the subject
OWL_DEMO = (225, 1445, 440)           # owl centre x, feet y, size
BUBBLE_DEMO = (450, 1030, 965, 1250)  # speech bubble box, tail to the owl's beak
OWL_STAGE = (300, 1430, 520)
BUBBLE_STAGE = (540, 860, 1010, 1180)
OWL_END = (540, 1095, 520)
BROWSER = (40, 262, 1040, 1212)       # browser window: url bar 262-332, real footage 332-1212 (1000x880)
URLBAR_H = 70
OWL_CLIP = (215, 1585, 420)
BUBBLE_CLIP = (420, 1250, 1010, 1470)
OWL_DESK = (790, 1540, 600)
BUBBLE_DESK = (250, 660, 1010, 900)
VOICE_FX = ("aresample=48000,asetrate=50880,aresample=48000,atempo=0.9434,highpass=f=90,"
            "equalizer=f=300:t=q:w=1.2:g=-3,equalizer=f=3200:t=q:w=1:g=3,highshelf=f=7000:g=3,"
            "aexciter=amount=1.5:drive=6:freq=5000:ceil=12000,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=2,deesser=i=0.3")
# owl expression presets: eyes, brows, wings, look
MOODS = {
    "idle": dict(eyes="open", brows="", wing_l=0, wing_r=0, look=(4, 2)),
    "point": dict(eyes="open", brows="", wing_l=0, wing_r=75, look=(10, -10)),
    "wow": dict(eyes="wide", brows="up", wing_l=-120, wing_r=120, look=(0, 0)),
    "panic": dict(eyes="wide", brows="sad", wing_l=-150, wing_r=150, look=(0, 0)),
    "tired": dict(eyes="half", brows="sad", wing_l=0, wing_r=0, look=(0, 8)),
    "smug": dict(eyes="half", brows="frown", wing_l=0, wing_r=40, look=(-8, 0)),
    "happy": dict(eyes="open", brows="up", wing_l=-30, wing_r=110, look=(0, 0)),
}


def font(weight, size):
    return ImageFont.truetype(str(FONTS / f"BeVietnamPro-{weight}.ttf"), size)


def ff(*args, capture=False):
    return subprocess.run([FF, "-hide_banner", "-v", "info" if capture else "error", "-y", *args], check=True,
                          capture_output=capture, text=capture, encoding="utf8" if capture else None)


def ease_out_quint(x):
    x = min(1, max(0, x)); return 1 - (1 - x) ** 5


def ease_out_back(x, s=1.7):
    x = min(1, max(0, x)); return 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2


# ---------------------------------------------------------------- capture
FREEZE_JS = """() => {
  for (const e of document.querySelectorAll('body *')) {
    const p = getComputedStyle(e).position;
    if (p === 'sticky') e.style.position = 'static';
    if (p === 'fixed') e.style.display = 'none';
  }
}"""
BOX_JS = "e => { const r = e.getBoundingClientRect(); return [r.x, r.y + scrollY, r.width, r.height]; }"


def capture(spec, build):
    """Drive the live site in Chrome; save full-width screenshots, the boxes the script points at and any texts it reads."""
    from playwright.sync_api import sync_playwright
    cap = spec["capture"]
    vw, vh = cap.get("viewport", [432, 768])
    scale = cap.get("scale", W / vw)
    shots = build / "shots"
    shots.mkdir(parents=True, exist_ok=True)
    meta = {"scale": scale, "shots": {}, "texts": {}}
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": vw, "height": vh}, device_scale_factor=scale, color_scheme="light", locale="vi-VN")
        for step in cap["steps"]:
            kind, arg = next(iter(step.items()))
            if kind == "goto":
                page.goto(arg, wait_until="networkidle")
            elif kind == "click":
                page.locator(arg).first.click()
            elif kind == "select":
                page.select_option(arg[0], label=arg[1])
            elif kind == "fill":
                page.locator(arg[0]).first.fill(arg[1])
            elif kind == "press":
                page.locator(arg[0]).first.press(arg[1])
            elif kind == "eval":
                page.evaluate(arg)
            elif kind == "read":
                meta["texts"][arg["name"]] = page.evaluate(arg["js"])
                print(f"  read {arg['name']} = {meta['texts'][arg['name']]!r}")
            elif kind == "wait":
                time.sleep(arg)
            elif kind == "wait_for":
                page.wait_for_function(arg, timeout=120000)
            elif kind == "snap":
                time.sleep(0.4)
                page.evaluate(FREEZE_JS)
                page.mouse.move(0, 0)
                height = page.evaluate("document.documentElement.scrollHeight")
                y0 = 0
                if arg.get("from"):
                    y0 = max(0, page.locator(arg["from"]).first.evaluate(BOX_JS)[1] - arg.get("pad", 40))
                y1 = height
                if arg.get("until"):
                    b = page.locator(arg["until"]).first.evaluate(BOX_JS)
                    y1 = min(height, b[1] + b[3] + arg.get("pad", 40))
                path = shots / f"{arg['name']}.png"
                page.screenshot(path=str(path), full_page=True, clip={"x": 0, "y": y0, "width": vw, "height": y1 - y0})
                boxes = {}
                for name, sel in arg.get("boxes", {}).items():
                    x, y, bw, bh = page.locator(sel).first.evaluate(BOX_JS)
                    boxes[name] = [x * scale, (y - y0) * scale, bw * scale, bh * scale]
                meta["shots"][arg["name"]] = {"boxes": boxes}
                print(f"  snap {arg['name']}: {Image.open(path).size}")
            else:
                raise ValueError(f"unknown capture step {kind}")
        browser.close()
    (build / "shots.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf8")


# ---------------------------------------------------------------- record (frame-by-frame screen recording)
VIEW_JS = "e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }"


def record(spec, build):
    """Film the live site frame by frame: our own eased scrolling, one sharp screenshot (x2.5) per frame,
    real-time shots while the page computes. Taps and highlights are stored per frame and drawn by the renderer."""
    from playwright.sync_api import sync_playwright
    cfg = spec["record"]
    vw, vh = cfg.get("viewport", [400, 352])
    scale = cfg.get("scale", 2.5)
    root = build / "rec"
    shutil.rmtree(root, ignore_errors=True)
    root.mkdir(parents=True)
    data = {"scale": scale, "clips": {}, "texts": {}}
    st = {"name": None, "clip": {"frames": [], "hl": [], "taps": []}, "hl": None, "n": 0}
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": vw, "height": vh}, device_scale_factor=scale, color_scheme="light", locale="vi-VN")

        def rect():
            if not st["hl"]:
                return None
            r = page.locator(st["hl"][0]).first.evaluate(VIEW_JS)
            return [v * scale for v in r] + [st["hl"][1]] if r else None

        def shot():
            path = root / f"{st['n']:05d}.jpg"
            st["n"] += 1
            page.screenshot(path=str(path), type="jpeg", quality=92)
            return str(path)

        def add(path, count=1):
            r = rect()
            for _ in range(count):
                st["clip"]["frames"].append(path)
                st["clip"]["hl"].append(r)

        def last():
            if not st["clip"]["frames"]:
                add(shot())
            return st["clip"]["frames"][-1]

        def scroll_to(sel, dur, block):
            y0 = page.evaluate("scrollY")
            r = page.locator(sel).first.evaluate(VIEW_JS)
            target = y0 + r[1] - (vh / 2 - r[3] / 2 if block == "center" else 24)
            target = max(0, min(target, page.evaluate("document.documentElement.scrollHeight") - vh))
            n = max(1, int(dur * FPS))
            for i in range(1, n + 1):
                x = i / n
                e = 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2
                page.evaluate(f"window.scrollTo(0, {y0 + (target - y0) * e})")
                add(shot())

        def live(until_js=None, seconds=None, limit=25):
            t0 = time.time()
            shots = []
            while True:
                shots.append((time.time() - t0, shot(), rect()))
                el = time.time() - t0
                if seconds is not None and el >= seconds:
                    break
                if until_js and page.evaluate(until_js):
                    shots.append((time.time() - t0, shot(), rect()))
                    break
                if el > limit:
                    break
            span = shots[-1][0]
            c = st["clip"]
            start = len(c["frames"])
            for k in range(max(1, int(span * FPS))):
                tt = k / FPS
                j = max(i for i in range(len(shots)) if shots[i][0] <= tt)
                c["frames"].append(shots[j][1])
                c["hl"].append(shots[j][2])
            c["frames"].append(shots[-1][1])
            c["hl"].append(shots[-1][2])
            return start, len(c["frames"]) - 1, span

        def close_clip():
            if st["name"]:
                data["clips"][st["name"]] = st["clip"]

        for step in cfg["steps"]:
            kind, arg = next(iter(step.items()))
            if kind == "goto":
                page.goto(arg, wait_until="networkidle")
                page.add_style_tag(content="::-webkit-scrollbar{display:none} html{scroll-behavior:auto!important}")
                page.evaluate(FREEZE_JS)
            elif kind == "clip":
                close_clip()
                st["name"], st["clip"] = arg, {"frames": [], "hl": [], "taps": []}
            elif kind == "hold":
                add(last(), max(1, int(arg * FPS)))
            elif kind == "scroll":
                scroll_to(arg["to"], arg.get("dur", 0.8), arg.get("block", "center"))
            elif kind == "hl":
                st["hl"] = (arg, None) if isinstance(arg, str) else (arg[0], arg[1])
                add(shot())
            elif kind == "unhl":
                st["hl"] = None
            elif kind == "tap":
                sel = arg if isinstance(arg, str) else arg["sel"]
                r = page.locator(sel).first.evaluate(VIEW_JS)
                last()
                st["clip"]["taps"].append([len(st["clip"]["frames"]) - 1, [v * scale for v in r]])
                if isinstance(arg, str) or arg.get("click", True):
                    page.locator(sel).first.click()
            elif kind == "select":
                page.select_option(arg[0], label=arg[1])
                add(shot())
            elif kind == "hscroll":  # slide the nearest horizontally scrollable box (wide tables on a phone)
                info = page.locator(arg["sel"]).first.evaluate("""e => { let c = e; while (c && !(c.scrollWidth > c.clientWidth + 4 && getComputedStyle(c).overflowX !== 'visible')) c = c.parentElement;
                    if (!c) return null; c.dataset.hs = '1'; return [c.scrollLeft, c.scrollWidth - c.clientWidth]; }""")
                if info:
                    x0, mx = info
                    target = arg.get("x", 1.0) * mx
                    n = max(1, int(arg.get("dur", 0.6) * FPS))
                    for i in range(1, n + 1):
                        x = i / n
                        e = 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2
                        page.evaluate(f"document.querySelector('[data-hs=\"1\"]').scrollLeft = {x0 + (target - x0) * e}")
                        add(shot())
                    page.evaluate("document.querySelector('[data-hs=\"1\"]').removeAttribute('data-hs')")
            elif kind == "type":
                loc = page.locator(arg["sel"]).first
                if arg.get("clear", True):
                    loc.fill("")
                loc.focus()
                text, per = arg["text"], arg.get("per_frame", 2)
                for i in range(0, len(text), per):
                    page.keyboard.insert_text(text[i:i + per])
                    add(shot())
                page.evaluate("document.activeElement && document.activeElement.blur()")
            elif kind == "live":
                a, b, span = live(until_js=arg.get("until"), seconds=arg.get("seconds"), limit=arg.get("max", 25))
                st["clip"]["live"] = [a, b, round(span, 2)]
                print(f"  live {st['name']}: {span:.1f}s real")
            elif kind == "read":
                data["texts"][arg["name"]] = page.evaluate(arg["js"])
                print(f"  read {arg['name']} = {data['texts'][arg['name']]!r}")
            elif kind == "eval":
                page.evaluate(arg)
            else:
                raise ValueError(f"unknown record step {kind}")
        close_clip()
        browser.close()
    for k, c in data["clips"].items():
        print(f"  clip {k}: {len(c['frames'])} frames ({len(c['frames']) / FPS:.1f}s), {len(c['taps'])} taps")
    (build / "rec.json").write_text(json.dumps(data, ensure_ascii=False), encoding="utf8")


# ---------------------------------------------------------------- voice
TOKEN = re.compile(r"\*?\{([^|}]+)\|([^}]+)\}\*?[.,!?…:;]*|\S+")


def tokens(text):
    """(display, spoken, keyword) per word. {SmartPLS|smát pi eo ét} shows one thing and says another; *word* is a keyword."""
    out = []
    for m in TOKEN.finditer(text):
        raw = m.group(0)
        key = raw.startswith("*")
        if m.group(1):
            punct = re.search(r"[.,!?…:;]*$", raw).group(0)
            out.append((m.group(1) + punct, m.group(2) + punct, key))
        else:
            out.append((raw.replace("*", ""), raw.replace("*", ""), key or raw.endswith("*") or "*" in raw))
    return out


def letters(s):
    s = unicodedata.normalize("NFC", s.lower())
    return "".join(ch for ch in s if ch.isalnum())


async def _speak(text, voice, rate, pitch, mp3):
    import edge_tts
    comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary="WordBoundary")
    events = []
    with open(mp3, "wb") as f:
        async for ch in comm.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                events.append([ch["offset"] / 1e7, (ch["offset"] + ch["duration"]) / 1e7, ch["text"]])
    return events


def speak(text, voice, rate, pitch, mp3):
    time.sleep(1.0)  # the free endpoint throttles bursts of requests
    for attempt in range(8):
        try:
            events = asyncio.run(_speak(text, voice, rate, pitch, mp3))
            if events:
                return events
        except Exception as e:  # the free endpoint sometimes answers with no audio; wait and retry
            print(f"  tts retry {attempt + 1}: {type(e).__name__} for {text[:40]!r}")
        time.sleep(6 * (attempt + 1))
    sys.exit(f"edge-tts gave no audio after 8 tries for {text!r}")


def align(words, events):
    """Give each display word start/end times from the spoken boundary events (matched by letters)."""
    full, spans = "", []
    for w in words:
        a = len(full); full += letters(w["spoken"]); spans.append((a, len(full)))
    ev, cur = [], 0
    for st, en, txt in events:
        lt = letters(txt)
        if not lt:
            continue
        k = full.find(lt, cur)
        k = cur if k < 0 else k
        ev.append((k, k + len(lt), st, en)); cur = k + len(lt)

    def at(pos, end=False):
        for a, b, st, en in ev:
            if a <= pos < b or (end and a < pos <= b):
                return st + (en - st) * (pos - a) / max(1, b - a)
        best = min(ev, key=lambda e: abs(e[0] - pos))
        return best[3] if end else best[2]
    for w, (a, b) in zip(words, spans):
        w["start"], w["end"] = at(a), at(b, end=True)


def load_mono(path):
    with wave.open(str(path)) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float32) / 32768


def save_mono(x, path):
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())


def elapsed_seconds(build):
    src = build / ("rec.json" if (build / "rec.json").exists() else "shots.json")
    meta = json.loads(src.read_text(encoding="utf8"))
    raw = meta.get("texts", {}).get("elapsed")
    return float(raw.replace(",", ".")) if raw else 2.5


def voice(spec, build):
    """Speak every line on its own (own rate/pitch), run the owl voice chain, trim, and lay the lines on one timeline."""
    clips = build / "lines"
    clips.mkdir(exist_ok=True)
    vname = spec.get("voice", "vi-VN-HoaiMyNeural")
    rng = random.Random(7)
    t = 0.0
    words, lines_out, beats_out = [], [], []
    track = np.zeros(int(120 * SR), dtype=np.float32)
    for bi, beat in enumerate(spec["beats"]):
        if bi:
            t += beat.get("gap", round(rng.uniform(0.25, 0.38), 2))
        if beat.get("stopwatch") and not beat.get("clip"):
            beat["pre"] = STOPWATCH + 0.55
        bstart = t
        t += beat.get("pre", 0)
        for li, line in enumerate(beat.get("lines", [])):
            if li:
                t += line.get("gap", round(rng.uniform(0.12, 0.2), 2))
            toks = tokens(line["say"])
            lw = [{"beat": bi, "line": len(lines_out), "text": d, "spoken": s, "key": k} for d, s, k in toks]
            spoken = " ".join(w["spoken"] for w in lw)
            mp3 = clips / f"{bi:02d}-{li}.mp3"
            events = speak(spoken, vname, line.get("rate", spec.get("rate", "+10%")), line.get("pitch", spec.get("pitch", "+20Hz")), mp3)
            wav = clips / f"{bi:02d}-{li}.wav"
            ff("-i", str(mp3), "-af", VOICE_FX, "-ac", "1", "-ar", str(SR), str(wav))
            align(lw, events)
            x = load_mono(wav)
            a = max(0.0, lw[0]["start"] - 0.06)
            b = min(len(x) / SR, lw[-1]["end"] + 0.15)
            seg = x[int(a * SR):int(b * SR)]
            seg[:int(.01 * SR)] *= np.linspace(0, 1, int(.01 * SR))
            seg[-int(.03 * SR):] *= np.linspace(1, 0, int(.03 * SR))
            s0 = int(t * SR)
            track[s0:s0 + seg.size] += seg
            for w in lw:
                w["start"] = round(w["start"] - a + t, 3); w["end"] = round(w["end"] - a + t, 3)
            lines_out.append({"beat": bi, "start": round(t, 3), "end": round(t + seg.size / SR, 3)})
            words += lw
            t += seg.size / SR
        dur = beat.get("dur", 0)
        if dur == "auto":  # a wordless clip beat lasts as long as its clip, fast-forwarded to at most 2.4 s
            clip = json.loads((build / "rec.json").read_text(encoding="utf8"))["clips"][beat["clip"]]
            dur = max(1.2, min(2.4, len(clip["frames"]) / FPS))
        t += dur if not beat.get("lines") else beat.get("hold", 0)
        beats_out.append({"start": round(bstart, 3)})
    end = t + (1.9 if spec["beats"][-1].get("logo") else 0.8)
    save_mono(track[:int(end * SR)], build / "voice.wav")
    (build / "timeline.json").write_text(json.dumps({"words": words, "lines": lines_out, "beats": beats_out, "voice_end": round(t, 3),
                                                     "duration": round(end, 2)}, ensure_ascii=False, indent=1), encoding="utf8")
    print(f"  voice {t:.1f}s, video {end:.1f}s, {len(words)} words in {len(lines_out)} lines")


# ---------------------------------------------------------------- drawing helpers
def rounded_mask(size, r):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], r, fill=255)
    return m


def bg_cream():
    bg = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(bg)
    for y in range(0, H, 60):
        for x in range((y // 60) % 2 * 30, W, 60):
            d.ellipse([x - 3, y - 3, x + 3, y + 3], fill="#f3dcc2")
    return bg


def bg_night():
    bg = Image.new("RGB", (W, H), "#0f1c26")
    d = ImageDraw.Draw(bg)
    r = random.Random(3)
    for _ in range(70):
        x, y = r.randrange(W), r.randrange(H)
        s = r.choice([2, 2, 3, 4])
        d.ellipse([x - s, y - s, x + s, y + s], fill=r.choice(["#2b4152", "#3c5568", "#f4e3c4"]))
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse([140, 520, 940, 1300], fill=110)
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    bg.paste(Image.new("RGB", (W, H), "#3a5a7a"), (0, 0), glow)
    return bg


def bg_green():
    bg = Image.new("RGB", (W, H), GREEN)
    d = ImageDraw.Draw(bg)
    for y in range(0, H, 60):
        for x in range((y // 60) % 2 * 30, W, 60):
            d.ellipse([x - 3, y - 3, x + 3, y + 3], fill="#137a60")
    return bg


def popup_window():
    """A generic (unbranded) 'trial expired' dialog for the night skit."""
    w, h = 820, 330
    im = Image.new("RGBA", (w + 40, h + 40), (0, 0, 0, 0))
    sh = Image.new("L", im.size, 0)
    ImageDraw.Draw(sh).rounded_rectangle([20, 30, w + 20, h + 30], 28, fill=140)
    im.putalpha(sh.filter(ImageFilter.GaussianBlur(12)))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([20, 20, w + 20, h + 20], 28, fill="#ffffff", outline=INK, width=5)
    d.rounded_rectangle([20, 20, w + 20, 92], 28, fill="#e9edf0")
    d.rectangle([22, 70, w + 18, 92], fill="#e9edf0")
    d.line([22, 92, w + 18, 92], fill=INK, width=4)
    for i, c in enumerate(["#ff5f57", "#febc2e", "#28c840"]):
        d.ellipse([50 + i * 36, 44, 72 + i * 36, 66], fill=c)
    d.text((w - 120, 38), "02:07", font=font("Bold", 34), fill="#5a6670")
    d.ellipse([60, 132, 160, 232], fill=RED)
    d.line([88, 160, 132, 204], fill="#fff", width=12); d.line([132, 160, 88, 204], fill="#fff", width=12)
    d.text((190, 128), "Bản dùng thử", font=font("ExtraBold", 52), fill=INK)
    d.text((190, 192), "đã hết hạn.", font=font("ExtraBold", 52), fill=INK)
    d.rounded_rectangle([w - 300, h - 70, w - 10, h], 20, fill="#e9edf0", outline="#b8c2c9", width=3)
    d.text((w - 270, h - 58), "Mua bản quyền", font=font("Bold", 34), fill="#5a6670")
    return im


def draw_check(d, x, y, s, fill):
    d.line([x, y + s * .5, x + s * .38, y + s * .85, x + s, y + s * .1], fill=fill, width=int(s * .2), joint="curve")


class Sticker:
    """Kinetic text sticker: pops in (0 -> 1.15 -> 1 over 8 frames), slightly rotated."""
    STYLES = {"orange": (ORANGE, INK), "red": (RED, "#ffffff"), "green": (GREEN, "#ffffff"), "white": ("#ffffff", INK), "ink": (INK, "#ffffff")}

    def __init__(self, text, style="orange", size=64, rot=-4, icon=None):
        f = font("ExtraBold", size)
        if style == "big":  # bare kinetic word: white, thick ink outline, drop shadow
            tw = f.getlength(text)
            im = Image.new("RGBA", (int(tw + 60), int(size * 1.6)), (0, 0, 0, 0))
            d = ImageDraw.Draw(im)
            d.text((34, 18), text, font=f, fill=(0, 0, 0, 90), stroke_width=12, stroke_fill=(0, 0, 0, 90))
            d.text((26, 8), text, font=f, fill="#ffffff", stroke_width=12, stroke_fill=INK)
            self.img = im.rotate(rot, resample=Image.BICUBIC, expand=True) if rot else im
            return
        bg, fg = self.STYLES[style]
        tw = f.getlength(text)
        pad = 28
        iw = int(size * 0.9) if icon else 0
        w, h = int(tw + 2 * pad + iw + (14 if icon else 0)), int(size * 1.5)
        im = Image.new("RGBA", (w + 16, h + 16), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.rounded_rectangle([8, 12, w + 8, h + 12], 22, fill=(0, 0, 0, 70))
        d.rounded_rectangle([4, 4, w + 4, h + 4], 22, fill=bg, outline=INK, width=5)
        x = 4 + pad
        if icon == "check":
            draw_check(d, x, 4 + (h - iw) / 2, iw, fg); x += iw + 14
        d.text((x, 4 + (h - size * 1.25) / 2), text, font=f, fill=fg)
        self.img = im.rotate(rot, resample=Image.BICUBIC, expand=True) if rot else im

    def frame(self, since):
        if since < 0:
            return None
        k = 0.0 if since <= 0 else (ease_out_back(since / (8 / FPS)) if since < 8 / FPS else 1.0)
        if k <= 0.02:
            return None
        if abs(k - 1) < 1e-3:
            return self.img
        w, h = max(1, int(self.img.width * k)), max(1, int(self.img.height * k))
        return self.img.resize((w, h), Image.BICUBIC)


def paste_center(frame, im, cx, cy):
    frame.paste(im, (int(cx - im.width / 2), int(cy - im.height / 2)), im)


# ---------------------------------------------------------------- captions in a speech bubble
def chunk_line(words, max_chars=34):
    """Split one spoken line into clause-sized chunks (never across . , ? !), at most ~2 bubble lines each."""
    chunks, cur = [], []
    for i, w in enumerate(words):
        cur.append(i)
        text = " ".join(words[j]["text"] for j in cur)
        last = i == len(words) - 1
        if last or re.search(r"[.,!?…:;]$", w["text"]) or len(text) + 1 + len(words[i + 1]["text"]) > max_chars:
            chunks.append(cur); cur = []
    # merge a dangling one-word chunk into the previous one when it fits
    merged = []
    for c in chunks:
        if merged and len(c) == 1 and len(" ".join(words[j]["text"] for j in merged[-1] + c)) <= max_chars + 4 \
                and not re.search(r"[.!?…]$", words[merged[-1][-1]]["text"]):
            merged[-1] += c
        else:
            merged.append(c)
    return merged


class Bubble:
    def __init__(self, words):
        self.words = words
        self.chunks = []  # (line, [word idx])
        by_line = {}
        for i, w in enumerate(words):
            by_line.setdefault(w["line"], []).append(i)
        for ln, idx in sorted(by_line.items()):
            sub = [words[i] for i in idx]
            for c in chunk_line(sub):
                self.chunks.append((ln, [idx[k] for k in c]))
        self.cache = {}

    def at(self, t):
        for ci, (ln, idx) in enumerate(self.chunks):
            st = self.words[idx[0]]["start"] - 0.08
            nxt = self.chunks[ci + 1] if ci + 1 < len(self.chunks) else None
            en = self.words[idx[-1]]["end"] + 0.45
            if nxt:
                en = min(max(en, self.words[idx[-1]]["end"] + 0.1), self.words[nxt[1][0]]["start"] - 0.08)
            if st <= t < en:
                said = sum(1 for i in idx if self.words[i]["start"] - 0.02 <= t)
                first_of_line = ci == 0 or self.chunks[ci - 1][0] != ln
                line_start = self.words[[i for i in range(len(self.words)) if self.words[i]["line"] == ln][0]]["start"] - 0.08
                return ci, said, t - (line_start if first_of_line or True else st)
        return None

    def render(self, ci, said, box, size, tail):
        key = (ci, said, box, size, tail)
        if key in self.cache:
            return self.cache[key]
        x0, y0, x1, y1 = box
        bw = x1 - x0
        f = font("ExtraBold", size)
        idx = self.chunks[ci][1]
        texts = [self.words[i]["text"] for i in idx]
        space = f.getlength(" ")
        lines, cur, cw = [], [], 0
        for k, t in enumerate(texts):
            wdt = f.getlength(t)
            if cur and cw + space + wdt > bw - 64:
                lines.append(cur); cur, cw = [], 0
            cw += (space if cur else 0) + wdt; cur.append(k)
        lines.append(cur)
        lh = int(size * 1.22)
        th = lh * len(lines)
        bh = th + 56
        im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        by0 = y0 + (y1 - y0 - bh) // 2 if tail != "up" else y0
        d.rounded_rectangle([x0 + 6, by0 + 10, x1 + 6, by0 + bh + 10], 40, fill=(0, 0, 0, 60))
        d.rounded_rectangle([x0, by0, x1, by0 + bh], 40, fill="#ffffff", outline=INK, width=6)
        if tail:  # (tip_x, tip_y)
            tx, ty = tail
            if tx < x0:
                base = [(x0 + 3, by0 + bh * .38), (x0 + 3, by0 + bh * .62)]
            elif ty > by0 + bh:
                base = [(tx - 40 if tx > x0 + 80 else x0 + 60, by0 + bh - 3), (tx + 40 if tx > x0 + 80 else x0 + 140, by0 + bh - 3)]
            else:
                base = [(tx - 40, by0 + 3), (tx + 40, by0 + 3)]
            d.polygon([base[0], (tx, ty), base[1]], fill="#ffffff")
            d.line([base[0], (tx, ty), base[1]], fill=INK, width=6, joint="curve")
        y = by0 + 28
        for line in lines:
            total = sum(f.getlength(texts[k]) for k in line) + space * (len(line) - 1)
            x = x0 + (bw - total) / 2
            for k in line:
                w = self.words[idx[k]]
                wdt = f.getlength(texts[k])
                if w["key"]:
                    d.rounded_rectangle([x - 8, y + 2, x + wdt + 8, y + lh - 4], 14, fill=ORANGE)
                d.text((x, y), texts[k], font=f, fill=INK if k < said or w["key"] else "#9aa5a0")
                x += wdt + space
            y += lh
        self.cache[key] = im
        return im


# ---------------------------------------------------------------- render
class Renderer:
    def __init__(self, spec, build):
        self.spec, self.build = spec, build
        self.rec = json.loads((build / "rec.json").read_text(encoding="utf8")) if (build / "rec.json").exists() else {"clips": {}, "texts": {}}
        meta = json.loads((build / "shots.json").read_text(encoding="utf8")) if (build / "shots.json").exists() else {"shots": {}, "texts": {}}
        self.boxes = {k: v["boxes"] for k, v in meta["shots"].items()}
        self.texts = {**meta.get("texts", {}), **self.rec.get("texts", {})}
        tl = json.loads((build / "timeline.json").read_text(encoding="utf8"))
        self.words, self.lines = tl["words"], tl["lines"]
        self.duration, self.voice_end = tl["duration"], tl["voice_end"]
        self.starts = [b["start"] for b in tl["beats"]] + [self.duration]
        self.bubble = Bubble(self.words)
        self.owl = Owl(PARTS)
        self.bgs = {"demo": bg_cream(), "night": bg_night(), "end": bg_green()}
        if any(b.get("layout") == "desk" for b in spec["beats"]):
            back, self.desk_front = scene.desk_scene(FONTS, tuple(spec.get("laptop", ("SmartPLS", "Hết hạn", "dùng thử"))))
            self.bgs["desk"] = back.convert("RGB")
        self.foot_cache = {}
        self.browser_mask = None
        self.popup = popup_window()
        self.card_size = (CARD[2] - CARD[0], CARD[3] - CARD[1])
        self.card_mask = rounded_mask(self.card_size, 34)
        self.shots = {}
        self.stickers = {}
        self.owl_state = None
        self.mouth_s, self.mouth_v, self.mouth_hold = 0.0, 0, 0
        r = random.Random(11)
        self.blinks, t = [], 1.2
        while t < self.duration:
            self.blinks.append(t)
            if r.random() < 0.2:
                self.blinks.append(t + 0.25)
            t += r.uniform(2.5, 5)
        self.onsets = [w["start"] for w in self.words]
        self.keys = [w["start"] for w in self.words if w["key"]]

    # ---- shots and camera
    def shot(self, name):
        if name not in self.shots:
            src = Image.open(self.build / "shots" / f"{name}.png").convert("RGB")
            img = Image.new("RGB", (src.width, src.height + 1200), "#ffffff")
            img.paste(src, (0, 0))
            self.shots[name] = img
        return self.shots[name]

    def box(self, shot, name):
        return self.boxes[shot][name]

    def cam_target(self, shot, k):
        iw, ih = INNER[2] - INNER[0], INNER[3] - INNER[1]
        if "box" in k:
            x, y, bw, bh = self.box(shot, k["box"])
            z = k.get("zoom") or max(1.0, min(2.4, 0.88 * iw / bw * W / self.card_size[0], 0.85 * ih / bh * W / self.card_size[0]))
            cx, cy = x + bw / 2, y + bh / 2 + k.get("dy", 0)
            visible = W / z
            if bw > visible * 0.92:
                cx = x - 16 + visible / 2
        else:
            z = k.get("zoom", 1.0)
            cx, cy = W / 2, k.get("y", 0) * self.spec["capture"].get("scale", 2.5) + 300
        if z <= 1.0001:
            cx = W / 2
        return [cx, cy, z]

    def camera(self, bi, bt, blen):
        beat = self.spec["beats"][bi]
        keys = beat.get("cam", [{"at": 0, "y": 0, "zoom": 1}])
        prev = None
        if bi and not beat.get("cut") and self.spec["beats"][bi - 1].get("shot") == beat.get("shot"):
            pb = bi - 1
            prev = self.camera(pb, self.starts[bi] - self.starts[pb], self.starts[bi] - self.starts[pb])
        cam = prev or self.cam_target(beat["shot"], keys[0])
        for k in keys if prev else keys[1:]:
            t0 = k.get("at", 0) * blen
            if bt < t0:
                break
            tgt = self.cam_target(beat["shot"], k)
            e = ease_out_quint((bt - t0) / (10 / FPS))
            cam = [cam[i] + (tgt[i] - cam[i]) * e for i in range(3)]
        for p in beat.get("punch", []):  # punch-in on a beat moment
            dt = bt - p * blen
            if 0 <= dt < 14 / FPS:
                k = ease_out_quint(dt / (4 / FPS)) if dt < 4 / FPS else 1 - ease_out_quint((dt - 4 / FPS) / (10 / FPS))
                cam = [cam[0], cam[1], cam[2] * (1 + 0.12 * k)]
        return cam

    def view(self, shot_name, cam):
        img = self.shot(shot_name)
        cw, ch = self.card_size
        cx, cy, z = cam
        s = cw * z / W
        vw, vh = cw / s, ch / s
        icx = (INNER[0] + INNER[2]) / 2 - CARD[0]
        icy = (INNER[1] + INNER[3]) / 2 - CARD[1]
        x0 = min(max(0, cx - icx / s), max(0, img.width - vw))
        y0 = min(max(0, cy - icy / s), max(0, img.height - vh))
        region = img.crop((int(x0), int(y0), int(x0 + vw), int(y0 + vh)))
        return region.resize(self.card_size, Image.BICUBIC), (x0, y0, s)

    def to_card(self, shot, name, x0, y0, s):
        x, y, bw, bh = self.box(shot, name)
        return ((x - x0) * s + CARD[0], (y - y0) * s + CARD[1], bw * s, bh * s)

    # ---- real footage in a browser window
    def footage(self, path):
        if path not in self.foot_cache:
            if len(self.foot_cache) > 40:
                self.foot_cache.clear()
            self.foot_cache[path] = Image.open(path).convert("RGB")
        return self.foot_cache[path].copy()

    def clip_speed(self, beat, blen):
        clip = self.rec["clips"][beat["clip"]]
        n = len(clip["frames"]) - int(beat.get("from", 0) * FPS)
        return beat.get("speed") or min(3.0, max(1.0, (n / FPS) / max(0.1, blen - 0.1)))

    def clip_view(self, frame, bi, beat, bt, blen):
        clip = self.rec["clips"][beat["clip"]]
        n = len(clip["frames"])
        speed = self.clip_speed(beat, blen)
        start = int(beat.get("from", 0) * FPS)
        fi = min(n - 1, start + int(bt * speed * FPS))
        src = self.footage(clip["frames"][fi])
        sw_, sh_ = src.size
        fw, fh = BROWSER[2] - BROWSER[0], BROWSER[3] - BROWSER[1] - URLBAR_H
        # camera on the footage: cam = [{"at": 0..1, "z": zoom, "x": 0..1, "y": 0..1}], default a slow push-in
        keys = beat.get("cam") or [{"at": 0, "z": 1.0}, {"at": 1, "z": 1.035}]
        cz, cxf, cyf = keys[0].get("z", 1), keys[0].get("x", .5), keys[0].get("y", .5)
        for k0, k1 in zip(keys, keys[1:]):
            if bt >= k0["at"] * blen:
                e = min(1.0, (bt - k0["at"] * blen) / max(1e-3, (k1["at"] - k0["at"]) * blen))
                e = e * e * (3 - 2 * e)
                cz = k0.get("z", 1) + (k1.get("z", 1) - k0.get("z", 1)) * e
                cxf = k0.get("x", .5) + (k1.get("x", .5) - k0.get("x", .5)) * e
                cyf = k0.get("y", .5) + (k1.get("y", .5) - k0.get("y", .5)) * e
        vw_, vh_ = sw_ / cz, sh_ / cz
        cx0 = min(max(0, cxf * sw_ - vw_ / 2), sw_ - vw_)
        cy0 = min(max(0, cyf * sh_ - vh_ / 2), sh_ - vh_)
        sc = fw / vw_
        foot = src.crop((int(cx0), int(cy0), int(cx0 + vw_), int(cy0 + vh_))).resize((fw, fh), Image.BICUBIC)
        tr = lambda r: [(r[0] - cx0) * sc, (r[1] - cy0) * sc, r[2] * sc, r[3] * sc]
        d = ImageDraw.Draw(foot, "RGBA")
        hl = clip["hl"][fi]
        if hl:
            hl = tr(hl[:4]) + hl[4:]
            x, y, w_, h_ = hl[:4]
            pad = 12 + 4 * math.sin(bt * 8)
            d.rounded_rectangle([x - pad, y - pad, x + w_ + pad, y + h_ + pad], 20, outline=ORANGE, width=10)
        for tf, r in clip["taps"]:
            dtf = (fi - tf) / FPS / speed
            if 0 <= dtf <= 0.6:
                r = tr(r)
                px, py = r[0] + r[2] / 2, r[1] + r[3] / 2
                rr = 26 + 90 * ease_out_quint(dtf / 0.6)
                a = int(255 * (1 - dtf / 0.6))
                d.ellipse([px - rr, py - rr, px + rr, py + rr], outline=(244, 168, 94, a), width=12)
                d.ellipse([px - 30, py - 30, px + 30, py + 30], fill=(244, 168, 94, min(230, a + 60)), outline=(20, 33, 28, a), width=4)
        prev = self.spec["beats"][bi - 1] if bi else None
        whip = prev is not None and prev.get("clip") is None and not beat.get("no_whip")
        ox = int((1 - ease_out_quint(bt / (7 / FPS))) * 1080) if whip and bt < 7 / FPS else 0
        x0, y0, x1, y1 = BROWSER
        fd = ImageDraw.Draw(frame, "RGBA")
        fd.rounded_rectangle([x0 + 10 + ox, y0 + 16, x1 + 10 + ox, y1 + 16], 40, fill=(80, 50, 20, 60))
        fd.rounded_rectangle([x0 - 6 + ox, y0 - 6, x1 + 6 + ox, y1 + 6], 42, fill=INK)
        fd.rounded_rectangle([x0 + ox, y0, x1 + ox, y0 + URLBAR_H + 30], 36, fill="#e9efec")
        for i, c in enumerate(["#ff5f57", "#febc2e", "#28c840"]):
            fd.ellipse([x0 + 28 + i * 34 + ox, y0 + 25, x0 + 48 + i * 34 + ox, y0 + 45], fill=c)
        fd.rounded_rectangle([x0 + 150 + ox, y0 + 12, x1 - 24 + ox, y0 + URLBAR_H - 12], 23, fill="#ffffff")
        f = font("SemiBold", 30)
        url = self.spec.get("page_url", "gocnghiencuu.com")
        fd.text((x0 + 178 + ox, y0 + 16), url, font=f, fill="#3d4a44")
        if self.browser_mask is None:
            m = Image.new("L", (fw, fh), 255)
            md = ImageDraw.Draw(m)
            md.rectangle([0, fh - 40, fw, fh], fill=0)
            md.rounded_rectangle([0, fh - 80, fw - 1, fh - 1], 36, fill=255)
            self.browser_mask = m
        frame.paste(foot, (x0 + ox, y0 + URLBAR_H), self.browser_mask)
        # label badge on the highlighted element
        if hl and hl[4]:
            x, y, w_, h_ = hl[:4]
            im = self.sticker(("hl", hl[4]), dict(text=hl[4], style="green", size=46, rot=-3, icon="check")).img
            cx_ = min(max(x0 + x + w_ - im.width / 2, x0 + im.width / 2 + 10), x1 - im.width / 2 - 10)
            cy_ = min(max(y0 + URLBAR_H + y - 10, y0 + URLBAR_H + im.height / 2 + 8), y1 - im.height / 2 - 8)
            paste_center(frame, im, cx_ + ox, cy_)
        # stopwatch over the real wait, fast-forwarded and labelled
        if beat.get("stopwatch") and clip.get("live"):
            a, b, span = clip["live"]
            real = float(str(self.texts.get("elapsed", span)).replace(",", "."))
            prog = min(1.0, max(0.0, (fi - a) / max(1, b - a)))
            label = f"{real * prog:.1f}".replace(".", ",") + " giây"
            im = Sticker(label, "orange" if prog >= 1 else "ink", 96, 0).img
            paste_center(frame, im, W / 2, y0 + URLBAR_H + 150)
            if prog < 1 and speed > 1.05:
                f2 = font("Bold", 40)
                txt = f"tua nhanh x{speed:.0f} >>"
                ImageDraw.Draw(frame).rounded_rectangle([W / 2 - f2.getlength(txt) / 2 - 20, y0 + URLBAR_H + 236, W / 2 + f2.getlength(txt) / 2 + 20, y0 + URLBAR_H + 296], 20, fill="#ffffff", outline=INK, width=4)
                ImageDraw.Draw(frame).text((W / 2 - f2.getlength(txt) / 2, y0 + URLBAR_H + 242), txt, font=f2, fill=INK)
        cx, feet, size = OWL_CLIP
        return cx, feet, size, BUBBLE_CLIP, 54

    def desk_zoom(self, beat, bt):
        """Camera on the desk scene: [[t, zoom], ...] eased over 8 frames, around beat['focus']."""
        keys = beat.get("zoom", [])
        if not keys:
            return None
        fx_, fy_ = beat.get("focus", [560, 1100])
        z = keys[0][1]
        for i, (t0, z0) in enumerate(keys):
            if bt >= t0:
                zp = keys[i - 1][1] if i else z0
                z = zp + (z0 - zp) * ease_out_quint((bt - t0) / (beat.get("zoom_ease", 8) / FPS))
        return (z, fx_, fy_) if z > 1.001 else None

    # ---- owl
    def owl_frame(self, t, beat, bt, env_v, size):
        mood = MOODS[beat.get("owl", "idle")]
        tgt = dict(mood)
        # mouth: smoothed voice level -> 4 visemes with hysteresis and a 2-frame hold
        self.mouth_s = max(env_v, 0.6 * self.mouth_s)
        o = min(1, max(0, (self.mouth_s - 0.10) / 0.5))
        want = int(round(o * 3))
        if self.mouth_hold > 0:
            self.mouth_hold -= 1
        elif abs(o * 3 - self.mouth_v) > 0.58:
            self.mouth_v, self.mouth_hold = want, 2
        talking = env_v > 0.04
        mouth = self.mouth_v if (talking or self.mouth_v) else ("smile" if beat.get("owl") in ("happy", "smug") else 0)
        eyes = tgt["eyes"]
        if eyes in ("open", "wide") and any(0 <= t - b < 0.1 for b in self.blinks):
            eyes = "half" if any(0 <= t - b < 0.033 or 0.066 <= t - b < 0.1 for b in self.blinks) else "closed"
        if beat.get("owl") == "happy" and not talking and self.mouth_v == 0:
            eyes = "happy"
        st = self.owl_state or dict(wing_l=0.0, wing_r=0.0, look=(0.0, 0.0))
        k = 0.35
        st = dict(wing_l=st["wing_l"] + (tgt["wing_l"] - st["wing_l"]) * k, wing_r=st["wing_r"] + (tgt["wing_r"] - st["wing_r"]) * k,
                  look=tuple(st["look"][i] + (tgt["look"][i] - st["look"][i]) * k for i in range(2)))
        self.owl_state = st
        # head sway, a dip on every word onset, emphasis squash on keywords, breathing
        rot = 2.5 * math.sin(2 * math.pi * 0.6 * t)
        dip = 0.0
        for on in self.onsets:
            d = t - on
            if 0 <= d < 5 / FPS:
                dip = 6 * (1 - d / (5 / FPS)); rot += (2 if int(on * 10) % 2 else -2) * (1 - d / (5 / FPS))
        sx = sy = 1.0
        for on in self.keys:
            f = (t - on) * FPS
            if 0 <= f < 4:
                sx, sy = 1.08, 0.92
            elif 4 <= f < 8:
                sx, sy = 0.95, 1.06
            elif 8 <= f < 12:
                e = (f - 8) / 4; sx, sy = 0.95 + 0.05 * e, 1.06 - 0.06 * e
        sy *= 1 + 0.015 * math.sin(2 * math.pi * t / 2.4)
        wing_r = st["wing_r"] + (8 * math.sin(t * 9) if talking and tgt["wing_r"] > 30 else 0)
        state = OwlState(mouth=mouth, eyes=eyes, brows=tgt["brows"], look=st["look"], wing_l=st["wing_l"], wing_r=wing_r,
                         head_rot=rot, head_dy=dip, sx=sx, sy=sy)
        im = self.owl.draw(state, size)
        # entrance on beats that ask for it: rise from below with overshoot
        if beat.get("enter") and bt < 13 / FPS:
            return im, (1 - ease_out_back(bt / (10 / FPS))) * 300
        return im, 0

    def fx(self, frame, beat, bt, cx, top, size):
        d = ImageDraw.Draw(frame, "RGBA")
        for e in beat.get("fx", []):
            dt = bt - e.get("at", 0)
            if dt < 0:
                continue
            if e["type"] == "sweat" and dt < 1.2:
                y = top + size * 0.25 + min(1, dt / 0.5) * 30
                x = cx + size * 0.42
                d.polygon([(x, y - 34), (x - 18, y), (x + 18, y)], fill="#bfe8ff")
                d.ellipse([x - 18, y - 16, x + 18, y + 20], fill="#bfe8ff", outline=INK, width=4)
            if e["type"] == "shock" and dt < 0.8 and int(dt * FPS / 2) % 2 == 0:
                for ang in (-140, -90, -40):
                    a = math.radians(ang)
                    x0, y0 = cx + math.cos(a) * size * 0.48, top + size * 0.42 + math.sin(a) * size * 0.48
                    x1, y1 = cx + math.cos(a) * size * 0.66, top + size * 0.42 + math.sin(a) * size * 0.66
                    d.line([x0, y0, x1, y1], fill=INK if beat.get("layout") != "night" else "#ffffff", width=10)
            if e["type"] == "sparkle" and dt < 0.9:
                for j, (ox, oy) in enumerate(((0.45, 0.12), (0.62, 0.3), (-0.48, 0.2))):
                    p = (dt - j * 0.1) / 0.4
                    if 0 < p < 2:
                        r = 34 * (ease_out_back(min(1, p)) if p < 1 else max(0, 2 - p))
                        x, y = cx + ox * size, top + oy * size
                        pts = [(x, y - r), (x + r * .25, y - r * .25), (x + r, y), (x + r * .25, y + r * .25), (x, y + r), (x - r * .25, y + r * .25), (x - r, y), (x - r * .25, y - r * .25)]
                        d.polygon(pts, fill=ORANGE if j % 2 == 0 else "#ffffff", outline=INK)
            if e["type"] == "burst" and dt < 0.15:
                d.ellipse([cx - size, top - size * 0.2, cx + size, top + size * 1.6], fill=(244, 168, 94, int(120 * (1 - dt / 0.15))))

    # ---- stickers
    def sticker(self, key, spec_):
        if key not in self.stickers:
            self.stickers[key] = Sticker(spec_["text"], spec_.get("style", "orange"), spec_.get("size", 64), spec_.get("rot", -4), spec_.get("icon"))
        return self.stickers[key]

    def frame(self, t, env_v):
        spec = self.spec
        beats = spec["beats"]
        bi = max(i for i in range(len(beats)) if self.starts[i] <= t)
        beat = beats[bi]
        bt, blen = t - self.starts[bi], self.starts[bi + 1] - self.starts[bi]
        layout = beat.get("layout", "demo")
        frame = self.bgs.get(layout, self.bgs["demo"]).copy()
        bubble_box, tail_tip, bubble_size = None, None, 56
        zoom = None
        if layout == "demo" and "clip" in beat:
            cx, feet, size, bubble_box, bubble_size = self.clip_view(frame, bi, beat, bt, blen)
        elif layout == "desk":
            cx, feet, size = OWL_DESK
            bubble_box, bubble_size = BUBBLE_DESK, 60
            zoom = self.desk_zoom(beat, bt)
        elif layout == "demo":
            cam = self.camera(bi, bt, blen)
            view, (x0, y0, s) = self.view(beat["shot"], cam)
            # whip transition from a different shot or layout
            prev = beats[bi - 1] if bi else None
            whip = prev is not None and (prev.get("shot") != beat.get("shot") or prev.get("layout", "demo") != "demo") and not beat.get("no_whip")
            card = Image.new("RGB", self.card_size, "#ffffff")
            card.paste(view, (0, 0))
            cd = ImageDraw.Draw(card)
            for ring in beat.get("ring", []):
                if ring.get("from", 0) * blen <= bt <= ring.get("to", 1) * blen:
                    rx, ry, rw, rh = self.to_card(beat["shot"], ring["box"], x0, y0, s)
                    pad = 10 + 4 * math.sin(bt * 8)
                    cd.rounded_rectangle([rx - CARD[0] - pad, ry - CARD[1] - pad, rx - CARD[0] + rw + pad, ry - CARD[1] + rh + pad], 18, outline=ORANGE, width=9)
            for tap in beat.get("tap", []):
                dt = bt - tap["at"] * blen
                if 0 <= dt <= 0.6:
                    rx, ry, rw, rh = self.to_card(beat["shot"], tap["box"], x0, y0, s)
                    px, py = rx + rw / 2 - CARD[0], ry + rh / 2 - CARD[1]
                    r = 26 + 90 * ease_out_quint(dt / 0.6)
                    a = int(255 * (1 - dt / 0.6))
                    ov = Image.new("RGBA", card.size, (0, 0, 0, 0))
                    od = ImageDraw.Draw(ov)
                    od.ellipse([px - r, py - r, px + r, py + r], outline=(244, 168, 94, a), width=12)
                    od.ellipse([px - 28, py - 28, px + 28, py + 28], fill=(244, 168, 94, min(230, a + 60)), outline=(20, 33, 28, a), width=4)
                    card = Image.alpha_composite(card.convert("RGBA"), ov).convert("RGB")
            ox = 0
            if whip and bt < 7 / FPS:
                p = bt / (7 / FPS)
                ox = int((1 - ease_out_quint(p)) * 1000)
                blur = card.copy()
                for j in range(1, 5):
                    blur = Image.blend(blur, card.transform(card.size, Image.AFFINE, (1, 0, -j * 18 * (1 - p), 0, 1, 0)), 1 / (j + 1))
                card = blur
            sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            ImageDraw.Draw(sh).rounded_rectangle([CARD[0] + 8 + ox, CARD[1] + 14, CARD[2] + 8 + ox, CARD[3] + 14], 38, fill=(80, 50, 20, 60))
            frame.paste(sh, (0, 0), sh)
            ImageDraw.Draw(frame).rounded_rectangle([CARD[0] - 6 + ox, CARD[1] - 6, CARD[2] + 6 + ox, CARD[3] + 6], 40, fill=INK)
            frame.paste(card, (CARD[0] + ox, CARD[1]), self.card_mask)
            # badges pinned to boxes on the card
            for k_, bd in enumerate(beat.get("badges", [])):
                dt = bt - bd["at"] * blen
                if dt >= 0 and (bd.get("to") is None or bt <= bd["to"] * blen):
                    rx, ry, rw, rh = self.to_card(beat["shot"], bd["box"], x0, y0, s)
                    im = self.sticker(("badge", bi, k_), dict(text=bd["text"], style="green", size=44, rot=-3, icon="check")).frame(dt)
                    if im:
                        cx = min(max(rx + rw - im.width / 2 - 10, CARD[0] + im.width / 2 + 10), CARD[2] - im.width / 2 - 10)
                        cy = min(max(ry - 6, CARD[1] + im.height / 2 + 8), CARD[3] - im.height / 2 - 8)
                        paste_center(frame, im, cx, cy)
            # topic chip when no keyword sticker is up
            chip = spec.get("topic")
            if chip and not any(st_.get("pos", "chip") == "chip" and st_["at"] * blen <= bt for st_ in beat.get("stickers", [])):
                f = font("Bold", 36)
                d = ImageDraw.Draw(frame)
                tw = f.getlength(chip)
                d.rounded_rectangle([CHIP[0], CHIP[1] + 10, CHIP[0] + tw + 84, CHIP[3] - 10], 35, fill=GREEN)
                d.ellipse([CHIP[0] + 26, (CHIP[1] + CHIP[3]) / 2 - 9, CHIP[0] + 44, (CHIP[1] + CHIP[3]) / 2 + 9], fill=ORANGE)
                d.text((CHIP[0] + 58, CHIP[1] + 22), chip, font=f, fill="#ffffff")
            cx, feet, size = OWL_DEMO
            bubble_box, bubble_size = BUBBLE_DEMO, 54
        elif layout == "night":
            pop_y = 300 + (0 if bi or bt > 0.25 else int((1 - ease_out_back(bt / 0.25)) * 80))
            paste_center(frame, self.popup, W / 2, pop_y + self.popup.height / 2 - 40)
            cx, feet, size = OWL_STAGE
            bubble_box, bubble_size = BUBBLE_STAGE, 58
        else:  # end
            cx, feet, size = OWL_END
            d = ImageDraw.Draw(frame)
            url = spec.get("url", "gocnghiencuu.com")
            f = font("ExtraBold", 66)
            tw = f.getlength(url)
            d.rounded_rectangle([(W - tw) / 2 - 44, 1105, (W + tw) / 2 + 44, 1225], 60, fill="#ffffff", outline=INK, width=6)
            d.text(((W - tw) / 2, 1123), url, font=f, fill=GREEN)
            sub = spec.get("end_note", "Miễn phí · chạy ngay trên trình duyệt")
            fs = font("SemiBold", 40)
            d.text(((W - fs.getlength(sub)) / 2, 1245), sub, font=fs, fill=MINT)
            bubble_box, bubble_size = (110, 282, 970, 540), 68
        # owl (+ zoom pulses on stage beats)
        pulse = 1.0
        for p in beat.get("owl_punch", []):
            dt = bt - p
            if 0 <= dt < 0.3:
                pulse = max(pulse, 1 + 0.18 * (1 - dt / 0.3))
        osize = int(size * pulse)
        owl_im, dy = self.owl_frame(t, beat, bt, env_v, osize)
        top = feet - owl_im.height + dy
        frame.paste(owl_im, (int(cx - owl_im.width / 2), int(top)), owl_im)
        kk = osize / 700
        bottom = top + owl_im.height
        head_top = bottom - 700 * kk
        self.fx(frame, beat, bt, cx, head_top, osize)
        beak = (cx, bottom - 395 * kk)
        if layout == "desk":
            frame = frame.convert("RGBA")
            frame.alpha_composite(self.desk_front)
            frame.alpha_composite(scene.steam(t))
            if beat.get("alarm"):
                a = int(70 * (0.5 + 0.5 * math.sin(2 * math.pi * 2.2 * t)))
                frame.alpha_composite(Image.new("RGBA", (W, H), (214, 69, 69, a)))
            frame = frame.convert("RGB")
            if zoom:
                z, fx_, fy_ = zoom
                vw_, vh_ = W / z, H / z
                x0_ = min(max(0, fx_ - vw_ / 2), W - vw_)
                y0_ = min(max(0, fy_ - vh_ / 2), H - vh_)
                frame = frame.crop((int(x0_), int(y0_), int(x0_ + vw_), int(y0_ + vh_))).resize((W, H), Image.BICUBIC)
                beak = ((beak[0] - x0_) * z, (beak[1] - y0_) * z)
        # stickers
        for k_, st_ in enumerate(beat.get("stickers", [])):
            dt = bt - st_["at"] * blen
            if dt < 0 or (st_.get("to") is not None and bt > st_["to"] * blen):
                continue
            im = self.sticker(("st", bi, k_), st_).frame(dt)
            if not im:
                continue
            pos = st_.get("pos", "chip")
            if pos == "chip":
                frame.paste(im, (CHIP[0], int((CHIP[1] + CHIP[3]) / 2 - im.height / 2)), im)
            else:
                paste_center(frame, im, pos[0], pos[1])
        # stopwatch measured on the real site
        sw = beat.get("stopwatch")
        if sw and not beat.get("clip"):
            real = float(self.texts.get("elapsed", "2.5").replace(",", "."))
            p = min(1.0, max(0.0, (bt - 0.15) / STOPWATCH))
            done = p >= 1
            label = f"{real * p:.1f}".replace(".", ",") + " giây"
            im = Sticker(label, "orange" if done else "ink", 96, 0).img
            paste_center(frame, im, W / 2, (CARD[1] + CARD[3]) / 2 - 30)
            if not done:
                f = font("Bold", 36)
                ImageDraw.Draw(frame).text((W / 2 - f.getlength("tua nhanh >>") / 2, (CARD[1] + CARD[3]) / 2 + 60), "tua nhanh >>", font=f, fill=INK)
        # speech bubble with the words being said
        cap = self.bubble.at(t)
        if cap and bubble_box:
            ci, said, since = cap
            if layout == "demo":
                tail = (int(beak[0] + 60), int(beak[1]))
            elif layout == "night":
                tail = (int(beak[0] + 70), int(beak[1]))
            else:
                tail = (int(cx + 60), int(head_top + 10))
            im = self.bubble.render(ci, said, bubble_box, bubble_size, tail)
            k = ease_out_back(since / (6 / FPS)) if since < 6 / FPS else 1.0
            k *= 1 + 0.012 * env_v
            if abs(k - 1) > 0.004:
                w2, h2 = int(W * k), int(H * k)
                big = im.resize((w2, h2), Image.BILINEAR)
                ax, ay = tail
                im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
                im.alpha_composite(big, (int(ax - ax * k), int(ay - ay * k)) if (ax - ax * k) >= 0 and (ay - ay * k) >= 0 else (0, 0))
            frame.paste(im, (0, 0), im)
        # shake
        shake = beat.get("shake")
        if shake is not None and 0 <= bt - shake < 6 / FPS:
            a = 14 * (1 - (bt - shake) / (6 / FPS))
            r = random.Random(int(t * FPS))
            frame = frame.transform(frame.size, Image.AFFINE, (1, 0, r.uniform(-a, a), 0, 1, r.uniform(-a, a)), fillcolor=CREAM)
        if DEBUG:
            d = ImageDraw.Draw(frame)
            for b, c in ((CHIP, "blue"), (CARD, "red"), (INNER, "magenta"), (BUBBLE_DEMO, "purple")):
                d.rectangle(b, outline=c, width=3)
            d.rectangle([120, 270, 960, 1260], outline="#00aa00", width=3)
        return frame

    def envelope(self, n):
        x = load_mono(self.build / "voice.wav")
        hop = SR // FPS
        env = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) if i * hop < x.size else 0 for i in range(n)])
        return env / (np.percentile(env[env > 0], 95) + 1e-9)

    def render(self, out_master):
        n = int(self.duration * FPS)
        env = self.envelope(n)
        proc = subprocess.Popen([FF, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                                 "-c:v", "libx264", "-preset", "veryfast", "-crf", "12", "-pix_fmt", "yuv420p", str(out_master)], stdin=subprocess.PIPE)
        t0 = time.time()
        for i in range(n):
            proc.stdin.write(self.frame(i / FPS, env[i]).convert("RGB").tobytes())
            if i % 150 == 0:
                print(f"  frame {i}/{n} ({time.time() - t0:.0f}s)")
        proc.stdin.close(); proc.wait()

    # ---- audio
    def sfx_events(self):
        ev = []
        beats = self.spec["beats"]
        for bi, beat in enumerate(beats):
            b0, blen = self.starts[bi], self.starts[bi + 1] - self.starts[bi]
            for e in beat.get("sfx", []):
                at = e.get("at", 0)
                ev.append((b0 + (blen + at if at < 0 else at), e["name"], e.get("gain", 0)))
            for tap in beat.get("tap", []):
                ev.append((b0 + tap["at"] * blen, "click", 0))
            if beat.get("clip"):
                clip = self.rec["clips"][beat["clip"]]
                sp = self.clip_speed(beat, blen)
                st0 = int(beat.get("from", 0) * FPS)
                for tf, _ in clip["taps"]:
                    at = (tf - st0) / FPS / sp
                    if 0 <= at < blen:
                        ev.append((b0 + at, "click", 0))
                if beat.get("stopwatch") and clip.get("live"):
                    ev.append((b0 + (clip["live"][1] - st0) / FPS / sp, "ding", 0))
                if bi and not beats[bi - 1].get("clip") and not beat.get("no_whip"):
                    ev.append((b0 - 0.05, "whoosh", 0))
            for st_ in beat.get("stickers", []):
                ev.append((b0 + st_["at"] * blen, "pop", -4))
            for bd in beat.get("badges", []):
                ev.append((b0 + bd["at"] * blen, "stamp", 0))
            prev = beats[bi - 1] if bi else None
            if beat.get("layout", "demo") == "demo" and not beat.get("clip") and prev is not None and (prev.get("shot") != beat.get("shot") or prev.get("layout", "demo") != "demo") and not beat.get("no_whip"):
                ev.append((b0 - 0.05, "whoosh", 0))
            if beat.get("stopwatch") and not beat.get("clip"):
                ev.append((b0 + 0.15 + STOPWATCH, "ding", 0))
            if beat.get("logo"):
                last = max(l["end"] for l in self.lines if l["beat"] == bi)
                ev.append((last + 0.15, "logo", 0))
        return ev

    def audio(self, out_wav):
        d = self.duration
        n = int(d * SR)
        fx = np.zeros((2, n), dtype=np.float32)
        cache = {}
        for at, name, gain in self.sfx_events():
            if name not in cache:
                cache[name] = sound.SFX[name]()
            x = cache[name] * 10 ** ((sound.LEVEL[name] + gain) / 20)
            sound.place(fx, max(0, at), x)
        sound.save(fx, self.build / "sfx.wav")
        stops, beats = [], self.spec["beats"]
        t_stop = None
        for bi, beat in enumerate(beats):
            if beat.get("music") == "stop" and t_stop is None:
                t_stop = self.starts[bi]
            if beat.get("music") == "resume" and t_stop is not None:
                stops.append((t_stop, self.starts[bi])); t_stop = None
        if t_stop is not None:
            stops.append((t_stop, d + 1))
        music_end = d
        if beats[-1].get("logo"):
            last = max(l["end"] for l in self.lines if l["beat"] == len(beats) - 1)
            music_end = last + 0.1
        m = sound.music(d, stops=stops)
        cut = int(music_end * SR)
        if cut < m.shape[1]:
            fade = int(0.08 * SR)
            m[:, cut:cut + fade] *= np.linspace(1, 0, min(fade, m.shape[1] - cut))
            m[:, cut + fade:] = 0
        sound.save(m, self.build / "music.wav")
        flt = ("[0:a]apad=whole_dur={d},asplit=2[v][sc];"
               "[1:a]volume=0.45,equalizer=f=2500:t=q:w=1:g=-4[m];[m][sc]sidechaincompress=threshold=0.02:ratio=4:attack=10:release=180:knee=4[md];"
               "[2:a]anull[fx];[v][md][fx]amix=inputs=3:normalize=0,atrim=0:{d},acompressor=threshold=-12dB:ratio=2:attack=10:release=150").format(d=d)
        args = ["-i", str(self.build / "voice.wav"), "-i", str(self.build / "music.wav"), "-i", str(self.build / "sfx.wav")]
        meas = ff(*args, "-filter_complex", flt + ",loudnorm=I=-14:TP=-1.0:LRA=7:print_format=json[a]", "-map", "[a]", "-f", "null", "-", capture=True).stderr
        j = json.loads(meas[meas.rindex("{"):meas.rindex("}") + 1])
        ln = (f"loudnorm=I=-14:TP=-1.0:LRA=7:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:"
              f"measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,alimiter=limit=0.89:attack=2:release=50,aresample=48000")
        ff(*args, "-filter_complex", flt + "," + ln + "[a]", "-map", "[a]", "-ac", "2", str(out_wav))

    def cover(self, path):
        c = self.spec.get("cover", {})
        frame = self.bgs["end"].copy()
        d = ImageDraw.Draw(frame)
        y = 330
        for i, line in enumerate(c.get("lines", ["Góc Nghiên Cứu"])):
            size = 118
            f = font("ExtraBold", size)
            while f.getlength(line) > 920 and size > 60:
                size -= 4; f = font("ExtraBold", size)
            tw = f.getlength(line)
            if i == len(c.get("lines", [])) - 1:
                im = Image.new("RGBA", (int(tw + 80), size + 60), (0, 0, 0, 0))
                ImageDraw.Draw(im).rounded_rectangle([0, 0, im.width - 1, im.height - 1], 30, fill=ORANGE, outline=INK, width=6)
                ImageDraw.Draw(im).text((40, 14), line, font=f, fill=INK)
                im = im.rotate(-3, resample=Image.BICUBIC, expand=True)
                paste_center(frame, im, W / 2, y + size / 2 + 20)
            else:
                d.text(((W - tw) / 2, y), line, font=f, fill="#ffffff", stroke_width=8, stroke_fill=INK)
            y += size + 56
        mood = MOODS[c.get("owl", "panic")]
        owl = self.owl.draw(OwlState(mouth=c.get("mouth", 3), eyes=mood["eyes"], brows=mood["brows"], wing_l=mood["wing_l"], wing_r=mood["wing_r"]), 640)
        frame.paste(owl, (int(W / 2 - owl.width / 2), 1580 - owl.height), owl)
        frame.save(path)


def encode(master, audio, duration, out):
    kbps = min(6000, int(TARGET_MB * 8 * 1024 / duration) - 128)
    log = str(master.parent / "x264pass")
    ff("-i", str(master), "-c:v", "libx264", "-preset", "slow", "-b:v", f"{kbps}k", "-pix_fmt", "yuv420p", "-r", str(FPS), "-passlogfile", log,
       "-pass", "1", "-an", "-f", "mp4", "NUL" if os.name == "nt" else os.devnull)
    ff("-i", str(master), "-i", str(audio), "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-b:v", f"{kbps}k",
       "-pix_fmt", "yuv420p", "-r", str(FPS), "-passlogfile", log, "-pass", "2", "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", str(out))
    mb = out.stat().st_size / 1024 / 1024
    print(f"  {out.name}: {mb:.2f} MB, {duration:.1f}s, video {kbps} kbps")
    if mb > 10:
        sys.exit("over 10 MB: lower TARGET_MB")


def render(spec, build):
    r = Renderer(spec, build)
    r.render(build / "master.mp4")
    r.audio(build / "mix.wav")
    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / f"{spec['id']}.mp4"
    encode(build / "master.mp4", build / "mix.wav", r.duration, out)
    r.cover(OUT / f"cover-{spec['id']}.png")
    print(f"  cover -> {OUT / ('cover-' + spec['id'] + '.png')}")


def frames(spec, build, times):
    r = Renderer(spec, build)
    n = int(r.duration * FPS)
    env = r.envelope(n)
    out = build / "stills"
    out.mkdir(exist_ok=True)
    ims = []
    for i in range(n):  # walk every frame so smoothed state (wings, mouth) is right
        t = i / FPS
        if any(abs(x - t) < 0.5 / FPS for x in times):
            im = r.frame(t, env[i]).convert("RGB")
            im.save(out / f"t{t:05.2f}.png"); ims.append(im)
        elif i % 1 == 0 and any(x > t for x in times):
            r.owl_frame(t, spec["beats"][max(j for j in range(len(spec["beats"])) if r.starts[j] <= t)], 0, env[i], 10)
        if not any(x > t for x in times):
            break
    cols = min(4, len(ims))
    rows = math.ceil(len(ims) / cols)
    sheet = Image.new("RGB", (cols * 360, rows * 640), "white")
    for k, im in enumerate(ims):
        sheet.paste(im.resize((360, 640)), ((k % cols) * 360, (k // cols) * 640))
    sheet.save(build / "stills.png")
    print(f"  {len(ims)} stills -> {build / 'stills.png'}  (duration {r.duration}s, beats at {[round(s, 1) for s in r.starts]})")


def main():
    spec = json.loads(Path(sys.argv[1]).read_text(encoding="utf8"))
    args = [a for a in sys.argv[2:] if a != "--debug"]
    build = STUDIO / "build" / spec["id"]
    build.mkdir(parents=True, exist_ok=True)
    if args and args[0] == "frames":
        return frames(spec, build, [float(x) for x in args[1:]])
    for st in args or ["capture", "voice", "render"]:
        print(f"[{spec['id']}] {st}")
        {"capture": record if "record" in spec else capture, "voice": voice, "render": render}[st](spec, build)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
