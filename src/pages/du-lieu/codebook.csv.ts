import type { APIRoute } from "astro";
import { csvLine, csvResponse } from "@/utils/dataSeries";
import { CODEBOOK_HEADER, PANEL_FILES, codebookRow, panelSets } from "./_lib/panel";

// Codebook for the panel CSVs: variable name, Vietnamese label, unit, source, licence, retrieval date, APA.
export const GET: APIRoute = async () => {
  const { vnAnnual, asean, monthly } = await panelSets();
  const aseanVars = new Set(asean.map(ds => ds.data.varName));
  const lines = [
    csvLine(CODEBOOK_HEADER),
    ...vnAnnual.map(ds =>
      csvLine(codebookRow(ds, aseanVars.has(ds.data.varName) ? `${PANEL_FILES.wide}; ${PANEL_FILES.asean}` : PANEL_FILES.wide))
    ),
    ...monthly.map(ds => csvLine(codebookRow(ds, PANEL_FILES.monthly))),
  ];
  return csvResponse(lines, PANEL_FILES.codebook);
};
