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

  return urls.map((url) => ({
    url,
    changeFrequency: url === canonicalSiteUrl ? "weekly" : "monthly",
    priority:
      url === canonicalSiteUrl ? 1 : url.includes("/services") ? 0.8 : 0.7,
  }));
}
