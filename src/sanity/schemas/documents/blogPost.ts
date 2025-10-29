import { ComposeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  icon: ComposeIcon,
  groups: [
    { name: "content", title: "Content" },
    { name: "taxonomy", title: "Taxonomy" },
    { name: "seo", title: "SEO" },
    { name: "metadata", title: "Metadata" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "metadata",
      options: {
        source: "title",
        slugify: (value) =>
          value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 4,
      group: "content",
      validation: (rule) =>
        rule
          .required()
          .max(240)
          .warning("Keep the summary concise for cards and previews"),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "readingTime",
      title: "Reading time (minutes)",
      type: "number",
      group: "content",
      validation: (rule) => rule.min(1).max(60),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "taxonomy",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "category" }],
          options: { disableNew: true },
        }),
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "taxonomy",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "tag" }],
          options: { disableNew: true },
        }),
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      group: "metadata",
      to: [{ type: "author" }],
      options: { disableNew: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "relatedPosts",
      title: "Related posts",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "blogPost" }],
          options: { disableNew: true, weak: true },
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO overrides",
      type: "seo",
      group: "seo",
    }),
    defineField({
      name: "publishedAt",
      title: "Published",
      type: "datetime",
      group: "metadata",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated",
      type: "datetime",
      group: "metadata",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Published (newest)",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Title A → Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "heroImage",
      publishedAt: "publishedAt",
    },
    prepare({ title, author, media, publishedAt }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString()
        : undefined;
      return {
        title: title ?? "Untitled post",
        subtitle: [author, date].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
