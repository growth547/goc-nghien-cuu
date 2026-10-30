// Helpers for the /du-lieu/ secondary-data pages: number formatting, CSV, APA citation and
// build-time SVG line charts (no client-side chart library). Data files are written by
// scripts/fetch-data.mjs; licences are recorded in scripts/data-sources.mjs.
import type { CollectionEntry } from "astro:content";

export type Dataset = CollectionEntry<"datasets">;
export type DatasetData = Dataset["data"];
export type Point = { year: number; month?: number; value: number };

export const isMonthly = (d: DatasetData) => d.frequency === "M";

export const yearSpan = (d: { values: Point[] }) => ({
  first: d.values[0].year,
  last: d.values[d.values.length - 1].year,
});

export const pad2 = (n: number) => String(n).padStart(2, "0");
/** "2024" for annual points, "03/2024" for monthly points. */
export const periodLabel = (p: Point) => (p.month ? `${pad2(p.month)}/${p.year}` : String(p.year));
/** ISO-like period used in CSVs: "2024" or "2024-03". */
export const periodIso = (p: Point) => (p.month ? `${p.year}-${pad2(p.month)}` : String(p.year));

export const formatNumber = (value: number, decimals: number) =>
  new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

/** Value as shown on the page: divided by the display scale, in the display unit. */
export const displayValue = (d: DatasetData, value: number) => formatNumber(value / d.scale, d.decimals);

/** Percent-type indicators change in percentage points; levels change in %. */
export const isRate = (d: DatasetData) => d.displayUnit.startsWith("%") || d.displayUnit === "điểm %";

const consecutive = (prev: Point, cur: Point) =>
  cur.month
    ? (prev.year === cur.year && prev.month === cur.month - 1) ||
      (prev.year === cur.year - 1 && prev.month === 12 && cur.month === 1)
    : prev.year === cur.year - 1;

export const changeOf = (d: DatasetData, prev: Point | undefined, cur: Point): string => {
  if (!prev || !consecutive(prev, cur)) return "";
  if (isRate(d)) {
    const diff = (cur.value - prev.value) / d.scale;
    return `${diff > 0 ? "+" : ""}${formatNumber(diff, 2)} điểm %`;
  }
  if (prev.value === 0) return "";
  const pct = ((cur.value - prev.value) / Math.abs(prev.value)) * 100;
  return `${pct > 0 ? "+" : ""}${formatNumber(pct, 1)}%`;
};

/** Calendar-year averages of a monthly series, with the number of months behind each average. */
export const annualAverages = (values: Point[]) => {
  const by = new Map<number, number[]>();
  for (const p of values) by.set(p.year, [...(by.get(p.year) ?? []), p.value]);
  return [...by.entries()].map(([year, vs]) => ({
    year,
    value: vs.reduce((a, b) => a + b, 0) / vs.length,
    months: vs.length,
  }));
};

// ---------------------------------------------------------------- citation
const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const IN_TEXT: Record<string, string> = {
  "World Bank": "World Bank",
  "International Labour Organization": "International Labour Organization [ILO]",
  "Food and Agriculture Organization of the United Nations": "Food and Agriculture Organization of the United Nations [FAO]",
};

export const retrievedOf = (fetchedAt: string) => {
  const [y, m, day] = fetchedAt.split("-").map(Number);
  return `${MONTHS_EN[m - 1]} ${day}, ${y}`;
};

type CiteInput = Pick<DatasetData, "citation" | "lastUpdated" | "fetchedAt" | "nameEn" | "dataUrl" | "kind" | "frequency">;

/** APA 7 reference for a dataset that changes over time (with retrieval date). */
export const apaCitation = (d: CiteInput) => {
  const c = d.citation;
  const year = d.lastUpdated.slice(0, 4);
  const author = /\.$/.test(c.author) ? c.author : `${c.author}.`;
  const retrieved = retrievedOf(d.fetchedAt);
  const note = c.licenceNote ? ` ${c.licenceNote}` : "";
  if (c.doi) {
    const pub = c.publisher ? ` ${c.publisher}.` : "";
    return {
      html: `${esc(author)} (${year}). <em>${esc(c.container)}</em> [Data set].${esc(pub)} ${esc(c.doi)}`,
      text: `${author} (${year}). ${c.container} [Data set].${pub} ${c.doi}`,
      inText: `(Feenstra et al., ${year})`,
      article: c.article,
    };
  }
  const title =
    d.kind === "world" ? `${d.nameEn}${d.frequency === "M" ? " (monthly)" : ""}` : `${d.nameEn}: Viet Nam`;
  return {
    html: `${esc(author)} (${year}). <em>${esc(title)}</em> [Data set]. ${esc(c.container)}. Retrieved ${retrieved}, from ${esc(d.dataUrl)}${esc(note)}`,
    text: `${author} (${year}). ${title} [Data set]. ${c.container}. Retrieved ${retrieved}, from ${d.dataUrl}${note}`,
    inText: `(${IN_TEXT[c.author] ?? c.author}, ${year})`,
    article: c.article,
  };
};

