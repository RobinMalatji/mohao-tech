import Image from "next/image";

export function FieldBackdrop({
  src,
  opacity = 0.4,
  className = "",
}: {
  src: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ opacity }}
      />
    </div>
  );
}
