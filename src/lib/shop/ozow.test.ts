import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  decideOzow,
  isOzowRedirect,
  ozowAmount,
  ozowNotificationHash,
  ozowRequestHash,
  verifyOzowNotification,
} from "@/lib/shop/ozow";

const privateKey = "private-key-example";

function noticeBody(status: string, amount = "5.00", reference = "order-1") {
  const fields = {
    siteCode: "SITE-001",
    transactionId: "33857766-f29a-4a3a-a37e-66db3c42e439",
    transactionReference: reference,
    amount,
    status,
    optional1: "",
    optional2: "",
    optional3: "",
    optional4: "",
    optional5: "",
    currencyCode: "ZAR",
    isTest: "True",
    statusMessage: "",
  };
  const hash = ozowNotificationHash(fields, privateKey);
  const form = new URLSearchParams({
    SiteCode: fields.siteCode,
    TransactionId: fields.transactionId,
    TransactionReference: fields.transactionReference,
    Amount: fields.amount,
    Status: fields.status,
    CurrencyCode: fields.currencyCode,
    IsTest: fields.isTest,
    StatusMessage: fields.statusMessage,
    Hash: hash,
  });
  return form.toString();
}

describe("Ozow checkout", () => {
  it("builds the request hash from the documented field order", () => {
    const fields = {
      siteCode: "SITE-001",
      countryCode: "ZA",
      currencyCode: "ZAR",
      amount: "5.00",
      transactionReference: "order-1",
      bankReference: "MOHAOORDER1",
      cancelUrl: "https://mohaotech.com/cancel",
      errorUrl: "https://mohaotech.com/error",
      successUrl: "https://mohaotech.com/success",
      notifyUrl: "https://mohaotech.com/notify",
      isTest: true,
    };
    const expected = createHash("sha512")
      .update(
        `${fields.siteCode}${fields.countryCode}${fields.currencyCode}${fields.amount}${fields.transactionReference}${fields.bankReference}${fields.cancelUrl}${fields.errorUrl}${fields.successUrl}${fields.notifyUrl}true${privateKey}`.toLowerCase(),
      )
      .digest("hex");
    expect(ozowRequestHash(fields, privateKey)).toBe(expected);
    expect(ozowAmount(500)).toBe("5.00");
  });

  it("accepts a complete notice and rejects a changed amount", () => {
    const paid = verifyOzowNotification(noticeBody("Complete"), privateKey, "SITE-001");
    expect(paid?.amountCents).toBe(500);
    expect(paid?.mode).toBe("test");
    expect(verifyOzowNotification(noticeBody("Complete", "6.00"), privateKey, "SITE-001")?.amountCents).toBe(600);
    expect(verifyOzowNotification(`${noticeBody("Complete")}x`, privateKey, "SITE-001")).toBeNull();
  });

  it("pays only a matching complete notice", () => {
    const order = { id: "order-1", status: "PENDING" as const, amountCents: 500, mode: "test" };
    const paid = verifyOzowNotification(noticeBody("Complete"), privateKey, "SITE-001");
    expect(paid && decideOzow(order, paid)).toBe("pay");
    expect(paid && decideOzow({ ...order, amountCents: 600 }, paid)).toBe("reject");
    expect(paid && decideOzow({ ...order, status: "PAID" }, paid)).toBe("duplicate");
    const cancelled = verifyOzowNotification(noticeBody("Cancelled"), privateKey, "SITE-001");
    expect(cancelled && decideOzow(order, cancelled)).toBe("cancel");
    const pending = verifyOzowNotification(noticeBody("Pending"), privateKey, "SITE-001");
    expect(pending && decideOzow(order, pending)).toBe("wait");
  });

  it("only follows an Ozow payment page", () => {
    expect(isOzowRedirect("https://pay.ozow.com/abc/Secure")).toBe(true);
    expect(isOzowRedirect("https://evil-ozow.com/abc")).toBe(false);
  });
});
