// Builds the "Kho chỉ số" explorer data (compact search index + data shards) at build time from
// the raw source caches written by scripts/fetch-data.mjs (src/data/du-lieu/raw/<source>.json).
import { SOURCES } from "../../../../scripts/data-sources.mjs";

type RawSeries = {
  nameEn: string;
  unit: string;
  freq: "A" | "M";
  note?: string;
  org?: string;
  topics?: string[];
  license?: string;
  values: [number | string, number][];
};
type Raw = { source: string; fetchedAt: string; lastUpdated: string; fileUrl?: string; series: Record<string, RawSeries> };

const files = import.meta.glob<Raw>("/src/data/du-lieu/raw/*.json", { eager: true, import: "default" });
const ORDER = ["wdi", "wgi", "gfdd", "ilostat", "pwt", "faostat", "pink"];
export const raws: Raw[] = Object.values(files).sort((a, b) => ORDER.indexOf(a.source) - ORDER.indexOf(b.source));

// World Bank topic names (first topic of a series) and per-source defaults, in Vietnamese.
const TOPIC_VI: Record<string, string> = {
  "Economy & Growth": "Kinh tế & tăng trưởng",
  "Financial Sector": "Tài chính – ngân hàng",
  "Trade": "Thương mại",
  "External Debt": "Nợ nước ngoài",
  "Private Sector": "Doanh nghiệp & khu vực tư nhân",
  "Public Sector": "Khu vực công",
  "Social Protection & Labor": "Lao động & an sinh",
  "Poverty": "Nghèo & bất bình đẳng",
  "Education": "Giáo dục",
  "Health": "Y tế",
  "Gender": "Giới",
  "Social Development": "Phát triển xã hội",
  "Urban Development": "Đô thị",
  "Agriculture & Rural Development": "Nông nghiệp & nông thôn",
  "Environment": "Môi trường",
  "Climate Change": "Biến đổi khí hậu",
  "Energy & Mining": "Năng lượng & khai khoáng",
  "Infrastructure": "Hạ tầng",
  "Science & Technology": "Khoa học & công nghệ",
  "Aid Effectiveness": "Viện trợ phát triển",
};
const SOURCE_TOPIC: Record<string, string> = {
  wgi: "Quản trị nhà nước",
  gfdd: "Tài chính – ngân hàng",
  ilostat: "Lao động & an sinh",
  pwt: "Năng suất & tăng trưởng (PWT)",
  faostat: "Giá nông sản Việt Nam (FAOSTAT)",
  pink: "Giá hàng hoá thế giới",
};
const topicOf = (src: string, s: RawSeries) =>
  SOURCE_TOPIC[src] ?? TOPIC_VI[s.topics?.[0] ?? ""] ?? "Chỉ số khác";

export type ExplorerItem = {
  id: string; // "<source>:<code>"
  n: string; // English name
  s: string; // source key
  t: number; // topic index
  u: string; // unit
  f: "A" | "M";
  a: string; // first period
  b: string; // last period
  c: number; // number of observations
  k: string; // shard file
  r?: string; // rich page slug
  v?: string; // Vietnamese name (rich pages only)
};

const SHARD_BYTES = 90_000;

/** Values as [first period, values with null for gaps]. */
function compact(s: RawSeries): [string, (number | null)[]] {
  if (s.freq === "M") {
    const idx = (p: string) => Number(p.slice(0, 4)) * 12 + Number(p.slice(5, 7)) - 1;
    const start = idx(String(s.values[0][0]));
    const out: (number | null)[] = [];
    for (const [p, v] of s.values) out[idx(String(p)) - start] = v;
    return [String(s.values[0][0]), Array.from(out, v => (v === undefined ? null : v))];
  }
  const start = Number(s.values[0][0]);
  const out: (number | null)[] = [];
  for (const [p, v] of s.values) out[Number(p) - start] = v;
  return [String(start), Array.from(out, v => (v === undefined ? null : v))];
}

let cache: { index: object; shards: Map<string, Record<string, [string, (number | null)[]]>> } | null = null;

export function buildExplorer(rich: Map<string, { slug: string; nameVi: string }>) {
  if (cache) return cache;
  const topics: string[] = [];
  const items: ExplorerItem[] = [];
  const shards = new Map<string, Record<string, [string, (number | null)[]]>>();
  const sources: Record<string, object> = {};
  for (const raw of raws) {
    const src = raw.source;
    const meta = (SOURCES as Record<string, any>)[src];
    if (!meta) continue;
    sources[src] = {
      name: meta.name,
      org: meta.org,
      license: meta.license,
      licenseShort: meta.licenseShort,
      licenseUrl: meta.licenseUrl,
      termsUrl: meta.termsUrl,
      homeUrl: meta.homeUrl,
      author: meta.apa.author,
      container: meta.apa.container,
      doi: meta.apa.doi ?? null,
      publisher: meta.apa.publisher ?? null,
      licenceNote: src === "faostat" ? "Licence: CC-BY-4.0." : null,
      lastUpdated: raw.lastUpdated,
      fetchedAt: raw.fetchedAt,
    };
    let n = 0;
    let bytes = 0;
    let shard = `${src}-${n}`;
    for (const code of Object.keys(raw.series).sort()) {
      const s = raw.series[code];
      if (!s.values?.length) continue;
      const data = compact(s);
      const size = JSON.stringify(data).length + code.length + 8;
      if (bytes + size > SHARD_BYTES && bytes > 0) {
        n++;
        bytes = 0;
        shard = `${src}-${n}`;
      }
      bytes += size;
      if (!shards.has(shard)) shards.set(shard, {});
      const id = `${src}:${code}`;
      shards.get(shard)![id] = data;
      const topic = topicOf(src, s);
      if (!topics.includes(topic)) topics.push(topic);
      const r = rich.get(id);
      items.push({
        id,
        n: s.nameEn,
        s: src,
        t: topics.indexOf(topic),
        u: s.unit ?? "",
        f: s.freq,
        a: String(s.values[0][0]),
        b: String(s.values[s.values.length - 1][0]),
        c: s.values.length,
        k: shard,
        ...(r ? { r: r.slug, v: r.nameVi } : {}),
      });
    }
  }
  cache = { index: { sources, topics, items }, shards };
  return cache;
}
