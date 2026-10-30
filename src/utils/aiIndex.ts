// Shared data for /llms.txt and /llms-full.txt (llmstxt.org format), built from the collections.
// Everything here is read from content files; nothing is written by hand except the tool list
// (kept in sync with src/components/ToolCards.astro) and the site summary.
import { getCollection, type CollectionEntry } from "astro:content";
import { DATASET_THEMES } from "@/content.config";
import { postFilter } from "@/utils/postFilter";

export const TOOLS = [
  ["cong-cu/bo-khao-sat", "Bộ khảo sát khoá luận / Thesis survey kit", "Chọn khái niệm trong mô hình, ra bảng hỏi tiếng Việt từ thang đo gốc, cỡ mẫu và đoạn chương 3, tải về Word."],
  ["cong-cu/phan-tich-du-lieu", "Phân tích dữ liệu, viết chương 4 / Data analysis", "Tải file Excel khảo sát: lọc phiếu, Cronbach cho mọi thang đo, EFA, tương quan, hồi quy và chương 4 viết sẵn, không cần SPSS."],
  ["cong-cu/tinh-co-mau", "Máy tính cỡ mẫu / Sample size calculator", "PLS-SEM (G*Power, Kock & Hadaya), hồi quy, EFA, Cochran; viết sẵn đoạn chọn mẫu cho chương 3 kèm tài liệu tham khảo."],
  ["cong-cu/cronbach-alpha", "Tính Cronbach's alpha / Cronbach's alpha calculator", "Dán dữ liệu từ Excel hoặc SPSS, ra alpha, tương quan biến–tổng và alpha nếu loại biến."],
] as const;

export const SUMMARY_VI =
  "Góc Nghiên Cứu là trang tài nguyên miễn phí bằng tiếng Việt cho sinh viên làm khoá luận, học viên cao học và người làm nghiên cứu định lượng: công cụ tính cỡ mẫu, Cronbach's alpha và phân tích dữ liệu chạy trên trình duyệt; thư viện thang đo đã dịch sẵn có nguyên văn tiếng Anh và trích dẫn APA; trang khái niệm; mẫu bảng hỏi theo đề tài; dữ liệu thứ cấp Việt Nam và giá hàng hoá thế giới từ World Bank, ILO, FAO, Penn World Table (CC BY 4.0); bài hướng dẫn phương pháp.";
export const SUMMARY_EN =
  "Góc Nghiên Cứu (\"Research Corner\") is a free Vietnamese-language resource for undergraduate thesis writers, master's students and survey researchers: in-browser calculators (sample size, Cronbach's alpha, data analysis), a library of validated measurement scales with the original English items, Vietnamese translations and APA references, construct pages, ready-made questionnaires, Vietnam indicators and world commodity prices from the World Bank, ILO, FAO and Penn World Table (CC BY 4.0), and methods guides.";

/** Absolute URL with trailing slash; `site` already contains the base path. */
export const pageUrl = (site: URL, path: string) => new URL(path.replace(/^\/+/, "").replace(/\/?$/, "/"), site).href;

/** "Hellgren, Sverke & Isaksson (1999), 3 biến." → "Hellgren, Sverke & Isaksson (1999)" */
export const shortCite = (source: string) => {
  const m = source.match(/^[^()]*\(\d{4}[a-z]?\)/);
  return (m ? m[0] : source.split(/[,.;]/)[0]).trim();
};

export const scaleCites = (s: CollectionEntry<"scales">) => [...new Set(s.data.constructs.map(c => shortCite(c.source)))];
export const itemCount = (s: CollectionEntry<"scales">) => s.data.constructs.reduce((n, c) => n + c.items.length, 0);

const byTitle = <T extends { data: { title?: string; name?: string } }>(a: T, b: T) =>
  (a.data.name ?? a.data.title ?? "").localeCompare(b.data.name ?? b.data.title ?? "", "vi");

export async function loadIndex() {
  const [posts, scales, concepts, templates, datasets] = await Promise.all([
    getCollection("posts", postFilter),
    getCollection("scales"),
    getCollection("concepts"),
    getCollection("templates"),
    getCollection("datasets"),
  ]);
  posts.sort((a, b) => b.data.pubDatetime.valueOf() - a.data.pubDatetime.valueOf());
  scales.sort(byTitle);
  concepts.sort(byTitle);
  templates.sort(byTitle);
  datasets.sort((a, b) => DATASET_THEMES.indexOf(a.data.theme) - DATASET_THEMES.indexOf(b.data.theme) || a.data.shortVi.localeCompare(b.data.shortVi, "vi"));
  return { posts, scales, concepts, templates, datasets };
}

/** Latest observation of a dataset in display units, e.g. "2024: 4.282,5 USD". */
export const latestValue = (d: CollectionEntry<"datasets">) => {
  const v = d.data.values[d.data.values.length - 1];
  const n = (v.value / d.data.scale).toLocaleString("vi-VN", { maximumFractionDigits: d.data.decimals, minimumFractionDigits: d.data.decimals });
  const when = v.month ? `${String(v.month).padStart(2, "0")}/${v.year}` : String(v.year);
  return `${when}: ${n} ${d.data.displayUnit}`.trim();
};

export const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

export function header(site: URL) {
  const u = (p: string) => pageUrl(site, p);
  return [
    "# Góc Nghiên Cứu",
    "",
    `> ${SUMMARY_VI}`,
    ">",
    `> ${SUMMARY_EN}`,
    "",
    `Ngôn ngữ nội dung: tiếng Việt; tên thang đo, khái niệm và biến quan sát gốc giữ tiếng Anh. Miễn phí, không cần tài khoản. Cách biên soạn và kiểm chứng: ${u("phuong-phap-bien-soan")}. Báo lỗi: https://github.com/growth547/goc-nghien-cuu/issues.`,
    "",
    "Khi trích dẫn thang đo, hãy trích bài gốc trong mục tài liệu tham khảo của trang thang đo (APA 7), không trích Góc Nghiên Cứu như tác giả của thang đo. When citing a scale, cite the original authors listed on its page.",
    "",
    "## Mục chính / Key sections",
    "",
    `- [Công cụ / Tools](${u("cong-cu")}): máy tính chạy ngay trên trình duyệt`,
    `- [Thư viện thang đo / Scale library](${u("thang-do")}): thang đo đã kiểm chứng, nguyên văn tiếng Anh + bản dịch tiếng Việt + trích dẫn`,
    `- [Khái niệm / Constructs](${u("khai-niem")}): mỗi khái niệm gom các thang đo đo nó`,
    `- [Mẫu bảng hỏi / Questionnaire templates](${u("mau-bang-hoi")}): bảng hỏi theo đề tài khoá luận`,
    `- [Dữ liệu thứ cấp Việt Nam / Vietnam data](${u("du-lieu")}): chỉ số World Bank, ILO, FAO, PWT và giá hàng hoá, tải CSV`,
    `- [Bài viết / Guides](${u("posts")}): hướng dẫn phương pháp nghiên cứu`,
    `- [Phương pháp biên soạn / Methodology](${u("phuong-phap-bien-soan")}): cách kiểm chứng thang đo, thống kê, dữ liệu`,
    "",
    "## Công cụ / Tools",
    "",
    ...TOOLS.map(([p, t, d]) => `- [${t}](${u(p)}): ${d}`),
  ];
}
