"""Render the per-page share cards in public/og/*.png (1200x630).

Satori (the Astro OG route) only gets the latin subset of Be Vietnam Pro, so
Vietnamese diacritics break; these cards are drawn by Chrome instead, with the
full font from Google Fonts, and committed as static files.

Run after changing a card's text:
    pip install playwright
    python -I scripts/make-og.py
Pages pick their card through the `ogImage` prop of Layout.astro.
"""

import html
import pathlib

from playwright.sync_api import sync_playwright

OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "og"

# name: (eyebrow, title, subtitle)
CARDS = {
    "home": (
        "Cho sinh viên làm khoá luận",
        "Công cụ khoá luận miễn phí",
        "PLS-SEM · Cronbach's alpha · Tính cỡ mẫu · Vẽ mô hình · Thư viện thang đo tiếng Việt",
    ),
    "cong-cu": (
        "12 công cụ trên trình duyệt",
        "Chạy số liệu khoá luận, khỏi cài phần mềm",
        "PLS-SEM, Cronbach, EFA, hồi quy, cỡ mẫu, làm sạch dữ liệu, trích dẫn APA 7",
    ),
    "pls-sem": (
        "Công cụ PLS-SEM",
        "Chạy PLS-SEM online miễn phí",
        "Outer loadings, CR, AVE, HTMT, bootstrap 5.000 mẫu, R², f², Q². Xuất Word.",
    ),
    "cronbach-alpha": (
        "Công cụ Cronbach's alpha",
        "Tính Cronbach's alpha online",
        "Dán từ Excel, SPSS hay Google Forms. Bảng Item-Total như SPSS, xuất Word.",
    ),
    "tinh-co-mau": (
        "Công cụ tính cỡ mẫu",
        "Tính cỡ mẫu nghiên cứu trong 1 phút",
        "PLS-SEM, hồi quy, EFA, t-test, ANOVA, Cochran. Kèm đoạn chương 3 có trích dẫn.",
    ),
    "ve-mo-hinh": (
        "Công cụ vẽ mô hình",
        "Vẽ mô hình nghiên cứu, tự ra giả thuyết",
        "Kéo thả khái niệm, nối mũi tên, tải PNG cho Word, có sẵn H1, H2… theo mô hình.",
    ),
    "thang-do": (
        "Thư viện thang đo",
        "Thang đo tiếng Việt có nguồn gốc, để trích",
        "Bản dịch, bản gốc tiếng Anh, tác giả, năm, độ tin cậy và trích dẫn APA.",
    ),
}

LOGO = """<svg viewBox="0 0 32 32" width="64" height="64"><rect width="32" height="32" rx="8" fill="#fff"/>
<rect x="7" y="18" width="4" height="7" rx="1.5" fill="#0b6b53" fill-opacity="0.65"/>
<rect x="14" y="14" width="4" height="11" rx="1.5" fill="#0b6b53" fill-opacity="0.82"/>
<rect x="21" y="11" width="4" height="14" rx="1.5" fill="#0b6b53"/>
<circle cx="23" cy="6.2" r="2.6" fill="#f4a85e"/></svg>"""

PAGE = """<!doctype html><html lang="vi"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;700;800&display=block&subset=vietnamese" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
html,body{width:1200px;height:630px}
body{font-family:'Be Vietnam Pro',sans-serif;color:#fff;background:#0b6b53;position:relative;overflow:hidden}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:40px 40px}
.glow{position:absolute;right:-220px;top:-260px;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle,rgba(244,168,94,.22),rgba(244,168,94,0) 65%)}
.wrap{position:absolute;inset:0;padding:64px 80px 56px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:20px;font-size:36px;font-weight:700;letter-spacing:-.01em}
.eyebrow{margin-top:44px;align-self:flex-start;background:#f4a85e;color:#2a1604;font-weight:700;font-size:26px;padding:8px 20px;border-radius:999px}
h1{text-wrap:balance;margin-top:22px;font-size:74px;line-height:1.1;font-weight:800;letter-spacing:-.02em;max-width:1040px}
p{text-wrap:balance;margin-top:20px;font-size:30px;line-height:1.4;font-weight:500;color:rgba(255,255,255,.88);max-width:1000px}
.foot{margin-top:auto;display:flex;justify-content:space-between;align-items:center;font-size:26px;font-weight:700}
.foot span{color:rgba(255,255,255,.85);font-weight:500}
.bar{position:absolute;left:0;right:0;bottom:0;height:12px;background:#f4a85e}
</style></head><body><div class="grid"></div><div class="glow"></div>
<div class="wrap"><div class="brand">LOGO Góc Nghiên Cứu</div>
<div class="eyebrow">EYEBROW</div><h1>TITLE</h1><p>SUB</p>
<div class="foot">gocnghiencuu.com<span>Miễn phí · Không cần tài khoản · Chạy trên trình duyệt</span></div></div>
<div class="bar"></div></body></html>"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1200, "height": 630})
        for name, (eyebrow, title, sub) in CARDS.items():
            doc = (
                PAGE.replace("LOGO", LOGO)
                .replace("EYEBROW", html.escape(eyebrow))
                .replace("TITLE", html.escape(title))
                .replace("SUB", html.escape(sub).replace(" · ", " · "))
            )
            page.set_content(doc, wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            fam = page.evaluate("document.fonts.check('800 76px \"Be Vietnam Pro\"', 'ạ')")
            if not fam:
                raise SystemExit("Be Vietnam Pro did not load; check the network.")
            page.screenshot(path=str(OUT / f"{name}.png"))
            print("wrote", OUT / f"{name}.png")
        browser.close()


if __name__ == "__main__":
    main()
