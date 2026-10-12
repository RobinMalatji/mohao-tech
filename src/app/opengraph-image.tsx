import { ImageResponse } from "next/og";
import { OgFrame } from "@/lib/og-frame";

export const alt =
  "Mohao Tech — software, mobile apps, SEO and e-commerce services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        title="Software, mobile apps and digital services"
        subtitle="Custom software, websites, Android and iOS apps, SEO and e-commerce stores."
      />
    ),
    size,
  );
}
