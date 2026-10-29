// /llms.txt (https://llmstxt.org): a Markdown map of the site for AI assistants, built from the collections.
import type { APIRoute } from "astro";
import { header, latestValue, loadIndex, oneLine, pageUrl, scaleCites } from "@/utils/aiIndex";

export const GET: APIRoute = async ({ site }) => {
  const base = site!;
  const u = (p: string) => pageUrl(base, p);
  const { posts, scales, concepts, templates, datasets } = await loadIndex();
  const lines = [
    ...header(base),
    "",
    `## Thư viện thang đo / Scale library (${scales.length})`,
    "",
    "Mỗi trang: biến quan sát nguyên văn tiếng Anh, bản dịch tiếng Việt, câu đảo chiều, nguồn đã đối chiếu, tài liệu tham khảo APA. Each page lists original English items, Vietnamese translation, reverse-scored items and verified sources.",
    "",
    ...scales.map(s => `- [${s.data.name}: ${s.data.fullName}](${u(`thang-do/${s.id}`)}): ${s.data.constructs.map(c => c.nameEn).join(", ")}. Nguồn: ${scaleCites(s).join("; ")}`),
    "",
    `## Khái niệm / Constructs (${concepts.length})`,
    "",
    ...concepts.map(c => `- [${c.data.name} (${c.data.nameEn})](${u(`khai-niem/${c.id}`)}): ${c.data.constructs.length} thang đo đo khái niệm này`),
    "",
    `## Mẫu bảng hỏi / Questionnaire templates (${templates.length})`,
    "",
    ...templates.map(t => `- [${t.data.title}](${u(`mau-bang-hoi/${t.id}`)}): ${oneLine(t.data.topic)}`),
    "",
    `## Dữ liệu Việt Nam / Vietnam indicators (${datasets.length}, World Bank WDI, CC BY 4.0)`,
    "",
    ...datasets.map(d => `- [${d.data.nameVi} (${d.data.nameEn})](${u(`du-lieu/${d.id}`)}): mã ${d.data.code}, mới nhất ${latestValue(d)}`),
    "",
    "## Optional",
    "",
    `- [Toàn văn tóm tắt dữ kiện / Full facts file](${new URL("llms-full.txt", base).href}): số biến, nguồn, giấy phép của từng thang đo; giá trị dữ liệu`,
    ...posts.map(p => `- [${p.data.title}](${u(`posts/${p.id.split("/").pop()}`)}): ${oneLine(p.data.description)}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
