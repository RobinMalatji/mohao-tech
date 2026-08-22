"use server";

import { isDatabaseConfigured, prisma } from "@/lib/db";
import { sendEnquiryEmails } from "@/lib/email";
import {
  acknowledgementEmail,
  businessEnquiryEmail,
} from "@/lib/email/templates";
import { rateLimit } from "@/lib/rate-limit";
import { getClientKey } from "@/lib/request";
import {
  firstZodError,
  isLikelyAutomated,
  parseContactForm,
  type ContactFieldErrors,
} from "@/lib/validation/contact";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: ContactFieldErrors;
};

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = parseContactForm(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: firstZodError(parsed.error),
    };
  }

  if (parsed.data.website || isLikelyAutomated(parsed.data.startedAt)) {
    return {
      status: "success",
      message: "Thank you. Your enquiry has been received.",
    };
  }

  const key = `contact:${await getClientKey()}`;
  const limited = rateLimit(key, 5, 60 * 60 * 1000);
  if (!limited.success) {
    return {
      status: "error",
      message:
        "Too many enquiries were sent from this connection. Please try again later.",
    };
  }

  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      message: "We couldn't send your message. Please try again.",
    };
  }

  try {
    const enquiry = await prisma.contactSubmission.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        company: parsed.data.company,
        service: parsed.data.service,
        message: parsed.data.message,
      },
    });

    const mail = {
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone ?? undefined,
      company: enquiry.company ?? undefined,
      service: enquiry.service,
      message: enquiry.message,
    };

    const emailResults = await sendEnquiryEmails({
      enquiry: mail,
      templates: {
        business: businessEnquiryEmail(mail),
        acknowledgement: acknowledgementEmail(mail),
      },
    });

    if (!emailResults.business.ok || !emailResults.acknowledgement.ok) {
      console.error("Enquiry email delivery issue", emailResults);
    }

    return {
      status: "success",
      message: "Thank you. Your enquiry has been received.",
    };
  } catch (error) {
    console.error("Contact submission failed", error);
    return {
      status: "error",
      message: "We couldn't send your message. Please try again.",
    };
  }
}
