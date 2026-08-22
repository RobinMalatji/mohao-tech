export function HeroVisual() {
  return (
    <div
      className="relative mx-auto grid aspect-square w-full max-w-[34rem] place-items-center"
      aria-hidden="true"
    >
      {[92, 74, 56, 38, 22].map((size, index) => (
        <span
          key={size}
          className="ripple absolute rounded-full bg-canvas/30"
          style={{
            width: `${size}%`,
            height: `${size}%`,
            animation: "pulse-soft 8s ease-in-out infinite",
            animationDelay: `${index * 0.4}s`,
          }}
        />
      ))}
      <span className="relative z-10 max-w-[12rem] text-center text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
        Mohao
        <span className="block text-lg font-medium tracking-[0.28em] text-muted">
          TECH
        </span>
      </span>
    </div>
  );
}
