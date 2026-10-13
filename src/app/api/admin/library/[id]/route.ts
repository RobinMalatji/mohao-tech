import { readFile } from "node:fs/promises";
import { getSession } from "@/lib/auth";
import {
  customerFilePath,
  fileResponse,
  isProductId,
  productZipPath,
} from "@/lib/shop/deliver";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return new Response("Sign in required.", { status: 401 });

  const { id } = await params;
  if (!isProductId(id)) return new Response("Not found.", { status: 404 });

  const url = new URL(request.url);
  const pack = url.searchParams.get("pack") === "1";
  const inline = url.searchParams.get("inline") === "1";

  try {
    if (pack) {
      const zip = productZipPath(id);
      if (!zip) return new Response("Not found.", { status: 404 });
      const body = await readFile(zip);
      return fileResponse(body, `${id}.zip`, false);
    }

    const relative = url.searchParams.get("path") ?? "";
    const file = customerFilePath(id, relative);
    if (!file) return new Response("Not found.", { status: 404 });
    const body = await readFile(file);
    return fileResponse(body, relative, inline);
  } catch {
    return new Response("Not found.", { status: 404 });
  }
}
