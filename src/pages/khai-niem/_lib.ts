// Helpers for the concept pages (/khai-niem/): a short answer-format label and the reverse-scoring
// rule of each scale, read from its responseScale with the same parser as the questionnaire kit.
import { parseResponseScale, reverseRuleOf } from "../../utils/kit";
import { itemAnchors } from "../mau-bang-hoi/_lib";

type Item = { vi: string; reverse?: boolean };

export function responseLabel(responseScale: string, items: Item[]): string {
  const P = parseResponseScale(responseScale);
  const keys = Object.keys(P.labels).map(Number);
  const hi = keys.length ? Math.max(...keys) : null;
  const bip = items.filter(i => itemAnchors(i.vi)).length;
  if (bip === items.length || /đối nghĩa/i.test(responseScale.split(".")[0])) return `Đối nghĩa ${P.points ?? 7} mức`;
  if (P.agree) {
    const base = P.ambiguous ? "Likert 5 hoặc 7 mức" : hi && P.points && hi !== P.points && hi > 2 ? `Likert ${Math.min(hi, P.points)} hoặc ${Math.max(hi, P.points)} mức` : `Likert ${P.points ?? 5} mức`;
    return bip ? `${base}, kèm câu đối nghĩa` : base;
  }
  const lo = P.labels[P.min],
    top = P.points ? P.labels[P.min + P.points - 1] : undefined;
  if (lo && top && P.points) return `${P.points} mức: ${P.min} = ${lo} … ${P.min + P.points - 1} = ${top}`;
  return `Thang ${P.points ?? 5} mức`;
}

// Reverse scoring on the scale's own range. CBI is scored 0–100 before averaging, so its reversed
// item is 100 − điểm; agreement scales use (số mức + 1) − điểm.
export function reverseRule(responseScale: string): string {
  if (/Quy điểm 100/.test(responseScale)) return "quy về 0–100 rồi lấy 100 − điểm";
  const P = parseResponseScale(responseScale);
  if (P.agree) {
    const keys = Object.keys(P.labels).map(Number);
    const hi = keys.length ? Math.max(...keys) : null;
    if (P.ambiguous || (hi && P.points && hi !== P.points && hi > 2)) return "(số mức + 1) − điểm, ví dụ thang 5 mức: 6 − điểm, thang 7 mức: 8 − điểm";
    return `${(P.points ?? 5) + 1} − điểm`;
  }
  return reverseRuleOf(responseScale);
}
