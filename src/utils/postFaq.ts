// Questions and answers of a post's "Câu hỏi thường gặp" section, read from the post source, for
// FAQPage JSON-LD. Only what is visibly on the page: each <h3> under that <h2> is a question and the
// text up to the next heading is its answer.
const strip = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+([,.;:!?)])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

export type Faq = { question: string; answer: string }[];

export function postFaq(body: string | undefined): Faq {
  if (!body) return [];
  const start = body.search(/<h2[^>]*>\s*Câu hỏi thường gặp\s*<\/h2>/i);
  if (start < 0) return [];
  const rest = body.slice(start).replace(/^<h2[^>]*>[\s\S]*?<\/h2>/i, "");
  const end = rest.search(/<h2[\s>]/i);
  const section = end < 0 ? rest : rest.slice(0, end);
  const faq: Faq = [];
  for (const m of section.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[\s>]|$)/gi)) {
    const question = strip(m[1]);
    const answer = strip(m[2]);
    if (question && answer) faq.push({ question, answer });
  }
  return faq;
}
