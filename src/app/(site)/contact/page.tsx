import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Mohao Tech to discuss software development, mobile apps, digital marketing, SEO or e-commerce.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="accent-kicker text-muted">Contact</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Let’s build something great.
          </h1>
          <p className="mt-6 text-base leading-8 text-muted">
            Share a little about the work you have in mind. Tell us the service
            you need and we will review the enquiry.
          </p>
          <p className="mt-6 text-sm leading-7 text-muted">
            Required fields are name, email, service and message. Phone and
            company details are optional and help us prepare a more useful
            response.
          </p>
        </div>
        <div className="rounded-[1.8rem] border border-line bg-canvas/50 p-5 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
