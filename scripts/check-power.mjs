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
process.exit(bad ? 1 : 0);
