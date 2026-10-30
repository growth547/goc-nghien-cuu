// Registry of data sources republished under /du-lieu/. A source may only be added here after its
// licence/terms page has been read: record the licence, the URLs and the exact wording that allows
// republication (licenseEvidence, quoted from the page on the date in checkedAt).
//
// Every page and CSV built from a source shows: name, licence (with link), retrieval date and an
// APA reference built from `apa` (author, dataset title, publisher/container, url).
//
// REJECTED lists sources that were evaluated and NOT used, with the reason. Do not add them
// without re-reading their terms.

export const SOURCES = {
  wdi: {
    name: "World Development Indicators (WDI)",
    org: "World Bank",
    license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    licenseShort: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    termsUrl: "https://datacatalog.worldbank.org/public-licenses",
    homeUrl: "https://datacatalog.worldbank.org/search/dataset/0037712/World-Development-Indicators",
    licenseEvidence:
      "World Bank Data Catalog, Public licenses: CC BY 4.0 \"allows users to copy, modify and distribute data in any format for any purpose, including commercial use\"; users must give appropriate credit and indicate changes, including translations. Per-series licence is read from the WDI metadata field License_Type; only series marked \"CC BY-4.0\" or \"CC BY 3.0 IGO\" are republished (SIPRI military series and series without a licence field are excluded).",
    checkedAt: "2026-10-30",
    attribution: "World Bank, World Development Indicators (CC BY 4.0)",
    apa: { author: "World Bank", container: "World Development Indicators" },
  },
  wgi: {
    name: "Worldwide Governance Indicators (WGI)",
    org: "World Bank",
    license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    licenseShort: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    termsUrl: "https://datacatalog.worldbank.org/search/dataset/0038026/Worldwide-Governance-Indicators",
    homeUrl: "https://www.worldbank.org/en/publication/worldwide-governance-indicators",
    licenseEvidence:
      "World Bank Data Catalog page of the dataset: \"License: Creative Commons Attribution 4.0\". The WGI series metadata (API source 3) carries License_Type \"CC BY-4.0\" for all 36 series.",
    checkedAt: "2026-10-30",
    attribution: "World Bank, Worldwide Governance Indicators (CC BY 4.0)",
    apa: { author: "World Bank", container: "Worldwide Governance Indicators" },
  },
  gfdd: {
    name: "Global Financial Development Database (GFDD)",
    org: "World Bank",
    license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    licenseShort: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    termsUrl: "https://datacatalog.worldbank.org/search/dataset/0038648",
    homeUrl: "https://www.worldbank.org/en/publication/gfdr/data/global-financial-development-database",
    licenseEvidence:
      "World Bank Data Catalog page \"Global Financial Development\": \"License: Creative Commons Attribution 4.0\". (Older 2019 repository mirrors listed CC BY-SA 4.0; the current catalog record governs.) Bank indicators are compiled by the World Bank from Fitch/Orbis bank data and published in the database under this licence.",
    checkedAt: "2026-10-30",
    attribution: "World Bank, Global Financial Development Database (CC BY 4.0)",
    apa: { author: "World Bank", container: "Global Financial Development Database" },
  },
  pink: {
    name: "Commodity Price Data (The Pink Sheet)",
    org: "World Bank",
    license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    licenseShort: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    termsUrl: "https://datacatalog.worldbank.org/search/dataset/0038238/commodity-prices-history-and-projections",
    homeUrl: "https://www.worldbank.org/en/research/commodity-markets",
    licenseEvidence:
      "World Bank Data Catalog \"Commodity Prices - History and Projections\": \"License: Creative Commons Attribution 4.0\". The Commodity Markets page links its data (\"Using this Data\") to the catalog's CC BY licence (datacatalog.worldbank.org/public-licenses#cc-by).",
    checkedAt: "2026-10-30",
    attribution: "World Bank, Commodity Price Data (The Pink Sheet) (CC BY 4.0)",
    apa: { author: "World Bank", container: "World Bank Commodity Price Data (The Pink Sheet)" },
  },
  pwt: {
    name: "Penn World Table 11.0",
    org: "Groningen Growth and Development Centre",
    license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    licenseShort: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    termsUrl: "https://www.rug.nl/ggdc/productivity/pwt/",
    homeUrl: "https://doi.org/10.34894/FABVLR",
    licenseEvidence:
      "GGDC PWT page: Penn World Table 11.0 is \"licensed under a Creative Commons Attribution 4.0 International License\"; Dataverse record doi:10.34894/FABVLR lists licence CC-BY-4.0. Users are asked to cite Feenstra, Inklaar and Timmer (2015).",
    checkedAt: "2026-10-30",
    attribution: "Feenstra, Inklaar & Timmer, Penn World Table 11.0, GGDC (CC BY 4.0)",
    apa: {
      author: "Feenstra, R. C., Inklaar, R., & Timmer, M. P.",
      container: "Penn World Table version 11.0",
      publisher: "Groningen Growth and Development Centre",
      doi: "https://doi.org/10.34894/FABVLR",
      article:
        "Feenstra, R. C., Inklaar, R., & Timmer, M. P. (2015). The next generation of the Penn World Table. American Economic Review, 105(10), 3150–3182. https://doi.org/10.1257/aer.20130954",
    },
  },
  ilostat: {
    name: "ILOSTAT",
    org: "International Labour Organization",
    license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    licenseShort: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    termsUrl: "https://www.ilo.org/node/9321",
    homeUrl: "https://ilostat.ilo.org/",
    licenseEvidence:
      "ILO \"Rights and permissions\": \"As of 3 May 2023\" databases and datasets \"together with the accompanying referential metadata are covered by the Creative Commons CC BY 4.0 licence\" (microdata restricted to ILO use excluded). Data are read from the public SDMX API (sdmx.ilo.org), not scraped.",
    checkedAt: "2026-10-30",
    attribution: "International Labour Organization, ILOSTAT (CC BY 4.0)",
    apa: { author: "International Labour Organization", container: "ILOSTAT" },
  },
  faostat: {
    name: "FAOSTAT – Producer Prices",
    org: "Food and Agriculture Organization of the United Nations",
    license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    licenseShort: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    termsUrl: "https://www.fao.org/contact-us/terms/db-terms-of-use/en/",
    homeUrl: "https://www.fao.org/faostat/en/#data/PP",
    licenseEvidence:
      "FAO Statistical Database Terms of Use: datasets \"are licensed under the Creative Commons Attribution-4.0 International licence\" and users may \"access, download, create copies, adapt and re-disseminate datasets\". Conditions observed here: cite FAO with \"Licence: CC-BY-4.0\", no implied FAO endorsement, no use for commercial promotion (the data pages carry no advertising tied to the data). Read from the official FAOSTAT bulk download, not scraped.",
    checkedAt: "2026-10-30",
    attribution: "FAO, FAOSTAT Producer Prices. Licence: CC-BY-4.0",
    apa: { author: "Food and Agriculture Organization of the United Nations", container: "FAOSTAT: Producer prices" },
  },
};

