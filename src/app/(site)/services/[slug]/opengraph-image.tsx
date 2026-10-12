import { ImageResponse } from "next/og";
import { getService, services } from "@/lib/content/services";
import { OgFrame } from "@/lib/og-frame";

export const alt = "Mohao Tech service";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServiceOpenGraphImage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);

  return new ImageResponse(
    (
      <OgFrame
        kicker="Mohao Tech services"
        title={service?.title ?? "Mohao Tech"}
        subtitle={
          service?.summary ??
          "Software, mobile apps and digital services for businesses."
        }
      />
    ),
    size,
  );
}
