import { describe, expect, it } from "vitest";
import {
  contactSchema,
  isLikelyAutomated,
  parseContactForm,
} from "@/lib/validation/contact";

function form(entries: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    data.set(key, value);
  }
  return data;
}

const valid = {
  name: "Alex Nkosi",
  email: "alex@example.com",
  phone: "+27 82 000 0000",
  company: "Example Co",
  service: "software-development",
  message: "We need a custom business system for internal operations.",
  website: "",
};

describe("contactSchema", () => {
  it("accepts a complete valid submission", () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects empty required fields", () => {
    const result = contactSchema.safeParse({
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      message: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a short message", () => {
    const result = contactSchema.safeParse({ ...valid, message: "Hello" });
    expect(result.success).toBe(false);
  });

  it("rejects an overly long message", () => {
    const result = contactSchema.safeParse({
      ...valid,
      message: "x".repeat(5001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts special characters in the message", () => {
    const result = contactSchema.safeParse({
      ...valid,
      message: "Please review <script> & quotes \" ' and unicode 你好.",
    });
    expect(result.success).toBe(true);
  });

  it("treats a filled honeypot as invalid", () => {
    const result = contactSchema.safeParse({ ...valid, website: "https://spam.test" });
    expect(result.success).toBe(false);
  });

  it("parses FormData the same way as the server action", () => {
    const result = parseContactForm(form(valid));
    expect(result.success).toBe(true);
  });
});

describe("isLikelyAutomated", () => {
  it("flags submissions completed in under 1.5 seconds", () => {
    expect(isLikelyAutomated(String(Date.now() - 200))).toBe(true);
  });

  it("allows ordinary completion times", () => {
    expect(isLikelyAutomated(String(Date.now() - 4000))).toBe(false);
  });
});
