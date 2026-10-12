import type { Metadata } from "next";
import { services } from "@/lib/content/services";
import { canonicalSiteUrl, legalLinks, navigation, site } from "@/lib/site";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function absoluteUrl(path: string) {
  if (!path || path === "/") {
    return canonicalSiteUrl;
  }

  return `${canonicalSiteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getPublicUrls() {
  const paths = new Set<string>([
    "/",
    ...navigation.map((item) => item.href),
    ...legalLinks.map((item) => item.href),
    ...services.map((service) => `/services/${service.slug}`),
  ]);

  return [...paths].map((path) => absoluteUrl(path));
}

export function brandedTitle(title: string) {
  return title.includes(site.name) ? title : `${title} | ${site.name}`;
}

export function buildMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const ogTitle = brandedTitle(title);

  return {
    title,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_ZA",
      url: path,
      title: ogTitle,
      description,
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}

export function getSearchVerification(): Metadata["verification"] | undefined {
  const google =
    process.env.GOOGLE_SITE_VERIFICATION?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  const yandex = process.env.YANDEX_VERIFICATION?.trim();
  const bing =
    process.env.BING_SITE_VERIFICATION?.trim() ||
    process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

  if (!google && !yandex && !bing) {
    return undefined;
  }

  return {
    ...(google ? { google } : {}),
    ...(yandex ? { yandex } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  };
}
