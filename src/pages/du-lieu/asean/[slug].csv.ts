import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { apaCitation, csvLine, csvResponse } from "@/utils/dataSeries";

// Viet Nam vs ASEAN + China for one indicator, long format: /du-lieu/asean/<slug>.csv
export async function getStaticPaths() {
  const datasets = await getCollection("datasets");
  return datasets
    .filter(ds => ds.data.comparison?.length)
    .map(dataset => ({ params: { slug: dataset.id }, props: { dataset } }));
}

type Props = { dataset: CollectionEntry<"datasets"> };

export const GET: APIRoute<Props> = ({ props }) => {
  const d = props.dataset.data;
  const cite = apaCitation(d).text.replace(": Viet Nam [Data set]", " [Data set]");
  const src = `${d.publisher}, ${d.sourceName}`;
  const countries = [{ code: "VNM", name: "Việt Nam", values: d.values }, ...(d.comparison ?? [])];
  const lines = [
    csvLine(["country", "country_code", "indicator_code", "indicator_name", "unit", "year", "value", "source", "license", "retrieved", "citation"]),
    ...countries.flatMap(c =>
      c.values.map(p => csvLine([c.name, c.code, d.code, d.nameEn, d.unit, p.year, p.value, src, d.license, d.fetchedAt, cite]))
    ),
  ];
  return csvResponse(lines, `asean-${props.dataset.id}-${d.source}.csv`);
};
