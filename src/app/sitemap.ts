import type { MetadataRoute } from "next";
import { after } from "next/server";
import { notifyIndexNow } from "@/lib/indexnow";
import { getPublicUrls } from "@/lib/seo";
import { canonicalSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = getPublicUrls();

  after(() => {
    void notifyIndexNow(urls);
  });

  const lastModified = new Date();

  return urls.map((url) => ({
    url,
    lastModified,
    changeFrequency: url === canonicalSiteUrl ? "weekly" : "monthly",
    priority:
      url === canonicalSiteUrl
        ? 1
        : url === `${canonicalSiteUrl}/services` ||
            url.includes("/services/")
          ? 0.9
          : 0.7,
  }));
}
