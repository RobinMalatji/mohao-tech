import { ButtonLink } from "@/components/ui/button";
import { SiteShell } from "@/components/layout/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <p className="font-mono text-sm tracking-[0.2em] text-muted">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
          This page is not available.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          The address may have changed, or the page may not exist.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/">Back home</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Contact
          </ButtonLink>
        </div>
      </section>
    </SiteShell>
  );
}
