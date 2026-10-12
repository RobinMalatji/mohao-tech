import { canonicalSiteUrl, site } from "@/lib/site";
import { services } from "@/lib/content/services";

const organizationId = `${canonicalSiteUrl}/#organization`;
const websiteId = `${canonicalSiteUrl}/#website`;

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: site.name,
        alternateName: [site.alternateName, "MohaoTech"],
        url: canonicalSiteUrl,
        description: site.description,
        logo: {
          "@type": "ImageObject",
          url: `${canonicalSiteUrl}/apple-icon`,
          width: 180,
          height: 180,
        },
        knowsAbout: services.map((service) => service.title),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: site.name,
        alternateName: site.alternateName,
        url: canonicalSiteUrl,
        inLanguage: "en-ZA",
        publisher: { "@id": organizationId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      "@id": organizationId,
      name: site.name,
      url: canonicalSiteUrl,
    },
    url: `${canonicalSiteUrl}${path}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
