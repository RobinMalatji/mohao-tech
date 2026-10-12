import type { ServiceKey } from "@/lib/site";

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type Service = {
  slug: ServiceKey;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  heading: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  detail: string;
  audience: string;
  outcomesIntro: string;
  capabilities: string[];
  faqs: ServiceFaq[];
  related: ServiceKey[];
};

export const services: Service[] = [
  {
    slug: "software-development",
    title: "Software Development",
    shortTitle: "Software",
    summary:
      "Custom software designed around the way your business actually works.",
    heading: "Custom software development for websites and business systems",
    seoTitle: "Custom Software Development",
    seoDescription:
      "Mohao Tech designs and builds custom software, web applications and business systems around how your organisation actually works — including websites, APIs and ongoing maintenance.",
    keywords: [
      "custom software development",
      "web applications",
      "websites",
      "business systems",
      "API development",
    ],
    description:
      "Mohao Tech develops customised software solutions shaped by business requirements, not generic templates. We design, build and maintain systems that support daily operations, customer journeys and long-term growth.",
    detail:
      "From internal business systems to customer-facing applications, we focus on software that is reliable, secure and straightforward to use. Work typically includes discovery, architecture, implementation, integration and ongoing optimisation so the product can evolve with the organisation. Public websites and web applications sit in this service when they need to be designed and maintained as software rather than a disposable template.",
    audience:
      "This service is for organisations that need software shaped around their process: a new product, an existing system that needs attention, a public website that must do more than look finished, or tools that have to connect to work already in place.",
    outcomesIntro:
      "A typical software engagement covers the build and the work that keeps the system useful after launch.",
    capabilities: [
      "Custom web applications",
      "Public websites and customer portals",
      "Business systems",
      "Enterprise applications",
      "API development",
      "Database-driven applications",
      "System integrations",
      "Software maintenance",
      "System optimisation",
    ],
    faqs: [
      {
        question: "What kind of software does Mohao Tech build?",
        answer:
          "Custom web applications, public websites, business systems, enterprise applications, APIs and database-driven software. Each engagement is scoped from the requirement in front of us — not from a fixed product catalogue.",
      },
      {
        question: "Do you build websites as well as internal systems?",
        answer:
          "Yes. Websites and web applications are part of software development when they need to be designed, built and maintained properly. That includes public sites, customer portals and internal tools.",
      },
      {
        question: "How does a software project typically start?",
        answer:
          "Discovery comes first: the business requirement, the people who will use the system, and the outcome that matters. Then we design, implement and support the solution with a focus on security, performance and clarity.",
      },
      {
        question: "Can you work with systems we already have?",
        answer:
          "Yes. Capabilities include API development, database-driven applications, system integrations, maintenance and optimisation. Existing systems are treated as part of the landscape, not something to ignore.",
      },
    ],
    related: ["mobile-apps", "ecommerce", "seo"],
  },
  {
    slug: "mobile-apps",
    title: "Android & iOS App Development",
    shortTitle: "Mobile Apps",
    summary:
      "Modern mobile applications for Android, iOS and cross-platform teams.",
    heading: "Android and iOS app development",
    seoTitle: "Android & iOS App Development",
    seoDescription:
      "Mohao Tech develops Android, iOS and cross-platform mobile applications with attention to interface design, performance, system integration and updates after launch.",
    keywords: [
      "mobile app development",
      "Android app development",
      "iOS app development",
      "cross-platform apps",
    ],
    description:
      "Mohao Tech develops mobile applications that give customers and teams a clear, dependable experience on the devices they already use. We cover native and cross-platform delivery, with careful attention to interface design, performance and maintainability.",
    detail:
      "A mobile product is more than a store listing. We plan the product structure, connect it to your systems, and support updates after launch so the application stays current, secure and useful. Apps are often paired with custom software or an e-commerce platform when the same organisation needs a website, operations tools and a mobile channel.",
    audience:
      "This service is for businesses that need a mobile application for customers or staff — a new Android or iOS product, a cross-platform app, or an existing application that needs integration, authentication or ongoing updates.",
    outcomesIntro:
      "Mobile work covers the product on the device and the connections that make it useful day to day.",
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
    faqs: [
      {
        question: "Do you build both Android and iOS apps?",
        answer:
          "Yes. Mohao Tech develops Android applications, iOS applications and cross-platform applications. The approach depends on the product, the audience and how the app needs to be maintained.",
      },
      {
        question: "Can a mobile app connect to systems we already use?",
        answer:
          "Yes. Capabilities include API integration, authentication, database integration and push notifications. The app is planned as part of your wider software landscape, not as a disconnected listing.",
      },
      {
        question: "What happens after the app launches?",
        answer:
          "A mobile product needs updates after launch. We support maintenance so the application can stay current, secure and useful rather than being handed over once and left to age.",
      },
      {
        question: "Do you also build the website or backend behind the app?",
        answer:
          "Often, yes. Custom software development covers web applications, APIs and business systems that a mobile app may need to talk to. Related services can be scoped together when that is what the product requires.",
      },
    ],
    related: ["software-development", "ecommerce", "seo"],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    shortTitle: "Marketing",
    summary:
      "Practical digital marketing that helps businesses become easier to find.",
    heading: "Digital marketing for businesses that need to be found",
    seoTitle: "Digital Marketing Services",
    seoDescription:
      "Mohao Tech plans and runs practical digital marketing — strategy, content direction, social presence and campaigns that can be measured against your audience and offer.",
    keywords: [
      "digital marketing",
      "digital marketing services",
      "social media marketing",
      "campaign management",
    ],
    description:
      "Mohao Tech helps businesses establish and grow their digital presence with a clear plan, consistent messaging and campaigns that can be measured. The work is structured around your audience, offer and channels — not vanity activity.",
    detail:
      "We support strategy, content direction, social presence and campaign management so marketing effort stays aligned with business goals. Performance is reviewed so activity can be adjusted with evidence rather than guesswork. Search engine optimisation is a related service when the website itself needs stronger structure and technical health; marketing here is the plan, the message and the campaigns around that presence.",
    audience:
      "This service is for businesses that already have something to offer and need a clearer digital presence: a plan for channels, content that matches the offer, social activity that can be sustained, or campaigns that should be reviewed against results.",
    outcomesIntro:
      "Marketing work is scoped around the audience, the offer and the channels that actually matter.",
    capabilities: [
      "Digital marketing strategy",
      "Social media marketing",
      "Content strategy",
      "Online brand visibility",
      "Campaign management",
      "Digital advertising",
      "Performance monitoring",
    ],
    faqs: [
      {
        question: "What does digital marketing include at Mohao Tech?",
        answer:
          "Strategy, content direction, social media marketing, online brand visibility, campaign management, digital advertising and performance monitoring. The mix depends on your audience, offer and channels — not a fixed package of vanity activity.",
      },
      {
        question: "How is the work measured?",
        answer:
          "Performance is reviewed so activity can be adjusted with evidence rather than guesswork. We do not treat impressions or unfocused posting as a substitute for a plan tied to business goals.",
      },
      {
        question: "Is SEO included in digital marketing?",
        answer:
          "Search engine optimisation is a related Mohao Tech service with its own focus: how the website is structured, written and technically delivered. Marketing and SEO are often planned together, but SEO is not treated as a slogan added to a campaign.",
      },
      {
        question: "Do you need an existing website before marketing starts?",
        answer:
          "A clear website or store makes marketing more useful, because campaigns then have somewhere honest to send people. If the site itself needs work, software development, e-commerce or SEO can be scoped alongside marketing.",
      },
    ],
    related: ["seo", "ecommerce", "software-development"],
  },
  {
    slug: "seo",
    title: "Search Engine Optimisation",
    shortTitle: "SEO",
    summary:
      "Search-focused improvements that help the right people find your website.",
    heading: "Search engine optimisation for websites",
    seoTitle: "Search Engine Optimisation (SEO)",
    seoDescription:
      "Mohao Tech provides on-page and technical SEO so your website is clearer to search engines and to the people looking for your services. We do not promise specific rankings.",
    keywords: [
      "search engine optimisation",
      "SEO services",
      "on-page SEO",
      "technical SEO",
      "content optimisation",
    ],
    description:
      "Mohao Tech provides search engine optimisation that strengthens how your website is structured, written and technically delivered. The aim is clearer search visibility for the services and pages that matter to your business.",
    detail:
      "SEO work covers keyword direction, on-page structure, technical health, content quality and ongoing monitoring. We do not promise specific rankings. Search results change, and good SEO is a disciplined process — not a one-off trick. Competitive terms take time, crawls and genuine pages; brand searches for a name such as Mohao Tech usually move faster than generic industry queries.",
    audience:
      "This service is for businesses that already have a website — or are building one — and need that site to be clearer to search engines: service pages that match real enquiries, technical issues that get in the way, or content that should describe the offer accurately.",
    outcomesIntro:
      "SEO is a process of structure, content and technical health, reviewed over time.",
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
    faqs: [
      {
        question: "Do you guarantee first-page rankings?",
        answer:
          "No. Mohao Tech does not promise specific rankings, first-page results or a position against any competitor. Search results change. SEO is a disciplined process of structure, content and technical health — not a ranking product.",
      },
      {
        question: "What does SEO work actually include?",
        answer:
          "Keyword direction, on-page structure, technical health, website performance, content quality and ongoing monitoring. The aim is clearer visibility for the services and pages that matter to the business.",
      },
      {
        question: "How long does SEO take?",
        answer:
          "Search visibility usually changes over weeks and months, not overnight. Competitive queries take longer still. Brand searches for your name tend to move faster than generic industry terms. Results depend on the website, the market and what other sites publish.",
      },
      {
        question: "Can SEO be combined with a new website or online store?",
        answer:
          "Yes. Software development and e-commerce work can be planned so pages, titles and structure are fit for search from the start. Digital marketing is the related service when campaigns and social presence need to sit alongside the website.",
      },
    ],
    related: ["digital-marketing", "software-development", "ecommerce"],
  },
  {
    slug: "ecommerce",
    title: "E-Commerce",
    shortTitle: "E-Commerce",
    summary:
      "Online stores built for catalogues, checkout and day-to-day operations.",
    heading: "E-commerce websites and online stores",
    seoTitle: "E-Commerce Websites",
    seoDescription:
      "Mohao Tech builds e-commerce websites with product catalogues, carts, checkout, customer accounts and order tools. Payment providers are selected during the project for your market.",
    keywords: [
      "e-commerce websites",
      "online store development",
      "product catalogues",
      "checkout systems",
      "e-commerce",
    ],
    description:
      "Mohao Tech builds modern e-commerce platforms that help businesses sell online with a clear catalogue, a reliable checkout and tools to manage orders. Stores are designed to work well on mobile and to connect with the rest of your operation.",
    detail:
      "An online store needs more than a product grid. We implement catalogues, carts, checkout, customer accounts and operational dashboards, then integrate payments and other systems where required. Payment providers are selected during the project based on your market and requirements. Related software, marketing and SEO work can be scoped when the store also needs a wider website, campaigns or search-focused pages.",
    audience:
      "This service is for businesses that need to sell online: a first store, a catalogue that has outgrown a simple brochure site, or an existing shop that needs a clearer checkout, order tools or a mobile-responsive shopping experience.",
    outcomesIntro:
      "An e-commerce build covers the storefront people use and the operations behind it.",
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
    faqs: [
      {
        question: "What does an e-commerce project include?",
        answer:
          "Online stores with product catalogues, shopping carts, checkout, customer accounts, order management, inventory tools and dashboards. Stores are designed to work well on mobile and to connect with other systems where required.",
      },
      {
        question: "Which payment providers do you use?",
        answer:
          "Payment providers are selected during the project based on your market and requirements. Mohao Tech does not lock the store to a single unnamed processor on this page.",
      },
      {
        question: "Can the store connect to software we already use?",
        answer:
          "Yes. Capabilities include API integrations, customer accounts, order management and inventory management. Custom software development is the related service when the store needs a wider business system behind it.",
      },
      {
        question: "Do you also help people find the store in search?",
        answer:
          "Search engine optimisation is a related service for structure, content and technical health. Digital marketing covers campaigns and presence around the store. Neither is a promise of a ranking or a sales figure.",
      },
    ],
    related: ["software-development", "digital-marketing", "seo"],
  },
];

