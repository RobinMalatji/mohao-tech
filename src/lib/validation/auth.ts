import { z } from "zod";
import { enquiryStatuses } from "@/lib/site";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

export const enquiryStatusSchema = z.enum(enquiryStatuses);

export const enquiryIdSchema = z.string().cuid("Invalid enquiry.");

export function firstError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Please check the form and try again.";
}
