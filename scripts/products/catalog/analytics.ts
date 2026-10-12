import { csv, renderMarkdown, textFile } from "../render";
import { grid, workbookProduct } from "./workbook";
import { money, slugify, type ProductMeta, type Sheet } from "../types";

const disclaimer = "The workbook and CSV are sample data for learning the model. A PBIX file is not included. Paste the DAX into Power BI Desktop after you load the CSV. This is not a financial audit.";

type Model = {
  number: number;
  name: string;
  summary: string;
  audience: string;
  tags: string[];
  prices: [number, number, number, number];
  table: string;
  columns: string[];
  rows: string[][];
  measures: { name: string; dax: string; plain: string }[];
  valueColumn: number;
  valueHeader: string;
};

function meta(model: Model): ProductMeta {
  return {
    id: `ANL-${String(model.number).padStart(3, "0")}`,
    slug: slugify(model.name),
    name: model.name,
    category: "analytics",
    categorySlug: "analytics-dashboards",
    categoryLabel: "Analytics dashboards",
    productType: "Excel summary, CSV dataset, and DAX measures",
    audience: model.audience,
    version: "1.0.0",
    licence: "commercial-single",
    summary: model.summary,
    description: `${model.summary} Load the CSV into Excel or Power BI Desktop. The DAX file is text you paste into a measure. This package does not include a PBIX file.`,
    benefits: ["A CSV with a real grain and sample rows", "DAX that names the columns in that CSV", "An Excel total you can check against the rows"],
    compatibility: ["Excel for the workbook and CSV", "Power BI Desktop if you paste the DAX yourself", "No PBIX file is included"],
    tags: model.tags,
    prices: money(...model.prices),
    disclaimer,
  };
}

function rows(seed: number, count: number, build: (index: number, random: () => number) => string[]) {
  let state = seed;
  const random = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  return Array.from({ length: count }, (_, index) => build(index, random));
}

const months = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];

function modelRows(labels: string[], amounts: number[]) {
  const data: string[][] = [];
  months.forEach((month, monthIndex) => {
    labels.forEach((label, labelIndex) => {
      const amount = amounts[(monthIndex + labelIndex) % amounts.length] + monthIndex * 15 + labelIndex * 7;
      data.push([month, label, String(amount)]);
    });
  });
  return data;
}

const specs: Array<
  Omit<Model, "rows" | "columns" | "valueColumn" | "valueHeader" | "table" | "measures"> & {
    labels: string[];
    amounts: number[];
    measureNoun: string;
  }
