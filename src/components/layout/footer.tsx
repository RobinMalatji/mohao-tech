import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { services } from "@/lib/content/services";
import { legalLinks, navigation } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-inverse text-canvas">
      <Image
        src="/visuals/ribbon.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover object-right opacity-20 mix-blend-screen"
      />
      <Image
        src="/visuals/flowing-ribbons.gif"
        alt=""
        fill
        unoptimized
        sizes="100vw"
        className="pointer-events-none object-cover object-right opacity-25 mix-blend-screen motion-reduce:hidden"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo inverted />
          <p className="mt-6 text-sm leading-7 text-canvas/65">
            Mohao Tech provides digital and software solutions that help
            businesses work with greater clarity, reliability and reach.
          </p>
        </div>

        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-canvas/45">
            Services
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-canvas/80 transition-colors hover:text-canvas"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-canvas/45">
            Navigate
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-canvas/80 transition-colors hover:text-canvas"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-canvas/80 transition-colors hover:text-canvas"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-canvas/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-canvas/45 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Mohao Tech. All rights reserved.</p>
          <p>Technology. Digital Solutions. Business Growth.</p>
        </div>
      </div>
    </footer>
  );
}
