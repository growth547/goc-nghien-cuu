// Helpers for the template pages (/mau-bang-hoi/). Pure functions, no Astro imports, so
// scripts/check-concepts.mjs can import this file and compare it with the questionnaire kit.

// Same reading as itemAnchors in src/tools/bo-khao-sat.html: an item that carries its own poles
// ("A – B", "là: tốt 1 2 3 4 5 6 7 không tốt", "(rất cao … rất thấp)"). check-concepts.mjs
// fails if the two copies disagree on any template item.
export type Anchors = { stem: string; left: string; right: string; k: number | null };
export function itemAnchors(vi: string): Anchors | null {
  const t = String(vi).trim();
  let m = t.match(/^(.*?)\s+1((?:\s+\d+){2,})\s+(.+)$/);
  if (m) {
    const k = +m[2].trim().split(/\s+/).pop()!;
    const before = m[1],
      after = m[3];
    let stem: string, left: string, right: string;
    if (before.includes(":")) {
      stem = before.slice(0, before.lastIndexOf(":") + 1).trim();
      left = before.slice(before.lastIndexOf(":") + 1).trim();
    } else {
      const w = before.trim().split(/\s+/);
      left = w.pop()!;
      stem = w.join(" ");
    }
    const br = after.indexOf("[");
    if (br > 0) {
      right = after.slice(0, br).trim();
      stem = `${stem} … ${after.slice(br).trim()}`;
    } else right = after.replace(/[.\s]+$/, "");
    return { stem, left, right, k };
  }
  m = t.match(/^(.*?)\s*\(([^()…]*?)\s*…\s*([^()…]*?)\)(.*)$/);
  if (m) {
    const left = m[2].replace(/\s*\d+$/, "").trim(),
      right = m[3].replace(/^\d+\s*/, "").trim();
    if (left && right && left.length <= 40 && right.length <= 40)
      return { stem: /^[\s.]*$/.test(m[4]) ? m[1].trim() : `${m[1]} …${m[4]}`.trim(), left, right, k: null };
  }
  m = t.match(/^([^–\/\[.?]{1,40}?)\s+[–\/]\s+([^–\/\[.?]{1,40})$/);
  if (m) return { stem: "", left: m[1].trim(), right: m[2].trim(), k: null };
  return null;
}

// The kit puts the negative pole at 1 unless the item is marked reverse.
const NEG = /(^|\s)(không|thấp|kém|tệ|xấu|có hại|vô ích|khó)(\s|$)/i;
export type Bipolar = { stem: string; low: string; high: string; swapped: boolean };
export function bipolarOf(vi: string, reverse?: boolean): Bipolar | null {
  const a = itemAnchors(vi);
  if (!a) return null;
  let left = a.left,
    right = a.right,
    swapped = false;
  if (!reverse && NEG.test(right) && !NEG.test(left)) {
    [left, right] = [right, left];
    swapped = true;
  }
  return { stem: a.stem, low: left, high: right, swapped };
}

// Override keys are "<scale slug>:<item code>"; item codes are unique within a scale.
export const overrideKey = (scaleSlug: string, itemCode: string) => `${scaleSlug}:${itemCode}`;

// Topological layers: a construct sits one column right of the furthest construct pointing to it.
export function layersOf(nodes: string[], paths: { from: string; to: string }[]): Map<string, number> {
  const layer = new Map(nodes.map(n => [n, 0]));
  for (let pass = 0; pass < nodes.length; pass++) {
    let moved = false;
    for (const p of paths) {
      const want = (layer.get(p.from) ?? 0) + 1;
      if ((layer.get(p.to) ?? 0) < want) {
        layer.set(p.to, want);
        moved = true;
      }
    }
    if (!moved) break;
  }
  return layer;
}

// Break a label into lines of at most `max` characters, at most `lines` lines.
export function wrap(text: string, max = 23, lines = 2): string[] {
  const out: string[] = [];
  let cur = "";
  for (const w of text.split(/\s+/)) {
    if (!cur) cur = w;
    else if ((cur + " " + w).length <= max) cur += " " + w;
    else {
      out.push(cur);
      cur = w;
    }
  }
  if (cur) out.push(cur);
  if (out.length > lines) {
    const head = out.slice(0, lines);
    head[lines - 1] = head[lines - 1].replace(/[,.;:]?$/, "…");
    return head;
  }
  return out;
}

export type Box = { key: string; x: number; y: number; w: number; h: number; lines: string[]; code: string };
export type Edge = { d: string; lx: number; ly: number; label: string; sign: "+" | "-" };
export type Diagram = { width: number; height: number; boxes: Box[]; edges: Edge[] };

// Lay out a path model left to right: one column per layer, boxes centred vertically,
// cubic curves between box edges; an arrow that skips a column bows above or below the boxes.
export function layoutModel(
  nodes: { key: string; name: string; code: string }[],
  paths: { from: string; to: string; sign?: "+" | "-" }[]
): Diagram {
  const W = 190,
    H = 58,
    GX = 112,
    GY = 22,
    M = 12;
  const keys = nodes.map(n => n.key);
  const layer = layersOf(keys, paths);
  const nLayers = Math.max(...keys.map(k => layer.get(k) ?? 0)) + 1;
  const cols: string[][] = Array.from({ length: nLayers }, () => []);
  keys.forEach(k => cols[layer.get(k) ?? 0].push(k));
  const tallest = Math.max(...cols.map(c => c.length));
  const skips = paths.filter(p => (layer.get(p.to) ?? 0) - (layer.get(p.from) ?? 0) > 1);
  // Room above the boxes for the first skipping arrow, below them for the second.
  const bow = skips.length ? 44 : 0,
    bowBelow = skips.length > 1 ? 44 : 0;
  const innerH = tallest * H + (tallest - 1) * GY;
  const height = innerH + 2 * M + bow + bowBelow;
  const width = nLayers * W + (nLayers - 1) * GX + 2 * M;
  const boxes = new Map<string, Box>();
  cols.forEach((col, li) => {
    const colH = col.length * H + (col.length - 1) * GY;
    const y0 = M + bow + (innerH - colH) / 2;
    col.forEach((k, i) => {
      const n = nodes.find(x => x.key === k)!;
      boxes.set(k, { key: k, x: M + li * (W + GX), y: y0 + i * (H + GY), w: W, h: H, lines: wrap(n.name), code: n.code });
    });
  });
  // Spread several arrows leaving or entering one box along its side.
  const outs = new Map<string, number[]>(),
    ins = new Map<string, number[]>();
  paths.forEach((p, i) => {
    outs.set(p.from, [...(outs.get(p.from) ?? []), i]);
    ins.set(p.to, [...(ins.get(p.to) ?? []), i]);
  });
  const slot = (list: number[], i: number, b: Box) => b.y + (b.h * (list.indexOf(i) + 1)) / (list.length + 1);
  let skipN = 0;
  const edges = paths.map((p, i): Edge => {
    const a = boxes.get(p.from)!,
      b = boxes.get(p.to)!;
    const label = `H${i + 1}${p.sign === "-" ? " (−)" : ""}`;
    const x1 = a.x + a.w,
      y1 = slot(outs.get(p.from)!, i, a),
      x2 = b.x - 6,
      y2 = slot(ins.get(p.to)!, i, b);
    if ((layer.get(p.to) ?? 0) - (layer.get(p.from) ?? 0) > 1) {
      const above = skipN++ % 2 === 0;
      const yy = above ? M + bow / 2 - 8 : height - M - bowBelow / 2 + 8;
      const xa = x1 + GX / 2,
        xb = x2 - GX / 2;
      return {
        d: `M${x1},${y1} C${xa},${y1} ${xa},${yy} ${xa + 30},${yy} L${xb - 30},${yy} C${xb},${yy} ${xb},${y2} ${x2},${y2}`,
        lx: (x1 + x2) / 2,
        ly: yy,
        label,
        sign: p.sign ?? "+",
      };
    }
    const cx = (x1 + x2) / 2;
    // Label position along the curve: near the end where arrows are still apart (the source when
    // several arrows meet in one target, the target when one source fans out), staggered otherwise.
    const nIn = ins.get(p.to)!.length,
      nOut = outs.get(p.from)!.length;
    const t =
      nIn > 1 && nOut === 1 ? 0.2 : nOut > 1 && nIn === 1 ? 0.8 : nIn > 1 ? 0.3 + (0.4 * ins.get(p.to)!.indexOf(i)) / (nIn - 1) : 0.5;
    const bz = (u: number, p0: number, p1: number, p2: number, p3: number) =>
      (1 - u) ** 3 * p0 + 3 * (1 - u) ** 2 * u * p1 + 3 * (1 - u) * u ** 2 * p2 + u ** 3 * p3;
    return {
      d: `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`,
      lx: bz(t, x1, cx, cx, x2),
      ly: bz(t, y1, y1, y2, y2),
      label,
      sign: p.sign ?? "+",
    };
  });
  return { width, height, boxes: [...boxes.values()], edges };
}

// UTF-8 safe base64url, same as b64e in the kit, for a ?k= state link.
export function b64url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach(b => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
