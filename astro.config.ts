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
import { execFileSync } from "node:child_process";
import { transformerFileName } from "./src/utils/transformers/fileName";
import rehypeA11y from "./src/utils/transformers/rehypeA11y";
import config from "./astro-paper.config";

// Sitemap <lastmod>: posts use modDatetime (or pubDatetime) from their front matter; scale,
// concept, template, dataset and variable pages use the last commit that touched their JSON file,
// and their hub (/thang-do/ …) the newest of those; every other page uses the last commit that
// touched code or layout. Google and Bing ignore lastmod on sites where it is always "now", so it
// must change only when the page does. Without git history (shallow clone, uncommitted file) the
// build date is used, as before.
const BUILD_DATE = new Date().toISOString();
const CONTENT_DIRS = ["thang-do", "khai-niem", "mau-bang-hoi", "du-lieu", "bien-nghien-cuu"];
const contentLastmod = new Map<string, string>(); // "thang-do/tam" and "thang-do" -> ISO date
let codeLastmod = BUILD_DATE;
try {
  const git = (...args: string[]) =>
    execFileSync("git", ["-c", "core.quotePath=false", ...args], { encoding: "utf8", maxBuffer: 64 << 20 }).trim();
  if (git("rev-parse", "--is-shallow-repository") === "false") {
    let date = "";
    for (const line of git("log", "--format=@%cI", "--name-only", "--", ...CONTENT_DIRS.map(d => `src/content/${d}`)).split(/\r?\n/)) {
      if (line.startsWith("@")) date = new Date(line.slice(1)).toISOString();
      const m = line.match(/^src\/content\/([^/]+)\/([^/_][^/]*)\.json$/);
      if (!m || !date) continue;
      // git log is newest first: the first date seen for a file (or a hub) is its latest change
      if (!contentLastmod.has(`${m[1]}/${m[2]}`)) contentLastmod.set(`${m[1]}/${m[2]}`, date);
      if (!contentLastmod.has(m[1])) contentLastmod.set(m[1], date);
    }
    const code = git("log", "-1", "--format=%cI", "--", ".", ":!src/content", ":!docs");
    if (code) codeLastmod = new Date(code).toISOString();
  }
} catch {
  // no git: keep BUILD_DATE
}
const pageLastmod = (pathname: string) => {
  const parts = decodeURIComponent(pathname).split("/").filter(Boolean);
  if (parts[0] === "posts" && parts.length === 2) return postLastmod.get(parts[1]) ?? BUILD_DATE;
  if (CONTENT_DIRS.includes(parts[0]) && parts.length <= 2) return contentLastmod.get(parts.join("/")) ?? BUILD_DATE;
  return codeLastmod;
};
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
      serialize: item => ({ ...item, lastmod: pageLastmod(new URL(item.url).pathname) }),
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
