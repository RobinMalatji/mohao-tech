import { createHash } from "node:crypto";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import PptxGenJS from "pptxgenjs";
import sharp from "sharp";
import { evaluateCell, type CellInput, type WorkbookInput } from "./formula";
import type { Block, Doc, ProductMeta, Sheet, SheetFormat } from "./types";

const INK = "#0b0b0b";
const MUTED = "#5f5e58";
const CANVAS = "#f4f3ef";
const EMBER = "#ff6a1a";
const LINE = "#d9d6ce";

export function sha256(body: Buffer) {
  return createHash("sha256").update(body).digest("hex");
}

export function latin(value: string) {
  return value
    .replace(/\u2014|\u2013/g, "-")
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\u00a0/g, " ")
    .replace(/[^\n\r\t\x20-\xff]/g, "");
}

function formatCode(format?: SheetFormat) {
  if (format === "zar") return '"R"#,##0.00';
  if (format === "usd") return '"$"#,##0.00';
  if (format === "percent") return "0.0%";
  if (format === "integer") return "#,##0";
  if (format === "number") return "#,##0.00";
  return "@";
}

export function sheetsToInput(sheets: Sheet[]): WorkbookInput {
  return Object.fromEntries(sheets.map((sheet) => [sheet.name, sheet.rows]));
}

export async function renderWorkbook(sheets: Sheet[]) {
  const input = sheetsToInput(sheets);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "MOHAO";
  workbook.created = new Date("2026-10-12T00:00:00Z");

  for (const sheet of sheets) {
    const worksheet = workbook.addWorksheet(sheet.name, {
      views: [{ state: "frozen", ySplit: 1 }],
      pageSetup: { fitToPage: true, fitToWidth: 1, orientation: "landscape" },
    });
    sheet.columns.forEach((column, index) => {
      worksheet.getColumn(index + 1).width = column.width;
    });
    sheet.rows.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {
        const cell = worksheet.getCell(rowIndex + 1, columnIndex + 1);
        const format = rowIndex === 0 ? "text" : sheet.columns[columnIndex]?.format;
        cell.numFmt = formatCode(format);
        if (typeof value === "string" && value.startsWith("=")) {
          const result = evaluateCell(input, sheet.name, `${columnLetter(columnIndex)}${rowIndex + 1}`);
          cell.value = {
            formula: value.slice(1),
            result: typeof result === "number" || typeof result === "string" ? result : undefined,
          };
        } else {
          cell.value = value === null ? null : (value as ExcelJS.CellValue);
        }
        if (rowIndex === 0) {
          cell.font = { bold: true, color: { argb: "FF0B0B0B" }, name: "Calibri" };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF4F3EF" } };
        } else {
          cell.font = { name: "Calibri", color: { argb: "FF0B0B0B" } };
        }
        cell.alignment = { vertical: "middle", wrapText: format === "text" || rowIndex === 0 };
        cell.border = {
          bottom: { style: "thin", color: { argb: "FFE4E1D8" } },
        };
      });
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

function columnLetter(index: number) {
  let value = index + 1;
  let label = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / 26);
  }
  return label;
}

export function renderMarkdown(doc: Doc) {
  const lines = [`# ${doc.title}`, ""];
  if (doc.kicker) lines.push(`*${doc.kicker}*`, "");
  for (const block of doc.blocks) {
    if (block.kind === "h") lines.push(`## ${block.text}`, "");
    if (block.kind === "p") lines.push(block.text, "");
    if (block.kind === "note") lines.push(`> ${block.text}`, "");
    if (block.kind === "ul") lines.push(...block.items.map((item) => `- ${item}`), "");
    if (block.kind === "ol") lines.push(...block.items.map((item, index) => `${index + 1}. ${item}`), "");
    if (block.kind === "table") {
      if (block.caption) lines.push(block.caption, "");
      lines.push(`| ${block.headers.join(" | ")} |`);
      lines.push(`| ${block.headers.map(() => "---").join(" | ")} |`);
      for (const row of block.rows) lines.push(`| ${row.join(" | ")} |`);
      lines.push("");
    }
  }
  return lines.join("\n");
}

