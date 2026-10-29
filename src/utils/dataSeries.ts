// Helpers for the /du-lieu/ secondary-data pages: number formatting, CSV, citation and a
// build-time SVG line chart (no client-side chart library).
import type { CollectionEntry } from "astro:content";

export type Dataset = CollectionEntry<"datasets">;
export type Point = { year: number; value: number };

export const yearSpan = (d: Dataset["data"]) => {
  const first = d.values[0].year;
  const last = d.values[d.values.length - 1].year;
  return { first, last };
};

export const pageTitleOf = (d: Dataset["data"]) => {
  const { first, last } = yearSpan(d);
  return `Số liệu ${d.shortVi} Việt Nam qua các năm (${first}–${last}): tải CSV`;
};

export const formatNumber = (value: number, decimals: number) =>
  new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

/** Value as shown on the page: divided by the display scale, in the display unit. */
export const displayValue = (d: Dataset["data"], value: number) =>
  formatNumber(value / d.scale, d.decimals);

/** Percent-type indicators change in percentage points; levels change in %. */
export const isRate = (d: Dataset["data"]) => d.displayUnit.startsWith("%");

export const changeOf = (
  d: Dataset["data"],
  prev: Point | undefined,
  cur: Point
): string => {
  if (!prev || prev.year !== cur.year - 1) return "";
  if (isRate(d)) {
    const diff = (cur.value - prev.value) / d.scale;
    return `${diff > 0 ? "+" : ""}${formatNumber(diff, 2)} điểm %`;
  }
  if (prev.value === 0) return "";
  const pct = ((cur.value - prev.value) / Math.abs(prev.value)) * 100;
  return `${pct > 0 ? "+" : ""}${formatNumber(pct, 1)}%`;
};

const csvCell = (v: string | number) => {
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const CSV_HEADER = [
  "country",
  "country_code",
  "indicator_code",
  "indicator_name",
  "unit",
  "year",
  "value",
];

/** Long-format rows; values keep full precision in the raw unit. */
export const csvRows = (d: Dataset["data"]) =>
  d.values.map(p =>
    [
      "Viet Nam",
      "VNM",
      d.code,
      d.nameEn,
      d.unit,
      p.year,
      p.value,
    ]
      .map(csvCell)
      .join(",")
  );

/** UTF-8 BOM so Excel opens Vietnamese/English text correctly. */
export const csvResponse = (lines: string[], filename: string) =>
  new Response("﻿" + lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });

const MONTHS = [
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

/** APA 7 reference for a dataset that changes over time (with retrieval date). */
export const apaCitation = (d: Dataset["data"]) => {
  const year = d.lastUpdated.slice(0, 4);
  const [y, m, day] = d.fetchedAt.split("-").map(Number);
  const retrieved = `${MONTHS[m - 1]} ${day}, ${y}`;
  const esc = (v: string) =>
    v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return {
    html: `World Bank. (${year}). <em>${esc(d.nameEn)}: Viet Nam</em> [Data set]. World Development Indicators. Retrieved ${retrieved}, from ${esc(d.dataUrl)}`,
    text: `World Bank. (${year}). ${d.nameEn}: Viet Nam [Data set]. World Development Indicators. Retrieved ${retrieved}, from ${d.dataUrl}`,
    inText: `(World Bank, ${year})`,
  };
};

/** "Nice" tick step for an axis covering `range` with about `count` ticks. */
const niceStep = (range: number, count: number) => {
  const raw = range / Math.max(1, count);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return nice * mag;
};

export type Chart = {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  path: string;
  dots: { x: number; y: number; year: number; label: string }[];
  yTicks: { y: number; label: string }[];
  xTicks: { x: number; label: string }[];
  zeroY: number | null;
};

/** Lays out a line chart in SVG user units; gaps between non-consecutive years break the line. */
export const buildChart = (d: Dataset["data"]): Chart => {
  const width = 720;
  const height = 300;
  const left = 64;
  const right = width - 16;
  const top = 16;
  const bottom = height - 32;
  const pts = d.values.map(p => ({ year: p.year, v: p.value / d.scale }));
  const { first, last } = yearSpan(d);

  let lo = Math.min(...pts.map(p => p.v));
  let hi = Math.max(...pts.map(p => p.v));
  if (lo === hi) {
    lo -= 1;
    hi += 1;
  }
  const step = niceStep(hi - lo, 5);
  lo = Math.floor(lo / step) * step;
  hi = Math.ceil(hi / step) * step;
  // Anchor the axis at zero when the data sit close to it, so changes are not exaggerated.
  if (lo > 0 && lo <= (hi - lo) * 0.5) lo = 0;

  const xOf = (year: number) =>
    first === last ? (left + right) / 2 : left + ((year - first) / (last - first)) * (right - left);
  const yOf = (v: number) => bottom - ((v - lo) / (hi - lo)) * (bottom - top);

  let path = "";
  pts.forEach((p, i) => {
    const cmd = i === 0 || p.year - pts[i - 1].year > 1 ? "M" : "L";
    path += `${cmd}${xOf(p.year).toFixed(1)},${yOf(p.v).toFixed(1)}`;
  });

  let tickDecimals = 0;
  while (tickDecimals < 3 && Math.abs(Math.round(step * 10 ** tickDecimals) - step * 10 ** tickDecimals) > 1e-6) tickDecimals++;
  const yTicks: Chart["yTicks"] = [];
  for (let v = lo; v <= hi + step / 2; v += step) {
    yTicks.push({ y: yOf(v), label: formatNumber(v, tickDecimals) });
  }

  const span = last - first;
  const yearStep = span <= 12 ? 2 : span <= 25 ? 5 : span <= 50 ? 10 : 15;
  const xTicks: Chart["xTicks"] = [];
  const startYear = Math.ceil(first / yearStep) * yearStep;
  for (let y = startYear; y <= last; y += yearStep) {
    xTicks.push({ x: xOf(y), label: String(y) });
  }

  const isolated = (i: number) =>
    (i === 0 || pts[i].year - pts[i - 1].year > 1) &&
    (i === pts.length - 1 || pts[i + 1].year - pts[i].year > 1);
  const dots = pts
    .map((p, i) => ({ p, i }))
    .filter(({ i }) => pts.length <= 20 || isolated(i) || i === pts.length - 1)
    .map(({ p }) => ({
      x: xOf(p.year),
      y: yOf(p.v),
      year: p.year,
      label: formatNumber(p.v, d.decimals),
    }));

  return {
    width,
    height,
    left,
    right,
    top,
    bottom,
    path,
    dots,
    yTicks,
    xTicks,
    zeroY: lo < 0 && hi > 0 ? yOf(0) : null,
  };
};
