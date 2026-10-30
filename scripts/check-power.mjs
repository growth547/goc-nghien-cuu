// Checks the sample-size math embedded in src/tools/tinh-co-mau.html against
// published reference values. Run: node scripts/check-power.mjs
import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../src/tools/tinh-co-mau.html", import.meta.url), "utf8");
const math = html.split("//#math-start")[1].split("//#math-end")[0];
const { regN, isrN } = new Function(`${math}; return { regN, isrN };`)();
const cases = [
  ["G*Power: f²=.15, 5 predictors, α=.05, power=.80", regN(5, 0.15, 0.05, 0.8), 92],
  ["G*Power: f²=.15, 2 predictors, α=.05, power=.80", regN(2, 0.15, 0.05, 0.8), 68],
  ["G*Power: f²=.15, 3 predictors, α=.05, power=.95", regN(3, 0.15, 0.05, 0.95), 119],
  ["Kock & Hadaya: p_min=.20, α=.05, power=.80", isrN(0.2, 0.05, 0.8), 155],
  ["Kock & Hadaya: p_min=.11, α=.05, power=.80", isrN(0.11, 0.05, 0.8), 511],
];
let bad = 0;
for (const [name, got, want] of cases) {
  const ok = got === want; if (!ok) bad++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${got} (expected ${want})`);
}
const check = (ok, label) => { console.log(`${ok ? "ok  " : "FAIL"} ${label}`); if (!ok) bad++; };

// Kock & Hadaya options follow the Hair et al. (2022) table (each p_min range is computed at its upper bound),
// and the default matches the help text.
const { isrN: isr } = new Function(`${math}; return { isrN };`)();
const opts = [...html.match(/<select id="ss-pmin">([\s\S]*?)<\/select>/)[1].matchAll(/<option value="([\d.]+)"( selected)?>/g)].map(m => [+m[1], Boolean(m[2])]);
const table = { 0.1: 619, 0.2: 155, 0.3: 69, 0.4: 39 };
for (const [v, n] of Object.entries(table)) check(opts.some(o => o[0] === +v) && isr(+v, 0.05, 0.8) === n, `p_min option ${v} gives ${n} as in Hair et al. (2022)`);
check(opts.filter(o => o[1]).map(o => o[0]).join() === "0.2" && /giữ 0,20/.test(html), "p_min default is 0,20, as the help text says");
check(opts.map(o => o[0]).join() === [...opts.map(o => o[0])].sort((a, b) => a - b).join(), "p_min options in ascending order");

// ---- the page itself, run against a tiny DOM: panel and chapter-3 paragraph must agree ----
function fakeDom(markup) {
  const els = {}, dataFor = [], formHandlers = {};
  const attrs = s => Object.fromEntries([...s.matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(m => [m[1], m[2] ?? true]));
  const mk = (tag, a) => ({
    tagName: tag.toUpperCase(), type: a.type || "", id: a.id, hidden: false, innerHTML: "", textContent: "", value: a.value ?? "", checked: Boolean(a.checked),
    dataset: Object.fromEntries(Object.entries(a).filter(([k]) => k.startsWith("data-")).map(([k, v]) => [k.slice(5).replace(/-(\w)/g, (_, c) => c.toUpperCase()), v])),
    addEventListener(ev, fn) { if (a.id === "ss-form") formHandlers[ev] = fn; },
  });
  for (const m of markup.matchAll(/<(input|select|textarea|div|button|label|span|form|small)\b([^>]*)>/g)) {
    const a = attrs(m[2]), el = mk(m[1], a);
    if (m[1] === "select") {
      const body = markup.slice(m.index).match(/<select[^>]*>([\s\S]*?)<\/select>/)[1];
      const os = [...body.matchAll(/<option value="([^"]*)"( selected)?/g)];
      el.value = (os.find(o => o[2]) || os[0])[1];
    }
    if (a.id) els[a.id] = el;
    if (a["data-for"]) dataFor.push(el);
  }
  const doc = {
    getElementById: id => els[id],
    querySelectorAll: () => dataFor,
    querySelector: () => ({ dataset: { labelPls: "Số mũi tên", labelReg: "Số biến độc lập" }, textContent: "" }),
  };
  return { els, doc, fire: () => formHandlers.change() };
}
const page = fakeDom(html);
new Function("document", "navigator", "getSelection", html.split("<script>")[1].split("</script>")[0])(page.doc, {}, () => ({}));
const E = page.els, txt = id => E[id].innerHTML.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const set = (vals, strict = false) => { for (const [k, v] of Object.entries(vals)) E[k].value = String(v); E["ss-strict"].checked = strict; page.fire(); };

set({ "ss-method": "pls", "ss-m": 5 });
check(/Cỡ mẫu tối thiểu 92 /.test(txt("ss-out")) && /power = 0,80/.test(txt("ss-out")) && /α = 0,05/.test(txt("ss-out")), "PLS default: 92, power 0,80, α 0,05 in the panel");
check(/α = 0,05 và power thống kê 0,80/.test(txt("ss-thesis")), "PLS paragraph uses the same α and power format");
set({ "ss-method": "pls", "ss-m": 5, "ss-pmin": "0.2", "ss-drop": 15 }, true);
check(/Cỡ mẫu tối thiểu 155 /.test(txt("ss-out")) && /tối thiểu là 155 quan sát/.test(txt("ss-thesis")) && /phát ra là 183 phiếu/.test(txt("ss-thesis")), "PLS + Kock & Hadaya: panel and paragraph both 155, 183 to send");
set({ "ss-method": "efa", "ss-items": 5 }, true);
check(/Cỡ mẫu tối thiểu 100 /.test(txt("ss-out")) && /max\(100; 10 × 5\) = 100 quan sát/.test(txt("ss-thesis")) && !/10 × 5 = 100/.test(txt("ss-thesis")), "P1-2: EFA 5 items with 10:1 reads max(100; 10 × 5) = 100 in panel and paragraph");
set({ "ss-method": "efa", "ss-items": 30 }, false);
check(/Cỡ mẫu tối thiểu 150 /.test(txt("ss-out")) && /= 150 quan sát/.test(txt("ss-thesis")), "EFA 30 items without 10:1: 150 in both places");
for (const bad of ["0", "", "2.5", "41"]) {
  set({ "ss-method": "reg", "ss-m": bad });
  check(/class="err"/.test(E["ss-out"].innerHTML) && !/quan sát/.test(txt("ss-thesis")), `P1-3/P1-4: m = "${bad}" shows an error and clears the paragraph`);
}
set({ "ss-method": "prop", "ss-e": 5, "ss-p": 50, "ss-N": "" });
check(/1,96²·0,5·0,5\/0,05² = 384,16/.test(txt("ss-out")) && /Cỡ mẫu tối thiểu 385 /.test(txt("ss-out")), "Cochran working reads 1,96²·0,5·0,5/0,05² = 384,16 → 385");
set({ "ss-method": "prop", "ss-e": 0.05, "ss-p": 50, "ss-N": "" });
check(/nhập 5, không nhập 0,05/.test(txt("ss-out")) && /tỷ/.test(txt("ss-out")), "e = 0,05 warns about percent input; cost shown in tỷ");
const t0 = performance.now();
set({ "ss-method": "reg", "ss-m": 40, "ss-alpha": "0.01", "ss-power": "0.95", "ss-f2": "0.02" });
check(performance.now() - t0 < 1500, `P1-16: m = 40, f² = 0,02, α 1%, power .95 renders in ${(performance.now() - t0).toFixed(0)} ms`);

process.exit(bad ? 1 : 0);
