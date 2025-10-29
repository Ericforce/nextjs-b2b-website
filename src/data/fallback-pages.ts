import type { SanityPage, Section } from "@/types/sanity";

export const heroSection: Section = {
  _key: "hero-section",
  sectionType: "hero",
  eyebrow: "Modern B2B Solutions",
  heading: "Modern B2B Solutions for Growing Businesses",
  description:
    "Streamline your operations, enhance collaboration, and drive growth with our comprehensive suite of business tools designed for modern enterprises.",
  ctas: [
    { label: "Get started for free", href: "/signup", variant: "primary" },
    { label: "Request demo", href: "/demo", variant: "outline" },
  ],
};

export const featuresSection: Section = {
  _key: "feature-grid-section",
  sectionType: "featureGrid",
  title: "Everything you need to succeed",
  description:
    "Powerful features designed to help your business thrive in the modern marketplace.",
  features: [
    {
      _key: "feature-analytics",
      title: "Advanced Analytics",
      description:
        "Get deep insights into your business with powerful analytics and reporting tools.",
    },
    {
      _key: "feature-collaboration",
      title: "Team Collaboration",
      description:
        "Work seamlessly with your team using our integrated collaboration features.",
    },
    {
      _key: "feature-security",
      title: "Security First",
      description:
        "Enterprise-grade security to keep your data safe and compliant.",
    },
    {
      _key: "feature-api",
      title: "API Access",
      description:
        "Integrate with your existing tools using our comprehensive REST API.",
    },
    {
      _key: "feature-support",
      title: "24/7 Support",
      description:
        "Get help whenever you need it from our dedicated support team.",
    },
    {
      _key: "feature-scalable",
      title: "Scalable Infrastructure",
      description:
        "Grow your business without worrying about performance or reliability.",
    },
  ],
};

export const ctaSection: Section = {
  _key: "cta-section",
  sectionType: "callToAction",
  title: "Ready to get started?",
  description:
    "Join thousands of businesses already using our platform to streamline their operations.",
  primaryCta: {
    label: "Start your free trial",
    href: "/signup",
    variant: "primary",
  },
};

export const fallbackPageData: Record<string, SanityPage> = {
  index: {
    title: "Home",
    slug: "index",
    seo: {
      title: "Next.js B2B Application",
      description: "A modern B2B application built with Next.js 14",
    },
    sections: [heroSection, featuresSection, ctaSection],
  },
};
