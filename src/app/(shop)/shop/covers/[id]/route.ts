import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[A-Z]{2,4}-\d{3}$/.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = path.join(
      process.cwd(),
      "products",
      "library",
      id,
      "customer",
      "preview",
      "cover.png",
    );
    const body = await readFile(file);
    return new Response(body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#f4f3ef"/><text x="48" y="320" font-family="sans-serif" font-size="42" fill="#0b0b0b">${id}</text></svg>`;
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
}
