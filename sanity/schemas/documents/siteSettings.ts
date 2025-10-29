import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "navigation", title: "Navigation" },
    { name: "seo", title: "SEO" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      group: "brand",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "brand",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "locale",
      title: "Locale",
      type: "string",
      group: "brand",
      description: "Locale code used for SEO (e.g. en-US).",
      initialValue: "en-US",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      group: "brand",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "imageWithAlt",
      group: "brand",
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      options: {
        accept: "image/x-icon,image/png,image/svg+xml",
      },
      group: "brand",
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
      group: "seo",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headerNavigation",
      title: "Header navigation",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      group: "navigation",
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "footerNavigation",
      title: "Footer navigation",
      type: "array",
      of: [defineArrayMember({ type: "linkGroup" })],
      group: "navigation",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      group: "contact",
      validation: (Rule) => Rule.email().warning("Enter a valid email address."),
    }),
    defineField({
      name: "contactPhone",
      title: "Contact phone",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactAddress",
      title: "Contact address",
      type: "text",
      rows: 3,
      group: "contact",
    }),
    defineField({
      name: "social",
      title: "Social links",
      type: "socialLinks",
      group: "contact",
    }),
  ],
  preview: {
    select: {
      title: "siteName",
      subtitle: "tagline",
      media: "logo",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Site settings",
        subtitle,
        media,
      };
    },
  },
});
