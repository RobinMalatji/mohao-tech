import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { CTASection } from "@/components/cta-section";
import { ServiceIcon } from "@/components/icons";
import { ServiceJsonLd } from "@/components/json-ld";
import { getService, services } from "@/lib/content/services";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) {
    return { title: "Service" };
  }

  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} | Mohao Tech`,
      description: service.description,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <ServiceJsonLd
        name={service.title}
        description={service.description}
        path={`/services/${service.slug}`}
      />
      <section className="border-b border-line px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-ink/10">
            <ServiceIcon slug={service.slug} className="h-8 w-8" />
          </span>
          <p className="mt-6 accent-kicker text-muted">Service</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-6 text-base leading-8 text-muted">
            {service.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact">Discuss your project</ButtonLink>
            <ButtonLink href="/services" variant="secondary">
              All services
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">
              How this service works
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
              {service.detail}
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-line p-6 sm:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.03em]">
              Key capabilities
            </h2>
            <ul className="mt-5 space-y-3">
              {service.capabilities.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                  {item}
                </li>
              ))}
            </ul>
            <ButtonLink href="/contact" className="mt-8 w-full sm:w-auto">
              Get Started
            </ButtonLink>
          </div>
        </div>
      </section>

      <CTASection title="Talk to Mohao Tech" />
    </>
  );
}
