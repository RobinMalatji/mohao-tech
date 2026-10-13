import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/shop": ["./products/library/**/internal/meta.json"],
    "/shop/p/*": [
      "./products/library/**/internal/meta.json",
      "./products/library/**/customer/**/*.md",
      "./products/library/**/customer/**/*.csv",
      "./products/library/**/customer/**/*.svg",
      "./products/library/**/customer/**/*.mjs",
      "./products/library/**/customer/**/*.xlsx",
      "./products/library/**/customer/**/*.dax",
    ],
    "/shop/previews/*": ["./products/library/**/customer/designs/*.svg"],
    "/shop/previews/*/*": ["./products/library/**/customer/designs/*.svg"],
    "/shop/c/*": ["./products/library/**/internal/meta.json"],
    "/shop/search": ["./products/library/**/internal/meta.json"],
    "/shop/cart": ["./products/library/**/internal/meta.json"],
    "/shop/covers/*": ["./products/library/**/customer/preview/cover.png"],
    "/admin/shop": ["./products/library/**/internal/meta.json"],
    "/admin/shop/products": ["./products/library/**/internal/meta.json"],
    "/admin/shop/products/new": ["./products/library/**/internal/meta.json"],
    "/admin/shop/products/*/edit": ["./products/library/**/internal/meta.json"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
