import { defineArrayMember, defineField, defineType } from "sanity";

import { defaultSlugify } from "../../utils/slugify";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
    { name: "metadata", title: "Metadata" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        slugify: defaultSlugify,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      group: "content",
      rows: 3,
      description: "Short summary that appears in listings and SEO.",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "imageWithAlt",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "portableText",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      group: "metadata",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      group: "metadata",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
      group: "metadata",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "tag" }] })],
      group: "metadata",
    }),
    defineField({
      name: "featured",
      title: "Featured post",
      type: "boolean",
      group: "metadata",
    }),
    defineField({
      name: "seo",
      title: "SEO overrides",
      type: "seo",
      group: "seo",
    }),
  ],
  orderings: [
    {
      name: "publishDateDesc",
      title: "Publish date, new → old",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      name: "publishDateAsc",
      title: "Publish date, old → new",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "author.name",
      media: "heroImage",
      publishedAt: "publishedAt",
    },
    prepare({ title, subtitle, media, publishedAt }) {
      return {
        title,
        subtitle: subtitle
          ? `${subtitle} • ${publishedAt ? new Date(publishedAt).toLocaleDateString() : ""}`
          : publishedAt
            ? new Date(publishedAt).toLocaleDateString()
            : undefined,
        media,
      };
    },
  },
});
