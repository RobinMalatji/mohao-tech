import { readFile } from "node:fs/promises";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { customerMayDownload, fileResponse, productZipPath } from "@/lib/shop/deliver";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string; productId: string }> },
) {
  if (!isDatabaseConfigured()) return new Response("Not found.", { status: 404 });

  const { orderId, productId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { select: { productId: true } } },
  });

  if (!customerMayDownload(order, productId)) {
    return new Response("This file is available after Yoco confirms the payment.", { status: 403 });
  }

  const zip = productZipPath(productId);
  if (!zip) return new Response("Not found.", { status: 404 });

  try {
    const body = await readFile(zip);
    return fileResponse(body, `${productId}.zip`, false);
  } catch {
    return new Response("This product has no downloadable file.", { status: 404 });
  }
}
