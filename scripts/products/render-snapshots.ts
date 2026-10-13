import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";

const libraryRoot = path.join(process.cwd(), "products", "library");
const skipped = new Set(["README.md", "LICENCE.md", "USAGE.md", "manifest.json"]);

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clip(value: string, max: number) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function wrap(text: string, maxChars: number, maxLines: number) {
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      if (lines.length === maxLines) return lines;
      current = word;
    } else {
      current = next;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

function cellText(value: ExcelJS.CellValue): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "number") {
    return Number.isInteger(value) ? value.toLocaleString("en-ZA") : value.toLocaleString("en-ZA", { maximumFractionDigits: 2 });
  }
  if (typeof value === "object") {
    if ("result" in value && value.result != null) return cellText(value.result as ExcelJS.CellValue);
    if ("richText" in value) return value.richText.map((part) => part.text).join("");
    if ("text" in value && typeof value.text === "string") return value.text;
    if ("formula" in value) return "";
  }
  return String(value);
}

function frame(body: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <rect width="1200" height="750" fill="#f4f3ef"/>
  <rect x="28" y="24" width="1144" height="702" rx="18" fill="#ffffff" stroke="#e6e4de"/>
  ${body}
</svg>
`;
}

function text(x: number, y: number, value: string, size: number, fill: string, weight = 400) {
  return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(value)}</text>`;
}

function documentSvg(title: string, intro: string, sections: { title: string; lines: string[] }[]) {
  const bits = [
    text(64, 78, clip(title, 42), 32, "#0b0b0b", 700),
    ...wrap(intro, 78, 2).map((line, index) => text(64, 118 + index * 24, line, 16, "#5f5e58")),
  ];
  let y = intro ? 176 : 128;
  for (const section of sections.slice(0, 4)) {
    if (y > 640) break;
    bits.push(text(64, y, clip(section.title, 48), 18, "#0b0b0b", 700));
    y += 32;
    for (const line of section.lines.slice(0, 3)) {
      if (y > 660) break;
      bits.push(`<circle cx="72" cy="${y - 5}" r="4" fill="#ff6a1a"/>`);
      bits.push(text(88, y, clip(line, 86), 16, "#2c2c2a"));
      y += 28;
    }
    y += 16;
  }
  return frame(bits.join("\n  "));
}

function tableSvg(title: string, columns: string[], rows: string[][], tabs: string[]) {
  const shownColumns = columns.slice(0, 4);
  const width = 1072;
  const colWidth = width / Math.max(shownColumns.length, 1);
  const bits = [text(64, 72, clip(title, 42), 28, "#0b0b0b", 700)];
  const headerY = 108;
  bits.push(`<rect x="64" y="${headerY}" width="${width}" height="44" fill="#f7f6f3"/>`);
  shownColumns.forEach((column, index) => {
    bits.push(text(80 + index * colWidth, headerY + 28, clip(column || `Column ${index + 1}`, 18), 14, "#5f5e58", 700));
  });
  rows.slice(0, 8).forEach((row, rowIndex) => {
    const y = headerY + 44 + rowIndex * 52;
    if (rowIndex % 2 === 1) bits.push(`<rect x="64" y="${y}" width="${width}" height="52" fill="#fbfaf8"/>`);
    bits.push(`<line x1="64" y1="${y}" x2="${64 + width}" y2="${y}" stroke="#eeeae4"/>`);
    shownColumns.forEach((_, index) => {
      bits.push(text(80 + index * colWidth, y + 32, clip(row[index] ?? "", 22), 16, "#0b0b0b"));
    });
  });
  if (tabs.length > 1) {
    let x = 64;
    tabs.slice(0, 4).forEach((tab, index) => {
      const label = clip(tab, 16);
      const w = label.length * 9 + 28;
      bits.push(`<rect x="${x}" y="668" width="${w}" height="32" rx="8" fill="${index === 0 ? "#0b0b0b" : "#f4f3ef"}"/>`);
      bits.push(text(x + 14, 689, label, 13, index === 0 ? "#f4f3ef" : "#5f5e58"));
      x += w + 8;
    });
  }
  return frame(bits.join("\n  "));
}

