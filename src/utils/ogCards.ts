/**
 * Per-page share cards (public/og/*.png, 1200x630), drawn by scripts/make-og.py.
 * Keyed by page path; the alt text repeats what the card says.
 */
export const OG_CARDS: Record<string, { file: string; alt: string }> = {
  "/": {
    file: "og/home.png",
    alt: "Góc Nghiên Cứu: công cụ khoá luận miễn phí, PLS-SEM, Cronbach's alpha, tính cỡ mẫu, vẽ mô hình, 60 thang đo tiếng Việt",
  },
  "/cong-cu/": {
    file: "og/cong-cu.png",
    alt: "12 công cụ trên trình duyệt: chạy số liệu khoá luận, khỏi cài phần mềm",
  },
  "/cong-cu/pls-sem/": {
    file: "og/pls-sem.png",
    alt: "Chạy PLS-SEM online miễn phí: outer loadings, CR, AVE, HTMT, bootstrap 5.000 mẫu, xuất Word",
  },
  "/cong-cu/cronbach-alpha/": {
    file: "og/cronbach-alpha.png",
    alt: "Tính Cronbach's alpha online: dán từ Excel, SPSS hay Google Forms, bảng Item-Total như SPSS",
  },
  "/cong-cu/tinh-co-mau/": {
    file: "og/tinh-co-mau.png",
    alt: "Tính cỡ mẫu nghiên cứu trong 1 phút: PLS-SEM, hồi quy, EFA, t-test, ANOVA, Cochran",
  },
  "/cong-cu/ve-mo-hinh/": {
    file: "og/ve-mo-hinh.png",
    alt: "Vẽ mô hình nghiên cứu, tự ra giả thuyết H1, H2, tải PNG cho Word",
  },
  "/thang-do/": {
    file: "og/thang-do.png",
    alt: "60 thang đo tiếng Việt có nguồn gốc: bản dịch, bản gốc tiếng Anh, tác giả, năm, trích dẫn APA",
  },
};

export function ogCardFor(pathname: string) {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return OG_CARDS[path];
}
