import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Mohao digital products: finance workbooks, design kits, Notion systems, analytics packs, guides, prompt packs, CV kits, e-commerce kits, courses, and developer tools.",
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
