"use client";

import Link from "next/link";
import {
  useState,
  type ComponentProps,
  type PointerEvent,
} from "react";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  inverse: "btn-inverse",
  inverseSecondary: "btn-inverse-secondary",
} as const;

const sizes = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-sm",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

const base =
  "btn inline-flex items-center justify-center gap-2 rounded-full border font-medium tracking-[-0.01em] transition-colors duration-200 disabled:cursor-not-allowed";

function usePress<T extends HTMLElement>(disabled?: boolean) {
  const [pressed, setPressed] = useState(false);

  function start(event: PointerEvent<T>) {
    if (disabled || event.button > 0) return;
    setPressed(true);
  }

  function stop() {
    setPressed(false);
  }

  return {
    pressed,
    handlers: {
      onPointerDown: start,
      onPointerUp: stop,
      onPointerCancel: stop,
      onPointerLeave: stop,
    },
  };
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  const { pressed, handlers } = usePress<HTMLButtonElement>(disabled);

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      data-pressed={pressed || undefined}
      onPointerDown={(event) => {
        handlers.onPointerDown(event);
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        handlers.onPointerUp();
        onPointerUp?.(event);
      }}
      onPointerCancel={(event) => {
        handlers.onPointerCancel();
        onPointerCancel?.(event);
      }}
      onPointerLeave={(event) => {
        handlers.onPointerLeave();
        onPointerLeave?.(event);
      }}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  const { pressed, handlers } = usePress<HTMLAnchorElement>();

  return (
    <Link
      href={href}
      {...props}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      data-pressed={pressed || undefined}
      onPointerDown={(event) => {
        handlers.onPointerDown(event);
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        handlers.onPointerUp();
        onPointerUp?.(event);
      }}
      onPointerCancel={(event) => {
        handlers.onPointerCancel();
        onPointerCancel?.(event);
      }}
      onPointerLeave={(event) => {
        handlers.onPointerLeave();
        onPointerLeave?.(event);
      }}
    />
  );
}
