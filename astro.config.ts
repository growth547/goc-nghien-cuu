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
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  base: "/goc-nghien-cuu",
  trailingSlash: "ignore",
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
    ].map(slug => [`/bai-viet/${slug}`, `/goc-nghien-cuu/posts/${slug}/`])
  ),
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
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
      rehypePlugins: [rehypeCallouts],
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
      formats: ["woff", "ttf"],
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
