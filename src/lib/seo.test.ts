import { describe, expect, it } from "vitest";
import { canonicalSiteUrl } from "@/lib/site";
import { absoluteUrl, buildMetadata, getPublicUrls } from "@/lib/seo";

describe("public SEO URLs", () => {
  it("uses the apex Mohao Tech domain, not vercel.app", () => {
    const urls = getPublicUrls();

    expect(canonicalSiteUrl).toBe("https://mohaotech.com");
    expect(absoluteUrl("/")).toBe("https://mohaotech.com");
    expect(urls).toContain("https://mohaotech.com");
    expect(urls).toContain("https://mohaotech.com/shop");
    expect(urls).toContain("https://mohaotech.com/about");
    expect(urls).toContain("https://mohaotech.com/services");
    expect(urls).toContain("https://mohaotech.com/contact");
    expect(urls).toContain("https://mohaotech.com/services/software-development");
    expect(urls).toContain("https://mohaotech.com/services/mobile-apps");
    expect(urls).toContain("https://mohaotech.com/services/digital-marketing");
    expect(urls).toContain("https://mohaotech.com/services/seo");
    expect(urls).toContain("https://mohaotech.com/services/ecommerce");
    expect(urls).toContain("https://mohaotech.com/privacy");
    expect(urls).toContain("https://mohaotech.com/terms");
    expect(urls.some((url) => url.includes("vercel.app"))).toBe(false);
    expect(urls.every((url) => url.startsWith("https://mohaotech.com"))).toBe(
      true,
    );
  });

  it("keeps page canonicals as site paths, not vercel.app hosts", () => {
    const metadata = buildMetadata({
      title: "Custom Software Development",
      description: "Custom software, websites and business systems.",
      path: "/services/software-development",
    });

    expect(metadata.alternates?.canonical).toBe(
      "/services/software-development",
    );
    expect(metadata.openGraph?.url).toBe("/services/software-development");
    expect(metadata.openGraph?.locale).toBe("en_ZA");
    expect(JSON.stringify(metadata)).not.toContain("vercel.app");
  });
});