> = [
  { number: 1, name: "Retail sales summary", summary: "Monthly sales by store for a three-store retailer.", audience: "A retailer comparing stores.", tags: ["retail"], prices: [349, 29, 22, 25], labels: ["Observatory", "Woodstock", "Durban North"], amounts: [82000, 64000, 71000], measureNoun: "Sales" },
  { number: 2, name: "SaaS monthly recurring revenue", summary: "Monthly recurring revenue by plan for a small software product.", audience: "A founder tracking plans.", tags: ["saas"], prices: [399, 32, 25, 28], labels: ["Starter", "Team", "Workshop"], amounts: [18000, 42000, 9000], measureNoun: "MRR" },
  { number: 3, name: "Inventory units on hand", summary: "Units on hand by category for a home-goods shop.", audience: "A buyer watching stock.", tags: ["inventory"], prices: [329, 27, 21, 24], labels: ["Textile", "Ceramic", "Paper"], amounts: [120, 80, 200], measureNoun: "Units" },
  { number: 4, name: "Campaign spend and leads", summary: "Spend by channel. The measure is spend, not a guessed return.", audience: "A marketer who knows spend and not yet revenue.", tags: ["marketing"], prices: [349, 29, 22, 25], labels: ["Search", "Email", "Partners"], amounts: [8000, 1500, 3200], measureNoun: "Spend" },
  { number: 5, name: "Headcount by team", summary: "Month-end headcount for three teams. It is a count, not a payroll.", audience: "An operator watching team size.", tags: ["people"], prices: [299, 24, 19, 22], labels: ["Delivery", "Studio", "Operations"], amounts: [6, 4, 2], measureNoun: "People" },
  { number: 6, name: "Project hours and fees", summary: "Fees billed by project for a studio.", audience: "A studio owner.", tags: ["projects"], prices: [379, 31, 24, 27], labels: ["Harbour", "Northlight", "Yard"], amounts: [24000, 18000, 9000], measureNoun: "Fees" },
  { number: 7, name: "Cash collected by week group", summary: "Cash collected by customer group. It is collections, not invoices sent.", audience: "An owner watching cash, not sales.", tags: ["cash"], prices: [359, 29, 22, 25], labels: ["Retainers", "Projects", "Products"], amounts: [30000, 22000, 8000], measureNoun: "Collected" },
  { number: 8, name: "Support tickets closed", summary: "Tickets closed by queue.", audience: "A support lead.", tags: ["support"], prices: [299, 24, 19, 22], labels: ["Orders", "Downloads", "Billing"], amounts: [40, 25, 12], measureNoun: "Tickets" },
  { number: 9, name: "Shop conversion inputs", summary: "Sessions by channel. Conversion is not invented because orders are not in this table.", audience: "A shop owner who has sessions and will add orders later.", tags: ["ecommerce"], prices: [329, 27, 21, 24], labels: ["Search", "Direct", "Email"], amounts: [4200, 1800, 900], measureNoun: "Sessions" },
  { number: 10, name: "Cafe covers", summary: "Covers served by daypart.", audience: "A cafe owner.", tags: ["cafe"], prices: [279, 22, 17, 20], labels: ["Morning", "Lunch", "Afternoon"], amounts: [80, 60, 30], measureNoun: "Covers" },
  { number: 11, name: "Site cost ledger", summary: "Costs by cost code for a small building job.", audience: "A contractor comparing codes.", tags: ["construction"], prices: [359, 29, 22, 25], labels: ["Labour", "Materials", "Hire"], amounts: [48000, 36000, 9000], measureNoun: "Cost" },
  { number: 12, name: "Donor receipts", summary: "Receipts by fund for a small nonprofit. Not a set of financial statements.", audience: "A treasurer of a small organisation.", tags: ["nonprofit"], prices: [299, 24, 19, 22], labels: ["General", "Library", "Transport"], amounts: [15000, 8000, 4000], measureNoun: "Receipts" },
  { number: 13, name: "Delivery stops", summary: "Stops completed by route.", audience: "A small delivery operation.", tags: ["logistics"], prices: [329, 27, 21, 24], labels: ["Atlantic", "City", "South"], amounts: [110, 140, 90], measureNoun: "Stops" },
  { number: 14, name: "Clinic sessions used", summary: "Booked sessions by practitioner. No patient names and no clinical notes.", audience: "A practice manager counting sessions.", tags: ["clinic"], prices: [299, 24, 19, 22], labels: ["Room A", "Room B", "Room C"], amounts: [70, 64, 40], measureNoun: "Sessions" },
  { number: 15, name: "Subscription cohort size", summary: "Active subscribers by start-quarter cohort. It is a count, not a churn model.", audience: "A product person looking at cohorts they already counted.", tags: ["subscriptions"], prices: [399, 32, 25, 28], labels: ["2025 Q3", "2025 Q4", "2026 Q1"], amounts: [40, 55, 30], measureNoun: "Subscribers" },
  { number: 16, name: "Pipeline weighted value", summary: "Open opportunity value by stage. Weighting is not applied because the stage odds were not measured.", audience: "A salesperson who wants the unweighted value first.", tags: ["pipeline"], prices: [349, 29, 22, 25], labels: ["Qualified", "Proposal", "Verbal"], amounts: [60000, 40000, 25000], measureNoun: "Value" },
  { number: 17, name: "Brochure downloads", summary: "File downloads by guide. These are downloads, not sales.", audience: "A content lead.", tags: ["content"], prices: [249, 20, 16, 18], labels: ["Pricing guide", "Checklist", "Case study"], amounts: [300, 180, 90], measureNoun: "Downloads" },
  { number: 18, name: "Workshop defect counts", summary: "Defects found by product line. A defect is a unit that failed the check.", audience: "A small workshop.", tags: ["quality"], prices: [329, 27, 21, 24], labels: ["Chairs", "Tables", "Shelves"], amounts: [4, 2, 6], measureNoun: "Defects" },
  { number: 19, name: "Billable utilisation hours", summary: "Billable hours by person. Available hours are not in the table, so utilisation is not pretended.", audience: "A professional services lead.", tags: ["services"], prices: [349, 29, 22, 25], labels: ["Lerato", "Sam", "Pieter"], amounts: [120, 100, 80], measureNoun: "Hours" },
  { number: 20, name: "Multi-store refunds", summary: "Refund amounts by store. Refunds are not subtracted from a sales table that is not here.", audience: "A retailer who wants refunds visible on their own.", tags: ["refunds"], prices: [299, 24, 19, 22], labels: ["Observatory", "Woodstock", "Durban North"], amounts: [2400, 1800, 2100], measureNoun: "Refunds" },
];

