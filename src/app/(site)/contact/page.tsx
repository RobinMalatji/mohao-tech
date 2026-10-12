import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { services } from "@/lib/content/services";
import { buildMetadata } from "@/lib/seo";

const crumbs = [
  { name: "Mohao Tech", path: "/" },
  { name: "Contact", path: "/contact" },
];

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact Mohao Tech to discuss custom software, websites, Android and iOS apps, digital marketing, search engine optimisation or an e-commerce store.",
  path: "/contact",
  keywords: [
    "contact Mohao Tech",
    "software development enquiry",
    "mobile app development",
    "SEO services",
    "e-commerce websites",
  ],
});

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Breadcrumbs items={crumbs} />
            <p className="mt-6 accent-kicker text-muted">Contact</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Enquire about software, apps, SEO or e-commerce.
            </h1>
            <p className="mt-6 text-base leading-8 text-muted">
              Share a little about the work you have in mind. Tell us the
              service you need and we will review the enquiry.
            </p>
            <p className="mt-6 text-sm leading-7 text-muted">
              Required fields are name, email, service and message. Phone and
              company details are optional and help us prepare a more useful
              response.
            </p>
            <div className="mt-8">
              <h2 className="text-sm font-semibold tracking-[-0.02em]">
                Enquiries are open for
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-7">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-ink underline decoration-signal/70 underline-offset-4 hover:decoration-signal"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-[1.8rem] border border-line bg-canvas/50 p-5 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
