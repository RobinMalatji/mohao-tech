import Image from "next/image";

export function HeroVisual() {
  return (
    <div
      className="relative mx-auto grid aspect-square w-full max-w-[34rem] place-items-center"
      aria-hidden="true"
    >
      {[96, 78, 60].map((size, index) => (
        <span
          key={size}
          className="glow-ring absolute rounded-full"
          style={{
            width: `${size}%`,
            height: `${size}%`,
            animationDelay: `${index * 0.5}s`,
          }}
        />
      ))}
      <div className="relative z-10 aspect-square w-[78%] overflow-hidden rounded-[2rem] bg-black ring-1 ring-white/12">
        <Image
          src="/visuals/handshake.png"
          alt=""
          fill
          sizes="(max-width: 768px) 80vw, 28rem"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-signal/20 via-transparent to-ember/25 mix-blend-screen" />
      </div>
    </div>
  );
}
