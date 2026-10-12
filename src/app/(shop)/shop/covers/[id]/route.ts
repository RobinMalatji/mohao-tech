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
    return new Response("Not found", { status: 404 });
  }
}
