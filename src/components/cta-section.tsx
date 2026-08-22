import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function CTASection({
  title = "Let’s build something great",
  body = "Tell us about the system, application or digital presence you want to create. Mohao Tech will review your enquiry and follow up with a clear next step.",
  primary = { href: "/contact", label: "Get Started" },
  secondary = { href: "/services", label: "View Services" },
}: {
  title?: string;
  body?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="px-5 py-20 sm:px-8">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-inverse px-6 py-14 text-canvas sm:px-12">
          <Image
            src="/visuals/ember.png"
            alt=""
            fill
            sizes="100vw"
            className="pointer-events-none object-cover object-right opacity-35"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-inverse via-inverse/88 to-inverse/40"
            aria-hidden="true"
          />
          <div className="relative">
            <p className="accent-kicker text-canvas/55">Talk to Mohao Tech</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              {title}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-canvas/65 sm:text-base">
              {body}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={primary.href} variant="inverse">
                {primary.label}
              </ButtonLink>
              <ButtonLink href={secondary.href} variant="inverseSecondary">
                {secondary.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
