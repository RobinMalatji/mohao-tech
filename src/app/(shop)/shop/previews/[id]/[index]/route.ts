import { readPreviewSvg } from "@/lib/shop/preview";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; index: string }> },
) {
  const { id, index } = await params;
  if (!/^\d+$/.test(index)) return new Response("Not found", { status: 404 });
  const svg = await readPreviewSvg(id, Number(index));
  if (!svg) return new Response("Not found", { status: 404 });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
