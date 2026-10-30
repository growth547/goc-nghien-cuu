import { getCollection } from "astro:content";

/** "<source>:<code>" → rich page slug and Vietnamese name, for linking explorer rows to rich pages. */
export async function richMap() {
  const all = await getCollection("datasets");
  return new Map(all.map(ds => [`${ds.data.source}:${ds.data.code}`, { slug: ds.id, nameVi: ds.data.nameVi }]));
}
