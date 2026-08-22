"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">
        Something went wrong
      </h1>
      <p className="mt-4 text-sm leading-7 text-muted">
        Please try again. If the problem continues, use the contact form later.
      </p>
      <Button className="mt-8" onClick={reset}>
        Try again
      </Button>
    </section>
  );
}
