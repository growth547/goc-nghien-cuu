import type { APIRoute } from "astro";
import { csvLine, csvResponse } from "@/utils/dataSeries";
import { BANK_FILES, LONG_HEADER, bankValues, longRow } from "./_lib/banks";

// Listed banks, long format: one row per bank-year-line item, with the source file, page and checks of each value.
export const GET: APIRoute = () =>
  csvResponse(
    [
      csvLine([...LONG_HEADER]),
      ...[...bankValues]
        .sort((a, b) => a.bank.localeCompare(b.bank) || a.year - b.year || a.item_code.localeCompare(b.item_code))
        .map(v => csvLine(longRow(v))),
    ],
    BANK_FILES.long
  );