// ---------------------------------------------------------------- CSV
export const csvCell = (v: string | number | undefined | null) => {
  const s = v === undefined || v === null ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
export const csvLine = (cells: (string | number | undefined | null)[]) => cells.map(csvCell).join(",");

export const CSV_HEADER = [
  "country",
  "country_code",
  "indicator_code",
  "indicator_name",
  "unit",
  "year",
  "month",
  "value",
  "source",
  "license",
  "retrieved",
  "citation",
];

const areaOf = (d: DatasetData) => (d.kind === "world" ? ["World market", "WLD"] : ["Viet Nam", "VNM"]);

/** Long-format rows; values keep full precision in the raw unit. Source, licence, date and APA on every row. */
export const csvRows = (d: DatasetData) => {
  const [country, iso] = areaOf(d);
  const cite = apaCitation(d).text;
  return d.values.map(p =>
    csvLine([
      country,
      iso,
      d.code,
      d.nameEn,
      d.unit,
      p.year,
      p.month ?? "",
      p.value,
      `${d.publisher}, ${d.sourceName}`,
      d.license,
      d.fetchedAt,
      cite,
    ])
  );
};

/** UTF-8 BOM so Excel opens Vietnamese/English text correctly. */
export const csvResponse = (lines: string[], filename: string) =>
  new Response("﻿" + lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });

// ---------------------------------------------------------------- charts
/** "Nice" tick step for an axis covering `range` with about `count` ticks. */
const niceStep = (range: number, count: number) => {
  const raw = range / Math.max(1, count);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return nice * mag;
};

export type ChartSeries = { key: string; label: string; values: Point[] };
export type Chart = {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  lines: { key: string; label: string; path: string }[];
  dots: { x: number; y: number; label: string; text: string }[];
  yTicks: { y: number; label: string }[];
  xTicks: { x: number; label: string }[];
  zeroY: number | null;
};

const tOf = (p: Point) => p.year + ((p.month ?? 1) - 1) / 12;

/**
 * Lays out one or more line series in SVG user units; gaps (missing years/months) break the line.
 * Values are divided by `scale` (display unit). Dots are drawn for the first series when it is short.
 */
export const buildChart = (series: ChartSeries[], scale: number, decimals: number, monthly = false): Chart => {
  const width = 720;
  const height = 300;
  const left = 64;
  const right = width - 16;
  const top = 16;
  const bottom = height - 32;
  const all = series.flatMap(s => s.values);
  const t0 = Math.min(...all.map(tOf));
  const t1 = Math.max(...all.map(tOf));

  let lo = Math.min(...all.map(p => p.value / scale));
  let hi = Math.max(...all.map(p => p.value / scale));
  if (lo === hi) {
    lo -= 1;
    hi += 1;
  }
  const step = niceStep(hi - lo, 5);
  lo = Math.floor(lo / step) * step;
  hi = Math.ceil(hi / step) * step;
  // Anchor the axis at zero when the data sit close to it, so changes are not exaggerated.
  if (lo > 0 && lo <= (hi - lo) * 0.5) lo = 0;

  const xOf = (t: number) => (t0 === t1 ? (left + right) / 2 : left + ((t - t0) / (t1 - t0)) * (right - left));
  const yOf = (v: number) => bottom - ((v - lo) / (hi - lo)) * (bottom - top);
  const gap = monthly ? 1 / 12 + 1e-6 : 1 + 1e-6;

  const lines = series.map(s => {
    let path = "";
    s.values.forEach((p, i) => {
      const cmd = i === 0 || tOf(p) - tOf(s.values[i - 1]) > gap ? "M" : "L";
      path += `${cmd}${xOf(tOf(p)).toFixed(1)},${yOf(p.value / scale).toFixed(1)}`;
    });
    return { key: s.key, label: s.label, path };
  });

  let tickDecimals = 0;
  while (tickDecimals < 3 && Math.abs(Math.round(step * 10 ** tickDecimals) - step * 10 ** tickDecimals) > 1e-6)
    tickDecimals++;
  const yTicks: Chart["yTicks"] = [];
  for (let v = lo; v <= hi + step / 2; v += step) yTicks.push({ y: yOf(v), label: formatNumber(v, tickDecimals) });

  const firstYear = Math.floor(t0);
  const lastYear = Math.floor(t1);
  const span = lastYear - firstYear;
  const yearStep = span <= 12 ? 2 : span <= 25 ? 5 : span <= 50 ? 10 : 15;
  const xTicks: Chart["xTicks"] = [];
  for (let y = Math.ceil(firstYear / yearStep) * yearStep; y <= lastYear; y += yearStep) {
    if (y >= t0) xTicks.push({ x: xOf(y), label: String(y) });
  }

  const main = series[0]?.values ?? [];
  const isolated = (i: number) =>
    (i === 0 || tOf(main[i]) - tOf(main[i - 1]) > gap) &&
    (i === main.length - 1 || tOf(main[i + 1]) - tOf(main[i]) > gap);
  const dots = main
    .map((p, i) => ({ p, i }))
    .filter(({ i }) => main.length <= 20 || isolated(i) || i === main.length - 1)
    .map(({ p }) => ({
      x: xOf(tOf(p)),
      y: yOf(p.value / scale),
      label: periodLabel(p),
      text: formatNumber(p.value / scale, decimals),
    }));

  return {
    width,
    height,
    left,
    right,
    top,
    bottom,
    lines,
    dots,
    yTicks,
    xTicks,
    zeroY: lo < 0 && hi > 0 ? yOf(0) : null,
  };
};
