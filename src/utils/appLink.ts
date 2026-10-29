// Every outbound link to geniusdata.io carries a ref code (counted by the
// Genius Data backend's affiliate click/conversion tables) plus UTM tags, so
// this channel can be compared against the official ones.
export const REF_CODES = { home: "lab-web", blog: "lab-blog", tool: "lab-tool" } as const;

export function appLink(kind: keyof typeof REF_CODES, content: string, next?: string): string {
  const u = new URL("/signup", "https://geniusdata.io");
  u.searchParams.set("ref", REF_CODES[kind]);
  if (next) u.searchParams.set("next", next);
  u.searchParams.set("utm_source", "goc-nghien-cuu");
  u.searchParams.set("utm_medium", kind);
  u.searchParams.set("utm_campaign", "ai-lab");
  u.searchParams.set("utm_content", content);
  return u.toString();
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

export function ctaHtml(audience: "researcher" | "respondent", kind: keyof typeof REF_CODES, content: string): string {
  if (audience === "respondent") {
    return `<aside class="cta not-prose"><span class="cta-label">Tài trợ · Genius Data</span><strong>Rảnh 10 phút? Làm khảo sát, tích GTOKEN</strong>
<p>Trên Genius Data bạn tự chọn khảo sát hợp với mình, làm trên điện thoại lúc nào cũng được. Mỗi khảo sát hợp lệ được cộng GTOKEN để đổi quà và voucher.</p>
<a class="btn" href="${esc(appLink(kind, content))}" rel="noopener">Tham gia làm khảo sát</a></aside>`;
  }
  return `<aside class="cta not-prose"><span class="cta-label">Tài trợ · Genius Data</span><strong>Cần thu mẫu nhanh và đúng đối tượng?</strong>
<p>Genius Data cho bạn chọn nhóm người trả lời, tự đặt mức thưởng mỗi câu, và <b>chỉ trả tiền cho phản hồi được duyệt</b>. Phiếu điền bừa hay do AI viết được hệ thống gắn cờ trước khi tới tay bạn.</p>
<a class="btn" href="${esc(appLink(kind, content, "/app/forms"))}" rel="noopener">Tạo khảo sát trên Genius Data</a></aside>`;
}
