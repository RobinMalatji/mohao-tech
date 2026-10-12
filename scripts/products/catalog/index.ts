import { analyticsProducts } from "./analytics";
import { courseProducts } from "./courses";
import { cvProducts } from "./cv";
import { designProducts } from "./design";
import { developerProducts } from "./dev";
import { ebookProducts } from "./ebooks";
import { ecommerceProducts } from "./ecommerce";
import { financeProducts } from "./finance";
import { notionProducts } from "./notion";
import { promptProducts } from "./prompts";
import type { ProductDefinition } from "../types";

export async function allProducts(): Promise<ProductDefinition[]> {
  return [
    ...(await financeProducts()),
    ...(await designProducts()),
    ...notionProducts(),
    ...(await analyticsProducts()),
    ...(await ebookProducts()),
    ...promptProducts(),
    ...(await cvProducts()),
    ...(await ecommerceProducts()),
    ...(await courseProducts()),
    ...developerProducts(),
  ];
}
