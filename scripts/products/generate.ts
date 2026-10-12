import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ZipArchive } from "archiver";
import ExcelJS from "exceljs";
import { unzipSync } from "fflate";
import { licenceDocument, readmeDocument, usageDocument, docBuffer } from "./customer-docs";
import { evaluateCell } from "./formula";
import { csv, renderCoverPng, renderCoverSvg, renderWorkbook, sha256, sheetsToInput, textFile } from "./render";
import { currencies, type OutputFile, type ProductDefinition, type Sheet } from "./types";
import { allProducts } from "./catalog";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const libraryRoot = path.join(root, "products", "library");
const banned = [/lorem ipsum/i, /\bTODO\b/, /\bFIXME\b/, /\bTBD\b/, /\[placeholder\]/i, /your text here/i];
const secrets = [/sk_live_[A-Za-z0-9]/, /AKIA[0-9A-Z]{16}/, /BEGIN (RSA |OPENSSH )?PRIVATE KEY/, /postgres:\/\/.+:.+@/];

type ReportRow = {
  id: string;
  name: string;
  category: string;
  status: "passed" | "failed";
  errors: string[];
  files: number;
  zipBytes: number;
};

async function zipDirectory(source: string, destination: string) {
  await new Promise<void>((resolve, reject) => {
    const output = createWriteStream(destination);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    output.on("close", () => resolve());
    output.on("error", reject);
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(source, false);
    void archive.finalize();
  });
}

function assertSafePath(relativePath: string) {
  if (relativePath.includes("\\")) throw new Error(`Use forward slashes in ${relativePath}.`);
  const normalised = path.posix.normalize(relativePath);
  if (normalised.startsWith("..") || path.posix.isAbsolute(normalised)) {
    throw new Error(`Unsafe product path ${relativePath}.`);
  }
}

async function writeTree(directory: string, files: OutputFile[]) {
  for (const file of files) {
    assertSafePath(file.path);
    const target = path.join(directory, file.path);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, file.body);
  }
}

function scanBuffer(filePath: string, body: Buffer, errors: string[]) {
  if (!/\.(md|csv|svg|html|txt|json|js|mjs|dax|css)$/i.test(filePath)) return;
  const text = body.toString("utf8");
  for (const pattern of banned) {
    if (pattern.test(text)) errors.push(`${filePath} contains unfinished text (${pattern}).`);
  }
  for (const pattern of secrets) {
    if (pattern.test(text)) errors.push(`${filePath} looks like it contains a secret.`);
  }
}

async function workbookFormulasMatch(filePath: string, sheets: Sheet[], errors: string[]) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const input = sheetsToInput(sheets);
  for (const sheet of sheets) {
    const worksheet = workbook.getWorksheet(sheet.name);
    if (!worksheet) {
      errors.push(`${path.basename(filePath)} is missing sheet ${sheet.name}.`);
      continue;
    }
    sheet.rows.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {
        if (typeof value !== "string" || !value.startsWith("=")) return;
        const cell = worksheet.getCell(rowIndex + 1, columnIndex + 1);
        const stored = cell.value;
        const formula = stored && typeof stored === "object" && "formula" in stored ? String(stored.formula) : "";
        if (formula.replace(/^=/, "") !== value.slice(1)) {
          errors.push(`${sheet.name}!${cell.address} formula was not saved.`);
        }
        try {
          const result = evaluateCell(input, sheet.name, cell.address);
          if (typeof result === "number" && !Number.isFinite(result)) {
            errors.push(`${sheet.name}!${cell.address} is not finite.`);
          }
        } catch (error) {
          errors.push(`${sheet.name}!${cell.address}: ${error instanceof Error ? error.message : "formula failed"}`);
        }
      });
    });
  }
}

function runNodeTests(directory: string) {
  return new Promise<{ ok: boolean; output: string }>((resolve) => {
    const child = spawn(process.execPath, ["--test"], { cwd: directory, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      output += chunk.toString();
    });
    child.on("close", (code) => resolve({ ok: code === 0, output }));
  });
}

