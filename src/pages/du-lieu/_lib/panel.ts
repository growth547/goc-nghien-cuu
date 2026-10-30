// Panel-ready downloads built from the rich indicators (see /du-lieu/du-lieu-bang/ for documentation).
import { getCollection } from "astro:content";
import { apaCitation, type Dataset } from "@/utils/dataSeries";

export const PANEL_FILES = {
  wide: "viet-nam-bang-rong.csv",
  asean: "asean-bang-nuoc-nam.csv",
  monthly: "gia-hang-hoa-theo-thang.csv",
  codebook: "codebook.csv",
} as const;

const byVar = (a: Dataset, b: Dataset) => a.data.varName.localeCompare(b.data.varName);

export async function panelSets() {
  const all = (await getCollection("datasets")).sort(byVar);
  const vnAnnual = all.filter(ds => ds.data.kind === "country" && ds.data.frequency === "A");
  const asean = vnAnnual.filter(ds => ds.data.comparison?.length);
  const monthly = all.filter(ds => ds.data.frequency === "M");
  return { all, vnAnnual, asean, monthly };
}

/** Rows keyed by an id (year or "YYYY-MM"), one column per dataset. */
export function widen(sets: Dataset[], keyOf: (p: { year: number; month?: number }) => string, valuesOf = (ds: Dataset) => ds.data.values) {
  const table = new Map<string, Map<string, number>>();
  for (const ds of sets) {
    for (const p of valuesOf(ds)) {
      const k = keyOf(p);
      if (!table.has(k)) table.set(k, new Map());
      table.get(k)!.set(ds.data.varName, p.value);
    }
  }
  return [...table.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export const codebookRow = (ds: Dataset, file: string) => {
  const d = ds.data;
  return [
    d.varName,
    file,
    d.nameVi,
    d.nameEn,
    d.unit,
    d.frequency === "M" ? "monthly" : "annual",
    d.code,
    `${d.publisher}, ${d.sourceName}`,
    d.license,
    d.licenseUrl,
    d.fetchedAt,
    apaCitation(d).text,
  ];
};

export const CODEBOOK_HEADER = [
  "variable",
  "file",
  "label_vi",
  "name_en",
  "unit",
  "frequency",
  "source_code",
  "source",
  "license",
  "license_url",
  "retrieved",
  "citation_apa",
];
