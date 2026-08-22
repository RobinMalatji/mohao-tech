import { z } from "zod";
import { serviceKeys } from "@/lib/site";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined));

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(254, "Email must be 254 characters or fewer."),
  phone: z
    .string()
    .trim()
    .max(40, "Phone number must be 40 characters or fewer.")
    .refine(
      (value) => value === "" || /^[+\d][\d\s().-]{5,}$/.test(value),
      "Please enter a valid phone number.",
    )
    .transform((value) => (value ? value : undefined)),
  company: optionalText(120),
  service: z.enum(serviceKeys, {
    error: "Please select a service.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail so we can help.")
    .max(5000, "Message must be 5,000 characters or fewer."),
  website: z.string().max(0, "Unable to send this enquiry.").optional(),
  startedAt: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<
  Record<keyof ContactInput | "form", string>
>;

export function parseContactForm(formData: FormData) {
  return contactSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    company: formData.get("company") ?? "",
    service: formData.get("service") ?? "",
    message: formData.get("message") ?? "",
    website: formData.get("website") ?? "",
    startedAt: formData.get("startedAt") ?? "",
  });
}

export function firstZodError(error: z.ZodError): ContactFieldErrors {
  const fieldErrors: ContactFieldErrors = {};

  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form") as keyof ContactFieldErrors;
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}

export function isLikelyAutomated(startedAt?: string) {
  if (!startedAt) return false;
  const started = Number(startedAt);
  if (!Number.isFinite(started)) return false;
  return Date.now() - started < 1500;
}
