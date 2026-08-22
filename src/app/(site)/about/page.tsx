import type { Metadata } from "next";
import { CTASection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Mohao Tech provides software development, mobile applications, digital marketing, SEO and e-commerce solutions for businesses.",
  alternates: { canonical: "/about" },
};

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
      <section className="border-b border-line px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-muted">
            About Mohao Tech
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            A technology partner for digital and software work.
          </h1>
          <p className="mt-6 text-base leading-8 text-muted">
            Mohao Tech is a technology company that provides digital and
            software solutions to businesses. We help organisations design,
            build and improve the systems that support their customers, teams
            and growth.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">
              What we do
            </h2>
            <div className="mt-6 space-y-5 text-sm leading-7 text-muted sm:text-base">
              <p>
                Our work covers custom software development, Android and iOS
                applications, digital marketing, search engine optimisation and
                e-commerce platforms. Each engagement is scoped around the
                requirement in front of us — a new product, an existing system
                that needs attention, or a digital presence that should work
                harder.
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
                <li key={item.title} className="rounded-[1.5rem] border border-line p-6">
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

      <CTASection
        title="Discuss your project"
        primary={{ href: "/contact", label: "Talk to Mohao Tech" }}
      />
    </>
  );
}
