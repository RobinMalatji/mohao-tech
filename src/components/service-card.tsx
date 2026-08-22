import Link from "next/link";
import { ArrowIcon, ServiceIcon } from "@/components/icons";
import type { Service } from "@/lib/content/services";

export function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-line bg-canvas/40 p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-ink/20 sm:p-7"
    >
      <span
        className="absolute left-0 top-7 h-10 w-0.5 rounded-full"
        style={{
          background:
            index % 3 === 1
              ? "var(--ember)"
              : index % 3 === 2
                ? "var(--flare)"
                : "var(--signal)",
        }}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-ink/10 text-ink">
          <ServiceIcon slug={service.slug} className="h-7 w-7" />
        </span>
        <span className="font-mono text-[0.7rem] tracking-[0.16em] text-muted">
          0{index}
        </span>
      </div>
      <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em]">
        {service.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-muted">{service.summary}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
        View service
        <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </p>
    </Link>
  );
}
