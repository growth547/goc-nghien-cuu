// Small fetch helpers with retries, shared by the data source fetchers.
import { execFileSync } from "node:child_process";

export const sleep = ms => new Promise(r => setTimeout(r, ms));

const UA = "goc-nghien-cuu-data-bot/1.0 (+https://growth547.github.io/goc-nghien-cuu/du-lieu/)";

async function withRetry(url, fn, tries = 4, timeoutMs = 120000) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, {
        headers: { "user-agent": UA },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await fn(res);
    } catch (e) {
      if (i >= tries) throw new Error(`${url}: ${e.message}`);
      await sleep(1500 * i);
    }
  }
}

export const getJson = (url, tries) => withRetry(url, r => r.json(), tries);
// Some APIs behind Cloudflare (ILOSTAT SDMX) reject Node's TLS fingerprint but accept curl.
export const getTextCurl = url =>
  execFileSync("curl", ["-sSfL", "--retry", "3", "--max-time", "300", url], { maxBuffer: 1 << 28 }).toString("utf8");

export const getText = async (url, tries) => {
  try {
    return await withRetry(url, r => r.text(), tries);
  } catch (e) {
    try {
      return getTextCurl(url);
    } catch {
      throw e;
    }
  }
};
export const getBuffer = (url, tries) =>
  withRetry(url, async r => Buffer.from(await r.arrayBuffer()), tries, 300000);

/** Minimal CSV parser (RFC 4180: quotes, escaped quotes, CRLF). Returns array of rows. */
export function parseCsv(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const rows = [];
  let row = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else q = false;
      } else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

/** Rows (first row = header) to objects. */
export const csvObjects = text => {
  const [head, ...rows] = parseCsv(text);
  return rows.filter(r => r.length > 1).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
};
