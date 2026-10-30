import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { CSV_HEADER, csvResponse, csvRows } from "@/utils/dataSeries";

// Every rich indicator in one long-format CSV: /du-lieu/tat-ca-chi-so.csv
export const GET: APIRoute = async () => {
  const datasets = (await getCollection("datasets")).sort(
    (a, b) => a.data.source.localeCompare(b.data.source) || a.data.code.localeCompare(b.data.code)
  );
  return csvResponse([CSV_HEADER.join(","), ...datasets.flatMap(ds => csvRows(ds.data))], "goc-nghien-cuu-tat-ca-chi-so.csv");
};
