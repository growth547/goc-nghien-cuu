// Kept for old instructions: the World Bank WDI fetch is now part of scripts/fetch-data.mjs,
// which refreshes every registered source (scripts/data-sources.mjs). This runs only the WDI step.
//   node scripts/fetch-worldbank.mjs   ==   node scripts/fetch-data.mjs wdi
import { spawnSync } from "node:child_process";

const r = spawnSync(process.execPath, [new URL("./fetch-data.mjs", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "wdi", ...process.argv.slice(2)], { stdio: "inherit" });
process.exit(r.status ?? 1);
