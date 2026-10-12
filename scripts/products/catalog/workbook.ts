import { renderDocx, renderPdf, renderWorkbook, textFile } from "../render";
import { renderMarkdown } from "../render";
import type { Doc, FormulaCheck, ProductDefinition, ProductMeta, Sheet } from "../types";

export async function workbookProduct(args: {
  meta: ProductMeta;
  filename: string;
  sheets: Sheet[];
  checks: Omit<FormulaCheck, "file">[];
  guide: Doc;
  chart?: { label: string; value: number }[];
  extra?: { path: string; body: Buffer }[];
}): Promise<ProductDefinition> {
  const xlsx = `${args.filename}.xlsx`;
  const files = [
    { path: xlsx, body: await renderWorkbook(args.sheets) },
    { path: `${args.filename}-guide.md`, body: textFile(renderMarkdown(args.guide)) },
    { path: `${args.filename}-guide.pdf`, body: await renderPdf(args.guide, args.meta) },
    { path: `${args.filename}-guide.docx`, body: await renderDocx(args.guide, args.meta) },
    ...(args.extra ?? []),
  ];
  return {
    meta: args.meta,
    files,
    workbooks: [{ file: xlsx, sheets: args.sheets }],
    checks: args.checks.map((check) => ({ ...check, file: xlsx })),
    chart: args.chart,
  };
}

export function grid(
  name: string,
  widths: number[],
  formats: Sheet["columns"][number]["format"][],
  rows: Sheet["rows"],
): Sheet {
  return {
    name,
    columns: widths.map((width, index) => ({ width, format: formats[index] })),
    rows,
  };
}
