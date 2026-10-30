import type { APIRoute } from "astro";
import { csvLine, csvResponse } from "@/utils/dataSeries";
import { ASEAN_PEERS } from "../../../scripts/data-sources.mjs";
import { PANEL_FILES, panelSets } from "./_lib/panel";

// Viet Nam + ASEAN + China panel: one row per country-year, one column per indicator that has
// comparison data (long in country and year, ready for `xtset id year` / plm / EViews pool).
export const GET: APIRoute = async () => {
  const { asean } = await panelSets();
  const vars = asean.map(ds => ds.data.varName);
  const table = new Map<string, Map<string, number>>();
  for (const ds of asean) {
    const series = [{ code: "VNM", values: ds.data.values }, ...(ds.data.comparison ?? [])];
    for (const c of series) {
      for (const p of c.values) {
        const k = `${c.code}|${p.year}`;
        if (!table.has(k)) table.set(k, new Map());
        table.get(k)!.set(ds.data.varName, p.value);
      }
    }
  }
  const order = ASEAN_PEERS.map(p => p.code);
  const names = Object.fromEntries(ASEAN_PEERS.map(p => [p.code, p.name]));
  const rows = [...table.entries()].sort(([a], [b]) => {
    const [ca, ya] = a.split("|");
    const [cb, yb] = b.split("|");
    return order.indexOf(ca) - order.indexOf(cb) || Number(ya) - Number(yb);
  });
  return csvResponse(
    [
      csvLine(["id", "country_code", "country", "year", ...vars]),
      ...rows.map(([k, m]) => {
        const [code, year] = k.split("|");
        return csvLine([order.indexOf(code) + 1, code, names[code], year, ...vars.map(v => m.get(v) ?? "")]);
      }),
    ],
    PANEL_FILES.asean
  );
};
