import { isDatabaseConfigured, prisma } from "@/lib/db";
import { decideOzow, ozowCredentials, verifyOzowNotification } from "@/lib/shop/ozow";

export async function POST(request: Request) {
  const credentials = ozowCredentials();
  if (!credentials || !isDatabaseConfigured()) {
    return new Response("Ozow is not configured.", { status: 503 });
  }

  const rawBody = await request.text();
  const notice = verifyOzowNotification(rawBody, credentials.privateKey, credentials.siteCode);
  if (!notice) return new Response("Invalid notification.", { status: 401 });

  const order = await prisma.order.findUnique({ where: { id: notice.transactionReference } });
  if (!order || order.provider !== "ozow") return new Response("Order not found.", { status: 404 });

  const decision = decideOzow(order, notice);
  if (decision === "reject") return new Response("Payment does not match the order.", { status: 409 });
  if (decision === "duplicate" || decision === "wait") return new Response(null, { status: 200 });

  if (decision === "pay") {
    const updated = await prisma.order.updateMany({
      where: { id: order.id, status: "PENDING", amountCents: notice.amountCents, provider: "ozow" },
      data: {
        status: "PAID",
        paidAt: new Date(),
        ozowTransactionId: notice.transactionId,
        webhookEventId: notice.transactionId,
      },
    });
    if (updated.count === 1) return new Response(null, { status: 200 });
    const current = await prisma.order.findUnique({ where: { id: order.id } });
    if (current?.status === "PAID") return new Response(null, { status: 200 });
    return new Response("Payment was not recorded.", { status: 409 });
  }

  await prisma.order.updateMany({
    where: { id: order.id, status: "PENDING", provider: "ozow" },
    data: {
      status: decision === "cancel" ? "CANCELLED" : "FAILED",
      ozowTransactionId: notice.transactionId,
      webhookEventId: notice.transactionId,
    },
  });
  return new Response(null, { status: 200 });
}
