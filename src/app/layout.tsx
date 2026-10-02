import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "./fonts/Inter-Variable.ttf",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});
const jetbrains = localFont({
  src: "./fonts/JetBrainsMono-Variable.ttf",
  variable: "--font-mono",
  display: "swap",
  weight: "100 900",
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const socialPreview = siteUrl ? ["/og/portfolio.webp"] : undefined;

export const metadata: Metadata = {
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } }
    : {}),
  title: {
    default: "Milan Raut — Software Developer",
    template: "%s | Milan Raut",
  },
  description:
    "Milan Raut — software developer building useful applications and digital experiences. Explore the mission archive, skill tree, and developer journey.",
  openGraph: {
    title: "Milan Raut — Software Developer",
    description: "Building digital worlds, one line at a time.",
    siteName: "Milan Raut",
    type: "website",
    ...(siteUrl ? { url: siteUrl } : {}),
    ...(socialPreview ? { images: socialPreview } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Milan Raut — Software Developer",
    description: "Building digital worlds, one line at a time.",
    ...(socialPreview ? { images: socialPreview } : {}),
  },
  icons: { icon: "/profileicon.png" },
};
export const viewport: Viewport = {
  themeColor: "#090b0f",
  colorScheme: "dark light",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable}`}>
        {children}
      </body>
    </html>
  );
}
