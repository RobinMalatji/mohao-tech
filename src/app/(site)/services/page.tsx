import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CTASection } from "@/components/cta-section";
import { FaqList } from "@/components/faq-list";
import { BreadcrumbJsonLd, FaqJsonLd, OfferCatalogJsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { ServiceCard } from "@/components/service-card";
import { services, servicesHub } from "@/lib/content/services";
import { buildMetadata } from "@/lib/seo";

const crumbs = [
  { name: "Mohao Tech", path: "/" },
  { name: "Services", path: "/services" },
];

export const metadata: Metadata = buildMetadata({
  title: servicesHub.seoTitle,
  description: servicesHub.seoDescription,
  path: "/services",
  keywords: servicesHub.keywords,
});

export default function ServicesPage() {
  return (
    <>
      <OfferCatalogJsonLd />
      <FaqJsonLd faqs={servicesHub.faqs} />
      <BreadcrumbJsonLd items={crumbs} />
      <section className="border-b border-line px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={crumbs} />
          <p className="mt-6 accent-kicker text-muted">Services</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            {servicesHub.heading}
          </h1>
          <p className="mt-6 text-base leading-8 text-muted">{servicesHub.intro}</p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 50}>
              <ServiceCard service={service} index={index + 1} />
            </Reveal>
          ))}
        </div>
      </section>

      <FaqList faqs={servicesHub.faqs} heading="How Mohao Tech services work" />

      <CTASection
        title="Enquire about a digital service"
        primary={{ href: "/contact", label: "Contact Mohao Tech" }}
        secondary={{ href: "/about", label: "About Mohao Tech" }}
      />
    </>
  );
}
