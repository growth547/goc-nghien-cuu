import type { APIRoute } from "astro";
import { csvLine, csvResponse, pad2 } from "@/utils/dataSeries";
import { PANEL_FILES, panelSets, widen } from "./_lib/panel";

// World commodity prices (World Bank Pink Sheet), wide monthly: one row per month, one column per series.
export const GET: APIRoute = async () => {
  const { monthly } = await panelSets();
  const vars = monthly.map(ds => ds.data.varName);
  const rows = widen(monthly, p => `${p.year}-${pad2(p.month ?? 1)}`);
  return csvResponse(
    [
      csvLine(["period", "year", "month", ...vars]),
      ...rows.map(([period, m]) => csvLine([period, period.slice(0, 4), Number(period.slice(5, 7)), ...vars.map(v => m.get(v) ?? "")])),
    ],
    PANEL_FILES.monthly
  );
};
