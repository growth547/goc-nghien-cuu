// All indicators that get a rich page under /du-lieu/<slug>/. Everything else a source offers for
// Viet Nam goes only into the "Kho chỉ số" explorer (/du-lieu/kho-chi-so/).
import { INDICATORS as WDI_FIRST } from "../worldbank-indicators.mjs";
import { WDI_MORE } from "./wdi-more.mjs";
import { FINANCE_GOVERNANCE } from "./finance-governance.mjs";
import { PWT_ILO_FAO } from "./pwt-ilo-fao.mjs";
import { COMMODITIES } from "./commodities.mjs";
import { SOURCES } from "../data-sources.mjs";

// Must equal DATASET_THEMES in src/content.config.ts (same order).
export const THEMES = [
  "Tăng trưởng & cơ cấu kinh tế",
  "Giá cả, lao động & thu nhập",
  "Thương mại & đầu tư nước ngoài",
  "Tài chính – ngân hàng",
  "Doanh nghiệp & môi trường kinh doanh",
  "Giá hàng hoá thế giới",
  "Nông nghiệp & giá nông sản",
  "Dân số & đô thị hoá",
  "Công nghệ & chuyển đổi số",
  "Giáo dục & y tế",
  "Năng lượng & môi trường",
  "Quản trị nhà nước",
];

export const RICH = [...WDI_FIRST, ...WDI_MORE, ...FINANCE_GOVERNANCE, ...PWT_ILO_FAO, ...COMMODITIES].map(i => ({
  source: "wdi",
  ...i,
}));

/** Throws on the first editorial error (duplicate slug/code, unknown theme or source, missing text). */
export function validateRich() {
  const slugs = new Set();
  const codes = new Set();
  for (const ind of RICH) {
    const where = ind.slug ?? JSON.stringify(ind).slice(0, 60);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(ind.slug ?? "")) throw new Error(`bad slug ${where}`);
    if (slugs.has(ind.slug)) throw new Error(`duplicate slug ${ind.slug}`);
    slugs.add(ind.slug);
    const key = `${ind.source}:${ind.code}`;
    if (codes.has(key)) throw new Error(`${ind.slug}: ${key} already has a page`);
    codes.add(key);
    if (!SOURCES[ind.source]) throw new Error(`${ind.slug}: unknown source ${ind.source}`);
    if (!THEMES.includes(ind.theme)) throw new Error(`${ind.slug}: unknown theme ${ind.theme}`);
    for (const k of ["code", "shortVi", "nameVi", "unit", "explanation"]) {
      if (typeof ind[k] !== "string" || !ind[k].trim()) throw new Error(`${ind.slug}: missing ${k}`);
    }
    if (typeof ind.displayUnit !== "string") throw new Error(`${ind.slug}: missing displayUnit`);
    if (/Việt Nam/i.test(ind.shortVi) && ind.source !== "pink") throw new Error(`${ind.slug}: shortVi must not contain "Việt Nam"`);
    if (!(ind.scale > 0) || !Number.isInteger(ind.decimals)) throw new Error(`${ind.slug}: bad scale/decimals`);
    if (!Array.isArray(ind.thesisUse) || !ind.thesisUse.length) throw new Error(`${ind.slug}: thesisUse is empty`);
    if (ind.explanation.length < 80) throw new Error(`${ind.slug}: explanation too short for a rich page`);
  }
}
