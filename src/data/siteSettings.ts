import type { SiteSettings } from "@/types";

export const siteSettings: SiteSettings = {
  siteName: "Next.js B2B Application",
  description:
    "A modern B2B application that helps enterprise teams streamline their operations and drive predictable growth.",
  locale: "en_US",
  siteUrl: "http://localhost:3000",
  email: "hello@nextjsb2b.com",
  favicon: "/favicon.ico",
  logo: "/logo.svg",
  updatedAt: "2024-10-15T12:00:00.000Z",
  defaultSeo: {
    title: "Next.js B2B Application",
    titleTemplate: "%s | Next.js B2B Application",
    description:
      "Powerful business software built with Next.js to accelerate team performance and collaboration.",
    ogTitle: "Next.js B2B Application",
    ogDescription:
      "Discover how our Next.js B2B platform empowers enterprises with collaboration, analytics, and automation.",
    ogImage: {
      url: "/og?title=Next.js%20B2B%20Application&subtitle=Modern%20solutions%20for%20enterprise%20teams",
      width: 1200,
      height: 630,
      alt: "Preview of the Next.js B2B Application",
    },
    twitterTitle: "Next.js B2B Application",
    twitterDescription:
      "Modern B2B platform for enterprises to collaborate, automate, and grow.",
  },
  social: {
    twitter: "nextjsb2b",
    linkedin: "company/nextjs-b2b",
    github: "nextjs-b2b",
  },
};
