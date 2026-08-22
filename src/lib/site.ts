function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // Fall through to platform defaults.
    }
  }

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (productionHost) {
    return `https://${productionHost}`;
  }

  const deploymentHost = process.env.VERCEL_URL?.trim();
  if (deploymentHost) {
    return `https://${deploymentHost}`;
  }

  return "http://localhost:3000";
}

export const site = {
  name: "Mohao Tech",
  tagline: "Technology. Digital Solutions. Business Growth.",
  description:
    "Mohao Tech provides software development, mobile applications, digital marketing, SEO and e-commerce solutions that help businesses grow with modern technology.",
  url: resolveSiteUrl(),
} as const;

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;

export const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
] as const;

export const serviceKeys = [
  "software-development",
  "mobile-apps",
  "digital-marketing",
  "seo",
  "ecommerce",
] as const;

export type ServiceKey = (typeof serviceKeys)[number];

export const enquiryStatuses = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "COMPLETED",
  "ARCHIVED",
] as const;

export type EnquiryStatusValue = (typeof enquiryStatuses)[number];

export const enquiryStatusLabels: Record<EnquiryStatusValue, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};
