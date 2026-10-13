export const shopCategories = [
  { category: "finance", slug: "personal-finance", label: "Personal finance" },
  { category: "design", slug: "design-templates", label: "Design templates" },
  { category: "notion", slug: "notion-systems", label: "Notion systems" },
  { category: "analytics", slug: "analytics-dashboards", label: "Analytics dashboards" },
  { category: "ebooks", slug: "guides", label: "Guides" },
  { category: "prompts", slug: "ai-prompt-packs", label: "AI prompt packs" },
  { category: "cv", slug: "cv-kits", label: "CV kits" },
  { category: "ecommerce", slug: "ecommerce-kits", label: "E-commerce kits" },
  { category: "courses", slug: "courses", label: "Courses" },
  { category: "developer", slug: "developer-products", label: "Developer products" },
] as const;

export type ShopCategoryChoice = (typeof shopCategories)[number];

export function categoryBySlug(slug: string) {
  return shopCategories.find((category) => category.slug === slug) ?? null;
}
