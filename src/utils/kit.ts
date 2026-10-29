// Server-side twins of the pure helpers in src/tools/bo-khao-sat.html (the
// questionnaire kit), used to render template pages statically for search
// engines. scripts/check-kit.mjs checks both copies agree on every construct
// and every scale's response format.

const PH_RE = /\[([^\]]+)\]/g;

// Join a fragment onto the text so far, dropping words repeated across the seam:
// "mua dịch vụ " + "dịch vụ này" reads "mua dịch vụ này", "mỹ phẩm này" + " này." reads "mỹ phẩm này.".
const bare = (w: string) => w.toLowerCase().replace(/[.,;:!?)"”]+$/, "");
function joinDedup(a: string, b: string): string {
  if (!a || !b || !(/\s$/.test(a) || /^\s/.test(b))) return a + b;
  const tail = a.trimEnd().split(/\s+/),
    head = b.trimStart().split(/\s+/);
  for (let n = Math.min(3, tail.length, head.length); n >= 1; n--) {
    const t = tail.slice(-n).map(bare).join(" "),
      h = head.slice(0, n).map(bare).join(" ");
    if (t && t === h && /\p{L}/u.test(t)) {
      const drop = head.slice(0, n).join(" "),
        rest = b.trimStart();
      const left = rest.slice(drop.length),
        punct = (head[n - 1].match(/[.,;:!?)"”]+$/) || [""])[0];
      return a.trimEnd() + punct + left;
    }
  }
  return a + b;
}

export const collapseRepeats = (t: string) => t.replace(/(?<!\p{L})(này)(\s+này)+(?!\p{L})/giu, "$1");

export function placeholdersOf(texts: string[]): string[] {
  const s = new Set<string>();
  for (const t of texts) for (const m of t.matchAll(PH_RE)) s.add(m[1].toLowerCase());
  return [...s];
}

export function fillPlaceholders(text: string, values: Record<string, string>): string {
  let out = "";
  for (const p of String(text).split(/(\[[^\]]+\])/)) {
    const m = p.match(/^\[([^\]]+)\]$/);
    if (!m) {
      out = joinDedup(out, p);
      continue;
    }
    const key = m[1],
      v = (values[key.toLowerCase()] || "").trim();
    if (!v) {
      out += p;
      continue;
    }
    out = joinDedup(out, key[0] !== key[0].toLowerCase() ? v[0].toUpperCase() + v.slice(1) : v);
  }
  return collapseRepeats(out);
}

export function citeOf(source: string): string {
  const m = source.match(
    /((?:[Vv]an der |[Vv]an |[Dd]e |[Dd]i |[Ll]e )*[A-ZÀ-Ỹ][\p{L}.'\-]+(?:(?:, | & | và )(?:[Vv]an der |[Vv]an |[Dd]e |[Dd]i |[Ll]e )*[A-ZÀ-Ỹ][\p{L}.'\-]+)*(?: và cộng sự)?)\s*\((\d{4})/u
  );
  return m ? `${m[1].replace(/ & /g, " và ")} (${m[2]})` : source;
}

export function citedBy(cite: string, ref: string): boolean {
  const m = cite.match(/^([^\s,]+)(.*)\((\d{4})\)$/);
  if (!m) return false;
  const solo = !/,| và /.test(m[2]);
  const at = ref.indexOf(`(${m[3]})`);
  return ref.startsWith(m[1]) && at > 0 && (!solo || !ref.slice(0, at).includes("&"));
}

export const isAgreementScale = (responseScale: string) =>
  /^Likert/i.test(responseScale) || (/^Thang \d+ mức\./.test(responseScale) && /Hoàn toàn đồng ý/.test(responseScale));

// ---- response formats (same reading as parseResponseScale in the tool) ----
const VI_CH = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
const EDITORIAL = /(^|\s)(bản|theo|nghiên cứu|câu hỏi|tác giả|ví dụ|lưu ý|hỏi về)(\s|$)/i;
const cleanLabel = (s: string) =>
  String(s)
    .replace(/\s*\(([^()]*)\)/g, (m, x: string) => (VI_CH.test(x) && !EDITORIAL.test(x) ? m : ""))
    .replace(/^[\s'"‘“]+|[\s'"’”.,;:]+$/g, "")
    .trim();

export type ParsedScale = { agree: boolean; points: number | null; ambiguous: boolean; min: number; labels: Record<number, string> };

export function parseResponseScale(rs: string): ParsedScale {
  const s = String(rs);
  const pm = s.match(/(\d+)(?:\s*hoặc\s*(\d+))?\s*(?:mức|điểm)/);
  let points: number | null = pm ? +pm[1] : null;
  const ambiguous = Boolean(pm && pm[2]);
  const agree = isAgreementScale(s);
  const re = /(\d+)\s*=\s*((?:[^=()…;]|\([^()]*\))+?)(?=\s*(?:[,;]\s*\d+\s*=|…|\.\.\.|\)|;|\.(?:\s|$)|,\s(?!hoặc|gần như)|$))/g;
  const runs: [number, string][][] = [];
  let last: { run: [number, string][]; end: number } | null = null;
  for (const m of s.matchAll(re)) {
    const gap = last ? s.slice(last.end, m.index) : "";
    const pair: [number, string] = [+m[1], cleanLabel(m[2])];
    if (last && /^\s*(?:[,;]|…|\.\.\.)?\s*(?:\d+\/)?$/.test(gap)) last.run.push(pair);
    else {
      last = { run: [pair], end: 0 };
      runs.push(last.run);
    }
    last.end = (m.index ?? 0) + m[0].length;
  }
  let pairs = runs.find(r => r.length >= 2 && r.some(([, l]) => VI_CH.test(l)) && r.every(([, l]) => l && l.length <= 70));
  if (!pairs) {
    const lv = [...s.matchAll(/([A-ZÀ-Ỹ][^,:;()=]*?)\s*\((\d+)\)/gu)].map(m => [+m[2], cleanLabel(m[1])] as [number, string]);
    if (lv.length >= 2) pairs = lv;
  }
  if (!pairs && pm) {
    let seg = s.slice((pm.index ?? 0) + pm[0].length).split(/[.;](?:\s|$)/)[0];
    if (seg.includes(":")) seg = seg.slice(seg.lastIndexOf(":") + 1);
    const list = seg.split(/,\s*/).map(cleanLabel).filter(Boolean);
    if (list.length === points && list.every(l => l.length <= 40 && /^\p{Lu}/u.test(l))) {
      if (/^(Luôn luôn|Rất cao|Rất giống|Rất đồng ý|Rất thường xuyên|Gần như luôn)/i.test(list[0])) list.reverse();
      pairs = list.map((l, i) => [i + 1, l] as [number, string]);
    }
  }
  const labels: Record<number, string> = {};
  let min = 1;
  if (pairs) {
    pairs.sort((a, b) => a[0] - b[0]);
    pairs.forEach(([v, l]) => {
      labels[v] = l;
    });
    min = pairs[0][0];
    const span = pairs[pairs.length - 1][0] - min + 1;
    if (!agree || !points) points = span;
  }
  return { agree, points: points || null, ambiguous, min, labels };
}

// Reverse scoring on the template pages: agreement items use Likert 5 (6 − điểm);
// other scales keep their own range (PSS-10 0–4: 4 − điểm, Rosenberg 0–3: 3 − điểm).
export function reverseRuleOf(responseScale: string): string {
  const P = parseResponseScale(responseScale);
  if (P.agree) return "6 − điểm";
  const k = P.points && P.points >= 2 ? P.points : 5;
  return `${P.min + (P.min + k - 1)} − điểm`;
}

export const stripHtml = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&");

// G*Power minimum n for multiple regression, f² = 0,15, α = 0,05, power 0,80, by number of
// predictors (same values the sample-size calculator computes; checked in check-kit.mjs).
export const POWER_N: Record<number, number> = { 1: 55, 2: 68, 3: 77, 4: 85, 5: 92, 6: 98, 7: 103, 8: 109 };
// Kock & Hadaya (2018) inverse square root, p_min = 0,2, α = 0,05, power 0,80.
export const ISR_N = 155;

export function maxIndegree(paths: { to: string }[]): number {
  const n = new Map<string, number>();
  for (const { to } of paths) n.set(to, (n.get(to) ?? 0) + 1);
  return Math.max(1, ...n.values());
}

// Audience code the tool reads from its link ("dt"), from a template's audience label.
export function audienceCode(audience: string): "sv" | "ld" | "td" {
  if (/sinh viên/i.test(audience)) return "sv";
  if (/nhân viên|người lao động|người đi làm/i.test(audience)) return "ld";
  return "td";
}
