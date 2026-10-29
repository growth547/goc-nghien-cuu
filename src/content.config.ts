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

export const collections = { posts, pages, scales };
