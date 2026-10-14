import { createHash, timingSafeEqual } from "node:crypto";

const maxBodyBytes = 1_048_576;

export type OzowReadiness = "ready" | "missing-ozow";

export function ozowCredentials() {
  const siteCode = process.env.OZOW_SITE_CODE?.trim() ?? "";
  const apiKey = process.env.OZOW_API_KEY?.trim() ?? "";
  const privateKey = process.env.OZOW_PRIVATE_KEY?.trim() ?? "";
  if (!siteCode || siteCode.length > 50 || !apiKey || privateKey.length < 8) return null;
  return {
    siteCode,
    apiKey,
    privateKey,
    isTest: process.env.OZOW_IS_TEST?.trim().toLowerCase() !== "false",
    endpoint: "https://api.ozow.com/postpaymentrequest",
  };
}

export function ozowReadiness(): OzowReadiness {
  return ozowCredentials() ? "ready" : "missing-ozow";
}

export function isOzowRedirect(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "ozow.com" || url.hostname.endsWith(".ozow.com"));
  } catch {
    return false;
  }
}

export function ozowAmount(cents: number) {
  if (!Number.isInteger(cents) || cents <= 0) return null;
  return `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, "0")}`;
}

export function ozowBankReference(orderId: string) {
  const suffix = orderId.replace(/[^a-z0-9]/gi, "").slice(-10).toUpperCase();
  const reference = `MOHAO${suffix}`.slice(0, 20);
  return /^[A-Z0-9]{6,20}$/.test(reference) ? reference : null;
}

function sha512(value: string) {
  return createHash("sha512").update(value).digest("hex");
}

export function ozowRequestHash(
  fields: {
    siteCode: string;
    countryCode: string;
    currencyCode: string;
    amount: string;
    transactionReference: string;
    bankReference: string;
    cancelUrl: string;
    errorUrl: string;
    successUrl: string;
    notifyUrl: string;
    isTest: boolean;
  },
  privateKey: string,
) {
  const input = [
    fields.siteCode,
    fields.countryCode,
    fields.currencyCode,
    fields.amount,
    fields.transactionReference,
    fields.bankReference,
    fields.cancelUrl,
    fields.errorUrl,
    fields.successUrl,
    fields.notifyUrl,
    fields.isTest ? "true" : "false",
    privateKey,
  ].join("");
  return sha512(input.toLowerCase());
}

export function ozowNotificationHash(
  fields: {
    siteCode: string;
    transactionId: string;
    transactionReference: string;
    amount: string;
    status: string;
    optional1: string;
    optional2: string;
    optional3: string;
    optional4: string;
    optional5: string;
    currencyCode: string;
    isTest: string;
    statusMessage: string;
  },
  privateKey: string,
) {
  const input = [
    fields.siteCode,
    fields.transactionId,
    fields.transactionReference,
    fields.amount,
    fields.status,
    fields.optional1,
    fields.optional2,
    fields.optional3,
    fields.optional4,
    fields.optional5,
    fields.currencyCode,
    fields.isTest,
    fields.statusMessage,
    privateKey,
  ].join("");
  return sha512(input.toLowerCase());
}

function hashesMatch(expected: string, received: string) {
  const left = Buffer.from(expected);
  const right = Buffer.from(received);
  if (left.length !== right.length || left.length === 0) return false;
  return timingSafeEqual(left, right);
}

export type OzowNotice = {
  transactionId: string;
  transactionReference: string;
  amountCents: number;
  currency: string;
  status: string;
  mode: "live" | "test";
};

function formValue(form: URLSearchParams, name: string) {
  return form.get(name) ?? "";
}

