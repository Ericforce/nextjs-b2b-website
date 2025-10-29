import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) =>
        Rule.max(60).warning(
          "Longer titles may be truncated in search results"
        ),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.max(160).warning(
          "Longer descriptions may be truncated in search results"
        ),
    }),
    defineField({
      name: "titleTemplate",
      title: "Title Template",
      type: "string",
      description: "Template for page titles. Use %s for the page title",
      initialValue: "%s | Site Name",
    }),
    defineField({
      name: "canonical",
      title: "Canonical URL",
      type: "url",
    }),
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      description: "Prevent search engines from indexing this page",
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "ogTitle",
      title: "Open Graph Title",
      type: "string",
      description:
        "Title for social media sharing (defaults to SEO title if empty)",
    }),
    defineField({
      name: "ogDescription",
      title: "Open Graph Description",
      type: "text",
      rows: 3,
      description:
        "Description for social media sharing (defaults to SEO description if empty)",
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
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
      description: "Image for social media sharing (recommended: 1200x630px)",
    }),
    defineField({
      name: "twitterTitle",
      title: "Twitter Title",
      type: "string",
      description:
        "Title for Twitter cards (defaults to Open Graph title if empty)",
    }),
    defineField({
      name: "twitterDescription",
      title: "Twitter Description",
      type: "text",
      rows: 3,
      description:
        "Description for Twitter cards (defaults to Open Graph description if empty)",
    }),
    defineField({
      name: "twitterImage",
      title: "Twitter Image",
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
      description: "Image for Twitter cards (recommended: 1200x600px)",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "SEO Settings",
    }),
  },
});
