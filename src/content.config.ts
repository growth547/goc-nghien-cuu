import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

// Measurement scale library: one JSON file per published scale/model.
const item = z.object({
  code: z.string(),
  en: z.string(),
  vi: z.string(),
  reverse: z.boolean().optional(),
});
const scales = defineCollection({
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/content/thang-do" }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(110).max(170),
    name: z.string(),
    fullName: z.string(),
    field: z.enum([
      "Công nghệ & hệ thống thông tin",
      "Hành vi người tiêu dùng",
      "Chất lượng dịch vụ",
      "Marketing & thương hiệu",
      "Quản trị nhân sự & tổ chức",
      "Tâm lý & sức khoẻ tinh thần",
    ]),
    keyword: z.string(),
    intro: z.string(),
    responseScale: z.string(),
    // Short form for the stat card, e.g. "Tần suất 0–4".
    responseScaleShort: z.string().max(28).optional(),
    // Per-scale recoding of (R) items: (lowest + highest level) − score.
    reverseRule: z.string().optional(),
    constructs: z
      .array(
        z.object({
          code: z.string(),
          nameVi: z.string(),
          nameEn: z.string(),
          definition: z.string(),
          source: z.string(),
          items: z.array(item).min(1),
        })
      )
      .min(1),
    usage: z.array(z.string()).min(2),
    // Optional depth sections; every citation must also be in `references`.
    model: z
      .object({
        paths: z.array(z.string()).min(1),
        note: z.string().optional(),
        source: z.string(),
      })
      .optional(),
    reliability: z
      .array(
        z.object({
          construct: z.string(),
          value: z.string(),
          sample: z.string(),
          source: z.string(),
          url: z.string().url(),
        })
      )
      .optional(),
    vietnamStudies: z
      .array(
        z.object({
          authors: z.string(),
          year: z.number().int(),
          title: z.string(),
          journal: z.string(),
          url: z.string().url(),
          note: z.string().optional(),
        })
      )
      .optional(),
    examinerQA: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    sampleSize: z.object({
      arrowsMax: z.number().int().min(1).optional(),
      note: z.string(),
    }),
    license: z.string(),
    references: z.array(z.string()).min(1),
    verifiedFrom: z.array(z.string().url()).min(1),
    related: z.array(z.string()).default([]),
  }),
});

// Ready-made questionnaires for common thesis topics, assembled from the scale library.
// Constructs are referenced as "<scale slug>:<construct code>"; paths define the suggested model.
const templates = defineCollection({
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/content/mau-bang-hoi" }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(110).max(170),
    topic: z.string(),
    audience: z.string(),
    intro: z.string(),
    modelNote: z.string(),
    placeholders: z.record(z.string(), z.string()),
    constructs: z.array(z.string().regex(/^[a-z0-9-]+:[A-Za-z0-9]+$/)).min(2),
    paths: z
      .array(z.object({ from: z.string(), to: z.string(), sign: z.enum(["+", "-"]).default("+") }))
      .min(1),
    method: z.enum(["pls", "spss"]).default("pls"),
    tips: z.array(z.string()).min(2),
    // Item wording adapted for this topic, keyed "<scale slug>:<item code>"; shown next to the original.
    itemOverrides: z.record(z.string(), z.string()).default({}),
    // Extra references the page cites (HTML like the scale references), e.g. for modelNote.
    references: z.array(z.string()).default([]),
    // Verified studies in Vietnam that used this model; reliability only as the study reports it.
    studies: z
      .array(
        z.object({
          authors: z.string(),
          year: z.number().int(),
          title: z.string(),
          journal: z.string(),
          url: z.string().url(),
          sample: z.string(),
          reliability: z.string().optional(),
          result: z.string().optional(),
        })
      )
      .default([]),
  }),
});

// Vietnam secondary data: one JSON file per rich indicator, written by scripts/fetch-data.mjs from the
// sources in scripts/data-sources.mjs (themes must match THEMES in scripts/indicators/index.mjs).
export const DATASET_THEMES = [
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
] as const;

const datasetPoint = z.object({ year: z.number().int(), month: z.number().int().min(1).max(12).optional(), value: z.number() });

const datasets = defineCollection({
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/content/du-lieu" }),
  schema: z.object({
    source: z.enum(["wdi", "wgi", "gfdd", "pink", "pwt", "ilostat", "faostat"]),
    sourceName: z.string(),
    publisher: z.string(),
    code: z.string(),
    varName: z.string().regex(/^[a-z][a-z0-9_]{0,31}$/),
    theme: z.enum(DATASET_THEMES),
    kind: z.enum(["country", "world"]),
    frequency: z.enum(["A", "M"]),
    title: z.string().max(65),
    description: z.string().min(110).max(170),
    shortVi: z.string(),
    nameVi: z.string(),
    nameEn: z.string(),
    unit: z.string(),
    displayUnit: z.string(),
    scale: z.number().positive(),
    decimals: z.number().int().min(0),
    explanation: z.string(),
    thesisUse: z.array(z.string()).min(1),
    sourceNote: z.string(),
    sourceOrganization: z.string(),
    lastUpdated: z.string(),
    fetchedAt: z.string(),
    license: z.string(),
    licenseUrl: z.string().url(),
    termsUrl: z.string().url(),
    dataUrl: z.string().url(),
    apiUrl: z.string().url(),
    citation: z.object({
      author: z.string(),
      container: z.string(),
      publisher: z.string().optional(),
      doi: z.string().url().optional(),
      article: z.string().optional(),
      licenceNote: z.string().optional(),
    }),
    values: z.array(datasetPoint).min(2),
    comparison: z
      .array(
        z.object({
          code: z.string(),
          name: z.string(),
          values: z.array(datasetPoint).min(2),
        })
      )
      .optional(),
  }),
});

// One landing page per construct ("thang đo <khái niệm>"), aggregating matching constructs
// from the scale library as "<scale slug>:<construct code>" keys; checked by check-concepts.mjs.
const concepts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/content/khai-niem" }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(110).max(170),
    name: z.string(),
    nameEn: z.string(),
    field: z.enum([
      "Công nghệ & hệ thống thông tin",
      "Hành vi người tiêu dùng",
      "Chất lượng dịch vụ",
      "Marketing & thương hiệu",
      "Quản trị nhân sự & tổ chức",
      "Tâm lý & sức khoẻ tinh thần",
    ]),
    keyword: z.string(),
    intro: z.string(),
    constructs: z
      .array(z.object({ key: z.string().regex(/^[a-z0-9-]+:[A-Za-z0-9]+$/), note: z.string() }))
      .min(1),
    tips: z.array(z.string()).min(3).max(5),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).length(3),
    related: z.array(z.string()).default([]),
    // Works cited in intro, tips or FAQ (HTML allowed, like the scale references).
    references: z.array(z.string()).default([]),
  }),
});

export const collections = { posts, pages, scales, templates, datasets, concepts };
