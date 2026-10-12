import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const libraryRoot = path.join(process.cwd(), "products", "library");
const idPattern = /^[A-Z]{2,4}-\d{3}$/;
const previewLines = 8;
const previewRows = 3;

const skipped = new Set(["README.md", "LICENCE.md", "USAGE.md", "manifest.json"]);

export type ProductPreview = {
  kind: "text" | "table" | "image";
  label: string;
  text?: string;
  columns?: string[];
  rows?: string[][];
  hiddenRows?: number;
  imagePath?: string;
  hiddenFiles: number;
  clipped: boolean;
};

async function customerFiles(id: string) {
  const root = path.join(libraryRoot, id, "customer");
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

function isContent(file: string) {
  if (file.startsWith("preview/")) return false;
  if (skipped.has(path.posix.basename(file))) return false;
  return /\.(md|csv|svg|mjs)$/i.test(file) && !file.endsWith(".test.mjs");
}

function pickFile(files: string[]) {
  const content = files.filter(isContent);
  const ranked = [
    content.find((file) => file.startsWith("designs/") && file.endsWith(".svg")),
    content.find((file) => /lessons\/01[^/]*\.md$/.test(file)),
    content.find((file) => file === "prompts.md"),
    content.find((file) => file === "sample-cv.md"),
    content.find((file) => file.endsWith("-guide.md") || file === "guide.md"),
    content.find((file) => file === "kit.md"),
    content.find((file) => file.startsWith("pages/") && file.endsWith(".md")),
    content.find((file) => file.endsWith(".csv")),
    content.find((file) => file.startsWith("src/") && file.endsWith(".mjs")),
    content.find((file) => file.endsWith(".md")),
  ];
  return ranked.find((file) => file !== undefined) ?? null;
}

function clipLines(source: string, limit: number) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const kept = lines.slice(0, limit);
  while (kept.length > 0 && kept[kept.length - 1].trim() === "") kept.pop();
  return {
    text: kept.join("\n").trim(),
    truncated: lines.filter((line) => line.trim() !== "").length > kept.length,
  };
}

export async function getProductPreview(id: string): Promise<ProductPreview | null> {
  if (!idPattern.test(id)) return null;

  let files: string[];
  try {
    files = await customerFiles(id);
  } catch {
    return null;
  }
  const chosen = pickFile(files);
  if (!chosen) return null;

  const deliverables = files.filter((file) => {
    if (file.startsWith("preview/")) return false;
    return !skipped.has(path.posix.basename(file));
  });
  const hiddenFiles = Math.max(0, deliverables.length - 1);
  const absolute = path.join(libraryRoot, id, "customer", ...chosen.split("/"));
  if (!absolute.startsWith(path.join(libraryRoot, id, "customer"))) return null;

  if (chosen.endsWith(".svg")) {
    return {
      kind: "image",
      label: "One layout from the kit",
      imagePath: chosen,
      hiddenFiles,
      clipped: false,
    };
  }

  const raw = await readFile(absolute, "utf8");

  if (chosen.endsWith(".csv")) {
    const lines = raw.replace(/\r\n/g, "\n").trim().split("\n");
    const columns = (lines[0] ?? "").split(",");
    const body = lines.slice(1);
    return {
      kind: "table",
      label: "Opening rows",
      columns,
      rows: body.slice(0, previewRows).map((line) => line.split(",")),
      hiddenRows: Math.max(0, body.length - previewRows),
      hiddenFiles,
      clipped: body.length > previewRows,
    };
  }

  const clipped = clipLines(raw, previewLines);
  return {
    kind: "text",
    label: chosen.endsWith(".mjs") ? "Opening of the source" : "Opening of the pack",
    text: clipped.text,
    hiddenFiles,
    clipped: clipped.truncated,
  };
}

export async function readPreviewSvg(id: string) {
  const preview = await getProductPreview(id);
  if (!preview || preview.kind !== "image" || !preview.imagePath) return null;
  if (!preview.imagePath.startsWith("designs/") || preview.imagePath.includes("..")) {
    return null;
  }

  const absolute = path.join(
    libraryRoot,
    id,
    "customer",
    ...preview.imagePath.split("/"),
  );
  const svg = await readFile(absolute, "utf8");
  if (/<script|on\w+=/i.test(svg)) return null;
  return svg;
}
