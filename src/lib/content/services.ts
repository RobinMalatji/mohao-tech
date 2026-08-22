import type { ServiceKey } from "@/lib/site";

export type Service = {
  slug: ServiceKey;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  detail: string;
  capabilities: string[];
};

export const services: Service[] = [
  {
    slug: "software-development",
    title: "Software Development",
    shortTitle: "Software",
    summary:
      "Custom software designed around the way your business actually works.",
    description:
      "Mohao Tech develops customised software solutions shaped by business requirements, not generic templates. We design, build and maintain systems that support daily operations, customer journeys and long-term growth.",
    detail:
      "From internal business systems to customer-facing applications, we focus on software that is reliable, secure and straightforward to use. Work typically includes discovery, architecture, implementation, integration and ongoing optimisation so the product can evolve with the organisation.",
    capabilities: [
      "Custom web applications",
      "Business systems",
      "Enterprise applications",
      "API development",
      "Database-driven applications",
      "System integrations",
      "Software maintenance",
      "System optimisation",
    ],
  },
  {
    slug: "mobile-apps",
    title: "Android & iOS App Development",
    shortTitle: "Mobile Apps",
    summary:
      "Modern mobile applications for Android, iOS and cross-platform teams.",
    description:
      "Mohao Tech develops mobile applications that give customers and teams a clear, dependable experience on the devices they already use. We cover native and cross-platform delivery, with careful attention to interface design, performance and maintainability.",
    detail:
      "A mobile product is more than a store listing. We plan the product structure, connect it to your systems, and support updates after launch so the application stays current, secure and useful.",
    capabilities: [
      "Android applications",
      "iOS applications",
      "Cross-platform applications",
      "Mobile UI/UX",
      "API integration",
      "Authentication",
      "Database integration",
      "Push notifications",
      "App maintenance and updates",
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    shortTitle: "Marketing",
    summary:
      "Practical digital marketing that helps businesses become easier to find.",
    description:
      "Mohao Tech helps businesses establish and grow their digital presence with a clear plan, consistent messaging and campaigns that can be measured. The work is structured around your audience, offer and channels — not vanity activity.",
    detail:
      "We support strategy, content direction, social presence and campaign management so marketing effort stays aligned with business goals. Performance is reviewed so activity can be adjusted with evidence rather than guesswork.",
    capabilities: [
      "Digital marketing strategy",
      "Social media marketing",
      "Content strategy",
      "Online brand visibility",
      "Campaign management",
      "Digital advertising",
      "Performance monitoring",
    ],
  },
  {
    slug: "seo",
    title: "Search Engine Optimisation",
    shortTitle: "SEO",
    summary:
      "Search-focused improvements that help the right people find your website.",
    description:
      "Mohao Tech provides search engine optimisation that strengthens how your website is structured, written and technically delivered. The aim is clearer search visibility for the services and pages that matter to your business.",
    detail:
      "SEO work covers keyword direction, on-page structure, technical health, content quality and ongoing monitoring. We do not promise specific rankings. Search results change, and good SEO is a disciplined process — not a one-off trick.",
    capabilities: [
      "Search engine optimisation",
      "Keyword strategy",
      "On-page SEO",
      "Technical SEO",
      "Website performance optimisation",
      "Content optimisation",
      "Search visibility improvement",
      "SEO monitoring and reporting",
    ],
  },
  {
    slug: "ecommerce",
    title: "E-Commerce",
    shortTitle: "E-Commerce",
    summary:
      "Online stores built for catalogues, checkout and day-to-day operations.",
    description:
      "Mohao Tech builds modern e-commerce platforms that help businesses sell online with a clear catalogue, a reliable checkout and tools to manage orders. Stores are designed to work well on mobile and to connect with the rest of your operation.",
    detail:
      "An online store needs more than a product grid. We implement catalogues, carts, checkout, customer accounts and operational dashboards, then integrate payments and other systems where required. Payment providers are selected during the project based on your market and requirements.",
    capabilities: [
      "Online stores",
      "Product catalogues",
      "Shopping carts",
      "Checkout systems",
      "Payment integration",
      "Customer accounts",
      "Order management",
      "Inventory management",
      "E-commerce dashboards",
      "Mobile-responsive shopping experiences",
      "API integrations",
    ],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getServiceLabel(slug: string) {
  return getService(slug)?.title ?? slug;
}