async function publish(product: ProductDefinition): Promise<ReportRow> {
  const errors: string[] = [];
  const customer = path.join(libraryRoot, product.meta.id, "customer");
  const internal = path.join(libraryRoot, product.meta.id, "internal");
  const zipPath = path.join(libraryRoot, product.meta.id, `${product.meta.id}.zip`);
  await rm(path.join(libraryRoot, product.meta.id), { recursive: true, force: true });
  await mkdir(customer, { recursive: true });
  await mkdir(internal, { recursive: true });

  const svg = renderCoverSvg(product.meta, product.chart);
  let png = Buffer.alloc(0);
  try {
    png = await renderCoverPng(svg);
  } catch (error) {
    errors.push(`Cover render failed: ${error instanceof Error ? error.message : "unknown"}`);
  }

  const deliverableNames = product.files.map((file) => file.path);
  const standardNames = ["README.md", "LICENCE.md", "USAGE.md", "preview/cover.svg", "preview/cover.png", "manifest.json"];
  const readme = docBuffer(readmeDocument(product.meta, [...deliverableNames, ...standardNames.filter((name) => name !== "README.md")]));
  const files: OutputFile[] = [
    { path: "README.md", body: readme },
    { path: "LICENCE.md", body: docBuffer(licenceDocument(product.meta)) },
    { path: "USAGE.md", body: docBuffer(usageDocument(product.meta)) },
    { path: "preview/cover.svg", body: textFile(svg) },
    { path: "preview/cover.png", body: png },
    ...product.files,
  ];

  const seen = new Set<string>();
  for (const file of files) {
    if (seen.has(file.path)) errors.push(`Duplicate file ${file.path}.`);
    seen.add(file.path);
    if (file.body.length === 0) errors.push(`${file.path} is empty.`);
    scanBuffer(file.path, file.body, errors);
    if (file.path.endsWith(".pdf") && file.body.subarray(0, 5).toString() !== "%PDF-") {
      errors.push(`${file.path} is not a PDF.`);
    }
    if (file.path.endsWith(".png") && file.body.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
      errors.push(`${file.path} is not a PNG.`);
    }
  }

  const manifestFiles = files.map((file) => ({
    path: file.path,
    bytes: file.body.length,
    sha256: sha256(file.body),
  }));
  const manifest = textFile(JSON.stringify({
    id: product.meta.id,
    name: product.meta.name,
    version: product.meta.version,
    licence: product.meta.licence,
    generatedOn: "2026-10-12",
    files: manifestFiles,
  }, null, 2));
  files.push({ path: "manifest.json", body: manifest });

  await writeTree(customer, files);
  await zipDirectory(customer, zipPath);

  for (const workbook of product.workbooks ?? []) {
    await workbookFormulasMatch(path.join(customer, workbook.file), workbook.sheets, errors);
  }

  for (const check of product.checks) {
    const source = product.workbooks?.find((workbook) => workbook.file === check.file);
    if (!source) {
      errors.push(`Missing workbook source for ${check.file}.`);
      continue;
    }
    try {
      const actual = evaluateCell(sheetsToInput(source.sheets), check.sheet, check.cell);
      const tolerance = check.tolerance ?? 0.01;
      if (typeof actual !== "number" || Math.abs(actual - check.expected) > tolerance) {
        errors.push(`${check.sheet}!${check.cell} expected ${check.expected} but was ${String(actual)}.`);
      }
    } catch (error) {
      errors.push(`${check.sheet}!${check.cell}: ${error instanceof Error ? error.message : "check failed"}`);
    }
  }

  const zip = await readFile(zipPath);
  const entries = unzipSync(zip);
  const entryNames = Object.keys(entries)
    .map((name) => name.replace(/\\/g, "/"))
    .filter((name) => !name.endsWith("/"))
    .sort();
  const expectedNames = files.map((file) => file.path).sort();
  if (entryNames.join("\n") !== expectedNames.join("\n")) {
    errors.push(`ZIP contents do not match the customer folder.`);
  }
  if (entryNames.some((name) => name.includes("..") || name.startsWith("/") || name.includes("internal/"))) {
    errors.push("ZIP contains an unsafe path.");
  }

  if (product.nodeTest) {
    const result = await runNodeTests(customer);
    if (!result.ok) errors.push(`Node tests failed:\n${result.output.slice(-2000)}`);
  }

  const status = errors.length ? "failed" : "passed";
  await writeFile(path.join(internal, "qa.json"), JSON.stringify({
    id: product.meta.id,
    status,
    publication: "draft",
    note: "Automated checks passed does not publish the product. An administrator still approves it for sale.",
    errors,
    checkedOn: "2026-10-12",
  }, null, 2));
  await writeFile(path.join(internal, "meta.json"), JSON.stringify(product.meta, null, 2));

  return {
    id: product.meta.id,
    name: product.meta.name,
    category: product.meta.category,
    status,
    errors,
    files: files.length,
    zipBytes: zip.length,
  };
}

