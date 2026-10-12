import type { ReactNode } from "react";

export function OgFrame({
  kicker = "Mohao Tech",
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle: string;
}): ReactNode {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#050505",
        color: "#f4f3ef",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 82% 18%, rgba(46,168,255,0.28), transparent 42%), radial-gradient(ellipse at 12% 88%, rgba(255,106,26,0.22), transparent 38%)",
        }}
      />
      <div
        style={{
          display: "flex",
          fontSize: 22,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: "rgba(244,243,239,0.62)",
        }}
      >
        {kicker}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 920 }}>
        <div
          style={{
            fontSize: title.length > 48 ? 52 : 64,
            fontWeight: 600,
            lineHeight: 1.08,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 26, color: "rgba(244,243,239,0.62)", maxWidth: 760 }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}
