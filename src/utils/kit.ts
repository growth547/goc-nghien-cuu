// Server-side twins of the pure helpers in src/tools/bo-khao-sat.html (the
// questionnaire kit), used to render template pages statically for search
// engines. scripts/check-kit.mjs checks both copies agree on every construct.

const PH_RE = /\[([^\]]+)\]/g;

export function fillPlaceholders(text: string, values: Record<string, string>): string {
  return text.replace(PH_RE, (all, key: string) => {
    const v = (values[key.toLowerCase()] || "").trim();
    if (!v) return all;
    return key[0] !== key[0].toLowerCase() ? v[0].toUpperCase() + v.slice(1) : v;
  });
}

export function citeOf(source: string): string {
  const m = source.match(
    /([A-ZÀ-Ỹ][\p{L}.'\-]+(?:(?:, | & | và )[A-ZÀ-Ỹ][\p{L}.'\-]+)*(?: và cộng sự)?)\s*\((\d{4})/u
  );
  return m ? `${m[1].replace(/ & /g, " và ")} (${m[2]})` : source;
}

export function citedBy(cite: string, ref: string): boolean {
  const m = cite.match(/^([^\s,]+)(.*)\((\d{4})\)$/);
  if (!m) return false;
  const solo = !/,| và /.test(m[2]);
  return ref.startsWith(m[1]) && ref.includes(`(${m[3]})`) && (!solo || !ref.includes("&"));
}

export const isAgreementScale = (responseScale: string) => /^Likert/i.test(responseScale);

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
