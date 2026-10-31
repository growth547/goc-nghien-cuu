"""Illustrated scenes for the Reels, drawn in Pillow at 2x and downsampled (smooth edges, no assets to license).
desk_scene() -> (back, front): the room behind the owl and the desk/laptop in front of it, both 1080x1920 RGBA."""
import math, random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, S = 1080, 1920, 2
INK, ORANGE, RED, GREEN, CREAM = "#14211c", "#f4a85e", "#d64545", "#0b6b53", "#fdf0e3"


def _font(fonts, weight, size):
    return ImageFont.truetype(str(fonts / f"BeVietnamPro-{weight}.ttf"), size * S)


def _down(im):
    return im.resize((W, H), Image.LANCZOS)


def desk_scene(fonts, laptop_text=("SmartPLS", "Hết hạn", "dùng thử")):
    s = S
    back = Image.new("RGBA", (W * s, H * s), "#152635")
    d = ImageDraw.Draw(back)
    # wall gradient
    for y in range(0, H * s, 8):
        k = y / (H * s)
        c = (int(21 + 10 * k), int(38 + 8 * k), int(53 + 6 * k))
        d.rectangle([0, y, W * s, y + 8], fill=c)
    # window with moon and stars (top right)
    wx0, wy0, wx1, wy1 = 640 * s, 300 * s, 1000 * s, 760 * s
    d.rounded_rectangle([wx0, wy0, wx1, wy1], 18 * s, fill="#0b1622", outline=INK, width=10 * s)
    r = random.Random(5)
    for _ in range(26):
        x, y = r.randint(wx0 + 30 * s, wx1 - 30 * s), r.randint(wy0 + 30 * s, wy1 - 30 * s)
        rr = r.choice([3, 4, 5]) * s
        d.ellipse([x - rr, y - rr, x + rr, y + rr], fill="#f4e3c4")
    d.ellipse([870 * s, 360 * s, 960 * s, 450 * s], fill="#f7e7b8")
    d.ellipse([895 * s, 350 * s, 980 * s, 435 * s], fill="#0b1622")
    d.line([(wx0 + wx1) / 2, wy0, (wx0 + wx1) / 2, wy1], fill=INK, width=8 * s)
    d.line([wx0, (wy0 + wy1) / 2, wx1, (wy0 + wy1) / 2], fill=INK, width=8 * s)
    # wall clock 2:07 (top left)
    cx, cy, cr = 210 * s, 470 * s, 120 * s
    d.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=CREAM, outline=INK, width=12 * s)
    for k in range(12):
        a = math.radians(k * 30)
        d.line([cx + math.sin(a) * cr * .78, cy - math.cos(a) * cr * .78, cx + math.sin(a) * cr * .9, cy - math.cos(a) * cr * .9], fill=INK, width=6 * s)
    ha = math.radians((2 + 7 / 60) * 30)
    ma = math.radians(7 * 6)
    d.line([cx, cy, cx + math.sin(ha) * cr * .5, cy - math.cos(ha) * cr * .5], fill=INK, width=14 * s)
    d.line([cx, cy, cx + math.sin(ma) * cr * .75, cy - math.cos(ma) * cr * .75], fill=RED, width=9 * s)
    d.ellipse([cx - 12 * s, cy - 12 * s, cx + 12 * s, cy + 12 * s], fill=INK)
    # lamp glow on the wall
    glow = Image.new("L", back.size, 0)
    ImageDraw.Draw(glow).ellipse([-100 * s, 900 * s, 700 * s, 1600 * s], fill=120)
    glow = glow.filter(ImageFilter.GaussianBlur(140 * s))
    back.paste(Image.new("RGBA", back.size, "#e0a05a"), (0, 0), glow)

    front = Image.new("RGBA", (W * s, H * s), (0, 0, 0, 0))
    f = ImageDraw.Draw(front)
    # desk
    f.rectangle([0, 1380 * s, W * s, H * s], fill="#5b3b28")
    f.rectangle([0, 1380 * s, W * s, 1420 * s], fill="#7a5235")
    f.line([0, 1380 * s, W * s, 1380 * s], fill=INK, width=10 * s)
    # lamp (left)
    f.polygon([(40 * s, 1380 * s), (150 * s, 1380 * s), (110 * s, 1350 * s), (80 * s, 1350 * s)], fill=INK)
    f.line([95 * s, 1350 * s, 140 * s, 1080 * s], fill=INK, width=14 * s)
    f.polygon([(90 * s, 1060 * s), (250 * s, 1010 * s), (230 * s, 1120 * s)], fill=ORANGE, outline=INK)
    # laptop, screen facing the viewer
    lx0, ly0, lx1, ly1 = 70 * s, 930 * s, 610 * s, 1340 * s
    f.rounded_rectangle([lx0, ly0, lx1, ly1], 26 * s, fill="#2a3a46", outline=INK, width=10 * s)
    sx0, sy0, sx1, sy1 = lx0 + 26 * s, ly0 + 26 * s, lx1 - 26 * s, ly1 - 30 * s
    f.rounded_rectangle([sx0, sy0, sx1, sy1], 12 * s, fill="#ffffff")
    f.rectangle([sx0, sy0, sx1, sy0 + 54 * s], fill="#f0d4d4")
    f.text((sx0 + 22 * s, sy0 + 8 * s), laptop_text[0], font=_font(fonts, "ExtraBold", 30), fill=INK)
    f.ellipse([sx0 + 30 * s, sy0 + 100 * s, sx0 + 140 * s, sy0 + 210 * s], fill=RED)
    f.line([sx0 + 58 * s, sy0 + 128 * s, sx0 + 112 * s, sy0 + 182 * s], fill="#fff", width=14 * s)
    f.line([sx0 + 112 * s, sy0 + 128 * s, sx0 + 58 * s, sy0 + 182 * s], fill="#fff", width=14 * s)
    f.text((sx0 + 165 * s, sy0 + 92 * s), laptop_text[1], font=_font(fonts, "ExtraBold", 54), fill=RED)
    f.text((sx0 + 165 * s, sy0 + 160 * s), laptop_text[2], font=_font(fonts, "ExtraBold", 54), fill=RED)
    f.polygon([(lx0 - 40 * s, ly1), (lx1 + 40 * s, ly1), (lx1 + 60 * s, ly1 + 40 * s), (lx0 - 60 * s, ly1 + 40 * s)], fill="#3a4c5a", outline=INK)
    # sticky note on the laptop
    note = Image.new("RGBA", (230 * s, 150 * s), (0, 0, 0, 0))
    nd = ImageDraw.Draw(note)
    nd.rectangle([0, 0, 229 * s, 149 * s], fill="#ffe27a", outline=INK, width=5 * s)
    nd.text((18 * s, 18 * s), "MAI NỘP", font=_font(fonts, "ExtraBold", 40), fill=INK)
    nd.text((18 * s, 78 * s), "CHƯƠNG 4!!", font=_font(fonts, "ExtraBold", 34), fill=RED)
    note = note.rotate(8, resample=Image.BICUBIC, expand=True)
    front.alpha_composite(note, (440 * s, 860 * s))
    # coffee mug (right)
    mx0, my0 = 930 * s, 1270 * s
    f.rounded_rectangle([mx0, my0, mx0 + 100 * s, my0 + 120 * s], 16 * s, fill=CREAM, outline=INK, width=8 * s)
    f.arc([mx0 + 70 * s, my0 + 25 * s, mx0 + 135 * s, my0 + 90 * s], -90, 90, fill=INK, width=10 * s)
    f.text((mx0 + 20 * s, my0 + 32 * s), "C4", font=_font(fonts, "ExtraBold", 36), fill=GREEN)
    return _down(back), _down(front)


def steam(t):
    """Three wavy steam lines above the mug, as a transparent overlay."""
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for k in range(3):
        x0 = 950 + k * 24
        pts = [(x0 + 10 * math.sin(t * 4 + k + y / 25), 1250 - y) for y in range(0, 110, 6)]
        d.line(pts, fill=(240, 240, 240, 150), width=6)
    return im
