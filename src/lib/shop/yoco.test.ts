import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { quoteZar } from "@/lib/shop/quote";
import { decidePayment, isYocoRedirect, verifyYocoWebhook } from "@/lib/shop/yoco";

const secret = "whsec_dGVzdC1zZWNyZXQ=";
const now = 1_700_000_000_000;

function signed(body: string, timestamp = String(now / 1000)) {
  const id = "msg_test";
  const signature = createHmac("sha256", Buffer.from(secret.slice("whsec_".length), "base64"))
    .update(`${id}.${timestamp}.${body}`)
    .digest("base64");
  const headers = new Headers({
    "webhook-id": id,
    "webhook-timestamp": timestamp,
    "webhook-signature": `v1,${signature}`,
  });
  return headers;
}

describe("Yoco checkout", () => {
  it("charges the listed rand prices", () => {
    const quote = quoteZar(
      [
        { id: "FIN-001", qty: 2 },
        { id: "AI-001", qty: 1 },
      ],
      [
        { id: "FIN-001", name: "Budget", prices: { ZAR: 24900 } },
        { id: "AI-001", name: "Prompts", prices: { ZAR: 22900 } },
      ],
    );

    expect(quote?.amountCents).toBe(24900 * 2 + 22900);
    expect(quoteZar([], [])).toBeNull();
    expect(
      quoteZar([{ id: "FIN-001", qty: 1 }], [
        { id: "FIN-001", name: "Budget", prices: { ZAR: 24900 } },
      ])?.items[0]?.unitCents,
    ).toBe(24900);
  });

  it("accepts a signed payment event and rejects a changed body", () => {
    const body = JSON.stringify({
      id: "evt_1",
      type: "payment.succeeded",
      createdDate: "2026-10-13T00:00:00.000Z",
      payload: {
        id: "pay_1",
        amount: 24900,
        currency: "ZAR",
        status: "succeeded",
        mode: "test",
        metadata: { orderId: "order_1" },
      },
    });

    const event = verifyYocoWebhook(body, signed(body), secret, now);
    expect(event?.orderId).toBe("order_1");
    expect(event?.amountCents).toBe(24900);
    expect(verifyYocoWebhook(`${body} `, signed(body), secret, now)).toBeNull();
    expect(
      verifyYocoWebhook(body, signed(body, String(now / 1000 - 600)), secret, now),
    ).toBeNull();
  });

  it("pays only when the amount and mode match a pending order", () => {
    const event = {
      id: "evt_1",
      type: "payment.succeeded",
      amountCents: 24900,
      currency: "ZAR",
      status: "succeeded",
      mode: "test" as const,
      paymentId: "pay_1",
      orderId: "order_1",
      checkoutId: null,
    };
    const order = { status: "PENDING" as const, amountCents: 24900, mode: "test" };

    expect(decidePayment(order, event)).toBe("pay");
    expect(decidePayment({ ...order, amountCents: 100 }, event)).toBe("reject");
    expect(decidePayment({ ...order, mode: "live" }, event)).toBe("reject");
    expect(decidePayment({ ...order, status: "PAID" }, event)).toBe("duplicate");
    expect(isYocoRedirect("https://c.yoco.com/checkout/abc")).toBe(true);
    expect(isYocoRedirect("https://evil-yoco.com/checkout/abc")).toBe(false);
  });
});
