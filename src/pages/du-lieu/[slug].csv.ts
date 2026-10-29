import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { CSV_HEADER, csvResponse, csvRows } from "@/utils/dataSeries";

// One CSV per indicator, generated at build time: /du-lieu/<slug>.csv
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
  return csvResponse(
    [CSV_HEADER.join(","), ...csvRows(dataset.data)],
    `viet-nam-${dataset.id}-world-bank.csv`
  );
};
