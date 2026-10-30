import type { APIRoute } from "astro";

// Search engines and AI assistants are welcome: the site wants to be found and cited.
// A crawler obeys only the most specific group that names it, so every named group repeats "Allow: /".
// robots.txt counts only at the host root, which this site now is (https://gocnghiencuu.com/robots.txt).
const AGENTS = [
  "Googlebot", // Google Search, incl. AI Overviews / AI Mode
  "Google-Extended", // Gemini apps and grounding
  "Bingbot", // Bing and Copilot
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User", // pages fetched for a ChatGPT user
  "GPTBot", // OpenAI model training
  "PerplexityBot", // Perplexity search
  "Perplexity-User",
  "ClaudeBot", // Anthropic model training
  "Claude-SearchBot", // Claude search
  "Claude-User", // pages fetched for a Claude user
  "Applebot", // Siri / Spotlight
  "Applebot-Extended", // Apple generative models
];

const getRobotsTxt = (sitemapURL: URL, llmsURL: URL) => `${AGENTS.map(a => `User-agent: ${a}\nAllow: /\n`).join("\n")}
User-agent: *
Allow: /

# AI-readable site map (llmstxt.org): ${llmsURL.href}
Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL, new URL("llms.txt", site)));
};
