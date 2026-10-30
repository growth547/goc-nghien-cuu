// Listed-bank pilot dataset (/du-lieu/ngan-hang-niem-yet/): line items extracted from each bank's own audited
// consolidated financial statements, with provenance per value. Built offline; validated by scripts/check-bank-data.mjs.
import values from "@/data/ngan-hang-niem-yet/values.json";
import banks from "@/data/ngan-hang-niem-yet/banks.json";
import review from "@/data/ngan-hang-niem-yet/review.json";

export type BankValue = (typeof values)[number];
export type Bank = (typeof banks)[number];
export { banks, review };
export const bankValues = values as BankValue[];

export const BANK_FILES = {
  long: "ngan-hang-niem-yet-bctc-dang-dai.csv",
  panel: "ngan-hang-niem-yet-bang-nam.csv",
} as const;

export const LONG_HEADER = [
  "bank",
  "year",
  "item_code",
  "item_name",
  "value_vnd_million",
  "unit_printed",
  "statement",
  "source_url",
  "file_name",
  "report_year",
  "column",
  "page",
  "extraction_passes",
  "identity_checked",
  "cross_check",
  "restated_in_next_report",
] as const;

export const longRow = (v: BankValue) => [
  v.bank,
  v.year,
  v.item_code,
  v.item_name,
  v.value,
  v.unit_printed,
  v.statement,
  v.source_url,
  v.file_name,
  v.report_year,
  v.column,
  v.page,
  v.passes,
  v.identity_checked,
  v.cross_check,
  v.restated_in_next_report,
];

/** Raw items carried into the wide panel, in this order. */
export const PANEL_ITEMS = [
  "total_assets",
  "loans_gross",
  "loan_loss_reserve",
  "customer_deposits",
  "total_equity",
  "interest_income",
  "interest_expense",
  "net_interest_income",
  "net_fee_income",
  "total_operating_income",
  "operating_expense",
  "provision_expense",
  "profit_before_tax",
  "profit_after_tax",
  "loans_group3",
  "loans_group4",
  "loans_group5",
  "classified_loans_total",
] as const;

/** Computed variables, formulas as in the variable library (/bien-nghien-cuu/). */
export const VARIABLES = [
  { code: "roa", name: "ROA", formula: "LNST / Tổng tài sản", page: "roa" },
  { code: "roe", name: "ROE", formula: "LNST / Vốn chủ sở hữu", page: "roe" },
  { code: "nim_ta", name: "NIM (trên tổng tài sản bình quân)", formula: "Thu nhập lãi thuần / [(TTS đầu kỳ + cuối kỳ) / 2]", page: "nim" },
  { code: "cir", name: "CIR", formula: "Chi phí hoạt động / Tổng thu nhập hoạt động", page: "ty-le-chi-phi-tren-thu-nhap" },
  { code: "npl", name: "Tỷ lệ nợ xấu", formula: "(Nhóm 3 + 4 + 5) / Tổng dư nợ phân loại", page: "ty-le-no-xau" },
  { code: "ldr", name: "LDR", formula: "Cho vay khách hàng / Tiền gửi của khách hàng", page: "ty-le-cho-vay-tren-tien-gui" },
  { code: "eqta", name: "VCSH / Tổng tài sản", formula: "Vốn chủ sở hữu / Tổng tài sản", page: "von-chu-so-huu-tren-tong-tai-san" },
  { code: "llp", name: "Chi phí dự phòng / Cho vay", formula: "Chi phí dự phòng rủi ro tín dụng / Cho vay khách hàng", page: "chi-phi-du-phong-rui-ro-tin-dung" },
  { code: "zscore", name: "Z-score (cửa sổ 3 năm)", formula: "(ROA + VCSH/TTS) / σ(ROA của t, t−1, t−2)", page: "z-score-ngan-hang" },
] as const;

type Row = Record<string, number | undefined>;

/** bank -> year -> item_code -> value */
export function panel() {
  const t = new Map<string, Map<number, Row>>();
  for (const v of bankValues) {
    if (!t.has(v.bank)) t.set(v.bank, new Map());
    const b = t.get(v.bank)!;
    if (!b.has(v.year)) b.set(v.year, {});
    b.get(v.year)![v.item_code] = v.value;
  }
  return t;
}

const ratio = (a?: number, b?: number) => (a === undefined || b === undefined || b === 0 ? undefined : a / b);
const sd = (xs: number[]) => {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
};

/** Computed variables per bank-year; undefined where an input is missing. */
export function computed(rows: Map<number, Row>) {
  const out = new Map<number, Row>();
  const years = [...rows.keys()].sort();
  for (const y of years) {
    const r = rows.get(y)!;
    const p = rows.get(y - 1);
    const g = r.loans_group3 !== undefined && r.loans_group4 !== undefined && r.loans_group5 !== undefined;
    const c: Row = {
      roa: ratio(r.profit_after_tax, r.total_assets),
      roe: ratio(r.profit_after_tax, r.total_equity),
      nim_ta:
        p?.total_assets !== undefined && r.total_assets !== undefined
          ? ratio(r.net_interest_income, (p.total_assets + r.total_assets) / 2)
          : undefined,
      cir: r.operating_expense !== undefined ? ratio(-r.operating_expense, r.total_operating_income) : undefined,
      npl: g ? ratio(r.loans_group3! + r.loans_group4! + r.loans_group5!, r.classified_loans_total) : undefined,
      ldr: ratio(r.loans_gross, r.customer_deposits),
      eqta: ratio(r.total_equity, r.total_assets),
      llp: r.provision_expense !== undefined ? ratio(-r.provision_expense, r.loans_gross) : undefined,
    };
    out.set(y, c);
  }
  for (const y of years) {
    const win = [y, y - 1, y - 2].map(k => out.get(k)?.roa);
    const c = out.get(y)!;
    if (win.every(x => x !== undefined) && c.eqta !== undefined) {
      const s = sd(win as number[]);
      c.zscore = s > 0 ? (c.roa! + c.eqta) / s : undefined;
    }
  }
  return out;
}

export const round = (x: number | undefined, d = 6) => (x === undefined || !Number.isFinite(x) ? "" : Number(x.toFixed(d)));
