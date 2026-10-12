import type { MetadataRoute } from "next";
import { after } from "next/server";
import { notifyIndexNow } from "@/lib/indexnow";
import { absoluteUrl, getPublicUrls } from "@/lib/seo";
import { getCategories, getProducts } from "@/lib/shop/catalogue";
import { canonicalSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const urls = [
    ...getPublicUrls(),
    ...categories.map((category) => absoluteUrl(`/shop/c/${category.slug}`)),
    ...products.map((product) => absoluteUrl(`/shop/p/${product.slug}`)),
  ];

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
