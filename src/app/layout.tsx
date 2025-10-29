import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fetchSiteSettings } from "@/lib/sanity/api/page";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettings();

  return {
    title: settings?.seo?.title || settings?.title || "Next.js B2B Application",
    description:
      settings?.seo?.description ||
      settings?.description ||
      "A modern B2B application built with Next.js 14",
    keywords: settings?.seo?.keywords,
    robots: {
      index: !settings?.seo?.noindex,
      follow: !settings?.seo?.nofollow,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await fetchSiteSettings();

  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