export function verifyOzowNotification(rawBody: string, privateKey: string, siteCode: string): OzowNotice | null {
  if (!privateKey || !siteCode || Buffer.byteLength(rawBody) > maxBodyBytes) return null;
  const form = new URLSearchParams(rawBody);
  const amount = formValue(form, "Amount");
  if (!/^\d+\.\d{2}$/.test(amount)) return null;

  const fields = {
    siteCode: formValue(form, "SiteCode"),
    transactionId: formValue(form, "TransactionId"),
    transactionReference: formValue(form, "TransactionReference"),
    amount,
    status: formValue(form, "Status"),
    optional1: formValue(form, "Optional1"),
    optional2: formValue(form, "Optional2"),
    optional3: formValue(form, "Optional3"),
    optional4: formValue(form, "Optional4"),
    optional5: formValue(form, "Optional5"),
    currencyCode: formValue(form, "CurrencyCode"),
    isTest: formValue(form, "IsTest"),
    statusMessage: formValue(form, "StatusMessage"),
  };
  const received = formValue(form, "Hash").toLowerCase();
  if (!/^[a-f0-9]{128}$/.test(received)) return null;
  if (!hashesMatch(ozowNotificationHash(fields, privateKey), received)) return null;
  if (fields.siteCode.toLowerCase() !== siteCode.toLowerCase()) return null;
  if (fields.currencyCode.toUpperCase() !== "ZAR") return null;
  if (!fields.transactionId || !fields.transactionReference || !fields.status) return null;

  const isTest = fields.isTest.toLowerCase();
  if (isTest !== "true" && isTest !== "false") return null;
  const cents = Number(amount.slice(0, -3)) * 100 + Number(amount.slice(-2));
  if (!Number.isSafeInteger(cents)) return null;

  return {
    transactionId: fields.transactionId,
    transactionReference: fields.transactionReference,
    amountCents: cents,
    currency: "ZAR",
    status: fields.status,
    mode: isTest === "true" ? "test" : "live",
  };
}

export type OzowDecision = "pay" | "fail" | "cancel" | "wait" | "duplicate" | "reject";

export function decideOzow(
  order: { id: string; status: "PENDING" | "PAID" | "FAILED" | "CANCELLED"; amountCents: number; mode: string | null },
  notice: OzowNotice,
): OzowDecision {
  if (notice.transactionReference !== order.id) return "reject";
  if (notice.currency !== "ZAR" || notice.amountCents !== order.amountCents) return "reject";
  if (order.mode && notice.mode !== order.mode) return "reject";

  const status = notice.status.toLowerCase();
  if (status === "complete") {
    if (order.status === "PAID") return "duplicate";
    if (order.status !== "PENDING") return "reject";
    return "pay";
  }
  if (status === "pending" || status === "pendinginvestigation") return "wait";
  if (status === "cancelled") {
    if (order.status === "PENDING") return "cancel";
    return "duplicate";
  }
  if (status === "error" || status === "abandoned") {
    if (order.status === "PENDING") return "fail";
    return "duplicate";
  }
  return "reject";
}

export type CreatedOzowPayment = {
  id: string;
  redirectUrl: string;
  mode: "live" | "test";
};

export async function createOzowPayment(input: {
  amountCents: number;
  orderId: string;
  successUrl: string;
  cancelUrl: string;
  errorUrl: string;
  notifyUrl: string;
}): Promise<CreatedOzowPayment | null> {
  const credentials = ozowCredentials();
  const amount = ozowAmount(input.amountCents);
  const bankReference = ozowBankReference(input.orderId);
  if (!credentials || !amount || !bankReference) return null;
  if ([input.successUrl, input.cancelUrl, input.errorUrl, input.notifyUrl].some((url) => url.length > 150)) {
    return null;
  }

  const fields = {
    siteCode: credentials.siteCode,
    countryCode: "ZA",
    currencyCode: "ZAR",
    amount,
    transactionReference: input.orderId,
    bankReference,
    cancelUrl: input.cancelUrl,
    errorUrl: input.errorUrl,
    successUrl: input.successUrl,
    notifyUrl: input.notifyUrl,
    isTest: credentials.isTest,
  };

  const response = await fetch(credentials.endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ApiKey: credentials.apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...fields,
      hashCheck: ozowRequestHash(fields, credentials.privateKey),
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) return null;
  const data = (await response.json()) as {
    paymentRequestId?: unknown;
    url?: unknown;
    errorMessage?: unknown;
  };
  if (data.errorMessage || typeof data.url !== "string" || typeof data.paymentRequestId !== "string") {
    return null;
  }
  if (!isOzowRedirect(data.url)) return null;

  return {
    id: data.paymentRequestId,
    redirectUrl: data.url,
    mode: credentials.isTest ? "test" : "live",
  };
}