function codeSvg(title: string, source: string) {
  const lines = source.replace(/\r\n/g, "\n").split("\n").slice(0, 16);
  const bits = [
    text(64, 72, clip(title, 36), 28, "#0b0b0b", 700),
    `<rect x="64" y="96" width="1072" height="560" rx="12" fill="#161616"/>`,
  ];
  lines.forEach((line, index) => {
    bits.push(text(88, 136 + index * 32, clip(line || " ", 78), 16, "#f4f3ef"));
  });
  return frame(bits.join("\n  "));
}

function nestSlide(raw: string, x: number, y: number, width: number, height: number) {
  const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 1080 1080";
  const inner = raw
    .replace(/<\?xml[\s\S]*?\?>/, "")
    .replace(/<svg[\s\S]*?>/, "")
    .replace(/<\/svg>\s*$/, "");
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${esc(viewBox)}" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
}

function slidesSvg(slides: string[]) {
  if (slides.length === 1) return frame(nestSlide(slides[0], 28, 24, 1144, 702));
  const side = slides.slice(1, 3).map((slide, index) => nestSlide(slide, 792, 24 + index * 351, 380, 351));
  return frame([nestSlide(slides[0], 28, 24, 752, 702), ...side].join("\n  "));
}

function heading(markdown: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "Page";
}

function sectionsFromMarkdown(markdown: string) {
  const parts = markdown.replace(/\r\n/g, "\n").split(/\n(?=## )/);
  const intro = (parts[0] ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .join(" ")
    .replace(/^\*|\*$/g, "");
  const sections = parts.slice(1).map((part) => {
    const title = part.match(/^##\s+(.+)$/m)?.[1]?.trim() ?? "Section";
    const lines = part
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- ") || line.startsWith("* ") || /^\d+\.\s/.test(line))
      .map((line) => line.replace(/^[-*]\s|^\d+\.\s/, ""));
    const prose = part
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && !line.startsWith("-") && !line.startsWith("*") && !line.startsWith(">") && !/^\d+\./.test(line));
    return { title, lines: lines.length > 0 ? lines : prose.slice(0, 2) };
  });
  return { intro, sections: sections.filter((section) => section.lines.length > 0 || section.title) };
}

async function walk(directory: string, root: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full, root)));
    else files.push(path.relative(root, full).split(path.sep).join("/"));
  }
  return files.sort();
}

async function readWorkbook(file: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  const sheets: { name: string; columns: string[]; rows: string[][] }[] = [];
  workbook.eachSheet((sheet) => {
    const matrix: string[][] = [];
    sheet.eachRow({ includeEmpty: false }, (row) => {
      const values = (row.values as ExcelJS.CellValue[]).slice(1).map(cellText);
      while (values.length > 0 && values[values.length - 1] === "") values.pop();
      if (values.some(Boolean)) matrix.push(values);
    });
    if (matrix.length === 0) return;
    sheets.push({
      name: sheet.name,
      columns: matrix[0] ?? [],
      rows: matrix.slice(1),
    });
  });
  return sheets;
}

function parseCsv(raw: string) {
  const lines = raw.replace(/\r\n/g, "\n").trim().split("\n");
  const columns = (lines[0] ?? "").split(",");
  const rows = lines.slice(1).map((line) => line.split(","));
  return { columns, rows };
}