function buildModel(spec: (typeof specs)[number]): Model {
  const data = modelRows(spec.labels, spec.amounts);
  const amountName = spec.measureNoun;
  return {
    ...spec,
    table: "Facts",
    columns: ["Month", "Name", amountName],
    rows: data,
    valueColumn: 2,
    valueHeader: amountName,
    measures: [
      { name: `Total ${amountName}`, dax: `Total ${amountName} = SUM(Facts[${amountName}])`, plain: `Adds every ${amountName} row.` },
      { name: `${amountName} rows`, dax: `${amountName} rows = COUNTROWS(Facts)`, plain: "Counts the rows in the sample, which is one row per month and name." },
      { name: `Average ${amountName}`, dax: `Average ${amountName} = DIVIDE(SUM(Facts[${amountName}]), COUNTROWS(Facts))`, plain: "Average per row, not per day." },
    ],
  };
}

export async function analyticsProducts() {
  const products = [];
  for (const spec of specs) {
    const model = buildModel(spec);
    const product = meta(model);
    const total = model.rows.reduce((sum, row) => sum + Number(row[2]), 0);
    const sheet: Sheet = grid("Summary", [28, 18, 40], ["text", "number", "text"], [
      ["Metric", "Value", "Note"],
      [`Total ${model.valueHeader}`, `=SUM(Data!C2:C${model.rows.length + 1})`, "Same total as the CSV"],
      ["Rows", String(model.rows.length), "Month and name combinations"],
    ]);
    const dataSheet: Sheet = grid("Data", [16, 24, 16], ["text", "text", "number"], [
      model.columns,
      ...model.rows.map((row) => [row[0], row[1], Number(row[2])]),
    ]);
    const dictionary = renderMarkdown({
      title: `${model.name} data dictionary`,
      kicker: "Sample rows. Replace them with your export.",
      blocks: [
        { kind: "p", text: model.summary },
        { kind: "table", headers: ["Column", "Meaning"], rows: [
          ["Month", "Calendar month in YYYY-MM. One row is one month and one name."],
          ["Name", "The store, plan, team, or other label in this pack."],
          [model.valueHeader, "The measure for that row. Do not mix currencies inside the column."],
        ] },
        { kind: "h", text: "DAX" },
        { kind: "p", text: "Create the table named Facts from the CSV, then paste these measures. They will fail if you rename the table or the columns." },
        { kind: "ul", items: model.measures.map((measure) => `${measure.dax} — ${measure.plain}`) },
        { kind: "note", text: disclaimer },
      ],
    });
    const dax = model.measures.map((measure) => measure.dax).join("\n\n");
    const workbook = await workbookProduct({
      meta: product,
      filename: "summary",
      sheets: [dataSheet, sheet],
      checks: [{ sheet: "Summary", cell: "B2", expected: total, tolerance: 0.01 }],
      guide: {
        title: model.name,
        kicker: "Excel summary plus a CSV for Power BI Desktop.",
        blocks: [
          { kind: "p", text: model.summary },
          { kind: "ol", items: [
            "Open summary.xlsx and confirm the total matches the data sheet.",
            "Load facts.csv into Power BI Desktop as a table named Facts.",
            "Paste measures.dax into new measures.",
            "Replace the sample rows before you use the numbers in a report.",
          ] },
          { kind: "note", text: disclaimer },
        ],
      },
      chart: spec.labels.map((label, index) => ({ label: label.slice(0, 12), value: spec.amounts[index] })),
      extra: [
        { path: "facts.csv", body: textFile(csv([model.columns, ...model.rows])) },
        { path: "measures.dax", body: textFile(dax) },
        { path: "data-dictionary.md", body: textFile(dictionary) },
      ],
    });
    products.push(workbook);
  }
  return products;
}