export function renderPdf(doc: Doc, meta: ProductMeta) {
  return new Promise<Buffer>((resolve, reject) => {
    const pdf = new PDFDocument({
      size: "A4",
      margin: 56,
      info: {
        Title: latin(doc.title),
        Author: "MOHAO",
        Subject: latin(meta.summary),
      },
    });
    const chunks: Buffer[] = [];
    pdf.on("data", (chunk: Buffer) => chunks.push(chunk));
    pdf.on("end", () => resolve(Buffer.concat(chunks)));
    pdf.on("error", reject);

    pdf.rect(0, 0, pdf.page.width, pdf.page.height).fill(CANVAS);
    pdf.rect(0, 0, 14, pdf.page.height).fill(EMBER);
    pdf.fillColor(MUTED).font("Helvetica").fontSize(10).text(latin(`${meta.id}  ·  ${meta.categoryLabel}`), 56, 72, { lineBreak: false });
    pdf.fillColor(INK).font("Helvetica-Bold").fontSize(28).text(latin(doc.title), 56, 150, { width: 470 });
    if (doc.kicker) {
      pdf.moveDown(0.6);
      pdf.font("Helvetica").fontSize(12).fillColor(MUTED).text(latin(doc.kicker), { width: 460 });
    }
    pdf.font("Helvetica").fontSize(10).fillColor(INK).text("MOHAO digital product", 56, 760, { lineBreak: false });

    pdf.addPage();
    drawContentHeader(pdf, meta);

    for (const block of doc.blocks) {
      ensureSpace(pdf, meta, block.kind === "table" ? 120 : 48);
      if (block.kind === "h") {
        pdf.moveDown(0.6);
        pdf.fillColor(INK).font("Helvetica-Bold").fontSize(16).text(latin(block.text), { width: 480 });
        pdf.moveDown(0.3);
      }
      if (block.kind === "p") {
        pdf.fillColor(INK).font("Helvetica").fontSize(11).text(latin(block.text), { width: 480, lineGap: 3 });
        pdf.moveDown(0.4);
      }
      if (block.kind === "note") {
        pdf.fillColor(MUTED).font("Helvetica-Oblique").fontSize(10).text(latin(block.text), { width: 480, lineGap: 2 });
        pdf.moveDown(0.4);
      }
      if (block.kind === "ul" || block.kind === "ol") {
        block.items.forEach((item, index) => {
          ensureSpace(pdf, meta, 28);
          const marker = block.kind === "ol" ? `${index + 1}.` : "-";
          pdf.fillColor(INK).font("Helvetica").fontSize(11).text(latin(`${marker}  ${item}`), { width: 480, lineGap: 2 });
        });
        pdf.moveDown(0.4);
      }
      if (block.kind === "table") {
        if (block.caption) {
          pdf.fillColor(MUTED).font("Helvetica").fontSize(9).text(latin(block.caption));
          pdf.moveDown(0.2);
        }
        for (const row of [block.headers, ...block.rows]) {
          ensureSpace(pdf, meta, 22);
          pdf.fillColor(INK).font(row === block.headers ? "Helvetica-Bold" : "Helvetica").fontSize(9).text(latin(row.join("   |   ")), { width: 480 });
        }
        pdf.moveDown(0.5);
      }
    }

    pdf.end();
  });
}

function drawContentHeader(pdf: PDFKit.PDFDocument, meta: ProductMeta) {
  pdf.save();
  pdf.rect(0, 0, pdf.page.width, 42).fill(CANVAS);
  pdf.fillColor(MUTED).font("Helvetica").fontSize(9).text(latin(`${meta.id}  ·  ${meta.name}`), 56, 16, { width: 400, lineBreak: false });
  pdf.restore();
  pdf.y = 64;
  pdf.x = 56;
}

function ensureSpace(pdf: PDFKit.PDFDocument, meta: ProductMeta, needed: number) {
  if (pdf.y + needed < pdf.page.height - 56) return;
  pdf.addPage();
  drawContentHeader(pdf, meta);
}

