import { site } from "@/lib/site";
import { getServiceLabel } from "@/lib/content/services";

type EnquiryMail = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function businessEnquiryEmail(enquiry: EnquiryMail) {
  const service = getServiceLabel(enquiry.service);
  const text = [
    "A new enquiry has been received on the Mohao Tech website.",
    "",
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone || "Not provided"}`,
    `Company: ${enquiry.company || "Not provided"}`,
    `Service: ${service}`,
    "",
    "Message:",
    enquiry.message,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
      <p>A new enquiry has been received on the Mohao Tech website.</p>
      <p>
        <strong>Name:</strong> ${escapeHtml(enquiry.name)}<br />
        <strong>Email:</strong> ${escapeHtml(enquiry.email)}<br />
        <strong>Phone:</strong> ${escapeHtml(enquiry.phone || "Not provided")}<br />
        <strong>Company:</strong> ${escapeHtml(enquiry.company || "Not provided")}<br />
        <strong>Service:</strong> ${escapeHtml(service)}
      </p>
      <p><strong>Message</strong></p>
      <p>${escapeHtml(enquiry.message).replaceAll("\n", "<br />")}</p>
    </div>
  `;

  return {
    subject: `New Mohao Tech enquiry: ${service}`,
    text,
    html,
  };
}

export function acknowledgementEmail(enquiry: EnquiryMail) {
  const text = [
    `Hello ${enquiry.name},`,
    "",
    "Thank you for contacting Mohao Tech. Your enquiry has been received and our team will review it shortly.",
    "",
    "You do not need to reply to this message unless you have additional detail to share.",
    "",
    site.name,
    site.tagline,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
      <p>Hello ${escapeHtml(enquiry.name)},</p>
      <p>Thank you for contacting Mohao Tech. Your enquiry has been received and our team will review it shortly.</p>
      <p>You do not need to reply to this message unless you have additional detail to share.</p>
      <p><strong>${escapeHtml(site.name)}</strong><br />${escapeHtml(site.tagline)}</p>
    </div>
  `;

  return {
    subject: "Your Mohao Tech enquiry has been received",
    text,
    html,
  };
}
