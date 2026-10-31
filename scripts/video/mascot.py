"""Cú Nghiên, the Góc Nghiên Cứu mascot, as a 2D rig: every part is its own SVG on one 700x760 canvas,
rasterised once to PNG, then posed per frame in Pillow (mouth visemes, blinks, pupils, wings, head tilt, squash).

Usage:
  python mascot.py build [dir]   write parts/*.svg + parts/*.png and preview poses (default docs/launch/brand/mascot)
In code:
  owl = Owl(parts_dir); img = owl.draw(OwlState(mouth=2, wing_r=60), size=320)
"""
import sys
from dataclasses import dataclass, field
from pathlib import Path

from PIL import Image

GREEN, HEAD, GREEN_DARK, MINT, CREAM, ORANGE, INK = "#0b6b53", "#128a6b", "#08513f", "#e1f1ea", "#fdf0e3", "#f4a85e", "#14211c"
CW, CH = 700, 760
EYES = ((262, 272), (438, 272))
NECK = (350, 470)
SHOULDER_L, SHOULDER_R = (196, 488), (504, 488)
SW = 8  # outline width


def svg(body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {CW} {CH}" width="{CW}" height="{CH}">{body}</svg>'


def stroke(fill):
    return f'fill="{fill}" stroke="{INK}" stroke-width="{SW}" stroke-linejoin="round" stroke-linecap="round"'


def wing_path(mirror=False):
    d = "M196 478 C140 500 104 580 120 650 C130 700 182 700 204 650 C214 620 214 540 206 486 Z"
    return f'<path d="{d}" {stroke(GREEN_DARK)}' + (' transform="translate(700 0) scale(-1 1)"' if mirror else "") + "/>"


def mouth(open_):
    """open_ 0..3: jaw drop under a fixed upper beak."""
    if open_ == 0:
        return f'<path d="M306 348 Q350 333 394 348 Q372 386 350 396 Q328 386 306 348Z" {stroke(ORANGE)}/>'
    drop = 12 * open_
    cav = (f'<path d="M318 366 Q350 {372 + drop} 382 366 Q388 {392 + drop} 350 {402 + drop} Q312 {392 + drop} 318 366Z" '
           f'fill="#7a2a14" stroke="{INK}" stroke-width="{SW}" stroke-linejoin="round"/>'
           f'<ellipse cx="350" cy="{390 + drop * .8}" rx="{13 + open_ * 3}" ry="{5 + open_ * 2}" fill="#e8795a"/>')
    upper = f'<path d="M304 350 Q350 330 396 350 Q376 374 350 380 Q324 374 304 350Z" {stroke(ORANGE)}/>'
    return cav + upper


PARTS = {
    "feet": f'<g {stroke(ORANGE)}><ellipse cx="292" cy="736" rx="46" ry="20"/><ellipse cx="408" cy="736" rx="46" ry="20"/></g>',
    "body": (f'<path d="M350 410 C478 410 572 520 572 622 C572 704 474 740 350 740 C226 740 128 704 128 622 C128 520 222 410 350 410Z" {stroke(GREEN)}/>'
             f'<ellipse cx="350" cy="636" rx="140" ry="92" fill="{MINT}"/>'
             f'<g fill="{GREEN}"><rect x="296" y="640" width="28" height="50" rx="10" opacity=".6"/><rect x="336" y="612" width="28" height="78" rx="10" opacity=".8"/>'
             f'<rect x="376" y="584" width="28" height="106" rx="10"/></g><circle cx="390" cy="566" r="14" fill="{ORANGE}"/>'),
    "wing_l": wing_path(),
    "wing_r": wing_path(True),
    "head": (f'<path d="M150 170 L118 48 L250 118Z M550 170 L582 48 L450 118Z" {stroke(HEAD)}/>'
             f'<ellipse cx="350" cy="288" rx="258" ry="214" {stroke(HEAD)}/>'
             f'<path d="M350 168 C410 136 548 150 556 262 C562 360 470 412 350 392 C230 412 138 360 144 262 C152 150 290 136 350 168Z" fill="{CREAM}" stroke="{INK}" stroke-width="{SW}"/>'
             f'<g fill="{ORANGE}" opacity=".45"><ellipse cx="190" cy="352" rx="34" ry="19"/><ellipse cx="510" cy="352" rx="34" ry="19"/></g>'),
    "eyes": "".join(f'<circle cx="{x}" cy="{y}" r="70" fill="#fff" stroke="{INK}" stroke-width="{SW}"/>' for x, y in EYES),
    "pupils": "".join(f'<circle cx="{x}" cy="{y + 6}" r="38" fill="{INK}"/><circle cx="{x + 13}" cy="{y - 6}" r="14" fill="#fff"/>'
                      f'<circle cx="{x - 12}" cy="{y + 20}" r="6" fill="#fff"/>' for x, y in EYES),
    "pupils_small": "".join(f'<circle cx="{x}" cy="{y}" r="22" fill="{INK}"/><circle cx="{x + 8}" cy="{y - 8}" r="8" fill="#fff"/>' for x, y in EYES),
    "lids_half": "".join(f'<path d="M{x - 66} {y - 2} A66 66 0 0 1 {x + 66} {y - 2}Z" fill="{CREAM}"/>'
                         f'<path d="M{x - 66} {y - 2} L{x + 66} {y - 2}" stroke="{INK}" stroke-width="{SW}" stroke-linecap="round"/>' for x, y in EYES),
    "lids_closed": "".join(f'<circle cx="{x}" cy="{y}" r="66" fill="{CREAM}"/>'
                           f'<path d="M{x - 42} {y + 6} Q{x} {y + 34} {x + 42} {y + 6}" fill="none" stroke="{INK}" stroke-width="10" stroke-linecap="round"/>' for x, y in EYES),
    "eyes_happy": "".join(f'<circle cx="{x}" cy="{y}" r="74" fill="{CREAM}"/>'
                          f'<path d="M{x - 40} {y + 18} Q{x} {y - 32} {x + 40} {y + 18}" fill="none" stroke="{INK}" stroke-width="12" stroke-linecap="round"/>' for x, y in EYES),
    "glasses": (''.join(f'<circle cx="{x}" cy="{y}" r="82" fill="none" stroke="{ORANGE}" stroke-width="9"/>' for x, y in EYES)
                + f'<path d="M340 262 Q350 250 360 262" fill="none" stroke="{ORANGE}" stroke-width="9" stroke-linecap="round"/>'),
    "brows_up": f'<g stroke="{INK}" stroke-width="11" stroke-linecap="round" fill="none"><path d="M206 160 Q262 126 316 154"/><path d="M384 154 Q438 126 494 160"/></g>',
    "brows_frown": f'<g stroke="{INK}" stroke-width="11" stroke-linecap="round"><path d="M206 176 L310 204"/><path d="M390 204 L494 176"/></g>',
    "brows_sad": f'<g stroke="{INK}" stroke-width="11" stroke-linecap="round"><path d="M210 200 L306 170"/><path d="M394 170 L490 200"/></g>',
    "mouth_smile": (f'<path d="M306 346 Q350 331 394 346 Q372 380 350 388 Q328 380 306 346Z" {stroke(ORANGE)}/>'
                    f'<path d="M292 404 Q350 440 408 404" fill="none" stroke="{INK}" stroke-width="9" stroke-linecap="round"/>'),
}
for _k in range(4):
    PARTS[f"mouth_{_k}"] = mouth(_k)


@dataclass
class OwlState:
    mouth: object = 0          # 0..3 or "smile"
    eyes: str = "open"         # open | half | closed | happy | wide
    brows: str = ""            # "" | up | frown | sad
    look: tuple = (0.0, 0.0)   # pupil offset in canvas units (max ~14)
    wing_l: float = 0.0        # degrees; negative raises the left wing outward
    wing_r: float = 0.0        # degrees; positive raises the right wing outward
    head_rot: float = 0.0
    head_dy: float = 0.0
    sx: float = 1.0            # squash/stretch, anchored at the feet
    sy: float = 1.0
    extra: list = field(default_factory=list)


class Owl:
    def __init__(self, parts_dir):
        self.parts = {}
        for name in PARTS:
            im = Image.open(Path(parts_dir) / f"{name}.png").convert("RGBA")
            box = im.getbbox()
            self.parts[name] = (im.crop(box), box[:2])
        self.cache = {}

    def _scaled(self, size):
        """Parts pre-scaled to the display size, so posing works on small images."""
        if size not in self.cache:
            k = size / CW
            self.cache[size] = {n: (im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS), (x * k, y * k))
                                for n, (im, (x, y)) in self.parts.items()}
        return self.cache[size]

    def draw(self, s: OwlState, size=320):
        """Return an RGBA image (1.25*size wide) with the owl standing on its bottom edge."""
        P = self._scaled(size)
        k = size / CW
        cw, ch = round(CW * k), round(CH * k)

        def put(canvas, name, dx=0.0, dy=0.0):
            im, (x, y) = P[name]
            canvas.alpha_composite(im, (round(x + dx * k), round(y + dy * k)))

        def rot(canvas, name, angle, pivot):
            im, (x, y) = P[name]
            if not angle:
                return canvas.alpha_composite(im, (round(x), round(y)))
            # rotate the part about the pivot: pad it so the pivot is the centre, rotate, paste back
            px, py = pivot[0] * k - x, pivot[1] * k - y
            r = int(max(px, im.width - px, py, im.height - py)) + 2
            pad = Image.new("RGBA", (2 * r, 2 * r), (0, 0, 0, 0))
            pad.alpha_composite(im, (round(r - px), round(r - py)))
            pad = pad.rotate(angle, resample=Image.BILINEAR)
            canvas.alpha_composite(pad, (round(pivot[0] * k - r), round(pivot[1] * k - r))) if pivot[0] * k - r >= 0 and pivot[1] * k - r >= 0 else                 canvas.paste(pad, (round(pivot[0] * k - r), round(pivot[1] * k - r)), pad)

        margin = round(0.3 * size)
        c = Image.new("RGBA", (cw + 2 * margin, ch + margin), (0, 0, 0, 0))
        body = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        put(body, "feet")
        put(body, "body")
        c.alpha_composite(body, (margin, margin))
        sub = Image.new("RGBA", c.size, (0, 0, 0, 0))
        shift = lambda p_: (p_[0] + margin / k, p_[1] + margin / k)
        P2 = {n: (im, (x + margin, y + margin)) for n, (im, (x, y)) in P.items()}
        P_backup, P = P, P2
        rot(c, "wing_l", s.wing_l, shift(SHOULDER_L))
        h = Image.new("RGBA", c.size, (0, 0, 0, 0))
        put(h, "head")
        if s.eyes == "happy":
            put(h, "eyes_happy")
        else:
            put(h, "eyes")
            lx, ly = s.look
            put(h, "pupils_small" if s.eyes == "wide" else "pupils", lx, ly)
            if s.eyes == "half":
                put(h, "lids_half")
            elif s.eyes == "closed":
                put(h, "lids_closed")
        put(h, "glasses")
        if s.brows:
            put(h, f"brows_{s.brows}")
        put(h, "mouth_smile" if s.mouth == "smile" else f"mouth_{int(s.mouth)}")
        hb = h.getbbox()
        if s.head_rot and hb:
            nx, ny = shift(NECK)
            head = h.crop(hb)
            px, py = nx * k - hb[0], ny * k - hb[1]
            r = int(max(px, head.width - px, py, head.height - py) * 1.42) + 2
            pad = Image.new("RGBA", (2 * r, 2 * r), (0, 0, 0, 0))
            pad.alpha_composite(head, (round(r - px), round(r - py)))
            pad = pad.rotate(s.head_rot, resample=Image.BILINEAR)
            h = Image.new("RGBA", c.size, (0, 0, 0, 0))
            h.paste(pad, (round(nx * k - r), round(ny * k - r)), pad)
        c.alpha_composite(h, (0, round(s.head_dy * k)))
        rot(c, "wing_r", s.wing_r, shift(SHOULDER_R))
        P = P_backup
        if s.sx != 1 or s.sy != 1:
            w2, h2 = round(c.width * s.sx), round(c.height * s.sy)
            sq = c.resize((w2, h2), Image.BILINEAR)
            c = Image.new("RGBA", (max(c.width, w2), c.height), (0, 0, 0, 0))
            c.alpha_composite(sq, ((c.width - w2) // 2, c.height - h2))
        return c


PREVIEWS = {
    "idle": OwlState(),
    "talk": OwlState(mouth=2, look=(6, 2)),
    "point": OwlState(mouth=1, wing_r=70, look=(12, 0), head_rot=-4),
    "wow": OwlState(mouth=3, eyes="wide", brows="up", wing_l=-120, wing_r=120),
    "happy": OwlState(mouth="smile", eyes="happy", wing_r=110),
    "panic": OwlState(mouth=3, eyes="wide", brows="sad", wing_l=-150, wing_r=150, head_rot=5),
    "tired": OwlState(eyes="half", brows="sad", head_rot=6),
    "smug": OwlState(mouth="smile", eyes="half", brows="frown", wing_r=40, look=(-8, 0), head_rot=-5),
}


def build(out):
    from playwright.sync_api import sync_playwright
    parts = out / "parts"
    parts.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": CW, "height": CH})
        for name, body in PARTS.items():
            s = svg(body)
            (parts / f"{name}.svg").write_text(s, encoding="utf8")
            page.set_content(f'<html><body style="margin:0;background:transparent">{s}</body></html>')
            page.screenshot(path=str(parts / f"{name}.png"), omit_background=True, clip={"x": 0, "y": 0, "width": CW, "height": CH})
        browser.close()
    owl = Owl(parts)
    for name, st in PREVIEWS.items():
        owl.draw(st, 600).save(out / f"cu-nghien-{name}.png")
    print(f"{len(PARTS)} parts, {len(PREVIEWS)} poses -> {out}")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        build(Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).resolve().parents[2] / "docs" / "launch" / "brand" / "mascot")