export const servicesHub = {
  seoTitle: "Software, Apps, SEO and E-Commerce",
  seoDescription:
    "Mohao Tech services: custom software and websites, Android and iOS apps, digital marketing, search engine optimisation, and e-commerce stores. Each can stand alone or form part of a wider programme.",
  heading: "Software, mobile and digital services for growing businesses.",
  intro:
    "Mohao Tech focuses on five core services: custom software development (including websites and web applications), Android and iOS apps, digital marketing, search engine optimisation, and e-commerce. Each can stand alone or form part of a broader digital programme.",
  keywords: [
    "software development services",
    "mobile app development",
    "digital marketing",
    "SEO services",
    "e-commerce websites",
  ],
  faqs: [
    {
      question: "What services does Mohao Tech provide?",
      answer:
        "Custom software development, Android and iOS app development, digital marketing, search engine optimisation, and e-commerce websites. Websites and web applications sit inside software development; online stores sit inside e-commerce.",
    },
    {
      question: "Can more than one service be scoped together?",
      answer:
        "Yes. A product might need a website, a mobile app and SEO on the same pages. An online store might need marketing after launch. Each service still has a clear job; they are combined when the requirement actually spans them.",
    },
    {
      question: "How do we start a project?",
      answer:
        "Send an enquiry with the service you need and a short description of the work. Mohao Tech reviews the message and follows up with a clear next step. Discovery comes before build.",
    },
    {
      question: "Do you publish rankings, client lists or pricing here?",
      answer:
        "No. This site describes the services as they are delivered. It does not list invented awards, client logos, guaranteed rankings or a public price list. Project scope is discussed from the enquiry.",
    },
  ] satisfies ServiceFaq[],
};

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getServiceLabel(slug: string) {
  return getService(slug)?.title ?? slug;
}

export function getRelatedServices(slug: string) {
  const service = getService(slug);
  if (!service) return [];
  return service.related
    .map((relatedSlug) => getService(relatedSlug))
    .filter((related): related is Service => Boolean(related));
}

export function servicePath(slug: string) {
  return `/services/${slug}`;
}
