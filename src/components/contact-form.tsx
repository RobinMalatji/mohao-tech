"use client";

import { useActionState, useId, useState, type ReactNode } from "react";
import { submitContact, type ContactFormState } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/content/services";

const initialState: ContactFormState = { status: "idle" };

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const fieldClass =
  "min-h-12 w-full rounded-2xl border border-ink/12 bg-canvas px-4 text-sm text-ink placeholder:text-muted/70 focus:border-ink/40";

export function ContactForm() {
  const formId = useId();
  const [startedAt] = useState(() => String(Date.now()));
  const [state, action, pending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div
        className="rounded-[1.6rem] border border-line bg-surface/60 px-6 py-10"
        role="status"
      >
        <p className="text-xl font-semibold tracking-[-0.03em]">
          Thank you. Your enquiry has been received.
        </p>
        <p className="mt-3 text-sm leading-7 text-muted">
          A member of the Mohao Tech team will review your message and follow up.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="startedAt" value={startedAt} />
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${formId}-name`} label="Name" error={state.errors?.name}>
          <input
            id={`${formId}-name`}
            name="name"
            autoComplete="name"
            required
            className={fieldClass}
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby={state.errors?.name ? `${formId}-name-error` : undefined}
          />
        </Field>
        <Field id={`${formId}-email`} label="Email" error={state.errors?.email}>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            className={fieldClass}
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={state.errors?.email ? `${formId}-email-error` : undefined}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${formId}-phone`} label="Phone" error={state.errors?.phone}>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            className={fieldClass}
            aria-invalid={Boolean(state.errors?.phone)}
            aria-describedby={state.errors?.phone ? `${formId}-phone-error` : undefined}
          />
        </Field>
        <Field
          id={`${formId}-company`}
          label="Company"
          error={state.errors?.company}
        >
          <input
            id={`${formId}-company`}
            name="company"
            autoComplete="organization"
            className={fieldClass}
            aria-invalid={Boolean(state.errors?.company)}
            aria-describedby={
              state.errors?.company ? `${formId}-company-error` : undefined
            }
          />
        </Field>
      </div>

      <Field
        id={`${formId}-service`}
        label="Service required"
        error={state.errors?.service}
      >
        <select
          id={`${formId}-service`}
          name="service"
          required
          defaultValue=""
          className={fieldClass}
          aria-invalid={Boolean(state.errors?.service)}
          aria-describedby={
            state.errors?.service ? `${formId}-service-error` : undefined
          }
        >
          <option value="" disabled>
            Select a service
          </option>
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.title}
            </option>
          ))}
        </select>
      </Field>

      <Field id={`${formId}-message`} label="Message" error={state.errors?.message}>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          rows={6}
          className={`${fieldClass} min-h-36 resize-y py-3`}
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={
            state.errors?.message ? `${formId}-message-error` : undefined
          }
        />
      </Field>

      {state.message && state.status === "error" ? (
        <p className="text-sm text-red-700" role="alert">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} size="lg">
        {pending ? "Sending message..." : "Send enquiry"}
      </Button>
    </form>
  );
}
