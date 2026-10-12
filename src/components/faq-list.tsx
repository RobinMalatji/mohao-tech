import type { ServiceFaq } from "@/lib/content/services";

export function FaqList({
  faqs,
  heading = "Questions people ask",
}: {
  faqs: ServiceFaq[];
  heading?: string;
}) {
  if (faqs.length === 0) return null;

  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="accent-kicker text-muted">FAQ</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{heading}</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-[1.4rem] border border-line bg-canvas/40 px-5 py-4 open:border-ink/20"
            >
              <summary className="faq-summary flex cursor-pointer list-none items-start justify-between gap-4 text-left text-base font-semibold tracking-[-0.02em]">
                <span>{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="mt-1 font-mono text-xs text-muted transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-prose text-sm leading-7 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
