import nodemailer from "nodemailer";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type EmailSendResult =
  | { ok: true; provider: string }
  | { ok: false; provider: string; error: string };

export type EmailProviderName = "console" | "smtp" | "resend";

function getProvider(): EmailProviderName {
  const value = (process.env.EMAIL_PROVIDER ?? "console").toLowerCase();
  if (value === "smtp" || value === "resend" || value === "console") {
    return value;
  }
  return "console";
}

function fromAddress() {
  return process.env.EMAIL_FROM || "Mohao Tech <hello@example.com>";
}

async function sendWithConsole(message: EmailMessage): Promise<EmailSendResult> {
  console.info("[email:console]", {
    from: fromAddress(),
    to: message.to,
    subject: message.subject,
    text: message.text,
  });
  return { ok: true, provider: "console" };
}

async function sendWithSmtp(message: EmailMessage): Promise<EmailSendResult> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return {
      ok: false,
      provider: "smtp",
      error: "SMTP environment variables are missing.",
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: fromAddress(),
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    return { ok: true, provider: "smtp" };
  } catch (error) {
    return {
      ok: false,
      provider: "smtp",
      error: error instanceof Error ? error.message : "SMTP send failed.",
    };
  }
}

async function sendWithResend(message: EmailMessage): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      provider: "resend",
      error: "RESEND_API_KEY is missing.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return {
        ok: false,
        provider: "resend",
        error: body || `Resend returned ${response.status}.`,
      };
    }

    return { ok: true, provider: "resend" };
  } catch (error) {
    return {
      ok: false,
      provider: "resend",
      error: error instanceof Error ? error.message : "Resend send failed.",
    };
  }
}

export async function sendEmail(message: EmailMessage): Promise<EmailSendResult> {
  const provider = getProvider();

  if (!message.to || !message.to.includes("@")) {
    return { ok: false, provider, error: "Invalid recipient." };
  }

  if (provider === "smtp") return sendWithSmtp(message);
  if (provider === "resend") return sendWithResend(message);
  return sendWithConsole(message);
}

export async function sendEnquiryEmails(input: {
  enquiry: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    service: string;
    message: string;
  };
  templates: {
    business: { subject: string; text: string; html: string };
    acknowledgement: { subject: string; text: string; html: string };
  };
}) {
  const businessEmail = process.env.BUSINESS_EMAIL;

  const results = {
    business: businessEmail
      ? await sendEmail({ to: businessEmail, ...input.templates.business })
      : {
          ok: false as const,
          provider: getProvider(),
          error: "BUSINESS_EMAIL is not configured.",
        },
    acknowledgement: await sendEmail({
      to: input.enquiry.email,
      ...input.templates.acknowledgement,
    }),
  };

  return results;
}
