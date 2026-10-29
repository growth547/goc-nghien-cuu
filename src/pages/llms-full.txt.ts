// /llms-full.txt: the llms.txt map plus concise, source-backed facts for every scale, construct page,
// template and indicator. Every fact is copied from the content collections; nothing is generated.
import type { APIRoute } from "astro";
import { header, itemCount, latestValue, loadIndex, oneLine, pageUrl } from "@/utils/aiIndex";

export const GET: APIRoute = async ({ site }) => {
  const base = site!;
  const u = (p: string) => pageUrl(base, p);
  const { posts, scales, concepts, templates, datasets } = await loadIndex();
  const scaleName = new Map(scales.map(s => [s.id, s.data.name]));
  const out: string[] = [...header(base), ""];

  out.push(`## Thang đo / Scales (${scales.length})`, "");
  for (const s of scales) {
    const d = s.data;
    const rev = d.constructs.reduce((n, c) => n + c.items.filter(i => i.reverse).length, 0);
    out.push(
      `### ${d.name}: ${d.fullName}`,
      "",
      `- URL: ${u(`thang-do/${s.id}`)}`,
      `- Lĩnh vực / Field: ${d.field}`,
      `- Tổng số biến / Items: ${itemCount(s)}${rev ? ` (${rev} đảo chiều / reverse-scored)` : ""}`,
      `- Thang trả lời / Response scale: ${d.responseScaleShort ?? oneLine(d.responseScale)}`,
      `- Khái niệm / Constructs:`,
      ...d.constructs.map(c => `  - ${c.code}: ${c.nameEn} (${c.nameVi}), ${c.items.length} biến. Nguồn: ${oneLine(c.source)}`),
      `- Giấy phép sử dụng / License: ${oneLine(d.license)}`,
      `- Tài liệu tham khảo / References:`,
      ...d.references.map(r => `  - ${oneLine(r)}`),
      `- Đã đối chiếu nguyên văn tại / Verified against: ${d.verifiedFrom.join(" ; ")}`,
      ""
    );
  }

  out.push(`## Khái niệm / Construct pages (${concepts.length})`, "");
  for (const c of concepts) {
    out.push(
      `### ${c.data.name} (${c.data.nameEn})`,
      "",
      `- URL: ${u(`khai-niem/${c.id}`)}`,
      `- Thang đo đo khái niệm này: ${c.data.constructs.map(k => {
        const [slug, code] = k.key.split(":");
        return `${scaleName.get(slug) ?? slug} (${code})`;
      }).join("; ")}`,
      ""
    );
  }

  out.push(`## Mẫu bảng hỏi / Templates (${templates.length})`, "");
  for (const t of templates) {
    out.push(
      `- [${t.data.title}](${u(`mau-bang-hoi/${t.id}`)}): ${oneLine(t.data.topic)}; đối tượng: ${oneLine(t.data.audience)}; khái niệm: ${t.data.constructs.map(k => {
        const [slug, code] = k.split(":");
        return `${code} (${scaleName.get(slug) ?? slug})`;
      }).join(", ")}; phân tích: ${t.data.method === "pls" ? "PLS-SEM" : "SPSS (EFA, hồi quy)"}`
    );
  }
  out.push("");

  out.push(`## Dữ liệu Việt Nam / Vietnam indicators (${datasets.length})`, "");
  for (const d of datasets) {
    const years = d.data.values.map(v => v.year);
    out.push(
      `- [${d.data.nameVi} (${d.data.nameEn})](${u(`du-lieu/${d.id}`)}): mã WDI ${d.data.code}; ${Math.min(...years)}–${Math.max(...years)}; mới nhất ${latestValue(d)}; nguồn ${d.data.source}; World Bank cập nhật ${d.data.lastUpdated}, lấy về ${d.data.fetchedAt}; giấy phép ${d.data.license}; CSV ${u(`du-lieu/${d.id}.csv`).replace(/\/$/, "")}`
    );
  }
  out.push("");

  out.push(`## Bài viết / Guides (${posts.length})`, "");
  for (const p of posts) out.push(`- [${p.data.title}](${u(`posts/${p.id.split("/").pop()}`)}): ${oneLine(p.data.description)}`);
  out.push("");

  return new Response(out.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
