"""Screenshot the key pages of Góc Nghiên Cứu at phone and desktop width.

Usage (Python Playwright + installed Chrome; run with -I):
    python -I scripts/ui-snapshots.py --base https://gocnghiencuu.com --out ui-shots/before
    python -I scripts/ui-snapshots.py --base http://127.0.0.1:4321 --out ui-shots/after
    python -I scripts/ui-snapshots.py --compare ui-shots/before ui-shots/after --out ui-shots/sheet.png

Options: --dark (dark theme), --full (full-page shots; default is first two screens),
--only home,pls (filter page keys).
"""
import argparse
import os
import sys

PAGES = [
    ("home", "/"),
    ("tools", "/cong-cu/"),
    ("pls", "/cong-cu/pls-sem/"),
    ("cronbach", "/cong-cu/cronbach-alpha/"),
    ("sample", "/cong-cu/tinh-co-mau/"),
    ("model", "/cong-cu/ve-mo-hinh/"),
    ("scales", "/thang-do/"),
    ("scale", "/thang-do/cam-ket-to-chuc-ocq/"),
    ("concepts", "/khai-niem/"),
    ("data", "/du-lieu/"),
    ("data-page", "/du-lieu/atm/"),
    ("thresholds", "/nguong-chap-nhan/"),
    ("posts", "/posts/"),
    ("post", "/posts/cronbach-alpha-la-gi/"),
    ("404", "/khong-ton-tai-404/"),
]
SIZES = [("m", 390, 844), ("d", 1440, 900)]


def shoot(base, out, dark, full, only):
    from playwright.sync_api import sync_playwright

    os.makedirs(out, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")
        for tag, w, h in SIZES:
            ctx = browser.new_context(
                viewport={"width": w, "height": h},
                device_scale_factor=1,
                color_scheme="dark" if dark else "light",
                is_mobile=tag == "m",
                has_touch=tag == "m",
            )
            if dark:
                ctx.add_init_script("try{localStorage.setItem('theme','dark')}catch(e){}")
            page = ctx.new_page()
            for key, path in PAGES:
                if only and key not in only:
                    continue
                try:
                    page.goto(base.rstrip("/") + path, wait_until="networkidle", timeout=45000)
                except Exception as e:  # keep going; a 404 page still renders
                    print("warn", key, e, file=sys.stderr)
                page.wait_for_timeout(400)
                clip_h = None if full else min(h * 2, page.evaluate("document.documentElement.scrollHeight"))
                fn = os.path.join(out, f"{key}-{tag}{'-dark' if dark else ''}.png")
                if full:
                    page.screenshot(path=fn, full_page=True)
                else:
                    page.screenshot(path=fn, full_page=True, clip={"x": 0, "y": 0, "width": w, "height": clip_h})
                sw = page.evaluate("document.documentElement.scrollWidth")
                flag = "  <-- horizontal overflow" if sw > w else ""
                print(f"{fn}  scrollWidth={sw}{flag}")
            ctx.close()
        browser.close()


def compare(before, after, out):
    """Side-by-side contact sheet: each row = page, columns = before/after (phone) + before/after (desktop)."""
    from PIL import Image, ImageDraw

    rows = []
    for key, _ in PAGES:
        cells = []
        for tag in ("m", "d"):
            for d in (before, after):
                fn = os.path.join(d, f"{key}-{tag}.png")
                if os.path.exists(fn):
                    im = Image.open(fn).convert("RGB")
                    im = im.crop((0, 0, im.width, min(im.height, int(im.width * (2.0 if tag == "m" else 0.75)))))
                    target_w = 180 if tag == "m" else 420
                    im = im.resize((target_w, int(im.height * target_w / im.width)))
                    cells.append(im)
        if cells:
            rows.append((key, cells))
    if not rows:
        sys.exit("no screenshots found")
    pad, label_h = 8, 18
    widths = [sum(c.width for c in cells) + pad * (len(cells) + 1) for _, cells in rows]
    heights = [max(c.height for c in cells) + pad + label_h for _, cells in rows]
    sheet = Image.new("RGB", (max(widths), sum(heights) + 30), "white")
    draw = ImageDraw.Draw(sheet)
    draw.text((pad, 8), "before | after (390px)        before | after (1440px)", fill="black")
    y = 30
    for (key, cells), rh in zip(rows, heights):
        draw.text((pad, y), key, fill="black")
        x = pad
        for c in cells:
            sheet.paste(c, (x, y + label_h))
            x += c.width + pad
        y += rh
    sheet.save(out, optimize=True)
    print(out, sheet.size, os.path.getsize(out), "bytes")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="https://gocnghiencuu.com")
    ap.add_argument("--out", default="ui-shots/current")
    ap.add_argument("--dark", action="store_true")
    ap.add_argument("--full", action="store_true")
    ap.add_argument("--only", default="")
    ap.add_argument("--compare", nargs=2, metavar=("BEFORE", "AFTER"))
    a = ap.parse_args()
    if a.compare:
        compare(a.compare[0], a.compare[1], a.out)
    else:
        shoot(a.base, a.out, a.dark, a.full, set(filter(None, a.only.split(","))))
