/**
 * GA4 events, sent only when gtag is on the page (site.gaMeasurementId set).
 * No personal data and nothing from the user's dataset: only the tool's slug,
 * the export format, the share channel and which affiliate placement was clicked.
 * Documented in docs/launch/ra-mat.md ("Đo gì và đo bằng gì").
 *
 * One delegated listener per event type, so it keeps working after ClientRouter
 * swaps pages, and the tools in src/tools/*.html need no changes.
 */
type Gtag = (...args: unknown[]) => void;

// Beacon transport so the hit survives clicks that navigate away (share and affiliate links).
const send = (name: string, params: Record<string, string>) => {
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof g === "function") g("event", name, { ...params, transport_type: "beacon" });
};

const toolSlug = () => location.pathname.match(/^\/cong-cu\/([^/]+)\/?$/)?.[1];

// Tools that compute on a button press; the rest recompute as you type or drag.
const hasRunButton = () => document.querySelector('#main-content button[id$="-run"]') !== null;

// Export buttons by id: [pattern, format]. Ids come from src/tools/*.html.
const EXPORTS: [RegExp, string][] = [
  [/-(word|doc|docx)$/, "docx"],
  [/-(csv|scores|book|all)$/, "csv"],
  [/-sps$/, "sps"],
  [/-png$/, "png"],
  [/-svg$/, "svg"],
  [/-ris$/, "ris"],
  [/-bib$/, "bibtex"],
  [/^bk-gform$/, "google_form"],
  [/^bk-gdf$/, "gdf"],
  [/-link$/, "link"],
  [/-copy(-[a-z]+)?$|-copylog$|-copystats$|-group-c$/, "copy"],
];

let ranThisPage = false;
document.addEventListener("astro:page-load", () => {
  ranThisPage = false;
});

const inTool = (el: Element) =>
  el.closest("#main-content") !== null &&
  el.closest(".share-bar, .app-prose, [data-no-track]") === null;

const firstUse = () => {
  const tool = toolSlug();
  if (!tool || ranThisPage || hasRunButton()) return;
  ranThisPage = true;
  send("tool_run", { tool });
};

document.addEventListener("click", event => {
  const target = event.target as Element | null;
  if (!target) return;

  const sponsored = target.closest<HTMLAnchorElement>('a[rel~="sponsored"]');
  if (sponsored) {
    let domain = "";
    let utmContent = "";
    try {
      const u = new URL(sponsored.href);
      domain = u.hostname;
      utmContent = u.searchParams.get("utm_content") ?? "";
    } catch {
      // keep empty
    }
    send("affiliate_click", {
      placement: sponsored.dataset.placement || utmContent || location.pathname,
      link_domain: domain,
    });
    return;
  }

  const tool = toolSlug();
  if (tool && target.closest("a[data-feedback]")) {
    send("feedback_click", { tool });
    return;
  }
  if (!tool || !inTool(target)) return;
  const button = target.closest<HTMLButtonElement>("button");
  if (!button) {
    if (target.closest("svg, canvas")) firstUse();
    return;
  }
  const id = button.id;
  if (id.endsWith("-run")) {
    send("tool_run", { tool });
    return;
  }
  const format = EXPORTS.find(([re]) => re.test(id))?.[1];
  if (format) {
    send("export", { tool, format });
    return;
  }
  firstUse();
});

for (const type of ["input", "change"]) {
  document.addEventListener(type, event => {
    const target = event.target as Element | null;
    if (target && toolSlug() && inTool(target)) firstUse();
  });
}
