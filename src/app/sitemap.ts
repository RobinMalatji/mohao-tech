import type { MetadataRoute } from "next";
import { services } from "@/lib/content/services";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes = ["", "/about", "/services", "/contact", "/privacy", "/terms"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${site.url}${path || "/"}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...services.map((service) => ({
      url: `${site.url}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