async function snapshotFor(id: string) {
  const customer = path.join(libraryRoot, id, "customer");
  const files = await walk(customer, customer);
  const deliverables = files.filter((file) => !file.startsWith("preview/") && !skipped.has(path.posix.basename(file)));
  const designs = deliverables.filter((file) => file.startsWith("designs/") && file.endsWith(".svg"));
  if (designs.length > 0) {
    const slides = await Promise.all(designs.slice(0, 3).map((file) => readFile(path.join(customer, file), "utf8")));
    return slidesSvg(slides);
  }

  const workbook = deliverables.find((file) => file.endsWith(".xlsx"));
  if (workbook) {
    const sheets = await readWorkbook(path.join(customer, workbook));
    const summary = sheets.find((sheet) => /summary/i.test(sheet.name)) ?? sheets[0];
    if (summary) {
      const tabs = [summary.name, ...sheets.filter((sheet) => sheet !== summary).map((sheet) => sheet.name)];
      return tableSvg(summary.name, summary.columns, summary.rows, tabs);
    }
  }

  const pages = deliverables.filter((file) => file.startsWith("pages/") && file.endsWith(".md"));
  const database = deliverables.find((file) => file.startsWith("databases/") && file.endsWith(".csv"));
  if (pages.length > 0) {
    const page = await readFile(path.join(customer, pages[0]), "utf8");
    const parsed = sectionsFromMarkdown(page);
    if (database) {
      const table = parseCsv(await readFile(path.join(customer, database), "utf8"));
      return tableSvg(heading(page), table.columns, table.rows, ["Database", ...pages.map((file) => path.basename(file, ".md"))]);
    }
    return documentSvg(heading(page), parsed.intro, parsed.sections);
  }

  const prompts = deliverables.find((file) => file === "prompts.md");
  if (prompts) {
    const markdown = await readFile(path.join(customer, prompts), "utf8");
    const parsed = sectionsFromMarkdown(markdown);
    return documentSvg(heading(markdown), parsed.intro, parsed.sections);
  }

  const lessons = deliverables.filter((file) => file.startsWith("lessons/") && file.endsWith(".md"));
  if (lessons.length > 0) {
    const bodies = await Promise.all(lessons.map((file) => readFile(path.join(customer, file), "utf8")));
    const first = sectionsFromMarkdown(bodies[0] ?? "");
    return documentSvg(
      heading(bodies[0] ?? ""),
      first.intro,
      bodies.map((body) => ({ title: heading(body), lines: sectionsFromMarkdown(body).intro ? [sectionsFromMarkdown(body).intro] : ["Included in the course"] })),
    );
  }

  const sampleCv = deliverables.find((file) => file === "sample-cv.md");
  if (sampleCv) {
    const markdown = await readFile(path.join(customer, sampleCv), "utf8");
    const parsed = sectionsFromMarkdown(markdown);
    return documentSvg(heading(markdown), parsed.intro, parsed.sections);
  }

  const guide = deliverables.find((file) => file === "guide.md" || file === "kit.md" || file.endsWith("-guide.md") || file === "worksheet.md");
  if (guide) {
    const markdown = await readFile(path.join(customer, guide), "utf8");
    const parsed = sectionsFromMarkdown(markdown);
    return documentSvg(heading(markdown), parsed.intro, parsed.sections);
  }

  const table = deliverables.find((file) => file.endsWith(".csv"));
  if (table) {
    const parsed = parseCsv(await readFile(path.join(customer, table), "utf8"));
    return tableSvg(path.basename(table, ".csv"), parsed.columns, parsed.rows, [path.basename(table)]);
  }

  const source = deliverables.find((file) => file.startsWith("src/") && file.endsWith(".mjs") && !file.endsWith(".test.mjs"));
  if (source) {
    return codeSvg(path.basename(source), await readFile(path.join(customer, source), "utf8"));
  }

  return documentSvg(id, "The files in this pack.", deliverables.slice(0, 6).map((file) => ({ title: file, lines: ["Included in the download"] })));
}

async function main() {
  const ids = (await readdir(libraryRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^[A-Z]{2,4}-\d{3}$/.test(entry.name))
    .map((entry) => entry.name);

  let written = 0;
  for (const id of ids) {
    const svg = await snapshotFor(id);
    await writeFile(path.join(libraryRoot, id, "customer", "preview", "summary.svg"), svg);
    written += 1;
  }

  console.log(`wrote ${written} content snapshots`);
}

main();
