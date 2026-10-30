// schema.org builders for <JsonLd>. Each returns plain objects built only from collection data.
// Which page should use which builder: docs/GEO_PLAYBOOK.md, section "Structured data".
import type { CollectionEntry } from "astro:content";
import config from "@/config";

const SITE = config.site.url.replace(/\/?$/, "/");

const ORG = { "@type": "Organization", name: "Góc Nghiên Cứu", url: SITE };

/** Scale page (/thang-do/<slug>/): the constructs of one scale as a DefinedTermSet. */
export function scaleTermSetLd(s: CollectionEntry<"scales">, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${pageUrl}#constructs`,
    name: s.data.fullName,
    alternateName: s.data.name,
    url: pageUrl,
    inLanguage: ["vi", "en"],
    citation: s.data.references,
    hasDefinedTerm: s.data.constructs.map(c => ({
      "@type": "DefinedTerm",
      "@id": `${pageUrl}#${c.code}`,
      termCode: c.code,
      name: c.nameVi,
      alternateName: c.nameEn,
      description: c.definition,
      inDefinedTermSet: `${pageUrl}#constructs`,
    })),
  };
}

/** Construct page (/khai-niem/<slug>/): the construct as a DefinedTerm in the site's glossary. */
export function conceptTermLd(c: CollectionEntry<"concepts">, pageUrl: string, glossaryUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${pageUrl}#term`,
    name: c.data.name,
    alternateName: c.data.nameEn,
    description: c.data.intro,
    url: pageUrl,
    inLanguage: "vi",
    inDefinedTermSet: { "@type": "DefinedTermSet", "@id": `${glossaryUrl}#glossary`, name: "Khái niệm nghiên cứu (Góc Nghiên Cứu)", url: glossaryUrl },
  };
}

/** Construct index (/khai-niem/): the glossary itself. `url(c)` returns a concept page URL. */
export function glossaryLd(concepts: CollectionEntry<"concepts">[], glossaryUrl: string, url: (c: CollectionEntry<"concepts">) => string) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${glossaryUrl}#glossary`,
    name: "Khái niệm nghiên cứu (Góc Nghiên Cứu)",
    url: glossaryUrl,
    inLanguage: "vi",
    publisher: ORG,
    hasDefinedTerm: concepts.map(c => ({ "@type": "DefinedTerm", "@id": `${url(c)}#term`, name: c.data.name, alternateName: c.data.nameEn, url: url(c) })),
  };
}

const VARIABLE_SET = "Biến nghiên cứu cho đề tài dữ liệu thứ cấp (Góc Nghiên Cứu)";

/** Variable page (/bien-nghien-cuu/<slug>/): the variable as a DefinedTerm with its formula as termCode. */
export function variableTermLd(v: CollectionEntry<"variables">, pageUrl: string, setUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${pageUrl}#term`,
    name: v.data.name,
    alternateName: [v.data.symbol, v.data.nameEn],
    termCode: v.data.symbol,
    description: `${v.data.definition} Công thức: ${v.data.formula}`,
    url: pageUrl,
    inLanguage: "vi",
    citation: v.data.references.map(r => `https://doi.org/${encodeURI(r.doi)}`),
    inDefinedTermSet: { "@type": "DefinedTermSet", "@id": `${setUrl}#variables`, name: VARIABLE_SET, url: setUrl },
  };
}

/** Variable index (/bien-nghien-cuu/): every variable in one DefinedTermSet. `url(v)` returns its page URL. */
export function variableSetLd(vars: CollectionEntry<"variables">[], setUrl: string, url: (v: CollectionEntry<"variables">) => string) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${setUrl}#variables`,
    name: VARIABLE_SET,
    url: setUrl,
    inLanguage: "vi",
    publisher: ORG,
    hasDefinedTerm: vars.map(v => ({ "@type": "DefinedTerm", "@id": `${url(v)}#term`, name: v.data.name, termCode: v.data.symbol, alternateName: v.data.nameEn, url: url(v) })),
  };
}

/** Data index (/du-lieu/): every indicator as a Dataset in one DataCatalog. `url(d)` returns its page URL. */
export function dataCatalogLd(datasets: CollectionEntry<"datasets">[], catalogUrl: string, url: (d: CollectionEntry<"datasets">) => string) {
  return {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    name: "Dữ liệu thứ cấp Việt Nam (World Bank WDI)",
    url: catalogUrl,
    inLanguage: "vi",
    publisher: ORG,
    dataset: datasets.map(d => ({
      "@type": "Dataset",
      name: d.data.nameVi,
      alternateName: d.data.nameEn,
      identifier: d.data.code,
      url: url(d),
      license: d.data.licenseUrl,
      spatialCoverage: { "@type": "Place", name: "Việt Nam" },
      temporalCoverage: `${Math.min(...d.data.values.map(v => v.year))}/${Math.max(...d.data.values.map(v => v.year))}`,
      creator: { "@type": "Organization", name: "World Bank" },
    })),
  };
}

/** Methodology/about pages: the publisher with its correction channel. */
export const publisherLd = {
  "@context": "https://schema.org",
  ...ORG,
  sameAs: ["https://github.com/growth547/goc-nghien-cuu"],
  publishingPrinciples: `${SITE}phuong-phap-bien-soan/`,
  correctionsPolicy: `${SITE}phuong-phap-bien-soan/#sua-loi`,
};
