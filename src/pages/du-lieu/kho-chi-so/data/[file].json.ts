import type { APIRoute } from "astro";
import { buildExplorer } from "../../_lib/explorer";
import { richMap } from "../../_lib/richMap";

// Explorer data: /du-lieu/kho-chi-so/data/index.json (search index) and /du-lieu/kho-chi-so/data/<shard>.json
export async function getStaticPaths() {
  const { shards } = buildExplorer(await richMap());
  return [{ params: { file: "index" } }, ...[...shards.keys()].map(file => ({ params: { file } }))];
}

export const GET: APIRoute = async ({ params }) => {
  const { index, shards } = buildExplorer(await richMap());
  const body = params.file === "index" ? index : shards.get(params.file!);
  if (!body) return new Response("not found", { status: 404 });
  return new Response(JSON.stringify(body), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
