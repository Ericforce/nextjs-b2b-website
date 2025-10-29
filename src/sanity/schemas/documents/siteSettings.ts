import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const singletonInitialValue = {
  siteName: "Next.js B2B Application",
  organizationName: "Next.js B2B",
  tagline: "Modern solutions for high-performing B2B teams",
  description:
    "A modern B2B application that helps enterprise teams streamline their operations and drive predictable growth.",
  locale: "en-US",
  siteUrl: "https://www.nextjs-b2b.io",
  contactEmail: "hello@nextjsb2b.com",
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
        },
        {
          _type: "link",
          label: "Solutions",
          linkType: "external",
          url: "/solutions",
        },
        {
          _type: "link",
          label: "Pricing",
          linkType: "external",
          url: "/pricing",
        },
        {
          _type: "link",
          label: "Blog",
          linkType: "external",
          url: "/blog",
        },
        {
          _type: "link",
          label: "Contact",
          linkType: "external",
          url: "/contact",
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
          label: "About",
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
          label: "Press",
          linkType: "external",
          url: "/press",
        },
        {
          _type: "link",
          label: "Contact",
          linkType: "external",
          url: "/contact",
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
    _type: "seo",
    title: "Next.js B2B Application",
    titleTemplate: "%s | Next.js B2B Application",
    description:
      "Powerful business software built with Next.js to accelerate team performance and collaboration.",
    ogTitle: "Next.js B2B Application",
    ogDescription:
      "Discover how our Next.js B2B platform empowers enterprises with collaboration, analytics, and automation.",
    twitterTitle: "Next.js B2B Application",
    twitterDescription:
      "Modern B2B platform for enterprises to collaborate, automate, and grow.",
  },
};

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "branding", title: "Branding" },
    { name: "navigation", title: "Navigation" },
    { name: "social", title: "Social" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      group: "branding",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "organizationName",
      title: "Organization name",
      type: "string",
      group: "branding",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "branding",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "branding",
    }),
    defineField({
      name: "locale",
      title: "Default locale",
      type: "string",
      group: "branding",
      initialValue: "en-US",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z]{2,3}(-[A-Z]{2})?$/, {
            name: "locale",
          })
          .error("Use locale format such as en-US"),
    }),
    defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      group: "branding",
      validation: (rule) =>
        rule
          .required()
          .uri({ allowRelative: false, scheme: ["http", "https"] }),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      group: "branding",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "branding",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      group: "branding",
      options: { hotspot: true },
      description: "Upload a square image (32x32 recommended).",
    }),
    defineField({
      name: "headerNavigation",
      title: "Primary navigation",
      type: "array",
      group: "navigation",
      of: [defineArrayMember({ type: "navigationGroup" })],
      validation: (rule) => rule.min(1).error("Add at least one navigation group"),
    }),
    defineField({
      name: "footerNavigation",
      title: "Footer navigation",
      type: "array",
      group: "navigation",
      of: [defineArrayMember({ type: "navigationGroup" })],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "social",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
      group: "seo",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Last updated",
      type: "datetime",
      readOnly: true,
      group: "seo",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "siteName",
      subtitle: "siteUrl",
    },
    prepare({ title, subtitle }) {
      return {
        title: title ?? "Site settings",
        subtitle,
      };
    },
  },
  initialValue: singletonInitialValue,
});
