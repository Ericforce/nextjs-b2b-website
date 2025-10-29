import type { SiteSettings } from "@/types";

export const siteSettings: SiteSettings = {
  _type: "siteSettings",
  siteName: "Next.js B2B Application",
  organizationName: "Next.js B2B",
  tagline: "Modern solutions for high-performing B2B teams",
  description:
    "A modern B2B application that helps enterprise teams streamline their operations and drive predictable growth.",
  locale: "en-US",
  siteUrl: "http://localhost:3000",
  contactEmail: "hello@nextjsb2b.com",
  logo: "/logo.svg",
  favicon: "/favicon.ico",
  headerNavigation: [
    {
      _type: "navigationGroup",
      title: "Main navigation",
      links: [
        {
          _type: "link",
          label: "Home",
          linkType: "external",
          url: "/",
          style: "link",
        },
        {
          _type: "link",
          label: "Products",
          linkType: "external",
          url: "/products",
          style: "link",
        },
        {
          _type: "link",
          label: "Solutions",
          linkType: "external",
          url: "/solutions",
          style: "link",
        },
        {
          _type: "link",
          label: "Pricing",
          linkType: "external",
          url: "/pricing",
          style: "link",
        },
        {
          _type: "link",
          label: "About",
          linkType: "external",
          url: "/about",
          style: "link",
        },
        {
          _type: "link",
          label: "Contact",
          linkType: "external",
          url: "/contact",
          style: "link",
        },
      ],
    },
  ],
  footerNavigation: [
    {
      _type: "navigationGroup",
      title: "Product",
      links: [
        {
          _type: "link",
          label: "Features",
          linkType: "external",
          url: "/features",
        },
        {
          _type: "link",
          label: "Integrations",
          linkType: "external",
          url: "/integrations",
        },
        {
          _type: "link",
          label: "Pricing",
          linkType: "external",
          url: "/pricing",
        },
        {
          _type: "link",
          label: "Documentation",
          linkType: "external",
          url: "/docs",
        },
      ],
    },
    {
      _type: "navigationGroup",
      title: "Company",
      links: [
        {
          _type: "link",
          label: "About Us",
          linkType: "external",
          url: "/about",
        },
        {
          _type: "link",
          label: "Careers",
          linkType: "external",
          url: "/careers",
        },
        {
          _type: "link",
          label: "Blog",
          linkType: "external",
          url: "/blog",
        },
        {
          _type: "link",
          label: "Press",
          linkType: "external",
          url: "/press",
        },
      ],
    },
    {
      _type: "navigationGroup",
      title: "Support",
      links: [
        {
          _type: "link",
          label: "Help Center",
          linkType: "external",
          url: "/help",
        },
        {
          _type: "link",
          label: "Status",
          linkType: "external",
          url: "/status",
        },
        {
          _type: "link",
          label: "Contact",
          linkType: "external",
          url: "/contact",
        },
        {
          _type: "link",
          label: "Community",
          linkType: "external",
          url: "/community",
        },
      ],
    },
    {
      _type: "navigationGroup",
      title: "Legal",
      links: [
        {
          _type: "link",
          label: "Privacy Policy",
          linkType: "external",
          url: "/privacy",
        },
        {
          _type: "link",
          label: "Terms of Service",
          linkType: "external",
          url: "/terms",
        },
        {
          _type: "link",
          label: "Cookie Policy",
          linkType: "external",
          url: "/cookies",
        },
        {
          _type: "link",
          label: "Security",
          linkType: "external",
          url: "/security",
        },
      ],
    },
  ],
  socialLinks: [
    {
      _type: "socialLink",
      platform: "twitter",
      handle: "nextjsb2b",
      url: "https://twitter.com/nextjsb2b",
    },
    {
      _type: "socialLink",
      platform: "linkedin",
      handle: "company/nextjs-b2b",
      url: "https://www.linkedin.com/company/nextjs-b2b",
    },
    {
      _type: "socialLink",
      platform: "github",
      handle: "nextjs-b2b",
      url: "https://github.com/nextjs-b2b",
    },
  ],
  defaultSeo: {
    title: "Next.js B2B Application",
    titleTemplate: "%s | Next.js B2B Application",
    description:
      "Powerful business software built with Next.js to accelerate team performance and collaboration.",
    ogTitle: "Next.js B2B Application",
    ogDescription:
      "Discover how our Next.js B2B platform empowers enterprises with collaboration, analytics, and automation.",
    ogImage: {
      _type: "image",
      url: "/og?title=Next.js%20B2B%20Application&subtitle=Modern%20solutions%20for%20enterprise%20teams",
      width: 1200,
      height: 630,
      alt: "Preview of the Next.js B2B Application",
    },
    twitterTitle: "Next.js B2B Application",
    twitterDescription:
      "Modern B2B platform for enterprises to collaborate, automate, and grow.",
  },
  updatedAt: "2024-10-15T12:00:00.000Z",
};
