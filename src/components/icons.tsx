import type { PropsWithChildren, ReactNode } from "react";
import type { ServiceKey } from "@/lib/site";

type IconProps = { className?: string };

function Frame({ children, className = "" }: PropsWithChildren<IconProps>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function SoftwareIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <rect x="5" y="6" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 26h10M16 22v4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 13l2.5 2.5L11 18M21 13l-2.5 2.5L21 18" stroke="currentColor" strokeWidth="1.4" />
    </Frame>
  );
}

export function MobileIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <rect x="10" y="4" width="12" height="24" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14 8h4M16 23.5h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Frame>
  );
}

export function MarketingIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <path d="M6 20V12l10-5v18L6 20Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16 13.5c3.2 0 6 2.2 6 6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16 17c1.6 0 3 1 3 2.8" stroke="currentColor" strokeWidth="1.4" />
    </Frame>
  );
}

export function SeoIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M19 19l6 6" stroke="currentColor" strokeWidth="1.4" />
    </Frame>
  );
}

export function CommerceIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <path
        d="M6 8h2l2.2 12h11.3l2.2-8H10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="24" r="1.5" fill="currentColor" />
      <circle cx="21" cy="24" r="1.5" fill="currentColor" />
    </Frame>
  );
}

const icons: Record<ServiceKey, (props: IconProps) => ReactNode> = {
  "software-development": SoftwareIcon,
  "mobile-apps": MobileIcon,
  "digital-marketing": MarketingIcon,
  seo: SeoIcon,
  ecommerce: CommerceIcon,
};

export function ServiceIcon({
  slug,
  className,
}: {
  slug: ServiceKey;
  className?: string;
}) {
  const Icon = icons[slug];
  return <Icon className={className} />;
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
