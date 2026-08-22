import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f4f3ef",
          color: "#0b0b0b",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase" }}>
          Mohao Tech
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.05, maxWidth: 860 }}>
            Technology. Digital Solutions. Business Growth.
          </div>
          <div style={{ fontSize: 26, color: "#5f5e58", maxWidth: 720 }}>
            Software, mobile applications and digital systems for modern businesses.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
