// Validates the listed-bank pilot dataset (src/data/ngan-hang-niem-yet/): run `node scripts/check-bank-data.mjs`.
// - every value carries its provenance (bank, year, item, unit, statement, source URL on the bank's own website,
//   file name, page, two agreeing extraction passes);
// - only banks whose website terms and robots.txt were reviewed and allow use (status "included") appear;
// - no aggregator, exchange portal or third-party host is used as a source;
// - accounting identities hold on the published values of every bank-year;
// - no value listed as flagged in review.json is published.
import { readFileSync } from "node:fs";

const dir = new URL("../src/data/ngan-hang-niem-yet/", import.meta.url);
const read = f => JSON.parse(readFileSync(new URL(f, dir), "utf8"));
const values = read("values.json");
const banks = read("banks.json");
const review = read("review.json");

const errors = [];
const err = (m, v) => errors.push(v ? `${v.bank} ${v.year} ${v.item_code}: ${m}` : m);

// Hosts of each bank's own investor-relations website (see docs/BANK_DATA_SOURCES.md).
const OWN_HOSTS = {
  VCB: ["www.vietcombank.com.vn"],
  CTG: ["investor.vietinbank.vn"],
  TCB: ["techcombank.com"],
};
const FORBIDDEN = /cafef|vietstock|fiin|vndirect|ssi\.com|hsx\.vn|hnx\.vn|ssc\.gov\.vn|cophieu68|simplize|investing\.com|google|archive\.org|scribd/i;
const STATEMENTS = new Set(["BS", "IS", "TM"]);
const included = new Set(banks.filter(b => b.status === "included").map(b => b.code));

for (const b of banks) {
  if (!["included", "excluded", "pending"].includes(b.status)) err(`bank ${b.code}: bad status ${b.status}`);
  if (b.status !== "pending" && !b.reason) err(`bank ${b.code}: missing reason`);
  if (b.status === "included" && !OWN_HOSTS[b.code]) err(`bank ${b.code}: no allowed host list`);
}

const seen = new Set();
for (const v of values) {
  for (const k of ["bank", "year", "item_code", "item_name", "unit_printed", "statement", "source_url", "file_name", "report_year", "column", "page", "passes"]) {
    if (v[k] === undefined || v[k] === null || v[k] === "") err(`missing ${k}`, v);
  }
  if (!Number.isInteger(v.value)) err(`value not an integer (VND million): ${v.value}`, v);
  if (!included.has(v.bank)) err("bank not included (terms/robots review)", v);
  if (!STATEMENTS.has(v.statement)) err(`bad statement ${v.statement}`, v);
  if (!Number.isInteger(v.page) || v.page < 1) err(`bad page ${v.page}`, v);
  if (String(v.passes).split("+").length < 2) err("fewer than two agreeing extraction passes", v);
  if (v.unit_printed !== "triệu đồng") err(`unexpected unit ${v.unit_printed}`, v);
  let host = "";
  try {
    const u = new URL(v.source_url);
    host = u.hostname;
    if (u.protocol !== "https:") err("source URL not https", v);
  } catch {
    err(`bad source URL ${v.source_url}`, v);
  }
  if (FORBIDDEN.test(v.source_url)) err(`forbidden source ${v.source_url}`, v);
  if (OWN_HOSTS[v.bank] && !OWN_HOSTS[v.bank].includes(host)) err(`source host ${host} is not the bank's own website`, v);
  if (v.column === "năm hiện hành" && v.report_year !== v.year) err("current column but report year differs", v);
  if (v.column === "số liệu so sánh" && v.report_year !== v.year + 1) err("comparative column must come from the next year's report", v);
  const key = `${v.bank}|${v.year}|${v.item_code}`;
  if (seen.has(key)) err("duplicate value", v);
  seen.add(key);
}

const flagged = new Set(review.flagged.map(f => `${f.bank}|${f.year}|${f.item_code}`));
for (const k of seen) if (flagged.has(k)) err(`flagged value is published: ${k}`);

// Accounting identities on published values (tolerance: 2 VND million of rounding).
const TOL = 2;
const by = new Map();
for (const v of values) {
  const k = `${v.bank} ${v.year}`;
  if (!by.has(k)) by.set(k, {});
  by.get(k)[v.item_code] = v.value;
}
const IDS = [
  ["total_assets", ["total_liabilities_equity"]],
  ["net_interest_income", ["interest_income", "interest_expense"]],
  ["net_fee_income", ["fee_income", "fee_expense"]],
  ["net_other_income", ["other_income", "other_expense"]],
  ["pre_provision_profit", ["total_operating_income", "operating_expense"]],
  ["profit_before_tax", ["pre_provision_profit", "provision_expense"]],
  ["profit_after_tax", ["profit_before_tax", "income_tax"]],
  ["loans_net", ["loans_gross", "loan_loss_reserve"]],
  ["classified_loans_total", ["loans_group1", "loans_group2", "loans_group3", "loans_group4", "loans_group5"]],
];
let checked = 0;
for (const [k, r] of by) {
  for (const [lhs, rhs] of IDS) {
    if (r[lhs] === undefined || rhs.some(c => r[c] === undefined)) continue;
    checked++;
    const s = rhs.reduce((a, c) => a + r[c], 0);
    if (Math.abs(s - r[lhs]) > TOL) err(`${k}: ${lhs} ${r[lhs]} ≠ ${rhs.join(" + ")} = ${s}`);
  }
  if (r.total_liabilities !== undefined && r.total_equity !== undefined && r.total_liabilities_equity !== undefined) {
    checked++;
    const a = r.total_liabilities + r.total_equity;
    const b = a + (r.minority_interest_bs ?? 0);
    if (Math.abs(a - r.total_liabilities_equity) > TOL && Math.abs(b - r.total_liabilities_equity) > TOL)
      err(`${k}: total_liabilities + total_equity (+ MI) ≠ total_liabilities_equity`);
  }
  const g = r.loans_gross, d = r.customer_deposits, ta = r.total_assets;
  if (g !== undefined && ta !== undefined && !(g > 0 && g < ta)) err(`${k}: loans_gross outside (0, total assets)`);
  if (d !== undefined && ta !== undefined && !(d > 0 && d < ta)) err(`${k}: customer_deposits outside (0, total assets)`);
}

if (errors.length) {
  console.error(`check-bank-data: ${errors.length} error(s)`);
  for (const e of errors.slice(0, 50)) console.error("  " + e);
  process.exit(1);
}
console.log(`check-bank-data: ${values.length} values, ${by.size} bank-years, ${checked} identities, ${review.flagged.length} flagged (not published), OK`);
