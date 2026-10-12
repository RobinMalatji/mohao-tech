import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import type { Service } from "@/lib/content/services";

export function RelatedServices({
  services,
  contactLabel,
}: {
  services: Service[];
  contactLabel: string;
}) {
  if (services.length === 0) return null;

  return (
    <section className="border-t border-line px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="accent-kicker text-muted">Related services</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
          Work that often sits alongside this
        </h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col rounded-[1.5rem] border border-line bg-canvas/40 p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-ink/20"
              >
                <h3 className="text-lg font-semibold tracking-[-0.03em]">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-muted">
                  {service.summary}
                </p>
                <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                  {service.shortTitle}
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact">{contactLabel}</ButtonLink>
          <ButtonLink href="/services" variant="secondary">
            All software, app and digital services
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
