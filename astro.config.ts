import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { readdirSync, readFileSync } from "node:fs";
import { transformerFileName } from "./src/utils/transformers/fileName";
import rehypeA11y from "./src/utils/transformers/rehypeA11y";
import config from "./astro-paper.config";

// Sitemap <lastmod>: posts use modDatetime (or pubDatetime) from their front
// matter; every other page (tools, scale pages, lists) uses the build date.
const BUILD_DATE = new Date().toISOString();
const POSTS_DIR = new URL("./src/content/posts/", import.meta.url);
const postLastmod = new Map<string, string>();
for (const file of readdirSync(POSTS_DIR)) {
  if (!/\.mdx?$/.test(file) || file.startsWith("_")) continue;
  const head = readFileSync(new URL(file, POSTS_DIR), "utf8").split(/^---\s*$/m)[1] ?? "";
  const field = (key: string) => {
    const m = head.match(new RegExp(`^${key}:[ \\t]*["']?([^"'\\r\\n]+?)["']?[ \\t]*\\r?$`, "m"));
    const d = m && m[1] !== "null" ? new Date(m[1]) : null;
    return d && !Number.isNaN(d.getTime()) ? d.toISOString() : null;
  };
  const date = field("modDatetime") ?? field("pubDatetime");
  if (date) postLastmod.set(file.replace(/\.mdx?$/, ""), date);
}
// Thin or utility pages kept out of the sitemap (they are also noindex), incl. /posts/2/, /posts/3/…
const SITEMAP_EXCLUDE = /\/(search|tags|bai-viet|404)(\/|$)|\/posts\/\d+\/?$/;

export default defineConfig({
  site: config.site.url,
  base: "/",
  trailingSlash: "ignore",
  // Compression drops the line break between text and an inline tag on the next line ("Trên<a>"),
  // gluing words to links across ~160 pages; keep the whitespace instead.
  compressHTML: false,
  // Old URLs from the first version of the site (already submitted to search engines).
  redirects: Object.fromEntries(
    [
      "cach-thu-mau-khao-sat-khoa-luan",
      "co-mau-nghien-cuu-bao-nhieu-la-du",
      "thang-do-likert",
      "cronbach-alpha-la-gi",
      "cach-loc-phieu-khao-sat-khong-hop-le",
      "phat-hien-cau-tra-loi-khao-sat-do-ai-viet",
      "khao-sat-kiem-tien-uy-tin",
      "cach-thiet-ke-bang-hoi",
    ].map(slug => [`/bai-viet/${slug}`, `/posts/${slug}/`])
  ),
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        (config.features?.showArchives !== false ||
          !page.endsWith("/archives/")) &&
        !SITEMAP_EXCLUDE.test(new URL(page).pathname),
      serialize: item => {
        const post = new URL(item.url).pathname.match(/\/posts\/([^/]+)\/?$/);
        const lastmod = post && postLastmod.get(decodeURIComponent(post[1]));
        return { ...item, lastmod: lastmod ?? BUILD_DATE };
      },
    }),
  ],
  i18n: {
    locales: ["vi"],
    defaultLocale: "vi",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts, rehypeA11y],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "Be Vietnam Pro",
      cssVariable: "--font-be-vietnam-pro",
      provider: fontProviders.google(),
      fallbacks: ["system-ui", "sans-serif"],
      subsets: ["latin", "vietnamese"],
      weights: [400, 500, 600, 700],
      styles: ["normal", "italic"],
      // woff2 only: every browser that supports the Vietnamese subset reads it.
      formats: ["woff2"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
