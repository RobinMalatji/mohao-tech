import Image from "next/image";
import { Reveal } from "@/components/reveal";

const statements = [
  {
    word: "MISSION",
    label: "Our mission",
    tone: "signal" as const,
    body: "Provide digital and software solutions that help businesses work with greater clarity, reliability and reach.",
  },
  {
    word: "VISION",
    label: "Our vision",
    tone: "flare" as const,
    body: "Technology that is reliable, clear and useful — software, applications and digital systems that support ordinary working days, not only launch day.",
  },
  {
    word: "VALUES",
    label: "Our values",
    tone: "ember" as const,
    body: "Professional delivery, modern tools used where they serve the product, and business-first thinking. Security, performance and clarity guide the work.",
  },
  {
    word: "GOALS",
    label: "Our goals",
    tone: "signal" as const,
    body: "Design, build and improve the systems that support customers, teams and growth — custom software, mobile applications, digital marketing, SEO and e-commerce.",
  },
];

export function StatementBand() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] px-5 py-20 text-canvas sm:px-8 sm:py-24">
      <Image
        src="/visuals/flowing-ribbons.gif"
        alt=""
        fill
        unoptimized
        sizes="100vw"
        className="pointer-events-none object-cover object-center opacity-25 mix-blend-screen motion-reduce:hidden"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 0%, color-mix(in srgb, var(--signal) 22%, transparent), transparent 46%), radial-gradient(ellipse at 90% 80%, color-mix(in srgb, var(--ember) 18%, transparent), transparent 40%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="accent-kicker text-canvas/55">How we work</p>
        </Reveal>
        <div className="mt-12 space-y-12 sm:space-y-16">
          {statements.map((item, index) => (
            <Reveal key={item.word} delay={index * 70}>
              <article
                className="statement-row grid items-center gap-5 sm:grid-cols-[minmax(0,0.9fr)_1.1fr] sm:gap-10"
                style={{ marginLeft: `${Math.min(index, 3) * 4}%` }}
              >
                <h2
                  className="extrude-word text-4xl sm:text-5xl lg:text-6xl"
                  data-tone={item.tone}
                >
                  {item.word}
                </h2>
                <div className="max-w-md">
                  <p className="text-[0.72rem] font-medium uppercase tracking-[0.2em] text-canvas">
                    <span
                      className="accent-underline"
                      data-tone={item.tone}
                    >
                      {item.label}
                    </span>
                  </p>
                  <p className="mt-3 text-sm leading-7 text-canvas/62">
                    {item.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