function catalogueRows(products: ProductDefinition[], reports: ReportRow[]) {
  const byId = new Map(reports.map((report) => [report.id, report]));
  return products.map((product) => {
    const report = byId.get(product.meta.id);
    return [
      product.meta.id,
      product.meta.slug,
      product.meta.name,
      product.meta.category,
      product.meta.categoryLabel,
      product.meta.productType,
      "draft",
      report?.status ?? "failed",
      product.meta.version,
      product.meta.licence,
      (product.meta.prices.ZAR / 100).toFixed(2),
      (product.meta.prices.USD / 100).toFixed(2),
      (product.meta.prices.GBP / 100).toFixed(2),
      (product.meta.prices.EUR / 100).toFixed(2),
      product.meta.summary,
      product.meta.tags.join("|"),
      `products/library/${product.meta.id}/${product.meta.id}.zip`,
    ];
  });
}

async function main() {
  const products = await allProducts();
  const ids = new Set<string>();
  const counts = new Map<string, number>();
  for (const product of products) {
    if (ids.has(product.meta.id)) throw new Error(`Duplicate product ${product.meta.id}.`);
    ids.add(product.meta.id);
    counts.set(product.meta.category, (counts.get(product.meta.category) ?? 0) + 1);
    for (const currency of currencies) {
      if (!Number.isInteger(product.meta.prices[currency]) || product.meta.prices[currency] <= 0) {
        throw new Error(`${product.meta.id} has an invalid ${currency} price.`);
      }
    }
  }

  const reports: ReportRow[] = [];
  for (const product of products) {
    process.stdout.write(`Building ${product.meta.id} ${product.meta.name}\n`);
    reports.push(await publish(product));
  }

  const header = ["id", "slug", "name", "category", "category_label", "product_type", "publication_status", "qa_status", "version", "licence", "price_zar", "price_usd", "price_gbp", "price_eur", "summary", "tags", "zip"];
  const rows = catalogueRows(products, reports);
  await mkdir(path.join(root, "products"), { recursive: true });
  await writeFile(path.join(root, "products", "catalogue.csv"), csv([header, ...rows.map((row) => row.map(String))]));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Catalogue");
  sheet.addRows([header, ...rows]);
  await workbook.xlsx.writeFile(path.join(root, "products", "catalogue.xlsx"));

  const failed = reports.filter((report) => report.status === "failed");
  const lines = [
    "# MOHAO product QA report",
    "",
    `Generated: 2026-10-12`,
    "",
    `Products built: ${reports.length}`,
    `Passed automated checks: ${reports.length - failed.length}`,
    `Failed automated checks: ${failed.length}`,
    "",
    "Publication status remains draft until a person approves each product for sale. Automated QA does not publish products.",
    "",
    "## Category counts",
    "",
    ...[...counts.entries()].map(([category, count]) => `- ${category}: ${count}`),
    "",
    "## Limitations",
    "",
    "- Design kits are SVG and HTML files that can be uploaded into Canva. They are not native Canva template files.",
    "- Notion packs are Markdown and CSV import packages. They are not published Notion templates.",
    "- Analytics packs include Excel workbooks, CSV tables, a data dictionary, and DAX measure text. They do not include a Power BI PBIX file.",
    "- Formula results were checked with MOHAO's spreadsheet evaluator and confirmed present in the workbook. Open the file in Excel to confirm Excel's own calculation cache.",
    "- Sample data is fictional.",
    "- Finance, tax, legal, and health products are practical worksheets, not professional advice.",
    "",
  ];
  if (failed.length) {
    lines.push("## Failures", "");
    for (const report of failed) {
      lines.push(`### ${report.id}`, "", ...report.errors.map((error) => `- ${error}`), "");
    }
  } else {
    lines.push("## Failures", "", "None.", "");
  }
  await writeFile(path.join(root, "products", "QA-REPORT.md"), lines.join("\n"));
  await writeFile(path.join(root, "products", "qa-report.json"), JSON.stringify({ generatedOn: "2026-10-12", counts: Object.fromEntries(counts), reports }, null, 2));

  if (failed.length) {
    process.stderr.write(`${failed.length} products failed QA.\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`All ${reports.length} products passed automated QA.\n`);
  }
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
