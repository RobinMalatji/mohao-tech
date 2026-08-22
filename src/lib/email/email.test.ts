import { afterEach, describe, expect, it, vi } from "vitest";
import { sendEmail } from "@/lib/email";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.unstubAllGlobals();
});

describe("sendEmail", () => {
  it("rejects an invalid recipient", async () => {
    process.env.EMAIL_PROVIDER = "console";
    const result = await sendEmail({
      to: "not-valid",
      subject: "Test",
      text: "Hello",
      html: "<p>Hello</p>",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/invalid recipient/i);
    }
  });

  it("succeeds with the console provider", async () => {
    process.env.EMAIL_PROVIDER = "console";
    const result = await sendEmail({
      to: "person@example.com",
      subject: "Test",
      text: "Hello",
      html: "<p>Hello</p>",
    });
    expect(result).toEqual({ ok: true, provider: "console" });
  });

  it("fails when SMTP variables are missing", async () => {
    process.env.EMAIL_PROVIDER = "smtp";
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASSWORD;
    const result = await sendEmail({
      to: "person@example.com",
      subject: "Test",
      text: "Hello",
      html: "<p>Hello</p>",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/missing/i);
    }
  });

  it("fails when the Resend API key is missing", async () => {
    process.env.EMAIL_PROVIDER = "resend";
    delete process.env.RESEND_API_KEY;
    const result = await sendEmail({
      to: "person@example.com",
      subject: "Test",
      text: "Hello",
      html: "<p>Hello</p>",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/RESEND_API_KEY/i);
    }
  });
});
