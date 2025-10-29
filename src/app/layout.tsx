import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getMetadataDefaults } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getMetadataDefaults();
  return metadata;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-secondary-900 antialiased">
        {children}
      </body>
    </html>
  );
}
