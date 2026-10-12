import type { CellInput } from "./formula";

export const currencies = ["ZAR", "USD", "GBP", "EUR"] as const;
export type Currency = (typeof currencies)[number];

export type Licence = "personal" | "commercial-single" | "developer-project";

export type Block =
  | { kind: "h"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { kind: "note"; text: string };

export type Doc = {
  title: string;
  kicker?: string;
  blocks: Block[];
};

export type SheetFormat = "text" | "zar" | "usd" | "number" | "percent" | "integer";

export type Sheet = {
  name: string;
  columns: { width: number; format?: SheetFormat }[];
  rows: CellInput[][];
};

export type ProductMeta = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  categoryLabel: string;
  productType: string;
  audience: string;
  version: string;
  licence: Licence;
  summary: string;
  description: string;
  benefits: string[];
  compatibility: string[];
  tags: string[];
  prices: Record<Currency, number>;
  compareAt?: Partial<Record<Currency, number>>;
  disclaimer?: string;
};

export type FormulaCheck = {
  file: string;
  sheet: string;
  cell: string;
  expected: number;
  tolerance?: number;
};

export type OutputFile = {
  path: string;
  body: Buffer;
};

export type ProductDefinition = {
  meta: ProductMeta;
  files: OutputFile[];
  checks: FormulaCheck[];
  workbooks?: { file: string; sheets: Sheet[] }[];
  nodeTest?: boolean;
  chart?: { label: string; value: number }[];
};

export function money(zar: number, usd: number, gbp: number, eur: number): Record<Currency, number> {
  return { ZAR: Math.round(zar * 100), USD: Math.round(usd * 100), GBP: Math.round(gbp * 100), EUR: Math.round(eur * 100) };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