export async function renderDocx(doc: Doc, meta: ProductMeta) {
  const children: (Paragraph | Table)[] = [
    new Paragraph({
      children: [new TextRun({ text: meta.id, color: "5F5E58", size: 18 })],
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: latin(doc.title), bold: true })],
    }),
  ];
  if (doc.kicker) {
    children.push(new Paragraph({ children: [new TextRun({ text: latin(doc.kicker), italics: true, color: "5F5E58" })] }));
  }
  for (const block of doc.blocks) {
    if (block.kind === "h") {
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(latin(block.text))] }));
    }
    if (block.kind === "p" || block.kind === "note") {
      children.push(new Paragraph({ children: [new TextRun({ text: latin(block.text), italics: block.kind === "note" })] }));
    }
    if (block.kind === "ul" || block.kind === "ol") {
      block.items.forEach((item, index) => {
        children.push(
          new Paragraph({
            children: [new TextRun(latin(`${block.kind === "ol" ? `${index + 1}.` : "-"} ${item}`))],
          }),
        );
      });
    }
    if (block.kind === "table") {
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [block.headers, ...block.rows].map(
            (row) =>
              new TableRow({
                children: row.map((cell) => new TableCell({ children: [new Paragraph(latin(cell))] })),
              }),
          ),
        }),
      );
    }
  }
  const file = new Document({
    creator: "MOHAO",
    title: latin(doc.title),
    description: latin(meta.summary),
    sections: [{ children }],
  });
  return Packer.toBuffer(file);
}

export async function renderSlides(title: string, slides: { title: string; bullets: string[] }[]) {
  const pptx = new PptxGenJS();
  pptx.author = "MOHAO";
  pptx.title = title;
  pptx.layout = "LAYOUT_WIDE";
  for (const slide of slides) {
    const page = pptx.addSlide();
    page.addShape("rect", { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: "F4F3EF" } });
    page.addShape("rect", { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: "FF6A1A" } });
    page.addText(slide.title, {
      x: 0.5,
      y: 0.4,
      w: 12,
      h: 0.8,
      fontFace: "Calibri",
      fontSize: 28,
      color: "0B0B0B",
      bold: true,
    });
    page.addText(slide.bullets.map((bullet) => ({ text: bullet, options: { bullet: false, breakLine: true } })), {
      x: 0.6,
      y: 1.6,
      w: 11.5,
      h: 5,
      fontFace: "Calibri",
      fontSize: 18,
      color: "0B0B0B",
      paraSpaceAfter: 12,
    });
  }
  const output = await pptx.write({ outputType: "nodebuffer" });
  return Buffer.from(output as ArrayBuffer);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapLabel(value: string, max = 22) {
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 5);
}

export function renderCoverSvg(meta: ProductMeta, chart: { label: string; value: number }[] = []) {
  const lines = wrapLabel(meta.name, 18);
  const title = lines
    .map((line, index) => `<text x="72" y="${250 + index * 68}" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="700" fill="#0b0b0b">${escapeXml(line)}</text>`)
    .join("");
  const max = Math.max(...chart.map((item) => item.value), 1);
  const bars = chart.slice(0, 6).map((item, index) => {
    const height = Math.max(8, Math.round((item.value / max) * 220));
    const x = 72 + index * 150;
    const y = 980 - height;
    return `<rect x="${x}" y="${y}" width="88" height="${height}" fill="${index === 0 ? "#ff6a1a" : "#0b0b0b"}"/>
      <text x="${x}" y="1020" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#5f5e58">${escapeXml(item.label.slice(0, 12))}</text>`;
  });
  const motif = chart.length
    ? bars.join("")
    : `<circle cx="980" cy="280" r="120" fill="none" stroke="#0b0b0b" stroke-width="8"/>
       <circle cx="1040" cy="360" r="48" fill="#ff6a1a"/>
       <text x="72" y="860" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#5f5e58">${escapeXml(meta.summary.slice(0, 90))}</text>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <rect width="1200" height="1200" fill="#f4f3ef"/>
  <rect x="0" y="0" width="18" height="1200" fill="#ff6a1a"/>
  <text x="72" y="110" font-family="Arial, Helvetica, sans-serif" font-size="18" letter-spacing="4" fill="#5f5e58">MOHAO  ·  ${escapeXml(meta.categoryLabel.toUpperCase())}</text>
  <text x="72" y="160" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#0b0b0b">${escapeXml(meta.id)}</text>
  ${title}
  ${motif}
  <text x="72" y="1120" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#0b0b0b">${escapeXml(meta.productType)}</text>
</svg>`;
}

export async function renderCoverPng(svg: string) {
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

export function csv(rows: string[][]) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const value = cell ?? "";
          return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
        })
        .join(","),
    )
    .join("\n");
}

export function textFile(value: string) {
  return Buffer.from(value.replace(/\r\n/g, "\n"), "utf8");
}
