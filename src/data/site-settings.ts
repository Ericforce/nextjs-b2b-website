import {
  footerSections as fallbackFooterSections,
  navigationItems as fallbackNavigationItems,
  socialLinks as fallbackSocialLinks,
} from "@/data/navigation";
import type { SanityReusableSection, SanitySiteSettings } from "@/types/sanity";

export const fallbackSiteSettings: SanitySiteSettings = {
  title: "Next.js B2B Application",
  description: "A modern B2B application built with Next.js 14",
  branding: {
    name: "B2B App",
    href: "/",
    tagline: "Modern solutions for growing businesses",
  },
  navigation: {
    items: fallbackNavigationItems,
    cta: {
      label: "Get Started",
      href: "/signup",
      variant: "primary",
    },
  },
  footer: {
    sections: fallbackFooterSections,
    social: fallbackSocialLinks,
    copyright: `© ${new Date().getFullYear()} B2B App. All rights reserved.`,
    description:
      "Building the future of B2B solutions with modern technology and innovative approaches.",
  },
  seo: {
    title: "Next.js B2B Application",
    description: "A modern B2B application built with Next.js 14",
  },
};

export const fallbackReusableSections: Record<string, SanityReusableSection> =
  {};
