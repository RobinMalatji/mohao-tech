import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Mohao Tech handles information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="text-4xl font-semibold tracking-[-0.05em]">Privacy Policy</h1>
      <p className="mt-6 text-sm leading-7 text-muted">
        This page explains how Mohao Tech handles information submitted through
        the website contact form. It is a general statement for the digital
        service and does not invent company registration, office or legal
        identity details.
      </p>
      <div className="mt-8 space-y-6 text-sm leading-7 text-muted">
        <section>
          <h2 className="text-xl font-semibold text-ink">Information we collect</h2>
          <p className="mt-2">
            When you send an enquiry, we collect the details you provide: name,
            email address, and message, together with optional phone number,
            company name and the service you selected.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink">How it is used</h2>
          <p className="mt-2">
            Enquiry information is used to respond to your request and to
            manage the conversation. It is stored in our enquiry system so the
            team can follow up.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink">Retention</h2>
          <p className="mt-2">
            Records are kept for as long as they are needed to handle the
            enquiry and related administration. You may ask us to update or
            remove information you have submitted.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink">Contact</h2>
          <p className="mt-2">
            For privacy questions, use the website contact form.
          </p>
        </section>
      </div>
    </article>
  );
}
