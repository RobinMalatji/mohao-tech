import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { CTASection } from "@/components/cta-section";
import { HeroVisual } from "@/components/hero-visual";
import { Reveal } from "@/components/reveal";
import { ServiceCard } from "@/components/service-card";
import { FieldBackdrop } from "@/components/visuals/field-backdrop";
import { StatementBand } from "@/components/visuals/statement-band";
import { services } from "@/lib/content/services";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const homeTitle = `${site.name} | Software, Mobile Apps and Digital Services`;
const homeDescription = site.description;

export const metadata: Metadata = {
  ...buildMetadata({
    title: homeTitle,
    description: homeDescription,
    path: "/",
    keywords: [
      "Mohao Tech",
      "software development",
      "mobile app development",
      "websites",
      "e-commerce websites",
      "SEO services",
      "digital marketing",
    ],
  }),
  title: { absolute: homeTitle },
};

const approach = [
  {
    title: "Understand the work",
    body: "We start with the business requirement, the people who will use the system, and the outcome that matters.",
  },
  {
    title: "Design with intent",
    body: "Interfaces, architecture and content are planned so the solution is clear to use and practical to maintain.",
  },
  {
    title: "Build for reliability",
    body: "Delivery focuses on secure, performant software that can be supported after launch — not a one-off handover.",
  },
  {
    title: "Stay measurable",
    body: "Marketing, SEO and product work are reviewed so decisions can be made with evidence rather than noise.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#050505] text-canvas">
        <FieldBackdrop src="/visuals/topo.png" opacity={0.38} />
        <Image
          src="/visuals/ribbon.png"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover object-right opacity-25 mix-blend-screen"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/82 to-[#050505]/35"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 78% 45%, color-mix(in srgb, var(--signal) 16%, transparent), transparent 36%), radial-gradient(ellipse at 18% 80%, color-mix(in srgb, var(--ember) 12%, transparent), transparent 32%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="accent-kicker text-canvas/60">{site.tagline}</p>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.05em] text-canvas sm:text-5xl lg:text-6xl">
              Software, mobile apps and digital services for businesses.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-canvas/65">
              Mohao Tech builds{" "}
              <Link
                href="/services/software-development"
                className="text-canvas underline decoration-signal/70 underline-offset-4 hover:decoration-signal"
              >
                custom software and websites
              </Link>
              ,{" "}
              <Link
                href="/services/mobile-apps"
                className="text-canvas underline decoration-signal/70 underline-offset-4 hover:decoration-signal"
              >
                Android and iOS apps
              </Link>
              ,{" "}
              <Link
                href="/services/ecommerce"
                className="text-canvas underline decoration-signal/70 underline-offset-4 hover:decoration-signal"
              >
                e-commerce stores
              </Link>
              , and supports{" "}
              <Link
                href="/services/digital-marketing"
                className="text-canvas underline decoration-ember/70 underline-offset-4 hover:decoration-ember"
              >
                digital marketing
              </Link>{" "}
              and{" "}
              <Link
                href="/services/seo"
                className="text-canvas underline decoration-ember/70 underline-offset-4 hover:decoration-ember"
              >
                search engine optimisation
              </Link>
              .
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" variant="inverse" size="lg">
                Discuss a project
              </ButtonLink>
              <ButtonLink href="/shop" variant="inverseSecondary" size="lg">
                Digital products shop
              </ButtonLink>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-line px-5 py-16 sm:px-8 sm:py-20">
        <Image
          src="/visuals/ribbon.png"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover object-left opacity-[0.08]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <p className="accent-kicker text-muted">Approach</p>
            <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Digital solutions shaped around the business.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <ol className="space-y-5">
              {approach.map((item, index) => (
                <li key={item.title} className="flex gap-4 border-b border-line pb-5 last:border-0">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 text-xs">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-[-0.02em]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-muted">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <StatementBand />

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="accent-kicker text-muted">Services</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  Software, apps, websites, SEO and e-commerce
                </h2>
              </div>
              <ButtonLink href="/services" variant="secondary">
                All digital services
              </ButtonLink>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 60}>
                <ServiceCard service={service} index={index + 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Discuss software, apps or an online store"
        body="Tell us about the website, application, e-commerce store or search work you have in mind. Mohao Tech will review your enquiry and follow up with a clear next step."
        primary={{ href: "/contact", label: "Contact Mohao Tech" }}
        secondary={{ href: "/services", label: "Browse digital services" }}
      />
    </>
  );
}
