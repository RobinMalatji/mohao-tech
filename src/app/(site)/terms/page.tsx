import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using the Mohao Tech website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="text-4xl font-semibold tracking-[-0.05em]">
        Terms of Service
      </h1>
      <p className="mt-6 text-sm leading-7 text-muted">
        These terms apply to the use of the Mohao Tech website. They do not
        replace a signed project agreement for professional services.
      </p>
      <div className="mt-8 space-y-6 text-sm leading-7 text-muted">
        <section>
          <h2 className="text-xl font-semibold text-ink">Website use</h2>
          <p className="mt-2">
            The website is provided to describe Mohao Tech services and to
            receive enquiries. Do not misuse the contact form, attempt to
            disrupt the service, or submit unlawful content.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink">Enquiries</h2>
          <p className="mt-2">
            Sending an enquiry does not create a contract. A project starts
            only when both parties agree the scope, commercial terms and
            delivery approach in writing.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink">Content</h2>
          <p className="mt-2">
            Website content is provided for general information. Service
            descriptions may be updated as offerings evolve.
          </p>
        </section>
      </div>
    </article>
  );
}
