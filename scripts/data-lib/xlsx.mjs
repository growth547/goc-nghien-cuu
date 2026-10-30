// Dependency-free readers for .zip archives and .xlsx worksheets (enough for the
// World Bank Pink Sheet, Penn World Table and FAOSTAT bulk files).
import { inflateRawSync } from "node:zlib";

/** Returns Map(name -> () => Buffer) for the entries of a zip archive. */
export function readZip(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 70000); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("not a zip file");
  let count = buf.readUInt16LE(eocd + 10);
  let cd = buf.readUInt32LE(eocd + 16);
  const out = new Map();
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(cd) !== 0x02014b50) throw new Error("bad zip central directory");
    const method = buf.readUInt16LE(cd + 10);
    const compSize = buf.readUInt32LE(cd + 20);
    const nameLen = buf.readUInt16LE(cd + 28);
    const extraLen = buf.readUInt16LE(cd + 30);
    const commentLen = buf.readUInt16LE(cd + 32);
    const local = buf.readUInt32LE(cd + 42);
    const name = buf.toString("utf8", cd + 46, cd + 46 + nameLen);
    out.set(name, () => {
      const lNameLen = buf.readUInt16LE(local + 26);
      const lExtraLen = buf.readUInt16LE(local + 28);
      const start = local + 30 + lNameLen + lExtraLen;
      const data = buf.subarray(start, start + compSize);
      if (method === 0) return Buffer.from(data);
      if (method === 8) return inflateRawSync(data);
      throw new Error(`zip method ${method} not supported (${name})`);
    });
    cd += 46 + nameLen + extraLen + commentLen;
  }
  return out;
}

const decodeXml = s =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, "&");

const colIndex = ref => {
  const letters = ref.match(/^[A-Z]+/)[0];
  let n = 0;
  for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
};

/** Reads an .xlsx workbook. Returns { sheetNames, sheet(name) -> array of rows (array of cell values) }. */
export function readXlsx(buf) {
  const zip = readZip(buf);
  const text = name => zip.get(name)?.().toString("utf8");
  const shared = [];
  const sst = text("xl/sharedStrings.xml");
  if (sst) {
    for (const si of sst.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
      const parts = [...si[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(m => m[1]);
      shared.push(decodeXml(parts.join("")));
    }
  }
  const wb = text("xl/workbook.xml");
  const rels = text("xl/_rels/workbook.xml.rels");
  const relTarget = {};
  for (const m of rels.matchAll(/<Relationship\b[^>]*>/g)) {
    const id = m[0].match(/Id="([^"]+)"/)[1];
    const target = m[0].match(/Target="([^"]+)"/)[1];
    relTarget[id] = target.startsWith("/") ? target.slice(1) : `xl/${target}`;
  }
  const sheets = [...wb.matchAll(/<sheet\b[^>]*>/g)].map(m => ({
    name: decodeXml(m[0].match(/name="([^"]+)"/)[1]),
    rid: m[0].match(/r:id="([^"]+)"/)[1],
  }));
  return {
    sheetNames: sheets.map(s => s.name),
    sheet(name) {
      const s = sheets.find(x => x.name === name);
      if (!s) throw new Error(`sheet ${name} not found`);
      const xml = text(relTarget[s.rid]);
      const rows = [];
      for (const r of xml.matchAll(/<row\b([^>]*)>([\s\S]*?)<\/row>/g)) {
        const rowNum = Number(r[1].match(/r="(\d+)"/)?.[1] ?? rows.length + 1);
        const row = [];
        for (const c of r[2].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
          const attrs = c[1];
          const ref = attrs.match(/r="([A-Z]+\d+)"/)?.[1];
          const t = attrs.match(/t="([^"]+)"/)?.[1];
          const body = c[2] ?? "";
          let v = body.match(/<v>([\s\S]*?)<\/v>/)?.[1];
          if (t === "inlineStr") v = [...body.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(m => m[1]).join("");
          if (v === undefined) continue;
          let val;
          if (t === "s") val = shared[Number(v)];
          else if (t === "str" || t === "inlineStr") val = decodeXml(v);
          else if (t === "b") val = v === "1";
          else if (t === "e") val = null;
          else val = Number(v);
          row[ref ? colIndex(ref) : row.length] = val;
        }
        rows[rowNum - 1] = row;
      }
      return rows;
    },
  };
}
