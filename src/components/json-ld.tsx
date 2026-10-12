import type { Service, ServiceFaq } from "@/lib/content/services";
import { services } from "@/lib/content/services";
import { absoluteUrl, type BreadcrumbItem } from "@/lib/seo";
import { canonicalSiteUrl, site } from "@/lib/site";

export const organizationId = `${canonicalSiteUrl}/#organization`;
export const websiteId = `${canonicalSiteUrl}/#website`;

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

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
        knowsAbout: [
          ...services.map((service) => service.title),
          "Websites",
          "Web applications",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Mohao Tech services",
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title,
              url: absoluteUrl(`/services/${service.slug}`),
            },
          })),
        },
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

  return <JsonLd data={jsonLd} />;
}

export function OfferCatalogJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Mohao Tech services",
    url: absoluteUrl("/services"),
    provider: {
      "@type": "Organization",
      "@id": organizationId,
      name: site.name,
    },
    itemListElement: services.map((service, index) => ({
      "@type": "Offer",
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        url: absoluteUrl(`/services/${service.slug}`),
        provider: { "@id": organizationId },
      },
    })),
  };

  return <JsonLd data={jsonLd} />;
}

export function ServiceJsonLd({ service }: { service: Service }) {
  const url = absoluteUrl(`/services/${service.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      "@id": organizationId,
      name: site.name,
      url: canonicalSiteUrl,
    },
    url,
    mainEntityOfPage: url,
  };

  return <JsonLd data={jsonLd} />;
}

export function FaqJsonLd({ faqs }: { faqs: ServiceFaq[] }) {
  if (faqs.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={jsonLd} />;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };

  return <JsonLd data={jsonLd} />;
}
