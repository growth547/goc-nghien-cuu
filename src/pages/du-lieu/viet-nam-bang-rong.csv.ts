import type { APIRoute } from "astro";
import { csvLine, csvResponse } from "@/utils/dataSeries";
import { PANEL_FILES, panelSets, widen } from "./_lib/panel";

// Viet Nam, wide format: one row per year, one column per annual indicator (Stata/R/EViews ready).
// Variable labels, units, sources, licences and APA citations: /du-lieu/codebook.csv
export const GET: APIRoute = async () => {
  const { vnAnnual } = await panelSets();
  const vars = vnAnnual.map(ds => ds.data.varName);
  const rows = widen(vnAnnual, p => String(p.year));
  return csvResponse(
    [csvLine(["year", ...vars]), ...rows.map(([year, m]) => csvLine([year, ...vars.map(v => m.get(v) ?? "")]))],
    PANEL_FILES.wide
  );
};
