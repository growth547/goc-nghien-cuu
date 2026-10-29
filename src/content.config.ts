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
  }),
});

// Vietnam secondary data: one JSON file per World Bank WDI indicator, written by
// scripts/fetch-worldbank.mjs (themes must match THEMES in scripts/worldbank-indicators.mjs).
export const DATASET_THEMES = [
  "Tăng trưởng & cơ cấu kinh tế",
  "Giá cả, lao động & thu nhập",
  "Thương mại & đầu tư nước ngoài",
  "Tài chính – ngân hàng",
  "Dân số & đô thị hoá",
  "Công nghệ & chuyển đổi số",
  "Giáo dục & y tế",
  "Năng lượng & môi trường",
] as const;
const datasets = defineCollection({
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/content/du-lieu" }),
  schema: z.object({
    code: z.string(),
    theme: z.enum(DATASET_THEMES),
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
    source: z.string(),
    lastUpdated: z.string(),
    fetchedAt: z.string(),
    license: z.string(),
    licenseUrl: z.string().url(),
    termsUrl: z.string().url(),
    dataUrl: z.string().url(),
    apiUrl: z.string().url(),
    values: z
      .array(z.object({ year: z.number().int(), value: z.number() }))
      .min(2),
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
  }),
});

export const collections = { posts, pages, scales, templates, datasets, concepts };
