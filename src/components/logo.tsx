import Link from "next/link";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3 ${inverted ? "text-canvas" : "text-ink"}`}
      aria-label="Mohao Tech home"
    >
      <span
        className={`grid h-9 w-9 place-items-center rounded-full border text-[0.7rem] font-semibold tracking-[0.18em] ${
          inverted ? "border-canvas/25" : "border-ink/15"
        }`}
        aria-hidden="true"
      >
        M
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[0.95rem] font-semibold tracking-[-0.03em]">
          Mohao Tech
        </span>
        <span
          className={`mt-1 text-[0.62rem] uppercase tracking-[0.22em] ${
            inverted ? "text-canvas/55" : "text-muted"
          }`}
        >
          Digital studio
        </span>
      </span>
    </Link>
  );
}
