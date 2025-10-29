import { defineArrayMember, defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO metadata",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "SEO title",
      type: "string",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "titleTemplate",
      title: "Title template",
      type: "string",
      description: "Optional template such as %s | Brand.",
    }),
    defineField({
      name: "description",
      title: "SEO description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "canonical",
      title: "Canonical URL",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"], allowRelative: false }).warning(
          "Provide a valid canonical URL or leave blank.",
        ),
    }),
    defineField({
      name: "noIndex",
      title: "No index",
      type: "boolean",
      initialValue: false,
      description: "Prevent search engines from indexing this page.",
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "ogTitle",
      title: "Open Graph title",
      type: "string",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "ogDescription",
      title: "Open Graph description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "twitterTitle",
      title: "Twitter title",
      type: "string",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "twitterDescription",
      title: "Twitter description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "twitterImage",
      title: "Twitter image",
      type: "imageWithAlt",
    }),
  ],
});
