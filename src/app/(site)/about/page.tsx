import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CTASection } from "@/components/cta-section";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { StatementBand } from "@/components/visuals/statement-band";
import { services } from "@/lib/content/services";
import { buildMetadata } from "@/lib/seo";

const crumbs = [
  { name: "Mohao Tech", path: "/" },
  { name: "About", path: "/about" },
];

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Mohao Tech is a technology company that provides custom software, websites, Android and iOS apps, digital marketing, SEO and e-commerce stores for businesses.",
  path: "/about",
  keywords: [
    "Mohao Tech",
    "technology company",
    "software development",
    "digital services",
  ],
});

const principles = [
  {
    title: "Professional delivery",
    body: "Work is planned, communicated and implemented with care. The aim is software and digital systems that businesses can rely on.",
  },
  {
    title: "Modern technology",
    body: "We use contemporary tools and practices where they serve the product — for performance, security and long-term maintainability.",
  },
  {
    title: "Business-first thinking",
    body: "Technology is a means to a clearer operation, a better customer experience or a stronger digital presence. The requirement leads the solution.",
  },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />
      <section className="border-b border-line px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={crumbs} />
          <p className="mt-6 accent-kicker text-muted">About Mohao Tech</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            A technology partner for software, apps and digital work.
          </h1>
          <p className="mt-6 text-base leading-8 text-muted">
            Mohao Tech is a technology company that provides digital and
            software solutions to businesses. We help organisations design,
            build and improve the systems that support their customers, teams
            and growth.
          </p>
        </div>
      </section>

      <StatementBand />

      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">
              What we do
            </h2>
            <div className="mt-6 space-y-5 text-sm leading-7 text-muted sm:text-base">
              <p>
                Our work covers{" "}
                <Link
                  href="/services/software-development"
                  className="text-ink underline decoration-signal/70 underline-offset-4 hover:decoration-signal"
                >
                  custom software development
                </Link>
                ,{" "}
                <Link
                  href="/services/mobile-apps"
                  className="text-ink underline decoration-signal/70 underline-offset-4 hover:decoration-signal"
                >
                  Android and iOS applications
                </Link>
                ,{" "}
                <Link
                  href="/services/digital-marketing"
                  className="text-ink underline decoration-ember/70 underline-offset-4 hover:decoration-ember"
                >
                  digital marketing
                </Link>
                ,{" "}
                <Link
                  href="/services/seo"
                  className="text-ink underline decoration-ember/70 underline-offset-4 hover:decoration-ember"
                >
                  search engine optimisation
                </Link>{" "}
                and{" "}
                <Link
                  href="/services/ecommerce"
                  className="text-ink underline decoration-ember/70 underline-offset-4 hover:decoration-ember"
                >
                  e-commerce platforms
                </Link>
                . Each engagement is scoped around the requirement in front of
                us — a new product, an existing system that needs attention, or
                a digital presence that should work harder.
              </p>
              <p>
                We take a practical approach. Discovery comes first. Then we
                design, implement and support the solution with a focus on
                security, performance and clarity. The goal is technology that
                is useful on ordinary working days, not only at launch.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <ul className="space-y-5">
              {principles.map((item, index) => (
                <li key={item.title} className="relative overflow-hidden rounded-[1.5rem] border border-line p-6">
                  <span
                    className="absolute left-0 top-6 h-8 w-0.5 rounded-full"
                    style={{
                      background:
                        index === 1
                          ? "var(--ember)"
                          : index === 2
                            ? "var(--flare)"
                            : "var(--signal)",
                    }}
                    aria-hidden="true"
                  />
                  <p className="font-mono text-[0.7rem] tracking-[0.16em] text-muted">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">
            Services we provide
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="flex h-full flex-col rounded-[1.4rem] border border-line p-5 transition-colors hover:border-ink/20"
                >
                  <p className="font-semibold tracking-[-0.02em]">{service.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted">{service.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection
        title="Discuss your project"
        primary={{ href: "/contact", label: "Contact Mohao Tech" }}
        secondary={{ href: "/services", label: "Software, apps and SEO" }}
      />
    </>
  );
}
