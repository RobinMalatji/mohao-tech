import { describe, expect, it } from "vitest";
import { canonicalSiteUrl } from "@/lib/site";
import { absoluteUrl, getPublicUrls } from "@/lib/seo";

describe("public SEO URLs", () => {
  it("uses the apex Mohao Tech domain, not vercel.app", () => {
    const urls = getPublicUrls();

    expect(canonicalSiteUrl).toBe("https://mohaotech.com");
    expect(absoluteUrl("/")).toBe("https://mohaotech.com");
    expect(urls).toContain("https://mohaotech.com");
    expect(urls).toContain("https://mohaotech.com/about");
    expect(urls).toContain("https://mohaotech.com/services");
    expect(urls).toContain("https://mohaotech.com/contact");
    expect(urls.some((url) => url.includes("vercel.app"))).toBe(false);
    expect(urls.every((url) => url.startsWith("https://mohaotech.com"))).toBe(
      true,
    );
  });
});
