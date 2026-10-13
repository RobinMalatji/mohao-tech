import { isDatabaseConfigured, prisma } from "@/lib/db";
import { decidePayment, verifyYocoWebhook, yocoWebhookSecret } from "@/lib/shop/yoco";

export async function POST(request: Request) {
  const secret = yocoWebhookSecret();
  if (!secret || !isDatabaseConfigured()) {
    return new Response("Yoco webhook is not configured.", { status: 503 });
  }

  const rawBody = await request.text();
  const event = verifyYocoWebhook(rawBody, new Headers(request.headers), secret);
  if (!event) return new Response("Invalid webhook.", { status: 401 });

  const order = event.orderId
    ? await prisma.order.findUnique({ where: { id: event.orderId } })
    : event.checkoutId
      ? await prisma.order.findUnique({ where: { yocoCheckoutId: event.checkoutId } })
      : null;

  if (!order) return new Response("Order not found.", { status: 404 });

  const decision = decidePayment(order, event);
  if (decision === "reject") return new Response("Payment does not match the order.", { status: 409 });
  if (decision === "duplicate") return new Response("Already recorded.", { status: 200 });

  if (decision === "pay") {
    const updated = await prisma.order.updateMany({
      where: { id: order.id, status: "PENDING", amountCents: event.amountCents },
      data: {
        status: "PAID",
        paidAt: new Date(),
        yocoPaymentId: event.paymentId,
        webhookEventId: event.id,
      },
    });
    if (updated.count === 1) return new Response("Paid.", { status: 200 });
    const current = await prisma.order.findUnique({ where: { id: order.id } });
    if (current?.status === "PAID") return new Response("Already recorded.", { status: 200 });
    return new Response("Payment was not recorded.", { status: 409 });
  }

  await prisma.order.updateMany({
    where: { id: order.id, status: "PENDING" },
    data: { status: "FAILED", webhookEventId: event.id, yocoPaymentId: event.paymentId },
  });
  return new Response("Failed payment recorded.", { status: 200 });
}