export const REJECTED = {
  imf: "IMF Copyright and Usage: commercial reuse of IMF Data requires written permission (\"email copyright@imf.org\") and \"the IMF prohibits bulk download of information by automated technology without explicit permission\". Not compatible with an automated, ad-supported site. IMF-sourced series that the World Bank redistributes inside WDI under CC BY 4.0 (e.g. lending rate, M2) are used through WDI instead.",
  who: "WHO dataset terms: datasets \"shall not be used for or in conjunction with the promotion of a commercial enterprise\" (GHO content historically CC BY-NC-SA 3.0 IGO). Doubtful with affiliate links; WHO-sourced health series are used through WDI.",
  uis: "UNESCO UIS Data Browser: CC BY-SA 4.0 (share-alike). Allowed, but derived CSVs would have to be re-licensed BY-SA; UIS education series are already available through WDI. Deferred.",
  bis: "BIS statistics terms permit use with attribution, but BIS has no credit-to-GDP or residential property price series for Viet Nam (only a bilateral VND/USD rate, already in WDI). Nothing to add.",
  oecd: "OECD: CC BY 4.0 for content published from 1 July 2024 (third-party material excluded). Viet Nam coverage is thin and mostly third-party; not integrated yet.",
  owid: "Our World in Data: only OWID-produced data is CC BY; most Viet Nam series are third-party data under their own terms. Not integrated; original sources used instead.",
  adb: "ADB Data Library / KIDB: CC BY 3.0 IGO, commercial use allowed with attribution. Eligible; not integrated yet (no stable bulk API tested).",
  findex: "Global Findex standalone database: no data licence stated on the download page (the report is CC BY 3.0 IGO). Key Findex series (account ownership etc.) are taken from WDI and GFDD instead.",
  enterpriseSurveys: "Enterprise Surveys portal: no explicit licence for the indicator tables; firm-level microdata require registration and a confidentiality agreement. Enterprise Survey indicators that WDI republishes under CC BY 4.0 (IC.FRM.*) are used instead.",
  vnGov: "Vietnamese government portals (GSO/NSO, SBV, MOF): no explicit open-reuse licence; not used.",
};

export const ASEAN_PEERS = [
  { code: "VNM", wb: "VN", name: "Việt Nam" },
  { code: "THA", wb: "TH", name: "Thái Lan" },
  { code: "IDN", wb: "ID", name: "Indonesia" },
  { code: "MYS", wb: "MY", name: "Malaysia" },
  { code: "PHL", wb: "PH", name: "Philippines" },
  { code: "SGP", wb: "SG", name: "Singapore" },
  { code: "KHM", wb: "KH", name: "Campuchia" },
  { code: "LAO", wb: "LA", name: "Lào" },
  { code: "MMR", wb: "MM", name: "Myanmar" },
  { code: "CHN", wb: "CN", name: "Trung Quốc" },
];
