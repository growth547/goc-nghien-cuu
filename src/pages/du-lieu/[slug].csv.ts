import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { CSV_HEADER, csvResponse, csvRows } from "@/utils/dataSeries";

// One CSV per rich indicator, generated at build time: /du-lieu/<slug>.csv
// Long format; source, licence, retrieval date and APA citation on every row.
export async function getStaticPaths() {
  const datasets = await getCollection("datasets");
  return datasets.map(dataset => ({
    params: { slug: dataset.id },
    props: { dataset },
  }));
}

type Props = { dataset: CollectionEntry<"datasets"> };

export const GET: APIRoute<Props> = ({ props }) => {
  const { dataset } = props;
  const d = dataset.data;
  return csvResponse(
    [CSV_HEADER.join(","), ...csvRows(d)],
    `${d.kind === "world" ? "the-gioi" : "viet-nam"}-${dataset.id}-${d.source}.csv`
  );
};
