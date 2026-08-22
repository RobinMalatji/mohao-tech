import type { Metadata } from "next";
import { CTASection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Mohao Tech services: software development, Android and iOS apps, digital marketing, SEO and e-commerce.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-line px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="accent-kicker text-muted">Services</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Software, mobile and digital services for growing businesses.
          </h1>
          <p className="mt-6 text-base leading-8 text-muted">
            Mohao Tech focuses on five core services. Each can stand alone or
            form part of a broader digital programme.
          </p>
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

      <CTASection title="Let’s build something great" />
    </>
  );
}
