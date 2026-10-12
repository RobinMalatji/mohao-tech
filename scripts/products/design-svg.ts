export type Artboard = {
  file: string;
  width: number;
  height: number;
  layout: "square" | "banner" | "story" | "certificate" | "menu" | "thumbnail";
  eyebrow: string;
  title: string;
  lines: string[];
  footer: string;
  bg: string;
  ink: string;
  accent: string;
  muted: string;
};

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrap(value: string, max: number) {
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
  return lines;
}

function text(x: number, y: number, size: number, fill: string, value: string, weight = 400) {
  return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeXml(value)}</text>`;
}

export function renderArtboard(board: Artboard) {
  const title = wrap(board.title, board.width < 900 ? 18 : board.layout === "banner" ? 28 : 16);
  const body = board.lines.flatMap((line) => wrap(line, board.width < 900 ? 32 : 36));
  const titleSize = board.height < 500 ? 32 : board.height < 900 ? 40 : 52;
  const titleStart = Math.max(140, Math.round(board.height * 0.28));
  const bodyStart = titleStart + title.length * (titleSize + 12) + 28;
  const footerY = board.height - 64;
  const visibleBody = body.filter((_, index) => bodyStart + index * 34 < footerY - 16);
  const titleSvg = title
    .map((line, index) => text(72, titleStart + index * (titleSize + 12), titleSize, board.ink, line, 700))
    .join("");
  const bodySvg = visibleBody
    .map((line, index) => text(72, bodyStart + index * 34, board.height < 500 ? 18 : 22, board.muted, line))
    .join("");
  const frame = board.layout === "certificate"
    ? `<rect x="36" y="36" width="${board.width - 72}" height="${board.height - 72}" fill="none" stroke="${board.accent}" stroke-width="3"/>`
    : `<rect x="0" y="0" width="16" height="${board.height}" fill="${board.accent}"/>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${board.width}" height="${board.height}" viewBox="0 0 ${board.width} ${board.height}">
  <rect width="${board.width}" height="${board.height}" fill="${board.bg}"/>
  ${frame}
  ${text(72, 96, 16, board.muted, board.eyebrow.toUpperCase())}
  ${titleSvg}
  ${bodySvg}
  ${text(72, footerY, 16, board.ink, board.footer)}
</svg>`;
}

export function contactSheet(title: string, boards: Artboard[]) {
  const cards = boards
    .map(
      (board) => `<figure>
        <img src="${board.file}" alt="${escapeXml(board.title)}" width="${Math.min(board.width, 480)}" />
        <figcaption>${escapeXml(board.file)} · ${board.width} by ${board.height} px</figcaption>
      </figure>`,
    )
    .join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeXml(title)}</title>
  <style>
    body { margin: 0; background: #f4f3ef; color: #0b0b0b; font-family: Arial, Helvetica, sans-serif; }
    main { max-width: 1100px; margin: 0 auto; padding: 48px 24px 80px; }
    h1 { font-size: 48px; letter-spacing: -0.04em; margin: 0 0 12px; }
    p { max-width: 62ch; line-height: 1.5; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 28px; }
    figure { margin: 0; background: white; padding: 16px; }
    img { width: 100%; height: auto; display: block; }
    figcaption { margin-top: 10px; font-size: 13px; color: #5f5e58; }
  </style>
</head>
<body>
  <main>
    <h1>${escapeXml(title)}</h1>
    <p>Open this page in a browser to preview the SVG files. Upload those SVG files into Canva, Figma, or another editor. This package is not a native Canva file and it does not include a Canva share link.</p>
    <div class="grid">${cards}</div>
  </main>
</body>
</html>`;
}
