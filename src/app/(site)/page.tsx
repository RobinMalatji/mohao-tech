import { ButtonLink } from "@/components/ui/button";
import { CTASection } from "@/components/cta-section";
import { HeroVisual } from "@/components/hero-visual";
import { Reveal } from "@/components/reveal";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/content/services";

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
      <section className="overflow-x-hidden border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">
              Mohao Tech
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl lg:text-6xl">
              Technology. Digital Solutions. Business Growth.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-muted">
              Mohao Tech is a technology company that builds software, mobile
              applications and digital systems for businesses that need modern,
              reliable tools.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" size="lg">
                Get Started
              </ButtonLink>
              <ButtonLink href="/services" variant="secondary" size="lg">
                View Services
              </ButtonLink>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section className="border-b border-line px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <h2 className="max-w-md text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
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

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-muted">
                  Services
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  What Mohao Tech builds
                </h2>
              </div>
              <ButtonLink href="/services" variant="secondary">
                All services
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

      <CTASection />
    </>
  );
}
