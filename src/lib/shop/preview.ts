import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";

const libraryRoot = path.join(process.cwd(), "products", "library");
const idPattern = /^[A-Z]{2,4}-\d{3}$/;
const previewRows = 8;

const skipped = new Set(["README.md", "LICENCE.md", "USAGE.md", "manifest.json"]);

export type PreviewBlock =
  | { type: "h"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export type PreviewSection = {
  title: string;
  detail?: string;
  blocks?: PreviewBlock[];
};

export type PreviewSheet = {
  name: string;
  columns: string[];
  rows: string[][];
  moreRows: number;
};

export type PreviewImage = {
  title: string;
  src: string;
};

export type ProductPreview = {
  intro: string;
  gallery: PreviewImage[];
  sheets: PreviewSheet[];
  sections: PreviewSection[];
  locked: string;
};

async function customerFiles(id: string) {
  const root = path.join(process.cwd(), "products", "library", id, "customer");
  const found: string[] = [];

  async function walk(directory: string) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else {
        const relative = path.relative(root, full).split(path.sep).join("/");
        if (!relative.includes("..")) found.push(relative);
      }
    }
  }

  await walk(root);
  return found.sort();
}

function customerPath(id: string, relative: string) {
  if (relative.includes("..") || path.isAbsolute(relative)) return null;
  const root = path.join(libraryRoot, id, "customer");
  const absolute = path.resolve(root, ...relative.split("/"));
  const base = path.resolve(root);
  if (absolute !== base && !absolute.startsWith(base + path.sep)) return null;
  return absolute;
}

