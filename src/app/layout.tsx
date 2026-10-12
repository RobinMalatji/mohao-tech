import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { OrganizationJsonLd } from "@/components/json-ld";
import { getSearchVerification } from "@/lib/seo";
import { getMetadataBaseUrl, site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = `${site.name} | ${site.tagline}`;
const verification = getSearchVerification();

export const metadata: Metadata = {
  metadataBase: new URL(getMetadataBaseUrl()),
  applicationName: site.name,
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Mohao Tech",
    "mohaotech",
    "software development",
    "mobile app development",
    "Android development",
    "iOS development",
    "digital marketing",
    "SEO",
    "e-commerce development",
    "technology solutions",
  ],
  publisher: site.name,
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(verification ? { verification } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-ZA"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="grain" aria-hidden="true" />
        <OrganizationJsonLd />
        {children}
      </body>
    </html>
  );
}
