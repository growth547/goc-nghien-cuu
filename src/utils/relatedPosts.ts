// "Bài liên quan" under each post: up to N posts sharing a tag. Ties are broken toward posts the
// source does not already link to and posts that have fewer links from other posts so far, so the
// block spreads links over the whole guide library instead of piling them on the same few posts.
import type { CollectionEntry } from "astro:content";

const slugOf = (p: CollectionEntry<"posts">) => p.id.split("/").pop()!;
const linksIn = (p: CollectionEntry<"posts">) =>
  new Set([...(p.body ?? "").matchAll(/href="\/posts\/([a-z0-9-]+)\/?/g)].map(m => m[1]));

export function relatedPosts(posts: CollectionEntry<"posts">[], n = 5) {
  const inbound = new Map<string, number>(posts.map(p => [slugOf(p), 0]));
  const links = new Map(posts.map(p => [slugOf(p), linksIn(p)]));
  for (const [src, set] of links) for (const t of set) if (t !== src && inbound.has(t)) inbound.set(t, inbound.get(t)! + 1);
  const result = new Map<string, CollectionEntry<"posts">[]>();
  const ordered = [...posts].sort((a, b) => a.data.pubDatetime.valueOf() - b.data.pubDatetime.valueOf());
  for (const post of ordered) {
    const me = slugOf(post);
    const tags = new Set(post.data.tags);
    const already = links.get(me)!;
    const picks = ordered
      .filter(p => slugOf(p) !== me)
      .map(p => ({ p, shared: Math.min(2, p.data.tags.filter(t => tags.has(t)).length) }))
      .filter(x => x.shared > 0)
      .sort(
        (a, b) =>
          b.shared - a.shared ||
          Number(already.has(slugOf(a.p))) - Number(already.has(slugOf(b.p))) ||
          inbound.get(slugOf(a.p))! - inbound.get(slugOf(b.p))! ||
          slugOf(a.p).localeCompare(slugOf(b.p))
      )
      .slice(0, n)
      .map(x => x.p);
    for (const p of picks) if (!already.has(slugOf(p))) inbound.set(slugOf(p), inbound.get(slugOf(p))! + 1);
    result.set(me, picks);
  }
  return result;
}