function parseBlocks(markdown: string): PreviewBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: PreviewBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (line.startsWith("#")) {
      blocks.push({ type: "h", text: line.replace(/^#+\s*/, "") });
      index += 1;
      continue;
    }
    if (line.startsWith("> ")) {
      blocks.push({ type: "quote", text: line.slice(2) });
      index += 1;
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (index < lines.length && /^[-*] /.test(lines[index])) {
        items.push(lines[index].slice(2));
        index += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith("#") &&
      !/^[-*] /.test(lines[index]) &&
      !lines[index].startsWith("> ")
    ) {
      paragraph.push(lines[index].replace(/^\*(.*)\*$/, "$1").trim());
      index += 1;
    }
    blocks.push({ type: "p", text: paragraph.join(" ") });
  }

  return blocks;
}

function heading(markdown: string) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? "Sample";
}

function sectionsFromMarkdown(markdown: string, openCount: number): PreviewSection[] {
  const parts = markdown.replace(/\r\n/g, "\n").split(/\n(?=## )/);
  const intro = parts[0] ?? "";
  const rest = parts.slice(1);
  const sections: PreviewSection[] = [];

  if (intro.trim()) {
    sections.push({
      title: heading(intro),
      blocks: openCount > 0 ? parseBlocks(intro) : undefined,
      detail: openCount > 0 ? undefined : intro.split("\n").find((line) => line.trim() && !line.startsWith("#")),
    });
  }

  rest.forEach((part, index) => {
    const title = part.match(/^##\s+(.+)$/m)?.[1]?.trim() ?? "Section";
    const body = part.replace(/^##\s+.+\n?/, "");
    const open = index < Math.max(0, openCount - (intro.trim() ? 1 : 0));
    const detail = body
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line && !line.startsWith("#") && !line.startsWith(">") && !line.startsWith("-"));
    sections.push({
      title,
      blocks: open ? parseBlocks(body) : undefined,
      detail: open ? undefined : detail,
    });
  });

  return sections;
}

function cellText(value: ExcelJS.CellValue): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }
  if (typeof value === "object") {
    if ("result" in value && value.result != null) return cellText(value.result);
    if ("richText" in value) return value.richText.map((part) => part.text).join("");
    if ("text" in value && typeof value.text === "string") return value.text;
    return "";
  }
  return String(value);
}

async function readSheets(id: string, file: string): Promise<PreviewSheet[]> {
  const absolute = customerPath(id, file);
  if (!absolute) return [];
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(absolute);
  const sheets: PreviewSheet[] = [];

  workbook.eachSheet((sheet) => {
    const matrix: string[][] = [];
    sheet.eachRow({ includeEmpty: false }, (row) => {
      const values = (row.values as ExcelJS.CellValue[]).slice(1).map(cellText);
      while (values.length > 0 && values[values.length - 1] === "") values.pop();
      if (values.some((value) => value !== "")) matrix.push(values);
    });
    if (matrix.length === 0) return;
    const width = Math.max(...matrix.map((row) => row.length));
    const shown = matrix.slice(0, previewRows);
    sheets.push({
      name: sheet.name,
      columns: shown[0]?.map((value, index) => value || `Column ${index + 1}`) ?? [],
      rows: shown.slice(1).map((row) => Array.from({ length: width }, (_, index) => row[index] ?? "")),
      moreRows: Math.max(0, matrix.length - shown.length),
    });
  });

  return sheets;
}

function designTitle(file: string) {
  return path
    .basename(file, ".svg")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function measureNames(source: string) {
  return source
    .split("\n")
    .map((line) => line.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name));
}

function exportNames(source: string) {
  return [...source.matchAll(/export function ([A-Za-z0-9_]+)/g)].map((match) => match[1]);
}

export async function designFiles(id: string) {
  if (!idPattern.test(id)) return [];
  try {
    const files = await customerFiles(id);
    return files.filter((file) => file.startsWith("designs/") && file.endsWith(".svg"));
  } catch {
    return [];
  }
}

export async function readPreviewSvg(id: string, index: number) {
  if (!idPattern.test(id) || !Number.isInteger(index) || index < 0) return null;
  const files = await designFiles(id);
  const relative = files[index];
  if (!relative) return null;
  const absolute = customerPath(id, relative);
  if (!absolute) return null;
  const svg = await readFile(absolute, "utf8");
  if (/<script|on\w+=/i.test(svg)) return null;
  return svg;
}

export async function getProductPreview(id: string): Promise<ProductPreview | null> {
  if (!idPattern.test(id)) return null;

  let files: string[];
  try {
    files = await customerFiles(id);
  } catch {
    return null;
  }

  const deliverables = files.filter((file) => {
    if (file.startsWith("preview/")) return false;
    return !skipped.has(path.posix.basename(file));
  });
  if (deliverables.length === 0) return null;

  const designs = deliverables.filter((file) => file.startsWith("designs/") && file.endsWith(".svg"));
  if (designs.length > 0) {
    return {
      intro: "These are the layouts in the kit.",
      gallery: designs.map((file, index) => ({
        title: designTitle(file),
        src: `/shop/previews/${id}/${index}`,
      })),
      sheets: [],
      sections: [],
      locked: "The source files stay in the download. This page shows the layouts.",
    };
  }

  const workbook = deliverables.find((file) => file.endsWith(".xlsx"));
  if (workbook) {
    const sheets = await readSheets(id, workbook);
    const measuresFile = deliverables.find((file) => file.endsWith(".dax"));
    const sections: PreviewSection[] = [];
    if (measuresFile) {
      const absolute = customerPath(id, measuresFile);
      if (absolute) {
        const names = measureNames(await readFile(absolute, "utf8"));
        sections.push(
          ...names.map((title) => ({
            title,
            detail: "Included as a measure. The formula text stays in the download.",
          })),
        );
      }
    }
    return {
      intro: sheets.length > 1 ? "These are the sheets in the workbook." : "This is the sheet in the workbook.",
      gallery: [],
      sheets,
      sections,
      locked: "The Excel file stays in the download. The tables above are a look at the sample.",
    };
  }

  const prompts = deliverables.find((file) => file === "prompts.md");
  if (prompts) {
    const absolute = customerPath(id, prompts);
    if (!absolute) return null;
    const markdown = await readFile(absolute, "utf8");
    return {
      intro: "These are the prompts in the pack. The first one is open.",
      gallery: [],
      sheets: [],
      sections: sectionsFromMarkdown(markdown, 2),
      locked: "The rest of each prompt stays in the download.",
    };
  }

  const lessons = deliverables.filter((file) => file.startsWith("lessons/") && file.endsWith(".md"));
  if (lessons.length > 0) {
    const sections = await Promise.all(
      lessons.map(async (file, index) => {
        const absolute = customerPath(id, file);
        const markdown = absolute ? await readFile(absolute, "utf8") : "";
        return {
          title: heading(markdown),
          blocks: index === 0 ? parseBlocks(markdown) : undefined,
          detail: index === 0 ? undefined : "Included in the course.",
        };
      }),
    );
    return {
      intro: "These are the lessons. The first one is open.",
      gallery: [],
      sheets: [],
      sections,
      locked: "The slides and worksheet stay in the download.",
    };
  }

  const sampleCv = deliverables.find((file) => file === "sample-cv.md");
  if (sampleCv) {
    const absolute = customerPath(id, sampleCv);
    if (!absolute) return null;
    const markdown = await readFile(absolute, "utf8");
    return {
      intro: "This is the sample CV in the kit. The facts are placeholders.",
      gallery: [],
      sheets: [],
      sections: [{ title: heading(markdown), blocks: parseBlocks(markdown) }],
      locked: "The Word file and the finishing notes stay in the download.",
    };
  }

  const pages = deliverables.filter((file) => file.startsWith("pages/") && file.endsWith(".md"));
  if (pages.length > 0) {
    const sections = await Promise.all(
      pages.map(async (file, index) => {
        const absolute = customerPath(id, file);
        const markdown = absolute ? await readFile(absolute, "utf8") : "";
        return {
          title: heading(markdown),
          blocks: index === 0 ? parseBlocks(markdown) : undefined,
          detail: index === 0 ? undefined : "Included in the pack.",
        };
      }),
    );
    return {
      intro: "These are the pages in the pack. The first one is open.",
      gallery: [],
      sheets: [],
      sections,
      locked: "The other pages and the import tables stay in the download.",
    };
  }

  const guide = deliverables.find(
    (file) => file === "guide.md" || file === "kit.md" || file.endsWith("-guide.md"),
  );
  if (guide) {
    const absolute = customerPath(id, guide);
    if (!absolute) return null;
    return {
      intro: "This is the shape of the guide. The opening is shown in full.",
      gallery: [],
      sheets: [],
      sections: sectionsFromMarkdown(await readFile(absolute, "utf8"), 2),
      locked: "The rest of the guide, and the other files, stay in the download.",
    };
  }

  const table = deliverables.find((file) => file.endsWith(".csv"));
  if (table) {
    const absolute = customerPath(id, table);
    if (!absolute) return null;
    const lines = (await readFile(absolute, "utf8")).replace(/\r\n/g, "\n").trim().split("\n");
    const columns = (lines[0] ?? "").split(",");
    const body = lines.slice(1);
    return {
      intro: "These are the opening rows of the sample table.",
      gallery: [],
      sheets: [
        {
          name: path.basename(table),
          columns,
          rows: body.slice(0, previewRows - 1).map((line) => line.split(",")),
          moreRows: Math.max(0, body.length - (previewRows - 1)),
        },
      ],
      sections: [],
      locked: "The full table stays in the download.",
    };
  }

  const source = deliverables.find((file) => file.startsWith("src/") && file.endsWith(".mjs"));
  if (source) {
    const absolute = customerPath(id, source);
    if (!absolute) return null;
    const text = await readFile(absolute, "utf8");
    const names = exportNames(text);
    return {
      intro: "These are the functions in the module.",
      gallery: [],
      sheets: [],
      sections: names.map((title) => ({
        title,
        detail: "The source stays in the download.",
      })),
      locked: "The module and its tests stay in the download.",
    };
  }

  return {
    intro: "This pack is ready to preview.",
    gallery: [],
    sheets: [],
    sections: deliverables.slice(0, 8).map((file) => ({
      title: path.basename(file),
      detail: "Included in the download.",
    })),
    locked: "The files stay in the download.",
  };
}
