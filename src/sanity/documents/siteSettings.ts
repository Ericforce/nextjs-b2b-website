import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "locale",
      title: "Locale",
      type: "string",
      initialValue: "en_US",
    }),
    defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "email",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      options: {
        accept: "image/png,image/x-icon,image/vnd.microsoft.icon",
      },
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
    }),
    defineField({
      name: "mainNavigation",
      title: "Main Navigation",
      type: "array",
      of: [{ type: "navigationLink" }],
    }),
    defineField({
      name: "secondaryNavigation",
      title: "Secondary Navigation",
      type: "array",
      of: [{ type: "navigationLink" }],
    }),
    defineField({
      name: "headerCTA",
      title: "Header CTA",
      type: "callToAction",
    }),
    defineField({
      name: "footerSections",
      title: "Footer Sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [{ type: "navigationLink" }],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "socialLinks",
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "text",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Site Settings",
    }),
  },
});
