import { describe, expect, it } from "vitest";
import {
  getRelatedServices,
  getService,
  services,
  servicesHub,
} from "@/lib/content/services";

const banned = [
  /#1/,
  /best tech company/i,
  /number one/i,
  /award-winning/i,
  /first page guaranteed/i,
  /we guarantee/i,
];

function allCopy() {
  return services.flatMap((service) => [
    service.heading,
    service.seoTitle,
    service.seoDescription,
    service.description,
    service.detail,
    service.audience,
    service.outcomesIntro,
    ...service.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ]);
}

describe("service SEO content", () => {
  it("covers every listed service with unique titles and H1s", () => {
    const slugs = services.map((service) => service.slug);
    expect(slugs).toEqual([
      "software-development",
      "mobile-apps",
      "digital-marketing",
      "seo",
      "ecommerce",
    ]);
    expect(new Set(services.map((service) => service.seoTitle)).size).toBe(
      services.length,
    );
    expect(new Set(services.map((service) => service.heading)).size).toBe(
      services.length,
    );
    expect(new Set(services.map((service) => service.seoDescription)).size).toBe(
      services.length,
    );
  });

  it("keeps related services pointing at real pages", () => {
    for (const service of services) {
      expect(service.faqs.length).toBeGreaterThanOrEqual(3);
      const related = getRelatedServices(service.slug);
      expect(related.length).toBe(service.related.length);
      expect(related.some((item) => item.slug === service.slug)).toBe(false);
    }
    expect(getService("missing")).toBeUndefined();
  });

  it("does not invent rankings, awards or guaranteed results", () => {
    const copy = [
      ...allCopy(),
      servicesHub.intro,
      servicesHub.seoTitle,
      servicesHub.seoDescription,
      ...servicesHub.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ].join("\n");

    for (const pattern of banned) {
      expect(copy).not.toMatch(pattern);
    }
  });

  it("states that SEO does not promise rankings", () => {
    const seo = getService("seo");
    expect(seo?.detail).toMatch(/do not promise specific rankings/i);
    expect(
      seo?.faqs.some((faq) => /guarantee/i.test(faq.question)),
    ).toBe(true);
  });
});
