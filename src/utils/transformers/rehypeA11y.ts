// Accessibility fixes for post HTML. Posts are written as raw HTML inside Markdown, and Astro only
// parses raw HTML (rehype-raw) after user plugins, so this works on the raw strings as well as on
// element nodes:
// - every h2–h6 gets a stable id, so the "#" heading links point somewhere and sections can be linked;
// - in tables, header-row cells get scope="col"; when the header row starts with an empty cell, the
//   first cell of each body row becomes a row header <th scope="row"> (axe rule td-has-header).
type Node = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
};

const stripTags = (s: string) =>
  s.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&[a-z#0-9]+;/gi, "");

const text = (n: Node): string =>
  n.type === "text" ? (n.value ?? "") : (n.children ?? []).map(text).join("");

/** "Câu hỏi thường gặp" → "cau-hoi-thuong-gap" */
export const headingSlug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "") || "muc";

function fixTableHtml(table: string) {
  const head = table.match(/<thead[^>]*>\s*<tr[^>]*>([\s\S]*?)<\/tr>/);
  if (!head) return table;
  const emptyCorner = /^\s*<th(\s[^>]*)?>\s*<\/th>/.test(head[1]);
  let out = table.replace(/<thead[^>]*>[\s\S]*?<\/thead>/, thead =>
    thead.replace(/<th(?![^>]*\bscope=)(\s[^>]*)?>/g, (_m, a = "") => `<th scope="col"${a}>`)
  );
  if (emptyCorner)
    out = out.replace(/<tbody[^>]*>[\s\S]*?<\/tbody>/g, tbody =>
      tbody.replace(/(<tr[^>]*>\s*)<td(\s[^>]*)?>([\s\S]*?)<\/td>/g, (_m, tr, a = "", inner) => `${tr}<th scope="row"${a}>${inner}</th>`)
    );
  return out;
}

export default function rehypeA11y() {
  return (tree: Node) => {
    const used = new Set<string>();
    const nextId = (label: string) => {
      const base = headingSlug(label);
      let id = base;
      for (let i = 2; used.has(id); i++) id = `${base}-${i}`;
      used.add(id);
      return id;
    };
    const visit = (n: Node) => {
      if (n.type === "raw" && typeof n.value === "string") {
        n.value = n.value
          .replace(/<h([2-6])(\s[^>]*)?>([\s\S]*?)<\/h\1>/g, (m, lvl, attrs = "", inner) =>
            /\bid=/.test(attrs) ? m : `<h${lvl} id="${nextId(stripTags(inner))}"${attrs}>${inner}</h${lvl}>`
          )
          .replace(/<table[\s\S]*?<\/table>/g, fixTableHtml);
      } else if (n.type === "element" && /^h[2-6]$/.test(n.tagName ?? "")) {
        if (!n.properties?.id) n.properties = { ...n.properties, id: nextId(text(n)) };
        else used.add(String(n.properties.id));
      }
      for (const c of n.children ?? []) visit(c);
    };
    visit(tree);
  };
}
