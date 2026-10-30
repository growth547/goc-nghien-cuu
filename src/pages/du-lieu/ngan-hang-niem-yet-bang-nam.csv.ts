import type { APIRoute } from "astro";
import { csvLine, csvResponse } from "@/utils/dataSeries";
import { BANK_FILES, PANEL_ITEMS, VARIABLES, computed, panel, round } from "./_lib/banks";

// Listed banks, wide bank-year panel: raw items (VND million) + computed variables (ratios, Z-score).
// Empty cell = value not published (missing, flagged, or not disclosed in the statements).
export const GET: APIRoute = () => {
  const t = panel();
  const banks = [...t.keys()].sort();
  const header = ["bank", "id", "year", ...PANEL_ITEMS, ...VARIABLES.map(v => v.code)];
  const lines = [csvLine(header)];
  banks.forEach((bank, i) => {
    const rows = t.get(bank)!;
    const comp = computed(rows);
    for (const y of [...rows.keys()].sort()) {
      const r = rows.get(y)!;
      const c = comp.get(y)!;
      lines.push(csvLine([bank, i + 1, y, ...PANEL_ITEMS.map(k => r[k] ?? ""), ...VARIABLES.map(v => round(c[v.code]))]));
    }
  });
  return csvResponse(lines, BANK_FILES.panel);
};
