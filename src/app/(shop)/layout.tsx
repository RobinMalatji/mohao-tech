import { ShopShell } from "@/components/shop/shop-shell";

export default function ShopGroupLayout({ children }: { children: React.ReactNode }) {
  return <ShopShell>{children}</ShopShell>;
}
