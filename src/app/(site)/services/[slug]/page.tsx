import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { CTASection } from "@/components/cta-section";
import { FaqList } from "@/components/faq-list";
import { ServiceIcon } from "@/components/icons";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/json-ld";
import { RelatedServices } from "@/components/related-services";
import {
  getRelatedServices,
  getService,
  services,
} from "@/lib/content/services";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) {
    return { title: "Service" };
  }

  return buildMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
    keywords: service.keywords,
  });
}

export default async function ServicePage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = getRelatedServices(service.slug);
  const crumbs = [
    { name: "Mohao Tech", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.title, path: `/services/${service.slug}` },
  ];

  return (
    <>
      <ServiceJsonLd service={service} />
      <FaqJsonLd faqs={service.faqs} />
      <BreadcrumbJsonLd items={crumbs} />
      <section className="border-b border-line px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={crumbs} />
          <span className="mt-8 grid h-14 w-14 place-items-center rounded-full border border-ink/10">
            <ServiceIcon slug={service.slug} className="h-8 w-8" />
          </span>
          <p className="mt-6 accent-kicker text-muted">Service</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            {service.heading}
          </h1>
          <p className="mt-6 text-base leading-8 text-muted">
            {service.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact">
              Discuss {service.title}
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary">
              All software, app and digital services
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                What this service is
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                {service.detail}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                Who it is for
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                {service.audience}
              </p>
            </div>
          </div>
          <div className="rounded-[1.6rem] border border-line p-6 sm:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.03em]">
              What you get
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              {service.outcomesIntro}
            </p>
            <ul className="mt-5 space-y-3">
              {service.capabilities.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                  {item}
                </li>
              ))}
            </ul>
            <ButtonLink href="/contact" className="mt-8 w-full sm:w-auto">
              Enquire about {service.title}
            </ButtonLink>
          </div>
        </div>
      </section>

      <RelatedServices
        services={related}
        contactLabel={`Discuss ${service.title}`}
      />

      <FaqList faqs={service.faqs} />

      <CTASection
        title={`Talk to Mohao Tech about ${service.title}`}
        primary={{ href: "/contact", label: "Contact Mohao Tech" }}
        secondary={{ href: "/services", label: "All digital services" }}
      />
    </>
  );
}
