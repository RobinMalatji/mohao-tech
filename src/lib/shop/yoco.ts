import { createHmac, timingSafeEqual } from "node:crypto";

const checkoutUrl = "https://payments.yoco.com/api/checkouts";
const toleranceSeconds = 180;
const maxBodyBytes = 1_048_576;

export type YocoReadiness = "ready" | "missing-key" | "missing-webhook";

export function yocoSecretKey() {
  const value = process.env.YOCO_SECRET_KEY?.trim();
  if (!value || !/^sk_(test|live)_/.test(value)) return null;
  return value;
}

export function yocoWebhookSecret() {
  const value = process.env.YOCO_WEBHOOK_SECRET?.trim();
  if (!value?.startsWith("whsec_")) return null;
  return value;
}

export function yocoReadiness(): YocoReadiness {
  if (!yocoSecretKey()) return "missing-key";
  if (!yocoWebhookSecret()) return "missing-webhook";
  return "ready";
}

export function isYocoRedirect(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".yoco.com");
  } catch {
    return false;
  }
}

type CheckoutInput = {
  amountCents: number;
  orderId: string;
  successUrl: string;
  cancelUrl: string;
  failureUrl: string;
  lineItems: { displayName: string; quantity: number; price: number }[];
};

export type CreatedCheckout = {
  id: string;
  redirectUrl: string;
  amountCents: number;
  mode: "live" | "test";
};

export async function createYocoCheckout(
  input: CheckoutInput,
): Promise<CreatedCheckout | null> {
  const secret = yocoSecretKey();
  if (!secret) return null;

  const response = await fetch(checkoutUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      "Idempotency-Key": input.orderId,
    },
    body: JSON.stringify({
      amount: input.amountCents,
      currency: "ZAR",
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      failureUrl: input.failureUrl,
      metadata: { orderId: input.orderId },
      externalId: input.orderId,
      clientReferenceId: input.orderId,
      lineItems: input.lineItems.map((item) => ({
        displayName: item.displayName,
        quantity: item.quantity,
        pricingDetails: { price: item.price },
      })),
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) return null;
  const data = (await response.json()) as {
    id?: unknown;
    redirectUrl?: unknown;
    amount?: unknown;
    currency?: unknown;
    processingMode?: unknown;
  };

  if (
    typeof data.id !== "string" ||
    typeof data.redirectUrl !== "string" ||
    data.amount !== input.amountCents ||
    data.currency !== "ZAR" ||
    (data.processingMode !== "live" && data.processingMode !== "test") ||
    !isYocoRedirect(data.redirectUrl)
  ) {
    return null;
  }

  return {
    id: data.id,
    redirectUrl: data.redirectUrl,
    amountCents: data.amount,
    mode: data.processingMode,
  };
}

export type YocoEvent = {
  id: string;
  type: string;
  amountCents: number;
  currency: string;
  status: string;
  mode: "live" | "test";
  paymentId: string;
  orderId: string | null;
  checkoutId: string | null;
};

function headerValue(headers: Headers, name: string) {
  const value = headers.get(name)?.trim();
  return value ? value : null;
}

function signaturesMatch(expected: string, received: string) {
  const left = Buffer.from(expected);
  const right = Buffer.from(received);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function verifyYocoWebhook(
  rawBody: string,
  headers: Headers,
  secret: string,
  now = Date.now(),
): YocoEvent | null {
  if (Buffer.byteLength(rawBody) > maxBodyBytes) return null;
  if (!secret.startsWith("whsec_")) return null;

  const id = headerValue(headers, "webhook-id");
  const timestamp = headerValue(headers, "webhook-timestamp");
  const signatureHeader = headerValue(headers, "webhook-signature");
  if (!id || !timestamp || !signatureHeader) return null;
  if (!/^\d+$/.test(timestamp)) return null;

  const age = Math.abs(now - Number(timestamp) * 1000);
  if (age > toleranceSeconds * 1000) return null;

  let secretBytes: Buffer;
  try {
    secretBytes = Buffer.from(secret.slice("whsec_".length), "base64");
  } catch {
    return null;
  }
  if (secretBytes.length === 0) return null;

  const expected = createHmac("sha256", secretBytes)
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest("base64");

  const matched = signatureHeader.split(" ").some((part) => {
    const [version, signature] = part.split(",");
    return version === "v1" && signature ? signaturesMatch(expected, signature) : false;
  });
  if (!matched) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;

  const event = parsed as {
    id?: unknown;
    type?: unknown;
    payload?: {
      id?: unknown;
      amount?: unknown;
      currency?: unknown;
      status?: unknown;
      mode?: unknown;
      metadata?: unknown;
    };
  };
  const payload = event.payload;
  if (
    typeof event.id !== "string" ||
    typeof event.type !== "string" ||
    !payload ||
    typeof payload.id !== "string" ||
    typeof payload.amount !== "number" ||
    !Number.isInteger(payload.amount) ||
    typeof payload.currency !== "string" ||
    typeof payload.status !== "string" ||
    (payload.mode !== "live" && payload.mode !== "test")
  ) {
    return null;
  }

  const metadata =
    payload.metadata && typeof payload.metadata === "object"
      ? (payload.metadata as Record<string, unknown>)
      : {};
  const orderId = typeof metadata.orderId === "string" ? metadata.orderId : null;
  const checkoutId =
    typeof metadata.checkoutId === "string" ? metadata.checkoutId : null;

  return {
    id: event.id,
    type: event.type,
    amountCents: payload.amount,
    currency: payload.currency,
    status: payload.status,
    mode: payload.mode,
    paymentId: payload.id,
    orderId,
    checkoutId,
  };
}

export type PaymentDecision = "pay" | "fail" | "duplicate" | "reject";

export function decidePayment(
  order: { status: "PENDING" | "PAID" | "FAILED" | "CANCELLED"; amountCents: number; mode: string | null },
  event: YocoEvent,
): PaymentDecision {
  if (event.currency !== "ZAR") return "reject";
  if (order.mode && event.mode !== order.mode) return "reject";
  if (event.amountCents !== order.amountCents) return "reject";

  if (event.type === "payment.succeeded") {
    if (event.status !== "succeeded") return "reject";
    if (order.status === "PAID") return "duplicate";
    if (order.status !== "PENDING") return "reject";
    return "pay";
  }

  if (event.type === "payment.failed") {
    if (order.status === "PENDING") return "fail";
    return "duplicate";
  }

  return "duplicate";
}
